import { NextRequest, NextResponse } from "next/server";
import { getAddress, isAddress } from "viem";
import type { Address } from "@/lib/allowlist";
import {
  parseFarcasterTokens,
  sanitizeChannelId,
  type FarcasterUserIdentity,
  type ResolvedRecipient,
  type ResolveAllowlistPayload,
  type ResolveAllowlistResponse,
} from "@/lib/farcaster-resolver";

const FETCH_TIMEOUT_MS = 6000;
const MAX_CONCURRENT_REQUESTS = 12;

type WarpcastUserResponse = {
  result?: {
    user?: {
      fid: number;
      username: string;
      displayName: string;
      pfp?: { url: string };
    };
    extras?: {
      custodyAddress?: string;
      ethWallets?: string[];
    };
  };
  errors?: { message: string }[];
};

type WarpcastFollowersResponse = {
  result?: {
    users?: {
      fid: number;
      followedAt: number;
    }[];
  };
  errors?: { message: string }[];
};

async function fetchWithTimeout(url: string, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...(init?.headers || {}),
      },
    });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchUserFromWarpcast(
  queryParam: string
): Promise<FarcasterUserIdentity | null> {
  try {
    const res = await fetchWithTimeout(
      `https://api.warpcast.com/v2/user-${queryParam}`
    );
    if (!res.ok) return null;
    const data = (await res.json()) as WarpcastUserResponse;
    const user = data.result?.user;
    const extras = data.result?.extras;
    if (!user || !extras) return null;

    const verifiedAddresses: Address[] = [];
    if (Array.isArray(extras.ethWallets)) {
      for (const raw of extras.ethWallets) {
        if (isAddress(raw)) {
          verifiedAddresses.push(getAddress(raw));
        }
      }
    }

    let custodyAddress: Address = "0x0000000000000000000000000000000000000000";
    if (extras.custodyAddress && isAddress(extras.custodyAddress)) {
      custodyAddress = getAddress(extras.custodyAddress);
    }

    return {
      fid: user.fid,
      username: user.username,
      displayName: user.displayName,
      pfpUrl: user.pfp?.url,
      custodyAddress,
      verifiedAddresses,
    };
  } catch {
    return null;
  }
}

async function fetchChannelFollowers(
  channelId: string
): Promise<{ fid: number; followedAt: number }[]> {
  try {
    const res = await fetchWithTimeout(
      `https://api.warpcast.com/v1/channel-followers?channelId=${encodeURIComponent(
        channelId
      )}`
    );
    if (!res.ok) return [];
    const data = (await res.json()) as WarpcastFollowersResponse;
    return data.result?.users || [];
  } catch {
    return [];
  }
}

async function runInPool<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];
  const executing: Promise<void>[] = [];

  for (const item of items) {
    const p = Promise.resolve().then(() => fn(item)).then((res) => {
      results.push(res);
    });
    const tracker: Promise<void> = p.then(() => {
      executing.splice(executing.indexOf(tracker), 1);
    });
    executing.push(tracker);
    if (executing.length >= limit) {
      await Promise.race(executing);
    }
  }
  await Promise.all(executing);
  return results;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ResolveAllowlistPayload;
    const {
      identifiers = [],
      channelId,
      beforeTimestamp,
      includeAllVerifiedWallets = true,
    } = body;

    const rawText = identifiers.join("\n");
    const { addresses: directAddresses, usernames, fids, invalid } =
      parseFarcasterTokens(rawText);

    const fidsToResolve = new Set<number>(fids);
    const usernamesToResolve = new Set<string>(usernames);
    const followerTimestamps = new Map<number, number>();

    if (channelId && channelId.trim()) {
      const cleanChannel = sanitizeChannelId(channelId);
      const followers = await fetchChannelFollowers(cleanChannel);
      for (const follower of followers) {
        if (
          beforeTimestamp !== undefined &&
          beforeTimestamp > 0 &&
          follower.followedAt > beforeTimestamp
        ) {
          continue;
        }
        fidsToResolve.add(follower.fid);
        followerTimestamps.set(follower.fid, follower.followedAt);
      }
    }

    const resolved: ResolvedRecipient[] = [];
    const unresolved: { identifier: string; reason: string }[] = [];
    const seenAddresses = new Set<string>();
    const finalAddresses: Address[] = [];
    let duplicatesCount = 0;

    for (const addr of directAddresses) {
      const lower = addr.toLowerCase();
      if (!seenAddresses.has(lower)) {
        seenAddresses.add(lower);
        finalAddresses.push(addr);
        resolved.push({
          identifier: addr,
          address: addr,
          source: "direct",
        });
      } else {
        duplicatesCount += 1;
      }
    }

    for (const badToken of invalid) {
      unresolved.push({
        identifier: badToken,
        reason: "Invalid format (must be an address, @username, or FID)",
      });
    }

    const userMap = new Map<number, FarcasterUserIdentity>();

    if (usernamesToResolve.size > 0) {
      const usernameList = Array.from(usernamesToResolve);
      await runInPool(usernameList, MAX_CONCURRENT_REQUESTS, async (username) => {
        const user = await fetchUserFromWarpcast(`by-username?username=${encodeURIComponent(username)}`);
        if (user) {
          userMap.set(user.fid, user);
        } else {
          unresolved.push({
            identifier: `@${username}`,
            reason: "Farcaster user not found",
          });
        }
      });
    }

    const remainingFids = Array.from(fidsToResolve).filter(
      (fid) => !userMap.has(fid)
    );

    if (remainingFids.length > 0) {
      await runInPool(remainingFids, MAX_CONCURRENT_REQUESTS, async (fid) => {
        const user = await fetchUserFromWarpcast(`by-fid?fid=${fid}`);
        if (user) {
          userMap.set(user.fid, user);
        } else {
          unresolved.push({
            identifier: `fid:${fid}`,
            reason: "FID not found",
          });
        }
      });
    }

    for (const user of userMap.values()) {
      const targets: { address: Address; source: "verified" | "custody" }[] = [];

      if (user.verifiedAddresses.length > 0) {
        if (includeAllVerifiedWallets) {
          for (const vAddr of user.verifiedAddresses) {
            targets.push({ address: vAddr, source: "verified" });
          }
        } else {
          targets.push({ address: user.verifiedAddresses[0]!, source: "verified" });
        }
      } else if (
        user.custodyAddress &&
        user.custodyAddress !== "0x0000000000000000000000000000000000000000"
      ) {
        targets.push({ address: user.custodyAddress, source: "custody" });
      }

      if (targets.length === 0) {
        unresolved.push({
          identifier: `@${user.username}`,
          reason: "No Ethereum wallet or custody address connected",
        });
        continue;
      }

      const followedAt = followerTimestamps.get(user.fid);

      for (const target of targets) {
        const lower = target.address.toLowerCase();
        if (!seenAddresses.has(lower)) {
          seenAddresses.add(lower);
          finalAddresses.push(target.address);
          resolved.push({
            identifier: `@${user.username}`,
            fid: user.fid,
            username: user.username,
            displayName: user.displayName,
            pfpUrl: user.pfpUrl,
            address: target.address,
            source: target.source,
            followedAt,
          });
        } else {
          duplicatesCount += 1;
        }
      }
    }

    const responseData: ResolveAllowlistResponse = {
      resolved,
      unresolved,
      addresses: finalAddresses,
      duplicatesCount,
    };

    return NextResponse.json({ success: true, ...responseData });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to resolve allowlist entries";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

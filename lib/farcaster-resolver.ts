import { getAddress, isAddress } from "viem";
import type { Address } from "./allowlist";

export type FarcasterUserIdentity = {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl?: string;
  custodyAddress: Address;
  verifiedAddresses: Address[];
};

export type ResolvedRecipient = {
  identifier: string;
  fid?: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
  address: Address;
  source: "verified" | "custody" | "direct";
  followedAt?: number;
};

export type ParsedFarcasterInput = {
  addresses: Address[];
  usernames: string[];
  fids: number[];
  invalid: string[];
};

export type ResolveAllowlistPayload = {
  identifiers?: string[];
  channelId?: string;
  beforeTimestamp?: number;
  includeAllVerifiedWallets?: boolean;
};

export type ResolveAllowlistResponse = {
  resolved: ResolvedRecipient[];
  unresolved: { identifier: string; reason: string }[];
  addresses: Address[];
  duplicatesCount: number;
};

/**
 * Parses free text containing mixed Ethereum addresses, Farcaster handles
 * (@alice or alice.eth), and FIDs (fid:123 or raw numbers).
 */
export function parseFarcasterTokens(input: string): ParsedFarcasterInput {
  const tokens = input.split(/[\s,;]+/).filter(Boolean);
  const addresses: Address[] = [];
  const usernames: string[] = [];
  const fids: number[] = [];
  const invalid: string[] = [];

  for (const token of tokens) {
    const trimmed = token.trim();
    if (!trimmed) continue;

    if (isAddress(trimmed)) {
      addresses.push(getAddress(trimmed));
      continue;
    }

    const fidMatch = trimmed.match(/^fid:?(\d+)$/i);
    if (fidMatch && fidMatch[1]) {
      const fidNum = parseInt(fidMatch[1], 10);
      if (fidNum > 0) {
        fids.push(fidNum);
        continue;
      }
    }

    if (/^\d+$/.test(trimmed)) {
      const fidNum = parseInt(trimmed, 10);
      if (fidNum > 0) {
        fids.push(fidNum);
        continue;
      }
    }

    const cleanUsername = trimmed.replace(/^@/, "");
    if (/^[a-zA-Z0-9_.-]{1,64}$/.test(cleanUsername)) {
      usernames.push(cleanUsername.toLowerCase());
      continue;
    }

    invalid.push(trimmed);
  }

  return { addresses, usernames, fids, invalid };
}

/**
 * Normalizes a channel key by stripping leading slashes or channel prefixes.
 */
export function sanitizeChannelId(channelId: string): string {
  return channelId.trim().replace(/^\/+/, "").replace(/^channel\/+/i, "").toLowerCase();
}

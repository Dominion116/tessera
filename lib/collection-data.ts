/**
 * Placeholder collection reads shaped like contract responses, so the
 * chain layer swaps this source for `balanceOf(address)` and
 * `tokenOfOwnerByIndex(address, uint256)` without touching a widget.
 * Token IDs and event IDs are the same number in this contract, so each
 * token joins to its event through the registry, and `method` stands in
 * for what the live version derives from mint logs. Every token's owner
 * is `CONNECTED_ADDRESS`, the one address the mock wallet layer hands
 * out. The mix is deliberate: all four mint routes, soulbound and
 * transferable, this wallet's own events and other creators'.
 *
 * Timestamps are laid out relative to load time, matching the convention
 * in `lib/dashboard-data.ts`.
 */

import { CONNECTED_ADDRESS } from "./dashboard-data";
import type { PoapEvent } from "./poap-data";
import { findPoapEvent } from "./poap-registry";

export type MintMethod = "public" | "allowlist" | "signature" | "airdrop";

export type CollectedToken = {
  tokenId: bigint;
  owner: `0x${string}`;
  method: MintMethod;
  mintedAt: bigint;
};

export type CollectionItem = {
  token: CollectedToken;
  event: PoapEvent;
};

export const MINT_METHOD_LABELS: Record<MintMethod, string> = {
  public: "Public mint",
  allowlist: "Invitation list",
  signature: "Signature",
  airdrop: "Airdrop",
};

const DAY = 86_400;
const NOW = Math.floor(Date.now() / 1000);

const secondsAgo = (days: number) => BigInt(NOW - days * DAY);

const TOKENS: CollectedToken[] = [
  { tokenId: 41n, owner: CONNECTED_ADDRESS, method: "public", mintedAt: secondsAgo(12) },
  { tokenId: 35n, owner: CONNECTED_ADDRESS, method: "airdrop", mintedAt: secondsAgo(6) },
  { tokenId: 27n, owner: CONNECTED_ADDRESS, method: "allowlist", mintedAt: secondsAgo(21) },
  { tokenId: 38n, owner: CONNECTED_ADDRESS, method: "signature", mintedAt: secondsAgo(15) },
  { tokenId: 19n, owner: CONNECTED_ADDRESS, method: "public", mintedAt: secondsAgo(33) },
  { tokenId: 0n, owner: CONNECTED_ADDRESS, method: "public", mintedAt: secondsAgo(45) },
];

export const COLLECTION: CollectionItem[] = TOKENS.flatMap((token) => {
  const event = findPoapEvent(token.tokenId.toString());

  return event ? [{ token, event }] : [];
});

export const COLLECTION_STATS = {
  collected: COLLECTION.length,
  soulbound: COLLECTION.filter((item) => item.event.isSoulbound).length,
  ownEvents: COLLECTION.filter(
    (item) => item.event.creator === CONNECTED_ADDRESS
  ).length,
} as const;

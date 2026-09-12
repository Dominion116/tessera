/**
 * The contract-shaped event type every screen renders, plus the chain
 * constants shared with the landing page and the documentation. Field
 * names and types match `events(uint256)` exactly, with two additions
 * the contract derives per event: `collectors` is `totalSupply(id)` and
 * `artwork` is the raw SVG decoded out of the base64 JSON `uri(id)`
 * returns, the only place image data is reachable.
 */

export type PoapEvent = {
  eventId: bigint;
  name: string;
  description: string;
  eventDate: bigint;
  location: string;
  allowlistRoot: `0x${string}`;
  svgImage: `0x${string}`;
  creator: `0x${string}`;
  createdAt: bigint;
  externalUrl: string;
  isSoulbound: boolean;
  isPublic: boolean;
  collectors: bigint;
  artwork: string;
};

export const ZERO_ROOT =
  "0x0000000000000000000000000000000000000000000000000000000000000000" as const;

export const CONTRACT_ADDRESS =
  "0xC3249356a483fbe17d5355D39105D2eA666d9de6" as const;

export const CHAIN_ID = 84532;

export const CREATOR_TIMELOCK_DAYS = 30;

export const SIGNATURE_WINDOW_DAYS = 37;

export const CREATOR_MINT_BATCH_LIMIT = 101;

/**
 * Artwork ceilings measured against what the deployed contract can
 * actually store. SSTORE2 writes the base64-encoded SVG as the runtime
 * code of one deployed contract, and EIP-170 caps deployed code at
 * 24,576 bytes. The stored encoding is ceil(rawBytes / 3) * 4 plus a
 * one-byte prefix, so the largest raw SVG that can ever register is
 * 18,429 bytes (24,572 stored). Anything larger reverts onchain with
 * `DeploymentFailed` regardless of the gas offered. Verified against
 * the deployed contract on Base Sepolia.
 */
export const SVG_SOFT_LIMIT_BYTES = 16 * 1024;

export const SVG_HARD_LIMIT_BYTES = 18_429;

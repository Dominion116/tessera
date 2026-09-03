/**
 * Placeholder POAPs shaped exactly like `events(uint256)` responses, so the
 * gallery and the artwork tiles can be pointed at the contract later without
 * touching a component. Field names, types and edge cases all match:
 * empty description, missing event date, unset allowlist root, soulbound and
 * transferable, public and invite-only.
 *
 * `svgImage` is the SSTORE2 pointer address the contract returns, and it is
 * never rendered. `artwork` stands in for the base64 SVG that arrives through
 * `uri()`, which is the only place image data is reachable.
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

const tile = (id: string, top: string, bottom: string, label: string) =>
  [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" role="img" aria-label="',
    label,
    '">',
    '<defs><linearGradient id="g',
    id,
    '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="',
    top,
    '"/><stop offset="1" stop-color="',
    bottom,
    '"/></linearGradient></defs>',
    '<rect width="400" height="400" fill="url(#g',
    id,
    ')"/>',
    '<rect x="48" y="48" width="140" height="140" rx="12" fill="#2dd4bf"/>',
    '<rect x="212" y="48" width="140" height="140" rx="12" fill="#f8fafc" fill-opacity="0.22"/>',
    '<rect x="48" y="212" width="140" height="140" rx="12" fill="#f8fafc" fill-opacity="0.22"/>',
    '<rect x="212" y="212" width="140" height="140" rx="12" fill="#2dd4bf"/>',
    '</svg>',
  ].join("");

export const GALLERY_POAPS: PoapEvent[] = [
  {
    eventId: 41n,
    name: "Base Sepolia Builders Night",
    description:
      "Twelve teams shipped a contract to Base Sepolia in one evening. This POAP went to everyone who deployed.",
    eventDate: 1770854400n,
    location: "Lisbon",
    allowlistRoot: ZERO_ROOT,
    svgImage: "0x7Aa3F1b8C0d2E4f6A8b0C2d4E6f8A0b2C4d6E8f0",
    creator: "0x1F4b3C2d1E0f9A8b7C6d5E4f3A2b1C0d9E8f7A6b",
    createdAt: 1770508800n,
    externalUrl: "https://base.org",
    isSoulbound: true,
    isPublic: true,
    collectors: 148n,
    artwork: tile("a", "#0f172a", "#134e4a", "Base Sepolia Builders Night"),
  },
  {
    eventId: 38n,
    name: "Farcaster Devs Meetup 12",
    description:
      "A signature station at the door signed one mint per attendee. No allowlist collected in advance.",
    eventDate: 1770249600n,
    location: "Berlin",
    allowlistRoot: ZERO_ROOT,
    svgImage: "0x5Bc2D0e1F2a3B4c5D6e7F8a9B0c1D2e3F4a5B6c7",
    creator: "0x9C8b7A6d5E4f3A2b1C0d9E8f7A6b5C4d3E2f1A0b",
    createdAt: 1769817600n,
    externalUrl: "https://farcaster.xyz",
    isSoulbound: true,
    isPublic: false,
    collectors: 64n,
    artwork: tile("b", "#111827", "#1e3a8a", "Farcaster Devs Meetup 12"),
  },
  {
    eventId: 33n,
    name: "Onchain Summer Block Party",
    description: "",
    eventDate: 0n,
    location: "",
    allowlistRoot: ZERO_ROOT,
    svgImage: "0x3Da1B2c3D4e5F6a7B8c9D0e1F2a3B4c5D6e7F8a9",
    creator: "0x4E3f2A1b0C9d8E7f6A5b4C3d2E1f0A9b8C7d6E5f",
    createdAt: 1769126400n,
    externalUrl: "",
    isSoulbound: false,
    isPublic: true,
    collectors: 902n,
    artwork: tile("c", "#1c1917", "#7c2d12", "Onchain Summer Block Party"),
  },
  {
    eventId: 27n,
    name: "Solidity Study Group, Week 9: Storage Layout and SSTORE2",
    description:
      "Nine weeks in. The allowlist was the group roster, set after registration so late joiners could be added.",
    eventDate: 1768435200n,
    location: "Remote",
    allowlistRoot:
      "0x6d1f0a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6e7",
    svgImage: "0x8Ef7A6b5C4d3E2f1A0b9C8d7E6f5A4b3C2d1E0f9",
    creator: "0x2B1c0D9e8F7a6B5c4D3e2F1a0B9c8D7e6F5a4B3c",
    createdAt: 1767830400n,
    externalUrl: "https://soliditylang.org",
    isSoulbound: true,
    isPublic: false,
    collectors: 31n,
    artwork: tile("d", "#0c0a09", "#3f3f46", "Solidity Study Group Week 9"),
  },
  {
    eventId: 19n,
    name: "Tessera Mosaic Workshop",
    description:
      "Hand-drawn SVG tiles, optimized down to 6 KB before registration. Transferable, so a tile can be traded.",
    eventDate: 1767139200n,
    location: "Rome",
    allowlistRoot: ZERO_ROOT,
    svgImage: "0x1Cd9E8f7A6b5C4d3E2f1A0b9C8d7E6f5A4b3C2d1",
    creator: "0x7D6e5F4a3B2c1D0e9F8a7B6c5D4e3F2a1B0c9D8e",
    createdAt: 1766620800n,
    externalUrl: "",
    isSoulbound: false,
    isPublic: true,
    collectors: 217n,
    artwork: tile("e", "#0f0f0f", "#4c1d95", "Tessera Mosaic Workshop"),
  },
  {
    eventId: 0n,
    name: "Genesis",
    description:
      "The first POAP, written in the constructor. Event ID zero, and the reason IDs and token IDs are the same number.",
    eventDate: 1764547200n,
    location: "",
    allowlistRoot: ZERO_ROOT,
    svgImage: "0x0Ab1C2d3E4f5A6b7C8d9E0f1A2b3C4d5E6f7A8b9",
    creator: "0x0000000000000000000000000000000000000000",
    createdAt: 1764547200n,
    externalUrl: "",
    isSoulbound: true,
    isPublic: true,
    collectors: 1_284n,
    artwork: tile("f", "#020617", "#0f766e", "Genesis"),
  },
];

/**
 * Placeholder dashboard reads shaped like contract responses, so the chain
 * layer swaps this source for real `events(uint256)`, `totalSupply(uint256)`
 * and log-derived mint counts without touching a widget. `DASHBOARD_EVENTS`
 * reuses `PoapEvent` from `lib/poap-data.ts`, and every event's `creator` is
 * `CONNECTED_ADDRESS`, the one address the mock wallet layer hands out.
 *
 * Timestamps are laid out relative to load time so the deadline arithmetic
 * on the dashboard stays correct while the data is still static. The
 * awkward cases are deliberate: an event whose creator window has passed,
 * an event that will freeze closed, a set allowlist root, an undated event,
 * and an empty location.
 */

import { formatUtcDate } from "./format";
import {
  CREATOR_TIMELOCK_DAYS,
  type PoapEvent,
  SIGNATURE_WINDOW_DAYS,
  ZERO_ROOT,
} from "./poap-data";

export const CONNECTED_ADDRESS =
  "0x4A7d9F2b6C8e1D3a5B7c9E0f2A4d6B8c0E2f4A6d" as const;

const DAY = 86_400;
const NOW = Math.floor(Date.now() / 1000);

const secondsAgo = (days: number) => BigInt(NOW - days * DAY);
const secondsAhead = (days: number) => BigInt(NOW + days * DAY);

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

export const DASHBOARD_EVENTS: PoapEvent[] = [
  {
    eventId: 35n,
    name: "Base AI Hackathon Demo Day",
    description:
      "Twenty-one teams, three minutes each on stage. This badge went to every team that demoed and every wallet that voted.",
    eventDate: secondsAhead(4),
    location: "Boston",
    allowlistRoot: ZERO_ROOT,
    svgImage: "0x2E4f6A8b0C2d4E6f8A0b2C4d6E8f0A2b4C6d8E0f",
    creator: CONNECTED_ADDRESS,
    createdAt: secondsAgo(7),
    externalUrl: "https://base.ai/hackathon",
    isSoulbound: false,
    isPublic: true,
    collectors: 214n,
    artwork: tile("da", "#0f172a", "#0e7490", "Base AI Hackathon Demo Day"),
  },
  {
    eventId: 32n,
    name: "Crypto Cartography Salon",
    description:
      "Maps of money movement, drawn by hand and stored onchain. The invite list was set after registration so the room could be capped late.",
    eventDate: 0n,
    location: "",
    allowlistRoot:
      "0x8a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f9",
    svgImage: "0x6F8a0B2c4D6e8F0a2B4c6D8e0F2a4B6c8D0e2F4a",
    creator: CONNECTED_ADDRESS,
    createdAt: secondsAgo(12),
    externalUrl: "",
    isSoulbound: true,
    isPublic: false,
    collectors: 42n,
    artwork: tile("db", "#111827", "#4c1d95", "Crypto Cartography Salon"),
  },
  {
    eventId: 28n,
    name: "Summer Open Studio",
    description:
      "Open doors all August. The public mint stays open forever because it was open the moment the creator window closed.",
    eventDate: secondsAgo(39),
    location: "Mexico City",
    allowlistRoot: ZERO_ROOT,
    svgImage: "0x9C0d1E2f3A4b5C6d7E8f9A0b1C2d3E4f5A6b7C8d",
    creator: CONNECTED_ADDRESS,
    createdAt: secondsAgo(40),
    externalUrl: "",
    isSoulbound: false,
    isPublic: true,
    collectors: 156n,
    artwork: tile("dc", "#1c1917", "#166534", "Summer Open Studio"),
  },
  {
    eventId: 24n,
    name: "Wallets UX Roundtable",
    description:
      "Six wallet teams around one long table. Public minting never turned on, and the creator window closes tomorrow, so it stays that way.",
    eventDate: secondsAgo(11),
    location: "Berlin",
    allowlistRoot: ZERO_ROOT,
    svgImage: "0x3B4c5D6e7F8a9B0c1D2e3F4a5B6c7D8e9F0a1B2c",
    creator: CONNECTED_ADDRESS,
    createdAt: secondsAgo(29),
    externalUrl: "https://example.com/roundtable",
    isSoulbound: true,
    isPublic: false,
    collectors: 33n,
    artwork: tile("dd", "#0f172a", "#1e3a8a", "Wallets UX Roundtable"),
  },
  {
    eventId: 17n,
    name: "Farcaster Frames Launch Party",
    description:
      "Every frame shipped that night earned its maker a tile. The venue was a cast, and so was the mint.",
    eventDate: secondsAgo(34),
    location: "Remote",
    allowlistRoot: ZERO_ROOT,
    svgImage: "0x7D8e9F0a1B2c3D4e5F6a7B8c9D0e1F2a3B4c5D6e",
    creator: CONNECTED_ADDRESS,
    createdAt: secondsAgo(34),
    externalUrl: "https://farcaster.xyz",
    isSoulbound: false,
    isPublic: true,
    collectors: 911n,
    artwork: tile("de", "#0c0a09", "#312e81", "Farcaster Frames Launch Party"),
  },
];

export type MintDay = { date: string; mints: number };

/**
 * Mints per day, 30 days back. Deterministic: a slow climb, a weekend dip
 * and one spike, so the shape reads like a real event calendar instead of
 * noise. The spike is the hackathon demo day.
 */
export const MINT_ACTIVITY: MintDay[] = Array.from({ length: 30 }, (_, i) => {
  const when = NOW - (29 - i) * DAY;
  const weekday = new Date(when * 1000).getUTCDay();
  const weekendDip = weekday === 0 || weekday === 6 ? -6 : 0;
  const spike = i === 22 ? 74 : 0;
  const mints = Math.max(4, Math.round(18 + i * 0.9 + weekendDip + spike));
  const [day, month] = formatUtcDate(when).split(" ");

  return { date: `${day} ${month}`, mints };
});

export type MintRoute = {
  route: "public" | "allowlist" | "signature" | "airdrop";
  mints: number;
};

export const MINT_ROUTE_MIX: MintRoute[] = [
  { route: "public", mints: 789 },
  { route: "allowlist", mints: 342 },
  { route: "signature", mints: 156 },
  { route: "airdrop", mints: 69 },
];

export const TOTAL_MINTS = MINT_ROUTE_MIX.reduce(
  (total, route) => total + route.mints,
  0
);

const CREATOR_WINDOW_SECONDS = CREATOR_TIMELOCK_DAYS * DAY;
const SIGNATURE_WINDOW_SECONDS = SIGNATURE_WINDOW_DAYS * DAY;

/** Day-30 deadline: creator controls freeze, measured from registration. */
export function freezeDeadline(event: PoapEvent): number {
  return Number(event.createdAt) + CREATOR_WINDOW_SECONDS;
}

/** Day-37 deadline: signature mints end, measured from registration. */
export function signatureDeadline(event: PoapEvent): number {
  return Number(event.createdAt) + SIGNATURE_WINDOW_SECONDS;
}

/** Whole days from now until a deadline; zero or negative once reached. */
export function daysUntil(unixSeconds: number): number {
  return Math.floor((unixSeconds - NOW) / DAY);
}

/** Elapsed fraction of the 37-day signature window, clamped to 0..1. */
export function signatureWindowElapsed(event: PoapEvent): number {
  const elapsed = NOW - Number(event.createdAt);

  return Math.min(1, Math.max(0, elapsed / SIGNATURE_WINDOW_SECONDS));
}

export type FreezeRow = {
  event: PoapEvent;
  freezeAt: number;
  daysLeft: number;
  /** The public-mint state that will freeze in place, which is what sticks. */
  freezesOpen: boolean;
};

/** Events whose day-30 freeze lands within `withinDays`, soonest first. */
export function upcomingFreezes(withinDays: number): FreezeRow[] {
  return DASHBOARD_EVENTS.map((event) => {
    const freezeAt = freezeDeadline(event);

    return {
      event,
      freezeAt,
      daysLeft: daysUntil(freezeAt),
      freezesOpen: event.isPublic,
    };
  })
    .filter((row) => row.daysLeft >= 0 && row.daysLeft <= withinDays)
    .sort((a, b) => a.daysLeft - b.daysLeft);
}

export function nearestFreeze(): FreezeRow | null {
  return upcomingFreezes(CREATOR_TIMELOCK_DAYS)[0] ?? null;
}

export const DASHBOARD_STATS = {
  created: DASHBOARD_EVENTS.length,
  collectors: DASHBOARD_EVENTS.reduce(
    (total, event) => total + Number(event.collectors),
    0
  ),
  openForPublicMint: DASHBOARD_EVENTS.filter((event) => event.isPublic)
    .length,
  freezesWithin7Days: upcomingFreezes(7).length,
} as const;

/**
 * Deadline arithmetic shared by the dashboard and the created list. All
 * windows are measured from `events(id).createdAt`, the block timestamp
 * of registration, not from `eventDate`.
 */

import {
  CREATOR_TIMELOCK_DAYS,
  type PoapEvent,
  SIGNATURE_WINDOW_DAYS,
} from "./poap-data";

const DAY = 86_400;

export const CREATOR_WINDOW_SECONDS = CREATOR_TIMELOCK_DAYS * DAY;
export const SIGNATURE_WINDOW_SECONDS = SIGNATURE_WINDOW_DAYS * DAY;

/** Day-30 deadline: creator controls freeze, measured from registration. */
export function freezeDeadline(event: PoapEvent): number {
  return Number(event.createdAt) + CREATOR_WINDOW_SECONDS;
}

/** Day-37 deadline: signature mints end, measured from registration. */
export function signatureDeadline(event: PoapEvent): number {
  return Number(event.createdAt) + SIGNATURE_WINDOW_SECONDS;
}

/** Whole days from now until a deadline; zero or negative once reached. */
export function daysUntil(unixSeconds: number, now = Date.now() / 1000): number {
  return Math.floor((unixSeconds - now) / DAY);
}

/** Elapsed fraction of the 37-day signature window, clamped to 0..1. */
export function signatureWindowElapsed(event: PoapEvent, now = Date.now() / 1000): number {
  const elapsed = now - Number(event.createdAt);
  return Math.min(1, Math.max(0, elapsed / SIGNATURE_WINDOW_SECONDS));
}

export type FreezeRow = {
  event: PoapEvent;
  freezeAt: number;
  daysLeft: number;
  /** The public-mint state that will freeze in place, which is what sticks. */
  freezesOpen: boolean;
};

/** Rows for events whose day-30 freeze lands within `withinDays`, soonest first. */
export function upcomingFreezes(
  events: PoapEvent[],
  withinDays: number,
  now = Date.now() / 1000
): FreezeRow[] {
  return events
    .map((event) => {
      const freezeAt = freezeDeadline(event);
      return {
        event,
        freezeAt,
        daysLeft: daysUntil(freezeAt, now),
        freezesOpen: event.isPublic,
      };
    })
    .filter((row) => row.daysLeft >= 0 && row.daysLeft <= withinDays)
    .sort((a, b) => a.daysLeft - b.daysLeft);
}

export function nearestFreeze(
  events: PoapEvent[],
  now = Date.now() / 1000
): FreezeRow | null {
  return upcomingFreezes(events, CREATOR_TIMELOCK_DAYS, now)[0] ?? null;
}

import { describe, expect, it } from "vitest";
import { daysUntil, freezeDeadline, signatureDeadline, upcomingFreezes } from "@/lib/deadlines";
import type { PoapEvent } from "@/lib/poap-data";

const event = (id: bigint, createdAt: bigint, isPublic: boolean): PoapEvent => ({
  eventId: id,
  name: `Event ${id}`,
  description: "",
  eventDate: 0n,
  location: "",
  allowlistRoot: `0x${"00".repeat(32)}`,
  svgImage: `0x${"00".repeat(20)}`,
  creator: `0x${"11".repeat(20)}`,
  createdAt,
  externalUrl: "",
  isSoulbound: true,
  isPublic,
  collectors: 0n,
  artwork: "<svg />",
});

describe("POAP deadlines", () => {
  it("derives freeze and signature deadlines from registration time", () => {
    const value = event(1n, 1_000n, true);
    expect(freezeDeadline(value)).toBe(2_593_000);
    expect(signatureDeadline(value)).toBe(3_197_800);
  });

  it("clamps elapsed days at the reached deadline", () => {
    expect(daysUntil(1_000, 1_000)).toBe(0);
    expect(daysUntil(1_000, 1_000 + 86_400 * 2)).toBe(-2);
  });

  it("returns freeze rows in soonest-first order", () => {
    const rows = upcomingFreezes([
      event(1n, 1_000n, false),
      event(2n, 1_000n - 86_400n, true),
    ], 30, 1_000);
    expect(rows.map((row) => row.event.eventId)).toEqual([2n, 1n]);
    expect(rows[0]?.freezesOpen).toBe(true);
  });
});

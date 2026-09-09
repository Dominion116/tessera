/**
 * The one lookup seam for event pages and claim routes. The gallery and
 * the dashboard each hold a slice of the same contract table, so this
 * module merges both placeholder sources behind `findPoapEvent`. When
 * the chain layer lands, this is the single place that swaps for
 * `events(uint256)` reads.
 */

import { DASHBOARD_EVENTS } from "./dashboard-data";
import { GALLERY_POAPS, type PoapEvent } from "./poap-data";

export const ALL_POAP_EVENTS: PoapEvent[] = [
  ...GALLERY_POAPS,
  ...DASHBOARD_EVENTS,
];

export function findPoapEvent(id: string): PoapEvent | undefined {
  return ALL_POAP_EVENTS.find((event) => event.eventId.toString() === id);
}

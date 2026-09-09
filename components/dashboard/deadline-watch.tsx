"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import LifecycleTimeline, { type Milestone } from "@/components/lifecycle-timeline";
import { formatCount, formatUtcDate } from "@/lib/format";
import {
  nearestFreeze,
  signatureDeadline,
  upcomingFreezes,
  type FreezeRow,
} from "@/lib/deadlines";
import {
  CREATOR_TIMELOCK_DAYS,
  type PoapEvent,
  SIGNATURE_WINDOW_DAYS,
} from "@/lib/poap-data";

const daysLabel = (days: number) => {
  if (days <= 0) {
    return "Freezes today";
  }

  return `${days} ${days === 1 ? "day" : "days"}`;
};

const milestonesFor = (nearest: FreezeRow): Milestone[] => [
  {
    day: "Day 0",
    label: "Registered",
    title: nearest.event.name,
    body: `Registered ${formatUtcDate(nearest.event.createdAt)} with ${formatCount(
      Number(nearest.event.collectors)
    )} collectors so far.`,
    at: 0,
  },
  {
    day: `Day ${CREATOR_TIMELOCK_DAYS}`,
    label: "Creator controls freeze",
    title: formatUtcDate(nearest.freezeAt),
    body: "Public mint, the allowlist and batch drops lock for good on this date.",
    warning: nearest.freezesOpen
      ? "Public minting is on and stays on after the freeze."
      : "Public minting is off and freezes off. Turn it on before this date if anyone should be able to mint.",
    at: CREATOR_TIMELOCK_DAYS / SIGNATURE_WINDOW_DAYS,
  },
  {
    day: `Day ${SIGNATURE_WINDOW_DAYS}`,
    label: "Door codes end",
    title: formatUtcDate(signatureDeadline(nearest.event)),
    body: "Signature mints stop. Allowlist and public minting carry on with no end date.",
    at: 1,
  },
];

/**
 * The nearest day-30 freeze on the shared lifecycle timeline, plus the other
 * approaching deadlines as a compact list, mapped from the template's side
 * widget. The warning box states which way the public-mint flag freezes,
 * because that is the one setting that never comes back.
 */
const DeadlineWatch = ({
  events,
  loading,
}: {
  events: PoapEvent[];
  loading: boolean;
}) => {
  const nearest = nearestFreeze(events);
  const others = upcomingFreezes(events, CREATOR_TIMELOCK_DAYS).filter(
    (row) => row.event.eventId !== nearest?.event.eventId
  );

  return (
    <div className="col-span-12 flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">Deadline watch</h2>
        <p className="text-sm text-fg-secondary">
          Creator controls freeze {CREATOR_TIMELOCK_DAYS} days after
          registration. The nearest one, on the timeline it runs on.
        </p>
      </header>

      {loading ? (
        <Card className="dashboard-panel gap-4 py-5">
          <CardContent className="flex flex-col gap-3">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      ) : nearest ? (
        <LifecycleTimeline milestones={milestonesFor(nearest)} />
      ) : (
        <Card className="dashboard-panel py-5">
          <CardHeader>
            <CardTitle>Nothing freezes soon</CardTitle>
            <CardDescription>
              No day-{CREATOR_TIMELOCK_DAYS} deadline lands in the next{" "}
              {CREATOR_TIMELOCK_DAYS} days.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <Card className="dashboard-panel py-5">
        <CardHeader>
          <CardTitle>Other approaching freezes</CardTitle>
          <CardDescription>
            Day-{CREATOR_TIMELOCK_DAYS} deadlines after the one above, soonest
            first.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {loading ? (
            Array.from({ length: 2 }, (_, index) => (
              <Skeleton key={index} className="h-16 w-full rounded-lg" />
            ))
          ) : others.length === 0 ? (
            <p className="rounded-lg border border-border/70 px-4 py-3 text-sm text-fg-secondary">
              Nothing else freezes in the next {CREATOR_TIMELOCK_DAYS} days.
            </p>
          ) : (
            others.map((row) => (
              <div
                key={String(row.event.eventId)}
                className="flex items-center justify-between gap-4 rounded-lg border border-border/70 px-4 py-3 transition-colors duration-180 hover:border-teal-400/30 hover:bg-teal-400/[0.04]"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {row.event.name}
                  </p>
                  <p className="text-xs text-fg-tertiary">
                    Creator controls freeze {formatUtcDate(row.freezeAt)}
                  </p>
                </div>
                <Badge variant="accent" className="shrink-0 tabular-nums">
                  {daysLabel(row.daysLeft)}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DeadlineWatch;

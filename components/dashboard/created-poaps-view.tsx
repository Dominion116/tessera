"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  MapPin,
  RefreshCw,
  Stamp,
  Users,
  WifiOff,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCount, formatUtcDate, svgToDataUrl } from "@/lib/format";
import { useWallet } from "@/components/wallet/wallet-provider";
import { useCreatedEvents } from "@/hooks/use-poap-reads";
import { daysUntil, freezeDeadline, signatureDeadline } from "@/lib/deadlines";
import {
  CREATOR_TIMELOCK_DAYS,
  type PoapEvent,
  ZERO_ROOT,
} from "@/lib/poap-data";

const CreatedEventRow = ({ event }: { event: PoapEvent }) => {
  const freezeAt = freezeDeadline(event);
  const daysLeft = daysUntil(freezeAt);
  const frozen = daysLeft < 0;
  const signatureEnd = signatureDeadline(event);
  const signatureOpen = daysUntil(signatureEnd) >= 0;

  return (
    <Card className="dashboard-panel col-span-12 py-5">
      <CardContent className="grid items-start gap-4 md:grid-cols-[minmax(0,1fr)_13rem] md:gap-6">
        <Link
          href={`/poaps/${event.eventId.toString()}`}
          className="group flex min-w-0 items-start gap-4 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-400"
        >
          {/* Inline SVG data URL, which next/image cannot optimize. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={svgToDataUrl(event.artwork)}
            alt=""
            width={56}
            height={56}
            loading="lazy"
            decoding="async"
            className="size-14 shrink-0 rounded-lg border border-border/70"
          />
          <div className="flex min-w-0 flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-semibold tracking-tight transition-colors duration-180 group-hover:text-teal-600 dark:group-hover:text-teal-300">
                {event.name}
              </h2>
              <Badge variant="outline" className="tabular-nums">
                #{event.eventId.toString()}
              </Badge>
              <ArrowUpRight
                aria-hidden="true"
                className="size-3.5 shrink-0 text-fg-tertiary transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-teal-600 dark:group-hover:text-teal-300"
              />
            </div>
            <p className="text-xs text-fg-tertiary">
              Registered {formatUtcDate(event.createdAt)}
            </p>
            {event.description ? (
              <p className="line-clamp-2 text-sm leading-6 text-fg-secondary">
                {event.description}
              </p>
            ) : null}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-fg-secondary">
              <span className="flex items-center gap-1.5">
                <CalendarDays
                  aria-hidden="true"
                  className="size-3.5 text-fg-tertiary"
                />
                {event.eventDate === 0n
                  ? "Date not set"
                  : formatUtcDate(event.eventDate)}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin aria-hidden="true" className="size-3.5 text-fg-tertiary" />
                {event.location || "Location not set"}
              </span>
              <span className="flex items-center gap-1.5 tabular-nums">
                <Users aria-hidden="true" className="size-3.5 text-fg-tertiary" />
                {formatCount(event.collectors)} collectors
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant={event.isPublic ? "accent" : "outline"}>
                {event.isPublic ? "Public mint" : "Invite only"}
              </Badge>
              <Badge variant="outline">
                {event.isSoulbound ? "Soulbound" : "Transferable"}
              </Badge>
              {event.allowlistRoot !== ZERO_ROOT ? (
                <Badge variant="outline">Invitation list</Badge>
              ) : null}
            </div>
          </div>
        </Link>
        <div className="flex flex-col gap-2 border-t border-border/70 pt-4 md:border-t-0 md:border-l md:pt-0 md:pl-6">
          <p className="text-[11px] font-medium tracking-[0.14em] text-fg-tertiary uppercase">
            Day {CREATOR_TIMELOCK_DAYS} freeze
          </p>
          <Badge
            variant={frozen ? "outline" : "accent"}
            className="w-fit tabular-nums"
          >
            {frozen
              ? "Frozen"
              : daysLeft === 0
                ? "Freezes today"
                : `${daysLeft} ${daysLeft === 1 ? "day" : "days"}`}
          </Badge>
          <p className="text-xs leading-5 text-fg-secondary">
            {frozen
              ? `Creator controls locked ${formatUtcDate(freezeAt)}.`
              : `Creator controls freeze ${formatUtcDate(freezeAt)}.`}
          </p>
          {frozen ? (
            <p className="text-xs leading-5 text-fg-tertiary">
              {event.isPublic
                ? "Public mint stays open."
                : "Public mint stays closed."}
            </p>
          ) : null}
          {signatureOpen ? (
            <p className="text-xs leading-5 text-fg-tertiary">
              Signature mints end {formatUtcDate(signatureEnd)}.
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};

const CreatedRowSkeleton = () => (
  <Card className="dashboard-panel col-span-12 py-5">
    <CardContent className="flex items-start gap-4">
      <Skeleton className="size-14 rounded-lg" />
      <div className="flex w-full flex-col gap-2">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-3.5 w-1/3" />
        <Skeleton className="h-4 w-full" />
      </div>
    </CardContent>
  </Card>
);

/**
 * The "POAPs I created" view embedded in the dashboard shell. One row per
 * event this wallet registered, newest first: metadata and mint state on
 * the left, the day-30 freeze on the right via the shared deadline
 * helpers. Rows link out to the public event page.
 */
const CreatedPoapsView = () => {
  const { address } = useWallet();
  const { events, isLoading, isError, refetch } = useCreatedEvents(address);

  const stats = useMemo(
    () => ({
      created: events.length,
      collectors: events.reduce(
        (total, event) => total + Number(event.collectors),
        0
      ),
      openForPublicMint: events.filter((event) => event.isPublic).length,
    }),
    [events]
  );

  return (
    <div className="dashboard-page mx-auto grid w-full max-w-7xl grid-cols-12 gap-6 p-6">
      <header className="col-span-12 flex flex-col gap-2 border-b border-border/60 pb-5">
        <p className="flex items-center gap-2 text-xs font-medium tracking-[0.16em] text-teal-600 uppercase dark:text-teal-300">
          <Stamp aria-hidden="true" className="size-3.5" />
          Creator library
        </p>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          POAPs I created
        </h1>
        <p className="max-w-xl text-sm leading-6 text-fg-secondary">
          Every event registered by this wallet, newest first: artwork, mint
          state, collectors, and the deadline each one freezes on.
        </p>
        {!isLoading ? (
          <div className="mt-1 flex flex-wrap gap-2">
            <Badge variant="outline" className="tabular-nums">
              {stats.created} events
            </Badge>
            <Badge variant="outline" className="tabular-nums">
              {formatCount(stats.collectors)} collectors
            </Badge>
            <Badge variant="outline" className="tabular-nums">
              {stats.openForPublicMint} open for public mint
            </Badge>
          </div>
        ) : null}
      </header>

      {isError ? (
        <Card className="dashboard-panel col-span-12 py-5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <WifiOff aria-hidden="true" className="size-4 text-fg-tertiary" />
              Your events could not be read
            </CardTitle>
            <CardDescription>
              The Base Sepolia connection dropped while reading the contract.
              Nothing was lost; try again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button type="button" variant="outline" onClick={() => refetch()}>
              <RefreshCw aria-hidden="true" />
              Try again
            </Button>
          </CardContent>
        </Card>
      ) : isLoading ? (
        Array.from({ length: 3 }, (_, index) => <CreatedRowSkeleton key={index} />)
      ) : events.length > 0 ? (
        events.map((event) => (
          <CreatedEventRow key={event.eventId.toString()} event={event} />
        ))
      ) : (
        <Card className="dashboard-panel col-span-12 py-5">
          <CardHeader>
            <CardTitle>Nothing created yet</CardTitle>
            <CardDescription>
              POAPs registered by this wallet appear here alongside their freeze
              dates.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
};

export default CreatedPoapsView;

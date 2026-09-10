"use client";

import { useMemo, useState } from "react";
import { Compass, RefreshCw, SearchX, WifiOff } from "lucide-react";
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
import ExploreCard from "@/components/explore/explore-card";
import ExploreSearch from "@/components/explore/explore-search";
import { useEventsPage, useExploreSearchIndex } from "@/hooks/use-poap-reads";
import { type PoapEvent } from "@/lib/poap-data";

const PAGE_SIZE = 6;

const ExploreSkeleton = () => (
  <div className="col-span-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: PAGE_SIZE }, (_, index) => (
      <Card key={index} className="dashboard-panel gap-0 overflow-hidden py-0">
        <Skeleton className="aspect-square w-full rounded-none" />
        <CardContent className="flex flex-col gap-4 p-5">
          <Skeleton className="h-6 w-3/4" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/5" />
          </div>
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    ))}
  </div>
);

/** Case-insensitive term match against the fields a visitor would recall. */
const eventMatchesTerm = (event: PoapEvent, term: string) =>
  [event.name, event.description, event.location, event.externalUrl].some(
    (field) => field.toLowerCase().includes(term)
  ) || event.eventId.toString().includes(term.replace(/^#/, ""));

const ErrorCard = ({ refetch, pending = false }: { refetch: () => void; pending?: boolean }) => (
  <Card className="dashboard-panel col-span-12 py-5">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <WifiOff aria-hidden="true" className="size-4 text-fg-tertiary" />
        The gallery could not be read
      </CardTitle>
      <CardDescription>
        The Base Sepolia connection dropped while reading the contract.
        Nothing was lost; try again.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Button type="button" variant="outline" disabled={pending} aria-busy={pending} onClick={refetch}>
        <RefreshCw aria-hidden="true" />
        {pending ? "Reading..." : "Try again"}
      </Button>
    </CardContent>
  </Card>
);

/**
 * The Explore view embedded in the dashboard shell. Each page of the
 * gallery is one Multicall3 round trip over the newest registered
 * events, so browsing stays in place without leaving /app, and the
 * pagination counts live off `totalEvents()`. A search query switches
 * the gallery to the full event index: every registered event is read
 * once (bounded, cached for the session) and filtered in the browser,
 * because the contract exposes no onchain text search.
 */
const DashboardExploreView = () => {
  const [requestedPage, setPage] = useState(1);
  const [input, setInput] = useState("");
  const term = input.trim().toLowerCase();
  const searching = term.length > 0;

  const { events, pageCount, page, isLoading, isFetching, isError, refetch } =
    useEventsPage(requestedPage, PAGE_SIZE);

  const searchIndex = useExploreSearchIndex(searching);
  const allEvents = searchIndex.data;

  const results = useMemo(
    () =>
      searching && allEvents
        ? allEvents.filter((event) => eventMatchesTerm(event, term))
        : [],
    [searching, allEvents, term]
  );

  const queryShown = input.trim();

  return (
    <div className="dashboard-page mx-auto grid w-full max-w-7xl grid-cols-12 gap-6 p-6">
      <header className="col-span-12 flex flex-col gap-4 border-b border-border/60 pb-5">
        <div className="flex flex-col gap-2">
          <p className="flex items-center gap-2 text-xs font-medium tracking-[0.16em] text-teal-600 uppercase dark:text-teal-300">
            <Compass aria-hidden="true" className="size-3.5" />
            Explore
          </p>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            POAPs made for being there
          </h1>
          <p className="max-w-xl text-sm leading-6 text-fg-secondary">
            Browse registered events, inspect their artwork and metadata, and
            verify collector counts without leaving your dashboard.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <ExploreSearch
            value={input}
            onValueChange={setInput}
            className="w-full max-w-xl"
          />
          {searching ? (
            <p className="text-xs text-fg-tertiary" aria-live="polite">
              {allEvents
                ? `${results.length} ${results.length === 1 ? "event" : "events"} match "${queryShown}" across ${allEvents.length} ${allEvents.length === 1 ? "registered event" : "registered events"}.`
                : "Reading every registered event to search them. First search reads the whole gallery once; later searches are instant."}
            </p>
          ) : null}
        </div>
      </header>

      {searching ? (
        searchIndex.isError && !allEvents ? (
            <ErrorCard refetch={() => void searchIndex.refetch()} pending={searchIndex.isFetching} />
        ) : searchIndex.isLoading && !allEvents ? (
          <ExploreSkeleton />
        ) : allEvents && allEvents.length === 0 ? (
          <Card className="dashboard-panel col-span-12 py-5">
            <CardHeader>
              <CardTitle>No events registered yet</CardTitle>
              <CardDescription>
                The contract has no registered POAPs to browse. Creating the
                first one takes a name and one picture.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : results.length > 0 ? (
          <div className="col-span-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((event, index) => (
              <div
                key={event.eventId.toString()}
                className="animate-[dashboard-enter_220ms_ease-out_both]"
                style={{ animationDelay: `${index * 45}ms` }}
              >
                <ExploreCard event={event} />
              </div>
            ))}
          </div>
        ) : (
          <Card className="dashboard-panel col-span-12 py-5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SearchX aria-hidden="true" className="size-4 text-fg-tertiary" />
                No events match your search
              </CardTitle>
              <CardDescription>
                Nothing registered on Base Sepolia matches &quot;{queryShown}
                &quot;. Try a shorter name, a place, or an event number.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button type="button" variant="outline" onClick={() => setInput("")}>
                <RefreshCw aria-hidden="true" />
                Clear search
              </Button>
            </CardContent>
          </Card>
        )
      ) : isError ? (
         <ErrorCard refetch={() => void refetch()} pending={isFetching} />
      ) : isLoading ? (
        <ExploreSkeleton />
      ) : events.length === 0 ? (
        <Card className="dashboard-panel col-span-12 py-5">
          <CardHeader>
            <CardTitle>No events registered yet</CardTitle>
            <CardDescription>
              The contract has no registered POAPs to browse. Creating the
              first one takes a name and one picture.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="col-span-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event, index) => (
            <div
              key={event.eventId.toString()}
              className="animate-[dashboard-enter_220ms_ease-out_both]"
              style={{ animationDelay: `${index * 45}ms` }}
            >
              <ExploreCard event={event} />
            </div>
          ))}
        </div>
      )}

      {!searching && pageCount > 1 && !isError ? (
        <nav
          aria-label="Embedded Explore pagination"
          className="col-span-12 flex items-center justify-between border-t border-border/70 pt-6"
        >
          <button
            type="button"
            disabled={page === 1 || isFetching}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            className="press rounded-md px-3 py-2 text-sm text-fg-secondary outline-none transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-teal-400"
          >
            Previous
          </button>
          <Badge variant="outline" className="tabular-nums">
            {isFetching ? `Page ${page} of ${pageCount}, reading` : `Page ${page} of ${pageCount}`}
          </Badge>
          <button
            type="button"
            disabled={page === pageCount || isFetching}
            onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
            className="press rounded-md px-3 py-2 text-sm text-fg-secondary outline-none transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-teal-400"
          >
            Next
          </button>
        </nav>
      ) : null}
    </div>
  );
};

export default DashboardExploreView;

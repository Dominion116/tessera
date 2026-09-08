"use client";

import { useState } from "react";
import { Compass } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ExploreCard from "@/components/explore/explore-card";
import { GALLERY_POAPS } from "@/lib/poap-data";

const PAGE_SIZE = 6;

/**
 * The Explore view embedded in the dashboard shell. Pagination stays in
 * local state so selecting Explore never changes the /app URL or remounts
 * the wallet-gated application.
 */
const DashboardExploreView = () => {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(GALLERY_POAPS.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const events = GALLERY_POAPS.slice(start, start + PAGE_SIZE);

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
      </header>

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

      {pageCount > 1 ? (
        <nav
          aria-label="Embedded Explore pagination"
          className="col-span-12 flex items-center justify-between border-t border-border/70 pt-6"
        >
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            className="press rounded-md px-3 py-2 text-sm text-fg-secondary outline-none transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-teal-400"
          >
            Previous
          </button>
          <Badge variant="outline" className="tabular-nums">
            Page {page} of {pageCount}
          </Badge>
          <button
            type="button"
            disabled={page === pageCount}
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

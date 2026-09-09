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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCount, formatUtcDate, svgToDataUrl } from "@/lib/format";
import { type PoapEvent, ZERO_ROOT } from "@/lib/poap-data";

/**
 * Your events, mapped from the template's top product table: name, event
 * date, collectors, mint status, allowlist. Rows without a date or a
 * location still read, because the contract allows both to be empty.
 * Artwork is the SVG `uri()` returns, decoded to a data URL.
 */
const EventsTable = ({
  events,
  loading,
}: {
  events: PoapEvent[];
  loading: boolean;
}) => (
  <Card className="dashboard-panel col-span-12 gap-4 py-5">
    <CardHeader>
      <CardTitle>Your events</CardTitle>
      <CardDescription>
        The POAPs registered by this wallet, newest first.
      </CardDescription>
    </CardHeader>
    <CardContent>
      {loading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="flex items-center gap-3 px-1 py-2.5">
              <Skeleton className="size-8 rounded-lg" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <p className="rounded-lg border border-border/70 px-4 py-6 text-center text-sm text-fg-secondary">
          No POAPs registered by this wallet yet. Creating the first one
          takes a name and one picture.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Event date</TableHead>
              <TableHead className="text-right">Collectors</TableHead>
              <TableHead>Mint</TableHead>
              <TableHead>Allowlist</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow
                key={String(event.eventId)}
                className="transition-colors duration-180 hover:bg-teal-400/[0.04]"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    {/* Inline SVG data URL, which next/image cannot optimize. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={svgToDataUrl(event.artwork)}
                      alt=""
                      width={32}
                      height={32}
                      className="size-8 shrink-0 rounded-lg border border-border/70"
                    />
                    <span className="font-medium">{event.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-fg-secondary">
                  {event.eventDate === 0n
                    ? "No date set"
                    : formatUtcDate(event.eventDate)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCount(event.collectors)}
                </TableCell>
                <TableCell>
                  <Badge variant={event.isPublic ? "accent" : "outline"}>
                    {event.isPublic ? "Open" : "Closed"}
                  </Badge>
                </TableCell>
                <TableCell
                  className={
                    event.allowlistRoot === ZERO_ROOT ? "text-fg-tertiary" : ""
                  }
                >
                  {event.allowlistRoot === ZERO_ROOT ? "None" : "Set"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </CardContent>
  </Card>
);

export default EventsTable;

import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCount, formatUtcDate, svgToDataUrl } from "@/lib/format";
import { type PoapEvent, ZERO_ROOT } from "@/lib/poap-data";

const ExploreCard = ({ event }: { event: PoapEvent }) => (
  <Card className="group overflow-hidden border-border/70 bg-card/65 py-0 shadow-[inset_0_1px_0_oklch(1_0_0_/_6%),0_8px_24px_oklch(0_0_0_/_4%)] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-teal-400/35 hover:shadow-[inset_0_1px_0_oklch(1_0_0_/_8%),0_12px_28px_oklch(0_0_0_/_8%)]">
    <Link
      href={`/poaps/${event.eventId.toString()}`}
      className="block outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-400"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        {/* Onchain SVG stand-in, kept as an inline data URL for the placeholder source. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={svgToDataUrl(event.artwork)}
          alt={event.name}
          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.025]"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <Badge variant="outline" className="border-background/30 bg-background/85 text-foreground backdrop-blur-md">
            #{event.eventId.toString()}
          </Badge>
          <Badge variant={event.isPublic ? "accent" : "outline"} className="bg-background/85 backdrop-blur-md">
            {event.isPublic ? "Open" : "Closed"}
          </Badge>
        </div>
      </div>
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="line-clamp-2 text-lg font-semibold tracking-tight">{event.name}</h2>
          <ArrowUpRight aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-fg-tertiary transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-teal-600 dark:group-hover:text-teal-300" />
        </div>
        <div className="grid gap-2 text-sm text-fg-secondary">
          <span className="flex items-center gap-2">
            <CalendarDays aria-hidden="true" className="size-4 text-fg-tertiary" />
            {event.eventDate === 0n ? "Date not set" : formatUtcDate(event.eventDate)}
          </span>
          <span className="flex items-center gap-2">
            <MapPin aria-hidden="true" className="size-4 text-fg-tertiary" />
            {event.location || "Location not set"}
          </span>
          <span className="flex items-center gap-2">
            <Users aria-hidden="true" className="size-4 text-fg-tertiary" />
            <span className="tabular-nums">{formatCount(event.collectors)}</span> collectors
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-border/70 pt-3 text-xs text-fg-tertiary">
          <span>{event.allowlistRoot === ZERO_ROOT ? "Open access" : "Invitation list"}</span>
          <span>{event.isSoulbound ? "Bound to wallet" : "Transferable"}</span>
        </div>
      </CardContent>
    </Link>
  </Card>
);

export default ExploreCard;

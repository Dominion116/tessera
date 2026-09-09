import Link from "next/link";
import { Album, ArrowUpRight, CalendarDays, Fingerprint } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  formatCount,
  formatUtcDate,
  shortAddress,
  svgToDataUrl,
} from "@/lib/format";
import { CONNECTED_ADDRESS } from "@/lib/dashboard-data";
import {
  COLLECTION,
  COLLECTION_STATS,
  MINT_METHOD_LABELS,
  type CollectionItem,
} from "@/lib/collection-data";

const CollectionCard = ({ item }: { item: CollectionItem }) => {
  const { token, event } = item;

  return (
    <Card className="group overflow-hidden border-border/70 bg-card/65 py-0 shadow-[inset_0_1px_0_oklch(1_0_0_/_6%),0_8px_24px_oklch(0_0_0_/_4%)] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-teal-400/35 hover:shadow-[inset_0_1px_0_oklch(1_0_0_/_8%),0_12px_28px_oklch(0_0_0_/_8%)]">
      <Link
        href={`/poaps/${event.eventId.toString()}`}
        className="block outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-400"
      >
        <div className="relative aspect-square overflow-hidden bg-muted">
          {/* Inline SVG data URL, which next/image cannot optimize. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={svgToDataUrl(event.artwork)}
            alt={event.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.025]"
          />
          <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
            <Badge variant="outline" className="border-background/30 bg-background/85 text-foreground backdrop-blur-md tabular-nums">
              #{event.eventId.toString()}
            </Badge>
            <Badge variant="accent" className="bg-background/85 backdrop-blur-md">
              {MINT_METHOD_LABELS[token.method]}
            </Badge>
          </div>
        </div>
        <CardContent className="flex flex-col gap-3 p-5">
          <div className="flex items-start justify-between gap-3">
            <h2 className="line-clamp-2 text-lg font-semibold tracking-tight">{event.name}</h2>
            <ArrowUpRight aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-fg-tertiary transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-teal-600 dark:group-hover:text-teal-300" />
          </div>
          <div className="grid gap-2 text-sm text-fg-secondary">
            <span className="flex items-center gap-2">
              <CalendarDays aria-hidden="true" className="size-4 text-fg-tertiary" />
              Minted {formatUtcDate(token.mintedAt)}
            </span>
            <span className="flex items-center gap-2">
              <Fingerprint aria-hidden="true" className="size-4 text-fg-tertiary" />
              {event.creator === CONNECTED_ADDRESS
                ? "Your event"
                : `From ${shortAddress(event.creator)}`}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-border/70 pt-3 text-xs text-fg-tertiary">
            <span>{event.isSoulbound ? "Bound to wallet" : "Transferable"}</span>
            <span className="tabular-nums">{formatCount(event.collectors)} collectors</span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

/**
 * The "My collection" view embedded in the dashboard shell. One card per
 * POAP this wallet holds: the mint route it arrived through, when it was
 * minted, and whether it can move, all joined to the event metadata
 * through the registry. Cards link out to the public event page.
 */
const CollectionView = () => (
  <div className="dashboard-page mx-auto grid w-full max-w-7xl grid-cols-12 gap-6 p-6">
    <header className="col-span-12 flex flex-col gap-2 border-b border-border/60 pb-5">
      <p className="flex items-center gap-2 text-xs font-medium tracking-[0.16em] text-teal-600 uppercase dark:text-teal-300">
        <Album aria-hidden="true" className="size-3.5" />
        Collector album
      </p>
      <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">My collection</h1>
      <p className="max-w-xl text-sm leading-6 text-fg-secondary">
        Every POAP this wallet holds: how each one was minted, when, and
        whether it can move.
      </p>
      <div className="mt-1 flex flex-wrap gap-2">
        <Badge variant="outline" className="tabular-nums">
          {COLLECTION_STATS.collected} badges
        </Badge>
        <Badge variant="outline" className="tabular-nums">
          {COLLECTION_STATS.soulbound} bound to wallet
        </Badge>
        <Badge variant="outline" className="tabular-nums">
          {COLLECTION_STATS.ownEvents} from your own events
        </Badge>
      </div>
    </header>

    {COLLECTION.length > 0 ? (
      <div className="col-span-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {COLLECTION.map((item, index) => (
          <div
            key={item.token.tokenId.toString()}
            className="animate-[dashboard-enter_220ms_ease-out_both]"
            style={{ animationDelay: `${index * 45}ms` }}
          >
            <CollectionCard item={item} />
          </div>
        ))}
      </div>
    ) : (
      <Card className="dashboard-panel col-span-12 py-5">
        <CardHeader>
          <CardTitle>Nothing collected yet</CardTitle>
          <CardDescription>
            POAPs this wallet mints or receives appear here.
          </CardDescription>
        </CardHeader>
      </Card>
    )}
  </div>
);

export default CollectionView;

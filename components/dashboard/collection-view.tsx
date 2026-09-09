"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  Album,
  ArrowUpRight,
  CalendarDays,
  Fingerprint,
  RefreshCw,
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
import {
  formatCount,
  formatUtcDate,
  shortAddress,
  svgToDataUrl,
} from "@/lib/format";
import { useWallet } from "@/components/wallet/wallet-provider";
import { useBlockTimestamps, useCollection } from "@/hooks/use-poap-reads";
import { ZERO_ROOT, type PoapEvent } from "@/lib/poap-data";

/**
 * What the event itself says about how a token reached a wallet, because
 * the mint log names the event and the recipient, not the route: public
 * events minted publicly, invitation events through their list, and
 * everything else arrived by the creator's hand.
 */
function distributionLabel(event: PoapEvent): string {
  if (event.isPublic) return "Public mint";
  if (event.allowlistRoot !== ZERO_ROOT) return "Invitation list";
  return "From the creator";
}

type CollectionCardProps = {
  event: PoapEvent;
  address: `0x${string}`;
  mintedAt: number | null;
  datesLoading: boolean;
};

const CollectionCard = ({
  event,
  address,
  mintedAt,
  datesLoading,
}: CollectionCardProps) => {
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
              {distributionLabel(event)}
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
              {datesLoading && mintedAt === null ? (
                <Skeleton className="h-4 w-28" />
              ) : mintedAt !== null ? (
                `Minted ${formatUtcDate(mintedAt)}`
              ) : (
                "Minted onchain"
              )}
            </span>
            <span className="flex items-center gap-2">
              <Fingerprint aria-hidden="true" className="size-4 text-fg-tertiary" />
              {event.creator === address
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

const CollectionCardSkeleton = () => (
  <Card className="overflow-hidden border-border/70 bg-card/65 py-0">
    <Skeleton className="aspect-square w-full rounded-none" />
    <CardContent className="flex flex-col gap-3 p-5">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
    </CardContent>
  </Card>
);

/**
 * The "My collection" view embedded in the dashboard shell. One card per
 * POAP this wallet holds, straight from `balanceOfBatch` across every
 * registered event, with mint dates read out of the wallet's own mint
 * logs. Cards link out to the public event page.
 */
const CollectionView = () => {
  const { address } = useWallet();
  const { items, isLoading, isError, datesLoading, refetch } = useCollection(
    address
  );

  const mintBlocks = useMemo(
    () => [
      ...new Set(
        items
          .map((item) => item.mintBlock)
          .filter((block): block is bigint => block !== null)
          .map((block) => block.toString())
      ),
    ].map((block) => BigInt(block)),
    [items]
  );

  const timestamps = useBlockTimestamps(mintBlocks);

  const stats = useMemo(
    () => ({
      collected: items.length,
      soulbound: items.filter((item) => item.event.isSoulbound).length,
      ownEvents: address
        ? items.filter((item) => item.event.creator === address).length
        : 0,
    }),
    [items, address]
  );

  return (
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
        {!isLoading ? (
          <div className="mt-1 flex flex-wrap gap-2">
            <Badge variant="outline" className="tabular-nums">
              {stats.collected} badges
            </Badge>
            <Badge variant="outline" className="tabular-nums">
              {stats.soulbound} bound to wallet
            </Badge>
            <Badge variant="outline" className="tabular-nums">
              {stats.ownEvents} from your own events
            </Badge>
          </div>
        ) : null}
      </header>

      {isError ? (
        <Card className="dashboard-panel col-span-12 py-5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <WifiOff aria-hidden="true" className="size-4 text-fg-tertiary" />
              Your collection could not be read
            </CardTitle>
            <CardDescription>
              The Base Sepolia connection dropped while reading your
              balances. Nothing was lost; try again.
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
        <div className="col-span-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <CollectionCardSkeleton key={index} />
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="col-span-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => {
            const mintedAt = item.mintBlock
              ? (timestamps.data?.get(item.mintBlock.toString()) ?? null)
              : null;
            return (
              <div
                key={item.eventId.toString()}
                className="animate-[dashboard-enter_220ms_ease-out_both]"
                style={{ animationDelay: `${index * 45}ms` }}
              >
                <CollectionCard
                  event={item.event}
                  address={address as `0x${string}`}
                  mintedAt={mintedAt}
                  datesLoading={datesLoading}
                />
              </div>
            );
          })}
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
};

export default CollectionView;

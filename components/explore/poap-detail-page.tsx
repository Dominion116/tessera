import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CalendarDays, CheckCircle2, ExternalLink, Fingerprint, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCount, formatUtcDate, shortAddress, svgToDataUrl } from "@/lib/format";
import { CHAIN_ID, CONTRACT_ADDRESS, type PoapEvent, ZERO_ROOT } from "@/lib/poap-data";
import PublicHeader from "@/components/explore/public-header";
import MintAction from "@/components/explore/mint-action";
import ShareCastButton from "@/components/farcaster/share-cast-button";

const PoapDetailPage = ({ event }: { event: PoapEvent }) => (
  <div className="min-h-svh bg-background">
    <PublicHeader />
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Link href="/app" className="inline-flex items-center gap-2 text-sm text-fg-secondary transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400">
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to app
      </Link>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,1.05fr)] lg:items-start lg:gap-14">
        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/65 shadow-[inset_0_1px_0_oklch(1_0_0_/_6%),0_12px_32px_oklch(0_0_0_/_6%)]">
          {/* Inline SVG data URL, which next/image cannot optimize. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={svgToDataUrl(event.artwork)} alt={event.name} className="aspect-square h-auto w-full object-cover" />
        </div>

        <div className="flex flex-col gap-7">
          <header className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="accent">POAP #{event.eventId.toString()}</Badge>
              <Badge variant={event.isPublic ? "accent" : "outline"}>{event.isPublic ? "Public mint" : "Invite only"}</Badge>
            </div>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{event.name}</h1>
            <p className="text-base leading-7 text-fg-secondary">{event.description || "This event has no description. Its artwork and metadata remain readable directly from the contract."}</p>
          </header>

          <Card className="border-border/70 bg-card/55 shadow-sm">
            <CardHeader>
              <CardTitle>Event details</CardTitle>
              <CardDescription>Metadata associated with this event on Base Sepolia.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3"><CalendarDays aria-hidden="true" className="mt-0.5 size-4 text-teal-600 dark:text-teal-300" /><div><p className="text-xs text-fg-tertiary">Event date</p><p className="text-sm font-medium">{event.eventDate === 0n ? "Not set" : formatUtcDate(event.eventDate)}</p></div></div>
              <div className="flex items-start gap-3"><MapPin aria-hidden="true" className="mt-0.5 size-4 text-teal-600 dark:text-teal-300" /><div><p className="text-xs text-fg-tertiary">Location</p><p className="text-sm font-medium">{event.location || "Not set"}</p></div></div>
              <div className="flex items-start gap-3"><Users aria-hidden="true" className="mt-0.5 size-4 text-teal-600 dark:text-teal-300" /><div><p className="text-xs text-fg-tertiary">Collectors</p><p className="text-sm font-medium tabular-nums">{formatCount(event.collectors)}</p></div></div>
              <div className="flex items-start gap-3"><Fingerprint aria-hidden="true" className="mt-0.5 size-4 text-teal-600 dark:text-teal-300" /><div><p className="text-xs text-fg-tertiary">Creator</p><p className="font-mono text-sm font-medium tabular-nums">{shortAddress(event.creator)}</p></div></div>
            </CardContent>
          </Card>

          <Card className="border-teal-400/25 bg-teal-400/[0.04] shadow-sm">
            <CardHeader>
              <CardTitle>Mint this POAP</CardTitle>
              <CardDescription>{event.isPublic ? "Anyone can claim one while public minting is open." : "This event is not open to everyone. Use an invitation or recipient-specific claim route."}</CardDescription>
            </CardHeader>
            <CardContent>
              {event.isPublic ? <MintAction eventName={event.name} eventId={event.eventId} /> : <p className="rounded-lg border border-border/70 bg-background/50 p-4 text-sm leading-6 text-fg-secondary">Public minting is closed for this event. A valid allowlist proof or recipient-bound signature is required.</p>}
            </CardContent>
          </Card>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-lg border border-border/70 bg-card/35 p-4"><CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 text-teal-600 dark:text-teal-300" /><div><p className="text-sm font-medium">{event.isSoulbound ? "Bound to the wallet" : "Transferable"}</p><p className="mt-1 text-xs leading-5 text-fg-tertiary">{event.isSoulbound ? "Transfers are disabled by the contract." : "This POAP can move after minting."}</p></div></div>
            <div className="flex items-start gap-3 rounded-lg border border-border/70 bg-card/35 p-4"><Fingerprint aria-hidden="true" className="mt-0.5 size-4 text-teal-600 dark:text-teal-300" /><div><p className="text-sm font-medium">Onchain metadata</p><p className="mt-1 text-xs leading-5 text-fg-tertiary">Artwork and details are read from the contract.</p></div></div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            <a href={`https://sepolia.basescan.org/address/${CONTRACT_ADDRESS}#code`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-fg-secondary transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400">View contract <ExternalLink aria-hidden="true" className="size-4" /></a>
            <Link href={`/poaps/${event.eventId.toString()}/claim`} className="inline-flex items-center gap-2 text-fg-secondary transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400">Open claim page <ArrowUpRight aria-hidden="true" className="size-4" /></Link>
          </div>
          <ShareCastButton
            text={`${event.name}, an onchain POAP on Base Sepolia.`}
            path={`/poaps/${event.eventId.toString()}`}
            className="w-full sm:w-auto"
          />
          <p className="font-mono text-xs text-fg-tertiary">Base Sepolia, chain {CHAIN_ID}, contract {shortAddress(CONTRACT_ADDRESS)}, {event.allowlistRoot === ZERO_ROOT ? "no invitation list" : "invitation list enabled"}</p>
        </div>
      </div>
    </main>
  </div>
);

export default PoapDetailPage;

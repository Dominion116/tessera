"use client";

import Link from "next/link";
import { ArrowLeft, Check, CircleAlert, KeyRound, WalletCards } from "lucide-react";
import { useWallet } from "@/components/wallet/wallet-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { type PoapEvent } from "@/lib/poap-data";
import { useHasClaimed } from "@/hooks/use-poap-reads";
import PublicHeader from "@/components/explore/public-header";

const ClaimPage = ({ event, method }: { event: PoapEvent; method: string }) => {
  const { address, connect } = useWallet();
  const claim = useHasClaimed(event.eventId, address);
  const isKnownMethod = method === "allowlist" || method === "signature";

  return (
    <div className="min-h-svh bg-background">
      <PublicHeader />
      <main className="mx-auto flex max-w-2xl flex-col px-4 py-8 sm:px-6 sm:py-14 lg:px-8">
        <Link href={`/poaps/${event.eventId.toString()}`} className="inline-flex items-center gap-2 text-sm text-fg-secondary transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400">
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to {event.name}
        </Link>
        <Card className="mt-10 border-border/70 bg-card/65 shadow-[inset_0_1px_0_oklch(1_0_0_/_6%),0_12px_32px_oklch(0_0_0_/_6%)]">
          <CardHeader className="gap-4">
            <div className="flex size-10 items-center justify-center rounded-lg border border-teal-400/30 bg-teal-400/10 text-teal-600 dark:text-teal-300"><KeyRound aria-hidden="true" className="size-5" /></div>
            <CardTitle className="text-2xl">Claim {event.name}</CardTitle>
            <CardDescription>This page is the destination for an invitation-list proof or a recipient-specific signature.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {!isKnownMethod ? <div className="flex items-start gap-3 rounded-lg border border-amber-400/30 bg-amber-400/10 p-4 text-sm leading-6 text-fg-secondary"><CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-300" /><p>This claim link does not specify a supported method. Use an allowlist or signature claim link supplied for this event.</p></div> : null}
            <div className="grid gap-3 rounded-lg border border-border/70 bg-background/50 p-4 text-sm">
              <div className="flex justify-between gap-4"><span className="text-fg-tertiary">Method</span><span className="font-medium capitalize">{method}</span></div>
              <div className="flex justify-between gap-4"><span className="text-fg-tertiary">Event</span><span className="max-w-[65%] text-right font-medium">{event.name}</span></div>
              <div className="flex justify-between gap-4"><span className="text-fg-tertiary">Claim rule</span><span className="text-right text-fg-secondary">One POAP per wallet</span></div>
            </div>
            {!address ? (
              <Button size="lg" onClick={connect} className="w-full"><WalletCards aria-hidden="true" />Connect wallet to continue</Button>
            ) : claim.isLoading ? (
              <div className="flex flex-col gap-3">
                <Skeleton className="h-11 w-full rounded-md" />
                <p className="text-xs text-fg-tertiary">Reading the claim record of this wallet from the contract.</p>
              </div>
            ) : claim.isError ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3 rounded-lg border border-amber-400/30 bg-amber-400/10 p-4 text-sm leading-6 text-fg-secondary"><CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-300" /><p>The claim record for this wallet could not be read. The Base Sepolia connection dropped; the badge itself is unaffected.</p></div>
                 <Button variant="outline" disabled={claim.isFetching} aria-busy={claim.isFetching} onClick={() => void claim.refetch()}>{claim.isFetching ? "Reading..." : "Read the claim record again"}</Button>
              </div>
            ) : claim.data ? (
              <div className="flex items-start gap-3 rounded-lg border border-teal-400/30 bg-teal-400/10 p-4 text-sm leading-6 text-teal-700 dark:text-teal-300"><Check aria-hidden="true" className="mt-0.5 size-4 shrink-0" /><p>This wallet already collected {event.name}. The contract refuses a second copy of the same badge, whichever route it arrives by.</p></div>
            ) : isKnownMethod ? (
              <div className="flex items-start gap-3 rounded-lg border border-teal-400/30 bg-teal-400/10 p-4 text-sm leading-6 text-teal-700 dark:text-teal-300"><Check aria-hidden="true" className="mt-0.5 size-4 shrink-0" /><p>Wallet connected, and no copy held yet: one {method} claim is available. This screen does not submit transactions.</p></div>
            ) : null}
            <p className="text-xs leading-5 text-fg-tertiary">This page checks the connected address against the claim record on the contract and does not submit or simulate a blockchain transaction.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ClaimPage;

"use client";

import Link from "next/link";
import { ArrowLeft, Check, CircleAlert, KeyRound, WalletCards } from "lucide-react";
import { useWallet } from "@/components/wallet/wallet-provider";
import { useEffect, useState } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { CHAIN_ID, CONTRACT_ADDRESS } from "@/lib/poap-data";
import { poapAbi } from "@/lib/poap-contract";
import { allowlistMintArgs, signatureMintArgs } from "@/lib/transaction-args";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { type PoapEvent } from "@/lib/poap-data";
import { useHasClaimed } from "@/hooks/use-poap-reads";
import PublicHeader from "@/components/explore/public-header";
import ShareCastButton from "@/components/farcaster/share-cast-button";

const ClaimPage = ({ event, method, proof = [], signature }: { event: PoapEvent; method: string; proof?: `0x${string}`[]; signature?: `0x${string}` }) => {
  const { address, connect } = useWallet();
  const claim = useHasClaimed(event.eventId, address);
  const isKnownMethod = method === "allowlist" || method === "signature";
  const queryClient = useQueryClient();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash });
  const [submitted, setSubmitted] = useState(false);
  const claimError = error?.message ?? (receipt.error as Error | null)?.message;
  useEffect(() => {
    if (receipt.isSuccess) void queryClient.invalidateQueries({ queryKey: ["has-claimed", event.eventId.toString()] });
  }, [event.eventId, queryClient, receipt.isSuccess]);

  const submit = () => {
    setSubmitted(true);
    if (method === "allowlist") writeContract({ chainId: CHAIN_ID, address: CONTRACT_ADDRESS, abi: poapAbi, functionName: "allowlistMint", args: allowlistMintArgs(event.eventId, proof) });
    if (method === "signature" && signature) writeContract({ chainId: CHAIN_ID, address: CONTRACT_ADDRESS, abi: poapAbi, functionName: "mintWithSignature", args: signatureMintArgs(event.eventId, signature) });
  };

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
               <div className="flex flex-col gap-3">
                 <div className="flex items-start gap-3 rounded-lg border border-teal-400/30 bg-teal-400/10 p-4 text-sm leading-6 text-teal-700 dark:text-teal-300"><Check aria-hidden="true" className="mt-0.5 size-4 shrink-0" /><p>Wallet connected, and no copy held yet: one {method} claim is available.</p></div>
                 {claimError ? <p role="alert" className="text-xs text-red-600 dark:text-red-300">{claimError}</p> : null}
                 {submitted && !signature && method === "signature" ? <p role="alert" className="text-xs text-red-600 dark:text-red-300">This claim link does not contain a recipient signature.</p> : null}
                 <Button size="lg" onClick={submit} disabled={isPending || receipt.isLoading || receipt.isSuccess || (method === "signature" && !signature) || (method === "allowlist" && proof.length === 0)} aria-busy={isPending || receipt.isLoading}>{isPending ? "Confirm in wallet" : receipt.isLoading ? "Confirming..." : receipt.isSuccess ? "Claim confirmed" : "Submit claim"}</Button>
                 {hash ? <p className="break-all text-xs text-fg-tertiary">Transaction: {hash}</p> : null}
                 {receipt.isSuccess ? <ShareCastButton text={`I claimed ${event.name} on Base Sepolia.`} path={`/poaps/${event.eventId.toString()}`} /> : null}
               </div>
            ) : null}
             <p className="text-xs leading-5 text-fg-tertiary">This page checks the connected address against the claim record before submitting the selected claim transaction.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ClaimPage;

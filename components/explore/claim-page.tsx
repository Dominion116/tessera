"use client";

import Link from "next/link";
import { ArrowLeft, Check, CircleAlert, KeyRound, Loader2, WalletCards } from "lucide-react";
import { useWallet } from "@/components/wallet/wallet-provider";
import { useEffect, useState } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { CHAIN_ID, CONTRACT_ADDRESS } from "@/lib/poap-data";
import { poapAbi } from "@/lib/poap-contract";
import { allowlistMintArgs, publicMintArgs, signatureMintArgs } from "@/lib/transaction-args";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { type PoapEvent } from "@/lib/poap-data";
import { useHasClaimed } from "@/hooks/use-poap-reads";
import PublicHeader from "@/components/explore/public-header";
import ShareCastButton from "@/components/farcaster/share-cast-button";

type ProofApiResponse = {
  eligible: boolean;
  address?: string;
  proof?: `0x${string}`[];
  username?: string;
  fid?: number;
  message?: string;
};

const ClaimPage = ({
  event,
  method,
  proof = [],
  signature,
}: {
  event: PoapEvent;
  method: string;
  proof?: `0x${string}`[];
  signature?: `0x${string}`;
}) => {
  const { address, connect } = useWallet();
  const claim = useHasClaimed(event.eventId, address);
  const queryClient = useQueryClient();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash });

  const [activeProof, setActiveProof] = useState<`0x${string}`[]>(proof);
  const [memberUsername, setMemberUsername] = useState<string | null>(null);
  const [autoChecking, setAutoChecking] = useState(false);
  const [autoCheckError, setAutoCheckError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Auto-resolve allowlist proof if no proof is provided in URL
  useEffect(() => {
    if (proof.length > 0) {
      setActiveProof(proof);
      return;
    }

    if (!address || method !== "allowlist") return;

    let cancelled = false;
    setAutoChecking(true);
    setAutoCheckError(null);

    fetch(`/api/poaps/${event.eventId.toString()}/proof?address=${address}`)
      .then((res) => res.json())
      .then((data: ProofApiResponse) => {
        if (cancelled) return;
        if (data.eligible && Array.isArray(data.proof) && data.proof.length > 0) {
          setActiveProof(data.proof);
          if (data.username) setMemberUsername(data.username);
        } else {
          setAutoCheckError(
            data.message || "This wallet is not included in the allowlist snapshot for this event."
          );
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAutoCheckError("Unable to verify allowlist eligibility for this address.");
        }
      })
      .finally(() => {
        if (!cancelled) setAutoChecking(false);
      });

    return () => {
      cancelled = true;
    };
  }, [address, event.eventId, method, proof]);

  useEffect(() => {
    if (receipt.isSuccess) {
      void queryClient.invalidateQueries({
        queryKey: ["has-claimed", event.eventId.toString()],
      });
    }
  }, [event.eventId, queryClient, receipt.isSuccess]);

  const isAllowlistMethod = method === "allowlist";
  const isSignatureMethod = method === "signature";
  const isPublicMethod = method === "public" || event.isPublic;
  const isKnownMethod = isAllowlistMethod || isSignatureMethod || isPublicMethod;

  const claimError = error?.message ?? (receipt.error as Error | null)?.message;

  const submit = () => {
    setSubmitted(true);
    if (isAllowlistMethod && activeProof.length > 0) {
      writeContract({
        chainId: CHAIN_ID,
        address: CONTRACT_ADDRESS,
        abi: poapAbi,
        functionName: "allowlistMint",
        args: allowlistMintArgs(event.eventId, activeProof),
      });
    } else if (isSignatureMethod && signature) {
      writeContract({
        chainId: CHAIN_ID,
        address: CONTRACT_ADDRESS,
        abi: poapAbi,
        functionName: "mintWithSignature",
        args: signatureMintArgs(event.eventId, signature),
      });
    } else if (event.isPublic) {
      writeContract({
        chainId: CHAIN_ID,
        address: CONTRACT_ADDRESS,
        abi: poapAbi,
        functionName: "mint",
        args: publicMintArgs(event.eventId),
      });
    }
  };

  const canSubmit =
    !isPending &&
    !receipt.isLoading &&
    !receipt.isSuccess &&
    ((isAllowlistMethod && activeProof.length > 0) ||
      (isSignatureMethod && Boolean(signature)) ||
      event.isPublic);

  return (
    <div className="min-h-svh bg-background">
      <PublicHeader />
      <main className="mx-auto flex max-w-2xl flex-col px-4 py-8 sm:px-6 sm:py-14 lg:px-8">
        <Link
          href={`/poaps/${event.eventId.toString()}`}
          className="inline-flex items-center gap-2 text-sm text-fg-secondary transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to {event.name}
        </Link>
        <Card className="mt-10 border-border/70 bg-card/65 shadow-[inset_0_1px_0_oklch(1_0_0_/_6%),0_12px_32px_oklch(0_0_0_/_6%)]">
          <CardHeader className="gap-4">
            <div className="flex size-10 items-center justify-center rounded-lg border border-teal-400/30 bg-teal-400/10 text-teal-600 dark:text-teal-300">
              <KeyRound aria-hidden="true" className="size-5" />
            </div>
            <CardTitle className="text-2xl">Claim {event.name}</CardTitle>
            <CardDescription>
              Proof-of-attendance claim destination for Tessera Club on Base Sepolia.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {!isKnownMethod ? (
              <div className="flex items-start gap-3 rounded-lg border border-amber-400/30 bg-amber-400/10 p-4 text-sm leading-6 text-fg-secondary">
                <CircleAlert
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-300"
                />
                <p>
                  This claim link does not specify a supported method. Use an allowlist, signature, or public claim route.
                </p>
              </div>
            ) : null}

            <div className="grid gap-3 rounded-lg border border-border/70 bg-background/50 p-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-fg-tertiary">Method</span>
                <span className="font-medium capitalize">
                  {isAllowlistMethod ? "Club Allowlist" : isSignatureMethod ? "Signature Claim" : "Public Mint"}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-fg-tertiary">Event</span>
                <span className="max-w-[65%] text-right font-medium">{event.name}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-fg-tertiary">Claim rule</span>
                <span className="text-right text-fg-secondary">One POAP per wallet</span>
              </div>
            </div>

            {!address ? (
              <Button size="lg" onClick={connect} className="w-full">
                <WalletCards aria-hidden="true" />
                Connect wallet to continue
              </Button>
            ) : claim.isLoading ? (
              <div className="flex flex-col gap-3">
                <Skeleton className="h-11 w-full rounded-md" />
                <p className="text-xs text-fg-tertiary">
                  Reading the claim record of this wallet from the contract.
                </p>
              </div>
            ) : claim.isError ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3 rounded-lg border border-amber-400/30 bg-amber-400/10 p-4 text-sm leading-6 text-fg-secondary">
                  <CircleAlert
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-300"
                  />
                  <p>
                    The claim record for this wallet could not be read. The Base Sepolia connection dropped; the badge itself is unaffected.
                  </p>
                </div>
                <Button
                  variant="outline"
                  disabled={claim.isFetching}
                  aria-busy={claim.isFetching}
                  onClick={() => void claim.refetch()}
                >
                  {claim.isFetching ? "Reading..." : "Read the claim record again"}
                </Button>
              </div>
            ) : claim.data ? (
              <div className="flex items-start gap-3 rounded-lg border border-teal-400/30 bg-teal-400/10 p-4 text-sm leading-6 text-teal-700 dark:text-teal-300">
                <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                <p>
                  This wallet already collected {event.name}. The contract refuses a second copy of the same badge, whichever route it arrives by.
                </p>
              </div>
            ) : autoChecking ? (
              <div className="flex items-center gap-2 rounded-lg border border-border/70 bg-background/50 p-4 text-xs text-fg-secondary">
                <Loader2 className="size-4 animate-spin text-teal-500" />
                <span>Verifying your wallet against the Tessera Club snapshot...</span>
              </div>
            ) : isKnownMethod ? (
              <div className="flex flex-col gap-3">
                {activeProof.length > 0 && isAllowlistMethod ? (
                  <div className="flex items-start gap-3 rounded-lg border border-teal-400/30 bg-teal-400/10 p-4 text-sm leading-6 text-teal-700 dark:text-teal-300">
                    <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                    <div>
                      <p className="font-medium">
                        {memberUsername ? `@${memberUsername} is verified!` : "Wallet verified on allowlist!"}
                      </p>
                      <p className="text-xs text-teal-600/90 dark:text-teal-400/90">
                        Cryptographic Merkle proof resolved. One allowlist claim is available.
                      </p>
                    </div>
                  </div>
                ) : autoCheckError && isAllowlistMethod ? (
                  <div className="flex flex-col gap-2 rounded-lg border border-amber-400/30 bg-amber-400/[0.06] p-4 text-xs text-amber-700 dark:text-amber-300">
                    <div className="flex items-center gap-2 font-medium">
                      <CircleAlert className="size-4 shrink-0" />
                      <span>Not on the club snapshot list</span>
                    </div>
                    <p>{autoCheckError}</p>
                    {event.isPublic ? (
                      <p className="pt-1 text-fg-secondary">
                        Public minting is active for this event, so you can still claim below.
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <div className="flex items-start gap-3 rounded-lg border border-teal-400/30 bg-teal-400/10 p-4 text-sm leading-6 text-teal-700 dark:text-teal-300">
                    <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                    <p>Wallet connected: one claim is available.</p>
                  </div>
                )}

                {claimError ? (
                  <p role="alert" className="text-xs text-red-600 dark:text-red-300">
                    {claimError}
                  </p>
                ) : null}

                {submitted && !signature && isSignatureMethod ? (
                  <p role="alert" className="text-xs text-red-600 dark:text-red-300">
                    This claim link does not contain a recipient signature.
                  </p>
                ) : null}

                <Button
                  size="lg"
                  onClick={submit}
                  disabled={!canSubmit}
                  aria-busy={isPending || receipt.isLoading}
                >
                  {isPending
                    ? "Confirm in wallet"
                    : receipt.isLoading
                      ? "Confirming onchain..."
                      : receipt.isSuccess
                        ? "Claim confirmed"
                        : "Submit claim"}
                </Button>

                {hash ? (
                  <p className="break-all text-xs text-fg-tertiary">
                    Transaction: {hash}
                  </p>
                ) : null}

                {receipt.isSuccess ? (
                  <ShareCastButton
                    text={`I just claimed the ${event.name} badge on Base Sepolia!`}
                    path={`/poaps/${event.eventId.toString()}`}
                  />
                ) : null}
              </div>
            ) : null}

            <p className="text-xs leading-5 text-fg-tertiary">
              This page verifies your connected wallet against the onchain contract and Merkle snapshot before submitting.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ClaimPage;

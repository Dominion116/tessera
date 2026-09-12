"use client";

import { useEffect } from "react";
import { Check, CircleAlert, WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useWallet } from "@/components/wallet/wallet-provider";
import { useHasClaimed } from "@/hooks/use-poap-reads";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { CHAIN_ID, CONTRACT_ADDRESS } from "@/lib/poap-data";
import { poapAbi } from "@/lib/poap-contract";
import { mintArgs } from "@/lib/transaction-args";
import { useQueryClient } from "@tanstack/react-query";

type MintActionProps = {
  eventName: string;
  eventId: bigint;
};

const MintAction = ({ eventName, eventId }: MintActionProps) => {
  const { address, connect } = useWallet();
  const claim = useHasClaimed(eventId, address);
  const queryClient = useQueryClient();
  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (!receipt.isSuccess) return;
    void queryClient.invalidateQueries({ queryKey: ["has-claimed", eventId.toString()] });
    void queryClient.invalidateQueries({ queryKey: ["all-events"] });
  }, [eventId, queryClient, receipt.isSuccess]);

  if (!address) {
    return (
      <div className="flex flex-col gap-3">
        <Button onClick={connect} size="lg" className="w-full">
          <WalletCards aria-hidden="true" />
          Connect to mint
        </Button>
        <p className="flex items-start gap-2 text-xs leading-5 text-fg-tertiary">
          <CircleAlert aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
          One badge lands per wallet, so the claim record is checked against the
          connected address first.
        </p>
      </div>
    );
  }

  if (claim.isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-11 w-full rounded-md" />
        <p className="text-xs text-fg-tertiary">
          Reading the claim record of this wallet from the contract.
        </p>
      </div>
    );
  }

  if (claim.isError) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-3 rounded-lg border border-amber-400/30 bg-amber-400/10 p-4 text-sm leading-6 text-fg-secondary">
          <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-300" />
          <p>
            The claim record for this wallet could not be read. The Base
            Sepolia connection dropped; the badge itself is unaffected.
          </p>
        </div>
         <Button variant="outline" disabled={claim.isFetching} aria-busy={claim.isFetching} onClick={() => void claim.refetch()}>
           {claim.isFetching ? "Reading..." : "Read the claim record again"}
        </Button>
      </div>
    );
  }

  if (claim.data) {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-teal-400/30 bg-teal-400/10 p-4 text-sm leading-6 text-teal-700 dark:text-teal-300">
        <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
        <p>
          This wallet already collected {eventName}. The contract refuses a
          second copy of the same badge, whichever route it arrives by.
        </p>
      </div>
    );
  }

  if (isPending || receipt.isLoading || receipt.isSuccess || hash || writeError) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-3 rounded-lg border border-teal-400/30 bg-teal-400/10 p-4 text-sm leading-6 text-teal-700 dark:text-teal-300">
          <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <p>
            {isPending ? "Confirm the mint in your wallet." : receipt.isLoading ? "Mint submitted. Waiting for confirmation..." : receipt.isSuccess ? `Mint confirmed for ${eventName}.` : writeError ? "The mint was not submitted." : `Mint transaction submitted for ${eventName}.`}
          </p>
        </div>
        {hash ? <p className="break-all text-xs text-fg-tertiary">Transaction: {hash}</p> : null}
        {writeError || receipt.error ? <p role="alert" className="text-xs text-red-600 dark:text-red-300">{writeError?.message ?? receipt.error?.message}</p> : null}
        <p className="flex items-start gap-2 text-xs leading-5 text-fg-tertiary">
          <CircleAlert aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
          The claim record was checked before the transaction was submitted.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <Button onClick={() => writeContract({ chainId: CHAIN_ID, address: CONTRACT_ADDRESS, abi: poapAbi, functionName: "mint", args: mintArgs(eventId) })} size="lg" className="w-full" disabled={isPending} aria-busy={isPending}>
         Mint this POAP
      </Button>
      <p className="flex items-start gap-2 text-xs leading-5 text-fg-tertiary">
        <CircleAlert aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
        The connected wallet is clear to claim one badge. Nothing is submitted
        from this screen.
      </p>
    </div>
  );
};

export default MintAction;

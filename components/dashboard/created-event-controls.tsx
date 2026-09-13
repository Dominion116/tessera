"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AllowlistBuilder from "@/components/dashboard/allowlist-builder";
import SignatureStudio from "@/components/dashboard/signature-studio";
import { useWallet } from "@/components/wallet/wallet-provider";
import { useEvent } from "@/hooks/use-poap-reads";
import { poapAbi } from "@/lib/poap-contract";
import { CHAIN_ID, CONTRACT_ADDRESS, CREATOR_MINT_BATCH_LIMIT, CREATOR_TIMELOCK_DAYS } from "@/lib/poap-data";
import { creatorMintArgs, parseRecipientAddresses, publicControlArgs } from "@/lib/transaction-args";

const CreatedEventControls = ({ eventId }: { eventId: bigint }) => {
  const { address } = useWallet();
  const { event, isLoading, isError } = useEvent(eventId);
  const queryClient = useQueryClient();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash });
  const [recipientsInput, setRecipientsInput] = useState("");
  const [action, setAction] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [now] = useState(() => Date.now() / 1000);
  const frozen = event ? Number(event.createdAt) + CREATOR_TIMELOCK_DAYS * 86_400 <= now : false;
  const isCreator = Boolean(event && address && event.creator.toLowerCase() === address.toLowerCase());
  const pending = isPending || receipt.isLoading;

  useEffect(() => {
    if (receipt.isSuccess) void queryClient.invalidateQueries({ queryKey: ["all-events"] });
  }, [queryClient, receipt.isSuccess]);

  const submitPublic = () => {
    if (!event || frozen || pending) return;
    setLocalError(null);
    setAction("public");
    writeContract({ chainId: CHAIN_ID, address: CONTRACT_ADDRESS, abi: poapAbi, functionName: "updateEventPublic", args: publicControlArgs(eventId, !event.isPublic) });
  };

  const submitAirdrop = () => {
    if (!event || frozen || pending) return;
    setLocalError(null);
    setAction("airdrop");
    const recipients = parseRecipientAddresses(recipientsInput, CREATOR_MINT_BATCH_LIMIT);
    if (!recipients) { setLocalError(`Enter between 1 and ${CREATOR_MINT_BATCH_LIMIT} valid recipient addresses.`); return; }
    writeContract({ chainId: CHAIN_ID, address: CONTRACT_ADDRESS, abi: poapAbi, functionName: "creatorMint", args: creatorMintArgs(eventId, recipients) });
  };

  if (isLoading) return <p role="status">Loading event controls...</p>;
  if (isError || !event) return <p role="alert">This event could not be loaded.</p>;
  if (!isCreator) return <p role="alert">Only the event creator can manage this POAP.</p>;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 p-6">
      <Card>
        <CardHeader><CardTitle>Creator controls</CardTitle><CardDescription>These controls are available until the day-{CREATOR_TIMELOCK_DAYS} freeze.</CardDescription></CardHeader>
        <CardContent className="flex flex-col gap-4">
          {frozen ? <p className="rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-sm" role="status">Creator controls are frozen for this event.</p> : null}
          <Button type="button" disabled={frozen || pending} onClick={submitPublic} aria-busy={pending}>{event.isPublic ? "Close public mint" : "Open public mint"}</Button>
          <div className="flex flex-col gap-2"><label htmlFor="airdrop-recipients" className="text-sm font-medium">Creator airdrop recipients</label><textarea id="airdrop-recipients" value={recipientsInput} onChange={(changeEvent) => setRecipientsInput(changeEvent.target.value)} placeholder="One address per line" disabled={frozen || pending} className="min-h-24 rounded-md border border-input bg-transparent px-3 py-2 text-sm" /><Button type="button" variant="outline" disabled={frozen || pending} onClick={submitAirdrop}>Airdrop to recipients</Button></div>
          {action && (pending || receipt.isSuccess) ? <p role="status" aria-live="polite">{isPending ? `Confirm the ${action} transaction in your wallet.` : receipt.isLoading ? `Waiting for the ${action} transaction to confirm...` : `${action} transaction confirmed.`}</p> : null}
          {hash ? <p className="break-all text-xs text-fg-tertiary">Transaction: {hash}</p> : null}
          {localError ?? error?.message ?? receipt.error?.message ? <p role="alert" className="text-xs text-red-600 dark:text-red-300">{localError ?? error?.message ?? receipt.error?.message}</p> : null}
        </CardContent>
      </Card>

      <AllowlistBuilder event={event} />
      <SignatureStudio event={event} />
    </div>
  );
};

export default CreatedEventControls;

"use client";

import { useState } from "react";
import { useSignMessage } from "wagmi";
import { Check, KeyRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CopyButton from "@/components/dashboard/copy-button";
import QrCode from "@/components/dashboard/qr-code";
import { useWallet } from "@/components/wallet/wallet-provider";
import { useOrigin } from "@/hooks/use-origin";
import { parseRecipientList, type Address } from "@/lib/allowlist";
import { CHAIN_ID, SIGNATURE_WINDOW_DAYS, type PoapEvent } from "@/lib/poap-data";
import {
  recoverSignatureSigner,
  signatureClaimLink,
  signatureDigest,
} from "@/lib/signature";
import { shortAddress } from "@/lib/format";

type IssuedSignature = {
  address: Address;
  signature: Address;
  link: string;
};

const SignatureStudio = ({ event }: { event: PoapEvent }) => {
  const { address, connect } = useWallet();
  const { signMessageAsync, isPending } = useSignMessage();
  const [input, setInput] = useState("");
  const [issued, setIssued] = useState<IssuedSignature[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [openQr, setOpenQr] = useState<string | null>(null);
  const [now] = useState(() => Date.now() / 1000);
  const origin = useOrigin();

  const frozen =
    Number(event.createdAt) + SIGNATURE_WINDOW_DAYS * 86_400 <= now;
  const isCreator = Boolean(
    address && event.creator.toLowerCase() === address.toLowerCase()
  );
  const effectiveOrigin = origin;

  const issue = async () => {
    setError(null);
    if (!address) {
      connect();
      return;
    }
    if (!isCreator) {
      setError(
        "Connect the wallet that registered this POAP. Only its signature is accepted by the contract."
      );
      return;
    }
    const { addresses, invalid } = parseRecipientList(input);
    if (addresses.length === 0) {
      setError("Add at least one wallet address, one per line.");
      return;
    }
    if (invalid.length) {
      setError(`Skipped, not an address: ${invalid.slice(0, 5).join(", ")}`);
    }

    const next: IssuedSignature[] = [];
    try {
      for (const recipient of addresses) {
        const digest = signatureDigest(event.eventId, CHAIN_ID, recipient);
        const signature = await signMessageAsync({ message: { raw: digest } });
        const recovered = await recoverSignatureSigner(digest, signature);
        if (recovered.toLowerCase() !== address.toLowerCase()) {
          throw new Error(
            "The signature did not recover to the connected wallet, so the contract would reject it."
          );
        }
        next.push({
          address: recipient,
          signature,
          link: signatureClaimLink(effectiveOrigin, event.eventId, signature),
        });
      }
      setIssued((current) => [
        ...next,
        ...current.filter(
          (item) => !next.some((fresh) => fresh.address === item.address)
        ),
      ]);
    } catch (signError) {
      setError(
        signError instanceof Error
          ? signError.message
          : "The signature could not be created."
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg border border-teal-400/30 bg-teal-400/10 text-teal-600 dark:text-teal-300">
            <KeyRound aria-hidden="true" className="size-4" />
          </span>
          <div>
            <CardTitle>Signature codes</CardTitle>
            <CardDescription>
              Sign one wallet at a time and send that wallet its own code. A
              signature only works for the address it was signed for, so a
              single code cannot be shared or posted for the whole room.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={frozen ? "outline" : "accent"}>
            {frozen ? "Window closed" : `Open for ${SIGNATURE_WINDOW_DAYS} days`}
          </Badge>
          <span className="text-xs text-fg-tertiary">
            Signature claims are accepted for {SIGNATURE_WINDOW_DAYS} days from
            registration. Every wallet signs separately; there is no master
            code.
          </span>
        </div>

        {!isCreator ? (
          <p className="rounded-lg border border-border/70 bg-background/50 p-3 text-sm text-fg-secondary">
            {address
              ? "The connected wallet did not register this POAP, so its signatures would be rejected. Switch to the creator wallet to issue codes."
              : "Connect the creator wallet to issue signature codes."}
          </p>
        ) : null}

        <label className="flex flex-col gap-2 text-sm font-medium">
          Wallet to sign for
          <textarea
            value={input}
            onChange={(changeEvent) => setInput(changeEvent.target.value)}
            placeholder={"One address per line\n0x1111...\n0x2222..."}
            spellCheck={false}
            rows={4}
            className="min-h-24 rounded-md border border-input bg-transparent px-3 py-2 font-mono text-xs outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-teal-400"
          />
        </label>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            onClick={issue}
            disabled={frozen || isPending}
            aria-busy={isPending}
          >
            {isPending
              ? "Waiting for wallet"
              : address
                ? "Sign claim codes"
                : "Connect wallet to sign"}
          </Button>
          {issued.length ? (
            <span className="text-xs text-fg-tertiary" role="status">
              {issued.length} code{issued.length === 1 ? "" : "s"} ready to send
            </span>
          ) : null}
        </div>

        {error ? (
          <p role="alert" className="text-xs text-red-600 dark:text-red-300">
            {error}
          </p>
        ) : null}

        {issued.length ? (
          <ul className="flex max-h-96 flex-col gap-2 overflow-y-auto pr-1">
            {issued.map((item) => (
              <li
                key={item.address}
                className="flex flex-col gap-2 rounded-md border border-border/70 bg-background/40 p-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-xs text-fg-secondary">
                    {shortAddress(item.address)}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <CopyButton value={item.link} />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setOpenQr(openQr === item.address ? null : item.address)
                      }
                    >
                      {openQr === item.address ? "Hide QR" : "Show QR"}
                    </Button>
                  </div>
                </div>
                {openQr === item.address ? (
                  <div className="flex justify-center py-1">
                    <QrCode
                      value={item.link}
                      size={140}
                      label={`Claim code for ${item.address}`}
                    />
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="flex items-center gap-2 text-xs text-fg-tertiary">
            <Check aria-hidden="true" className="size-4" />
            Codes appear here after you sign, each with its own link and QR.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default SignatureStudio;

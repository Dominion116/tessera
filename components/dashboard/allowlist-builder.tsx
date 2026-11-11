"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { AtSign, Check, ListChecks, Loader2, Sparkles, Users } from "lucide-react";
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
import {
  allowlistClaimLink,
  allowlistCsv,
  buildAllowlist,
  parseRecipientList,
  type Allowlist,
  type AllowlistRecipientInput,
  type ParsedRecipients,
} from "@/lib/allowlist";
import { poapAbi } from "@/lib/poap-contract";
import {
  CHAIN_ID,
  CONTRACT_ADDRESS,
  CREATOR_TIMELOCK_DAYS,
  ZERO_ROOT,
  type PoapEvent,
} from "@/lib/poap-data";
import { qrDataUrl } from "@/lib/qr";
import { formatCount, shortAddress } from "@/lib/format";
import type { ResolvedRecipient, ResolveAllowlistResponse } from "@/lib/farcaster-resolver";

const PRINT_LIMIT = 200;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const PRESET_CHANNELS = [
  { id: "tessera", label: "Tessera Club", hint: "/tessera" },
  { id: "npc", label: "NPC Nexus", hint: "/npc" },
  { id: "base", label: "Base", hint: "/base" },
];

const AllowlistBuilder = ({ event }: { event: PoapEvent }) => {
  const { address } = useWallet();
  const queryClient = useQueryClient();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash });

  const [mode, setMode] = useState<"manual" | "farcaster">("manual");
  const [input, setInput] = useState("");
  const [parsed, setParsed] = useState<ParsedRecipients | null>(null);

  // Farcaster resolver states
  const [farcasterInput, setFarcasterInput] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("");
  const [snapshotDate, setSnapshotDate] = useState("");
  const [includeAllWallets, setIncludeAllWallets] = useState(true);
  const [resolving, setResolving] = useState(false);
  const [resolveError, setResolveError] = useState<string | null>(null);
  const [resolvedMembers, setResolvedMembers] = useState<ResolvedRecipient[]>([]);
  const [unresolvedItems, setUnresolvedItems] = useState<{ identifier: string; reason: string }[]>([]);

  const [built, setBuilt] = useState<Allowlist | null>(null);
  const [buildError, setBuildError] = useState<string | null>(null);
  const [openQr, setOpenQr] = useState<number | null>(null);
  const [printPending, setPrintPending] = useState(false);
  const [now] = useState(() => Date.now() / 1000);
  const origin = useOrigin();

  useEffect(() => {
    if (receipt.isSuccess) {
      void queryClient.invalidateQueries({ queryKey: ["all-events"] });
    }
  }, [queryClient, receipt.isSuccess]);

  const rootSet = event.allowlistRoot !== ZERO_ROOT;
  const frozen =
    Number(event.createdAt) + CREATOR_TIMELOCK_DAYS * 86_400 <= now;
  const isCreator = Boolean(
    address && event.creator.toLowerCase() === address.toLowerCase()
  );
  const pending = isPending || receipt.isLoading;
  const effectiveOrigin = origin;
  const matchesRegistered =
    rootSet && built
      ? built.root.toLowerCase() === event.allowlistRoot.toLowerCase()
      : null;

  const buildFromManual = () => {
    setBuildError(null);
    const next = parseRecipientList(input);
    setParsed(next);
    if (next.addresses.length === 0) {
      setBuilt(null);
      setBuildError("Add at least one valid wallet address.");
      return;
    }
    try {
      setBuilt(buildAllowlist(next.addresses));
    } catch {
      setBuilt(null);
      setBuildError("The invitation list could not be built from that input.");
    }
  };

  const resolveFarcasterMembers = async () => {
    setResolveError(null);
    setResolving(true);
    try {
      const identifiers = farcasterInput
        .split(/[\s,;]+/)
        .map((s) => s.trim())
        .filter(Boolean);

      const beforeTimestamp = snapshotDate
        ? Math.floor(new Date(snapshotDate).getTime() / 1000)
        : undefined;

      const res = await fetch("/api/farcaster/resolve-allowlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifiers,
          channelId: selectedChannel || undefined,
          beforeTimestamp,
          includeAllVerifiedWallets: includeAllWallets,
        }),
      });

      const data = (await res.json()) as { success: boolean; error?: string } & ResolveAllowlistResponse;

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to resolve Farcaster members.");
      }

      setResolvedMembers(data.resolved);
      setUnresolvedItems(data.unresolved);

      if (data.addresses.length === 0) {
        setResolveError("No valid verified addresses were found for the requested members.");
        return;
      }

      const inputs: AllowlistRecipientInput[] = data.resolved.map((item) => ({
        address: item.address,
        username: item.username,
        fid: item.fid,
        displayName: item.displayName,
        source: item.source,
      }));

      setBuilt(buildAllowlist(inputs));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error resolving members";
      setResolveError(msg);
    } finally {
      setResolving(false);
    }
  };

  const setRoot = () => {
    if (!built || rootSet || frozen || pending) return;
    writeContract({
      chainId: CHAIN_ID,
      address: CONTRACT_ADDRESS,
      abi: poapAbi,
      functionName: "updateAllowlistRoot",
      args: [event.eventId, built.root],
    });
  };

  const downloadCsv = () => {
    if (!built) return;
    const blob = new Blob(
      [allowlistCsv(effectiveOrigin, event.eventId, built.entries)],
      { type: "text/csv" }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `invitation-list-event-${event.eventId.toString()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const printSheet = async () => {
    if (!built) return;
    setPrintPending(true);
    try {
      const rows = await Promise.all(
        built.entries.slice(0, PRINT_LIMIT).map(async (entry) => {
          const link = allowlistClaimLink(
            effectiveOrigin,
            event.eventId,
            entry.proof
          );
          return {
            address: entry.address,
            username: entry.username,
            link,
            src: await qrDataUrl(link, 220),
          };
        })
      );
      const win = window.open("", "_blank");
      if (!win) return;
      const cards = rows
        .map(
          (row) => `<article>
            <img src="${row.src}" width="180" height="180" alt="Claim code for ${escapeHtml(row.address)}" />
            ${row.username ? `<p class="user">@${escapeHtml(row.username)}</p>` : ""}
            <p class="addr">${escapeHtml(shortAddress(row.address))}</p>
          </article>`
        )
        .join("");
      win.document.write(
        `<!doctype html><html><head><meta charset="utf-8" /><title>${escapeHtml(
          event.name
        )} claim codes</title><style>
          body { font-family: system-ui, sans-serif; margin: 24px; }
          h1 { font-size: 18px; margin: 0 0 4px; }
          p.meta { color: #555; margin: 0 0 20px; font-size: 12px; }
          .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
          article { border: 1px solid #ddd; border-radius: 8px; padding: 12px; text-align: center; }
          .user { font-weight: 600; font-size: 12px; margin: 6px 0 2px; }
          .addr { font-family: ui-monospace, monospace; font-size: 11px; margin: 2px 0 0; color: #444; }
        </style></head><body>
          <h1>${escapeHtml(event.name)}</h1>
          <p class="meta">One code per invited wallet. Each wallet claims once.</p>
          <div class="grid">${cards}</div>
        </body></html>`
      );
      win.document.close();
      win.focus();
    } finally {
      setPrintPending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg border border-teal-400/30 bg-teal-400/10 text-teal-600 dark:text-teal-300">
            <ListChecks aria-hidden="true" className="size-4" />
          </span>
          <div>
            <CardTitle>Invitation list</CardTitle>
            <CardDescription>
              Build the onchain commitment and private claim codes for your attendees.
              Paste raw Ethereum addresses or resolve Farcaster club members automatically.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-2">
          {rootSet ? (
            <Badge variant="accent">
              <Check aria-hidden="true" /> Set onchain once
            </Badge>
          ) : (
            <Badge variant="outline">Not set yet</Badge>
          )}
          <span className="text-xs text-fg-tertiary">
            {rootSet
              ? "The contract allows this commitment to be set once, so it can never be replaced."
              : frozen
                ? `The ${CREATOR_TIMELOCK_DAYS}-day window has closed, so a list can no longer be set.`
                : `Settable once, any time in the first ${CREATOR_TIMELOCK_DAYS} days after registration.`}
          </span>
        </div>

        {!isCreator ? (
          <p className="rounded-lg border border-border/70 bg-background/50 p-3 text-sm text-fg-secondary">
            Only the wallet that registered this POAP can set its invitation
            list. You can still build a list and its claim codes here, but the
            commitment has to be submitted by the creator.
          </p>
        ) : null}

        {/* Input Mode Selector */}
        <div className="flex rounded-lg border border-border/70 bg-background/60 p-1">
          <button
            type="button"
            onClick={() => setMode("manual")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              mode === "manual"
                ? "bg-teal-500/15 text-teal-700 shadow-xs dark:text-teal-300"
                : "text-fg-tertiary hover:text-fg-secondary"
            }`}
          >
            <ListChecks className="size-3.5" />
            Direct Wallet Addresses
          </button>
          <button
            type="button"
            onClick={() => setMode("farcaster")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              mode === "farcaster"
                ? "bg-teal-500/15 text-teal-700 shadow-xs dark:text-teal-300"
                : "text-fg-tertiary hover:text-fg-secondary"
            }`}
          >
            <Sparkles className="size-3.5" />
            Farcaster & Club Resolver
          </button>
        </div>

        {mode === "manual" ? (
          <>
            <label className="flex flex-col gap-2 text-sm font-medium">
              Recipient wallets
              <textarea
                value={input}
                onChange={(changeEvent) => setInput(changeEvent.target.value)}
                placeholder={"One address per line\n0x1111...\n0x2222..."}
                spellCheck={false}
                rows={5}
                className="min-h-28 rounded-md border border-input bg-transparent px-3 py-2 font-mono text-xs outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-teal-400"
              />
            </label>

            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" onClick={buildFromManual} disabled={!input.trim()}>
                Build list and codes
              </Button>
              {parsed ? (
                <span className="text-xs text-fg-tertiary tabular-nums" role="status">
                  {formatCount(parsed.addresses.length)} usable
                  {parsed.duplicates ? `, ${parsed.duplicates} duplicate` : ""}
                  {parsed.invalid.length
                    ? `, ${parsed.invalid.length} not an address`
                    : ""}
                </span>
              ) : null}
            </div>

            {parsed && parsed.invalid.length ? (
              <p role="alert" className="rounded-lg border border-amber-400/30 bg-amber-400/[0.06] p-3 text-xs leading-5 text-amber-700 dark:text-amber-300">
                Skipped, not an address: {parsed.invalid.slice(0, 8).join(", ")}
                {parsed.invalid.length > 8
                  ? ` and ${parsed.invalid.length - 8} more`
                  : ""}
              </p>
            ) : null}
          </>
        ) : (
          <div className="flex flex-col gap-4 rounded-lg border border-border/70 bg-background/40 p-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-fg-tertiary">
                NPC Club & Farcaster Resolver
              </span>
              <p className="text-xs text-fg-secondary">
                Resolve verified Ethereum addresses from channel followers, Farcaster handles, or FIDs with an optional snapshot cutoff.
              </p>
            </div>

            {/* Presets */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-fg-tertiary">Quick Club Presets</span>
              <div className="flex flex-wrap gap-2">
                {PRESET_CHANNELS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() =>
                      setSelectedChannel(selectedChannel === preset.id ? "" : preset.id)
                    }
                    className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs transition-colors ${
                      selectedChannel === preset.id
                        ? "border-teal-500 bg-teal-500/15 text-teal-700 dark:text-teal-300 font-medium"
                        : "border-border/70 bg-background/60 text-fg-secondary hover:border-border"
                    }`}
                  >
                    <Users className="size-3" />
                    {preset.label}
                    <span className="font-mono text-[10px] opacity-60">{preset.hint}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 text-xs font-medium">
                Channel / Club Key
                <input
                  type="text"
                  value={selectedChannel}
                  onChange={(e) => setSelectedChannel(e.target.value)}
                  placeholder="e.g. tessera or npc"
                  className="rounded-md border border-input bg-transparent px-3 py-1.5 font-mono text-xs outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-teal-400"
                />
              </label>

              <label className="flex flex-col gap-1.5 text-xs font-medium">
                Snapshot Cutoff (Optional)
                <input
                  type="datetime-local"
                  value={snapshotDate}
                  onChange={(e) => setSnapshotDate(e.target.value)}
                  className="rounded-md border border-input bg-transparent px-3 py-1.5 text-xs outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                />
              </label>
            </div>

            <label className="flex flex-col gap-1.5 text-xs font-medium">
              Farcaster Handles, FIDs, or Wallets
              <textarea
                value={farcasterInput}
                onChange={(e) => setFarcasterInput(e.target.value)}
                placeholder={"@dominion, @dwr, vitalik.eth, fid:123\nOr mix in raw 0x addresses"}
                rows={3}
                spellCheck={false}
                className="rounded-md border border-input bg-transparent px-3 py-2 font-mono text-xs outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-teal-400"
              />
            </label>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <label className="flex cursor-pointer items-center gap-2 text-xs text-fg-secondary select-none">
                <input
                  type="checkbox"
                  checked={includeAllWallets}
                  onChange={(e) => setIncludeAllWallets(e.target.checked)}
                  className="rounded border-input text-teal-600 focus:ring-teal-400"
                />
                Include all verified wallets for each member
              </label>

              <Button
                type="button"
                onClick={resolveFarcasterMembers}
                disabled={resolving || (!selectedChannel.trim() && !farcasterInput.trim())}
                className="gap-2"
              >
                {resolving ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    Resolving members...
                  </>
                ) : (
                  <>
                    <Sparkles className="size-3.5" />
                    Resolve and build codes
                  </>
                )}
              </Button>
            </div>

            {resolveError ? (
              <p role="alert" className="text-xs text-red-600 dark:text-red-300">
                {resolveError}
              </p>
            ) : null}

            {resolvedMembers.length > 0 ? (
              <div className="flex flex-col gap-2 rounded-md border border-border/60 bg-background/50 p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-teal-700 dark:text-teal-300">
                    Resolved {formatCount(resolvedMembers.length)} address commitments
                  </span>
                  {unresolvedItems.length > 0 ? (
                    <span className="text-amber-600 dark:text-amber-400">
                      {formatCount(unresolvedItems.length)} unresolved
                    </span>
                  ) : null}
                </div>
                <div className="max-h-40 overflow-y-auto divide-y divide-border/40 text-xs">
                  {resolvedMembers.slice(0, 15).map((m, idx) => (
                    <div key={`${m.address}-${idx}`} className="flex items-center justify-between py-1.5">
                      <div className="flex items-center gap-1.5 truncate">
                        {m.username ? (
                          <span className="font-semibold text-fg-primary">@{m.username}</span>
                        ) : (
                          <span className="text-fg-tertiary">Direct Wallet</span>
                        )}
                        {m.fid ? <span className="font-mono text-[10px] text-fg-tertiary">fid:{m.fid}</span> : null}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] px-1 py-0 uppercase">
                          {m.source}
                        </Badge>
                        <span className="font-mono text-[11px] text-fg-secondary">
                          {shortAddress(m.address)}
                        </span>
                      </div>
                    </div>
                  ))}
                  {resolvedMembers.length > 15 ? (
                    <p className="pt-2 text-center text-[11px] text-fg-tertiary">
                      and {resolvedMembers.length - 15} more members resolved
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}

            {unresolvedItems.length > 0 ? (
              <p role="alert" className="rounded-md border border-amber-400/30 bg-amber-400/[0.06] p-2.5 text-xs text-amber-700 dark:text-amber-300">
                Unresolved: {unresolvedItems.slice(0, 5).map((u) => `${u.identifier} (${u.reason})`).join(", ")}
                {unresolvedItems.length > 5 ? ` and ${unresolvedItems.length - 5} more` : ""}
              </p>
            ) : null}
          </div>
        )}

        {buildError ? (
          <p role="alert" className="text-xs text-red-600 dark:text-red-300">
            {buildError}
          </p>
        ) : null}

        {built ? (
          <div className="flex flex-col gap-4 rounded-lg border border-border/70 bg-background/50 p-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-fg-tertiary">
                Commitment for this list
              </span>
              <code className="break-all font-mono text-xs text-fg-secondary">
                {built.root}
              </code>
            </div>

            {matchesRegistered === false ? (
              <p role="alert" className="rounded-lg border border-amber-400/30 bg-amber-400/[0.06] p-3 text-xs leading-5 text-amber-700 dark:text-amber-300">
                This list does not match the commitment already registered for
                this POAP. Claim codes built from it will be rejected onchain.
                Paste the original list to regenerate valid codes.
              </p>
            ) : null}

            {!rootSet ? (
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  onClick={setRoot}
                  disabled={!isCreator || frozen || pending}
                  aria-busy={pending}
                >
                  {pending ? "Confirm in wallet" : "Set invitation list onchain"}
                </Button>
                {!isCreator ? (
                  <span className="text-xs text-fg-tertiary">
                    Connect the creator wallet to submit this.
                  </span>
                ) : frozen ? (
                  <span className="text-xs text-fg-tertiary">
                    The {CREATOR_TIMELOCK_DAYS}-day window has closed.
                  </span>
                ) : null}
              </div>
            ) : matchesRegistered ? (
              <p className="flex items-center gap-2 text-xs text-teal-700 dark:text-teal-300" role="status">
                <Check aria-hidden="true" className="size-4" />
                These claim codes match the commitment stored onchain.
              </p>
            ) : null}

            {hash ? (
              <p className="break-all text-xs text-fg-tertiary">
                Transaction: {hash}
              </p>
            ) : null}
            {error ? (
              <p role="alert" className="text-xs text-red-600 dark:text-red-300">
                {error.message}
              </p>
            ) : null}
          </div>
        ) : null}

        {built ? (
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-medium">
                Claim codes for {formatCount(built.entries.length)} wallets
              </span>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" onClick={downloadCsv}>
                  Download CSV
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={printSheet}
                  disabled={printPending}
                  aria-busy={printPending}
                >
                  {printPending ? "Preparing..." : "Print QR sheet"}
                </Button>
              </div>
            </div>
            <ul className="flex max-h-96 flex-col gap-2 overflow-y-auto pr-1">
              {built.entries.map((entry, index) => {
                const link = allowlistClaimLink(
                  effectiveOrigin,
                  event.eventId,
                  entry.proof
                );
                return (
                  <li
                    key={entry.address}
                    className="flex flex-col gap-2 rounded-md border border-border/70 bg-background/40 p-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {entry.username ? (
                          <span className="flex items-center gap-1 font-semibold text-xs text-fg-primary">
                            <AtSign className="size-3 text-teal-500" />
                            {entry.username}
                          </span>
                        ) : null}
                        <span className="font-mono text-xs text-fg-secondary">
                          {shortAddress(entry.address)}
                        </span>
                        {entry.source ? (
                          <Badge variant="outline" className="text-[9px] px-1 py-0 uppercase">
                            {entry.source}
                          </Badge>
                        ) : null}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <CopyButton value={link} />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setOpenQr(openQr === index ? null : index)
                          }
                        >
                          {openQr === index ? "Hide QR" : "Show QR"}
                        </Button>
                      </div>
                    </div>
                    {openQr === index ? (
                      <div className="flex justify-center py-1">
                        <QrCode
                          value={link}
                          size={140}
                          label={`Claim code for ${entry.address}`}
                        />
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default AllowlistBuilder;

"use client";

import { ArrowUpRight, Wallet } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const TITLE = "Connect a wallet";
const LEAD =
  "Your wallet is your account on Tessera. It holds the POAPs you create and collect, and it signs the transactions that put each badge onchain.";
const NOTE =
  "Tessera runs on Base Sepolia, a public network where creating and minting cost nothing. Any wallet that speaks Ethereum works.";

type ConnectPromptProps = {
  variant: "modal" | "page";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onConnect: () => void;
  isConnecting?: boolean;
  walletError?: string | null;
};

/**
 * One prompt, two presentations: the Dialog the Open App buttons trigger,
 * and the full-page card that gates /app. The words are shared constants,
 * so the connect story is the same wherever you meet it.
 *
 * The prompt is presentation only. `onConnect` comes from the host —
 * `useConnectRedirect` — which opens the wallet picker and, once an
 * address actually arrives, closes the prompt and lands the user on
 * the landing page. Nothing navigates on the click itself: navigating
 * before a wallet exists is what made /app surface its own connect
 * prompt as if it opened on page load.
 */
const ConnectPrompt = ({
  variant,
  open,
  onOpenChange,
  onConnect,
  isConnecting = false,
  walletError = null,
}: ConnectPromptProps) => {
  const actions = (
    <div className="flex flex-col gap-4">
      <Button size="lg" className="w-full" onClick={onConnect} disabled={isConnecting} aria-busy={isConnecting}>
        Connect wallet
        <ArrowUpRight aria-hidden="true" />
      </Button>
      {isConnecting ? <p className="text-xs text-fg-tertiary" role="status">Connecting...</p> : null}
      {walletError ? <p className="text-xs text-red-600 dark:text-red-300" role="alert">{walletError}</p> : null}
      <p className="text-xs leading-5 text-fg-tertiary">{NOTE}</p>
    </div>
  );

  const mark = (
    <div
      aria-hidden="true"
      className="flex size-10 items-center justify-center rounded-lg border border-teal-400/30 bg-teal-400/10 text-teal-600 dark:text-teal-300"
    >
      <Wallet className="size-5" />
    </div>
  );

  if (variant === "modal") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            {mark}
            <DialogTitle>{TITLE}</DialogTitle>
            <DialogDescription className="leading-6">{LEAD}</DialogDescription>
          </DialogHeader>
          {actions}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-4">
      <Card className="tile-grout w-full max-w-md gap-6 border-border/70 bg-card/60">
        <CardHeader>
          {mark}
          <CardTitle className="text-xl">{TITLE}</CardTitle>
          <CardDescription className="leading-6">{LEAD}</CardDescription>
        </CardHeader>
        <CardContent>{actions}</CardContent>
      </Card>
    </div>
  );
};

export default ConnectPrompt;

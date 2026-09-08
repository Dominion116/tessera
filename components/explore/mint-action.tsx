"use client";

import { useState } from "react";
import { Check, CircleAlert, WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/components/wallet/wallet-provider";

type MintActionProps = {
  eventName: string;
  method?: "public" | "allowlist" | "signature";
};

const MintAction = ({ eventName, method = "public" }: MintActionProps) => {
  const { address, connect } = useWallet();
  const [status, setStatus] = useState<"idle" | "ready">("idle");

  if (!address) {
    return (
      <Button onClick={connect} size="lg" className="w-full">
        <WalletCards aria-hidden="true" />
        Connect to mint
      </Button>
    );
  }

  if (status === "ready") {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-teal-400/30 bg-teal-400/10 p-4 text-sm text-teal-700 dark:text-teal-300">
        <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
        <p>This {method} mint is prepared for {eventName}. No transaction was submitted.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <Button onClick={() => setStatus("ready")} size="lg" className="w-full">
        Prepare {method} mint
      </Button>
      <p className="flex items-start gap-2 text-xs leading-5 text-fg-tertiary">
        <CircleAlert aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
        The connected wallet is checked before a transaction is prepared. Nothing is submitted from this screen.
      </p>
    </div>
  );
};

export default MintAction;

"use client";

import { LogOut } from "lucide-react";
import { shortAddress } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useWallet } from "@/components/wallet/wallet-provider";

type WalletChipProps = {
  className?: string;
};

/**
 * The connected wallet, compact: a live dot, the short address, and a
 * disconnect control. Rendered in the sidebar footer at `lg` and in the
 * mobile topbar below it.
 */
const WalletChip = ({ className }: WalletChipProps) => {
  const { address, disconnect } = useWallet();

  if (!address) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex h-9 w-full items-center gap-2 rounded-full border border-border/70 bg-card/60 pl-3 pr-1",
        className
      )}
    >
      <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-teal-400" />
      <span className="min-w-0 flex-1 truncate text-sm font-medium tabular-nums">
        {shortAddress(address)}
      </span>
      <button
        type="button"
        onClick={disconnect}
        aria-label="Disconnect wallet"
        className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-fg-tertiary outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-teal-400"
      >
        <LogOut aria-hidden="true" className="size-3.5" />
      </button>
    </div>
  );
};

export default WalletChip;

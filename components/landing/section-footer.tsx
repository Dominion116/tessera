import { Asterisk } from "lucide-react";
import { cn } from "@/lib/utils";
import Reveal from "@/components/landing/reveal";
import ArrowButton from "@/components/landing/arrow-button";
import WalletActionButton from "@/components/wallet/wallet-action-button";

type SectionFooterProps = {
  /** Omitted where the cards above already carry every caveat worth stating. */
  note?: string;
  /** Omitted on sections whose next step is already covered by a neighbour. */
  action?: { label: string; href: string; requiresWallet?: boolean };
  className?: string;
};

/**
 * Closes a section with an optional caveat, and a next step where there is one
 * that is not already offered a screen away. The note earns its place by
 * carrying a constraint the cards above do not state, never by summarising
 * them.
 */
const SectionFooter = ({ note, action, className }: SectionFooterProps) => {
  return (
    <Reveal
      className={cn(
        "flex flex-col items-center justify-center gap-5 text-center",
        className
      )}
    >
      {note ? (
        <p className="flex items-center gap-2 text-sm text-fg-tertiary">
          <Asterisk size={16} aria-hidden="true" className="shrink-0" />
          {note}
        </p>
      ) : null}
      {action ? (
        action.requiresWallet ? (
          <WalletActionButton href={action.href} label={action.label} />
        ) : (
          <ArrowButton href={action.href}>{action.label}</ArrowButton>
        )
      ) : null}
    </Reveal>
  );
};

export default SectionFooter;


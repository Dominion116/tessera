import Link from "next/link";
import { Asterisk } from "lucide-react";
import { cn } from "@/lib/utils";
import Reveal from "@/components/landing/reveal";
import { Button } from "@/components/ui/button";

type SectionFooterProps = {
  /** The one thing worth knowing before acting on the section above. */
  note: string;
  /** Omitted on sections whose next step is already covered by a neighbour. */
  action?: { label: string; href: string };
  className?: string;
};

/**
 * Closes a section with a single caveat, and a next step where there is one that
 * is not already offered a screen away. The note earns its place by carrying a
 * constraint the cards above do not state, never by summarising them.
 */
const SectionFooter = ({ note, action, className }: SectionFooterProps) => {
  return (
    <Reveal
      className={cn(
        "flex flex-col items-center justify-center gap-5 text-center",
        className
      )}
    >
      <p className="flex items-center gap-2 text-sm text-fg-tertiary">
        <Asterisk size={16} aria-hidden="true" className="shrink-0" />
        {note}
      </p>
      {action ? (
        <Button
          asChild
          className="h-auto rounded-full px-5 py-2.5 shadow-xs focus-visible:ring-2 focus-visible:ring-teal-400"
        >
          <Link href={action.href}>{action.label}</Link>
        </Button>
      ) : null}
    </Reveal>
  );
};

export default SectionFooter;


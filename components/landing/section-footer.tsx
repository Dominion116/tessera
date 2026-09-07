import Link from "next/link";
import { ArrowUpRight, Asterisk } from "lucide-react";
import { cn } from "@/lib/utils";
import Reveal from "@/components/landing/reveal";
import { Button } from "@/components/ui/button";

type SectionFooterProps = {
  /** Omitted where the cards above already carry every caveat worth stating. */
  note?: string;
  /** Omitted on sections whose next step is already covered by a neighbour. */
  action?: { label: string; href: string };
  className?: string;
};

/**
 * Closes a section with an optional caveat, and a next step where there is one
 * that is not already offered a screen away. The note earns its place by
 * carrying a constraint the cards above do not state, never by summarising
 * them. The action is the closing panel's arrow pill, copied rather than
 * shared because supplied blocks stay fixed, so the page offers one button
 * treatment from any section to the end.
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
        <Button
          asChild
          className="relative text-sm font-medium rounded-full h-12 p-1 ps-6 pe-14 group transition-all duration-500 hover:ps-14 hover:pe-6 w-fit overflow-hidden hover:bg-primary/80 cursor-pointer"
        >
          <Link href={action.href}>
            <span className="relative z-10 transition-all duration-500">
              {action.label}
            </span>
            <div className="absolute right-1 w-10 h-10 bg-background text-foreground rounded-full flex items-center justify-center transition-all duration-500 group-hover:right-[calc(100%-44px)] group-hover:rotate-45">
              <ArrowUpRight size={16} />
            </div>
          </Link>
        </Button>
      ) : null}
    </Reveal>
  );
};

export default SectionFooter;


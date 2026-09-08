import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type ArrowButtonProps = {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
};

/**
 * The arrow pill every section-to-section action shares: a full pill whose
 * label and trailing arrow circle swap sides on hover, copied verbatim from
 * the closing CTA block so one component owns the button and the motion that
 * used to be written out three times. With `onClick` instead of `href` the
 * same pill becomes a real button, which is how the Open App control opens
 * the connect prompt before a wallet exists.
 */
const ArrowButton = ({ href, onClick, children, className }: ArrowButtonProps) => {
  const inner = (
    <>
      <span className="relative z-10 transition-all duration-500">
        {children}
      </span>
      <div
        aria-hidden="true"
        className="absolute right-1 flex h-10 w-10 items-center justify-center rounded-full bg-background text-foreground transition-all duration-500 group-hover:right-[calc(100%-44px)] group-hover:rotate-45"
      >
        <ArrowUpRight size={16} />
      </div>
    </>
  );

  const classes = cn(
    "group relative h-12 w-fit cursor-pointer overflow-hidden rounded-full p-1 ps-6 pe-14 text-sm font-medium transition-all duration-500 hover:bg-primary/80 hover:ps-14 hover:pe-6",
    className
  );

  if (href) {
    return (
      <Button asChild className={classes}>
        <Link href={href}>{inner}</Link>
      </Button>
    );
  }

  return (
    <Button onClick={onClick} className={classes}>
      {inner}
    </Button>
  );
};

export default ArrowButton;

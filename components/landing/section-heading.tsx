import { cn } from "@/lib/utils";
import Reveal from "@/components/landing/reveal";
import { Badge } from "@/components/ui/badge";

type SectionHeadingProps = {
  eyebrow: string;
  title: React.ReactNode;
  lead?: string;
  /** Centred by default, which is how the feature block sets its headings. */
  align?: "start" | "center";
  className?: string;
};

/**
 * The heading treatment every section below the hero shares: a teal eyebrow
 * pill, one semibold display line at text-3xl growing to text-4xl, and a single
 * paragraph of lead copy. Heading tracking comes from the base layer, so the
 * size and the negative letter-spacing stay tied together.
 */
const SectionHeading = ({
  eyebrow,
  title,
  lead,
  align = "center",
  className,
}: SectionHeadingProps) => {
  const centered = align === "center";

  return (
    <Reveal
      className={cn(
        "flex flex-col gap-4",
        centered && "mx-auto max-w-2xl items-center justify-center text-center",
        className
      )}
    >
      <Badge
        variant="accent"
        className="gap-2 px-3 py-1 text-sm tracking-wide uppercase"
      >
        <span aria-hidden="true" className="size-1.5 rounded-full bg-teal-400" />
        {eyebrow}
      </Badge>
      <h2
        className={cn(
          "text-3xl font-semibold md:text-4xl",
          !centered && "max-w-3xl"
        )}
      >
        {title}
      </h2>
      {lead ? (
        <p
          className={cn(
            "text-base leading-7 text-fg-secondary",
            !centered && "max-w-2xl"
          )}
        >
          {lead}
        </p>
      ) : null}
    </Reveal>
  );
};

export default SectionHeading;


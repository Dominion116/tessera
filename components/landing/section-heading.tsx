import { cn } from "@/lib/utils";
import Reveal from "@/components/landing/reveal";
import { Badge } from "@/components/ui/badge";

type SectionHeadingProps = {
  eyebrow: string;
  title: React.ReactNode;
  lead?: string;
  align?: "start" | "center";
  className?: string;
};

/**
 * The heading treatment every section below the hero shares: a teal eyebrow
 * pill, a tight bold display line, and one paragraph of lead copy.
 */
const SectionHeading = ({
  eyebrow,
  title,
  lead,
  align = "start",
  className,
}: SectionHeadingProps) => {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className
      )}
    >
      <Badge variant="accent" className="gap-2 px-3 py-1 tracking-wide uppercase">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-teal-400" />
        {eyebrow}
      </Badge>
      <h2 className="max-w-3xl text-3xl leading-tight font-bold sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {lead ? (
        <p className="max-w-2xl text-base leading-7 text-fg-secondary">{lead}</p>
      ) : null}
    </Reveal>
  );
};

export default SectionHeading;

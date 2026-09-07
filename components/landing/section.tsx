import { cn } from "@/lib/utils";

type SectionProps = {
  id: string;
  children: React.ReactNode;
  className?: string;
  /** Applies the muted band treatment used to separate adjacent sections. */
  muted?: boolean;
};

/**
 * One rhythm for every section below the hero, taken from the feature block:
 * py-12 climbing to py-20, and gap-8 between a heading and its grid climbing to
 * gap-16. The horizontal container stays px-4 with xl:px-16 so section content
 * lines up with the navbar and the hero rather than with the block's own px-8.
 */
const Section = ({ id, children, className, muted = false }: SectionProps) => {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-24 border-t border-border",
        muted && "bg-muted/40",
        className
      )}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:py-16 md:gap-16 lg:py-20 xl:px-16">
        {children}
      </div>
    </section>
  );
};

export default Section;


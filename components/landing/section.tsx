import { cn } from "@/lib/utils";

type SectionProps = {
  id: string;
  children: React.ReactNode;
  className?: string;
  /** Applies the muted band treatment used to separate adjacent sections. */
  muted?: boolean;
};

/**
 * One horizontal rhythm for the whole page, matching the hero's container:
 * max-w-7xl with px-4 and xl:px-16.
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
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-20 sm:gap-14 sm:py-24 xl:px-16">
        {children}
      </div>
    </section>
  );
};

export default Section;

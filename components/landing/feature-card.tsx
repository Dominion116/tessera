import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

type FeatureCardProps = {
  /** One size and one stroke weight everywhere, so the cards read as a set. */
  icon?: LucideIcon;
  title?: React.ReactNode;
  /** Sits opposite the icon: a step number, a mint window, a tag. */
  meta?: React.ReactNode;
  /** One line under the title, ahead of the body. */
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
};

/**
 * The card the sections below the hero are built from, and the only place its
 * padding, icon treatment and title size are decided. Body copy inside it is
 * `text-base leading-7 text-fg-secondary`, which is why the grids stop at three
 * across: past that the measure gets too narrow for that size.
 *
 * The 4 px top edge is always present and only changes colour on hover, so the
 * highlight costs no layout.
 */
const FeatureCard = ({
  icon: Icon,
  title,
  meta,
  subtitle,
  children,
  className,
}: FeatureCardProps) => {
  return (
    <Card
      className={cn(
        "group h-full border-border/70 border-t-4 border-t-transparent bg-card/60 py-10 tile-grout transition-colors duration-200 hover:border-t-teal-400",
        className
      )}
    >
      <CardContent className="flex flex-1 flex-col gap-6 px-8">
        {Icon || meta ? (
          <div className="flex items-start justify-between gap-4">
            {Icon ? (
              <Icon
                aria-hidden="true"
                strokeWidth={1.2}
                className="size-8 shrink-0 text-teal-600 dark:text-teal-300"
              />
            ) : null}
            {meta}
          </div>
        ) : null}
        <div className="flex flex-1 flex-col gap-3">
          {title ? <h3 className="text-xl font-semibold">{title}</h3> : null}
          {subtitle ? (
            <p className="-mt-1 text-sm text-fg-tertiary">{subtitle}</p>
          ) : null}
          {children}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;

import { Card, CardContent } from "@/components/ui/card";

export type Milestone = {
  day: string;
  label: string;
  title: string;
  body: string;
  /** Position along the track, as a percentage of the full window. */
  at: number;
  /** Warning box rendered under this milestone, used for the day-30 freeze. */
  warning?: string;
};

/**
 * Day 0 to day 37 on one track. Milestones arrive as props, so any screen
 * that knows the dates renders the same timeline. The parent wraps it in its
 * own reveal.
 */
const LifecycleTimeline = ({ milestones }: { milestones: Milestone[] }) => {
  return (
    <Card className="gap-8 border-border/70 bg-card/60 py-8 tile-grout">
      <CardContent className="flex flex-col gap-8">
        {/* Track. Decorative, so the milestone list below carries the meaning. */}
        <div aria-hidden="true" className="relative hidden h-1 md:block">
          <div className="absolute inset-0 rounded-full bg-border" />
          <div className="absolute inset-y-0 left-0 w-[81%] rounded-full bg-teal-400/70" />
          {milestones.map((milestone) => (
            <span
              key={milestone.day}
              style={{ left: `${milestone.at * 100}%` }}
              className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background bg-teal-400"
            />
          ))}
        </div>

        <ol className="grid gap-6 md:grid-cols-3">
          {milestones.map((milestone) => (
            <li key={milestone.day} className="flex flex-col gap-2">
              <p className="text-sm font-semibold tabular-nums text-teal-600 dark:text-teal-300">
                {milestone.day}
              </p>
              <p className="text-xs tracking-wide text-fg-tertiary uppercase">
                {milestone.label}
              </p>
              <p className="pt-1 text-base font-semibold">{milestone.title}</p>
              <p className="text-sm leading-6 text-fg-secondary">
                {milestone.body}
              </p>
              {milestone.warning ? (
                <p className="mt-1 rounded-lg border border-teal-400/30 bg-teal-400/10 px-3 py-2 text-xs leading-5 text-teal-700 dark:text-teal-200">
                  {milestone.warning}
                </p>
              ) : null}
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
};

export default LifecycleTimeline;

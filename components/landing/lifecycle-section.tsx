import Section from "@/components/landing/section";
import SectionHeading from "@/components/landing/section-heading";
import Reveal from "@/components/landing/reveal";
import { Card, CardContent } from "@/components/ui/card";
import {
  CREATOR_MINT_BATCH_LIMIT,
  CREATOR_TIMELOCK_DAYS,
  SIGNATURE_WINDOW_DAYS,
} from "@/lib/poap-data";

type Milestone = {
  day: string;
  label: string;
  title: string;
  body: string;
  /** Position along the track, as a percentage of the full window. */
  at: number;
};

const MILESTONES: Milestone[] = [
  {
    day: "Day 0",
    label: "Registration",
    title: "The badge exists",
    body: "Artwork and details are written onchain and the event gets its number. Minting can start immediately.",
    at: 0,
  },
  {
    day: `Day ${CREATOR_TIMELOCK_DAYS}`,
    label: "Creator controls end",
    title: "Your settings freeze",
    body: `Last day to attach an invitation list, change whether the badge is open to everyone, or drop badges into wallets yourself in batches of up to ${CREATOR_MINT_BATCH_LIMIT}.`,
    at: 30 / 37,
  },
  {
    day: `Day ${SIGNATURE_WINDOW_DAYS}`,
    label: "Door codes end",
    title: "Approvals stop working",
    body: "Codes you approved at the venue stop being accepted. Open minting and invitation lists carry on with no end date.",
    at: 1,
  },
];

const LifecycleSection = () => {
  return (
    <Section id="lifecycle">
      <SectionHeading
        eyebrow="The clock"
        title="Two deadlines, both counted from the moment you register."
        lead="Neither one is measured from your event date. They start when the registration transaction confirms, which is worth knowing if you register weeks in advance."
      />

      <Reveal>
        <Card className="gap-8 border-border/70 bg-card/60 py-8 tile-grout">
          <CardContent className="flex flex-col gap-8">
            {/* Track. Decorative, so the milestone list below carries the meaning. */}
            <div aria-hidden="true" className="relative hidden h-1 md:block">
              <div className="absolute inset-0 rounded-full bg-border" />
              <div className="absolute inset-y-0 left-0 w-[81%] rounded-full bg-teal-400/70" />
              {MILESTONES.map((milestone) => (
                <span
                  key={milestone.day}
                  style={{ left: `${milestone.at * 100}%` }}
                  className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background bg-teal-400"
                />
              ))}
            </div>

            <ol className="grid gap-6 md:grid-cols-3">
              {MILESTONES.map((milestone, i) => (
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
                  {i === 1 ? (
                    <p className="mt-1 rounded-lg border border-teal-400/30 bg-teal-400/10 px-3 py-2 text-xs leading-5 text-teal-700 dark:text-teal-200">
                      Whether the badge is open to everyone is whatever it was at this
                      moment, permanently. It is the one setting worth a calendar
                      reminder.
                    </p>
                  ) : null}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </Reveal>
    </Section>
  );
};

export default LifecycleSection;


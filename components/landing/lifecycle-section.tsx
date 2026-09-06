import { CalendarClock, Flag, Lock } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Section from "@/components/landing/section";
import SectionHeading from "@/components/landing/section-heading";
import SectionFooter from "@/components/landing/section-footer";
import Reveal from "@/components/landing/reveal";
import FeatureCard from "@/components/landing/feature-card";
import {
  CREATOR_MINT_BATCH_LIMIT,
  CREATOR_TIMELOCK_DAYS,
  SIGNATURE_WINDOW_DAYS,
} from "@/lib/poap-data";

/** Day 30 as a fraction of the 37-day window, so the track stays honest. */
const TIMELOCK_FRACTION = CREATOR_TIMELOCK_DAYS / SIGNATURE_WINDOW_DAYS;

type Milestone = {
  icon: LucideIcon;
  day: string;
  label: string;
  title: string;
  body: string;
  /** Position along the 37-day track, as a fraction of the full window. */
  at: number;
  /** Only the middle milestone carries a warning, so this stays optional. */
  warning?: string;
};

const MILESTONES: Milestone[] = [
  {
    icon: Flag,
    day: "Day 0",
    label: "Registration",
    title: "The badge exists",
    body: "Artwork and details are written onchain and the event gets its number. Minting can start the same minute.",
    at: 0,
  },
  {
    icon: Lock,
    day: `Day ${CREATOR_TIMELOCK_DAYS}`,
    label: "Creator controls end",
    title: "Your settings freeze",
    body: `Last day to attach an invitation list, change whether the badge is open to everyone, or drop badges into wallets yourself in batches of up to ${CREATOR_MINT_BATCH_LIMIT}.`,
    at: TIMELOCK_FRACTION,
    warning:
      "Whether the badge is open to everyone is whatever it was at this moment, permanently. It is the one setting worth a calendar reminder.",
  },
  {
    icon: CalendarClock,
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
        title="Two deadlines, both counted from the moment you register"
        lead="Neither one is measured from your event date. They start when the registration transaction confirms, which is worth knowing if you register weeks in advance."
      />

      <div className="flex flex-col gap-8 md:gap-10">
        {/* The 37-day window drawn to scale, so day 30 sits at 30/37 along rather
            than halfway. Decorative: the cards below carry the meaning. */}
        <div aria-hidden="true" className="relative hidden h-1 md:block">
          <span className="absolute inset-0 rounded-full bg-border" />
          <span
            style={{ width: `${TIMELOCK_FRACTION * 100}%` }}
            className="absolute inset-y-0 left-0 rounded-full bg-teal-400/70"
          />
          {MILESTONES.map((milestone) => (
            <span
              key={milestone.day}
              style={{ left: `${milestone.at * 100}%` }}
              className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background bg-teal-400"
            />
          ))}
        </div>

        <ol className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MILESTONES.map((milestone, i) => (
            <li key={milestone.day} className="h-full">
              <Reveal index={i} className="h-full">
                <FeatureCard
                  icon={milestone.icon}
                  title={milestone.title}
                  subtitle={milestone.label}
                  meta={
                    <span className="text-sm font-semibold tabular-nums text-teal-600 dark:text-teal-300">
                      {milestone.day}
                    </span>
                  }
                >
                  <p className="text-base leading-7 text-fg-secondary">
                    {milestone.body}
                  </p>
                  {milestone.warning ? (
                    <p className="mt-auto rounded-lg border border-teal-400/30 bg-teal-400/10 px-4 py-3 text-sm leading-6 text-teal-700 dark:text-teal-200">
                      {milestone.warning}
                    </p>
                  ) : null}
                </FeatureCard>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>

      <SectionFooter note="Registering the week before the event leaves the door codes live for a month afterwards" />
    </Section>
  );
};

export default LifecycleSection;

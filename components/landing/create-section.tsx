import { ImageIcon, PenLine, SlidersHorizontal } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Section from "@/components/landing/section";
import SectionHeading from "@/components/landing/section-heading";
import SectionFooter from "@/components/landing/section-footer";
import Reveal from "@/components/landing/reveal";
import FeatureCard from "@/components/landing/feature-card";
import { CREATOR_TIMELOCK_DAYS } from "@/lib/poap-data";

type Step = {
  n: string;
  icon: LucideIcon;
  title: string;
  body: string;
  /** The small print under the rule: what the interface refuses, or what it costs. */
  note: string;
};

const STEPS: Step[] = [
  {
    n: "01",
    icon: PenLine,
    title: "Say what the event was",
    body: "The name is the one field you cannot skip, up to 128 bytes of it. Description, date, location and a link to your own site are optional, and leaving them out does not make the badge look unfinished.",
    note: "Quotes and backslashes are rejected at the input, because they would corrupt the badge's details permanently.",
  },
  {
    n: "02",
    icon: ImageIcon,
    title: "Drop in the artwork",
    body: "One SVG, optimized in your browser before it goes anywhere. The projected onchain size updates as you work, so the cost of the transaction is visible before you send it rather than after.",
    note: "Stay under roughly 100 KB. Larger files still register, but the gas climbs fast.",
  },
  {
    n: "03",
    icon: SlidersHorizontal,
    title: "Choose how it behaves",
    body: "Transferable, or bound to the wallet that minted it. Open to anyone with the link, or limited to a list you supply. Both are set here in plain language, with the wording saying which one you can still change afterwards.",
    note: `Whether the badge is open to everyone freezes permanently ${CREATOR_TIMELOCK_DAYS} days after registration.`,
  },
];

const CreateSection = () => {
  return (
    <Section id="create" muted>
      <SectionHeading
        eyebrow="Creating one"
        title="Three decisions, then the badge exists"
        lead="Registration is a single transaction. Everything the badge will ever say about your event is settled in that one step, so each choice is shown with what it costs you later."
      />

      <ol className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {STEPS.map((step, i) => (
          <li key={step.n} className="h-full">
            <Reveal index={i} className="h-full">
              <FeatureCard
                icon={step.icon}
                title={step.title}
                meta={
                  <span className="text-sm font-semibold tabular-nums text-fg-tertiary">
                    {step.n}
                  </span>
                }
              >
                <p className="text-base leading-7 text-fg-secondary">
                  {step.body}
                </p>
                <p className="mt-auto border-t border-border/70 pt-4 text-sm leading-6 text-fg-tertiary">
                  {step.note}
                </p>
              </FeatureCard>
            </Reveal>
          </li>
        ))}
      </ol>

      <SectionFooter
        note="The event number is yours the moment the transaction confirms"
        action={{ label: "Create a POAP", href: "/app/create" }}
      />
    </Section>
  );
};

export default CreateSection;


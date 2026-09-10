import { PenLine, QrCode, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Section from "@/components/landing/section";
import SectionHeading from "@/components/landing/section-heading";
import SectionFooter from "@/components/landing/section-footer";
import Reveal from "@/components/landing/reveal";
import FeatureCard from "@/components/landing/feature-card";
import { CREATOR_TIMELOCK_DAYS, SIGNATURE_WINDOW_DAYS } from "@/lib/poap-data";

type Step = {
  n: string;
  icon: LucideIcon;
  title: string;
  body: string;
  /** The small print under the rule: the deadline that ends it, or the cost of relying on it. */
  note: string;
};

const STEPS: Step[] = [
  {
    n: "01",
    icon: PenLine,
    title: "Register",
    body: "One transaction settles everything the badge will ever say about your event, and how it behaves. Open to anyone or invitation list, bound to the wallet or free to move, the choices are made here in plain language.",
    note: `Whether the badge is open to everyone freezes permanently ${CREATOR_TIMELOCK_DAYS} days after registration.`,
  },
  {
    n: "02",
    icon: QrCode,
    title: "Hand out",
    body: "Run one route or all three at once: the open link, the invitation list, or codes at the door. Every route checks the same claim record, so no wallet mints twice.",
    note: `Codes at the door stop working ${SIGNATURE_WINDOW_DAYS} days after registration. The other routes have no deadline.`,
  },
  {
    n: "03",
    icon: ShieldCheck,
    title: "Prove",
    body: "Details and artwork live in the contract, so anyone can check a holder with a block explorer, the app, or their own script. No account, no middle layer.",
    note: "Tessera runs no database and no indexer. A clean clone of this app needs one network URL and nothing else.",
  },
];

/**
 * The whole life of a badge in three cards: one transaction creates it, the
 * routes hand it out, and the proof is a read from the contract.
 */
const HowItWorksSection = () => {
  return (
    <Section id="how-it-works" muted className="how-it-works-section">
      <SectionHeading
        className="max-w-3xl"
        eyebrow="How it works"
        title="Register once, hand it out, and the proof takes care of itself"
        lead="One transaction makes the badge, the routes hand it out, and checking the result needs nothing but the chain."
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
        action={{ label: "Create a POAP", href: "/app/create", requiresWallet: true }}
      />
    </Section>
  );
};

export default HowItWorksSection;

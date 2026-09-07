import { ArrowLeftRight, Lock } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Section from "@/components/landing/section";
import SectionHeading from "@/components/landing/section-heading";
import SectionFooter from "@/components/landing/section-footer";
import Reveal from "@/components/landing/reveal";
import FeatureCard from "@/components/landing/feature-card";
import { Badge } from "@/components/ui/badge";

type Option = {
  icon: LucideIcon;
  title: string;
  tag: string;
  summary: string;
  yes: string[];
  no: string[];
  choose: string;
};

const OPTIONS: Option[] = [
  {
    icon: Lock,
    title: "Bound to the wallet",
    tag: "Soulbound",
    summary:
      "The badge cannot leave the wallet that minted it. There is no sale, no transfer, no gifting it to a friend.",
    yes: ["Attendance means attendance", "Cannot be bought after the fact"],
    no: ["No transfers, ever", "A lost wallet is a lost badge"],
    choose:
      "Choose this when the badge is evidence. A conference certificate that can be resold is not evidence of anything.",
  },
  {
    icon: ArrowLeftRight,
    title: "Free to move",
    tag: "Transferable",
    summary:
      "The badge behaves like any other collectible. Holders can send it, trade it, or move it to a different wallet.",
    yes: ["Moves between your own wallets", "Can be traded or gifted"],
    no: ["Holding it no longer proves attendance", "Can end up anywhere"],
    choose:
      "Choose this when the artwork is the point, or when holders will reasonably want to consolidate wallets later.",
  },
];

const SoulboundSection = () => {
  return (
    <Section id="soulbound" muted>
      <SectionHeading
        eyebrow="Bound or transferable"
        title="Decide whether the badge can ever change hands"
        lead="This is set once at registration and never changes. It is the difference between a badge that proves you were in the room and a collectible that happens to mention a room."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {OPTIONS.map((option, i) => (
          <Reveal key={option.title} index={i} className="h-full">
            <FeatureCard
              icon={option.icon}
              title={option.title}
              meta={<Badge variant="accent">{option.tag}</Badge>}
            >
              <p className="text-base leading-7 text-fg-secondary">
                {option.summary}
              </p>
              <div className="grid gap-6 pt-1 sm:grid-cols-2">
                <div className="flex flex-col gap-3">
                  <p className="text-sm tracking-wide text-fg-tertiary uppercase">
                    What you get
                  </p>
                  <ul className="flex flex-col gap-2">
                    {option.yes.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2 text-base leading-7 text-fg-secondary"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-3 size-1.5 shrink-0 rounded-full bg-teal-400"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col gap-3">
                  <p className="text-sm tracking-wide text-fg-tertiary uppercase">
                    What you give up
                  </p>
                  <ul className="flex flex-col gap-2">
                    {option.no.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2 text-base leading-7 text-fg-secondary"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-3 size-1.5 shrink-0 rounded-full bg-border"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="mt-auto border-t border-border/70 pt-4 text-base leading-7">
                {option.choose}
              </p>
            </FeatureCard>
          </Reveal>
        ))}
      </div>

      <SectionFooter note="Nothing in the contract can flip this later, not even for the creator" />
    </Section>
  );
};

export default SoulboundSection;

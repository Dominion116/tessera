import { ArrowLeftRight, Lock } from "lucide-react";
import Section from "@/components/landing/section";
import SectionHeading from "@/components/landing/section-heading";
import Reveal from "@/components/landing/reveal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Option = {
  icon: React.ReactNode;
  title: string;
  summary: string;
  yes: string[];
  no: string[];
  choose: string;
};

const OPTIONS: Option[] = [
  {
    icon: <Lock size={18} aria-hidden="true" />,
    title: "Bound to the wallet",
    summary:
      "The badge cannot leave the wallet that minted it. There is no sale, no transfer, no gifting it to a friend.",
    yes: ["Attendance means attendance", "Cannot be bought after the fact"],
    no: ["No transfers, ever", "A lost wallet is a lost badge"],
    choose:
      "Choose this when the badge is evidence. A conference certificate that can be resold is not evidence of anything.",
  },
  {
    icon: <ArrowLeftRight size={18} aria-hidden="true" />,
    title: "Free to move",
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
        title="Decide whether the badge can ever change hands."
        lead="This is set once at registration and never changes. It is the difference between a badge that proves you were in the room and a collectible that happens to mention a room."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {OPTIONS.map((option, i) => (
          <Reveal key={option.title} index={i} className="h-full">
            <Card className="flex h-full flex-col gap-5 border-border/70 bg-card/60 tile-grout">
              <CardHeader>
                <span className="flex size-10 items-center justify-center rounded-lg bg-teal-400/10 text-teal-600 dark:text-teal-300">
                  {option.icon}
                </span>
                <CardTitle className="pt-4 text-xl font-semibold">
                  {option.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-5">
                <p className="text-sm leading-6 text-fg-secondary">
                  {option.summary}
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <p className="text-xs tracking-wide text-fg-tertiary uppercase">
                      What you get
                    </p>
                    <ul className="flex flex-col gap-2">
                      {option.yes.map((item) => (
                        <li
                          key={item}
                          className="flex gap-2 text-sm leading-6 text-fg-secondary"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-2 size-1.5 shrink-0 rounded-full bg-teal-400"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-xs tracking-wide text-fg-tertiary uppercase">
                      What you give up
                    </p>
                    <ul className="flex flex-col gap-2">
                      {option.no.map((item) => (
                        <li
                          key={item}
                          className="flex gap-2 text-sm leading-6 text-fg-secondary"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-2 size-1.5 shrink-0 rounded-full bg-border"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <p className="mt-auto border-t border-border/70 pt-4 text-sm leading-6">
                  {option.choose}
                </p>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
};

export default SoulboundSection;


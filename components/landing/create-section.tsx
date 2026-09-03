import { ImageIcon, PenLine, Send, SlidersHorizontal } from "lucide-react";
import Section from "@/components/landing/section";
import SectionHeading from "@/components/landing/section-heading";
import Reveal from "@/components/landing/reveal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Step = {
  n: string;
  icon: React.ReactNode;
  title: string;
  body: string;
  note: string;
};

const STEPS: Step[] = [
  {
    n: "01",
    icon: <PenLine size={18} aria-hidden="true" />,
    title: "Name the event",
    body: "Up to 128 bytes, and the one field you cannot skip. Description, date, location and an external link are all optional.",
    note: "Quotes and backslashes are rejected at the input, because they would corrupt the badge for good.",
  },
  {
    n: "02",
    icon: <ImageIcon size={18} aria-hidden="true" />,
    title: "Drop in the artwork",
    body: "One SVG. It is optimized in your browser before it goes anywhere, and you see the projected onchain size as you work.",
    note: "Stay under roughly 100 KB. Larger files still register, but the gas climbs fast.",
  },
  {
    n: "03",
    icon: <SlidersHorizontal size={18} aria-hidden="true" />,
    title: "Choose how it behaves",
    body: "Transferable or bound to the wallet that minted it. Open to anyone or invitation only. Both choices are set here in plain language.",
    note: "Whether the badge is open to everyone freezes permanently 30 days after registration.",
  },
  {
    n: "04",
    icon: <Send size={18} aria-hidden="true" />,
    title: "Hand it out",
    body: "Share a link, drop it into a list of wallets yourself, or put a code on the wall at the venue and let people mint as they arrive.",
    note: "You keep the event number the moment the transaction confirms.",
  },
];

const CreateSection = () => {
  return (
    <Section id="create" muted>
      <SectionHeading
        eyebrow="Creating one"
        title="Four decisions, then the badge exists."
        lead="Registration is a single transaction. Everything the badge will ever say about your event is decided in this one step, so the interface spells out what each choice costs you later."
      />

      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, i) => (
          <li key={step.n} className="h-full">
            <Reveal index={i} className="h-full">
              <Card className="h-full gap-4 border-border/70 bg-card/60 tile-grout">
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-teal-400/10 text-teal-600 dark:text-teal-300">
                      {step.icon}
                    </span>
                    <span className="text-sm font-semibold tabular-nums text-fg-tertiary">
                      {step.n}
                    </span>
                  </div>
                  <CardTitle className="pt-4 text-lg font-semibold">
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <p className="text-sm leading-6 text-fg-secondary">{step.body}</p>
                  <p className="border-t border-border/70 pt-3 text-xs leading-5 text-fg-tertiary">
                    {step.note}
                  </p>
                </CardContent>
              </Card>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
};

export default CreateSection;

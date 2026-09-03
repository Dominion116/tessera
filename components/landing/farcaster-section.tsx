import { MessageCircle, Share2, Zap } from "lucide-react";
import Section from "@/components/landing/section";
import SectionHeading from "@/components/landing/section-heading";
import Reveal from "@/components/landing/reveal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const POINTS = [
  {
    icon: <Zap size={18} aria-hidden="true" />,
    title: "Already connected",
    body: "Opened from a cast, your Farcaster wallet is connected before the first screen finishes drawing. No modal, no picking a wallet from a list.",
  },
  {
    icon: <Share2 size={18} aria-hidden="true" />,
    title: "Mint, then cast it",
    body: "The badge you just collected goes back into the feed as an image with its own mint button, so the people who see it can collect it in the same place.",
  },
  {
    icon: <MessageCircle size={18} aria-hidden="true" />,
    title: "The same badges either way",
    body: "One contract stands behind the app and the website. A badge minted in a feed shows up in the browser gallery immediately, and the reverse.",
  },
];

const FarcasterSection = () => {
  return (
    <Section id="farcaster" muted>
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <SectionHeading
          eyebrow="In the feed"
          title="Runs as a Farcaster app, not a website in a frame."
          lead="Same badges, same contract, built for the place people are already scrolling. Collecting takes one tap and never leaves the feed."
        />

        <div className="grid gap-4">
          {POINTS.map((point, i) => (
            <Reveal key={point.title} index={i}>
              <Card className="gap-4 border-border/70 bg-card/60 tile-grout sm:flex-row sm:items-start sm:gap-5">
                <CardHeader className="sm:pr-0">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-teal-400/10 text-teal-600 dark:text-teal-300">
                    {point.icon}
                  </span>
                </CardHeader>
                <CardContent className="flex flex-col gap-1.5 sm:pl-0">
                  <CardTitle className="text-base font-semibold">
                    {point.title}
                  </CardTitle>
                  <p className="text-sm leading-6 text-fg-secondary">{point.body}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default FarcasterSection;


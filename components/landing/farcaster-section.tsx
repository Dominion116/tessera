import { MessageCircle, Share2, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Section from "@/components/landing/section";
import SectionHeading from "@/components/landing/section-heading";
import SectionFooter from "@/components/landing/section-footer";
import Reveal from "@/components/landing/reveal";
import FeatureCard from "@/components/landing/feature-card";

type Point = {
  icon: LucideIcon;
  title: string;
  body: string;
};

const POINTS: Point[] = [
  {
    icon: Zap,
    title: "Already connected",
    body: "Opened from a cast, your Farcaster wallet is connected before the first screen finishes drawing. No modal, no picking a wallet from a list.",
  },
  {
    icon: Share2,
    title: "Mint, then cast it",
    body: "The badge you just collected goes back into the feed as an image with its own mint button, so the people who see it can collect it in the same place.",
  },
  {
    icon: MessageCircle,
    title: "The same badges either way",
    body: "One contract stands behind the app and the website. A badge minted in a feed shows up in the browser gallery immediately, and the reverse.",
  },
];

const FarcasterSection = () => {
  return (
    <Section id="farcaster" muted>
      <SectionHeading
        eyebrow="In the feed"
        title="Runs as a Farcaster app, not a website in a frame"
        lead="Same badges, same contract, built for the place people are already scrolling. Collecting takes one tap and never leaves the feed."
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {POINTS.map((point, i) => (
          <Reveal key={point.title} index={i} className="h-full">
            <FeatureCard icon={point.icon} title={point.title}>
              <p className="text-base leading-7 text-fg-secondary">{point.body}</p>
            </FeatureCard>
          </Reveal>
        ))}
      </div>

      <SectionFooter
        note="Nothing about the badge changes with where it was minted"
        action={{ label: "Open the app", href: "/app" }}
      />
    </Section>
  );
};

export default FarcasterSection;

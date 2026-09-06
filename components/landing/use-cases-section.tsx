import { GraduationCap, Mic, Radio, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Section from "@/components/landing/section";
import SectionHeading from "@/components/landing/section-heading";
import SectionFooter from "@/components/landing/section-footer";
import Reveal from "@/components/landing/reveal";
import FeatureCard from "@/components/landing/feature-card";

type Case = {
  icon: LucideIcon;
  title: string;
  setup: string;
  body: string;
};

const CASES: Case[] = [
  {
    icon: Mic,
    title: "Conferences",
    setup: "Codes at the door, bound",
    body: "Attendees mint as they collect their lanyard. Because the badge cannot be transferred, holding it a year later still means they were in the room.",
  },
  {
    icon: Users,
    title: "Meetups",
    setup: "Open link, transferable",
    body: "Post the link in the group chat after the talk. Nothing to prepare in advance, and regulars end up with a run of badges from the same series.",
  },
  {
    icon: GraduationCap,
    title: "Courses and cohorts",
    setup: "Invitation list, bound",
    body: "The roster is the list. Attach it after registration so people who join in week two are not locked out of their certificate.",
  },
  {
    icon: Radio,
    title: "Streams and launches",
    setup: "Open link, transferable",
    body: "One badge for everyone watching live. Send it to wallets yourself afterwards if you collected addresses during the stream.",
  },
];

const UseCasesSection = () => {
  return (
    <Section id="use-cases">
      <SectionHeading
        eyebrow="In practice"
        title="What people set up, and why"
        lead="The same handful of settings covers most events. These are the combinations that come up again and again, with the reasoning behind each one."
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {CASES.map((item, i) => (
          <Reveal key={item.title} index={i} className="h-full">
            <FeatureCard
              icon={item.icon}
              title={item.title}
              subtitle={item.setup}
            >
              <p className="text-base leading-7 text-fg-secondary">{item.body}</p>
            </FeatureCard>
          </Reveal>
        ))}
      </div>

      <SectionFooter note="Running all three routes at once is normal, and no wallet can claim twice" />
    </Section>
  );
};

export default UseCasesSection;

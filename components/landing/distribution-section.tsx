import { Globe, ListChecks, QrCode } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Section from "@/components/landing/section";
import SectionHeading from "@/components/landing/section-heading";
import SectionFooter from "@/components/landing/section-footer";
import Reveal from "@/components/landing/reveal";
import FeatureCard from "@/components/landing/feature-card";
import { Badge } from "@/components/ui/badge";
import { SIGNATURE_WINDOW_DAYS } from "@/lib/poap-data";

type Route = {
  icon: LucideIcon;
  title: string;
  who: string;
  body: string;
  window: string;
  bestFor: string;
  watchFor: string;
};

const ROUTES: Route[] = [
  {
    icon: Globe,
    title: "Open to anyone",
    who: "Any wallet with the link",
    body: "You publish the page and people mint themselves. No list to prepare, no codes to hand out, nothing for you to do on the day.",
    window: "No deadline",
    bestFor: "Talks, streams, launches, anything where a wide audience is the point.",
    watchFor:
      "Anyone who finds the link can mint, whether or not they showed up. Turn it off if attendance has to mean something.",
  },
  {
    icon: ListChecks,
    title: "Invitation list",
    who: "Only the wallets you name",
    body: "You upload the addresses and only those wallets can mint. The list is compressed to a single fingerprint before it goes onchain, so the addresses themselves stay private.",
    window: "No deadline",
    bestFor: "Ticket holders, team members, a cohort you already have a roster for.",
    watchFor:
      "You get one chance to attach a list after registration. Attach it at registration and you cannot change it at all.",
  },
  {
    icon: QrCode,
    title: "Codes at the door",
    who: "Whoever you approve on the day",
    body: "You approve each attendee individually, so a code only works for the wallet it was made for. Screenshotting someone else's code gets them nothing.",
    window: `${SIGNATURE_WINDOW_DAYS} days from registration`,
    bestFor: "Live events where the wallet list does not exist until people arrive.",
    watchFor:
      "One code cannot serve a crowd. Print per-attendee codes, or run a station that approves wallets as they arrive.",
  },
];

const DistributionSection = () => {
  return (
    <Section id="distribution">
      <SectionHeading
        eyebrow="Handing it out"
        title="Three ways to get the badge into someone's wallet"
        lead="Pick one, or run all three at once. They share a single record of who has claimed, so a person who mints through one route cannot come back through another."
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ROUTES.map((route, i) => (
          <Reveal key={route.title} index={i} className="h-full">
            <FeatureCard
              icon={route.icon}
              title={route.title}
              subtitle={route.who}
              meta={<Badge variant="accent">{route.window}</Badge>}
            >
              <p className="text-base leading-7 text-fg-secondary">{route.body}</p>
              <dl className="mt-auto flex flex-col gap-3 border-t border-border/70 pt-4">
                <div>
                  <dt className="text-sm text-fg-tertiary">Best for</dt>
                  <dd className="pt-1 text-base leading-7 text-fg-secondary">
                    {route.bestFor}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-fg-tertiary">Worth knowing</dt>
                  <dd className="pt-1 text-base leading-7 text-fg-secondary">
                    {route.watchFor}
                  </dd>
                </div>
              </dl>
            </FeatureCard>
          </Reveal>
        ))}
      </div>

      <SectionFooter
        note="Sending badges out yourself is a fourth option, in batches, for the first 30 days"
        action={{ label: "Read the distribution guide", href: "/docs" }}
      />
    </Section>
  );
};

export default DistributionSection;

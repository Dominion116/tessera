import { Globe, ListChecks, QrCode } from "lucide-react";
import Section from "@/components/landing/section";
import SectionHeading from "@/components/landing/section-heading";
import Reveal from "@/components/landing/reveal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SIGNATURE_WINDOW_DAYS } from "@/lib/poap-data";

type Route = {
  icon: React.ReactNode;
  title: string;
  who: string;
  body: string;
  window: string;
  bestFor: string;
  watchFor: string;
};

const ROUTES: Route[] = [
  {
    icon: <Globe size={18} aria-hidden="true" />,
    title: "Open to anyone",
    who: "Any wallet with the link",
    body: "You publish the page and people mint themselves. No list to prepare, no codes to hand out, nothing for you to do on the day.",
    window: "No deadline",
    bestFor: "Talks, streams, launches, anything where a wide audience is the point.",
    watchFor:
      "Anyone who finds the link can mint, whether or not they showed up. Turn it off if attendance has to mean something.",
  },
  {
    icon: <ListChecks size={18} aria-hidden="true" />,
    title: "Invitation list",
    who: "Only the wallets you name",
    body: "You upload the addresses and only those wallets can mint. The list is compressed to a single fingerprint before it goes onchain, so the addresses themselves stay private.",
    window: "No deadline",
    bestFor: "Ticket holders, team members, a cohort you already have a roster for.",
    watchFor:
      "You get one chance to attach a list after registration. Attach it at registration and you cannot change it at all.",
  },
  {
    icon: <QrCode size={18} aria-hidden="true" />,
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
        title="Three ways to get the badge into someone's wallet."
        lead="Pick one, or run all three at once. They share a single record of who has claimed, so a person who mints through one route cannot come back through another."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {ROUTES.map((route, i) => (
          <Reveal key={route.title} index={i} className="h-full">
            <Card className="flex h-full flex-col gap-5 border-border/70 bg-card/60 tile-grout">
              <CardHeader>
                <span className="flex size-10 items-center justify-center rounded-lg bg-teal-400/10 text-teal-600 dark:text-teal-300">
                  {route.icon}
                </span>
                <CardTitle className="pt-4 text-xl font-semibold">
                  {route.title}
                </CardTitle>
                <p className="text-sm text-fg-tertiary">{route.who}</p>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-4">
                <p className="text-sm leading-6 text-fg-secondary">{route.body}</p>
                <Badge variant="accent">{route.window}</Badge>
                <dl className="mt-auto flex flex-col gap-3 border-t border-border/70 pt-4 text-sm">
                  <div>
                    <dt className="text-xs text-fg-tertiary">Best for</dt>
                    <dd className="pt-1 leading-6 text-fg-secondary">
                      {route.bestFor}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-fg-tertiary">Worth knowing</dt>
                    <dd className="pt-1 leading-6 text-fg-secondary">
                      {route.watchFor}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
};

export default DistributionSection;


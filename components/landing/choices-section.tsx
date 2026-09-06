import { ArrowLeftRight, Globe, ListChecks, Lock, QrCode } from "lucide-react";
import Section from "@/components/landing/section";
import SectionHeading from "@/components/landing/section-heading";
import Reveal from "@/components/landing/reveal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LifecycleTimeline, {
  type Milestone,
} from "@/components/lifecycle-timeline";
import {
  CREATOR_MINT_BATCH_LIMIT,
  CREATOR_TIMELOCK_DAYS,
  SIGNATURE_WINDOW_DAYS,
} from "@/lib/poap-data";

type Route = {
  icon: React.ReactNode;
  title: string;
  who: string;
  body: string;
  window: string;
  watchFor: string;
};

const ROUTES: Route[] = [
  {
    icon: <Globe size={18} aria-hidden="true" />,
    title: "Open to anyone",
    who: "Any wallet with the link",
    body: "You publish the page and people mint themselves, with no list to prepare and no codes to hand out.",
    window: "No deadline",
    watchFor:
      "Anyone who finds the link can mint, whether or not they showed up. Turn it off if attendance has to mean something.",
  },
  {
    icon: <ListChecks size={18} aria-hidden="true" />,
    title: "Invitation list",
    who: "Only the wallets you name",
    body: "You upload the addresses and only those wallets can mint. The list is compressed to a single fingerprint before it goes onchain, so the addresses stay private.",
    window: "No deadline",
    watchFor:
      "You get one chance to attach a list after registration. Attach it at registration and you cannot change it at all.",
  },
  {
    icon: <QrCode size={18} aria-hidden="true" />,
    title: "Codes at the door",
    who: "Whoever you approve on the day",
    body: "You approve each attendee individually, so a code only works for the wallet it was made for.",
    window: `${SIGNATURE_WINDOW_DAYS} days from registration`,
    watchFor:
      "One code cannot serve a crowd. Print per-attendee codes, or run a station that approves wallets as they arrive.",
  },
];

type Option = {
  icon: React.ReactNode;
  title: string;
  yes: string[];
  no: string[];
  choose: string;
};

const OPTIONS: Option[] = [
  {
    icon: <Lock size={18} aria-hidden="true" />,
    title: "Bound to the wallet",
    yes: ["Attendance means attendance", "Cannot be bought after the fact"],
    no: ["No transfers, ever", "A lost wallet is a lost badge"],
    choose:
      "Choose this when the badge is evidence: a certificate that can be resold is not evidence of anything.",
  },
  {
    icon: <ArrowLeftRight size={18} aria-hidden="true" />,
    title: "Free to move",
    yes: ["Moves between your own wallets", "Can be traded or gifted"],
    no: ["Holding it no longer proves attendance", "Can end up anywhere"],
    choose:
      "Choose this when the artwork is the point, or when holders will want to consolidate wallets later.",
  },
];

const MILESTONES: Milestone[] = [
  {
    day: "Day 0",
    label: "Registration",
    title: "The badge exists",
    body: "Artwork and details are written onchain and the event gets its number. Minting can start immediately.",
    at: 0,
  },
  {
    day: `Day ${CREATOR_TIMELOCK_DAYS}`,
    label: "Creator controls end",
    title: "Your settings freeze",
    body: `Last day to attach an invitation list, change whether the badge is open to everyone, or drop badges into wallets yourself in batches of up to ${CREATOR_MINT_BATCH_LIMIT}.`,
    warning:
      "Whether the badge is open to everyone is whatever it was at this moment, permanently. It is the one setting worth a calendar reminder.",
    at: 30 / 37,
  },
  {
    day: `Day ${SIGNATURE_WINDOW_DAYS}`,
    label: "Door codes end",
    title: "Approvals stop working",
    body: "Codes you approved at the venue stop being accepted. Open minting and invitation lists carry on with no end date.",
    at: 1,
  },
];

/**
 * The three registration decisions in one place: who can mint, whether the
 * badge can move, and the clock every creator control runs on.
 */
const ChoicesSection = () => {
  return (
    <Section id="choices">
      <SectionHeading
        eyebrow="Choices"
        title="Who can mint, whether it can move, and how long you stay in control."
        lead="Run one route or all three at once: every route shares a single record of who has claimed, so nobody mints twice."
      />

      <div className="flex flex-col gap-6">
        <p className="text-xs tracking-wide text-fg-tertiary uppercase">
          Who can mint
        </p>
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
                  <p className="text-sm leading-6 text-fg-secondary">
                    {route.body}
                  </p>
                  <Badge variant="accent">{route.window}</Badge>
                  <dl className="mt-auto flex flex-col gap-3 border-t border-border/70 pt-4 text-sm">
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
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-xs tracking-wide text-fg-tertiary uppercase">
            Bound or transferable
          </p>
          <p className="text-sm leading-6 text-fg-secondary">
            Set once at registration, and never changed afterwards.
          </p>
        </div>
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
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-xs tracking-wide text-fg-tertiary uppercase">
            The clock
          </p>
          <p className="text-sm leading-6 text-fg-secondary">
            Both deadlines count from the registration transaction, not from
            your event date.
          </p>
        </div>
        <Reveal>
          <LifecycleTimeline milestones={MILESTONES} />
        </Reveal>
      </div>
    </Section>
  );
};

export default ChoicesSection;

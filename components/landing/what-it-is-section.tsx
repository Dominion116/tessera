import { Database, Fingerprint, Layers, MapPin, Ticket } from "lucide-react";
import Section from "@/components/landing/section";
import SectionHeading from "@/components/landing/section-heading";
import Reveal from "@/components/landing/reveal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CHAIN_ID, CONTRACT_ADDRESS } from "@/lib/poap-data";
import { shortAddress } from "@/lib/format";

const SmallCard = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <Card className="h-full gap-4 border-border/70 bg-card/60 tile-grout">
    <CardHeader>
      <span className="flex size-10 items-center justify-center rounded-lg bg-teal-400/10 text-teal-600 dark:text-teal-300">
        {icon}
      </span>
      <CardTitle className="pt-4 text-lg font-semibold">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm leading-6 text-fg-secondary">{children}</p>
    </CardContent>
  </Card>
);

const WhatItIsSection = () => {
  return (
    <Section id="what-it-is">
      <SectionHeading
        eyebrow="What a POAP is"
        title="A badge that proves you were somewhere, and that nobody can quietly rewrite later."
        lead="One token per person per event. The organiser registers the event once, attendees mint their own copy, and the badge stays in their wallet with the artwork and the details attached to it."
      />

      <div className="grid gap-4 md:grid-cols-6">
        <Reveal className="md:col-span-4" index={0}>
          <Card className="h-full gap-5 border-border/70 bg-card/60 tile-grout">
            <CardHeader>
              <span className="flex size-10 items-center justify-center rounded-lg bg-teal-400/10 text-teal-600 dark:text-teal-300">
                <Database size={18} aria-hidden="true" />
              </span>
              <CardTitle className="pt-4 text-xl font-semibold">
                The artwork lives in the contract, not on a server
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <p className="text-sm leading-6 text-fg-secondary">
                Most badges point at a URL. When that URL stops being paid for, the
                badge turns into a broken image. Here the SVG is written into
                contract storage at registration and read back out of the chain, so
                the picture and the details have the same lifetime as the token.
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-border/70 bg-background/60 p-4">
                  <p className="text-xs text-fg-tertiary">Artwork</p>
                  <p className="pt-1 text-sm font-medium">Onchain SVG</p>
                </div>
                <div className="rounded-lg border border-border/70 bg-background/60 p-4">
                  <p className="text-xs text-fg-tertiary">Details</p>
                  <p className="pt-1 text-sm font-medium">Onchain JSON</p>
                </div>
                <div className="rounded-lg border border-border/70 bg-background/60 p-4">
                  <p className="text-xs text-fg-tertiary">Offchain parts</p>
                  <p className="pt-1 text-sm font-medium">None</p>
                </div>
              </div>
              <dl className="flex flex-col gap-2 border-t border-border/70 pt-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-fg-tertiary">Contract</dt>
                  <dd className="font-mono text-xs tabular-nums select-all">
                    {shortAddress(CONTRACT_ADDRESS)}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-fg-tertiary">Network</dt>
                  <dd className="font-medium tabular-nums">
                    Base, chain {CHAIN_ID}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-fg-tertiary">Token standard</dt>
                  <dd className="font-medium">ERC-1155</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </Reveal>

        <div className="flex flex-col gap-4 md:col-span-2">
          <Reveal index={1}>
            <SmallCard
              icon={<Ticket size={18} aria-hidden="true" />}
              title="One badge per wallet"
            >
              Every mint route shares a single record of who has already claimed, so
              nobody collects the same POAP twice, whichever route they came
              through.
            </SmallCard>
          </Reveal>
          <Reveal index={2}>
            <SmallCard
              icon={<Layers size={18} aria-hidden="true" />}
              title="Event number is token number"
            >
              Register the fourteenth event and you get token 14. One number
              identifies the event, the badge, and the page you share.
            </SmallCard>
          </Reveal>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Reveal index={3}>
          <SmallCard
            icon={<MapPin size={18} aria-hidden="true" />}
            title="Name and picture, then whatever else you have"
          >
            A name and an image are the only things required. Date, location,
            description and a link to your own site are optional, and leaving them
            out does not make the badge look unfinished.
          </SmallCard>
        </Reveal>
        <Reveal index={4}>
          <SmallCard
            icon={<Fingerprint size={18} aria-hidden="true" />}
            title="Checkable from outside this app"
          >
            Each badge carries a portable identifier naming the chain, the contract
            and the event, so a holder can prove the mint anywhere, with or without
            Tessera.
          </SmallCard>
        </Reveal>
      </div>
    </Section>
  );
};

export default WhatItIsSection;


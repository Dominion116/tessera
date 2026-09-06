import { Database, Fingerprint, Layers, MapPin, Ticket } from "lucide-react";
import Section from "@/components/landing/section";
import SectionHeading from "@/components/landing/section-heading";
import SectionFooter from "@/components/landing/section-footer";
import Reveal from "@/components/landing/reveal";
import FeatureCard from "@/components/landing/feature-card";
import { CHAIN_ID, CONTRACT_ADDRESS } from "@/lib/poap-data";
import { shortAddress } from "@/lib/format";

const STORAGE_PARTS = [
  { label: "Artwork", value: "Onchain SVG" },
  { label: "Details", value: "Onchain JSON" },
  { label: "Offchain parts", value: "None" },
];

const CONTRACT_FACTS = [
  { label: "Contract", value: shortAddress(CONTRACT_ADDRESS), mono: true },
  { label: "Network", value: `Base, chain ${CHAIN_ID}`, mono: false },
  { label: "Token standard", value: "ERC-1155", mono: false },
];

const SIDE_CARDS = [
  {
    icon: Ticket,
    title: "One badge per wallet",
    body: "Every way of minting shares a single record of who has already claimed, so nobody collects the same POAP twice, whichever route they came through.",
  },
  {
    icon: Layers,
    title: "Event number is token number",
    body: "Register the fourteenth event and you get token 14. One number identifies the event, the badge, and the page you share.",
  },
  {
    icon: MapPin,
    title: "A name and a picture is enough",
    body: "Those two are required. Date, location, description and a link to your own site are optional, and a badge without them still reads as finished.",
  },
  {
    icon: Fingerprint,
    title: "Checkable from outside this app",
    body: "Each badge carries a portable identifier naming the chain, the contract and the event, so a holder can prove the mint anywhere, with or without Tessera.",
  },
];

const WhatItIsSection = () => {
  return (
    <Section id="what-it-is">
      <SectionHeading
        eyebrow="What a POAP is"
        title="A badge that proves you were there, and that nobody can rewrite later"
        lead="One token per person per event. You register the event once, attendees mint their own copy, and the badge stays in their wallet with the artwork and the details attached to it."
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Reveal index={0} className="h-full sm:col-span-2">
          <FeatureCard
            icon={Database}
            title="The artwork lives in the contract, not on a server"
          >
            <p className="text-base leading-7 text-fg-secondary">
              Most badges point at a URL. When that URL stops being paid for, the
              badge turns into a broken image. Here the SVG is written into contract
              storage at registration and read back out of the chain, so the picture
              and the details have the same lifetime as the token.
            </p>
            <div className="grid gap-3 pt-1 sm:grid-cols-3">
              {STORAGE_PARTS.map((part) => (
                <div
                  key={part.label}
                  className="rounded-lg border border-border/70 bg-background/60 p-4"
                >
                  <p className="text-sm text-fg-tertiary">{part.label}</p>
                  <p className="pt-1 text-base font-medium">{part.value}</p>
                </div>
              ))}
            </div>
            <dl className="mt-auto flex flex-col gap-2 border-t border-border/70 pt-4 text-base">
              {CONTRACT_FACTS.map((fact) => (
                <div
                  key={fact.label}
                  className="flex items-center justify-between gap-4"
                >
                  <dt className="text-fg-tertiary">{fact.label}</dt>
                  <dd
                    className={
                      fact.mono
                        ? "font-mono text-sm tabular-nums select-all"
                        : "font-medium tabular-nums"
                    }
                  >
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </FeatureCard>
        </Reveal>

        {SIDE_CARDS.map((card, i) => (
          <Reveal key={card.title} index={i + 1} className="h-full">
            <FeatureCard icon={card.icon} title={card.title}>
              <p className="text-base leading-7 text-fg-secondary">{card.body}</p>
            </FeatureCard>
          </Reveal>
        ))}
      </div>

      <SectionFooter note="Browsing badges needs no wallet, and no account" />
    </Section>
  );
};

export default WhatItIsSection;

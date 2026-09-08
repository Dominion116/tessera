import { Database } from "lucide-react";
import Section from "@/components/landing/section";
import SectionHeading from "@/components/landing/section-heading";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BentoGridShowcase } from "@/components/ui/bento-product-features";
import { CHAIN_ID, CONTRACT_ADDRESS, GALLERY_POAPS } from "@/lib/poap-data";
import { shortAddress, svgToDataUrl } from "@/lib/format";

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

const HOLDERS = GALLERY_POAPS.slice(0, 3);

/** The shared card surface: hairline border, tile shadow, teal hover top edge. */
const CARD_SURFACE =
  "h-full border-border/70 bg-card/65 shadow-[inset_0_1px_0_oklch(1_0_0_/_6%),0_1px_2px_oklch(0_0_0_/_5%),0_8px_24px_oklch(0_0_0_/_4%)] transition-[background-color,border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-teal-400/30 hover:bg-card/80 hover:shadow-[inset_0_1px_0_oklch(1_0_0_/_8%),0_2px_4px_oklch(0_0_0_/_6%),0_12px_28px_oklch(0_0_0_/_7%)]";

/** Tall left slot. The onchain storage argument, with the parts and the facts. */
const ArtworkCard = () => (
  <Card className={CARD_SURFACE}>
    <CardContent className="flex h-full flex-col gap-5 px-7 py-8">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-teal-400/20 bg-teal-400/10 text-teal-600 dark:text-teal-300">
        <Database className="h-5 w-5" aria-hidden="true" strokeWidth={1.4} />
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-xl font-semibold">
          The artwork lives in the contract, not on a server
        </h3>
        <p className="text-base leading-7 text-fg-secondary">
          Most badges point at a URL and break when it stops being paid for.
          Here the SVG is written into contract storage at registration and read
          back out of the chain, so the picture and the details last exactly as
          long as the token does.
        </p>
      </div>
      <ul className="flex flex-col gap-2">
        {STORAGE_PARTS.map((part) => (
          <li
            key={part.label}
            className="flex items-center justify-between gap-4 rounded-md border border-border/70 bg-background/60 px-4 py-3"
          >
            <span className="text-sm text-fg-tertiary">{part.label}</span>
            <span className="text-sm font-medium">{part.value}</span>
          </li>
        ))}
      </ul>
      <dl className="mt-auto flex flex-col gap-2 border-t border-border/70 pt-4">
        {CONTRACT_FACTS.map((fact) => (
          <div key={fact.label} className="flex items-center justify-between gap-4">
            <dt className="text-base text-fg-tertiary">{fact.label}</dt>
            <dd
              className={
                fact.mono
                  ? "font-mono text-sm tabular-nums select-all"
                  : "text-base font-medium tabular-nums"
              }
            >
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>
    </CardContent>
  </Card>
);

/** Top-middle slot. The shared claim record, with a row of holders beneath. */
const OnePerWalletCard = () => (
  <Card className={CARD_SURFACE}>
    <CardContent className="flex h-full flex-col gap-5 px-7 py-8">
      <div className="flex flex-col gap-3">
        <h3 className="text-xl font-semibold">One badge per wallet</h3>
        <p className="text-base leading-7 text-fg-secondary">
          Every mint route checks the same claim record, so nobody collects the
          same POAP twice, whichever way they arrived.
        </p>
      </div>
      <div className="mt-auto flex items-center -space-x-2">
        {HOLDERS.map((poap) => (
          // Artwork arrives as an onchain SVG data URL, so a plain img is
          // correct here: there is nothing for the image optimizer to do.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={poap.eventId.toString()}
            src={svgToDataUrl(poap.artwork)}
            alt=""
            className="inline-block h-9 w-9 rounded-full object-cover ring-2 ring-background"
            loading="lazy"
            decoding="async"
          />
        ))}
      </div>
    </CardContent>
  </Card>
);

/** Top-right slot. The event number is the token number, as a graphic cell. */
const EventNumberCard = () => (
  <Card className={`${CARD_SURFACE} relative overflow-hidden`}>
    <div
      aria-hidden="true"
      className="absolute inset-0 opacity-20"
      style={{
        backgroundImage:
          "radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)",
        backgroundSize: "16px 16px",
      }}
    />
    <CardContent className="relative z-10 flex h-full flex-col items-center justify-center gap-3 px-7 py-8">
      <span className="text-7xl font-semibold tabular-nums tracking-[-0.06em]">14</span>
      <p className="max-w-56 text-center text-sm leading-6 text-fg-tertiary">
        Register the 14th event and you get token 14: one number names the
        event, the badge and the page you share.
      </p>
    </CardContent>
  </Card>
);

/** Middle-middle slot. The registration minimum: a name and one picture. */
const RequiredFieldsCard = () => (
  <Card className={CARD_SURFACE}>
    <CardContent className="flex h-full flex-col gap-5 px-7 py-8">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-xl font-semibold">
          A name and a picture is enough
        </h3>
        <Badge variant="outline" className="shrink-0">
          Required fields
        </Badge>
      </div>
      <span className="text-5xl font-semibold tabular-nums tracking-[-0.05em]">2</span>
      <div className="mt-auto flex items-center justify-between gap-4 text-sm text-fg-tertiary">
        <span>Name and artwork</span>
        <span>Everything else optional</span>
      </div>
    </CardContent>
  </Card>
);

/** Middle-right slot. The portable identifier that makes badges verifiable. */
const PortableBadgeCard = () => (
  <Card className={CARD_SURFACE}>
    <CardContent className="flex h-full flex-col justify-end gap-3 px-7 py-8">
      <h3 className="text-xl font-semibold">
        Checkable from outside this app
      </h3>
      <p className="text-base leading-7 text-fg-secondary">
        Each badge carries a portable identifier naming the chain, the contract
        and the event, so a holder can prove the mint anywhere, with or without
        Tessera.
      </p>
    </CardContent>
  </Card>
);

/** Wide bottom slot. Reading is open: no wallet, no account. */
const BrowseCard = () => (
  <Card className={CARD_SURFACE}>
    <CardContent className="flex h-full flex-col items-center justify-center gap-3 px-7 py-8 text-center">
      <h3 className="text-xl font-semibold">
        Browsing needs no wallet, and no account
      </h3>
      <p className="max-w-xl text-base leading-7 text-fg-secondary">
        Open any badge to read its artwork and details, or check that a
        collector really holds it.
      </p>
    </CardContent>
  </Card>
);

const WhatItIsSection = () => {
  return (
    <Section id="what-it-is" className="what-it-is-section">
      <SectionHeading
        className="max-w-3xl"
        eyebrow="What a POAP is"
        title="A badge that proves you were there, and that nobody can rewrite later"
        lead="One token per person per event. You register the event once, attendees mint their own copy, and the badge stays in their wallet with the artwork and the details attached to it."
      />

      <BentoGridShowcase
        integration={<ArtworkCard />}
        trackers={<OnePerWalletCard />}
        statistic={<EventNumberCard />}
        focus={<RequiredFieldsCard />}
        productivity={<PortableBadgeCard />}
        shortcuts={<BrowseCard />}
      />
    </Section>
  );
};

export default WhatItIsSection;

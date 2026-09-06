import {
  Boxes,
  Braces,
  MessageCircle,
  Plug,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import Section from "@/components/landing/section";
import SectionHeading from "@/components/landing/section-heading";
import Reveal from "@/components/landing/reveal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const METADATA_SAMPLE = `{
  "name": "Base Sepolia Builders Night",
  "description": "Twelve teams shipped a contract...",
  "image": "data:image/svg+xml;base64,PHN2Zy...",
  "attributes": [
    { "trait_type": "Event", "value": "Base Sepolia Builders Night" },
    { "trait_type": "Location", "value": "Lisbon" },
    { "trait_type": "Date", "display_type": "date", "value": "1770854400" },
    { "trait_type": "EventId", "value": "41" },
    { "trait_type": "Creator", "value": "0x1f4b...7a6b" },
    { "trait_type": "Soulbound", "value": "true" }
  ],
  "external_url": "https://base.org"
}`;

type Surface = {
  icon: React.ReactNode;
  title: string;
  body: string;
  tag: string;
};

const SURFACES: Surface[] = [
  {
    icon: <MessageCircle size={18} aria-hidden="true" />,
    title: "Farcaster",
    body: "Your wallet is already connected, minting happens in the feed, and a fresh badge can be cast straight back out.",
    tag: "Mini App",
  },
  {
    icon: <Wallet size={18} aria-hidden="true" />,
    title: "Any wallet on Base",
    body: "Extensions, mobile wallets and smart accounts all work.",
    tag: "Wallets",
  },
  {
    icon: <Boxes size={18} aria-hidden="true" />,
    title: "Marketplaces and explorers",
    body: "Standard tokens with standard metadata, so badges appear in wallets and explorers on their own.",
    tag: "ERC-1155",
  },
  {
    icon: <Plug size={18} aria-hidden="true" />,
    title: "Your own tools",
    body: "Every read this app performs is a public contract call, so your own scripts get the same answers.",
    tag: "Open contract",
  },
];

const VerifySection = () => {
  return (
    <Section id="verify" muted>
      <SectionHeading
        eyebrow="Open by design"
        title="Anyone can check a badge without taking your word for it."
        lead="The details below come straight out of the contract. Tessera runs no database and no indexer, and a clean clone needs one network URL, so the same answer arrives whether you ask this app, a block explorer, or your own script."
      />

      <div className="grid gap-4 lg:grid-cols-5">
        <Reveal className="min-w-0 lg:col-span-3" index={0}>
          <Card className="h-full min-w-0 gap-4 border-border/70 bg-card/60 tile-grout">
            <CardHeader>
              <span className="flex size-10 items-center justify-center rounded-lg bg-teal-400/10 text-teal-600 dark:text-teal-300">
                <Braces size={18} aria-hidden="true" />
              </span>
              <CardTitle className="pt-4 text-lg font-semibold">
                What a badge says about itself
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm leading-6 text-fg-secondary">
                One contract call returns this document, artwork included. No
                gateway, no pinning service, no account.
              </p>
              <pre className="min-w-0 overflow-x-auto rounded-lg border border-border/70 bg-background/70 p-4 text-xs leading-5">
                <code className="font-mono">{METADATA_SAMPLE}</code>
              </pre>
            </CardContent>
          </Card>
        </Reveal>

        <Reveal className="min-w-0 lg:col-span-2" index={1}>
          <Card className="h-full gap-4 border-border/70 bg-card/60 tile-grout">
            <CardHeader>
              <span className="flex size-10 items-center justify-center rounded-lg bg-teal-400/10 text-teal-600 dark:text-teal-300">
                <ShieldCheck size={18} aria-hidden="true" />
              </span>
              <CardTitle className="pt-4 text-lg font-semibold">
                Checking a holder
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="flex flex-col gap-3 text-sm leading-6 text-fg-secondary">
                <li className="flex gap-3">
                  <span className="font-semibold tabular-nums text-teal-600 dark:text-teal-300">
                    1
                  </span>
                  Ask the contract whether that wallet holds the event number.
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold tabular-nums text-teal-600 dark:text-teal-300">
                    2
                  </span>
                  Read the mint transaction and the block it landed in.
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold tabular-nums text-teal-600 dark:text-teal-300">
                    3
                  </span>
                  Compare against the event details, which cannot have changed since
                  registration.
                </li>
              </ol>
            </CardContent>
          </Card>
        </Reveal>
      </div>

      <Reveal index={2}>
        <div className="flex flex-col gap-6">
          <p className="text-xs tracking-wide text-fg-tertiary uppercase">
            Where it works
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SURFACES.map((surface) => (
              <div
                key={surface.title}
                className="flex flex-col gap-3 rounded-xl border border-border/70 bg-card/60 p-4 tile-grout"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-teal-400/10 text-teal-600 dark:text-teal-300">
                    {surface.icon}
                  </span>
                  <Badge variant="outline">{surface.tag}</Badge>
                </div>
                <p className="text-sm font-semibold">{surface.title}</p>
                <p className="text-xs leading-5 text-fg-secondary">
                  {surface.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
};

export default VerifySection;

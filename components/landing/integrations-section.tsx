import { Boxes, MessageCircle, Plug, Wallet } from "lucide-react";
import Section from "@/components/landing/section";
import SectionHeading from "@/components/landing/section-heading";
import Reveal from "@/components/landing/reveal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Integration = {
  icon: React.ReactNode;
  title: string;
  body: string;
  tag: string;
};

const INTEGRATIONS: Integration[] = [
  {
    icon: <MessageCircle size={18} aria-hidden="true" />,
    title: "Farcaster",
    body: "Tessera runs inside Farcaster as well as on the web. Your wallet is already connected, minting happens in the feed, and a fresh badge can be cast straight back out.",
    tag: "Mini App",
  },
  {
    icon: <Wallet size={18} aria-hidden="true" />,
    title: "Any wallet on Base",
    body: "Browser extensions, mobile wallets, smart accounts. Connecting is only needed to mint or to create, never to browse.",
    tag: "Wallets",
  },
  {
    icon: <Boxes size={18} aria-hidden="true" />,
    title: "Marketplaces and explorers",
    body: "Standard ERC-1155 tokens with standard metadata, so badges appear in wallets and explorers without Tessera doing anything special.",
    tag: "ERC-1155",
  },
  {
    icon: <Plug size={18} aria-hidden="true" />,
    title: "Your own tools",
    body: "Every read this app performs is a public contract call. Point your own script at the same functions and you get the same answers.",
    tag: "Open contract",
  },
];

const IntegrationsSection = () => {
  return (
    <Section id="integrations">
      <SectionHeading
        eyebrow="Where it works"
        title="Badges do not stay inside this app."
        lead="Tessera is one window onto a public contract. Anything that reads Base can read your badges, and holders can prove a mint without opening Tessera at all."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {INTEGRATIONS.map((integration, i) => (
          <Reveal key={integration.title} index={i} className="h-full">
            <Card className="h-full gap-4 border-border/70 bg-card/60 tile-grout">
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-teal-400/10 text-teal-600 dark:text-teal-300">
                    {integration.icon}
                  </span>
                  <Badge variant="outline">{integration.tag}</Badge>
                </div>
                <CardTitle className="pt-4 text-lg font-semibold">
                  {integration.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-fg-secondary">
                  {integration.body}
                </p>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
};

export default IntegrationsSection;


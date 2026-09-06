import { Boxes, MessageCircle, Plug, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Section from "@/components/landing/section";
import SectionHeading from "@/components/landing/section-heading";
import SectionFooter from "@/components/landing/section-footer";
import Reveal from "@/components/landing/reveal";
import FeatureCard from "@/components/landing/feature-card";
import { Badge } from "@/components/ui/badge";

type Integration = {
  icon: LucideIcon;
  title: string;
  body: string;
  tag: string;
};

const INTEGRATIONS: Integration[] = [
  {
    icon: MessageCircle,
    title: "Farcaster",
    body: "Tessera runs inside Farcaster as well as on the web. Your wallet is already connected, minting happens in the feed, and a fresh badge can be cast straight back out.",
    tag: "Mini App",
  },
  {
    icon: Wallet,
    title: "Any wallet on Base",
    body: "Browser extensions, mobile wallets, smart accounts. Connecting is only needed to mint or to create, never to browse.",
    tag: "Wallets",
  },
  {
    icon: Boxes,
    title: "Marketplaces and explorers",
    body: "Standard ERC-1155 tokens with standard metadata, so badges appear in wallets and explorers without Tessera doing anything special.",
    tag: "ERC-1155",
  },
  {
    icon: Plug,
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
        title="Badges do not stay inside this app"
        lead="Tessera is one window onto a public contract. Anything that reads Base can read your badges, and holders can prove a mint without opening Tessera at all."
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {INTEGRATIONS.map((integration, i) => (
          <Reveal key={integration.title} index={i} className="h-full">
            <FeatureCard
              icon={integration.icon}
              title={integration.title}
              meta={<Badge variant="outline">{integration.tag}</Badge>}
            >
              <p className="text-base leading-7 text-fg-secondary">
                {integration.body}
              </p>
            </FeatureCard>
          </Reveal>
        ))}
      </div>

      <SectionFooter note="The contract is public and the interface is MIT licensed, so anyone can run their own copy" />
    </Section>
  );
};

export default IntegrationsSection;

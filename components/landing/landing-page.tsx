import Navbar from "@/components/shadcn-space/blocks/hero-03/navbar";
import { NavLinkItem } from "@/components/shadcn-space/blocks/hero-03/navlink";
import HeroSection from "@/components/shadcn-space/blocks/hero-03/hero";
import FactsStrip from "@/components/landing/facts-strip";
import WhatItIsSection from "@/components/landing/what-it-is-section";
import CreateSection from "@/components/landing/create-section";
import DistributionSection from "@/components/landing/distribution-section";
import SoulboundSection from "@/components/landing/soulbound-section";
import LifecycleSection from "@/components/landing/lifecycle-section";
import GallerySection from "@/components/landing/gallery-section";
import UseCasesSection from "@/components/landing/use-cases-section";
import VerifySection from "@/components/landing/verify-section";
import IntegrationsSection from "@/components/landing/integrations-section";
import FarcasterSection from "@/components/landing/farcaster-section";
import FaqSection from "@/components/landing/faq-section";
import CtaSection from "@/components/landing/cta-section";
import SiteFooter from "@/components/landing/site-footer";

const navigationData: NavLinkItem[] = [
  { title: "Home", href: "/", isActive: true },
  { title: "Explore", href: "/poaps", isActive: false },
  { title: "Create", href: "/app/create", isActive: false },
  { title: "Collection", href: "/app/collection", isActive: false },
  { title: "Docs", href: "/docs", isActive: false },
];

/**
 * The landing page in reading order: what a POAP is, how you make one, how you
 * hand it out, what is permanent, what the deadlines are, what other people have
 * made, where it fits, and then the questions people ask before starting.
 */
const LandingPage = () => {
  return (
    <>
      <Navbar navigationData={navigationData} />
      <main className="-mt-20">
        <HeroSection />
        <FactsStrip />
        <WhatItIsSection />
        <CreateSection />
        <DistributionSection />
        <SoulboundSection />
        <LifecycleSection />
        <GallerySection />
        <UseCasesSection />
        <VerifySection />
        <IntegrationsSection />
        <FarcasterSection />
        <FaqSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
};

export default LandingPage;

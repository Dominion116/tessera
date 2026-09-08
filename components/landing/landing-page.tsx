import Navbar from "@/components/shadcn-space/blocks/hero-03/navbar";
import { NavLinkItem } from "@/components/shadcn-space/blocks/hero-03/navlink";
import HeroSection from "@/components/shadcn-space/blocks/hero-03/hero";
import WhatItIsSection from "@/components/landing/what-it-is-section";
import HowItWorksSection from "@/components/landing/how-it-works-section";
import GallerySection from "@/components/landing/gallery-section";
import FAQ1 from "@/components/ui/faq-monocrhome";
import CTA from "@/components/shadcn-space/blocks/cta-01/cta";
import SiteFooter from "@/components/landing/site-footer";

const navigationData: NavLinkItem[] = [
  { title: "Home", href: "/", isActive: true },
  { title: "Explore", href: "/poaps", isActive: false },
  { title: "Create", href: "/app/create", isActive: false },
  { title: "Collection", href: "/app/collection", isActive: false },
  { title: "Docs", href: "/docs", isActive: false },
];

/**
 * The landing page in reading order: what a POAP is, how one is made and
 * handed out, what people are holding, and the questions people ask before
 * starting.
 */
const LandingPage = () => {
  return (
    <>
      <Navbar navigationData={navigationData} />
      <main className="relative z-10 -mt-20 bg-background">
        <HeroSection />
        <WhatItIsSection />
        <HowItWorksSection />
        <GallerySection />
        <FAQ1 />
        <CTA />
      </main>
      <SiteFooter />
    </>
  );
};

export default LandingPage;

import Navbar from "@/components/shadcn-space/blocks/hero-03/navbar";
import HeroSection from "@/components/shadcn-space/blocks/hero-03/hero";
import { MARKETING_NAV_ITEMS } from "@/components/navigation/marketing-nav";
import WhatItIsSection from "@/components/landing/what-it-is-section";
import HowItWorksSection from "@/components/landing/how-it-works-section";
import GallerySection from "@/components/landing/gallery-section";
import FAQ1 from "@/components/ui/faq-monocrhome";
import CTA from "@/components/shadcn-space/blocks/cta-01/cta";
import SiteFooter from "@/components/landing/site-footer";

/**
 * The landing page in reading order: what a POAP is, how one is made and
 * handed out, what people are holding, and the questions people ask before
 * starting.
 */
const LandingPage = () => {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-background focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-foreground focus:shadow-md focus:ring-2 focus:ring-teal-400"
      >
        Skip to content
      </a>
      <Navbar navigationData={MARKETING_NAV_ITEMS} />
      <main id="main" className="relative z-10 -mt-20 bg-background">
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

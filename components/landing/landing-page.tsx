import Navbar from "@/components/shadcn-space/blocks/hero-03/navbar";
import { NavLinkItem } from "@/components/shadcn-space/blocks/hero-03/navlink";
import HeroSection from "@/components/shadcn-space/blocks/hero-03/hero";
import WhatItIsSection from "@/components/landing/what-it-is-section";
import CreateSection from "@/components/landing/create-section";
import ChoicesSection from "@/components/landing/choices-section";
import GallerySection from "@/components/landing/gallery-section";
import UseCasesSection from "@/components/landing/use-cases-section";
import VerifySection from "@/components/landing/verify-section";
import FaqSection from "@/components/landing/faq-section";
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
 * The landing page in reading order: what a POAP is, how you make one, the
 * choices you get, what people have made with it, where it fits, why you can
 * trust it without trusting us, and then the questions people ask before
 * starting.
 */
const LandingPage = () => {
  return (
    <>
      <Navbar navigationData={navigationData} />
      <main className="-mt-20">
        <HeroSection />
        <WhatItIsSection />
        <CreateSection />
        <ChoicesSection />
        <GallerySection />
        <UseCasesSection />
        <VerifySection />
        <FaqSection />
        <CTA />
      </main>
      <SiteFooter />
    </>
  );
};

export default LandingPage;

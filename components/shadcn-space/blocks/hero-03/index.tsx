import Navbar from "@/components/shadcn-space/blocks/hero-03/navbar";
import { NavLinkItem } from "@/components/shadcn-space/blocks/hero-03/navlink";
import HeroSection from "@/components/shadcn-space/blocks/hero-03/hero";

const HeroPage = () => {
  const navigationData: NavLinkItem[] = [
    { title: "Home", href: "#", isActive: true },
    { title: "Explore", href: "#", isActive: false },
    { title: "Create", href: "#", isActive: false },
    { title: "Collection", href: "#", isActive: false },
    { title: "Docs", href: "#", isActive: false },
  ];
  return (
    <>
      <Navbar navigationData={navigationData} />
      <main className="-mt-20">
        <HeroSection />
      </main>
    </>
  );
};

export default HeroPage;

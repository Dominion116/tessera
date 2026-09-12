import Navbar from "@/components/shadcn-space/blocks/hero-03/navbar";
import HeroSection from "@/components/shadcn-space/blocks/hero-03/hero";
import { MARKETING_NAV_ITEMS } from "@/components/navigation/marketing-nav";

const HeroPage = () => {
  return (
    <>
      <Navbar navigationData={MARKETING_NAV_ITEMS} />
      <main className="-mt-20">
        <HeroSection />
      </main>
    </>
  );
};

export default HeroPage;


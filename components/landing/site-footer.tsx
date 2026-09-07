import FooterBrand from "@/components/landing/footer-brand";
import FooterMeta from "@/components/landing/footer-meta";
import FooterNav from "@/components/landing/footer-nav";
import FooterWordmark from "@/components/landing/footer-wordmark";

const SiteFooter = () => {
  return (
    <footer className="relative overflow-hidden bg-teal-950">
      <div className="relative z-10">
        <div className="mx-auto flex max-w-7xl flex-col px-4 pt-14 sm:px-6 sm:pt-20 lg:px-8 xl:px-16">
          <div className="grid gap-12 lg:grid-cols-[1.5fr_2fr] lg:items-start">
            <FooterBrand />
            <FooterNav />
          </div>
        </div>

        <div className="my-12 border-t border-white/10" />

        <FooterMeta />
      </div>

      <FooterWordmark />
    </footer>
  );
};

export default SiteFooter;

import Section from "@/components/landing/section";
import SectionHeading from "@/components/landing/section-heading";
import SectionFooter from "@/components/landing/section-footer";
import Reveal from "@/components/landing/reveal";
import CarouselStacked from "@/components/ui/carousel-07";

const GallerySection = () => {
  return (
    <Section id="gallery">
      <SectionHeading
        eyebrow="Collections"
        title="Badges people are holding right now"
        lead="Every card here is one registered event: its own artwork, its own number, its own count of who turned up. Drag through the stack to browse; it wraps around, so there is no end to hit."
      />

      <Reveal>
        <CarouselStacked />
      </Reveal>

      <SectionFooter action={{ label: "See the full gallery", href: "/app" }} />
    </Section>
  );
};

export default GallerySection;

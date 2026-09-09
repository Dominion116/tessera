import { Compass } from "lucide-react";
import Section from "@/components/landing/section";
import SectionHeading from "@/components/landing/section-heading";
import SectionFooter from "@/components/landing/section-footer";
import Reveal from "@/components/landing/reveal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CarouselStacked, { type Slide } from "@/components/ui/carousel-07";
import { readLatestEvents } from "@/lib/poap-contract";
import { formatCount, svgToDataUrl } from "@/lib/format";
import type { PoapEvent } from "@/lib/poap-data";

const GALLERY_SLIDES = 6;

async function readShowcaseEvents(): Promise<PoapEvent[]> {
  try {
    return await readLatestEvents(GALLERY_SLIDES);
  } catch {
    return [];
  }
}

function slideFor(event: PoapEvent): Slide {
  return {
    image: svgToDataUrl(event.artwork),
    title: event.name,
    description:
      event.description ||
      `${formatCount(event.collectors)} collectors hold this badge onchain`,
    badge: event.isSoulbound ? "Soulbound" : "Transferable",
    soulbound: event.isSoulbound,
  };
}

const GallerySection = async () => {
  const events = await readShowcaseEvents();
  const slides = events.map(slideFor);

  return (
    <Section id="gallery">
      <SectionHeading
        eyebrow="Collections"
        title="Badges people are holding right now"
        lead="Every card here is one registered event: its own artwork, its own number, its own count of who turned up. Drag through the stack to browse; it wraps around, so there is no end to hit."
      />

      <Reveal>
        {slides.length > 0 ? (
          <CarouselStacked slides={slides} />
        ) : (
          <Card className="border-border/70 bg-card/65 py-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Compass aria-hidden="true" className="size-4 text-fg-tertiary" />
                The gallery could not be read
              </CardTitle>
              <CardDescription>
                The Base Sepolia connection dropped while reading the newest
                events. Everything lives onchain; the full gallery is browsable
                from the app.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </Reveal>

      <SectionFooter action={{ label: "See the full gallery", href: "/app" }} />
    </Section>
  );
};

export default GallerySection;

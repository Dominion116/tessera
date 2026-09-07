import Link from "next/link";
import { Lock } from "lucide-react";
import Section from "@/components/landing/section";
import SectionHeading from "@/components/landing/section-heading";
import SectionFooter from "@/components/landing/section-footer";
import Reveal from "@/components/landing/reveal";
import { Badge } from "@/components/ui/badge";
import { GALLERY_POAPS } from "@/lib/poap-data";
import { formatCount, formatUtcDate, svgToDataUrl } from "@/lib/format";

const GallerySection = () => {
  return (
    <Section id="gallery">
      <SectionHeading
        eyebrow="Collections"
        title="Badges people are holding right now"
        lead="Every tile here is one registered event: its own artwork, its own number, its own count of who turned up. Open one to read the details and check a holder's mint."
      />

      {/* Bento: the first tile takes two columns, and two rows once there is
          room for a second column of small tiles beside it. */}
      <ul className="grid grid-cols-2 gap-6 md:grid-cols-3">
        {GALLERY_POAPS.map((poap, i) => (
          <li
            key={poap.eventId.toString()}
            className={
              i === 0
                ? "col-span-2 md:row-span-2"
                : i === GALLERY_POAPS.length - 1
                  ? "col-span-2 md:col-span-1"
                  : "col-span-1"
            }
          >
            <Reveal index={i} className="h-full">
              <Link
                href="/app/collection"
                className="group flex h-full flex-col gap-4 rounded-xl border border-border/70 border-t-4 border-t-transparent bg-card/60 p-4 tile-grout transition-colors duration-200 hover:border-t-teal-400 focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none"
              >
                <div className="relative overflow-hidden rounded-lg bg-background/60">
                  {/* Artwork arrives as an onchain SVG data URL, so a plain img is
                      correct here: there is nothing for the image optimizer to do. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={svgToDataUrl(poap.artwork)}
                    alt={`Artwork for ${poap.name}`}
                    className="aspect-square w-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.02]"
                    loading="lazy"
                    decoding="async"
                  />
                  {poap.isSoulbound ? (
                    <Badge
                      variant="outline"
                      className="absolute top-2 right-2 gap-1 border-transparent bg-background/85 py-1 backdrop-blur-sm"
                    >
                      <Lock aria-hidden="true" />
                      Bound
                    </Badge>
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <h3
                      className={
                        i === 0
                          ? "line-clamp-2 text-xl font-semibold"
                          : "line-clamp-2 text-base font-semibold"
                      }
                    >
                      {poap.name}
                    </h3>
                    <span className="shrink-0 text-sm tabular-nums text-fg-tertiary">
                      #{poap.eventId.toString()}
                    </span>
                  </div>
                  <p className="text-sm tabular-nums text-fg-tertiary">
                    {formatCount(poap.collectors)} collected
                    {poap.eventDate > 0n ? `, ${formatUtcDate(poap.eventDate)}` : ""}
                  </p>
                  {i === 0 && poap.description ? (
                    <p className="hidden text-base leading-7 text-fg-secondary sm:line-clamp-3">
                      {poap.description}
                    </p>
                  ) : null}
                  <div className="mt-auto flex flex-wrap gap-2 pt-1">
                    <Badge variant="outline">
                      {poap.isPublic ? "Open to anyone" : "Invitation only"}
                    </Badge>
                    {poap.location ? (
                      <Badge variant="outline">{poap.location}</Badge>
                    ) : null}
                  </div>
                </div>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>

      <SectionFooter
        action={{ label: "See the full gallery", href: "/poaps" }}
      />
    </Section>
  );
};

export default GallerySection;

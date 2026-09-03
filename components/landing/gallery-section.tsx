import Link from "next/link";
import { ArrowUpRight, Lock } from "lucide-react";
import Section from "@/components/landing/section";
import SectionHeading from "@/components/landing/section-heading";
import Reveal from "@/components/landing/reveal";
import { Badge } from "@/components/ui/badge";
import { GALLERY_POAPS } from "@/lib/poap-data";
import { formatCount, formatUtcDate, svgToDataUrl } from "@/lib/format";

const GallerySection = () => {
  return (
    <Section id="gallery" muted>
      <SectionHeading
        eyebrow="Collections"
        title="Badges people are holding right now."
        lead="Every tile here is one registered event: its own artwork, its own number, its own count of who turned up. Open one to read the details and check a holder's mint."
      />

      {/* Bento: the first tile takes two columns, and two rows once there is
          room for a second column of small tiles beside it. */}
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">
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
                className="group flex h-full flex-col gap-3 rounded-xl border border-border/70 bg-card/60 p-3 tile-grout transition-colors duration-200 hover:border-teal-400/40 focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none"
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
                <div className="flex flex-1 flex-col gap-2 px-1 pb-1">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={
                        i === 0
                          ? "line-clamp-2 text-base font-semibold sm:text-lg"
                          : "line-clamp-2 text-sm font-semibold"
                      }
                    >
                      {poap.name}
                    </p>
                    <span className="shrink-0 text-xs tabular-nums text-fg-tertiary">
                      #{poap.eventId.toString()}
                    </span>
                  </div>
                  <p className="text-xs tabular-nums text-fg-tertiary">
                    {formatCount(poap.collectors)} collected
                    {poap.eventDate > 0n ? `, ${formatUtcDate(poap.eventDate)}` : ""}
                  </p>
                  {i === 0 && poap.description ? (
                    <p className="hidden text-sm leading-6 text-fg-secondary sm:line-clamp-3">
                      {poap.description}
                    </p>
                  ) : null}
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
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

      <Reveal className="flex justify-center" index={2}>
        <Link
          href="/app/collection"
          className="group relative flex h-12 w-fit items-center overflow-hidden rounded-full bg-primary py-1 ps-6 pe-14 text-sm font-medium text-primary-foreground press transition-all duration-500 hover:ps-14 hover:pe-6 focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none"
        >
          <span className="relative z-10">See the full gallery</span>
          <span className="absolute right-1 flex size-10 items-center justify-center rounded-full bg-background text-foreground transition-all duration-500 group-hover:right-[calc(100%-44px)] group-hover:rotate-45">
            <ArrowUpRight size={16} aria-hidden="true" />
          </span>
        </Link>
      </Reveal>
    </Section>
  );
};

export default GallerySection;

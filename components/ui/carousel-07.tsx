"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  animate,
  type PanInfo,
  type MotionValue,
} from "motion/react";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

/**
 * Stacked card carousel from the shadcn registry (`carousel-07`), holding the
 * gallery's placeholder POAPs. Adapted from the delivered version: POAP
 * content, local SVG artwork, the site's badge treatment, heading weight and
 * card radius, arrow-key browsing, and reduced-motion snapping. The drag
 * physics and layout are unchanged.
 */

interface Slide {
  image: string;
  title: string;
  description: string;
  badge: string;
  /** Draws the padlock in the badge, the marker the bento tiles carried. */
  soulbound?: boolean;
}

/**
 * Placeholder cards standing in for the SVG a registered event returns through
 * `uri()`. Artwork is the generated mosaics in `public/nft/`, one file per
 * event, so the stack reads as one collection. The chain layer swaps this
 * array for real contract reads.
 */
const slides: Slide[] = [
  {
    image: "/nft/builders-night.svg",
    title: "Base Sepolia Builders Night",
    description:
      "Twelve teams shipped a contract in one evening. Everyone who deployed got one.",
    badge: "Soulbound",
    soulbound: true,
  },
  {
    image: "/nft/farcaster-meetup.svg",
    title: "Farcaster Devs Meetup 12",
    description:
      "A signing station at the door, one mint per attendee, no list collected in advance.",
    badge: "Soulbound",
    soulbound: true,
  },
  {
    image: "/nft/onchain-summer.svg",
    title: "Onchain Summer Block Party",
    description: "Open to anyone who walked in. 902 mints and counting.",
    badge: "Transferable",
  },
  {
    image: "/nft/solidity-study.svg",
    title: "Solidity Study Group, Week 9",
    description:
      "Storage layout and SSTORE2, nine weeks in. The group roster was the allowlist.",
    badge: "Soulbound",
    soulbound: true,
  },
  {
    image: "/nft/mosaic-workshop.svg",
    title: "Tessera Mosaic Workshop",
    description:
      "Hand-drawn SVG tiles optimized to 6 KB before registration. A tile can be traded.",
    badge: "Transferable",
  },
  {
    image: "/nft/genesis.svg",
    title: "Genesis",
    description: "The first POAP, written in the constructor. Event ID zero.",
    badge: "Soulbound",
    soulbound: true,
  },
];

interface CarouselConfig {
  distanceDivisor: number;
  velocityDivisor: number;
  sensitivity: number;
  xMultiplier: number;
  yMultiplier: number;
  rotationMultiplier: number;
  scaleReduction: number;
}

const getCarouselConfig = (width: number): CarouselConfig => {
  if (width < 640) {
    return {
      distanceDivisor: 120,
      velocityDivisor: 500,
      sensitivity: 180,
      xMultiplier: 90,
      yMultiplier: 20,
      rotationMultiplier: 8,
      scaleReduction: 0.06,
    };
  }
  if (width < 1024) {
    return {
      distanceDivisor: 160,
      velocityDivisor: 650,
      sensitivity: 220,
      xMultiplier: 130,
      yMultiplier: 30,
      rotationMultiplier: 10,
      scaleReduction: 0.09,
    };
  }
  return {
    distanceDivisor: 200,
    velocityDivisor: 800,
    sensitivity: 250,
    xMultiplier: 170,
    yMultiplier: 40,
    rotationMultiplier: 12,
    scaleReduction: 0.12,
  };
};

const subscribeToResize = (onStoreChange: () => void) => {
  window.addEventListener("resize", onStoreChange);
  return () => window.removeEventListener("resize", onStoreChange);
};

const CarouselStacked = () => {
  const scrollProgress = useMotionValue(0);
  const startProgress = React.useRef(0);
  // The server snapshot is 0, so first paint uses the mobile config and the
  // client corrects after hydration. The supplied version did the same with
  // setState inside an effect, which react-hooks/set-state-in-effect rejects.
  const windowWidth = React.useSyncExternalStore(
    subscribeToResize,
    () => window.innerWidth,
    () => 0,
  );

  const total = slides.length;
  const reduceMotion = useReducedMotion();

  const config = React.useMemo(
    () => getCarouselConfig(windowWidth),
    [windowWidth],
  );

  const goTo = (target: number) => {
    // Reduced motion gets the position with no spring at all. Tracking the
    // pointer during a drag stays, because that is direct manipulation.
    if (reduceMotion) {
      scrollProgress.set(target);
      return;
    }
    animate(scrollProgress, target, {
      type: "spring",
      stiffness: 200,
      damping: 30,
      mass: 1,
    });
  };

  const handleDragStart = () => {
    startProgress.current = scrollProgress.get();
  };

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const dragDistance = info.offset.x;
    const velocity = info.velocity.x;

    const distanceShift = -dragDistance / config.distanceDivisor;
    const velocityShift = -velocity / config.velocityDivisor;

    let totalShift = Math.round(distanceShift + velocityShift);
    totalShift = Math.max(-3, Math.min(3, totalShift));

    goTo(Math.round(startProgress.current) + totalShift);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const step = event.key === "ArrowRight" ? 1 : -1;
    goTo(Math.round(scrollProgress.get()) + step);
  };

  return (
    <div className="flex w-full flex-col items-center justify-center overflow-hidden bg-background py-10 select-none">
      <div className="relative flex h-80 w-full max-w-7xl items-center justify-center sm:h-112 lg:h-128">
        {/* A transparent surface above the cards owns every pointer event, so
            a drag anywhere moves the stack and no card eats a gesture.
            touch-action keeps vertical swipes scrolling the page. */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragStart={handleDragStart}
          onDrag={(_, info) => {
            const delta = -info.delta.x / config.sensitivity;
            scrollProgress.set(scrollProgress.get() + delta);
          }}
          onDragEnd={handleDragEnd}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="group"
          aria-label="Badge gallery. Drag, or use the left and right arrow keys, to browse."
          style={{ touchAction: "pan-y" }}
          className="absolute inset-0 z-50 cursor-grab rounded-xl focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none active:cursor-grabbing"
        />

        {slides.map((slide, i) => (
          <Card
            key={i}
            slide={slide}
            index={i}
            total={total}
            progress={scrollProgress}
            config={config}
          />
        ))}
      </div>
    </div>
  );
};

interface CardProps {
  slide: Slide;
  index: number;
  total: number;
  progress: MotionValue<number>;
  config: CarouselConfig;
}

const Card = ({ slide, index, total, progress, config }: CardProps) => {
  const offset = useTransform(progress, (p) => {
    let diff = (index - p) % total;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  });

  const x = useTransform(offset, (o) => o * config.xMultiplier);
  const rotate = useTransform(offset, (o) => {
    const absO = Math.abs(o);
    if (absO < 0.05) return 0;
    return o * config.rotationMultiplier;
  });
  const y = useTransform(offset, (o) => {
    const absO = Math.abs(o);
    if (absO < 0.05) return 0;
    return absO * config.yMultiplier;
  });
  const scale = useTransform(
    offset,
    (o) => 1 - Math.abs(o) * config.scaleReduction,
  );
  const opacity = useTransform(
    offset,
    [-total / 2, -total / 2 + 0.5, 0, total / 2 - 0.5, total / 2],
    [0, 1, 1, 1, 0],
  );
  const zIndex = useTransform(offset, (o) =>
    Math.round(100 - Math.abs(o) * 10),
  );

  // Side cards darken so the centred one reads as the front of the stack, and
  // copy appears only on the centred card, where there is room to read it.
  const shade = useTransform(
    offset,
    [-2, -0.5, 0, 0.5, 2],
    [0.5, 0.2, 0, 0.2, 0.5],
  );
  const copyOpacity = useTransform(offset, [-0.5, 0, 0.5], [0, 1, 0]);

  return (
    <motion.div
      style={{
        x,
        rotate,
        y,
        scale,
        opacity,
        zIndex,
      }}
      className={cn(
        "group pointer-events-none absolute overflow-hidden rounded-xl bg-card",
        "h-56 w-44 sm:h-80 sm:w-56 lg:h-96 lg:w-64",
      )}
    >
      {/* Artwork is a local SVG file, which the image optimizer has nothing to
          do with, so a plain img is correct here. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={slide.image}
        alt={slide.title}
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <motion.div
        style={{ opacity: shade }}
        className="pointer-events-none absolute inset-0 bg-black"
      />

      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

      <Badge
        variant="outline"
        className="absolute top-3 right-3 gap-1 border-transparent bg-background/85 py-1 text-xs font-semibold tracking-widest uppercase backdrop-blur-md sm:top-5 sm:right-5 lg:top-6 lg:right-6"
      >
        {slide.soulbound ? <Lock aria-hidden="true" /> : null}
        {slide.badge}
      </Badge>

      <div className="absolute right-3 bottom-5 left-3 text-center text-white sm:right-5 sm:bottom-8 sm:left-5 sm:text-left lg:right-6 lg:bottom-10 lg:left-6">
        <motion.p
          style={{ opacity: copyOpacity }}
          className="mb-0.5 text-sm leading-tight font-semibold sm:mb-1 sm:text-lg lg:text-xl"
        >
          {slide.title}
        </motion.p>
        <motion.p
          style={{ opacity: copyOpacity }}
          className="hidden text-xs text-white/70 line-clamp-2 sm:block"
        >
          {slide.description}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default CarouselStacked;

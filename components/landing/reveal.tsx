"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import {
  EASE_OUT,
  REVEAL_DISTANCE,
  REVEAL_DURATION,
  STAGGER,
} from "@/lib/motion";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Multiplied by the shared stagger to order siblings within one section. */
  index?: number;
};

/**
 * Opacity and a small upward translate, nothing else. Under reduced motion the
 * content renders at its final position with no transition at all.
 */
const Reveal = ({ children, className, index = 0 }: RevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: REVEAL_DISTANCE }}
      animate={
        isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: REVEAL_DISTANCE }
      }
      transition={{
        duration: REVEAL_DURATION,
        ease: EASE_OUT,
        delay: index * STAGGER,
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;

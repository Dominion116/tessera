"use client";

import * as React from "react";
import { motion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

// Animation variants for the container to stagger children
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Animation variants for each grid item
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

/**
 * Props for the BentoGridShowcase component.
 * Each prop represents a "slot" in the grid.
 */
interface BentoGridShowcaseProps {
  /** Slot for the tall card (e.g., Integration) */
  integration: React.ReactNode;
  /** Slot for the top-middle card (e.g., Trackers) */
  trackers: React.ReactNode;
  /** Slot for the top-right card (e.g., Statistic) */
  statistic: React.ReactNode;
  /** Slot for the middle-middle card (e.g., Focus) */
  focus: React.ReactNode;
  /** Slot for the middle-right card (e.g., Productivity) */
  productivity: React.ReactNode;
  /** Slot for the wide bottom card (e.g., Shortcuts) */
  shortcuts: React.ReactNode;
  /** Optional class names for the grid container */
  className?: string;
}

/**
 * A responsive, animated bento grid layout component.
 * It arranges six content slots in the specific layout
 * seen in the "Product Features" UI.
 */
export const BentoGridShowcase = ({
  integration,
  trackers,
  statistic,
  focus,
  productivity,
  shortcuts,
  className,
}: BentoGridShowcaseProps) => {
  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className={cn(
        // Core grid layout: 1 col on mobile, 3 on large screens and up
        "grid w-full grid-cols-1 gap-6 lg:grid-cols-3",
        // Defines 3 explicit rows on large screens and up
        "lg:grid-rows-3",
        // Use minmax to ensure cards can grow but have a minimum height
        "auto-rows-[minmax(180px,auto)]",
        className
      )}
    >
      {/* Slot 1: Integration (Spans 2 rows) */}
      <motion.div variants={itemVariants} className="lg:col-span-1 lg:row-span-3">
        {integration}
      </motion.div>

      {/* Slot 2: Trackers */}
      <motion.div variants={itemVariants} className="lg:col-span-1 lg:row-span-1">
        {trackers}
      </motion.div>

      {/* Slot 3: Statistic */}
      <motion.div variants={itemVariants} className="lg:col-span-1 lg:row-span-1">
        {statistic}
      </motion.div>

      {/* Slot 4: Focus */}
      <motion.div variants={itemVariants} className="lg:col-span-1 lg:row-span-1">
        {focus}
      </motion.div>

      {/* Slot 5: Productivity */}
      <motion.div variants={itemVariants} className="lg:col-span-1 lg:row-span-1">
        {productivity}
      </motion.div>

      {/* Slot 6: Shortcuts (Spans 2 cols) */}
      <motion.div variants={itemVariants} className="lg:col-span-2 lg:row-span-1">
        {shortcuts}
      </motion.div>
    </motion.section>
  );
};

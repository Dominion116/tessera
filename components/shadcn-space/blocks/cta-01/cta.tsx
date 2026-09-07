"use client";
import { useRef } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { CHAIN_ID } from "@/lib/poap-data";

type CTAProps = {
  className?: string;
};

const CTA = ({ className }: CTAProps) => {
  const ref = useRef(null);

  const bottomAnimation = {
    initial: { y: "5%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 1, delay: 0.8 },
  };

  return (
    <section id="start" className={className}>
      <div className="sm:py-20 py-8">
        <div className="max-w-7xl mx-auto sm:px-16 px-4">
          <div
            ref={ref}
            className="relative overflow-hidden min-h-96 flex items-center justify-center px-6 border border-border rounded-3xl before:absolute before:w-full before:h-4/5 before:bg-linear-to-r before:from-teal-100 before:from-15% before:via-white before:via-55% before:to-teal-100 before:to-90% before:rounded-full before:top-24 before:blur-3xl before:-z-10 dark:before:from-teal-400/10 dark:before:from-40% dark:before:via-black dark:before:via-55% dark:before:to-teal-400/10 dark:before:to-60% dark:before:rounded-full dark:before:-z-10"
          >
            <motion.div
              {...bottomAnimation}
              className="flex flex-col gap-6 items-center mx-auto"
            >
              <div className="flex flex-col gap-3 items-center text-center">
                <h2 className="text-3xl md:text-5xl font-medium">
                  Register an event now, hand out badges tonight.
                </h2>
                <p className="max-w-2xl mx-auto">
                  One transaction on Base, chain {CHAIN_ID}. A name and a
                  picture is enough to start, and every setting is explained in
                  plain language before you commit to it.
                </p>
              </div>
              <Button
                asChild
                className="relative text-sm font-medium rounded-full h-12 p-1 ps-6 pe-14 group transition-all duration-500 hover:ps-14 hover:pe-6 w-fit overflow-hidden hover:bg-primary/80 cursor-pointer"
              >
                <Link href="/app/create">
                  <span className="relative z-10 transition-all duration-500">
                    Create a POAP
                  </span>
                  <div className="absolute right-1 w-10 h-10 bg-background text-foreground rounded-full flex items-center justify-center transition-all duration-500 group-hover:right-[calc(100%-44px)] group-hover:rotate-45">
                    <ArrowUpRight size={16} />
                  </div>
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;

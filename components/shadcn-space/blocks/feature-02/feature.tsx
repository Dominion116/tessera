"use client";

import Link from "next/link";
import { Asterisk, type LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Features = {
  icon: LucideIcon;
  title: string;
  content: string;
}[];

/**
 * The block the sections below the hero are patterned on. Its spacing, type
 * scale and card treatment live in `components/landing/{section,section-heading,
 * feature-card,section-footer}.tsx`, which is what the landing page renders.
 */
const Feature = ({ featureData }: { featureData: Features }) => {
  return (
    <section>
      <div className="py-8 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="flex flex-col gap-8 md:gap-16">
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
              className="mx-auto flex max-w-lg flex-col items-center justify-center gap-4"
            >
              <Badge variant="accent" className="h-auto px-3 py-1 text-sm">
                What a POAP is
              </Badge>
              <h1 className="text-center text-3xl font-semibold md:text-4xl">
                A badge that proves you were there, and that nobody can rewrite
              </h1>
            </motion.div>
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {featureData.map((value) => {
                return (
                  <motion.div
                    key={value.title}
                    variants={{
                      hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
                      show: { opacity: 1, y: 0, filter: "blur(0px)" },
                    }}
                    transition={{
                      duration: 0.8,
                      ease: [0.21, 0.47, 0.32, 0.98],
                    }}
                  >
                    <Card className="h-full border-t-4 border-t-transparent py-10 transition-all duration-300 hover:border-t-teal-400 hover:shadow-lg">
                      <CardContent className="flex flex-col gap-6 px-8">
                        <value.icon
                          aria-hidden="true"
                          strokeWidth={1.2}
                          className="size-8 text-teal-600 dark:text-teal-300"
                        />
                        <div className="flex flex-col gap-3">
                          <h6 className="text-xl font-semibold">{value.title}</h6>
                          <p className="text-base leading-7 font-normal text-muted-foreground">
                            {value.content}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
              className="flex flex-col items-center justify-center gap-5"
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <Asterisk size={16} aria-hidden="true" />
                <p className="text-sm font-normal">
                  Browsing badges needs no wallet, and no account
                </p>
              </div>
              <Button
                asChild
                className="h-auto rounded-full px-5 py-2.5 shadow-xs"
              >
                <Link href="/app">Browse the badges</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feature;

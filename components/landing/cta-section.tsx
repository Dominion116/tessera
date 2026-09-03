import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";
import Reveal from "@/components/landing/reveal";
import { Badge } from "@/components/ui/badge";
import { CHAIN_ID } from "@/lib/poap-data";

const CtaSection = () => {
  return (
    <section
      id="start"
      className="scroll-mt-24 border-t border-border bg-teal-400 text-black"
    >
      <div className="mx-auto max-w-7xl px-4 py-20 sm:py-24 xl:px-16">
        <Reveal className="flex flex-col gap-8">
          <div className="flex flex-col gap-5">
            <Badge
              variant="outline"
              className="gap-2 border-black/20 bg-black/5 px-3 py-1 tracking-wide text-black uppercase"
            >
              <span aria-hidden="true" className="size-1.5 rounded-full bg-black" />
              Your first badge
            </Badge>
            <h2 className="max-w-4xl text-3xl leading-tight font-bold sm:text-5xl md:text-6xl">
              Register an event now, hand out badges tonight.
            </h2>
            <p className="max-w-2xl text-base leading-7 text-black/70">
              One transaction on Base, chain {CHAIN_ID}. A name and a picture is
              enough to start, and every setting is explained in plain language before
              you commit to it.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/app/create"
              className="group relative flex h-12 w-fit items-center overflow-hidden rounded-full bg-black py-1 ps-6 pe-14 text-sm font-medium text-white press transition-all duration-500 hover:ps-14 hover:pe-6 focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-teal-400 focus-visible:outline-none"
            >
              <span className="relative z-10">Create a POAP</span>
              <span className="absolute right-1 flex size-10 items-center justify-center rounded-full bg-teal-400 text-black transition-all duration-500 group-hover:right-[calc(100%-44px)] group-hover:rotate-45">
                <ArrowUpRight size={16} aria-hidden="true" />
              </span>
            </Link>
            <Link
              href="/docs"
              className="flex h-12 w-fit items-center gap-2 rounded-full border border-black/25 px-6 text-sm font-medium press transition-colors duration-200 hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-black focus-visible:outline-none"
            >
              <BookOpen size={16} aria-hidden="true" />
              Read the docs first
            </Link>
          </div>

          <dl className="grid gap-6 border-t border-black/15 pt-8 sm:grid-cols-3">
            <div>
              <dt className="text-xs tracking-wide uppercase opacity-70">
                To create
              </dt>
              <dd className="pt-1 text-sm font-medium">
                A wallet, a name, an SVG
              </dd>
            </div>
            <div>
              <dt className="text-xs tracking-wide uppercase opacity-70">
                To collect
              </dt>
              <dd className="pt-1 text-sm font-medium">A wallet and a link</dd>
            </div>
            <div>
              <dt className="text-xs tracking-wide uppercase opacity-70">
                To browse
              </dt>
              <dd className="pt-1 text-sm font-medium">Nothing at all</dd>
            </div>
          </dl>
        </Reveal>
      </div>
    </section>
  );
};

export default CtaSection;

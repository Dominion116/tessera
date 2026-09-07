import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";
import Reveal from "@/components/landing/reveal";
import { Badge } from "@/components/ui/badge";
import { CHAIN_ID } from "@/lib/poap-data";

const REQUIREMENTS = [
  { label: "To create", value: "A wallet, a name, an SVG" },
  { label: "To collect", value: "A wallet and a link" },
  { label: "To browse", value: "Nothing at all" },
];

const CtaSection = () => {
  return (
    <section
      id="start"
      className="scroll-mt-24 border-t border-border bg-teal-400 text-black"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16 lg:py-20 xl:px-16">
        <Reveal className="flex flex-col gap-8 md:gap-16">
          <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-4 text-center">
            <Badge
              variant="outline"
              className="gap-2 border-black/20 bg-black/5 px-3 py-1 text-sm tracking-wide text-black uppercase"
            >
              <span aria-hidden="true" className="size-1.5 rounded-full bg-black" />
              Your first badge
            </Badge>
            <h2 className="text-3xl font-semibold md:text-4xl">
              Register an event now, hand out badges tonight
            </h2>
            <p className="text-base leading-7 text-black/70">
              One transaction on Base, chain {CHAIN_ID}. A name and a picture is
              enough to start, and every setting is explained in plain language
              before you commit to it.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col items-center gap-3 sm:flex-row">
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

            <dl className="grid w-full gap-6 border-t border-black/15 pt-8 text-center sm:grid-cols-3">
              {REQUIREMENTS.map((item) => (
                <div key={item.label}>
                  <dt className="text-sm tracking-wide uppercase opacity-70">
                    {item.label}
                  </dt>
                  <dd className="pt-1 text-base font-medium">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default CtaSection;

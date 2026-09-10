import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SiteFooter from "@/components/landing/site-footer";

export type LegalSection = {
  title: string;
  paragraphs: string[];
};

type LegalPageProps = {
  title: string;
  description: string;
  updated: string;
  sections: LegalSection[];
};

const LegalPage = ({ title, description, updated, sections }: LegalPageProps) => (
  <>
    <div className="relative h-16 bg-background">
      <div className="mx-auto flex h-full max-w-3xl items-center px-4 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg text-sm font-medium text-fg-secondary transition-[color,transform] duration-180 hover:translate-x-0.5 hover:text-teal-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 dark:hover:text-teal-300"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to Home
        </Link>
      </div>
    </div>
    <main className="min-h-svh bg-background">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <header className="border-b border-border/70 pb-8">
          <p className="text-xs font-medium tracking-[0.16em] text-teal-600 uppercase dark:text-teal-300">
            Legal
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-fg-secondary">{description}</p>
          <p className="mt-4 text-sm text-fg-tertiary">Last updated {updated}</p>
        </header>
        <div className="mt-10 flex flex-col gap-10 text-sm leading-7 text-fg-secondary">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">{section.title}</h2>
              <div className="mt-3 flex flex-col gap-4">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
    <SiteFooter sticky={false} />
  </>
);

export default LegalPage;

import Link from "next/link";
import { ArrowLeft, BookOpen, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { DOCS_NAV, type DocPage } from "@/components/docs/docs-data";

export function DocsBreadcrumbs({ page }: { page: DocPage }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-fg-tertiary">
      <Link href="/docs" className="transition-colors hover:text-foreground">Docs</Link>
      <ChevronRight aria-hidden="true" className="size-3" />
      <span className="text-fg-secondary">{page.section}</span>
      <ChevronRight aria-hidden="true" className="size-3" />
      <span aria-current="page" className="truncate text-foreground">{page.title}</span>
    </nav>
  );
}

const BackToAppLink = () => (
  <Link
    href="/app"
    className="inline-flex items-center gap-2 rounded-lg text-sm font-medium text-fg-secondary transition-[color,transform] duration-180 hover:translate-x-0.5 hover:text-teal-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 dark:hover:text-teal-300"
  >
    <ArrowLeft aria-hidden="true" className="size-4" />
    Back to app
  </Link>
);

export function DocsSidebar({ currentSlug }: { currentSlug: string }) {
  const sectionLinks = (
    <nav aria-label="Documentation sections" className="mt-2 flex flex-col gap-1">
      {DOCS_NAV.map((item) => (
        <Link
          key={item.slug || "overview"}
          href={item.slug ? `/docs/${item.slug}` : "/docs"}
          aria-current={item.slug === currentSlug ? "page" : undefined}
          className={cn(
            "rounded-lg px-3 py-2 text-sm transition-[background-color,color,transform] duration-180 hover:translate-x-0.5 hover:bg-teal-400/[0.06]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400",
            item.slug === currentSlug
              ? "bg-teal-400/10 font-medium text-teal-700 dark:text-teal-300"
              : "text-fg-secondary hover:text-foreground"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <aside className="min-w-0 lg:sticky lg:top-6 lg:h-[calc(100svh-3rem)]">
      <div className="hidden rounded-xl border border-border/70 bg-card/45 p-3 shadow-[inset_0_1px_0_oklch(1_0_0_/_5%),0_8px_24px_oklch(0_0_0_/_4%)] lg:block">
        <div className="flex items-center gap-2 px-3 py-2 text-sm font-semibold">
          <BookOpen aria-hidden="true" className="size-4 text-teal-600 dark:text-teal-300" />
          Documentation
        </div>
        {sectionLinks}
      </div>

      <details className="group rounded-xl border border-border/70 bg-card/45 p-3 shadow-[inset_0_1px_0_oklch(1_0_0_/_5%),0_8px_24px_oklch(0_0_0_/_4%)] lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-semibold outline-none transition-colors hover:bg-teal-400/[0.06] focus-visible:ring-2 focus-visible:ring-teal-400 lg:hidden [&::-webkit-details-marker]:hidden">
          <span className="flex min-w-0 items-center gap-2">
            <BookOpen aria-hidden="true" className="size-4 shrink-0 text-teal-600 dark:text-teal-300" />
            <span className="truncate">Documentation sections</span>
          </span>
          <ChevronDown aria-hidden="true" className="size-4 shrink-0 transition-transform duration-180 group-open:rotate-180" />
        </summary>
        <div className="hidden lg:flex lg:items-center lg:gap-2 lg:px-3 lg:py-2 lg:text-sm lg:font-semibold">
          <BookOpen aria-hidden="true" className="size-4 text-teal-600 dark:text-teal-300" />
          Documentation
        </div>
        <div className="group-open:block hidden">{sectionLinks}</div>
      </details>
    </aside>
  );
}

export function DocsPagination({ currentSlug }: { currentSlug: string }) {
  const index = DOCS_NAV.findIndex((item) => item.slug === currentSlug);
  const previous = index > 0 ? DOCS_NAV[index - 1] : undefined;
  const next = index >= 0 && index < DOCS_NAV.length - 1 ? DOCS_NAV[index + 1] : undefined;
  const href = (slug: string) => (slug ? `/docs/${slug}` : "/docs");

  return (
    <nav aria-label="Documentation pagination" className="mt-14 grid gap-3 border-t border-border/70 pt-6 sm:grid-cols-2">
      {previous ? (
        <Link href={href(previous.slug)} className="group rounded-xl border border-border/70 bg-card/35 p-4 transition-[border-color,background-color,transform] duration-180 hover:-translate-y-0.5 hover:border-teal-400/30 hover:bg-teal-400/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400">
          <span className="text-xs text-fg-tertiary">Previous</span>
          <span className="mt-1 block font-medium group-hover:text-teal-600 dark:group-hover:text-teal-300">{previous.label}</span>
        </Link>
      ) : <span aria-hidden="true" />}
      {next ? (
        <Link href={href(next.slug)} className="group rounded-xl border border-border/70 bg-card/35 p-4 text-right transition-[border-color,background-color,transform] duration-180 hover:-translate-y-0.5 hover:border-teal-400/30 hover:bg-teal-400/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400">
          <span className="text-xs text-fg-tertiary">Next</span>
          <span className="mt-1 block font-medium group-hover:text-teal-600 dark:group-hover:text-teal-300">{next.label}</span>
        </Link>
      ) : null}
    </nav>
  );
}

export function DocsArticle({ page }: { page: DocPage }) {
  return (
    <article className="docs-article">
      <div className="mb-5">
        <BackToAppLink />
      </div>
      <DocsBreadcrumbs page={page} />
      <header className="mt-8 border-b border-border/70 pb-8">
        <p className="text-xs font-medium tracking-[0.16em] text-teal-600 uppercase dark:text-teal-300">{page.section}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">{page.title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-fg-secondary">{page.description}</p>
      </header>
      <div className="mt-8 flex flex-col gap-10">
        {page.sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-xl font-semibold tracking-tight">{section.title}</h2>
            <div className="mt-3 flex flex-col gap-4 text-sm leading-7 text-fg-secondary [&_strong]:font-semibold [&_strong]:text-foreground">{section.content}</div>
          </section>
        ))}
      </div>
      <DocsPagination currentSlug={page.slug} />
    </article>
  );
}

export function DocsPage({ page }: { page: DocPage }) {
  return (
    <main className="min-h-svh border-t border-border bg-background">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14 lg:px-8 lg:py-12">
        <DocsSidebar currentSlug={page.slug} />
        <DocsArticle page={page} />
      </div>
    </main>
  );
}

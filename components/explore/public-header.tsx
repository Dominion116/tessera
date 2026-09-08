import Link from "next/link";
import { ArrowLeft, BookOpen, LayoutDashboard } from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";
import Wordmark from "@/components/landing/wordmark";

const PublicHeader = () => (
  <header className="border-b border-border/70 bg-background/80 backdrop-blur-md">
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
      <Link
        href="/"
        aria-label="Tessera, home"
        className="press rounded-md outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
      >
        <Wordmark className="h-8 w-auto" />
      </Link>
      <nav aria-label="Public navigation" className="flex items-center gap-1 sm:gap-2">
        <Link
          href="/docs"
          className="hidden items-center gap-2 rounded-md px-3 py-2 text-sm text-fg-secondary transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 sm:flex"
        >
          <BookOpen aria-hidden="true" className="size-4" />
          Docs
        </Link>
        <Link
          href="/app"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-fg-secondary transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
        >
          <LayoutDashboard aria-hidden="true" className="size-4" />
          <span className="hidden sm:inline">Open app</span>
        </Link>
        <ThemeToggle />
      </nav>
    </div>
  </header>
);

export default PublicHeader;

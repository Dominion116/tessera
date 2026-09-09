"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Album, BookOpen, CirclePlus, Compass, House } from "lucide-react";
import { cn } from "@/lib/utils";

const DOCK_ITEMS = [
  { href: "/app", label: "Home", icon: House },
  { href: "/poaps", label: "Explore", icon: Compass },
  { href: "/app/create", label: "Create", icon: CirclePlus },
  { href: "/app/collection", label: "Collection", icon: Album },
  { href: "/docs", label: "Docs", icon: BookOpen },
] as const;

type DockNavProps = {
  activeView?: "dashboard" | "explore" | "create";
  onExplore?: () => void;
  onCreate?: () => void;
};

/**
 * The fixed bottom dock, shared with the mini-app view later. It is the
 * primary navigation below `lg`, where the sidebar shell is hidden. Home
 * means the app home, not the landing page.
 */
const DockNav = ({ activeView, onExplore, onCreate }: DockNavProps = {}) => {
  const pathname = usePathname();

  return (
    <nav
      aria-label="App navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/85 backdrop-blur-md lg:hidden"
    >
      <ul className="mx-auto grid max-w-md grid-cols-5 pb-[env(safe-area-inset-bottom)]">
        {DOCK_ITEMS.map((item) => {
          const isLocalView =
            (item.href === "/poaps" && onExplore) ||
            (item.href === "/app/create" && onCreate);
          const active = isLocalView
            ? item.href === "/poaps"
              ? activeView === "explore"
              : activeView === "create"
            : item.href === "/app" && activeView
              ? activeView === "dashboard"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <li key={item.href}>
              {isLocalView ? (
                <button
                  type="button"
                  onClick={item.href === "/poaps" ? onExplore : onCreate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "press w-full min-h-14 flex-col items-center justify-center gap-1 px-1 pt-2 pb-3 text-xs outline-none transition-colors duration-180 focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-inset",
                    active
                      ? "font-medium text-teal-600 dark:text-teal-300"
                      : "text-fg-tertiary hover:text-fg-secondary"
                  )}
                >
                  <Icon aria-hidden="true" className="size-5" />
                  <span>{item.label}</span>
                </button>
              ) : (
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "press flex min-h-14 flex-col items-center justify-center gap-1 px-1 pt-2 pb-3 text-xs outline-none transition-colors duration-180 focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-inset",
                  active
                    ? "font-medium text-teal-600 dark:text-teal-300"
                    : "text-fg-tertiary transition-colors hover:text-fg-secondary"
                )}
              >
                <Icon aria-hidden="true" className="size-5" />
                <span>{item.label}</span>
              </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default DockNav;

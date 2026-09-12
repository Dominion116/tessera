"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  activeNavHref,
  APP_NAV_ITEMS,
  type AppNavItem,
} from "@/components/navigation/app-nav";
import { cn } from "@/lib/utils";

type FloatingNavProps = {
  items?: AppNavItem[];
};

/**
 * The floating bottom bar for viewports below `lg`, where the sidebar is
 * hidden. One row of equally weighted items, each a 24px icon above an 11px
 * label. Icon and label are centred on the same vertical axis inside the
 * slot, so the label sits directly under the icon and the row stays aligned
 * with the centre of the bar. Order comes from the shared nav config, which
 * is the same list the sidebar renders.
 */
const FloatingNav = ({ items = APP_NAV_ITEMS }: FloatingNavProps) => {
  const pathname = usePathname();
  const currentHref = activeNavHref(pathname, items);

  return (
    <nav
      aria-label="App navigation"
      className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden"
    >
      <ul className="flex w-full max-w-lg items-stretch rounded-2xl border border-border/70 bg-card/95 p-1.5 shadow-[inset_0_1px_0_oklch(1_0_0_/_6%),0_12px_32px_oklch(0_0_0_/_28%)] backdrop-blur-md">
        {items.map((item) => {
          const active = item.href === currentHref;
          const Icon = item.icon;

          return (
            <li key={item.href} className="min-w-0 flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "press flex h-full flex-col items-center justify-center gap-1 rounded-xl px-0.5 py-2 text-center outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-teal-400",
                  active
                    ? "bg-teal-400/10 text-teal-700 dark:text-teal-300"
                    : "text-fg-tertiary hover:text-foreground"
                )}
              >
                <Icon aria-hidden="true" className="size-6 shrink-0" />
                <span className="w-full truncate text-center text-[0.625rem] leading-none font-medium tracking-tight">
                  {item.shortLabel}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default FloatingNav;

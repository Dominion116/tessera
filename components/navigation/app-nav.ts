import {
  Album,
  BookOpen,
  CirclePlus,
  Compass,
  LayoutDashboard,
  Stamp,
  type LucideIcon,
} from "lucide-react";

export type AppNavItem = {
  href: string;
  /** Full label, used where there is room: the sidebar. */
  label: string;
  /** Compact label, used where the bar is narrow: the mobile dock. */
  shortLabel: string;
  icon: LucideIcon;
};

/**
 * The one ordered source for application navigation. The sidebar and the
 * mobile dock both render this list, so their items and their order cannot
 * drift apart. The order follows the product flow: the dashboard root, the
 * creator routes, the collector routes, then documentation.
 */
export const APP_NAV_ITEMS: AppNavItem[] = [
  { href: "/app", label: "Dashboard", shortLabel: "Home", icon: LayoutDashboard },
  { href: "/app/create", label: "Create a POAP", shortLabel: "Create", icon: CirclePlus },
  { href: "/app/created", label: "POAPs I created", shortLabel: "Created", icon: Stamp },
  { href: "/app/collection", label: "My collection", shortLabel: "Collection", icon: Album },
  { href: "/app/explore", label: "Explore", shortLabel: "Explore", icon: Compass },
  { href: "/docs", label: "Documentation", shortLabel: "Docs", icon: BookOpen },
];

/** Exact match for the dashboard root, prefix match for everything nested. */
export function matchesNavHref(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * The single active item for a path. The most specific href wins, so
 * `/app/created/12` lights POAPs I created rather than the broader Dashboard.
 */
export function activeNavHref(
  pathname: string,
  items: AppNavItem[] = APP_NAV_ITEMS
): string | undefined {
  return items
    .filter((item) => matchesNavHref(pathname, item.href))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;
}

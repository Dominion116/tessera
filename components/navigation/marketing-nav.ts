import type { NavLinkItem } from "@/components/shadcn-space/blocks/hero-03/navlink";

/**
 * Public marketing navigation, shared by the landing page and the standalone
 * hero-03 block so the two cannot drift. Every label points at the route it
 * names: Explore opens the explore route, not the dashboard root.
 */
export const MARKETING_NAV_ITEMS: NavLinkItem[] = [
  { title: "Home", href: "/" },
  { title: "Explore", href: "/app/explore" },
  { title: "Create", href: "/app/create" },
  { title: "Collection", href: "/app/collection" },
  { title: "Docs", href: "/docs" },
];

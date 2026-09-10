"use client";

import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Album, BookOpen, CirclePlus, Compass, House } from "lucide-react";
import { AnimatedTabBar } from "@/components/ui/animated-tab-bar";
import type { TabItem } from "@/components/ui/animated-tab-bar";
import type { DashboardView } from "@/components/dashboard/sidebar-nav";

const DOCK_ITEMS = [
  { href: "/app", label: "Home", icon: House },
  { href: "/app/explore", label: "Explore", icon: Compass },
  { href: "/app/create", label: "Create", icon: CirclePlus },
  { href: "/app/collection", label: "Collection", icon: Album },
  { href: "/docs", label: "Docs", icon: BookOpen },
] as const;

const DOCK_VIEWS: Record<string, DashboardView> = {
  "/app": "dashboard",
  "/app/explore": "explore",
  "/app/create": "create",
  "/app/collection": "collection",
};

/** The pattern's five accents, in tab order. */
const DOCK_COLORS = ["#ff8c00", "#f54888", "#4343f5", "#e0b115", "#65ddb7"];

type DockNavProps = {
  activeView?: DashboardView;
  onViewChange?: (view: DashboardView) => void;
};

/**
 * The fixed bottom dock, shared with the mini-app view, now the animated
 * tab bar: a floating pill whose wave swell rides the top edge and glides
 * to the active item while its icon lifts into the swell and draws itself
 * in. It is the primary navigation below `lg`, where the sidebar shell is
 * hidden. Home means the app home, not the landing page. Items with an
 * entry in DOCK_VIEWS switch views in-shell when a handler is supplied, so
 * the wallet-gated application never remounts; the rest navigate. The tab
 * bar runs controlled, so a view change from elsewhere (the sidebar) moves
 * the swell too.
 */
const DockNav = ({ activeView, onViewChange }: DockNavProps = {}) => {
  const pathname = usePathname();
  const router = useRouter();

  const items: TabItem[] = useMemo(
    () =>
      DOCK_ITEMS.map((item, index) => ({
        label: item.label,
        color: DOCK_COLORS[index],
        icon: <item.icon aria-hidden="true" />,
      })),
    []
  );

  const activeIndex = useMemo(() => {
    // In-shell mode follows the view state, so no item lights up for a
    // sidebar-only view such as "created". Standalone mode follows the URL.
    if (onViewChange) {
      return DOCK_ITEMS.findIndex(
        (item) => DOCK_VIEWS[item.href] === activeView
      );
    }
    return DOCK_ITEMS.findIndex(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
    );
  }, [activeView, onViewChange, pathname]);

  const handleTabChange = (index: number) => {
    const item = DOCK_ITEMS[index];
    if (!item) return;
    router.push(item.href);
  };

  return (
    <nav
      aria-label="App navigation"
      className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-2 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden"
    >
      <AnimatedTabBar
        items={items}
        activeIndex={activeIndex}
        onTabChange={handleTabChange}
      />
    </nav>
  );
};

export default DockNav;

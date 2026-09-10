"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Album,
  BookOpen,
  CirclePlus,
  Compass,
  LayoutDashboard,
  Stamp,
  type LucideIcon,
} from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export type DashboardView =
  | "dashboard"
  | "explore"
  | "created"
  | "collection"
  | "create";

type SidebarNavProps = {
  activeView?: DashboardView;
  onViewChange?: (view: DashboardView) => void;
};

const VIEW_BY_HREF: Record<string, DashboardView> = {
  "/app": "dashboard",
  "/app/explore": "explore",
  "/app/created": "created",
  "/app/collection": "collection",
  "/app/create": "create",
};

const NAV_ITEMS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/create", label: "Create a POAP", icon: CirclePlus },
  { href: "/app/created", label: "POAPs I created", icon: Stamp },
  { href: "/app/collection", label: "My collection", icon: Album },
  { href: "/app/explore", label: "Explore", icon: Compass },
  { href: "/docs", label: "Documentation", icon: BookOpen },
];

/**
 * Sidebar navigation for the dashboard. Exact match for /app so nested
 * routes do not light the Dashboard item up, prefix match otherwise.
 */
const SidebarNav = ({ activeView }: SidebarNavProps = {}) => {
  const pathname = usePathname();
  const router = useRouter();
  const routeView = Object.entries(VIEW_BY_HREF).find(([href]) => pathname === href)?.[1];
  const currentView = routeView ?? activeView;

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {NAV_ITEMS.map((item) => {
            const localView = VIEW_BY_HREF[item.href];
            const active = localView
               ? localView === currentView
              : pathname === item.href ||
                pathname.startsWith(`${item.href}/`);

            return (
              <SidebarMenuItem key={item.href}>
                {localView ? (
                  <SidebarMenuButton
                    isActive={active}
                     onClick={() => router.push(item.href)}
                    className="transition-colors duration-180"
                  >
                    <item.icon aria-hidden="true" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                ) : (
                  <SidebarMenuButton
                    asChild
                    isActive={active}
                    className="transition-colors duration-180"
                  >
                    <Link href={item.href}>
                      <item.icon aria-hidden="true" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default SidebarNav;

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { APP_NAV_ITEMS } from "@/components/navigation/app-nav";
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

/**
 * Sidebar navigation for the dashboard. Items and order come from the shared
 * nav config, so the sidebar and the mobile dock stay identical. Exact match
 * for /app so nested routes do not light the Dashboard item up, prefix match
 * otherwise.
 */
const SidebarNav = ({ activeView }: SidebarNavProps = {}) => {
  const pathname = usePathname();
  const router = useRouter();
  const routeView = Object.entries(VIEW_BY_HREF)
    .sort(([a], [b]) => b.length - a.length)
    .find(([href]) => pathname === href || pathname.startsWith(`${href}/`))?.[1];
  const currentView = routeView ?? activeView;

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {APP_NAV_ITEMS.map((item) => {
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

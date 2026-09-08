"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

export type DashboardView = "dashboard" | "explore";

type SidebarNavProps = {
  activeView: DashboardView;
  onViewChange: (view: DashboardView) => void;
};

const NAV_ITEMS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/create", label: "Create a POAP", icon: CirclePlus },
  { href: "/app/created", label: "POAPs I created", icon: Stamp },
  { href: "/app/collection", label: "My collection", icon: Album },
  { href: "/poaps", label: "Explore", icon: Compass },
  { href: "/docs", label: "Documentation", icon: BookOpen },
];

/**
 * Sidebar navigation for the dashboard. Exact match for /app so nested
 * routes do not light the Dashboard item up, prefix match otherwise.
 */
const SidebarNav = ({ activeView, onViewChange }: SidebarNavProps) => {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {NAV_ITEMS.map((item) => {
            const isLocalView = item.href === "/app" || item.href === "/poaps";
            const active =
              isLocalView
                ? (item.href === "/app" ? activeView === "dashboard" : activeView === "explore")
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

            return (
              <SidebarMenuItem key={item.href}>
                {isLocalView ? (
                  <SidebarMenuButton
                    isActive={active}
                    onClick={() => onViewChange(item.href === "/app" ? "dashboard" : "explore")}
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

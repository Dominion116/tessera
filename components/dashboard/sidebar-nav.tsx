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
const SidebarNav = () => {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/app"
                ? pathname === "/app"
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={active}>
                  <Link href={item.href}>
                    <item.icon aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default SidebarNav;

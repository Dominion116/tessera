"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import Wordmark from "@/components/landing/wordmark";
import DockNav from "@/components/navigation/dock-nav";
import SidebarNav from "@/components/dashboard/sidebar-nav";
import DashboardExploreView from "@/components/dashboard/dashboard-explore-view";
import CreatePoapView from "@/components/dashboard/create-poap-view";
import WalletChip from "@/components/wallet/wallet-chip";
import type { DashboardView } from "@/components/dashboard/sidebar-nav";

/**
 * The app frame. `lg` and up gets the sidebar shell with the content area
 * beside it; below that a compact topbar plus the fixed dock. The content
 * column carries bottom padding plus the safe-area inset so the dock never
 * covers it. The sidebar does not collapse: below `lg` it is hidden
 * entirely, because the dock replaces it.
 */
type DashboardShellProps = {
  children: React.ReactNode;
  initialView?: DashboardView;
};

const DashboardShell = ({ children, initialView = "dashboard" }: DashboardShellProps) => {
  const [activeView, setActiveView] = useState<DashboardView>(initialView);

  return (
  <SidebarProvider>
    <Sidebar
      collapsible="none"
      className="hidden border-r border-sidebar-border lg:flex lg:sticky lg:top-0 lg:h-svh"
    >
      <SidebarHeader>
        <Link
          href="/"
          aria-label="Tessera, home"
          className="press rounded-md px-2 py-2 outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
        >
          <Wordmark />
        </Link>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarNav
          activeView={activeView}
          onViewChange={setActiveView}
        />
      </SidebarContent>
      <SidebarFooter>
        <WalletChip />
      </SidebarFooter>
    </Sidebar>
    <SidebarInset>
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-2 border-b border-border bg-background/80 px-4 backdrop-blur-md lg:hidden">
        <Link
          href="/app"
          aria-label="Tessera dashboard, home"
          className="press rounded-md outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
        >
          <Wordmark className="h-7 w-auto" />
        </Link>
        <WalletChip className="w-auto" />
      </header>
      <div className="pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-0">
        {activeView === "explore" ? (
          <DashboardExploreView />
        ) : activeView === "create" ? (
          <CreatePoapView />
        ) : (
          children
        )}
      </div>
    </SidebarInset>
    <DockNav
      activeView={activeView}
      onExplore={() => setActiveView("explore")}
      onCreate={() => setActiveView("create")}
    />
  </SidebarProvider>
  );
};

export default DashboardShell;

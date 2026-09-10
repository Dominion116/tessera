import type { Metadata } from "next";
import DashboardExploreView from "@/components/dashboard/dashboard-explore-view";

export const metadata: Metadata = { title: "Explore" };

export default function ExploreRoute() {
  return <DashboardExploreView />;
}

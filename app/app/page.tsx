import type { Metadata } from "next";
import DashboardPage from "@/components/dashboard/dashboard-page";

export const metadata: Metadata = {
  title: "Dashboard",
};

const AppPage = () => <DashboardPage />;

export default AppPage;

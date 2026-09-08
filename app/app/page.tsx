import type { Metadata } from "next";
import AppGate from "@/components/dashboard/app-gate";

export const metadata: Metadata = {
  title: "Dashboard",
};

const AppPage = () => <AppGate />;

export default AppPage;

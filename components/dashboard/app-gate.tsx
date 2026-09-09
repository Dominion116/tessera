"use client";

import ConnectPrompt from "@/components/wallet/connect-prompt";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import DashboardPage from "@/components/dashboard/dashboard-page";
import { useConnectRedirect } from "@/components/wallet/use-connect-redirect";
import { useWallet } from "@/components/wallet/wallet-provider";
import type { DashboardView } from "@/components/dashboard/sidebar-nav";

/**
 * The /app switch: the full-page connect prompt until a wallet is
 * connected, then the dashboard shell with the dashboard home inside
 * it. Connecting here sends the user to the landing page rather than
 * straight into the dashboard, matching the connect flow the Open App
 * buttons run; the gate itself never navigates until a wallet exists,
 * and a reload with a remembered wallet goes straight to the dashboard.
 */
const AppGate = ({ initialView = "dashboard" }: { initialView?: DashboardView }) => {
  const { address } = useWallet();
  const { connectAndRedirect } = useConnectRedirect();

  if (!address) {
    return <ConnectPrompt variant="page" onConnect={connectAndRedirect} />;
  }

  return (
    <DashboardShell initialView={initialView}>
      <DashboardPage />
    </DashboardShell>
  );
};

export default AppGate;

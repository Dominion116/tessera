"use client";

import ConnectPrompt from "@/components/wallet/connect-prompt";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import DashboardPage from "@/components/dashboard/dashboard-page";
import { useWallet } from "@/components/wallet/wallet-provider";

/**
 * The /app switch: the full-page connect prompt until a wallet is
 * connected, then the dashboard shell with the dashboard home inside it.
 */
const AppGate = () => {
  const { address } = useWallet();

  if (!address) {
    return <ConnectPrompt variant="page" />;
  }

  return (
    <DashboardShell>
      <DashboardPage />
    </DashboardShell>
  );
};

export default AppGate;

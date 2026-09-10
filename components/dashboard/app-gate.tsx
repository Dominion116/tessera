"use client";

import ConnectPrompt from "@/components/wallet/connect-prompt";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import { useConnectRedirect } from "@/components/wallet/use-connect-redirect";
import { useWallet } from "@/components/wallet/wallet-provider";

/**
 * The /app switch: the full-page connect prompt until a wallet is
 * connected, then the dashboard shell with the dashboard home inside
 * it. Connecting here sends the user to the landing page rather than
 * straight into the dashboard, matching the connect flow the Open App
 * buttons run; the gate itself never navigates until a wallet exists,
 * and a reload with a remembered wallet goes straight to the dashboard.
 */
const AppGate = ({ children }: { children: React.ReactNode }) => {
  const { address, isConnecting, walletError } = useWallet();
  const { connectAndRedirect } = useConnectRedirect();

  if (!address) {
    return <ConnectPrompt variant="page" onConnect={connectAndRedirect} isConnecting={isConnecting} walletError={walletError} />;
  }

  return (
    <DashboardShell>{children}</DashboardShell>
  );
};

export default AppGate;

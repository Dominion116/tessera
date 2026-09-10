"use client";

import ConnectPrompt from "@/components/wallet/connect-prompt";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import { useConnectRedirect } from "@/components/wallet/use-connect-redirect";
import { useWallet } from "@/components/wallet/wallet-provider";
import { usePathname } from "next/navigation";

/**
 * The /app switch: the full-page connect prompt until a wallet is
 * connected, then the dashboard shell with the dashboard home inside
 * it. Connecting here keeps the requested app route, while loading the page
 * alone never opens the wallet picker or reconnects a remembered wallet.
 */
const AppGate = ({ children }: { children: React.ReactNode }) => {
  const { address, isConnecting, walletError } = useWallet();
  const pathname = usePathname();
  const { connectAndRedirect } = useConnectRedirect(pathname);

  if (!address) {
    return <ConnectPrompt variant="page" onConnect={connectAndRedirect} isConnecting={isConnecting} walletError={walletError} />;
  }

  return (
    <DashboardShell>{children}</DashboardShell>
  );
};

export default AppGate;

"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit, useAppKit, useAppKitState, useAppKitTheme } from "@reown/appkit/react";
import { baseSepolia } from "@reown/appkit/networks";
import {
  cookieToInitialState,
  useAccount,
  WagmiProvider,
  type Config,
} from "wagmi";
import {
  appKitMetadata,
  networks,
  projectId,
  wagmiAdapter,
  wagmiConfig,
} from "@/lib/appkit";

type WalletContextValue = {
  address: `0x${string}` | null;
  connect: () => void;
  disconnect: () => void;
  isConnecting: boolean;
  isDisconnecting: boolean;
  walletError: string | null;
};

/**
 * The one seam between the interface and the wallet. AppKit supplies
 * the modal, wagmi supplies the account, and every component above this
 * file keeps consuming `useWallet`, so the surface above the seam is
 * unchanged: an address, a way in, and a way out.
 */

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks,
  defaultNetwork: baseSepolia,
  metadata: appKitMetadata,
  features: {
    analytics: false,
    email: false,
    socials: [],
  },
  themeVariables: {
    "--w3m-accent": "#14b8a6",
    "--w3m-border-radius-master": "2",
  },
});

const WalletContext = createContext<WalletContextValue | null>(null);

function WalletBridge({ children }: { children: ReactNode }) {
  const { address } = useAccount();
  const { open } = useAppKit();
  const appKitState = useAppKitState();
  const pathname = usePathname();
  const router = useRouter();
  const previousAddress = React.useRef<`0x${string}` | null>(address ?? null);
  const [isDisconnecting, setIsDisconnecting] = React.useState(false);
  const [walletError, setWalletError] = React.useState<string | null>(null);

  useEffect(() => {
    const previous = previousAddress.current;
    previousAddress.current = address ?? null;

    if (previous && !address) {
      void queryClient.clear();
      if (pathname !== "/") router.replace("/");
    }
  }, [address, pathname, router]);

  const connect = useCallback(() => {
    setWalletError(null);
    void open().catch((error: unknown) => setWalletError(error instanceof Error ? error.message : "Wallet connection was not completed."));
  }, [open]);

  const handleDisconnect = useCallback(() => {
    setWalletError(null);
    setIsDisconnecting(true);
    void modal.disconnect().then(() => queryClient.clear()).catch((error: unknown) => {
      setWalletError(error instanceof Error ? error.message : "Wallet could not be disconnected.");
    }).finally(() => setIsDisconnecting(false));
  }, []);

  const value = useMemo(
    () => ({
      address: address ?? null,
      connect,
      disconnect: handleDisconnect,
      isConnecting: appKitState.loading || appKitState.open,
      isDisconnecting,
      walletError,
    }),
    [address, connect, handleDisconnect, appKitState.loading, appKitState.open, isDisconnecting, walletError]
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

function ThemeBridge({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();
  const { setThemeMode } = useAppKitTheme();

  useEffect(() => {
    setThemeMode(resolvedTheme === "light" ? "light" : "dark");
  }, [resolvedTheme, setThemeMode]);

  return <>{children}</>;
}

export function WalletProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies?: string | null;
}) {
  const initialState = cookieToInitialState(
    wagmiConfig as Config,
    cookies
  );

  return (
      <WagmiProvider config={wagmiConfig as Config} initialState={initialState} reconnectOnMount={false}>
      <QueryClientProvider client={queryClient}>
        <ThemeBridge>
          <WalletBridge>{children}</WalletBridge>
        </ThemeBridge>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider.");
  }

  return context;
}

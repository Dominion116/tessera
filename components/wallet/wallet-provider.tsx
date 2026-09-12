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
  useConnect,
  useDisconnect,
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
import { useFarcaster } from "@/components/farcaster/farcaster-provider";

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

createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks,
  defaultNetwork: baseSepolia,
  metadata: appKitMetadata,
  enableWallets: true,
  allWallets: "SHOW",
  featuredWalletIds: [
    "c57ca95b47569778a828d1a8783e4d90ccd2ec88be00c7097e2f17215aa0cd64", // MetaMask
    "ecc4036f814562b41a5268ada86c804a380e837b00681f3f3b450397b105c721", // Zerion
    "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0", // Trust
    "fd20dc426fb3704d1f62d8280cb2653bee3905c34e80cefa1279ee8105d5da84", // Coinbase
  ],
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
  const { transport } = useFarcaster();
  const { connectAsync, connectors, isPending: isConnectPending } = useConnect();
  const { disconnectAsync } = useDisconnect();
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

    // Inside a confirmed Farcaster host an explicit action uses the native
    // connector; everywhere else keeps the AppKit modal.
    if (transport === "farcaster") {
      const connector = connectors.find((item) => item.id === "farcaster");
      if (connector) {
        void connectAsync({ connector }).catch((error: unknown) =>
          setWalletError(
            error instanceof Error
              ? error.message
              : "The Farcaster wallet request was not completed."
          )
        );
        return;
      }
    }

    void open().catch((error: unknown) =>
      setWalletError(
        error instanceof Error
          ? error.message
          : "Wallet connection was not completed."
      )
    );
  }, [transport, connectors, connectAsync, open]);

  const handleDisconnect = useCallback(() => {
    setWalletError(null);
    setIsDisconnecting(true);
    void disconnectAsync()
      .then(() => queryClient.clear())
      .catch((error: unknown) => {
        setWalletError(
          error instanceof Error
            ? error.message
            : "Wallet could not be disconnected."
        );
      })
      .finally(() => setIsDisconnecting(false));
  }, [disconnectAsync]);

  const value = useMemo(
    () => ({
      address: address ?? null,
      connect,
      disconnect: handleDisconnect,
      isConnecting: appKitState.loading || appKitState.open || isConnectPending,
      isDisconnecting,
      walletError,
    }),
    [address, connect, handleDisconnect, appKitState.loading, appKitState.open, isConnectPending, isDisconnecting, walletError]
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

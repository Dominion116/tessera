"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CONNECTED_ADDRESS } from "@/lib/dashboard-data";

type WalletContextValue = {
  address: `0x${string}` | null;
  connect: () => void;
  disconnect: () => void;
};

const WalletContext = createContext<WalletContextValue | null>(null);

/**
 * The one seam between the interface and whatever connects wallets. It
 * holds a single placeholder address in memory for now: state is
 * session-only, never persisted, and nothing here signs or broadcasts.
 * The @reown/appkit wiring later replaces these internals, and no
 * component above this file changes.
 */
export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<`0x${string}` | null>(null);

  const connect = useCallback(() => setAddress(CONNECTED_ADDRESS), []);
  const disconnect = useCallback(() => setAddress(null), []);

  const value = useMemo(
    () => ({ address, connect, disconnect }),
    [address, connect, disconnect]
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider.");
  }

  return context;
}

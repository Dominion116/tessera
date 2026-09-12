"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  STANDALONE_HOST_STATE,
  createBackAdapter,
  createReadyOnce,
  detectHostState,
  loadMiniAppSdk,
  selectWalletTransport,
  supportsCapability,
  type FarcasterHostState,
  type WalletTransport,
} from "@/lib/farcaster/runtime";

type ComposeCastOptions = {
  text?: string;
  embeds?: [] | [string] | [string, string];
};

type FarcasterContextValue = FarcasterHostState & {
  /** Detection finished. False only during the first client paint. */
  settled: boolean;
  transport: WalletTransport;
  canComposeCast: boolean;
  composeCast: (options: ComposeCastOptions) => Promise<boolean>;
};

const FarcasterContext = createContext<FarcasterContextValue | null>(null);

/**
 * Host context only. It never requests a wallet, never changes the route and
 * never renders a second layout: standalone browsers simply keep the
 * `STANDALONE_HOST_STATE` defaults.
 */
export function FarcasterProvider({ children }: { children: ReactNode }) {
  const [host, setHost] = useState<FarcasterHostState>(STANDALONE_HOST_STATE);
  const [settled, setSettled] = useState(false);
  const composeRef = useRef<
    ((options: ComposeCastOptions) => Promise<boolean>) | null
  >(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const sdk = await loadMiniAppSdk();
      const detected = await detectHostState(sdk);
      if (cancelled) return;

      setHost(detected);
      setSettled(true);

      if (!detected.isMiniApp || !sdk) return;

      composeRef.current = async (options) => {
        try {
          await sdk.actions?.composeCast?.(options);
          return true;
        } catch {
          return false;
        }
      };

      const back = createBackAdapter(sdk, detected.capabilities);
      if (back.canGoBack) {
        back.bind(() => window.history.back());
        try {
          await sdk.back?.show?.();
        } catch {
          // Host chrome is optional.
        }
        void back.enableWebNavigation();
      }

      // Called once, after mount, and never allowed to block rendering.
      const ready = createReadyOnce(sdk);
      await ready({ disableNativeGestures: false });
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const composeCast = useCallback(async (options: ComposeCastOptions) => {
    if (!composeRef.current) return false;
    return composeRef.current(options);
  }, []);

  const value = useMemo<FarcasterContextValue>(
    () => ({
      ...host,
      settled,
      transport: selectWalletTransport(host),
      canComposeCast:
        host.isMiniApp &&
        (supportsCapability(host, "actions.composeCast") ||
          host.capabilities.length === 0),
      composeCast,
    }),
    [host, settled, composeCast]
  );

  return (
    <FarcasterContext.Provider value={value}>
      {children}
    </FarcasterContext.Provider>
  );
}

export function useFarcaster() {
  const context = useContext(FarcasterContext);

  if (!context) {
    throw new Error("useFarcaster must be used within a FarcasterProvider.");
  }

  return context;
}

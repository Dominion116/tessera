"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "./wallet-provider";

/**
 * The connect aftermath. `connect()` only opens the wallet picker; it
 * says nothing about whether a wallet arrived, so a surface that asks
 * for a connection arms this hook and waits for the address. When one
 * appears the hook disarms and lands the user on the landing page, as
 * the connect flow promises. Auto-reconnects never arm it, because a
 * reload with a remembered wallet is not a connection a screen asked
 * for — those keep whatever page they were on.
 *
 * The hook lives in the surviving host (the button, the /app gate),
 * never inside the prompt itself: the prompt unmounts the instant the
 * address appears, which would cancel its own pending work.
 */
export function useConnectRedirect() {
  const { address, connect } = useWallet();
  const router = useRouter();
  const armed = useRef(false);

  const connectAndRedirect = useCallback(() => {
    armed.current = true;
    connect();
  }, [connect]);

  useEffect(() => {
    if (!armed.current || !address) return;
    armed.current = false;
    router.push("/");
  }, [address, router]);

  return { connectAndRedirect };
}

"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "./wallet-provider";

/**
 * The connect aftermath. `connect()` only opens the wallet picker; it
 * says nothing about whether a wallet arrived, so a surface that asks
 * for a connection arms this hook and waits for the address. When one
 * appears the hook disarms and lands the user at the action's destination.
 * Loading a page never arms it, so only an explicit button click can open
 * the wallet picker or cause this navigation.
 *
 * The hook lives in the surviving host (the button, the /app gate),
 * never inside the prompt itself: the prompt unmounts the instant the
 * address appears, which would cancel its own pending work.
 */
export function useConnectRedirect(destination = "/") {
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
    router.push(destination);
  }, [address, destination, router]);

  return { connectAndRedirect };
}

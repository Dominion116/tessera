"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getSnapshot = () => window.location.origin;
const getServerSnapshot = () => "";

/**
 * The browser origin, resolved without a render-phase state write and
 * without a hydration mismatch. Server rendering and the first client render
 * both see an empty string, then React re-reads once mounted. Every caller
 * uses the value inside an event handler or after user interaction, so the
 * empty first frame is never shown.
 */
export function useOrigin(): string {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

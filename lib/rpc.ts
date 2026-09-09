/**
 * The Base Sepolia transport chain shared by the read layer and the
 * wallet adapter. Requests go to the configured `NEXT_PUBLIC_RPC_URL`
 * first, then across public providers, because the chain's own
 * endpoint is rate limited: when it drops or resets a connection the
 * browser surfaces a raw `TypeError: Failed to fetch`, and a second
 * endpoint turns that into a retry instead of a failed screen.
 */

import { fallback, http, type Transport } from "viem";

/** Public Base Sepolia endpoints, both serving CORS to browsers. */
const PUBLIC_RPC_URLS = [
  "https://sepolia.base.org",
  "https://base-sepolia-rpc.publicnode.com",
] as const;

/**
 * The fallback transport every Base Sepolia client shares. The
 * configured RPC leads when set; duplicates drop out so the list is
 * a real chain of distinct endpoints.
 */
export function createBaseSepoliaTransports(): Transport {
  const configured = process.env.NEXT_PUBLIC_RPC_URL?.trim() || "";
  const urls = [configured, ...PUBLIC_RPC_URLS].filter(
    (url, index, all) => url !== "" && all.indexOf(url) === index
  );
  return fallback(urls.map((url) => http(url)));
}

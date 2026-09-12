/**
 * Shared Farcaster Miniapp configuration. Every manifest and embed URL is
 * derived from one canonical origin, so the identity is consistent and never
 * carries a trailing slash (account association is domain-bound).
 */

export const FARCASTER_MINIAPP_VERSION = "1" as const;

export const DEFAULT_APP_URL = "http://localhost:3000";

/** The web-standard share size Farcaster embeds expect: PNG at 3:2, at least 600x400. */
export const EMBED_IMAGE_SIZE = { width: 1200, height: 800 } as const;

export const MINIAPP_ASSET_PATHS = {
  icon: "/miniapp-assets/icon",
  splash: "/miniapp-assets/splash",
  hero: "/miniapp-assets/hero",
} as const;

export const MINIAPP_SPLASH_BACKGROUND = "#0a0a0a";

/** Farcaster's contract-facing chain identifier for Base Sepolia. */
export const FARCASTER_REQUIRED_CHAINS = ["eip155:84532"] as const;

/** Host capabilities the Miniapp depends on. Nothing notification- or auth-related. */
export const FARCASTER_REQUIRED_CAPABILITIES = [
  "actions.ready",
  "actions.openUrl",
  "actions.composeCast",
  "wallet.getEthereumProvider",
  "back",
] as const;

/** The canonical origin with no trailing slash. Empty values fall back to localhost. */
export function resolveAppOrigin(raw?: string | null): string {
  const value = (raw ?? "").trim() || DEFAULT_APP_URL;
  return value.replace(/\/+$/, "");
}

/** Joins the canonical origin with an absolute path. */
export function absoluteUrl(origin: string, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${clean}`;
}

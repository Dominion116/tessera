/**
 * Reown AppKit and wagmi configuration. One network, Base Sepolia, with
 * the wallet modal supplied by AppKit. The WalletConnect project ID
 * comes from the environment; without one the adapter falls back to the
 * public development ID Reown documents for local use, which still
 * serves injected wallet connections. Transports chain
 * `NEXT_PUBLIC_RPC_URL` with public Base Sepolia endpoints, so a
 * deployment needs nothing but an RPC URL and a rate-limited public
 * endpoint fails over instead of failing requests.
 */

import { cookieStorage, createStorage } from "@wagmi/core";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { baseSepolia } from "@reown/appkit/networks";
import type { AppKitNetwork } from "@reown/appkit/networks";
import { createBaseSepoliaTransports } from "./rpc";

export const projectId =
  process.env.NEXT_PUBLIC_WC_PROJECT_ID?.trim() ||
  "b56e18d47c72ab683b10814fe9495694";

export const networks = [baseSepolia] as [AppKitNetwork, ...AppKitNetwork[]];

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  projectId,
  networks,
  transports: {
    [baseSepolia.id]: createBaseSepoliaTransports(),
  },
});

export const wagmiConfig = wagmiAdapter.wagmiConfig;

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL?.trim() || "http://localhost:3000";
const origin = typeof window !== "undefined" ? window.location.origin : APP_URL;

export const appKitMetadata = {
  name: "Tessera",
  description:
    "Create onchain POAPs, hand them out at real events, and collect them.",
  url: origin,
  icons: [`${origin}/tessera-mark.svg`],
};

/**
 * Reown AppKit and wagmi configuration. One network, Base Sepolia, with
 * the wallet modal supplied by AppKit. The WalletConnect project ID
 * comes from the environment; without one the adapter falls back to the
 * public development ID Reown documents for local use, which still
 * serves injected wallet connections. Transports read through
 * `NEXT_PUBLIC_RPC_URL` with the chain default as fallback, so a
 * deployment needs nothing but an RPC URL.
 */

import { cookieStorage, createStorage } from "@wagmi/core";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { baseSepolia } from "@reown/appkit/networks";
import type { AppKitNetwork } from "@reown/appkit/networks";
import { fallback, http } from "viem";

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL?.trim() || "";

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
    [baseSepolia.id]: RPC_URL ? fallback([http(RPC_URL), http()]) : http(),
  },
});

export const wagmiConfig = wagmiAdapter.wagmiConfig;

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL?.trim() || "http://localhost:3000";

export const appKitMetadata = {
  name: "Tessera",
  description:
    "Create onchain POAPs, hand them out at real events, and collect them.",
  url: APP_URL,
  icons: [`${APP_URL}/tessera-mark.svg`],
};

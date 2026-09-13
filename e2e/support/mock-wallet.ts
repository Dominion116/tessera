import { expect, type Page } from "@playwright/test";

/**
 * A deterministic wallet for the browser tests. `window.ethereum` is defined
 * before any application script runs, so AppKit's injected connector is
 * present in the wallet modal and connects without a real extension.
 *
 * Contract reads never travel through this provider: wagmi serves them over
 * the Base Sepolia transport, so the dashboard, Explore and the public pages
 * are still reading the deployed contract. The provider only answers the
 * account and chain questions a connection needs.
 */
export const TEST_ACCOUNT = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
export const TEST_CHAIN_ID_HEX = "0x14a34";

export async function installMockWallet(
  page: Page,
  account: string = TEST_ACCOUNT
) {
  await page.addInitScript(
    ({
      account,
      chainIdHex,
    }: {
      account: string;
      chainIdHex: string;
    }) => {
      const listeners = new Map<string, Set<(payload: unknown) => void>>();

      const addListener = (
        event: string,
        handler: (payload: unknown) => void
      ) => {
        const set = listeners.get(event) ?? new Set();
        set.add(handler);
        listeners.set(event, set);
      };

      const removeListener = (
        event: string,
        handler: (payload: unknown) => void
      ) => {
        listeners.get(event)?.delete(handler);
      };

      const randomHex = (bytes: number) =>
        `0x${Array.from({ length: bytes }, () =>
          Math.floor(Math.random() * 256)
        )
          .map((value) => value.toString(16).padStart(2, "0"))
          .join("")}`;

      const provider = {
        chainId: chainIdHex,
        networkVersion: String(parseInt(chainIdHex, 16)),
        selectedAddress: account,
        isConnected: () => true,
        async request({ method }: { method: string }) {
          switch (method) {
            case "eth_requestAccounts":
            case "eth_accounts":
              return [account];
            case "eth_chainId":
              return chainIdHex;
            case "net_version":
              return String(parseInt(chainIdHex, 16));
            case "wallet_switchEthereumChain":
            case "wallet_addEthereumChain":
            case "wallet_watchAsset":
              return null;
            case "eth_sendTransaction":
            case "eth_sendRawTransaction":
              return randomHex(32);
            case "personal_sign":
            case "eth_sign":
            case "eth_signTypedData":
            case "eth_signTypedData_v3":
            case "eth_signTypedData_v4":
              return `0x${"11".repeat(65)}`;
            case "eth_getBalance":
              return "0x0";
            case "eth_call":
            case "eth_getCode":
              return "0x";
            case "eth_estimateGas":
              return "0x5208";
            case "eth_gasPrice":
              return "0x3b9aca00";
            case "eth_blockNumber":
            case "eth_getTransactionCount":
              return "0x0";
            case "eth_getTransactionReceipt":
              return null;
            default:
              return null;
          }
        },
        on(event: string, handler: (payload: unknown) => void) {
          addListener(event, handler);
          return provider;
        },
        removeListener(event: string, handler: (payload: unknown) => void) {
          removeListener(event, handler);
          return provider;
        },
        once(event: string, handler: (payload: unknown) => void) {
          const onceHandler = (payload: unknown) => {
            removeListener(event, onceHandler);
            handler(payload);
          };
          addListener(event, onceHandler);
          return provider;
        },
      };

      Object.defineProperty(window, "ethereum", {
        configurable: true,
        writable: true,
        value: provider,
      });
    },
    { account, chainIdHex: TEST_CHAIN_ID_HEX }
  );
}

/**
 * Opens the connect prompt, chooses the injected wallet that
 * `installMockWallet` supplied, and waits for the connected shell. The test
 * id belongs to AppKit's injected connector entry in the wallet modal.
 */
export async function connectMockWallet(page: Page) {
  await page.getByRole("button", { name: "Connect wallet" }).click();
  await page.getByTestId("wallet-selector-injected").click();
  await expect(
    page.getByRole("button", { name: "Disconnect wallet" })
  ).toBeVisible();
}

/**
 * The Farcaster runtime adapter: host detection, one-shot `ready()` and back
 * navigation, all kept separate from the wallet provider. Every entry point
 * no-ops safely on the standalone website and when the SDK is unavailable, so
 * the same code path serves web and Miniapp without a second layout.
 */

export type SafeAreaInsets = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

export type FarcasterHostState = {
  isMiniApp: boolean;
  capabilities: string[];
  safeAreaInsets: SafeAreaInsets | null;
};

export const STANDALONE_HOST_STATE: FarcasterHostState = {
  isMiniApp: false,
  capabilities: [],
  safeAreaInsets: null,
};

export type WalletTransport = "farcaster" | "appkit";

export type ReadyOptions = { disableNativeGestures?: boolean };

/**
 * The narrow slice of the Miniapp SDK this adapter consumes. Typing it locally
 * keeps the detection logic unit-testable without a browser host and prevents
 * the SDK from leaking into server rendering.
 */
export type MiniAppSdkLike = {
  isInMiniApp?: () => Promise<boolean>;
  getCapabilities?: () => Promise<string[]>;
  context?: Promise<{ client?: { safeAreaInsets?: SafeAreaInsets } } | undefined>;
  actions?: {
    ready?: (options?: ReadyOptions) => Promise<void> | void;
    composeCast?: (options: {
      text?: string;
      embeds?: [] | [string] | [string, string];
    }) => Promise<unknown>;
  };
  back?: {
    enableWebNavigation?: () => Promise<void>;
    show?: () => Promise<void>;
    onback?: (() => unknown) | null;
  };
};

/**
 * Host detection is capability-based: a browser URL or query string is never
 * treated as proof of host context. `isInMiniApp()` is authoritative and a
 * non-empty capability list is the fallback signal.
 */
export async function detectHostState(
  sdk: MiniAppSdkLike | null | undefined
): Promise<FarcasterHostState> {
  if (!sdk) return STANDALONE_HOST_STATE;

  try {
    const capabilities = (await sdk.getCapabilities?.()) ?? [];
    const isInMiniApp = (await sdk.isInMiniApp?.()) ?? false;

    if (!isInMiniApp && capabilities.length === 0) {
      return STANDALONE_HOST_STATE;
    }

    let safeAreaInsets: SafeAreaInsets | null = null;
    try {
      const context = await sdk.context;
      safeAreaInsets = context?.client?.safeAreaInsets ?? null;
    } catch {
      safeAreaInsets = null;
    }

    return { isMiniApp: true, capabilities: [...capabilities], safeAreaInsets };
  } catch {
    return STANDALONE_HOST_STATE;
  }
}

/**
 * The native wallet connector is only selected inside a confirmed host and
 * only from an explicit user action. Everything else keeps the AppKit flow.
 */
export function selectWalletTransport(host: FarcasterHostState): WalletTransport {
  return host.isMiniApp ? "farcaster" : "appkit";
}

export function supportsCapability(
  host: FarcasterHostState,
  capability: string
): boolean {
  return host.capabilities.includes(capability);
}

/**
 * `ready()` must be called exactly once, after the first interface is
 * renderable, and must never block or break rendering on failure.
 */
export function createReadyOnce(
  sdk: MiniAppSdkLike | null | undefined
): (options?: ReadyOptions) => Promise<void> {
  let called = false;

  return async (options?: ReadyOptions) => {
    if (called || !sdk?.actions?.ready) return;
    called = true;
    try {
      await sdk.actions.ready(options);
    } catch {
      // A failed handshake is a host problem, never the visitor's.
    }
  };
}

export type BackAdapter = {
  canGoBack: boolean;
  enableWebNavigation: () => Promise<void>;
  bind: (handler: (() => void) | null) => void;
};

/**
 * Host back affordances are opt-in. When the host does not advertise `back`
 * support the adapter does nothing, leaving browser history and the existing
 * mobile dock exactly as they are.
 */
export function createBackAdapter(
  sdk: MiniAppSdkLike | null | undefined,
  capabilities: readonly string[]
): BackAdapter {
  const canGoBack = capabilities.includes("back") && Boolean(sdk?.back);

  return {
    canGoBack,
    async enableWebNavigation() {
      if (!canGoBack) return;
      try {
        await sdk?.back?.enableWebNavigation?.();
      } catch {
        // Host navigation is optional.
      }
    },
    bind(handler) {
      if (!canGoBack || !sdk?.back) return;
      try {
        sdk.back.onback = handler;
      } catch {
        // Host navigation is optional.
      }
    },
  };
}

/**
 * Loads the SDK only in the browser. Server rendering and static metadata
 * generation never touch it.
 */
export async function loadMiniAppSdk(): Promise<MiniAppSdkLike | null> {
  if (typeof window === "undefined") return null;
  try {
    const mod = await import("@farcaster/miniapp-sdk");
    return (mod.default ?? null) as MiniAppSdkLike;
  } catch {
    return null;
  }
}

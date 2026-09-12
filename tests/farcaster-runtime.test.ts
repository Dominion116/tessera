import { describe, expect, it, vi } from "vitest";
import {
  STANDALONE_HOST_STATE,
  createBackAdapter,
  createReadyOnce,
  detectHostState,
  selectWalletTransport,
  supportsCapability,
} from "@/lib/farcaster/runtime";

describe("farcaster runtime detection", () => {
  it("treats an absent SDK as the standalone website", async () => {
    expect(await detectHostState(null)).toEqual(STANDALONE_HOST_STATE);
  });

  it("does not trust path or query hints as proof of host context", async () => {
    const sdk = {
      isInMiniApp: async () => false,
      getCapabilities: async () => [],
    };
    expect(await detectHostState(sdk)).toEqual(STANDALONE_HOST_STATE);
  });

  it("detects a host from capabilities and reads the safe area", async () => {
    const sdk = {
      isInMiniApp: async () => true,
      getCapabilities: async () => ["actions.ready", "back"],
      context: Promise.resolve({
        client: { safeAreaInsets: { top: 1, bottom: 2, left: 0, right: 0 } },
      }),
    };
    const state = await detectHostState(sdk);
    expect(state.isMiniApp).toBe(true);
    expect(state.safeAreaInsets).toEqual({ top: 1, bottom: 2, left: 0, right: 0 });
  });

  it("treats a capability list without isInMiniApp as a host signal", async () => {
    const sdk = {
      isInMiniApp: async () => false,
      getCapabilities: async () => ["actions.ready"],
    };
    expect((await detectHostState(sdk)).isMiniApp).toBe(true);
  });

  it("never throws when the SDK misbehaves", async () => {
    const sdk = {
      getCapabilities: async () => {
        throw new Error("host unavailable");
      },
    };
    expect(await detectHostState(sdk)).toEqual(STANDALONE_HOST_STATE);
  });

  it("selects the native transport only inside a confirmed host", () => {
    expect(selectWalletTransport(STANDALONE_HOST_STATE)).toBe("appkit");
    expect(
      selectWalletTransport({ isMiniApp: true, capabilities: [], safeAreaInsets: null })
    ).toBe("farcaster");
  });

  it("reports only the capabilities the host advertises", () => {
    const host = {
      isMiniApp: true,
      capabilities: ["actions.ready"],
      safeAreaInsets: null,
    };
    expect(supportsCapability(host, "actions.ready")).toBe(true);
    expect(supportsCapability(host, "actions.composeCast")).toBe(false);
  });
});

describe("farcaster ready lifecycle", () => {
  it("calls ready exactly once under repeated invocation", async () => {
    const ready = vi.fn(async () => {});
    const run = createReadyOnce({ actions: { ready } });
    await run();
    await run({ disableNativeGestures: true });
    expect(ready).toHaveBeenCalledTimes(1);
  });

  it("swallows ready failures so rendering is never blocked", async () => {
    const run = createReadyOnce({
      actions: {
        ready: async () => {
          throw new Error("handshake failed");
        },
      },
    });
    await expect(run()).resolves.toBeUndefined();
  });

  it("no-ops when the host exposes no ready action", async () => {
    const run = createReadyOnce({});
    await expect(run()).resolves.toBeUndefined();
  });
});

describe("farcaster back adapter", () => {
  it("stays inert when the host does not advertise back support", async () => {
    const enable = vi.fn(async () => {});
    const adapter = createBackAdapter({ back: { enableWebNavigation: enable } }, []);
    expect(adapter.canGoBack).toBe(false);
    await adapter.enableWebNavigation();
    adapter.bind(() => {});
    expect(enable).not.toHaveBeenCalled();
  });

  it("enables web navigation only when advertised", async () => {
    const enable = vi.fn(async () => {});
    const sdk = { back: { enableWebNavigation: enable, onback: null } };
    const adapter = createBackAdapter(sdk, ["back"]);
    expect(adapter.canGoBack).toBe(true);
    await adapter.enableWebNavigation();
    expect(enable).toHaveBeenCalledTimes(1);
  });

  it("binds the host back handler without replacing mobile controls", () => {
    const sdk = { back: { onback: null as null | (() => unknown) } };
    const adapter = createBackAdapter(sdk, ["back"]);
    const handler = () => {};
    adapter.bind(handler);
    expect(sdk.back.onback).toBe(handler);
  });
});

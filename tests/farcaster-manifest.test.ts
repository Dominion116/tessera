import { describe, expect, it } from "vitest";
import { buildFarcasterManifest } from "@/lib/farcaster/manifest";

const ORIGIN = "https://tesserapoap.vercel.app";

const manifest = buildFarcasterManifest({
  origin: ORIGIN,
  association: { header: "header", payload: "payload", signature: "signature" },
});

describe("farcaster manifest", () => {
  it("uses the exact canonical origin without a trailing slash", () => {
    expect(manifest.miniapp.homeUrl).toBe(ORIGIN);
    expect(manifest.miniapp.homeUrl.endsWith("/")).toBe(false);
  });

  it("builds every discovery URL on the canonical origin", () => {
    const urls = [
      manifest.miniapp.iconUrl,
      manifest.miniapp.imageUrl,
      manifest.miniapp.splashImageUrl,
      manifest.miniapp.heroImageUrl,
      manifest.miniapp.ogImageUrl,
    ];
    for (const url of urls) {
      expect(url.startsWith(`${ORIGIN}/`)).toBe(true);
      expect(url.slice(ORIGIN.length).includes("//")).toBe(false);
    }
  });

  it("carries the public account association payload", () => {
    expect(manifest.accountAssociation).toEqual({
      header: "header",
      payload: "payload",
      signature: "signature",
    });
  });

  it("declares Base Sepolia and no notification or auth capability", () => {
    expect(manifest.miniapp.requiredChains).toEqual(["eip155:84532"]);
    const capabilities = manifest.miniapp.requiredCapabilities.join(",");
    expect(capabilities).not.toMatch(/notification/i);
    expect(capabilities).not.toMatch(/signIn|quickAuth/i);
    expect(capabilities).toContain("wallet.getEthereumProvider");
  });

  it("exposes the canonical domain without a scheme", () => {
    expect(manifest.miniapp.canonicalDomain).toBe("tesserapoap.vercel.app");
  });

  it("keeps every required manifest field populated", () => {
    const { miniapp } = manifest;
    for (const value of [
      miniapp.version,
      miniapp.name,
      miniapp.iconUrl,
      miniapp.homeUrl,
      miniapp.subtitle,
      miniapp.description,
      miniapp.tagline,
      miniapp.primaryCategory,
    ]) {
      expect(value.length).toBeGreaterThan(0);
    }
    expect(miniapp.tags.length).toBeGreaterThan(0);
  });
});

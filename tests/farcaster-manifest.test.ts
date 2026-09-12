import { describe, expect, it } from "vitest";
import { buildFarcasterManifest } from "@/lib/farcaster/manifest";
import { MINIAPP_ASSET_PATHS } from "@/lib/farcaster/config";

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

  it("honours the documented field limits", () => {
    const { miniapp } = manifest;
    expect(miniapp.name.length).toBeLessThanOrEqual(32);
    expect(miniapp.subtitle.length).toBeLessThanOrEqual(30);
    expect(miniapp.description.length).toBeLessThanOrEqual(170);
    expect(miniapp.tagline.length).toBeLessThanOrEqual(30);
    expect(miniapp.ogTitle.length).toBeLessThanOrEqual(30);
    expect(miniapp.ogDescription.length).toBeLessThanOrEqual(100);
    expect(miniapp.tags.length).toBeLessThanOrEqual(5);
    for (const tag of miniapp.tags) {
      expect(tag.length).toBeLessThanOrEqual(20);
      expect(tag).toBe(tag.toLowerCase());
      expect(tag).not.toMatch(/\s/);
    }
  });

  it("points hero images at the 1.91:1 asset and the deprecated imageUrl at 3:2", () => {
    expect(manifest.miniapp.heroImageUrl).toContain(MINIAPP_ASSET_PATHS.hero);
    expect(manifest.miniapp.ogImageUrl).toContain(MINIAPP_ASSET_PATHS.hero);
    expect(manifest.miniapp.imageUrl).toContain(MINIAPP_ASSET_PATHS.share);
  });
});

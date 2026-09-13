import { expect, test } from "@playwright/test";

test.describe("farcaster mini app surface", () => {
  test("the manifest is cacheable JSON", async ({ request }) => {
    const response = await request.get("/.well-known/farcaster.json");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/json");

    const manifest = await response.json();
    expect(manifest.miniapp.name).toBe("Tessera");
    expect(manifest.miniapp.version).toBe("1");
    expect(manifest.miniapp.homeUrl).toBeTruthy();
  });

  test("manifest assets are served as PNG", async ({ request }) => {
    for (const path of [
      "/miniapp-assets/icon",
      "/miniapp-assets/splash",
      "/miniapp-assets/hero",
      "/miniapp-assets/share",
    ]) {
      const response = await request.get(path);
      expect(response.status(), path).toBe(200);
      expect(response.headers()["content-type"], path).toContain("image/png");
    }
  });
});

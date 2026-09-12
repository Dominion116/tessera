import { describe, expect, it } from "vitest";
import {
  buildEmbedMetadata,
  buildFrameEmbed,
  buildMiniAppEmbed,
  defaultEmbedConfig,
} from "@/lib/farcaster/embeds";
import { EMBED_IMAGE_SIZE, MINIAPP_ASSET_PATHS } from "@/lib/farcaster/config";

const ORIGIN = "https://tesserapoap.vercel.app";

const config = {
  origin: ORIGIN,
  imageUrl: `${ORIGIN}${MINIAPP_ASSET_PATHS.hero}`,
  title: "Open Tessera",
  launchPath: "/poaps/59",
};

describe("farcaster embeds", () => {
  it("keeps the 3:2 embed ratio at least 600x400", () => {
    expect(EMBED_IMAGE_SIZE.width / EMBED_IMAGE_SIZE.height).toBe(1.5);
    expect(EMBED_IMAGE_SIZE.width).toBeGreaterThanOrEqual(600);
    expect(EMBED_IMAGE_SIZE.height).toBeGreaterThanOrEqual(400);
  });

  it("points the launch image at a PNG asset", () => {
    const embed = buildMiniAppEmbed(config);
    expect(embed.imageUrl).toBe(`${ORIGIN}${MINIAPP_ASSET_PATHS.hero}`);
    expect(embed.imageUrl).not.toMatch(/\.svg$/);
    expect(embed.imageUrl.startsWith(`${ORIGIN}/`)).toBe(true);
  });

  it("emits a launch_miniapp action on the canonical origin", () => {
    const embed = buildMiniAppEmbed(config);
    expect(embed.button.action.type).toBe("launch_miniapp");
    expect(embed.button.action.url).toBe(`${ORIGIN}/poaps/59`);
    expect(embed.button.action.iconUrl).toBe(`${ORIGIN}${MINIAPP_ASSET_PATHS.icon}`);
    expect(embed.button.action.splashImageUrl).toBe(
      `${ORIGIN}${MINIAPP_ASSET_PATHS.splash}`
    );
  });

  it("defaults the launch URL to the canonical home", () => {
    const embed = buildMiniAppEmbed({
      origin: ORIGIN,
      imageUrl: config.imageUrl,
      title: "Open Tessera",
    });
    expect(embed.button.action.url).toBe(`${ORIGIN}/`);
  });

  it("mirrors the payload to fc:frame for older clients", () => {
    const embed = buildFrameEmbed(config);
    expect(embed.version).toBe("1");
    expect(embed.button.action.type).toBe("launch_frame");
    expect(embed.imageUrl).toBe(embed.imageUrl);
  });

  it("produces both metadata names from one config", () => {
    const meta = buildEmbedMetadata(config);
    expect(Object.keys(meta).sort()).toEqual(["fc:frame", "fc:miniapp"]);
    expect(JSON.parse(meta["fc:miniapp"]).button.action.type).toBe("launch_miniapp");
    expect(JSON.parse(meta["fc:frame"]).button.action.type).toBe("launch_frame");
    expect(meta["fc:miniapp"]).toBe(JSON.stringify(buildMiniAppEmbed(config)));
  });

  it("builds a PNG default image for pages without artwork", () => {
    const cfg = defaultEmbedConfig(ORIGIN, "Open Tessera", "/");
    expect(cfg.imageUrl).toBe(`${ORIGIN}${MINIAPP_ASSET_PATHS.hero}`);
    expect(cfg.launchPath).toBe("/");
  });
});

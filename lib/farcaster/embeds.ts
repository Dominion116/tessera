/**
 * Farcaster embed payloads. Each page emits both `fc:miniapp` (current
 * clients) and `fc:frame` (older clients) from the same inputs, always a PNG
 * launch image on the canonical origin, so a preview and its launch action
 * never disagree.
 */

import {
  FARCASTER_MINIAPP_VERSION,
  MINIAPP_ASSET_PATHS,
  MINIAPP_SPLASH_BACKGROUND,
  absoluteUrl,
} from "./config";

export type LaunchActionType = "launch_miniapp" | "launch_frame";

export type EmbedConfig = {
  origin: string;
  /** Absolute PNG URL, 3:2. */
  imageUrl: string;
  /** Button label, e.g. `Open Tessera`. */
  title: string;
  /** Path the launch action opens, defaulting to the canonical home. */
  launchPath?: string;
  name?: string;
};

export type FarcasterEmbed = {
  version: string;
  imageUrl: string;
  button: {
    title: string;
    action: {
      type: LaunchActionType;
      url: string;
      name: string;
      iconUrl: string;
      splashImageUrl: string;
      splashBackgroundColor: string;
    };
  };
};

function action(config: EmbedConfig, type: LaunchActionType) {
  const launchUrl = absoluteUrl(config.origin, config.launchPath ?? "/");
  const origin = config.origin;
  return {
    type,
    url: launchUrl,
    name: config.name ?? "Tessera",
    iconUrl: absoluteUrl(origin, MINIAPP_ASSET_PATHS.icon),
    splashImageUrl: absoluteUrl(origin, MINIAPP_ASSET_PATHS.splash),
    splashBackgroundColor: MINIAPP_SPLASH_BACKGROUND,
  };
}

export function buildMiniAppEmbed(config: EmbedConfig): FarcasterEmbed {
  return {
    version: FARCASTER_MINIAPP_VERSION,
    imageUrl: config.imageUrl,
    button: { title: config.title, action: action(config, "launch_miniapp") },
  };
}

export function buildFrameEmbed(config: EmbedConfig): FarcasterEmbed {
  return {
    version: FARCASTER_MINIAPP_VERSION,
    imageUrl: config.imageUrl,
    button: { title: config.title, action: action(config, "launch_frame") },
  };
}

/**
 * The exact `other` metadata Next renders as `<meta name="fc:miniapp">` and
 * `<meta name="fc:frame">`.
 */
export function buildEmbedMetadata(config: EmbedConfig): Record<string, string> {
  return {
    "fc:miniapp": JSON.stringify(buildMiniAppEmbed(config)),
    "fc:frame": JSON.stringify(buildFrameEmbed(config)),
  };
}

/** The default 3:2 share image for a page that has no event-specific artwork. */
export function defaultEmbedConfig(
  origin: string,
  title: string,
  launchPath: string
): EmbedConfig {
  return {
    origin,
    imageUrl: absoluteUrl(origin, MINIAPP_ASSET_PATHS.share),
    title,
    launchPath,
  };
}

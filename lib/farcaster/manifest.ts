/**
 * Builds the `/.well-known/farcaster.json` document. The account association
 * is domain-bound to the canonical origin and is supplied as public values
 * only; no signing material is ever read here.
 */

import {
  FARCASTER_MINIAPP_VERSION,
  FARCASTER_REQUIRED_CAPABILITIES,
  FARCASTER_REQUIRED_CHAINS,
  MINIAPP_ASSET_PATHS,
  MINIAPP_SPLASH_BACKGROUND,
  absoluteUrl,
} from "./config";

export type AccountAssociation = {
  header: string;
  payload: string;
  signature: string;
};

export type FarcasterManifestInput = {
  origin: string;
  association: AccountAssociation;
  name?: string;
  subtitle?: string;
  description?: string;
  tagline?: string;
  primaryCategory?: string;
  tags?: string[];
  buttonTitle?: string;
};

export type FarcasterManifest = {
  accountAssociation: AccountAssociation;
  miniapp: {
    version: string;
    name: string;
    iconUrl: string;
    homeUrl: string;
    imageUrl: string;
    buttonTitle: string;
    splashImageUrl: string;
    splashBackgroundColor: string;
    subtitle: string;
    description: string;
    tagline: string;
    primaryCategory: string;
    tags: string[];
    heroImageUrl: string;
    ogTitle: string;
    ogDescription: string;
    ogImageUrl: string;
    requiredChains: string[];
    requiredCapabilities: string[];
    canonicalDomain: string;
  };
};

export const MANIFEST_CONTENT_TYPE = "application/json; charset=utf-8";

export function buildFarcasterManifest(
  input: FarcasterManifestInput
): FarcasterManifest {
  const { origin } = input;
  const name = input.name ?? "Tessera";
  const description =
    input.description ??
    "Create onchain POAPs, hand them out at real events, and collect them. Artwork and metadata live entirely onchain.";
  const heroUrl = absoluteUrl(origin, MINIAPP_ASSET_PATHS.hero);

  return {
    accountAssociation: {
      header: input.association.header,
      payload: input.association.payload,
      signature: input.association.signature,
    },
    miniapp: {
      version: FARCASTER_MINIAPP_VERSION,
      name,
      iconUrl: absoluteUrl(origin, MINIAPP_ASSET_PATHS.icon),
      homeUrl: origin,
      imageUrl: heroUrl,
      buttonTitle: input.buttonTitle ?? "Open Tessera",
      splashImageUrl: absoluteUrl(origin, MINIAPP_ASSET_PATHS.splash),
      splashBackgroundColor: MINIAPP_SPLASH_BACKGROUND,
      subtitle: input.subtitle ?? "Onchain POAPs",
      description,
      tagline: input.tagline ?? "Proof you were there, stored onchain.",
      primaryCategory: input.primaryCategory ?? "social",
      tags: input.tags ?? ["poap", "onchain", "base", "events"],
      heroImageUrl: heroUrl,
      ogTitle: name,
      ogDescription: description,
      ogImageUrl: heroUrl,
      requiredChains: [...FARCASTER_REQUIRED_CHAINS],
      requiredCapabilities: [...FARCASTER_REQUIRED_CAPABILITIES],
      canonicalDomain: origin.replace(/^https?:\/\//, ""),
    },
  };
}

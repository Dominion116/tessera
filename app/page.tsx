import type { Metadata } from "next";
import LandingPage from "@/components/landing/landing-page";
import { resolveAppOrigin } from "@/lib/farcaster/config";
import { buildEmbedMetadata, defaultEmbedConfig } from "@/lib/farcaster/embeds";

export const revalidate = 300;

const origin = resolveAppOrigin(process.env.NEXT_PUBLIC_APP_URL);

export const metadata: Metadata = {
  openGraph: {
    title: "Tessera",
    description:
      "Create onchain POAPs, hand them out at real events, and collect them.",
    url: "/",
    images: [{ url: "/opengraph-image" }],
  },
  other: buildEmbedMetadata(defaultEmbedConfig(origin, "Open Tessera", "/")),
};

const Page = () => {
  return <LandingPage />;
};

export default Page;

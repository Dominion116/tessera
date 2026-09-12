import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /**
   * The Miniapp manifest must answer as JSON on every deployment. Pinning the
   * content type and cache here means no rewrite, redirect or platform header
   * can turn the well-known path into an HTML response.
   */
  async headers() {
    const shareImageCache =
      "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400";

    return [
      {
        source: "/.well-known/farcaster.json",
        headers: [
          { key: "Content-Type", value: "application/json; charset=utf-8" },
          {
            key: "Cache-Control",
            value:
              "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/opengraph-image",
        headers: [{ key: "Cache-Control", value: shareImageCache }],
      },
      {
        source: "/poaps/:id/opengraph-image",
        headers: [{ key: "Cache-Control", value: shareImageCache }],
      },
      {
        source: "/poaps/:id/claim/opengraph-image",
        headers: [{ key: "Cache-Control", value: shareImageCache }],
      },
    ];
  },
};

export default nextConfig;

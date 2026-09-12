import { resolveAppOrigin } from "@/lib/farcaster/config";
import { buildFarcasterManifest, MANIFEST_CONTENT_TYPE } from "@/lib/farcaster/manifest";

export const revalidate = 3600;

export function GET() {
  const origin = resolveAppOrigin(process.env.NEXT_PUBLIC_APP_URL);
  const body = buildFarcasterManifest({
    origin,
    association: {
      header: process.env.FARCASTER_ACCOUNT_ASSOCIATION_HEADER ?? "",
      payload: process.env.FARCASTER_ACCOUNT_ASSOCIATION_PAYLOAD ?? "",
      signature: process.env.FARCASTER_ACCOUNT_ASSOCIATION_SIGNATURE ?? "",
    },
  });

  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "Content-Type": MANIFEST_CONTENT_TYPE,
      "Cache-Control":
        "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

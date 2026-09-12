import { ImageResponse } from "next/og";
import { BrandOgImage, OG_SIZE } from "@/components/farcaster/brand-og";
import { readEvent } from "@/lib/poap-contract";

export const alt = "A Tessera POAP on Base Sepolia";
export const size = OG_SIZE;
export const contentType = "image/png";
export const revalidate = 60;

function parseEventId(id: string): bigint | null {
  if (!/^\d+$/.test(id) || id.length > 78) return null;
  try {
    return BigInt(id);
  } catch {
    return null;
  }
}

/** Never depends on a connected wallet; unknown IDs keep a stable fallback. */
export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const eventId = parseEventId(id);

  let heading = "Onchain POAP";
  let subheading = "Proof you were there, stored entirely onchain.";
  let footer = "Base Sepolia · ERC-1155";

  if (eventId !== null) {
    try {
      const event = await readEvent(eventId);
      if (event) {
        heading = event.name;
        subheading =
          event.description || "An onchain proof-of-attendance token.";
        footer = `POAP #${event.eventId.toString()} · ${event.collectors.toString()} collected`;
      }
    } catch {
      // Keep the fallback card when the chain read fails.
    }
  }

  return new ImageResponse(
    <BrandOgImage heading={heading} subheading={subheading} footer={footer} />,
    { ...OG_SIZE }
  );
}

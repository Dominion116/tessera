import { ImageResponse } from "next/og";
import { BrandOgImage, OG_SIZE } from "@/components/farcaster/brand-og";
import { readEvent } from "@/lib/poap-contract";

export const alt = "Claim a Tessera POAP on Base Sepolia";
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

/** Claim embeds never include the method, proof or signature. */
export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const eventId = parseEventId(id);

  let heading = "Claim a POAP";
  let subheading = "An invitation or recipient-specific claim on Base Sepolia.";
  let footer = "Base Sepolia, ERC-1155";

  if (eventId !== null) {
    try {
      const event = await readEvent(eventId);
      if (event) {
        heading = `Claim ${event.name}`;
        subheading = "One POAP per wallet, verified against the contract.";
        footer = `POAP #${event.eventId.toString()}`;
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

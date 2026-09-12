import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import PoapDetailPage from "@/components/explore/poap-detail-page";
import { readEvent } from "@/lib/poap-contract";
import { absoluteUrl, resolveAppOrigin } from "@/lib/farcaster/config";
import { buildEmbedMetadata } from "@/lib/farcaster/embeds";

type PoapRouteProps = {
  params: Promise<{ id: string }>;
};

const origin = resolveAppOrigin(process.env.NEXT_PUBLIC_APP_URL);

const loadEvent = cache(async (id: bigint) => readEvent(id));

/** Numeric route segment, so unknown shapes resolve as 404 without a chain call. */
function parseEventId(id: string): bigint | null {
  if (!/^\d+$/.test(id) || id.length > 78) return null;
  try {
    return BigInt(id);
  } catch {
    return null;
  }
}

export const revalidate = 60;

export async function generateMetadata({ params }: PoapRouteProps): Promise<Metadata> {
  const { id } = await params;
  const eventId = parseEventId(id);
  const event = eventId === null ? null : await loadEvent(eventId);
  const name = event?.name ?? "POAP";
  const description =
    event?.description ||
    "An onchain proof-of-attendance token on Base Sepolia.";

  return {
    title: name,
    description,
    openGraph: {
      title: name,
      description,
      url: `/poaps/${id}`,
      images: [{ url: `/poaps/${id}/opengraph-image` }],
    },
    other: buildEmbedMetadata({
      origin,
      imageUrl: absoluteUrl(origin, `/poaps/${id}/opengraph-image`),
      title: `Open ${name}`,
      launchPath: `/poaps/${id}`,
    }),
  };
}

export default async function PoapRoute({ params }: PoapRouteProps) {
  const { id } = await params;
  const eventId = parseEventId(id);

  if (eventId === null) {
    notFound();
  }

  const event = await loadEvent(eventId);

  if (!event) {
    notFound();
  }

  return <PoapDetailPage event={event} />;
}

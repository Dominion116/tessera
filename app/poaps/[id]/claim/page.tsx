import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import ClaimPage from "@/components/explore/claim-page";
import { readEvent } from "@/lib/poap-contract";
import { absoluteUrl, resolveAppOrigin } from "@/lib/farcaster/config";
import { buildEmbedMetadata } from "@/lib/farcaster/embeds";
import { parseMerkleProof, parseSignature } from "@/lib/transaction-args";

type ClaimRouteProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ method?: string; proof?: string; signature?: string }>;
};

const origin = resolveAppOrigin(process.env.NEXT_PUBLIC_APP_URL);

const loadEvent = cache(async (id: bigint) => readEvent(id));

function parseEventId(id: string): bigint | null {
  if (!/^\d+$/.test(id) || id.length > 78) return null;
  try {
    return BigInt(id);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: ClaimRouteProps): Promise<Metadata> {
  const { id } = await params;
  const eventId = parseEventId(id);
  const event = eventId === null ? null : await loadEvent(eventId);
  const title = event ? `Claim ${event.name}` : "Claim POAP";
  const description =
    "A claim destination for an onchain proof-of-attendance token.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/poaps/${id}/claim`,
      images: [{ url: `/poaps/${id}/claim/opengraph-image` }],
    },
    other: buildEmbedMetadata({
      origin,
      imageUrl: absoluteUrl(origin, `/poaps/${id}/claim/opengraph-image`),
      title,
      launchPath: `/poaps/${id}/claim`,
    }),
  };
}

export default async function ClaimRoute({ params, searchParams }: ClaimRouteProps) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const method = query.method ?? "signature";
  const eventId = parseEventId(id);

  if (eventId === null) {
    notFound();
  }

  const event = await loadEvent(eventId);

  if (!event) {
    notFound();
  }

  return <ClaimPage event={event} method={method} proof={parseMerkleProof(query.proof)} signature={parseSignature(query.signature) ?? undefined} />;
}

import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import ClaimPage from "@/components/explore/claim-page";
import { readEvent } from "@/lib/poap-contract";

type ClaimRouteProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ method?: string }>;
};

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

  return {
    title: event ? `Claim ${event.name}` : "Claim POAP",
    description: "A claim destination for an onchain proof-of-attendance token.",
  };
}

export default async function ClaimRoute({ params, searchParams }: ClaimRouteProps) {
  const [{ id }, { method = "signature" }] = await Promise.all([params, searchParams]);
  const eventId = parseEventId(id);

  if (eventId === null) {
    notFound();
  }

  const event = await loadEvent(eventId);

  if (!event) {
    notFound();
  }

  return <ClaimPage event={event} method={method} />;
}

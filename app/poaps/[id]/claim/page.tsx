import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ClaimPage from "@/components/explore/claim-page";
import { GALLERY_POAPS } from "@/lib/poap-data";

type ClaimRouteProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ method?: string }>;
};

function getPoap(id: string) {
  return GALLERY_POAPS.find((event) => event.eventId.toString() === id);
}

export async function generateMetadata({ params }: ClaimRouteProps): Promise<Metadata> {
  const { id } = await params;
  const event = getPoap(id);

  return {
    title: event ? `Claim ${event.name}` : "Claim POAP",
    description: "A claim destination for an onchain proof-of-attendance token.",
  };
}

export default async function ClaimRoute({ params, searchParams }: ClaimRouteProps) {
  const [{ id }, { method = "signature" }] = await Promise.all([params, searchParams]);
  const event = getPoap(id);

  if (!event) {
    notFound();
  }

  return <ClaimPage event={event} method={method} />;
}

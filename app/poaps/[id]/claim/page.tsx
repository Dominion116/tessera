import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ClaimPage from "@/components/explore/claim-page";
import { findPoapEvent } from "@/lib/poap-registry";

type ClaimRouteProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ method?: string }>;
};

export async function generateMetadata({ params }: ClaimRouteProps): Promise<Metadata> {
  const { id } = await params;
  const event = findPoapEvent(id);

  return {
    title: event ? `Claim ${event.name}` : "Claim POAP",
    description: "A claim destination for an onchain proof-of-attendance token.",
  };
}

export default async function ClaimRoute({ params, searchParams }: ClaimRouteProps) {
  const [{ id }, { method = "signature" }] = await Promise.all([params, searchParams]);
  const event = findPoapEvent(id);

  if (!event) {
    notFound();
  }

  return <ClaimPage event={event} method={method} />;
}

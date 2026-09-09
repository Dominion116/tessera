import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PoapDetailPage from "@/components/explore/poap-detail-page";
import { findPoapEvent } from "@/lib/poap-registry";

type PoapRouteProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PoapRouteProps): Promise<Metadata> {
  const { id } = await params;
  const event = findPoapEvent(id);

  return {
    title: event?.name ?? "POAP",
    description: event?.description || "An onchain proof-of-attendance token on Base Sepolia.",
  };
}

export default async function PoapRoute({ params }: PoapRouteProps) {
  const { id } = await params;
  const event = findPoapEvent(id);

  if (!event) {
    notFound();
  }

  return <PoapDetailPage event={event} />;
}

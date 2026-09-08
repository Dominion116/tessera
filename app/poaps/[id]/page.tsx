import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PoapDetailPage from "@/components/explore/poap-detail-page";
import { GALLERY_POAPS } from "@/lib/poap-data";

type PoapRouteProps = {
  params: Promise<{ id: string }>;
};

function getPoap(id: string) {
  return GALLERY_POAPS.find((event) => event.eventId.toString() === id);
}

export async function generateMetadata({ params }: PoapRouteProps): Promise<Metadata> {
  const { id } = await params;
  const event = getPoap(id);

  return {
    title: event?.name ?? "POAP",
    description: event?.description || "An onchain proof-of-attendance token on Base Sepolia.",
  };
}

export default async function PoapRoute({ params }: PoapRouteProps) {
  const { id } = await params;
  const event = getPoap(id);

  if (!event) {
    notFound();
  }

  return <PoapDetailPage event={event} />;
}

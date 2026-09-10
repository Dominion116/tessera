import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CreatedEventControls from "@/components/dashboard/created-event-controls";

export const metadata: Metadata = { title: "Manage POAP" };

export default async function CreatedEventRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();
  return <CreatedEventControls eventId={BigInt(id)} />;
}

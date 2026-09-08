import type { Metadata } from "next";
import { DocsPage } from "@/components/docs/docs-shell";
import { getDoc } from "@/components/docs/docs-data";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Technical documentation for Tessera and the OnchainPOAPs contract.",
};

export default function DocsIndexPage() {
  const page = getDoc("");

  if (!page) {
    return null;
  }

  return <DocsPage page={page} />;
}

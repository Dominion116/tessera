import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocsPage } from "@/components/docs/docs-shell";
import { getDoc } from "@/components/docs/docs-data";

type DocsRouteProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: DocsRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getDoc(slug.join("/"));

  return {
    title: page?.title ?? "Documentation",
    description: page?.description,
  };
}

export default async function DocsArticlePage({ params }: DocsRouteProps) {
  const { slug } = await params;
  const page = getDoc(slug.join("/"));

  if (!page) {
    notFound();
  }

  return <DocsPage page={page} />;
}

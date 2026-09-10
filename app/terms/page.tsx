import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms governing use of Tessera.",
};

const sections: LegalSection[] = [
  {
    title: "Using Tessera",
    paragraphs: [
      "Tessera provides tools for creating, distributing, viewing, and collecting onchain proof-of-attendance tokens. You are responsible for the information and artwork you submit, and for using the service in compliance with applicable law.",
      "You must not use Tessera to impersonate another person, distribute unlawful material, interfere with the service, or attempt to access another wallet or account.",
    ],
  },
  {
    title: "Wallets and blockchain transactions",
    paragraphs: [
      "Tessera does not custody wallets or private keys. You control the wallet you connect and are responsible for reviewing transaction details, protecting signing credentials, and paying any network fees.",
      "Blockchain transactions are generally irreversible. Tessera cannot reverse, edit, or recover a transaction after it has been submitted to the network. Contract behavior and network conditions can affect availability and results.",
    ],
  },
  {
    title: "Artwork and content",
    paragraphs: [
      "You retain responsibility for the content you upload or register. You represent that you have the rights needed to use that content and that it does not violate another person's rights or applicable law.",
      "Because registered artwork and metadata may be stored onchain, you should not submit confidential or personal information that you do not want to remain publicly available.",
    ],
  },
  {
    title: "Availability and changes",
    paragraphs: [
      "Tessera is provided on an as-available basis. We may change, suspend, or discontinue a feature when needed to maintain the service, address security issues, or reflect changes to the underlying network or contract.",
      "These terms may be updated as the service changes. The revised version will be posted on this page with a new update date.",
    ],
  },
  {
    title: "Contact",
    paragraphs: [
      "Questions about these terms can be raised through the project repository linked in the footer.",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      description="The rules for using Tessera to create and collect onchain event badges."
      updated="September 10, 2026"
      sections={sections}
    />
  );
}

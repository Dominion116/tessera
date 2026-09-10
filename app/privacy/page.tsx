import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Tessera handles information when you use the service.",
};

const sections: LegalSection[] = [
  {
    title: "Information you provide",
    paragraphs: [
      "Tessera may process the wallet address you connect, event names and descriptions you enter, uploaded artwork, and information included in POAP metadata. Public blockchain data is visible to anyone and may remain available indefinitely.",
      "Do not submit sensitive personal information in event names, descriptions, artwork, allowlists, or claim links. Wallet addresses can be associated with activity through public blockchain records.",
    ],
  },
  {
    title: "Information collected automatically",
    paragraphs: [
      "The service may receive ordinary technical information from your browser and hosting provider, such as an IP address, device and browser details, request timestamps, and error information. This information supports security, reliability, and troubleshooting.",
      "Tessera does not need an account password or private key. Private keys remain with your wallet provider and are never sent to Tessera.",
    ],
  },
  {
    title: "How information is used",
    paragraphs: [
      "Information is used to display the application, prepare wallet interactions, show event and collection data, respond to support requests, protect the service, and improve reliability.",
      "Tessera does not sell personal information. Information may be shared with infrastructure providers only when needed to host, secure, or operate the service, or when required by law.",
    ],
  },
  {
    title: "Onchain information",
    paragraphs: [
      "When you submit a blockchain transaction, the resulting address, transaction data, event data, and token ownership may be publicly visible and permanently recorded by the network. Tessera cannot delete or alter those records.",
    ],
  },
  {
    title: "Contact",
    paragraphs: [
      "Privacy questions can be raised through the project repository linked in the footer.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="How Tessera handles wallet, event, artwork, and technical information."
      updated="September 10, 2026"
      sections={sections}
    />
  );
}

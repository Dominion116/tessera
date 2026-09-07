"use client";

import { Database, Fingerprint, Layers } from "lucide-react";
import Feature from "@/components/shadcn-space/blocks/feature-02/feature";

const featureData = [
  {
    icon: Database,
    title: "The artwork lives in the contract, not on a server",
    content:
      "The SVG is written into contract storage at registration and read back out of the chain, so the picture and the details have the same lifetime as the token. No gateway to keep paying for, no broken image later.",
  },
  {
    icon: Layers,
    title: "Event number is token number",
    content:
      "Register the fourteenth event and you get token 14. One number identifies the event, the badge, and the page you share, which is also the number you put on a poster.",
  },
  {
    icon: Fingerprint,
    title: "One badge per wallet, whichever route",
    content:
      "An open link, an invitation list and codes at the door all share a single record of who has claimed, so a wallet that minted through one cannot come back through another.",
  },
];

const Feature02 = () => {
  return <Feature featureData={featureData} />;
};

export default Feature02;

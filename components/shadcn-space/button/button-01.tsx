"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ArrowButton from "@/components/landing/arrow-button";
import ConnectPrompt from "@/components/wallet/connect-prompt";
import { useWallet } from "@/components/wallet/wallet-provider";

/**
 * Open App. Connected, it is the arrow pill linking to /app. Disconnected,
 * the same pill opens the connect prompt, and connecting there lands on
 * /app. Both navbar instances, desktop and dropdown, render this component.
 */
const OpenAppButton = () => {
  const { address } = useWallet();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  if (address) {
    return <ArrowButton href="/app">Open App</ArrowButton>;
  }

  return (
    <>
      <ArrowButton onClick={() => setOpen(true)}>Open App</ArrowButton>
      <ConnectPrompt
        variant="modal"
        open={open}
        onOpenChange={setOpen}
        onConnected={() => {
          setOpen(false);
          router.push("/app");
        }}
      />
    </>
  );
};

export default OpenAppButton;

"use client";

import { useState } from "react";
import ArrowButton from "@/components/landing/arrow-button";
import ConnectPrompt from "@/components/wallet/connect-prompt";
import { useConnectRedirect } from "@/components/wallet/use-connect-redirect";
import { useWallet } from "@/components/wallet/wallet-provider";

/**
 * Open App. Connected, it is the arrow pill linking to /app. Disconnected,
 * the same pill opens the connect prompt, whose `onConnect` opens the
 * wallet picker and lands the user on the landing page once a wallet
 * actually arrives — never before, which is what used to push a still
 * disconnected visitor onto /app where its own prompt waited. Both navbar
 * instances, desktop and dropdown, render this component.
 */
const OpenAppButton = () => {
  const { address } = useWallet();
  const { connectAndRedirect } = useConnectRedirect();
  const [open, setOpen] = useState(false);

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
        onConnect={connectAndRedirect}
      />
    </>
  );
};

export default OpenAppButton;

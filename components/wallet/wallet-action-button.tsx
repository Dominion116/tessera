"use client";

import { useState } from "react";
import ArrowButton from "@/components/landing/arrow-button";
import ConnectPrompt from "@/components/wallet/connect-prompt";
import { useConnectRedirect } from "@/components/wallet/use-connect-redirect";
import { useWallet } from "@/components/wallet/wallet-provider";

type WalletActionButtonProps = {
  href: string;
  label: string;
};

/** An action that requires a wallet opens the modal only after a user click. */
const WalletActionButton = ({ href, label }: WalletActionButtonProps) => {
  const { address, isConnecting, walletError } = useWallet();
  const { connectAndRedirect } = useConnectRedirect(href);
  const [open, setOpen] = useState(false);

  if (address) {
    return <ArrowButton href={href}>{label}</ArrowButton>;
  }

  return (
    <>
      <ArrowButton onClick={() => setOpen(true)}>{label}</ArrowButton>
      <ConnectPrompt
        variant="modal"
        open={open}
        onOpenChange={setOpen}
        onConnect={connectAndRedirect}
        isConnecting={isConnecting}
        walletError={walletError}
      />
    </>
  );
};

export default WalletActionButton;

"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFarcaster } from "@/components/farcaster/farcaster-provider";

type ShareCastButtonProps = {
  text: string;
  path: string;
  label?: string;
  className?: string;
};

/**
 * An explicit share action. It opens the Farcaster composer only after a
 * click, and falls back to copying the canonical link when the composer is
 * unavailable.
 */
const ShareCastButton = ({
  text,
  path,
  label = "Share to Farcaster",
  className,
}: ShareCastButtonProps) => {
  const { isMiniApp, canComposeCast, composeCast } = useFarcaster();
  const [copied, setCopied] = useState(false);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  const share = async () => {
    setFailedUrl(null);
    const target = `${window.location.origin}${path}`;

    if (isMiniApp && canComposeCast) {
      const opened = await composeCast({ text, embeds: [target] });
      if (opened) return;
    }

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(target);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
        return;
      }
    } catch {
      // Fall through to the visible error.
    }

    setFailedUrl(target);
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={() => void share()}
        className={className}
      >
        {copied ? <Check aria-hidden="true" /> : <Share2 aria-hidden="true" />}
        {copied ? "Link copied" : label}
      </Button>
      {failedUrl ? (
        <p role="alert" className="text-xs text-red-600 dark:text-red-300">
          Sharing is unavailable here. Copy the link instead:{" "}
          <span className="break-all">{failedUrl}</span>
        </p>
      ) : null}
    </div>
  );
};

export default ShareCastButton;

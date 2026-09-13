"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

/** Copies a claim link to the clipboard and confirms it in place. */
const CopyButton = ({
  value,
  label = "Copy link",
}: {
  value: string;
  label?: string;
}) => {
  const [done, setDone] = useState(false);
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setDone(true);
          window.setTimeout(() => setDone(false), 1500);
        } catch {
          setDone(false);
        }
      }}
    >
      {done ? "Copied" : label}
    </Button>
  );
};

export default CopyButton;

"use client";

import { useEffect, useState } from "react";
import { qrDataUrl } from "@/lib/qr";

/**
 * Renders a claim link as a QR code. The image is a data URL generated in
 * the browser, so the next/image optimizer cannot help and the plain img
 * element is correct here.
 */
const QrCode = ({
  value,
  size = 160,
  label,
}: {
  value: string;
  size?: number;
  label?: string;
}) => {
  const key = `${value}::${size}`;
  const [result, setResult] = useState<{ key: string; src: string | null } | null>(
    null
  );

  useEffect(() => {
    let active = true;
    qrDataUrl(value, size * 2)
      .then((url) => {
        if (active) setResult({ key, src: url });
      })
      .catch(() => {
        if (active) setResult({ key, src: null });
      });
    return () => {
      active = false;
    };
  }, [value, size, key]);

  if (!result || result.key !== key) {
    return (
      <span
        role="status"
        aria-label="Generating QR code"
        className="block animate-pulse rounded-md bg-muted"
        style={{ width: size, height: size }}
      />
    );
  }

  if (!result.src) {
    return (
      <span role="status" className="text-xs leading-5 text-fg-tertiary">
        QR unavailable. Use the link instead.
      </span>
    );
  }

  return (
    // A generated data URL, which the image optimizer cannot process.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={result.src}
      width={size}
      height={size}
      alt={label ?? "Claim QR code"}
      className="rounded-md border border-border/70 bg-white p-1"
    />
  );
};

export default QrCode;

/**
 * QR rendering for claim links. The encoder is imported on demand so the
 * dependency stays out of the initial bundle and only loads when a creator
 * actually asks to show or print a code. Runs in the browser only, which is
 * where every caller lives.
 */

export async function qrDataUrl(value: string, size = 320): Promise<string> {
  const QRCode = (await import("qrcode")).default;
  return QRCode.toDataURL(value, {
    width: size,
    margin: 1,
    errorCorrectionLevel: "M",
    color: { dark: "#0b0f14ff", light: "#ffffffff" },
  });
}

import { EMBED_IMAGE_SIZE } from "@/lib/farcaster/config";

export const OG_SIZE = {
  width: EMBED_IMAGE_SIZE.width,
  height: EMBED_IMAGE_SIZE.height,
};

const TEAL = "#2dd4bf";

/**
 * Shared 3:2 PNG layout for share cards. Rendered through `ImageResponse`, so
 * it stays a real PNG for Farcaster clients and never an SVG.
 */
export function BrandOgImage({
  heading,
  subheading,
  footer,
}: {
  heading: string;
  subheading: string;
  footer: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#0a0a0a",
        padding: 64,
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            display: "flex",
            width: 40,
            height: 40,
            borderRadius: 8,
            backgroundColor: TEAL,
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: "#fafafa",
          }}
        >
          TESSERA
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div
          style={{
            display: "flex",
            maxWidth: 1000,
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "#fafafa",
          }}
        >
          {heading}
        </div>
        <div
          style={{
            display: "flex",
            maxWidth: 900,
            fontSize: 30,
            lineHeight: 1.4,
            color: "#a3a3a3",
          }}
        >
          {subheading}
        </div>
      </div>

      <div style={{ display: "flex", fontSize: 24, color: TEAL }}>{footer}</div>
    </div>
  );
}

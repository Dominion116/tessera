import { ImageResponse } from "next/og";

export const alt = "Tessera, proof you were there, stored entirely onchain";
export const size = { width: 1200, height: 800 };
export const contentType = "image/png";

const TEAL = "#2dd4bf";

const tile = (opacity: number) => ({
  width: 44,
  height: 44,
  borderRadius: 6,
  backgroundColor: TEAL,
  opacity,
});

/**
 * Share image at 3:2, which satisfies both standard link previews and Farcaster
 * embeds. Drawn from the page's own tokens: near-black ground, teal mosaic, one
 * bold line.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0a0a0a",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", width: 96, flexWrap: "wrap", gap: 8 }}>
          <div style={tile(1)} />
          <div style={tile(0.4)} />
          <div style={tile(0.4)} />
          <div style={tile(1)} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              fontSize: 96,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              color: "#fafafa",
            }}
          >
            TESSERA®POAP
          </div>
          <div
            style={{
              display: "flex",
              maxWidth: 900,
              fontSize: 34,
              lineHeight: 1.4,
              color: "#a3a3a3",
            }}
          >
            Proof you were there, stored entirely onchain. Create a POAP, hand it
            out at your event, keep it forever.
          </div>
        </div>

        <div style={{ display: "flex", gap: 16, fontSize: 24, color: TEAL }}>
          <span>Base</span>
          <span style={{ color: "#525252" }}>/</span>
          <span>ERC-1155</span>
          <span style={{ color: "#525252" }}>/</span>
          <span>Onchain SVG</span>
        </div>
      </div>
    ),
    size
  );
}

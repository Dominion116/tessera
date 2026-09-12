import { ImageResponse } from "next/og";
import { EMBED_IMAGE_SIZE, MINIAPP_SPLASH_BACKGROUND } from "@/lib/farcaster/config";

export const revalidate = 86400;

const TEAL = "#2dd4bf";
const CACHE = "public, max-age=86400, s-maxage=86400, immutable";

const tile = (opacity: number, size: number) => ({
  display: "flex",
  width: size,
  height: size,
  borderRadius: Math.round(size / 7),
  backgroundColor: TEAL,
  opacity,
});

function Mark({ scale = 1 }: { scale?: number }) {
  const size = Math.round(44 * scale);
  const gap = Math.round(8 * scale);
  return (
    <div
      style={{
        display: "flex",
        width: size * 2 + gap,
        flexWrap: "wrap",
        gap,
      }}
    >
      <div style={tile(1, size)} />
      <div style={tile(0.4, size)} />
      <div style={tile(0.4, size)} />
      <div style={tile(1, size)} />
    </div>
  );
}

function Icon() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: MINIAPP_SPLASH_BACKGROUND,
      }}
    >
      <Mark scale={4.2} />
    </div>
  );
}

function Wide() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: MINIAPP_SPLASH_BACKGROUND,
        padding: 72,
        fontFamily: "sans-serif",
      }}
    >
      <Mark />
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
  );
}

/** PNG brand assets for the manifest and embed payloads. Never SVG. */
export async function GET(
  _request: Request,
  context: { params: Promise<{ kind: string }> }
) {
  const { kind } = await context.params;

  if (kind === "icon") {
    return new ImageResponse(<Icon />, {
      width: 512,
      height: 512,
      headers: { "Cache-Control": CACHE },
    });
  }

  if (kind === "splash" || kind === "hero") {
    return new ImageResponse(<Wide />, {
      ...EMBED_IMAGE_SIZE,
      headers: { "Cache-Control": CACHE },
    });
  }

  return new Response("Not found", { status: 404 });
}

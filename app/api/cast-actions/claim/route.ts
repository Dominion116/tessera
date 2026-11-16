import { NextRequest, NextResponse } from "next/server";
import { resolveAppOrigin } from "@/lib/farcaster/config";

const origin = resolveAppOrigin(process.env.NEXT_PUBLIC_APP_URL);

/**
 * Farcaster Cast Action manifest metadata (GET).
 * Queried by Warpcast when registering or inspecting the action.
 */
export async function GET() {
  return NextResponse.json({
    name: "Claim Tessera POAP",
    icon: "award",
    description: "Claim your onchain Tessera Club badge directly from this cast",
    aboutUrl: origin,
    action: {
      type: "post",
    },
  });
}

/**
 * Invocation handler for the Cast Action (POST).
 * Called when a user taps the action button on a cast in Warpcast.
 */
export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const eventId = url.searchParams.get("eventId") || "latest";

    const body = (await req.json().catch(() => ({}))) as {
      untrustedData?: {
        fid?: number;
        castId?: { hash: string; fid: number };
      };
    };

    const targetUrl =
      eventId === "latest"
        ? `${origin}/app/explore`
        : `${origin}/poaps/${eventId}/claim`;

    // Opens the Mini App claim flow directly inside Warpcast
    return NextResponse.json({
      type: "form",
      title: "Claim Tessera Badge",
      url: targetUrl,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Error executing cast action";
    return NextResponse.json({ type: "message", message }, { status: 500 });
  }
}

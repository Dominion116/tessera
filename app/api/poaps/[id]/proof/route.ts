import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import os from "os";
import { isAddress, getAddress } from "viem";
import type { Address, AllowlistEntry } from "@/lib/allowlist";

function getFilePath(eventId: string): string {
  return path.join(os.tmpdir(), `tessera-allowlist-${eventId}.json`);
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const url = new URL(req.url);
    const rawAddress = url.searchParams.get("address");

    if (!rawAddress || !isAddress(rawAddress)) {
      return NextResponse.json(
        { eligible: false, error: "Valid Ethereum address is required" },
        { status: 400 }
      );
    }

    const targetAddress = getAddress(rawAddress).toLowerCase();

    let store: { root: Address; entries: AllowlistEntry[] } | null = null;

    try {
      const fileContent = await fs.readFile(getFilePath(id), "utf-8");
      store = JSON.parse(fileContent);
    } catch {
      // File not found on this instance
    }

    if (!store || !Array.isArray(store.entries)) {
      return NextResponse.json(
        { eligible: false, message: "No active allowlist found for this event" },
        { status: 404 }
      );
    }

    const matched = store.entries.find(
      (entry) => entry.address.toLowerCase() === targetAddress
    );

    if (!matched) {
      return NextResponse.json({
        eligible: false,
        message: "Address was not included in the allowlist snapshot for this event",
      });
    }

    return NextResponse.json({
      eligible: true,
      address: matched.address,
      proof: matched.proof,
      username: matched.username,
      fid: matched.fid,
      source: matched.source,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error verifying allowlist eligibility";
    return NextResponse.json({ eligible: false, error: message }, { status: 500 });
  }
}

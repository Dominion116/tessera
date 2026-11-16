import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import os from "os";
import type { Address, AllowlistEntry } from "@/lib/allowlist";

const memoryStore = new Map<string, { root: Address; entries: AllowlistEntry[]; updatedAt: number }>();

function getFilePath(eventId: string): string {
  return path.join(os.tmpdir(), `tessera-allowlist-${eventId}.json`);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = (await req.json()) as {
      root: Address;
      entries: AllowlistEntry[];
    };

    if (!body || !body.root || !Array.isArray(body.entries)) {
      return NextResponse.json(
        { success: false, error: "Invalid allowlist payload" },
        { status: 400 }
      );
    }

    const payload = {
      root: body.root,
      entries: body.entries,
      updatedAt: Date.now(),
    };

    memoryStore.set(id, payload);

    try {
      await fs.writeFile(getFilePath(id), JSON.stringify(payload), "utf-8");
    } catch {
      // In-memory fallback if filesystem write is restricted
    }

    return NextResponse.json({
      success: true,
      eventId: id,
      root: body.root,
      recipientsCount: body.entries.length,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to store allowlist";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    let data = memoryStore.get(id);
    if (!data) {
      try {
        const fileContent = await fs.readFile(getFilePath(id), "utf-8");
        data = JSON.parse(fileContent);
        if (data) memoryStore.set(id, data);
      } catch {
        // Not found
      }
    }

    if (!data) {
      return NextResponse.json(
        { success: false, error: "Allowlist not found for this event" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      root: data.root,
      recipientsCount: data.entries.length,
      updatedAt: data.updatedAt,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to read allowlist";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

import { describe, expect, it } from "vitest";
import { getAddress } from "viem";
import {
  parseFarcasterTokens,
  sanitizeChannelId,
} from "@/lib/farcaster-resolver";
import { buildAllowlist, allowlistCsv, type AllowlistRecipientInput } from "@/lib/allowlist";

const A = getAddress("0x1111111111111111111111111111111111111111");
const B = getAddress("0x2222222222222222222222222222222222222222");

describe("Farcaster token parsing", () => {
  it("extracts usernames, fids, and direct ethereum addresses", () => {
    const input = `${A}\n@dominion, dwr.eth fid:3 12345 invalid$$token`;
    const parsed = parseFarcasterTokens(input);

    expect(parsed.addresses).toEqual([A]);
    expect(parsed.usernames).toEqual(["dominion", "dwr.eth"]);
    expect(parsed.fids).toEqual([3, 12345]);
    expect(parsed.invalid).toEqual(["invalid$$token"]);
  });

  it("handles empty or whitespace strings", () => {
    const parsed = parseFarcasterTokens("   \n\t  ");
    expect(parsed.addresses).toEqual([]);
    expect(parsed.usernames).toEqual([]);
    expect(parsed.fids).toEqual([]);
    expect(parsed.invalid).toEqual([]);
  });

  it("sanitizes channel identifiers", () => {
    expect(sanitizeChannelId("/tessera")).toBe("tessera");
    expect(sanitizeChannelId("///npc")).toBe("npc");
    expect(sanitizeChannelId("channel/designjam")).toBe("designjam");
    expect(sanitizeChannelId("BASE")).toBe("base");
  });
});

describe("Allowlist building with Farcaster metadata", () => {
  it("builds valid Merkle tree while preserving user metadata", () => {
    const inputs: AllowlistRecipientInput[] = [
      {
        address: A,
        username: "dominion",
        fid: 1393938,
        source: "verified",
      },
      {
        address: B,
        username: "dwr",
        fid: 3,
        source: "custody",
      },
    ];

    const { root, entries } = buildAllowlist(inputs);

    expect(root).toBeDefined();
    expect(entries.length).toBe(2);
    expect(entries[0]!.username).toBe("dominion");
    expect(entries[0]!.fid).toBe(1393938);
    expect(entries[0]!.source).toBe("verified");
    expect(entries[1]!.username).toBe("dwr");
  });

  it("formats CSV with metadata when present", () => {
    const inputs: AllowlistRecipientInput[] = [
      {
        address: A,
        username: "dominion",
        fid: 1393938,
      },
    ];

    const { entries } = buildAllowlist(inputs);
    const csv = allowlistCsv("https://tessera.app", 1n, entries);
    const lines = csv.split("\n");

    expect(lines[0]).toBe("identifier,fid,address,claim_link");
    expect(lines[1]).toContain("@dominion,1393938,");
    expect(lines[1]).toContain(A);
  });
});

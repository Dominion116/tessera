import { describe, expect, it } from "vitest";
import {
  allowlistControlArgs,
  allowlistMintArgs,
  creatorMintArgs,
  mintArgs,
  parseMerkleProof,
  parseRecipientAddresses,
  parseSignature,
  publicControlArgs,
  registerEventArgs,
  signatureMintArgs,
} from "@/lib/transaction-args";

describe("transaction argument builders", () => {
  it("builds mint arguments without changing bigint IDs", () => {
    expect(mintArgs(7n)).toEqual([7n]);
    expect(signatureMintArgs(7n, "0x1234")).toEqual([7n, "0x1234"]);
  });

  it("preserves proofs and creator recipients", () => {
    const proof = [`0x${"11".repeat(32)}`] as `0x${string}`[];
    const recipients = [`0x${"22".repeat(20)}`] as `0x${string}`[];
    expect(allowlistMintArgs(3n, proof)).toEqual([3n, proof]);
    expect(creatorMintArgs(3n, recipients)).toEqual([3n, recipients]);
  });

  it("builds creator control arguments and rejects malformed roots", () => {
    const root = `0x${"ab".repeat(32)}`;
    expect(publicControlArgs(4n, true)).toEqual([4n, true]);
    expect(allowlistControlArgs(4n, root)).toEqual([4n, root]);
    expect(allowlistControlArgs(4n, "0xnope")).toBeNull();
  });

  it("builds registration arguments in ABI order", () => {
    const root = `0x${"00".repeat(32)}` as `0x${string}`;
    expect(registerEventArgs({ name: "Night", description: "Builders", eventDate: 7n, location: "Lisbon", allowlistRoot: root, artwork: "<svg />", externalUrl: "", isSoulbound: true, isPublic: true })).toEqual([
      "Night", "Builders", 7n, "Lisbon", root, "<svg />", "", 3,
    ]);
  });

  it("validates and limits creator-mint recipients", () => {
    const first = `0x${"11".repeat(20)}`;
    const second = `0x${"22".repeat(20)}`;
    expect(parseRecipientAddresses(`${first}\n${second}`, 2)).toEqual([first, second]);
    expect(parseRecipientAddresses(`${first},${second}`, 1)).toBeNull();
    expect(parseRecipientAddresses(`${first},${first}`, 2)).toBeNull();
    expect(parseRecipientAddresses("0xinvalid", 2)).toBeNull();
  });

  it("accepts only complete claim-link payloads", () => {
    const node = `0x${"33".repeat(32)}`;
    expect(parseMerkleProof(`${node},${node}`)).toEqual([node, node]);
    expect(parseMerkleProof("0x1234")).toEqual([]);
    expect(parseSignature("0x1234")).toBe("0x1234");
    expect(parseSignature("0x123")).toBeNull();
  });
});

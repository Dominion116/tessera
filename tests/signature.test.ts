import { describe, expect, it } from "vitest";
import { privateKeyToAccount } from "viem/accounts";
import {
  recoverSignatureSigner,
  signatureClaimLink,
  signatureDigest,
} from "@/lib/signature";

const CREATOR = privateKeyToAccount(
  "0x0123456789012345678901234567890123456789012345678901234567890123"
);
const RECIPIENT = "0x1111111111111111111111111111111111111111" as const;

describe("recipient-bound signature digest", () => {
  it("matches the contract's packed encoding for a known event", () => {
    expect(signatureDigest(1n, 84532, RECIPIENT)).toBe(
      "0xd66da6508ce6e141c196c4fcb0fdec4e137e17c7d9137b2e95238253d169b783"
    );
  });

  it("round-trips through the creator signature and recovers the creator", async () => {
    const digest = signatureDigest(1n, 84532, RECIPIENT);
    const signature = await CREATOR.signMessage({ message: { raw: digest } });
    await expect(recoverSignatureSigner(digest, signature)).resolves.toBe(
      CREATOR.address
    );
  });

  it("fails to recover to the creator when the recipient changes", async () => {
    const digest = signatureDigest(1n, 84532, RECIPIENT);
    const signature = await CREATOR.signMessage({ message: { raw: digest } });
    const otherDigest = signatureDigest(
      1n,
      84532,
      "0x2222222222222222222222222222222222222222"
    );
    await expect(
      recoverSignatureSigner(otherDigest, signature)
    ).resolves.not.toBe(CREATOR.address);
  });

  it("changes with the event ID and the chain ID", () => {
    const base = signatureDigest(1n, 84532, RECIPIENT);
    expect(signatureDigest(2n, 84532, RECIPIENT)).not.toBe(base);
    expect(signatureDigest(1n, 8453, RECIPIENT)).not.toBe(base);
  });
});

describe("signature claim link", () => {
  it("carries the method and signature and trims the origin", () => {
    expect(signatureClaimLink("https://tessera.example/", 7n, "0xabc")).toBe(
      "https://tessera.example/poaps/7/claim?method=signature&signature=0xabc"
    );
  });
});


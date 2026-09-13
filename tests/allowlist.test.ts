import { describe, expect, it } from "vitest";
import { concat, encodePacked, getAddress, keccak256 } from "viem";
import {
  allowlistCsv,
  allowlistLeaf,
  buildAllowlist,
  parseRecipientList,
  verifyAllowlistProof,
  type Address,
} from "@/lib/allowlist";

const A = getAddress("0x1111111111111111111111111111111111111111");
const B = getAddress("0x2222222222222222222222222222222222222222");
const C = getAddress("0x3333333333333333333333333333333333333333");

/**
 * A local reimplementation of OpenZeppelin `MerkleProof.verify`: sorted
 * sibling pairs, keccak of the concatenation. This is what the contract
 * runs. If the library tree ever stopped matching it, these tests fail,
 * because a rejected proof onchain costs the user gas.
 */
const hashPair = (a: Address, b: Address): Address =>
  keccak256(concat(a.toLowerCase() < b.toLowerCase() ? [a, b] : [b, a]));

const contractVerify = (
  proof: readonly Address[],
  root: Address,
  leaf: Address
): boolean => {
  let computed = leaf.toLowerCase() as Address;
  for (const node of proof) {
    computed = hashPair(computed, node).toLowerCase() as Address;
  }
  return computed === root.toLowerCase();
};

describe("allowlist leaf and tree", () => {
  it("hashes the packed address exactly as the contract does", () => {
    expect(allowlistLeaf(A)).toBe(keccak256(encodePacked(["address"], [A])));
  });

  it("produces a root the contract's sorted-pair verifier accepts", () => {
    const { root, entries } = buildAllowlist([A, B, C]);

    // Pinned against a known build so an encoding change cannot pass silently.
    expect(root).toBe(
      "0xa3dc0caeeda43f1ad4cba774bb2ec839ee022f55ace0aadd7fb3a930914d2210"
    );

    for (const entry of entries) {
      expect(
        contractVerify(entry.proof, root, allowlistLeaf(entry.address))
      ).toBe(true);
      expect(verifyAllowlistProof(root, entry.address, entry.proof)).toBe(true);
    }
  });

  it("rejects a proof presented by a different address", () => {
    const { root, entries } = buildAllowlist([A, B, C]);
    const proofForB = entries[1]!.proof;
    expect(verifyAllowlistProof(root, A, proofForB)).toBe(false);
    expect(contractVerify(proofForB, root, allowlistLeaf(A))).toBe(false);
  });

  it("refuses an empty list", () => {
    expect(() => buildAllowlist([])).toThrow();
  });
});

describe("recipient list parsing", () => {
  it("accepts newlines, commas and mixed spacing", () => {
    const parsed = parseRecipientList(`${A}\n${B}, ${C}`);
    expect(parsed.addresses).toEqual([A, B, C]);
    expect(parsed.invalid).toEqual([]);
    expect(parsed.duplicates).toBe(0);
  });

  it("de-duplicates case-insensitively and reports bad tokens", () => {
    const lower = A.toLowerCase() as Address;
    const parsed = parseRecipientList(`${A} ${lower} not-an-address`);
    expect(parsed.addresses).toEqual([A]);
    expect(parsed.duplicates).toBe(1);
    expect(parsed.invalid).toEqual(["not-an-address"]);
  });
});

describe("distribution export", () => {
  it("writes a claim link per recipient", () => {
    const { entries } = buildAllowlist([A, B]);
    const csv = allowlistCsv("https://tessera.example/", 4n, entries);
    const lines = csv.split("\n");
    expect(lines[0]).toBe("address,claim_link");
    expect(lines[1]).toContain(`${A},https://tessera.example/poaps/4/claim?method=allowlist&proof=0x`);
    expect(lines[2]).toContain(`${B},`);
    expect(lines[2]).toContain("proof=0x");
  });
});

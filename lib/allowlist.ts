/**
 * Allowlist construction for the Onchain POAPs contract.
 *
 * The contract builds each leaf as `keccak256(abi.encodePacked(msg.sender))`
 * and verifies proofs with OpenZeppelin `MerkleProof.verify`, which hashes
 * sibling pairs in sorted order. This is not the `StandardMerkleTree`
 * double-hash format. `SimpleMerkleTree` from `@openzeppelin/merkle-tree`
 * abi-encodes the bytes32 leaf without hashing it again and defaults to the
 * sorted-pair node hash, so feeding it pre-hashed address leaves reproduces
 * the contract's scheme exactly. `tests/allowlist.test.ts` pins that match.
 */

import { SimpleMerkleTree } from "@openzeppelin/merkle-tree";
import { encodePacked, getAddress, isAddress, keccak256 } from "viem";

export type Address = `0x${string}`;

export type ParsedRecipients = {
  addresses: Address[];
  invalid: string[];
  duplicates: number;
};

/** The contract's leaf: one keccak of the packed address, nothing else. */
export function allowlistLeaf(address: Address): Address {
  return keccak256(encodePacked(["address"], [address]));
}

/**
 * Reads addresses out of free text: one per line, comma separated, or any
 * whitespace mix. Returns the checksummed, de-duplicated addresses plus the
 * tokens that were not addresses, so the caller can report them instead of
 * silently dropping an attendee.
 */
export function parseRecipientList(input: string): ParsedRecipients {
  const tokens = input.split(/[\s,;]+/).filter(Boolean);
  const seen = new Set<string>();
  const addresses: Address[] = [];
  const invalid: string[] = [];
  let duplicates = 0;

  for (const token of tokens) {
    if (!isAddress(token)) {
      invalid.push(token);
      continue;
    }
    const checksummed = getAddress(token);
    const key = checksummed.toLowerCase();
    if (seen.has(key)) {
      duplicates += 1;
      continue;
    }
    seen.add(key);
    addresses.push(checksummed);
  }

  return { addresses, invalid, duplicates };
}

export type AllowlistEntry = {
  address: Address;
  proof: Address[];
};

export type Allowlist = {
  root: Address;
  entries: AllowlistEntry[];
};

/** Builds the root and a per-recipient proof from a finished address list. */
export function buildAllowlist(addresses: Address[]): Allowlist {
  if (addresses.length === 0) {
    throw new Error("An invitation list needs at least one address.");
  }

  const tree = SimpleMerkleTree.of(addresses.map(allowlistLeaf));
  const entries = addresses.map((address) => {
    const proof = tree.getProof(allowlistLeaf(address)) as Address[];
    return { address, proof };
  });

  return { root: tree.root as Address, entries };
}

/** The same check the contract runs, usable as a pre-flight before a mint. */
export function verifyAllowlistProof(
  root: Address,
  address: Address,
  proof: Address[]
): boolean {
  return SimpleMerkleTree.verify(root, allowlistLeaf(address), proof);
}

/** The claim path the recipient opens, carrying their proof in the URL. */
export function allowlistClaimPath(eventId: bigint, proof: Address[]): string {
  return `/poaps/${eventId.toString()}/claim?method=allowlist&proof=${proof.join(",")}`;
}

/** The same path made absolute against a canonical origin. */
export function allowlistClaimLink(
  origin: string,
  eventId: bigint,
  proof: Address[]
): string {
  return `${origin.replace(/\/+$/, "")}${allowlistClaimPath(eventId, proof)}`;
}

/** A CSV a creator can keep or re-import, addresses and their claim links. */
export function allowlistCsv(
  origin: string,
  eventId: bigint,
  entries: AllowlistEntry[]
): string {
  const rows = [["address", "claim_link"]].concat(
    entries.map((entry) => [entry.address, allowlistClaimLink(origin, eventId, entry.proof)])
  );
  return rows.map((row) => row.map(csvCell).join(",")).join("\n");
}

function csvCell(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

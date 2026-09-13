/**
 * Recipient-bound signatures for the Onchain POAPs contract.
 *
 * `mintWithSignature` rebuilds the digest as
 * `keccak256(abi.encodePacked(eventId, block.chainid, msg.sender))`, applies
 * the Ethereum signed-message prefix, and requires the recovered address to
 * be the event creator. A signature therefore authorises exactly one wallet
 * for one event: it cannot be copied onto a poster and reused by a crowd.
 * The creator signs each recipient separately, and the only signer that will
 * satisfy the contract is the wallet that registered the event.
 */

import { encodePacked, keccak256, recoverMessageAddress } from "viem";

export type Address = `0x${string}`;

/** The exact 32-byte digest the contract hashes before the EIP-191 prefix. */
export function signatureDigest(
  eventId: bigint,
  chainId: number,
  recipient: Address
): Address {
  return keccak256(
    encodePacked(
      ["uint256", "uint256", "address"],
      [eventId, BigInt(chainId), recipient]
    )
  );
}

/** Recovers the signer of a claim signature, for the client-side pre-check. */
export async function recoverSignatureSigner(
  digest: Address,
  signature: Address
): Promise<Address> {
  return recoverMessageAddress({ message: { raw: digest }, signature });
}

/** The claim path the recipient opens, carrying their signature. */
export function signatureClaimPath(eventId: bigint, signature: string): string {
  return `/poaps/${eventId.toString()}/claim?method=signature&signature=${signature}`;
}

/** The same path made absolute against a canonical origin. */
export function signatureClaimLink(
  origin: string,
  eventId: bigint,
  signature: string
): string {
  return `${origin.replace(/\/+$/, "")}${signatureClaimPath(eventId, signature)}`;
}

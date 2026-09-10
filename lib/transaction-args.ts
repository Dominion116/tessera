import { parseAllowlistRoot, registrationFlags } from "./registration";
import { ZERO_ROOT } from "./poap-data";

export type RegistrationValues = {
  name: string;
  description: string;
  eventDate: bigint;
  location: string;
  allowlistRoot: `0x${string}`;
  artwork: string;
  externalUrl: string;
  isSoulbound: boolean;
  isPublic: boolean;
};

export function registerEventArgs(values: RegistrationValues) {
  return [
    values.name,
    values.description,
    values.eventDate,
    values.location,
    values.allowlistRoot,
    values.artwork,
    values.externalUrl,
    registrationFlags(values.isSoulbound, values.isPublic),
  ] as const;
}

export function mintArgs(eventId: bigint): readonly [bigint] {
  return [eventId];
}

export function allowlistMintArgs(eventId: bigint, proof: readonly `0x${string}`[]): readonly [bigint, readonly `0x${string}`[]] {
  return [eventId, proof];
}

export function parseMerkleProof(input?: string): `0x${string}`[] {
  if (!input) return [];
  const proof = input.split(",");
  return proof.length > 0 && proof.every((item) => /^0x[0-9a-fA-F]{64}$/.test(item))
    ? proof as `0x${string}`[]
    : [];
}

export function parseSignature(input?: string): `0x${string}` | null {
  return input && /^0x(?:[0-9a-fA-F]{2})+$/.test(input)
    ? input as `0x${string}`
    : null;
}

export function signatureMintArgs(eventId: bigint, signature: `0x${string}`): readonly [bigint, `0x${string}`] {
  return [eventId, signature];
}

export function creatorMintArgs(eventId: bigint, recipients: readonly `0x${string}`[]): readonly [bigint, readonly `0x${string}`[]] {
  return [eventId, recipients];
}

export function parseRecipientAddresses(input: string, limit: number): `0x${string}`[] | null {
  const recipients = input.split(/[\s,]+/).filter(Boolean);
  if (!recipients.length || recipients.length > limit) return null;
  if (!recipients.every((recipient) => /^0x[0-9a-fA-F]{40}$/.test(recipient))) return null;
  if (new Set(recipients.map((recipient) => recipient.toLowerCase())).size !== recipients.length) return null;
  return recipients as `0x${string}`[];
}

export function publicControlArgs(eventId: bigint, isPublic: boolean): readonly [bigint, boolean] {
  return [eventId, isPublic];
}

export function allowlistControlArgs(eventId: bigint, input: string): readonly [bigint, `0x${string}`] | null {
  const root = parseAllowlistRoot(input);
  return root ? [eventId, root] : null;
}

export { ZERO_ROOT, registrationFlags };

/**
 * Registration input rules, written once so the form, the byte counters
 * and any future transaction assembly cannot disagree. The contract
 * measures limits in UTF-8 bytes, not characters, and interpolates the
 * name, description, location and external URL into its metadata JSON
 * with no escaping: one quote, backslash or control character in those
 * fields corrupts the token's metadata permanently, so they are refused
 * here with the reason stated.
 */

import {
  SVG_HARD_LIMIT_BYTES,
  SVG_SOFT_LIMIT_BYTES,
} from "./poap-data";

/** UTF-8 byte length, which is what the contract's limits measure. */
export function utf8Bytes(value: string): number {
  return new TextEncoder().encode(value).length;
}

const JSON_UNSAFE = /["\\\x00-\x1f\x7f]/;

const CONTROL_NAMES: Record<string, string> = {
  "\n": "a line break",
  "\r": "a line break",
  "\t": "a tab",
};

/**
 * The first character the contract's metadata cannot store, in plain
 * language, or null when the value is safe.
 */
export function jsonUnsafeCharacter(value: string): string | null {
  const match = value.match(JSON_UNSAFE);
  if (!match) return null;

  const char = match[0];
  if (char === '"') return "a double quote";
  if (char === "\\") return "a backslash";
  return CONTROL_NAMES[char] ?? `a control character (code ${char.charCodeAt(0)})`;
}

export const JSON_UNSAFE_REASON =
  "The contract writes these fields straight into its metadata with no escaping, so a double quote, backslash or control character would corrupt the token's JSON permanently. Write the field without that character.";

export type FieldRule = {
  label: string;
  minBytes: number;
  maxBytes: number;
};

export const FIELD_RULES = {
  name: { label: "POAP name", minBytes: 1, maxBytes: 128 },
  description: { label: "Description", minBytes: 0, maxBytes: 512 },
  location: { label: "Location", minBytes: 0, maxBytes: 128 },
  externalUrl: { label: "External URL", minBytes: 0, maxBytes: 128 },
} as const satisfies Record<string, FieldRule>;

/**
 * The one rejection that stops a field: an unsafe character, or a byte
 * length outside the contract's window. Byte counts alone do not stop
 * anything; the counters inform, this gates.
 */
export function fieldError(value: string, rule: FieldRule): string | null {
  const unsafe = jsonUnsafeCharacter(value);
  if (unsafe) {
    return `${rule.label} contains ${unsafe}. ${JSON_UNSAFE_REASON}`;
  }

  const bytes = utf8Bytes(value);
  if (bytes < rule.minBytes) {
    return `${rule.label} is required.`;
  }
  if (bytes > rule.maxBytes) {
    return `${rule.label} is ${bytes} bytes, over the contract's ${rule.maxBytes}-byte limit. Counting bytes, not characters: most accented letters cost two and emoji cost four.`;
  }

  return null;
}

/** Base64 length the chain stores: four output characters per three input bytes. */
export function projectedOnchainBytes(rawBytes: number): number {
  return Math.ceil(rawBytes / 3) * 4;
}

export type SvgSizeStatus = {
  level: "ok" | "warn" | "over";
  rawBytes: number;
  onchainBytes: number;
  message: string;
};

/**
 * Artwork size against the onchain storage ceiling. Under the soft
 * limit is comfortable; between soft and hard it still registers; over
 * the hard limit the contract's single SSTORE2 deployment cannot hold
 * the encoded artwork, so the registration would revert onchain and is
 * refused here before it can cost anything.
 */
export function svgSizeStatus(artwork: string): SvgSizeStatus {
  const rawBytes = utf8Bytes(artwork);
  const onchainBytes = projectedOnchainBytes(rawBytes);

  if (rawBytes > SVG_HARD_LIMIT_BYTES) {
    return {
      level: "over",
      rawBytes,
      onchainBytes,
      message: `Artwork is ${rawBytes.toLocaleString()} bytes, past the ${Math.round(SVG_HARD_LIMIT_BYTES / 1024)} KB the contract can store in a single onchain write. The registration would revert. Simplify or optimize the SVG before registering.`,
    };
  }
  if (rawBytes > SVG_SOFT_LIMIT_BYTES) {
    return {
      level: "warn",
      rawBytes,
      onchainBytes,
      message: `Artwork is ${rawBytes.toLocaleString()} bytes. It still registers, but the onchain ceiling is ${Math.round(SVG_HARD_LIMIT_BYTES / 1024)} KB, so trimming here leaves safety margin.`,
    };
  }

  return {
    level: "ok",
    rawBytes,
    onchainBytes,
    message: `Artwork is ${rawBytes.toLocaleString()} bytes raw, ${onchainBytes.toLocaleString()} bytes as stored onchain. Comfortably inside the ceiling.`,
  };
}

/** The two registration flags the contract packs into one byte. */
export function registrationFlags(
  isSoulbound: boolean,
  isPublic: boolean
): 0 | 1 | 2 | 3 {
  if (isSoulbound && isPublic) return 3;
  if (isSoulbound) return 1;
  if (isPublic) return 2;
  return 0;
}

const ROOT_PATTERN = /^0x[0-9a-fA-F]{64}$/;

/**
 * An invitation-list commitment pasted at registration: 0x plus 32 bytes
 * of hex. Returns null for anything else, with no guessing.
 */
export function parseAllowlistRoot(input: string): `0x${string}` | null {
  const trimmed = input.trim();
  if (!ROOT_PATTERN.test(trimmed)) return null;
  return trimmed.toLowerCase() as `0x${string}`;
}

/** A `YYYY-MM-DD` date input value to unix seconds at UTC midnight, or 0. */
export function dateInputToUnix(value: string): bigint {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return 0n;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (Number.isNaN(date.getTime())) return 0n;
  return BigInt(Math.floor(date.getTime() / 1000));
}

/** Unix seconds back to a `YYYY-MM-DD` value a date input can display. */
export function unixToDateInput(unix: bigint): string {
  if (unix <= 0n) return "";
  const date = new Date(Number(unix) * 1000);
  const year = String(date.getUTCFullYear()).padStart(4, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

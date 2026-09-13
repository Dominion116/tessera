/**
 * The contract read layer. One public client, one typed ABI, and the
 * read functions every screen goes through: `events(uint256)`, `uri()`
 * and `totalSupply(uint256)` joined into `PoapEvent`, batched through
 * Multicall3 so a page of POAPs costs one round trip. Works on the
 * server (route handlers and server components) and in the browser
 * through the same functions, so no screen keeps a private copy of the
 * contract's answers.
 */

import {
  createPublicClient,
  parseAbi,
} from "viem";
import { baseSepolia } from "viem/chains";
import { createBaseSepoliaTransports } from "./rpc";
import OnchainPOAPsAbi from "../contracts/abi/OnchainPOAPs.json";
import {
  CONTRACT_ADDRESS,
  type PoapEvent,
  ZERO_ROOT,
} from "./poap-data";

/**
 * The human-readable mirror of the vendored ABI. The JSON extracted from
 * the verified Base Sepolia deployment is the runtime source of truth;
 * `parseAbi` only supplies the literal types viem needs to type the
 * calls, so the cast below asserts the two stay aligned.
 */
const typedAbi = parseAbi([
  "event NewEvent(uint256 indexed eventId, string name, address indexed creator)",
  "event NewMint(uint256 indexed eventId, address indexed recipient)",
  "function totalEvents() view returns (uint256)",
  "function totalSupply() view returns (uint256)",
  "function events(uint256) view returns (string, string, uint256, string, bytes32, address, address, uint256, string, bool, bool)",
  "function uri(uint256) view returns (string)",
  "function totalSupply(uint256) view returns (uint256)",
  "function hasClaimed(uint256, address) view returns (bool)",
  "function mint(uint256)",
  "function mintWithSignature(uint256, bytes)",
  "function allowlistMint(uint256, bytes32[])",
  "function creatorMint(uint256, address[])",
  "function balanceOfBatch(address[], uint256[]) view returns (uint256[])",
  "function exists(uint256) view returns (bool)",
  "function getMultichainEventId(uint256) view returns (string)",
  "function registerEvent(string, string, uint256, string, bytes32, string, string, uint8) returns (uint256)",
  "function updateAllowlistRoot(uint256, bytes32)",
  "function updateEventPublic(uint256, bool)",
]);

export const poapAbi = OnchainPOAPsAbi as unknown as typeof typedAbi;

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: createBaseSepoliaTransports(),
});

export type PoapPublicClient = typeof publicClient;

/** The one public client every read goes through, configured RPC first, chain default as fallback. */
export function getPublicClient(): PoapPublicClient {
  return publicClient;
}

/** Multicall3 batch size, kept modest so one aggregate call and its response stay small. */
const MULTICALL_EVENTS_PER_BATCH = 20;

/** The decoded `uri()` document. Fields the contract does not set are absent. */
export type PoapMetadata = {
  name?: string;
  description?: string;
  image?: string;
  external_url?: string;
  attributes?: unknown;
};

/** The namespace every renderable SVG root must declare. */
const SVG_XMLNS = "http://www.w3.org/2000/svg";

/**
 * The contract builds `uri()` JSON with `abi.encodePacked`, which never
 * escapes control characters in user text. A newline in a name or
 * description lands raw inside a JSON string literal, where the spec
 * forbids it, and `JSON.parse` rejects the whole document, taking the
 * artwork down with it. Escaping raw control characters is always safe:
 * valid JSON contains none, so this can only repair, never break.
 */
function repairJsonControlChars(json: string): string {
  return json.replace(/[\u0000-\u001f]/g, (char) => {
    const code = char.charCodeAt(0);
    return `\\u${code.toString(16).padStart(4, "0")}`;
  });
}

/**
 * Repair the root namespace of a decoded SVG. Uploaded artwork can carry
 * a malformed `xmlns` (for example `http://w3.org`), and a root outside
 * the SVG namespace renders as nothing when the browser loads the SVG
 * as an `<img>` document, even though inline previews look fine. Only
 * the namespace the frontend renders is repaired; the bytes onchain are
 * untouched.
 */
export function repairSvgNamespace(svg: string): string {
  const openingTag = /<svg\b[^>]*>/.exec(svg);
  if (!openingTag) return svg;
  const tag = openingTag[0];
  const existing = /\sxmlns\s*=\s*("[^"]*"|'[^']*')/.exec(tag);
  if (existing) {
    const value = existing[1].slice(1, -1);
    if (value === SVG_XMLNS) return svg;
    return svg.replace(
      /\sxmlns\s*=\s*("[^"]*"|'[^']*')/,
      ` xmlns="${SVG_XMLNS}"`
    );
  }
  return svg.replace(
    /<svg\b/,
    `<svg xmlns="${SVG_XMLNS}"`
  );
}

export function decodeUriMetadata(uri: string): PoapMetadata {
  const encoded = uri.slice("data:application/json;base64,".length);
  const json = decodeBase64(encoded);
  return JSON.parse(repairJsonControlChars(json)) as PoapMetadata;
}

export function decodeArtworkFromMetadata(metadata: PoapMetadata): string {
  const image = metadata.image ?? "";
  const prefix = "data:image/svg+xml;base64,";
  if (!image.startsWith(prefix)) return "";
  return repairSvgNamespace(decodeBase64(image.slice(prefix.length)));
}

function decodeBase64(encoded: string): string {
  if (typeof atob === "function") {
    const bytes = Uint8Array.from(atob(encoded), (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }
  return Buffer.from(encoded, "base64").toString("utf8");
}

function dataUrlToRawSvg(dataUrl: string): string {
  const prefix = "data:image/svg+xml;base64,";
  if (!dataUrl.startsWith(prefix)) return "";
  return decodeBase64(dataUrl.slice(prefix.length));
}

function isPoapEventTuple(result: readonly unknown[]): boolean {
  return (
    result.length === 11 &&
    typeof result[0] === "string" &&
    typeof result[7] === "bigint" &&
    typeof result[10] === "boolean"
  );
}

type EventsTuple = readonly [
  string,
  string,
  bigint,
  string,
  `0x${string}`,
  `0x${string}`,
  `0x${string}`,
  bigint,
  string,
  boolean,
  boolean,
];

/** Highest valid event ID. `totalEvents()` is also the newest registered event. */
export async function readTotalEvents(): Promise<bigint> {
  return getPublicClient().readContract({
    abi: poapAbi,
    address: CONTRACT_ADDRESS,
    functionName: "totalEvents",
  });
}

export async function readTotalMints(): Promise<bigint> {
  return getPublicClient().readContract({
    abi: poapAbi,
    address: CONTRACT_ADDRESS,
    functionName: "totalSupply",
  });
}

export async function readHasClaimed(
  eventId: bigint,
  account: `0x${string}`
): Promise<boolean> {
  return getPublicClient().readContract({
    abi: poapAbi,
    address: CONTRACT_ADDRESS,
    functionName: "hasClaimed",
    args: [eventId, account],
  });
}

export async function readMultichainEventId(eventId: bigint): Promise<string> {
  return getPublicClient().readContract({
    abi: poapAbi,
    address: CONTRACT_ADDRESS,
    functionName: "getMultichainEventId",
    args: [eventId],
  });
}

/**
 * Events, artwork and collector counts for the given IDs, newest-last to
 * match the ascending ID order the contract assigns. `uri()` and
 * `totalSupply(id)` ride the same Multicall3 aggregate, so a full page is
 * one round trip. Out-of-range IDs, where `uri()` reverts, drop out of
 * the result instead of failing the batch.
 */
export async function readEvents(ids: bigint[]): Promise<PoapEvent[]> {
  if (ids.length === 0) return [];

  const unique = ids.filter(
    (id, index) => id >= 0n && ids.indexOf(id) === index
  );
  const events: PoapEvent[] = [];

  for (let start = 0; start < unique.length; start += MULTICALL_EVENTS_PER_BATCH) {
    const batch = unique.slice(start, start + MULTICALL_EVENTS_PER_BATCH);
    const contracts = batch.flatMap((id) => [
      {
        abi: poapAbi,
        address: CONTRACT_ADDRESS,
        functionName: "events" as const,
        args: [id] as const,
      },
      {
        abi: poapAbi,
        address: CONTRACT_ADDRESS,
        functionName: "uri" as const,
        args: [id] as const,
      },
      {
        abi: poapAbi,
        address: CONTRACT_ADDRESS,
        functionName: "totalSupply" as const,
        args: [id] as const,
      },
    ]);

    const results = await getPublicClient().multicall({
      contracts,
      allowFailure: true,
    });

    for (let index = 0; index < batch.length; index++) {
      const eventResult = results[index * 3];
      const uriResult = results[index * 3 + 1];
      const supplyResult = results[index * 3 + 2];

      if (
        eventResult.status !== "success" ||
        !Array.isArray(eventResult.result) ||
        !isPoapEventTuple(eventResult.result)
      ) {
        continue;
      }
      // `events()` is a mapping read, so an out-of-range ID returns a zero
      // struct instead of reverting. `uri()` does revert there, which makes
      // it the range check: no successful `uri()` means no such event.
      if (uriResult.status !== "success" || typeof uriResult.result !== "string") {
        continue;
      }
      const tuple = eventResult.result as EventsTuple;

      let artwork = "";
      try {
        artwork = repairSvgNamespace(
          dataUrlToRawSvg(decodeUriMetadata(uriResult.result).image ?? "")
        );
      } catch {
        artwork = "";
      }

      const collectors =
        supplyResult.status === "success" && typeof supplyResult.result === "bigint"
          ? supplyResult.result
          : 0n;

      events.push({
        eventId: batch[index],
        name: tuple[0],
        description: tuple[1],
        eventDate: tuple[2],
        location: tuple[3],
        allowlistRoot: tuple[4] === ZERO_ROOT ? ZERO_ROOT : tuple[4],
        svgImage: tuple[5],
        creator: tuple[6],
        createdAt: tuple[7],
        externalUrl: tuple[8],
        isSoulbound: tuple[9],
        isPublic: tuple[10],
        collectors,
        artwork,
      });
    }
  }

  return events;
}

/** One event by ID, or null when the ID is out of the contract's range. */
export async function readEvent(id: bigint): Promise<PoapEvent | null> {
  const [event] = await readEvents([id]);
  return event ?? null;
}

/** The newest `count` events, newest first, including the genesis event at ID 0. */
export async function readLatestEvents(count: number): Promise<PoapEvent[]> {
  const total = await readTotalEvents();
  const highest = Number(total);
  if (highest + 1 <= 0) return [];

  const ids: bigint[] = [];
  for (let id = highest; id >= 1 && ids.length < count; id--) {
    ids.push(BigInt(id));
  }
  if (ids.length < count) {
    ids.push(0n);
  }

  const events = await readEvents(ids);
  const order = new Map(events.map((event) => [event.eventId, event]));
  return ids
    .map((id) => order.get(id))
    .filter((event): event is PoapEvent => Boolean(event));
}

/** Token balances for one owner across the given event IDs, via `balanceOfBatch`. */
export async function readBalances(
  owner: `0x${string}`,
  ids: bigint[]
): Promise<readonly bigint[]> {
  if (ids.length === 0) return [];

  const owners = ids.map(() => owner);
  return getPublicClient().readContract({
    abi: poapAbi,
    address: CONTRACT_ADDRESS,
    functionName: "balanceOfBatch",
    args: [owners, ids],
  });
}

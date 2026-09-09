/**
 * Mint log reads. The contract's `NewMint` log is the only record of
 * when a mint happened, and public RPC endpoints reject wide
 * `eth_getLogs` ranges, so this module walks the range in bounded
 * chunks and tolerates failed chunks: log data is enrichment for
 * charts and mint dates, never a dependency a screen needs to render.
 * Results are keyed by day so callers can cache one scan per day.
 */

import { parseAbiItem } from "viem";
import { getPublicClient, type PoapPublicClient } from "./poap-contract";

export const NEW_MINT_EVENT = parseAbiItem(
  "event NewMint(uint256 indexed eventId, address indexed recipient)"
);

export type MintLog = {
  eventId: bigint;
  recipient: `0x${string}`;
  blockNumber: bigint;
};

/** The widest range the public Base Sepolia endpoint reliably serves. */
const LOG_CHUNK_BLOCKS = 10_000n;

/** Concurrent chunk requests; low enough to stay polite to a public RPC. */
const LOG_CHUNK_CONCURRENCY = 4;

function chunkRanges(from: bigint, to: bigint): [bigint, bigint][] {
  const ranges: [bigint, bigint][] = [];
  for (let start = from; start <= to; start += LOG_CHUNK_BLOCKS) {
    const end = start + LOG_CHUNK_BLOCKS - 1n > to ? to : start + LOG_CHUNK_BLOCKS - 1n;
    ranges.push([start, end]);
  }
  return ranges;
}

async function fetchChunk(
  client: PoapPublicClient,
  address: `0x${string}`,
  range: [bigint, bigint],
  recipient?: `0x${string}`
): Promise<MintLog[]> {
  try {
    const logs = await client.getLogs({
      address,
      event: NEW_MINT_EVENT,
      args: recipient ? { recipient } : undefined,
      fromBlock: range[0],
      toBlock: range[1],
    });
    return logs
      .filter((log) => log.args.eventId !== undefined && log.args.recipient !== undefined)
      .map((log) => ({
        eventId: log.args.eventId as bigint,
        recipient: log.args.recipient as `0x${string}`,
        blockNumber: log.blockNumber,
      }));
  } catch {
    return [];
  }
}

/**
 * Every mint log in the block range, chunked. Failed chunks contribute
 * nothing rather than failing the scan, so a rate-limited RPC degrades
 * to partial data instead of an error screen.
 */
export async function fetchMintLogs(
  contract: `0x${string}`,
  fromBlock: bigint,
  toBlock: bigint,
  options?: { recipient?: `0x${string}`; signal?: AbortSignal }
): Promise<MintLog[]> {
  const client = getPublicClient();
  const ranges = chunkRanges(fromBlock, toBlock);
  const collected: MintLog[] = [];

  for (let index = 0; index < ranges.length; index += LOG_CHUNK_CONCURRENCY) {
    if (options?.signal?.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }
    const group = ranges.slice(index, index + LOG_CHUNK_CONCURRENCY);
    const batches = await Promise.all(
      group.map((range) => fetchChunk(client, contract, range, options?.recipient))
    );
    for (const batch of batches) {
      collected.push(...batch);
    }
  }

  return collected;
}

/**
 * Block timestamp for a single block. Used for exact mint dates on the
 * handful of blocks a wallet's own mints landed in; charts interpolate
 * instead of paying one call per log.
 */
export async function readBlockTimestamp(blockNumber: bigint): Promise<bigint> {
  const block = await getPublicClient().getBlock({ blockNumber });
  return block.timestamp;
}

/**
 * Approximate timestamp for a block number, from the latest block's
 * timestamp and Base Sepolia's two-second cadence. Day-level chart
 * bucketing tolerates the small drift this introduces.
 */
export function approximateBlockTimestamp(
  blockNumber: bigint,
  latestBlockNumber: bigint,
  latestBlockTimestamp: bigint
): number {
  return Number(latestBlockTimestamp) - Number(latestBlockNumber - blockNumber) * 2;
}

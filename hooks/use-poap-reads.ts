"use client";

/**
 * Client-side contract reads as react-query hooks, one cache shared by
 * every dashboard view. The queries keep the `PoapEvent` shape the
 * screens already render, so a view swaps its import for a hook and
 * nothing below that changes. BigInts never appear in query keys
 * because query keys must serialize.
 */

import { useMemo } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  getPublicClient,
  readBalances,
  readEvents,
  readHasClaimed,
  readTotalEvents,
} from "@/lib/poap-contract";
import {
  approximateBlockTimestamp,
  fetchMintLogs,
  readBlockTimestamp,
  type MintLog,
} from "@/lib/mint-logs";
import { CONTRACT_ADDRESS, type PoapEvent } from "@/lib/poap-data";

const MAX_SCANNED_EVENTS = 1000;

async function readAllEvents(): Promise<PoapEvent[]> {
  const total = await readTotalEvents();
  const highest = Number(total);
  const ids: bigint[] = [];
  for (let id = highest; id >= 1 && ids.length < MAX_SCANNED_EVENTS; id--) {
    ids.push(BigInt(id));
  }
  if (ids.length < MAX_SCANNED_EVENTS) {
    ids.push(0n);
  }
  return readEvents(ids);
}

/** Every registered event, newest first. Bounded by MAX_SCANNED_EVENTS. */
export function useAllEvents() {
  return useQuery({
    queryKey: ["all-events"],
    queryFn: readAllEvents,
    staleTime: 60_000,
  });
}

/** Events the connected wallet registered, newest first. */
export function useCreatedEvents(address: `0x${string}` | null) {
  const all = useAllEvents();

  const events = useMemo(() => {
    const created = all.data?.filter((event) => event.creator === address) ?? [];
    return [...created].sort(
      (a, b) => Number(b.createdAt) - Number(a.createdAt)
    );
  }, [all.data, address]);

  return {
    events,
    isLoading: all.isLoading,
    isError: all.isError,
    refetch: all.refetch,
  };
}

/** The newest head block, used to place log scans and date buckets. */
export function useBlockHead() {
  return useQuery({
    queryKey: ["block-head"],
    queryFn: async () => {
      const client = getPublicClient();
      const blockNumber = await client.getBlockNumber();
      const block = await client.getBlock({ blockNumber });
      return { blockNumber, timestamp: Number(block.timestamp) };
    },
    staleTime: 30_000,
  });
}

/**
 * Events for one page of the gallery, newest first, including the
 * genesis event at ID 0. Returns the page plus its total page count so
 * pagination controls render before the events arrive.
 */
export function useEventsPage(page: number, pageSize: number) {
  const total = useQuery({
    queryKey: ["total-events"],
    queryFn: readTotalEvents,
    staleTime: 30_000,
  });

  const pageCount = useMemo(() => {
    const count = Number(total.data ?? 0) + 1;
    return Math.max(1, Math.ceil(count / pageSize));
  }, [total.data, pageSize]);

  const clampedPage = Math.min(Math.max(1, page), pageCount);

  const ids = useMemo(() => {
    const count = Number(total.data ?? 0) + 1;
    if (!total.isSuccess) return [];
    const start = (clampedPage - 1) * pageSize;
    const pageIds: bigint[] = [];
    for (let offset = start; offset < start + pageSize && offset < count; offset++) {
      pageIds.push(BigInt(count - 1 - offset));
    }
    return pageIds;
  }, [total.isSuccess, total.data, clampedPage, pageSize]);

  const events = useQuery({
    queryKey: ["events", ids.map((id) => id.toString()).join(",")],
    queryFn: () => readEvents(ids),
    enabled: ids.length > 0,
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  });

  return {
    events: events.data ?? [],
    pageCount,
    page: clampedPage,
    isLoading: total.isLoading || (ids.length > 0 && events.isLoading),
    isFetching: events.isFetching,
    isError: total.isError || events.isError,
    refetch: () => {
      void total.refetch();
      void events.refetch();
    },
  };
}

/** One claim record, so mint surfaces can refuse a second mint before it costs gas. */
export function useHasClaimed(eventId: bigint, address: `0x${string}` | null) {
  return useQuery({
    queryKey: ["has-claimed", eventId.toString(), address],
    queryFn: () => readHasClaimed(eventId, address as `0x${string}`),
    enabled: Boolean(address),
    staleTime: 15_000,
  });
}

/**
 * Mint logs from the earliest timestamp a caller cares about, chunked
 * across the block range. `recipient` narrows the scan to one wallet
 * when only that wallet's mints matter. The scan reads the head block
 * itself, and the cache key rounds the start timestamp to the hour so
 * an advancing chain does not invalidate a scan that already covers it.
 */
export function useMintScan(
  fromTimestamp: number | null,
  recipient?: `0x${string}`
) {
  const start =
    fromTimestamp === null
      ? null
      : Math.floor(fromTimestamp / 3_600) * 3_600;

  return useQuery({
    queryKey: ["mint-scan", start ?? "none", recipient ?? "all"],
    queryFn: async () => {
      const client = getPublicClient();
      const headNumber = await client.getBlockNumber();
      const head = await client.getBlock({ blockNumber: headNumber });
      const blocksAgo = Math.ceil(
        (Number(head.timestamp) - (start as number)) / 2
      );
      const raw = headNumber - BigInt(blocksAgo) - 256n;
      const from = raw > 0n ? raw : 0n;
      return fetchMintLogs(CONTRACT_ADDRESS, from, headNumber, {
        recipient,
      });
    },
    enabled: start !== null,
    staleTime: 5 * 60_000,
  });
}

/** Exact block timestamps for the few blocks a wallet's own mints landed in. */
export function useBlockTimestamps(blockNumbers: bigint[]) {
  const key = useMemo(
    () => [...blockNumbers].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)).map((n) => n.toString()).join(","),
    [blockNumbers]
  );

  return useQuery({
    queryKey: ["block-timestamps", key],
    queryFn: async () => {
      const entries = await Promise.all(
        blockNumbers.map((blockNumber) => readBlockTimestamp(blockNumber))
      );
      const map = new Map<string, number>();
      blockNumbers.forEach((blockNumber, index) => {
        map.set(blockNumber.toString(), Number(entries[index]));
      });
      return map;
    },
    enabled: blockNumbers.length > 0,
    staleTime: Infinity,
  });
}

export type CollectionItem = {
  eventId: bigint;
  balance: bigint;
  event: PoapEvent;
  /** Block the mint landed in, when the log scan found it. */
  mintBlock: bigint | null;
};

/**
 * The POAPs an address holds: `balanceOfBatch` over every registered
 * event, joined back to the event reads, with mint blocks coming from
 * the wallet's own mint logs so dates stay enrichment, not a
 * dependency.
 */
export function useCollection(address: `0x${string}` | null) {
  const all = useAllEvents();

  const ids = useMemo(
    () => all.data?.map((event) => event.eventId) ?? [],
    [all.data]
  );

  const balances = useQuery({
    queryKey: ["balances", address, ids.length],
    queryFn: () => readBalances(address as `0x${string}`, ids),
    enabled: Boolean(address) && ids.length > 0,
    staleTime: 30_000,
  });

  const items = useMemo<CollectionItem[]>(() => {
    if (!all.data || !balances.data) return [];
    const eventsById = new Map(
      all.data.map((event) => [event.eventId.toString(), event])
    );
    const collected: CollectionItem[] = [];
    ids.forEach((eventId, index) => {
      const balance = balances.data[index] ?? 0n;
      const event = eventsById.get(eventId.toString());
      if (balance > 0n && event) {
        collected.push({ eventId, balance, event, mintBlock: null });
      }
    });
    return collected;
  }, [all.data, balances.data, ids]);

  const fromTimestamp = useMemo(() => {
    if (items.length === 0) return null;
    return Math.min(...items.map((item) => Number(item.event.createdAt)));
  }, [items]);

  const scan = useMintScan(fromTimestamp, address ?? undefined);

  const mintBlocks = useMemo(() => {
    if (!address) return new Map<string, bigint>();
    const map = new Map<string, bigint>();
    for (const log of scan.data ?? []) {
      if (log.recipient === address) {
        map.set(log.eventId.toString(), log.blockNumber);
      }
    }
    return map;
  }, [scan.data, address]);

  const withBlocks = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        mintBlock: mintBlocks.get(item.eventId.toString()) ?? null,
      })),
    [items, mintBlocks]
  );

  return {
    items: withBlocks,
    isLoading: all.isLoading || balances.isLoading,
    isError: all.isError || balances.isError,
    datesLoading: scan.isLoading,
    refetch: () => {
      void all.refetch();
      void balances.refetch();
    },
  };
}

/** Day buckets for the mint activity chart, newest last. */
export function buildMintDaySeries(
  logs: MintLog[],
  eventIds: Set<string>,
  head: { blockNumber: bigint; timestamp: number },
  days: number
): { date: string; mints: number }[] {
  const day = 86_400;
  const now = head.timestamp;
  const buckets = new Map<number, number>();
  for (const log of logs) {
    if (!eventIds.has(log.eventId.toString())) continue;
    const timestamp = approximateBlockTimestamp(
      log.blockNumber,
      head.blockNumber,
      BigInt(now)
    );
    const ageDays = Math.floor((now - timestamp) / day);
    if (ageDays < 0 || ageDays >= days) continue;
    buckets.set(ageDays, (buckets.get(ageDays) ?? 0) + 1);
  }
  const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return Array.from({ length: days }, (_, index) => {
    const ageDays = days - 1 - index;
    const timestamp = (now - ageDays * day) * 1000;
    const date = new Date(timestamp);
    return {
      date: `${date.getUTCDate()} ${month[date.getUTCMonth()]}`,
      mints: buckets.get(ageDays) ?? 0,
    };
  });
}

/** Mint counts per event for the mix chart, largest first. */
export function buildMintEventMix(
  logs: MintLog[],
  events: PoapEvent[]
): { eventId: string; name: string; mints: number }[] {
  const counts = new Map<string, number>();
  const ids = new Set(events.map((event) => event.eventId.toString()));
  for (const log of logs) {
    const key = log.eventId.toString();
    if (!ids.has(key)) continue;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const names = new Map(events.map((event) => [event.eventId.toString(), event.name]));
  return [...counts.entries()]
    .map(([eventId, mints]) => ({ eventId, name: names.get(eventId) ?? `#${eventId}`, mints }))
    .sort((a, b) => b.mints - a.mints);
}

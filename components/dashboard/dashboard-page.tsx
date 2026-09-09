"use client";

import { useMemo } from "react";
import { RefreshCw, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useWallet } from "@/components/wallet/wallet-provider";
import StatCards from "@/components/dashboard/stat-cards";
import MintActivityChart from "@/components/dashboard/mint-activity-chart";
import MethodMixChart from "@/components/dashboard/method-mix-chart";
import EventsTable from "@/components/dashboard/events-table";
import DeadlineWatch from "@/components/dashboard/deadline-watch";
import {
  buildMintDaySeries,
  buildMintEventMix,
  useBlockHead,
  useCreatedEvents,
  useMintScan,
} from "@/hooks/use-poap-reads";
import { upcomingFreezes } from "@/lib/deadlines";

const DAY = 86_400;

/**
 * The dashboard home, composed on the supplied template's grid: stats across
 * the top, mint activity and event mix side by side, the event list full
 * width, and the deadline watch closing the page. Every number is a live
 * contract read scoped to the events this wallet registered.
 */
const DashboardPage = () => {
  const { address } = useWallet();
  const { events, isLoading, isError, refetch } = useCreatedEvents(address);
  const head = useBlockHead();

  const scanStart = useMemo(() => {
    if (!head.data || events.length === 0) return null;
    const earliest = Math.min(...events.map((event) => Number(event.createdAt)));
    const thirtyDaysAgo = head.data.timestamp - 30 * DAY;
    return Math.max(earliest, thirtyDaysAgo);
  }, [events, head.data]);

  const scan = useMintScan(scanStart);

  const stats = useMemo(() => {
    const eventIds = new Set(events.map((event) => event.eventId.toString()));
    const daySeries = head.data
      ? buildMintDaySeries(scan.data ?? [], eventIds, head.data, 30)
      : [];
    const eventMix = buildMintEventMix(scan.data ?? [], events);

    return {
      created: events.length,
      collectors: events.reduce(
        (total, event) => total + Number(event.collectors),
        0
      ),
      openForPublicMint: events.filter((event) => event.isPublic).length,
      freezesWithin7Days: upcomingFreezes(events, 7).length,
      daySeries,
      eventMix,
    };
  }, [events, scan.data, head.data]);

  if (isError) {
    return (
      <div className="dashboard-page mx-auto grid w-full max-w-7xl grid-cols-12 gap-6 p-6">
        <header className="col-span-12 flex flex-col gap-2 border-b border-border/60 pb-5">
          <p className="text-xs font-medium tracking-[0.16em] text-teal-600 uppercase dark:text-teal-300">
            Creator overview
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        </header>
        <Card className="dashboard-panel col-span-12 py-5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <WifiOff aria-hidden="true" className="size-4 text-fg-tertiary" />
              The dashboard could not be read
            </CardTitle>
            <CardDescription>
              The Base Sepolia connection dropped while reading your events.
              Nothing was lost; try again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button type="button" variant="outline" onClick={() => refetch()}>
              <RefreshCw aria-hidden="true" />
              Try again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="dashboard-page mx-auto grid w-full max-w-7xl grid-cols-12 gap-6 p-6">
      <header className="col-span-12 flex flex-col gap-2 border-b border-border/60 pb-5">
        <p className="text-xs font-medium tracking-[0.16em] text-teal-600 uppercase dark:text-teal-300">
          Creator overview
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="max-w-xl text-sm leading-6 text-fg-secondary">
          The POAPs you created, who is minting them, and what freezes next.
        </p>
      </header>
      <StatCards stats={stats} loading={isLoading} />
      <MintActivityChart
        series={stats.daySeries}
        loading={isLoading || scan.isLoading || !head.data}
      />
      <MethodMixChart
        mix={stats.eventMix}
        loading={isLoading || scan.isLoading}
      />
      <EventsTable events={events} loading={isLoading} />
      <DeadlineWatch events={events} loading={isLoading} />
    </div>
  );
};

export default DashboardPage;

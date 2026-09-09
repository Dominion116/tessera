"use client";

import {
  CalendarClock,
  LockOpen,
  Stamp,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCount } from "@/lib/format";

type StatCard = {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
};

export type DashboardStats = {
  created: number;
  collectors: number;
  openForPublicMint: number;
  freezesWithin7Days: number;
};

const StatCardSkeleton = () => (
  <Card className="dashboard-panel gap-4 py-5">
    <CardContent className="flex flex-col gap-2">
      <div className="flex items-center gap-2.5">
        <Skeleton className="size-8 rounded-lg" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-9 w-16" />
      <Skeleton className="h-3 w-32" />
    </CardContent>
  </Card>
);

/**
 * The four numbers across the top of the dashboard, mapped from the
 * template's statistics block. Icons carry the teal accent; values are
 * tabular so they hold their width while reads refresh.
 */
const StatCards = ({
  stats,
  loading,
}: {
  stats: DashboardStats;
  loading: boolean;
}) => {
  const cards: StatCard[] = [
    {
      label: "POAPs created",
      value: String(stats.created),
      hint: "registered by this wallet",
      icon: Stamp,
    },
    {
      label: "Total collectors",
      value: formatCount(stats.collectors),
      hint: "one badge per wallet per event",
      icon: Users,
    },
    {
      label: "Open for public mint",
      value: String(stats.openForPublicMint),
      hint: "anyone can mint right now",
      icon: LockOpen,
    },
    {
      label: "Freezes within 7 days",
      value: String(stats.freezesWithin7Days),
      hint: "creator controls lock at day 30",
      icon: CalendarClock,
    },
  ];

  return (
    <div className="dashboard-stats col-span-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {loading
        ? Array.from({ length: 4 }, (_, index) => <StatCardSkeleton key={index} />)
        : cards.map((card) => (
            <Card key={card.label} className="dashboard-panel gap-4 py-5">
              <CardContent className="flex flex-col gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-teal-400/30 bg-teal-400/10 text-teal-600 dark:text-teal-300">
                    <card.icon aria-hidden="true" className="size-4" />
                  </div>
                  <span className="text-sm text-fg-secondary">{card.label}</span>
                </div>
                <p className="text-3xl font-semibold tabular-nums">{card.value}</p>
                <p className="text-xs text-fg-tertiary">{card.hint}</p>
              </CardContent>
            </Card>
          ))}
    </div>
  );
};

export default StatCards;

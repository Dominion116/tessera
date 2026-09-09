"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  mints: { label: "Mints", color: "var(--chart-2)" },
} satisfies ChartConfig;

/**
 * Mints per day across the POAPs this wallet created, the last 30 days,
 * mapped from the template's sales overview area chart. chart-2 is the teal
 * slot of the chart palette in both themes, so the accent holds. Counts
 * come from the contract's NewMint logs, so a day with no mints reads as
 * a flat zero, which is the honest answer.
 */
const MintActivityChart = ({
  series,
  loading,
}: {
  series: { date: string; mints: number }[];
  loading: boolean;
}) => {
  const totalMints = series.reduce((total, day) => total + day.mints, 0);

  return (
    <Card className="dashboard-panel col-span-12 gap-4 py-5 xl:col-span-8">
      <CardHeader>
        <CardTitle>Mint activity</CardTitle>
        <CardDescription>
          Mints per day across your events, the last 30 days.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-56 w-full items-end gap-2">
            {Array.from({ length: 16 }, (_, index) => (
              <Skeleton
                key={index}
                className="w-full"
                style={{ height: `${30 + ((index * 37) % 60)}%` }}
              />
            ))}
          </div>
        ) : totalMints === 0 ? (
          <p className="flex h-56 items-center justify-center rounded-lg border border-border/70 px-6 text-center text-sm leading-6 text-fg-secondary">
            No mints recorded in this window yet. When someone collects one
            of your POAPs, the day it happened shows up here.
          </p>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-56 w-full">
            <AreaChart data={series} margin={{ left: 12, right: 12 }}>
              <defs>
                <linearGradient id="fillMints" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-mints)" stopOpacity={0.65} />
                  <stop offset="95%" stopColor="var(--color-mints)" stopOpacity={0.08} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={24}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey="mints"
                name="Mints"
                type="monotone"
                stroke="var(--color-mints)"
                strokeWidth={2}
                fill="url(#fillMints)"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default MintActivityChart;

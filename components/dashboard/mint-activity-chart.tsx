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
import { MINT_ACTIVITY } from "@/lib/dashboard-data";

const chartConfig = {
  mints: { label: "Mints", color: "var(--chart-2)" },
} satisfies ChartConfig;

/**
 * Mints per day across the POAPs this wallet created, the last 30 days,
 * mapped from the template's sales overview area chart. chart-2 is the teal
 * slot of the chart palette in both themes, so the accent holds.
 */
const MintActivityChart = () => (
  <Card className="tile-grout col-span-12 gap-4 border-border/70 bg-card/60 py-5 xl:col-span-8">
    <CardHeader>
      <CardTitle>Mint activity</CardTitle>
      <CardDescription>
        Mints per day across your events, the last 30 days.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ChartContainer config={chartConfig} className="aspect-auto h-56 w-full">
        <AreaChart data={MINT_ACTIVITY} margin={{ left: 12, right: 12 }}>
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
    </CardContent>
  </Card>
);

export default MintActivityChart;

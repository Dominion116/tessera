"use client";

import { Cell, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCount } from "@/lib/format";

export type MintEventMix = {
  eventId: string;
  name: string;
  mints: number;
};

const PALETTE = [
  "var(--chart-2)",
  "var(--chart-1)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const SLICE_LIMIT = 4;

/**
 * Mints by event, mapped from the template's earning report donut. The
 * contract's mint log names the event, not the route, so the honest
 * split is which of your POAPs people are actually collecting; the
 * counts come from the same NewMint scan as the activity chart.
 */
const MethodMixChart = ({
  mix,
  loading,
}: {
  mix: MintEventMix[];
  loading: boolean;
}) => {
  const top = mix.slice(0, SLICE_LIMIT);
  const remainder = mix.slice(SLICE_LIMIT).reduce(
    (total, entry) => total + entry.mints,
    0
  );
  const rows = [
    ...top.map((entry) => ({ key: `event-${entry.eventId}`, label: entry.name, mints: entry.mints })),
    ...(remainder > 0
      ? [{ key: "other", label: "Other events", mints: remainder }]
      : []),
  ];

  const chartConfig = rows.reduce<Record<string, { label: string; color: string }>>(
    (config, row, index) => {
      config[row.key] = { label: row.label, color: PALETTE[index % PALETTE.length] };
      return config;
    },
    {}
  ) as ChartConfig;

  const data = rows.map((row) => ({ key: row.key, mints: row.mints }));
  const totalMints = rows.reduce((total, row) => total + row.mints, 0);

  return (
    <Card className="dashboard-panel col-span-12 gap-4 py-5 xl:col-span-4">
      <CardHeader>
        <CardTitle>Where mints land</CardTitle>
        <CardDescription>
          {formatCount(totalMints)} mints across your events, from the
          onchain mint record.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="mx-auto flex aspect-square max-h-[240px] w-full items-center justify-center">
            <Skeleton className="size-56 rounded-full" />
          </div>
        ) : rows.length === 0 ? (
          <p className="flex aspect-square max-h-[240px] items-center justify-center px-6 text-center text-sm leading-6 text-fg-secondary">
            No mints recorded in this window yet. Each of your events that
            someone collects shows up here.
          </p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[240px] w-full"
          >
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={data}
                dataKey="mints"
                nameKey="key"
                innerRadius={56}
                outerRadius={84}
                paddingAngle={2}
                strokeWidth={0}
              >
                {data.map((entry) => (
                  <Cell key={entry.key} fill={`var(--color-${entry.key})`} />
                ))}
              </Pie>
              <ChartLegend
                content={
                  <ChartLegendContent
                    nameKey="key"
                    className="flex-wrap gap-x-4 gap-y-1"
                  />
                }
              />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default MethodMixChart;

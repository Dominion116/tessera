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
import { formatCount } from "@/lib/format";
import { MINT_ROUTE_MIX, TOTAL_MINTS } from "@/lib/dashboard-data";

const chartConfig = {
  public: { label: "Public mint", color: "var(--chart-2)" },
  allowlist: { label: "Allowlist", color: "var(--chart-1)" },
  signature: { label: "Door codes", color: "var(--chart-3)" },
  airdrop: { label: "Creator drop", color: "var(--chart-4)" },
} satisfies ChartConfig;

/**
 * Mints by route, mapped from the template's earning report donut. The
 * labels stay plain: door codes are signature mints, creator drop is the
 * batch airdrop. Every route keeps working past day 37 except door codes.
 */
const MethodMixChart = () => (
  <Card className="dashboard-panel col-span-12 gap-4 py-5 xl:col-span-4">
    <CardHeader>
      <CardTitle>How people mint</CardTitle>
      <CardDescription>
        {formatCount(TOTAL_MINTS)} mints by route, across your events.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[240px] w-full"
      >
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Pie
            data={MINT_ROUTE_MIX}
            dataKey="mints"
            nameKey="route"
            innerRadius={56}
            outerRadius={84}
            paddingAngle={2}
            strokeWidth={0}
          >
            {MINT_ROUTE_MIX.map((entry) => (
              <Cell key={entry.route} fill={`var(--color-${entry.route})`} />
            ))}
          </Pie>
          <ChartLegend
            content={
              <ChartLegendContent
                nameKey="route"
                className="flex-wrap gap-x-4 gap-y-1"
              />
            }
          />
        </PieChart>
      </ChartContainer>
    </CardContent>
  </Card>
);

export default MethodMixChart;

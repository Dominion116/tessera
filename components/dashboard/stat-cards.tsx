import {
  CalendarClock,
  LockOpen,
  Stamp,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCount } from "@/lib/format";
import { DASHBOARD_STATS } from "@/lib/dashboard-data";

type StatCard = {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
};

const CARDS: StatCard[] = [
  {
    label: "POAPs created",
    value: String(DASHBOARD_STATS.created),
    hint: "registered by this wallet",
    icon: Stamp,
  },
  {
    label: "Total collectors",
    value: formatCount(DASHBOARD_STATS.collectors),
    hint: "one badge per wallet per event",
    icon: Users,
  },
  {
    label: "Open for public mint",
    value: String(DASHBOARD_STATS.openForPublicMint),
    hint: "anyone can mint right now",
    icon: LockOpen,
  },
  {
    label: "Freezes within 7 days",
    value: String(DASHBOARD_STATS.freezesWithin7Days),
    hint: "creator controls lock at day 30",
    icon: CalendarClock,
  },
];

/**
 * The four numbers across the top of the dashboard, mapped from the
 * template's statistics block. Icons carry the teal accent; values are
 * tabular so they hold their width when the source becomes live reads.
 */
const StatCards = () => (
  <div className="dashboard-stats col-span-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
    {CARDS.map((card) => (
      <Card
        key={card.label}
        className="dashboard-panel gap-4 py-5"
      >
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

export default StatCards;

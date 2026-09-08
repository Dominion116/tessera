import StatCards from "@/components/dashboard/stat-cards";
import MintActivityChart from "@/components/dashboard/mint-activity-chart";
import MethodMixChart from "@/components/dashboard/method-mix-chart";
import EventsTable from "@/components/dashboard/events-table";
import DeadlineWatch from "@/components/dashboard/deadline-watch";

/**
 * The dashboard home, composed on the supplied template's grid: stats across
 * the top, mint activity and route mix side by side, the event list full
 * width, and the deadline watch closing the page.
 */
const DashboardPage = () => (
  <div className="mx-auto grid w-full max-w-7xl grid-cols-12 gap-6 p-6">
    <header className="col-span-12 flex flex-col gap-1">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-sm text-fg-secondary">
        The POAPs you created, who is minting them, and what freezes next.
      </p>
    </header>
    <StatCards />
    <MintActivityChart />
    <MethodMixChart />
    <EventsTable />
    <DeadlineWatch />
  </div>
);

export default DashboardPage;

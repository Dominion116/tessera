import type { Metadata } from "next";
import AppGate from "@/components/dashboard/app-gate";

export const metadata: Metadata = {
  title: "POAPs I created",
};

const CreatedPoapsRoute = () => <AppGate initialView="created" />;

export default CreatedPoapsRoute;

import type { Metadata } from "next";
import CreatedPoapsView from "@/components/dashboard/created-poaps-view";

export const metadata: Metadata = {
  title: "POAPs I created",
};

const CreatedPoapsRoute = () => <CreatedPoapsView />;

export default CreatedPoapsRoute;

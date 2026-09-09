import type { Metadata } from "next";
import AppGate from "@/components/dashboard/app-gate";

export const metadata: Metadata = {
  title: "My collection",
};

const CollectionRoute = () => <AppGate initialView="collection" />;

export default CollectionRoute;

import type { Metadata } from "next";
import AppGate from "@/components/dashboard/app-gate";

export const metadata: Metadata = {
  title: "Create a POAP",
};

const CreatePoapRoute = () => <AppGate initialView="create" />;

export default CreatePoapRoute;

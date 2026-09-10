import type { Metadata } from "next";
import CreatePoapView from "@/components/dashboard/create-poap-view";

export const metadata: Metadata = {
  title: "Create a POAP",
};

const CreatePoapRoute = () => <CreatePoapView />;

export default CreatePoapRoute;

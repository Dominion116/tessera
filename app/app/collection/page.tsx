import type { Metadata } from "next";
import CollectionView from "@/components/dashboard/collection-view";

export const metadata: Metadata = {
  title: "My collection",
};

const CollectionRoute = () => <CollectionView />;

export default CollectionRoute;

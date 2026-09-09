import type { Metadata } from "next";
import AnimatedTabBarDemo from "@/components/demos/animated-tab-bar-demo";

export const metadata: Metadata = {
  title: "Animated Tab Bar",
};

const Page = () => <AnimatedTabBarDemo />;

export default Page;

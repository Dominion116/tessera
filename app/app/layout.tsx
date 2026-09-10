import AppGate from "@/components/dashboard/app-gate";

export default function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <AppGate>{children}</AppGate>;
}

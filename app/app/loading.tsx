import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AppLoading() {
  return (
    <div className="dashboard-page mx-auto grid w-full max-w-7xl grid-cols-12 gap-6 p-6" aria-busy="true">
      <header className="col-span-12 flex flex-col gap-2 border-b border-border/60 pb-5">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </header>
      <div className="col-span-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => <Card key={index}><CardContent className="space-y-3 p-5"><Skeleton className="h-4 w-24" /><Skeleton className="h-8 w-20" /></CardContent></Card>)}
      </div>
      <Card className="col-span-12 lg:col-span-7"><CardContent className="p-6"><Skeleton className="h-64 w-full" /></CardContent></Card>
      <Card className="col-span-12 lg:col-span-5"><CardContent className="p-6"><Skeleton className="h-64 w-full" /></CardContent></Card>
    </div>
  );
}

import { Skeleton } from "@/components/ui/skeleton";
import PublicHeader from "@/components/explore/public-header";

/**
 * Matches the detail page's two-column layout: a square artwork panel
 * beside the stacked metadata, so the skeleton resolves into the page
 * without shifting.
 */
export default function PoapLoading() {
  return (
    <div className="min-h-svh bg-background">
      <PublicHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <Skeleton className="h-5 w-28" />
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,1.05fr)] lg:items-start lg:gap-14">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="flex flex-col gap-7">
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
              <Skeleton className="h-12 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Skeleton className="h-44 w-full rounded-xl" />
            <Skeleton className="h-36 w-full rounded-xl" />
          </div>
        </div>
      </main>
    </div>
  );
}

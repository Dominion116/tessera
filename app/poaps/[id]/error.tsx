"use client";

import { RefreshCw, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PublicHeader from "@/components/explore/public-header";

/** Read failure on a public POAP page: one sentence and a way forward. */
export default function PoapError({ reset }: { reset: () => void }) {
  return (
    <div className="min-h-svh bg-background">
      <PublicHeader />
      <main className="mx-auto flex max-w-2xl flex-col px-4 py-16 sm:px-6 lg:px-8">
        <Card className="border-border/70 bg-card/65 py-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <WifiOff aria-hidden="true" className="size-4 text-fg-tertiary" />
              This POAP could not be read
            </CardTitle>
            <CardDescription>
              The Base Sepolia connection dropped while reading the contract.
              The badge is unaffected onchain; try reading it again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button type="button" variant="outline" onClick={reset}>
              <RefreshCw aria-hidden="true" />
              Try again
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

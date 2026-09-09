"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

type ExploreSearchProps = {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
};

/**
 * The Explore search field. A controlled input the dashboard keeps mounted,
 * so typing here never remounts the gallery behind it. The native search
 * cancel button is suppressed because the clear control is drawn inside the
 * field and keeps the focus ring styling consistent.
 */
const ExploreSearch = ({ value, onValueChange, className }: ExploreSearchProps) => (
  <div role="search" className={`relative ${className ?? ""}`}>
    <Search
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-fg-tertiary"
    />
    <Input
      type="search"
      value={value}
      onChange={(event) => onValueChange(event.target.value)}
      placeholder="Search registered POAPs by name, place, or number"
      aria-label="Search registered POAPs"
      autoComplete="off"
      spellCheck={false}
      className="rounded-lg pr-9 pl-9 [&::-webkit-search-cancel-button]:hidden"
    />
    {value ? (
      <button
        type="button"
        onClick={() => onValueChange("")}
        aria-label="Clear search"
        className="press absolute top-1/2 right-1.5 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-fg-tertiary outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-teal-400"
      >
        <X aria-hidden="true" className="size-3.5" />
      </button>
    ) : null}
  </div>
);

export default ExploreSearch;

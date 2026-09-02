"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
};

const ThemeToggle = ({ className }: ThemeToggleProps) => {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle light and dark mode"
      title="Toggle light and dark mode"
      className={cn(
        "relative flex items-center justify-center rounded-full sm:h-12 sm:w-12 h-10 w-10 shrink-0",
        "bg-white text-black cursor-pointer overflow-hidden outline-none",
        "transition-transform duration-100 ease-out active:scale-[0.98]",
        "focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
        className
      )}
    >
      {/* Visibility is driven by the theme class on <html>, so the markup is
          identical on the server and the client. */}
      <Sun
        size={16}
        aria-hidden="true"
        className="absolute rotate-0 scale-100 opacity-100 transition-all duration-200 ease-out dark:-rotate-90 dark:scale-0 dark:opacity-0 motion-reduce:transition-none"
      />
      <Moon
        size={16}
        aria-hidden="true"
        className="absolute rotate-90 scale-0 opacity-0 transition-all duration-200 ease-out dark:rotate-0 dark:scale-100 dark:opacity-100 motion-reduce:transition-none"
      />
    </button>
  );
};

export default ThemeToggle;

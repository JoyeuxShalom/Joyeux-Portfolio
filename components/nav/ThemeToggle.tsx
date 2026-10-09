"use client";

import { Moon, Sun } from "lucide-react";
import { setTheme, useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useTheme();
  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      className={cn(
        "relative grid size-10 place-items-center rounded-full border hairline text-mist transition-colors hover:border-paper/40 hover:text-paper",
        className,
      )}
    >
      {/* Both icons are rendered so the server markup matches; CSS shows the right one. */}
      <Sun className="size-4 light:hidden" aria-hidden />
      <Moon className="size-4 dark:hidden" aria-hidden />
    </button>
  );
}

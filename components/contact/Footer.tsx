"use client";

import { ArrowUp } from "lucide-react";
import { site } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t hairline">
      <div className="container-x flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-paper">{site.name}</p>
          <p className="label mt-1">{site.focus}</p>
        </div>
        <div className="flex items-center gap-6">
          {/* Year is computed in the browser so a static build never shows a stale year. */}
          <p className="text-xs text-mist" suppressHydrationWarning>
            © {new Date().getFullYear()} {site.shortName}
          </p>
          <a
            href="#top"
            className="grid size-10 place-items-center rounded-full border hairline text-mist transition-colors hover:border-paper/40 hover:text-paper"
            aria-label="Back to top"
          >
            <ArrowUp className="size-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}

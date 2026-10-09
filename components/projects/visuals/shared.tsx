"use client";

import { useState } from "react";
import { motionValue, useMotionValueEvent, type MotionValue } from "framer-motion";
import type { SystemStep } from "@/data/projects";
import { cn, pad2 } from "@/lib/utils";

export type VisualProps = {
  /** 0–1 progress through this project's part of the showcase. */
  progress?: MotionValue<number>;
  /** Whether this scene is the one on screen. */
  active?: boolean;
  /** "stage" = pinned desktop showcase, "card" = stacked mobile/reduced-motion layout. */
  mode: "stage" | "card";
};

const still = motionValue(0.65);
/** A progress value to use when no scroll progress is supplied. */
export const useProgress = (p?: MotionValue<number>) => p ?? still;

/** Index of the step that corresponds to the current progress. */
export function useStepIndex(progress: MotionValue<number>, steps: number) {
  const toIndex = (v: number) => Math.min(steps - 1, Math.floor(v * steps));
  const [index, setIndex] = useState(() => toIndex(progress.get()));
  useMotionValueEvent(progress, "change", (v) => {
    const next = toIndex(v);
    if (next !== index) setIndex(next);
  });
  return index;
}

export function StepList({
  steps,
  activeIndex,
  accent = "signal",
  className,
}: {
  steps: SystemStep[];
  activeIndex: number;
  accent?: "signal" | "ember";
  className?: string;
}) {
  return (
    <ol className={cn("space-y-1.5", className)}>
      {steps.map((s, i) => {
        const on = i === activeIndex;
        const done = i < activeIndex;
        return (
          <li key={s.label} className="flex items-center gap-3">
            <span
              className={cn(
                "font-mono text-[10px] tabular-nums transition-colors duration-500",
                on ? (accent === "ember" ? "text-ember" : "text-signal") : done ? "text-paper/60" : "text-paper/25",
              )}
            >
              {pad2(i + 1)}
            </span>
            <span
              className={cn(
                "h-px transition-all duration-500",
                on ? "w-6 bg-paper/70" : "w-3 bg-paper/15",
              )}
            />
            <span
              className={cn(
                "font-mono text-[10px] uppercase tracking-[0.16em] transition-colors duration-500",
                on ? "text-paper" : done ? "text-paper/50" : "text-paper/25",
              )}
            >
              {s.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/** Small "REC"-style status chip. */
export function LiveChip({ children, tone = "signal" }: { children: React.ReactNode; tone?: "signal" | "ember" }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-paper/10 bg-ink/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-paper/80 backdrop-blur">
      <span className={cn("animate-blink size-1.5 rounded-full", tone === "ember" ? "bg-ember" : "bg-signal")} />
      {children}
    </span>
  );
}

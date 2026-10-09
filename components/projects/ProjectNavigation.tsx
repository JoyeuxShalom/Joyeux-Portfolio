"use client";

import { motion, type MotionValue } from "framer-motion";
import type { Project } from "@/data/projects";
import { cn, pad2 } from "@/lib/utils";

function Segment({
  project,
  index,
  active,
  progress,
  onSelect,
}: {
  project: Project;
  index: number;
  active: boolean;
  /** 0 to 1; the showcase pins earlier projects at 1 and later ones at 0. */
  progress: MotionValue<number>;
  onSelect: (i: number) => void;
}) {
  return (
    <li className="flex-1">
      <button
        type="button"
        onClick={() => onSelect(index)}
        aria-current={active ? "step" : undefined}
        aria-label={`Show project ${index + 1}: ${project.title}`}
        className="group block w-full text-left"
      >
        <span className="relative block h-px w-full overflow-hidden bg-paper/15">
          <motion.span className="absolute inset-0 origin-left bg-paper" style={{ scaleX: progress }} />
        </span>
        <span className="mt-3 flex items-baseline gap-3">
          <span className={cn("font-mono text-[11px] transition-colors", active ? "text-signal" : "text-mist/60")}>
            {pad2(index + 1)}
          </span>
          <span
            className={cn(
              "text-[13px] transition-colors",
              active ? "text-paper" : "text-mist/60 group-hover:text-paper/80",
            )}
          >
            {project.title}
          </span>
        </span>
      </button>
    </li>
  );
}

export function ProjectNavigation({
  projects,
  active,
  progresses,
  onSelect,
}: {
  projects: Project[];
  active: number;
  progresses: MotionValue<number>[];
  onSelect: (i: number) => void;
}) {
  return (
    <nav aria-label="Project sequence" className="flex items-end gap-10">
      <p className="shrink-0 font-mono text-sm tabular-nums text-paper" aria-live="polite">
        {pad2(active + 1)} <span className="text-mist/50">/ {pad2(projects.length)}</span>
      </p>
      <ol className="flex flex-1 gap-6">
        {projects.map((p, i) => (
          <Segment
            key={p.slug}
            project={p}
            index={i}
            active={i === active}
            progress={progresses[i]}
            onSelect={onSelect}
          />
        ))}
      </ol>
    </nav>
  );
}

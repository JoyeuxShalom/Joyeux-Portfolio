"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { getProject } from "@/data/projects";
import { cn } from "@/lib/utils";
import { StepList, useProgress, useStepIndex, type VisualProps } from "./shared";

const project = getProject("getech-solutions")!;

/**
 * An original "exploded view" of a software product: interface, services,
 * and data layers that separate as you scroll, like a hardware teardown.
 * Every label is generic; no client names or data.
 */

function Layer({
  p,
  depth,
  label,
  children,
}: {
  p: MotionValue<number>;
  depth: number;
  label: string;
  children: React.ReactNode;
}) {
  const z = useTransform(p, [0, 1], [depth * 18, depth * 120]);
  const opacity = useTransform(p, [0, 0.15], [0.75, 1]);
  return (
    <motion.div
      className="absolute inset-0 rounded-md border border-paper/12 bg-coal/90 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)]"
      style={{ z, opacity, transformStyle: "preserve-3d" }}
    >
      <span className="absolute -left-2 top-4 -translate-x-full whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.18em] text-mist">
        {label}
      </span>
      {children}
    </motion.div>
  );
}

function InterfaceMock() {
  return (
    <div className="flex size-full flex-col p-3">
      <div className="flex items-center gap-1.5 border-b border-paper/10 pb-2">
        <span className="size-1.5 rounded-full bg-ember/80" />
        <span className="size-1.5 rounded-full bg-paper/25" />
        <span className="size-1.5 rounded-full bg-paper/25" />
        <span className="ml-3 h-1.5 w-24 rounded-full bg-paper/10" />
      </div>
      <div className="mt-3 grid flex-1 grid-cols-5 gap-2">
        <div className="col-span-1 space-y-1.5">
          {[60, 80, 70, 50].map((w, i) => (
            <span key={i} className={cn("block h-1.5 rounded-full", i === 0 ? "bg-signal/70" : "bg-paper/12")} style={{ width: `${w}%` }} />
          ))}
        </div>
        <div className="col-span-4 grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-sm border border-paper/10 p-1.5">
              <span className="block h-1 w-1/2 rounded-full bg-paper/20" />
              <span className="mt-1.5 block h-2.5 w-3/4 rounded-sm bg-paper/40" />
            </div>
          ))}
          <div className="col-span-3 flex items-end gap-1 rounded-sm border border-paper/10 p-2">
            {[30, 45, 38, 60, 52, 70, 64, 82, 76, 90].map((h, i) => (
              <span key={i} className="flex-1 rounded-t-[1px] bg-signal/50" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ServicesMock() {
  const services = ["auth", "members", "content", "payments", "notify", "reports"];
  return (
    <div className="grid size-full grid-cols-3 gap-2 p-3">
      {services.map((s) => (
        <div key={s} className="flex flex-col justify-between rounded-sm border border-signal/20 bg-signal/[0.04] p-2">
          <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-signal/80">{s}</span>
          <span className="font-mono text-[8px] text-mist/70">/api/v1/{s}</span>
        </div>
      ))}
    </div>
  );
}

function DataMock() {
  return (
    <div className="flex size-full items-center justify-around p-4">
      {["primary", "cache", "files"].map((d, i) => (
        <div key={d} className="flex flex-col items-center gap-2">
          <div className="relative h-14 w-12">
            <span className={cn("absolute inset-x-0 top-0 h-3 rounded-[50%] border", i === 0 ? "border-ember/70" : "border-paper/30")} />
            <span className={cn("absolute inset-x-0 top-1.5 bottom-1.5 border-x", i === 0 ? "border-ember/50" : "border-paper/20")} />
            <span className={cn("absolute inset-x-0 bottom-0 h-3 rounded-[50%] border", i === 0 ? "border-ember/70" : "border-paper/30")} />
          </div>
          <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-mist">{d}</span>
        </div>
      ))}
    </div>
  );
}

export function GetechVisual({ progress, active = true, mode }: VisualProps) {
  const p = useProgress(progress);
  const step = useStepIndex(p, project.system.steps.length);
  const rotateZ = useTransform(p, [0, 1], [-38, -30]);
  const stage = mode === "stage";

  return (
    <div className="relative size-full overflow-hidden bg-ink">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_55%_55%,color-mix(in_oklab,var(--ember)_7%,transparent),transparent_55%)]" />

      <div className="absolute inset-0 grid place-items-center" style={{ perspective: 1800 }}>
        <motion.div
          className={cn("relative aspect-[4/3]", stage ? "w-[52%] max-w-[520px]" : "w-[62%]")}
          style={{ rotateX: 56, rotateZ, transformStyle: "preserve-3d" }}
        >
          <Layer p={p} depth={0} label="Data">
            <DataMock />
          </Layer>
          <Layer p={p} depth={1} label="Services & APIs">
            <ServicesMock />
          </Layer>
          <Layer p={p} depth={2} label="Interface">
            <InterfaceMock />
          </Layer>
        </motion.div>
      </div>

      {stage && (
        <div
          className={cn(
            "absolute bottom-[8%] right-[6%] rounded-sm border border-paper/10 bg-ink/70 p-4 backdrop-blur-md transition-opacity duration-700",
            active ? "opacity-100" : "opacity-0",
          )}
        >
          <p className="label mb-3 text-paper/70">{project.system.title}</p>
          <StepList steps={project.system.steps} activeIndex={step} accent="ember" />
        </div>
      )}
      <p className="absolute left-4 top-4 font-mono text-[9px] uppercase tracking-[0.18em] text-mist/70 sm:left-6 sm:top-6">
        Illustrative architecture · no client data
      </p>
    </div>
  );
}

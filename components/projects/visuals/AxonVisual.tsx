"use client";

import { motion, useTransform } from "framer-motion";
import { getProject } from "@/data/projects";
import { ScrollScrubVideo } from "@/components/media/ScrollScrubVideo";
import { InViewVideo } from "@/components/media/InViewVideo";
import { r2 } from "@/lib/random";
import { cn } from "@/lib/utils";
import { LiveChip, StepList, useProgress, useStepIndex, type VisualProps } from "./shared";

const project = getProject("axon")!;

/** A stylised photoplethysmography (pulse) waveform. */
const ppg = (() => {
  const W = 1000;
  const beats = 7;
  const period = W / beats;
  const pts: string[] = [];
  for (let x = 0; x <= W; x += 4) {
    const t = (x % period) / period;
    // Systolic peak, dicrotic notch, and decay.
    const y =
      Math.exp(-Math.pow((t - 0.18) / 0.06, 2)) * 1 +
      Math.exp(-Math.pow((t - 0.42) / 0.08, 2)) * 0.38 -
      Math.exp(-Math.pow((t - 0.34) / 0.025, 2)) * 0.08;
    pts.push(`${x},${r2(70 - y * 52)}`);
  }
  return `M${pts.join("L")}`;
})();

const sensors = [
  { name: "ESP32 Mini", role: "Microcontroller · BLE" },
  { name: "MAX30102", role: "Pulse & SpO₂ (PPG)" },
  { name: "MPU6050", role: "Motion (IMU)" },
];

export function AxonVisual({ progress, active = true, mode }: VisualProps) {
  const p = useProgress(progress);
  const step = useStepIndex(p, project.system.steps.length);
  const trace = useTransform(p, [0, 1], [0.12, 1]);
  const scan = useTransform(p, [0, 1], ["0%", "100%"]);
  const bpm = useTransform(p, (v) => String(Math.round(68 + Math.sin(v * 9) * 6)));
  const stage = mode === "stage";
  const video = project.scrubVideo!;

  const posterFallback = (
    // eslint-disable-next-line @next/next/no-img-element -- decorative fallback that may 404
    <img src={video.poster} alt="" className="size-full object-cover opacity-80" onError={(e) => (e.currentTarget.style.display = "none")} />
  );

  return (
    <div className="relative size-full overflow-hidden bg-ink">
      {/* Clinical-blue wash and fine measurement grid. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,color-mix(in_oklab,var(--signal)_10%,transparent),transparent_60%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(color-mix(in_oklab,var(--paper)_4%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_oklab,var(--paper)_4%,transparent)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div
        className={cn(
          "absolute flex flex-col",
          stage ? "inset-x-[6%] top-[9%] bottom-[9%] gap-5" : "inset-0 gap-0",
        )}
      >
        {/* Bench footage from the real prototype demo. */}
        <div className={cn("viewfinder relative overflow-hidden border border-paper/10", stage ? "h-[60%] self-center rounded-sm" : "")}>
          {stage ? (
            <ScrollScrubVideo
              src={video.src}
              poster={video.poster}
              aspect={video.aspect}
              progress={p}
              className="h-full"
              label="Axon prototype demo: sensors on a breadboard beside the patient mobile app"
              fallback={posterFallback}
            />
          ) : (
            <InViewVideo
              src={video.src}
              poster={video.poster}
              aspect={video.aspect}
              label="Axon prototype demo: sensors on a breadboard beside the patient mobile app"
              fallback={posterFallback}
            />
          )}
          <div className="absolute left-3 top-3">
            <LiveChip>{video.label}</LiveChip>
          </div>
        </div>

        {stage && (
          <div
            className={cn(
              "grid min-h-0 flex-1 grid-cols-12 gap-5 transition-opacity duration-700",
              active ? "opacity-100" : "opacity-0",
            )}
          >
            {/* Pulse trace */}
            <div className="relative col-span-7 overflow-hidden rounded-sm border border-paper/10 bg-coal/70 p-4">
              <div className="flex items-baseline justify-between">
                <span className="label">PPG · illustrative</span>
                <span className="font-mono text-[11px] text-paper/80">
                  <motion.span>{bpm}</motion.span> <span className="text-mist">bpm</span>
                </span>
              </div>
              <svg viewBox="0 0 1000 90" preserveAspectRatio="none" className="mt-2 h-[calc(100%-1.5rem)] w-full" aria-hidden>
                <path d={ppg} fill="none" className="stroke-signal" strokeOpacity="0.12" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                <motion.path
                  d={ppg}
                  fill="none"
                  className="stroke-signal"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                  style={{ pathLength: trace }}
                />
              </svg>
              <motion.span
                className="absolute bottom-4 top-10 w-px bg-ember/70"
                style={{ left: scan }}
                aria-hidden
              />
            </div>

            <div className="col-span-5 flex flex-col justify-between rounded-sm border border-paper/10 bg-coal/70 p-4">
              <StepList steps={project.system.steps} activeIndex={step} />
              <ul className="mt-3 space-y-1 border-t border-paper/10 pt-3">
                {sensors.map((s) => (
                  <li key={s.name} className="flex justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.12em]">
                    <span className="text-paper/85">{s.name}</span>
                    <span className="text-right text-mist">{s.role}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      <p className="absolute bottom-3 right-4 font-mono text-[9px] uppercase tracking-[0.18em] text-mist/70">
        Research prototype · not a medical device
      </p>
    </div>
  );
}

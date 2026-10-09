"use client";

import { motion, useTransform } from "framer-motion";
import { getProject } from "@/data/projects";
import { ScrollScrubVideo } from "@/components/media/ScrollScrubVideo";
import { InViewVideo } from "@/components/media/InViewVideo";
import { r2, seeded } from "@/lib/random";
import { cn } from "@/lib/utils";
import { LiveChip, StepList, useProgress, useStepIndex, type VisualProps } from "./shared";

const project = getProject("parkshield")!;
const W = 800;
const H = 600;

/** Procedural topographic contours: noisy rings around a few peaks. */
const contours = (() => {
  const rand = seeded(3);
  const peaks = [
    { x: 180, y: 160, levels: 7 },
    { x: 620, y: 420, levels: 9 },
    { x: 560, y: 90, levels: 4 },
  ];
  const paths: string[] = [];
  for (const peak of peaks) {
    const p1 = rand() * 6;
    const p2 = rand() * 6;
    for (let l = 1; l <= peak.levels; l++) {
      const base = l * 26;
      const pts: string[] = [];
      for (let k = 0; k <= 72; k++) {
        const a = (k / 72) * Math.PI * 2;
        const rad = base * (1 + 0.14 * Math.sin(3 * a + p1 + l * 0.3) + 0.07 * Math.sin(7 * a + p2));
        pts.push(`${r2(peak.x + Math.cos(a) * rad * 1.25)},${r2(peak.y + Math.sin(a) * rad)}`);
      }
      paths.push(`M${pts.join("L")}Z`);
    }
  }
  return paths;
})();

// The park boundary and the sensor nodes placed along it.
const boundary = "M-20,470 C120,430 210,500 330,440 S520,330 610,360 S760,300 830,250";
const sensors = [
  { x: 110, y: 448, id: "N-01" },
  { x: 330, y: 440, id: "N-02" },
  { x: 520, y: 352, id: "N-03" },
  { x: 720, y: 300, id: "N-04" },
];
const gateway = { x: 400, y: 170 };

export function ParkShieldVisual({ progress, active = true, mode }: VisualProps) {
  const p = useProgress(progress);
  const step = useStepIndex(p, project.system.steps.length);
  const drawn = useTransform(p, [0, 0.7], [0, 1]);
  const mapY = useTransform(p, [0, 1], ["0%", "-6%"]);
  const timecode = useTransform(p, (v) => `00:0${Math.floor(v * 7)}:${String(Math.floor((v * 7 * 24) % 24)).padStart(2, "0")}`);
  const stage = mode === "stage";
  const video = project.scrubVideo!;

  const map = (
    <motion.svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 size-full"
      style={{ y: stage ? mapY : 0 }}
      aria-hidden
    >
      <defs>
        <radialGradient id="ps-glow" cx="50%" cy="60%" r="60%">
          <stop offset="0%" stopColor="var(--signal)" stopOpacity="0.08" />
          <stop offset="100%" stopColor="var(--ink)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#ps-glow)" />
      <g fill="none" className="stroke-mist" strokeOpacity="0.13" strokeWidth="0.8">
        {contours.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      {/* Protected area boundary */}
      <path d={boundary} fill="none" className="stroke-ember" strokeOpacity="0.55" strokeWidth="1.2" strokeDasharray="6 6" />
      {/* Links from sensors to the gateway draw in with progress. */}
      <g className="stroke-signal" strokeWidth="1" fill="none">
        {sensors.map((s) => (
          <motion.path
            key={s.id}
            d={`M${s.x},${s.y} Q${(s.x + gateway.x) / 2},${s.y - 120} ${gateway.x},${gateway.y}`}
            strokeOpacity={0.45}
            style={{ pathLength: stage ? drawn : 1 }}
          />
        ))}
      </g>
      <g>
        <circle cx={gateway.x} cy={gateway.y} r="5" className="fill-signal" />
        <circle cx={gateway.x} cy={gateway.y} r="14" fill="none" className="stroke-signal" strokeOpacity="0.35" />
        <text x={gateway.x + 22} y={gateway.y + 4} className="fill-mist" fontSize="11" fontFamily="var(--font-mono)" letterSpacing="2">
          GATEWAY
        </text>
      </g>
      {sensors.map((s) => (
        <g key={s.id}>
          <circle cx={s.x} cy={s.y} r="4" className="fill-paper" />
          <text x={s.x + 10} y={s.y + 22} className="fill-mist" fillOpacity="0.8" fontSize="10" fontFamily="var(--font-mono)" letterSpacing="1.5">
            {s.id}
          </text>
        </g>
      ))}
    </motion.svg>
  );

  // CSS pulses over sensors (positioned in % of the SVG frame).
  const pulses = sensors.map((s) => (
    <span
      key={s.id}
      className="pointer-events-none absolute size-2 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${(s.x / W) * 100}%`, top: `${(s.y / H) * 100}%` }}
    >
      <span className="animate-ping-soft absolute inset-0 rounded-full bg-signal" />
    </span>
  ));

  const posterFallback = (
    // eslint-disable-next-line @next/next/no-img-element -- decorative fallback that may 404; next/image would log noise
    <img src={video.poster} alt="" className="size-full object-cover opacity-80" onError={(e) => (e.currentTarget.style.display = "none")} />
  );

  return (
    <div className="relative size-full overflow-hidden bg-ink">
      <div className="absolute inset-0">
        {map}
        {pulses}
      </div>
      <p className="absolute left-4 top-4 font-mono text-[9px] uppercase tracking-[0.18em] text-mist/70 sm:left-6 sm:top-6">
        <span className="mr-2 inline-block h-px w-4 border-t border-dashed border-ember/80 align-middle" />
        Park boundary · concept layout
      </p>

      {/* Node feed: the real prototype footage, scrubbed by scroll on desktop. */}
      <div
        className={cn(
          "absolute",
          stage ? "right-[7%] top-[9%] h-[82%]" : "right-[5%] top-[8%] h-[84%]",
        )}
      >
        <div className="viewfinder h-full overflow-hidden rounded-sm border border-paper/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]">
          {stage ? (
            <ScrollScrubVideo
              src={video.src}
              poster={video.poster}
              aspect={video.aspect}
              progress={p}
              className="h-full"
              label="ParkShield prototype hardware: microcontroller with camera module"
              fallback={posterFallback}
            />
          ) : (
            <InViewVideo
              src={video.src}
              poster={video.poster}
              aspect={video.aspect}
              className="h-full"
              label="ParkShield prototype hardware: microcontroller with camera module"
              fallback={posterFallback}
            />
          )}
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-2.5">
            <LiveChip tone="ember">{video.label}</LiveChip>
          </div>
          {stage && (
            <motion.span className="absolute bottom-2.5 right-3 font-mono text-[10px] tracking-[0.14em] text-paper/70">
              {timecode}
            </motion.span>
          )}
        </div>
      </div>

      {stage && (
        <div
          className={cn(
            "absolute bottom-[8%] left-[6%] rounded-sm border border-paper/10 bg-ink/70 p-4 backdrop-blur-md transition-opacity duration-700",
            active ? "opacity-100" : "opacity-0",
          )}
        >
          <p className="label mb-3 text-paper/70">{project.system.title}</p>
          <StepList steps={project.system.steps} activeIndex={step} accent="ember" />
        </div>
      )}
    </div>
  );
}

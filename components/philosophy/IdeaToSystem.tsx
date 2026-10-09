"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { r2, seeded } from "@/lib/random";

/**
 * Scattered nodes (an idea) settle into an ordered grid (an engineered
 * system) as the section scrolls. Positions are interpolated in one GSAP
 * onUpdate that writes SVG attributes directly: no React re-renders.
 */
const COLS = 9;
const ROWS = 5;
const W = 720;
const H = 400;

const layout = (() => {
  const rand = seeded(42);
  const gapX = W / (COLS + 1);
  const gapY = H / (ROWS + 1);
  return Array.from({ length: COLS * ROWS }, (_, i) => {
    const c = i % COLS;
    const r = Math.floor(i / COLS);
    return {
      sx: r2(40 + rand() * (W - 80)),
      sy: r2(30 + rand() * (H - 60)),
      gx: r2(gapX * (c + 1)),
      gy: r2(gapY * (r + 1)),
      accent: i === 22,
    };
  });
})();

// Grid neighbours: right and down. In the scattered state these read as a tangle.
const links = layout.flatMap((_, i) => {
  const out: [number, number][] = [];
  if (i % COLS < COLS - 1) out.push([i, i + 1]);
  if (i + COLS < layout.length) out.push([i, i + COLS]);
  return out;
});

export function IdeaToSystem() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const svg = root.current!.querySelector("svg")!;
      const circles = Array.from(svg.querySelectorAll<SVGCircleElement>("[data-node]"));
      const lines = Array.from(svg.querySelectorAll<SVGLineElement>("[data-link]"));
      const meter = root.current!.querySelector<HTMLElement>("[data-meter]");
      const ease = gsap.parseEase("power3.inOut");

      const apply = (p: number) => {
        const t = ease(p);
        const pos = layout.map((n) => [n.sx + (n.gx - n.sx) * t, n.sy + (n.gy - n.sy) * t]);
        circles.forEach((c, i) => {
          c.setAttribute("cx", pos[i][0].toFixed(1));
          c.setAttribute("cy", pos[i][1].toFixed(1));
        });
        lines.forEach((l, k) => {
          const [a, b] = links[k];
          l.setAttribute("x1", pos[a][0].toFixed(1));
          l.setAttribute("y1", pos[a][1].toFixed(1));
          l.setAttribute("x2", pos[b][0].toFixed(1));
          l.setAttribute("y2", pos[b][1].toFixed(1));
          l.style.strokeOpacity = String(0.05 + t * 0.2);
        });
        if (meter) meter.style.transform = `scaleX(${p})`;
      };

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const state = { p: 0 };
        apply(0);
        gsap.to(state, {
          p: 1,
          ease: "none",
          onUpdate: () => apply(state.p),
          scrollTrigger: { trigger: root.current, start: "top 85%", end: "center 40%", scrub: 0.8 },
        });
      });
      // Reduced motion: show the finished system.
      mm.add("(prefers-reduced-motion: reduce)", () => apply(1));
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="viewfinder relative rounded-sm border hairline bg-coal/60 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <span className="label">Idea</span>
        <span className="relative mx-4 h-px flex-1 overflow-hidden bg-paper/10">
          <span data-meter className="absolute inset-0 origin-left scale-x-0 bg-signal/70" />
        </span>
        <span className="label">System</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 block h-auto w-full" aria-hidden>
        <defs>
          <pattern id="philo-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" className="stroke-paper" strokeOpacity="0.035" />
          </pattern>
        </defs>
        <rect width={W} height={H} fill="url(#philo-grid)" />
        <g className="stroke-signal" strokeWidth="1">
          {links.map(([a, b]) => (
            <line
              key={`${a}-${b}`}
              data-link
              x1={layout[a].gx}
              y1={layout[a].gy}
              x2={layout[b].gx}
              y2={layout[b].gy}
              strokeOpacity={0.25}
            />
          ))}
        </g>
        {layout.map((n, i) => (
          <circle
            key={i}
            data-node
            cx={n.gx}
            cy={n.gy}
            r={n.accent ? 5 : 3}
            className={n.accent ? "fill-ember" : "fill-paper"}
            fillOpacity={n.accent ? 1 : 0.75}
          />
        ))}
      </svg>
    </div>
  );
}

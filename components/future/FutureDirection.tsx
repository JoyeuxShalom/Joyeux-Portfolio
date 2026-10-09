"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { r2, seeded } from "@/lib/random";
import { SectionLabel } from "@/components/ui/ScrollReveal";

/**
 * One node at the centre; rings of connected nodes expand outward as the
 * section scrolls into view — engineers, ideas, and useful technology
 * growing from a single starting point.
 */
const SIZE = 800;
const C = SIZE / 2;

const rings = (() => {
  const rand = seeded(9);
  const spec = [
    { r: 110, n: 6 },
    { r: 210, n: 12 },
    { r: 320, n: 20 },
  ];
  return spec.map(({ r, n }, ring) =>
    Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2 + ring * 0.35 + (rand() - 0.5) * 0.18;
      const rr = r * (0.94 + rand() * 0.12);
      return { x: r2(C + Math.cos(a) * rr), y: r2(C + Math.sin(a) * rr), a };
    }),
  );
})();

// Each node links to the nearest node of the ring inside it.
const edges = rings.flatMap((ring, ri) =>
  ring.map((node) => {
    const inner = ri === 0 ? [{ x: C, y: C }] : rings[ri - 1];
    const target = inner.reduce((best, o) =>
      Math.hypot(o.x - node.x, o.y - node.y) < Math.hypot(best.x - node.x, best.y - node.y) ? o : best,
    );
    return { x1: target.x, y1: target.y, x2: node.x, y2: node.y, ring: ri };
  }),
);

const domains = [
  { label: "Healthcare", ring: 2, i: 2 },
  { label: "Conservation", ring: 2, i: 8 },
  { label: "Education", ring: 2, i: 13 },
  { label: "Engineers", ring: 2, i: 17, accent: true },
];

export function FutureDirection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top 70%", end: "center 45%", scrub: 0.8 },
        });
        tl.from("[data-core]", { scale: 0, transformOrigin: "50% 50%", duration: 0.2 });
        [0, 1, 2].forEach((ri) => {
          tl.from(`[data-edge="${ri}"]`, { strokeDashoffset: 1, duration: 0.3, stagger: 0.01 }, 0.15 + ri * 0.25).from(
            `[data-node="${ri}"]`,
            {
              attr: { cx: C, cy: C },
              opacity: 0,
              duration: 0.3,
              stagger: 0.008,
            },
            0.15 + ri * 0.25,
          );
        });
        tl.from("[data-domain]", { opacity: 0, y: 8, duration: 0.15, stagger: 0.04 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="future-title" className="relative overflow-hidden py-28 sm:py-40">
      <div className="container-x grid items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionLabel index="05">Looking ahead</SectionLabel>
          <h2
            id="future-title"
            className="mt-8 text-[clamp(2.25rem,4.8vw,4.25rem)] font-medium leading-[1] tracking-[-0.04em]"
          >
            Built in Africa. <span className="text-mist">Designed for real-world challenges.</span>
          </h2>
          <p className="mt-8 max-w-md text-[17px] leading-relaxed text-mist">
            I want to build intelligent systems that address challenges in healthcare, conservation, education, and
            other areas where technology can make a practical difference. In the long term, I also hope to support and
            mentor African engineers as they turn their own ideas into products.
          </p>
          <p className="label mt-8">Future goals, not finished work</p>
        </div>

        <div className="lg:col-span-7">
          <svg viewBox={`-150 0 ${SIZE + 300} ${SIZE}`} className="mx-auto block w-full max-w-[760px]" aria-hidden>
            <g fill="none" className="stroke-mist" strokeOpacity="0.08">
              {[110, 210, 320].map((r) => (
                <circle key={r} cx={C} cy={C} r={r} strokeDasharray="2 6" />
              ))}
            </g>
            <g className="stroke-signal" strokeOpacity="0.35" strokeWidth="1">
              {edges.map((e, i) => (
                <line key={i} data-edge={e.ring} {...e} pathLength={1} strokeDasharray="1" strokeDashoffset="0" />
              ))}
            </g>
            {rings.map((ring, ri) =>
              ring.map((n, i) => (
                <circle
                  key={`${ri}-${i}`}
                  data-node={ri}
                  cx={n.x}
                  cy={n.y}
                  r={ri === 2 ? 3 : 4}
                  className="fill-paper"
                  fillOpacity={0.85 - ri * 0.2}
                />
              )),
            )}
            <g data-core>
              <circle cx={C} cy={C} r="26" className="fill-ember" fillOpacity="0.12" />
              <circle cx={C} cy={C} r="8" className="fill-ember" />
            </g>
            {domains.map((d) => {
              const n = rings[d.ring][d.i];
              const right = n.x >= C;
              return (
                <g key={d.label} data-domain>
                  <circle cx={n.x} cy={n.y} r="6" fill="none" className={d.accent ? "stroke-ember" : "stroke-signal"} />
                  <text
                    x={n.x + (right ? 14 : -14)}
                    y={n.y + 4}
                    textAnchor={right ? "start" : "end"}
                    className="fill-paper"
                    fontSize="15"
                    fontFamily="var(--font-mono)"
                    letterSpacing="2"
                  >
                    {d.label.toUpperCase()}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </section>
  );
}

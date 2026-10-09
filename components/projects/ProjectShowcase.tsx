"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { motion, motionValue } from "framer-motion";
import { ArrowUpRight, Play } from "lucide-react";
import type { Project } from "@/data/projects";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn, pad2 } from "@/lib/utils";
import { ScrollReveal, SectionLabel } from "@/components/ui/ScrollReveal";
import { ProjectNavigation } from "./ProjectNavigation";
import { ProjectVisual } from "./ProjectVisual";

const EASE = [0.16, 1, 0.3, 1] as const;
/** Scroll distance per project, in viewport heights. */
const SCREENS_PER_PROJECT = 1.1;

function ProjectMeta({ project }: { project: Project }) {
  return (
    <>
      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-[13px]">
        <dt className="label leading-5">Role</dt>
        <dd className="text-paper">{project.role}</dd>
        <dt className="label leading-5">Period</dt>
        <dd className="text-mist">{project.period}</dd>
      </dl>
      <ul className="flex flex-wrap gap-1.5" aria-label="Technical focus">
        {project.focus.map((f) => (
          <li key={f} className="rounded-full border border-paper/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-mist">
            {f}
          </li>
        ))}
      </ul>
    </>
  );
}

function DetailsLink({ project, tabIndex }: { project: Project; tabIndex?: number }) {
  return (
    <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
      <Link
        href={`/projects/${project.slug}`}
        tabIndex={tabIndex}
        className="group inline-flex items-center gap-2 text-[13px] font-medium tracking-[0.06em] text-paper"
      >
        <span className="border-b border-paper/30 pb-0.5 transition-colors group-hover:border-signal group-hover:text-signal">
          VIEW PROJECT DETAILS
        </span>
        <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </Link>
      {project.films && project.films.length > 0 && (
        <Link
          href={`/projects/${project.slug}#film`}
          tabIndex={tabIndex}
          className="group inline-flex items-center gap-2 text-[13px] tracking-[0.06em] text-mist transition-colors hover:text-paper"
        >
          <span className="grid size-6 place-items-center rounded-full border border-paper/20 transition-colors group-hover:border-ember">
            <Play className="size-2.5 fill-current" />
          </span>
          WATCH THE FILM
        </Link>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Desktop: one pinned, full-screen sequence driven by a single ScrollTrigger */
/* ------------------------------------------------------------------------ */

function PinnedShowcase({ projects }: { projects: Project[] }) {
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  // One 0–1 progress value per project, created once and shared with scenes.
  const [progresses] = useState(() => projects.map(() => motionValue(0)));
  const n = projects.length;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        trigger.current = ScrollTrigger.create({
          trigger: root.current,
          start: "top top",
          end: () => `+=${window.innerHeight * SCREENS_PER_PROJECT * n}`,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const raw = self.progress * n;
            const index = Math.min(n - 1, Math.floor(raw));
            progresses.forEach((mv, i) => mv.set(i < index ? 1 : i > index ? 0 : Math.min(1, raw - index)));
            if (index !== activeRef.current) {
              activeRef.current = index;
              setActive(index);
            }
          },
        });
        return () => {
          trigger.current = null;
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const goTo = useCallback(
    (i: number) => {
      const st = trigger.current;
      if (!st) return;
      const span = (st.end - st.start) / n;
      window.scrollTo({ top: st.start + span * i + span * 0.08, behavior: "smooth" });
    },
    [n],
  );

  return (
    <div ref={root} className="relative h-[100svh] overflow-hidden">
      {/* Per-project ambient light, cross-faded. */}
      {projects.map((p, i) => (
        <motion.div
          key={p.slug}
          aria-hidden
          className={cn(
            "absolute inset-0",
            p.visual === "parkshield" && "bg-[radial-gradient(ellipse_at_70%_60%,color-mix(in_oklab,var(--ember)_7%,transparent),transparent_60%)]",
            p.visual === "axon" && "bg-[radial-gradient(ellipse_at_70%_40%,color-mix(in_oklab,var(--signal)_8%,transparent),transparent_60%)]",
            p.visual === "getech" && "bg-[radial-gradient(ellipse_at_65%_55%,color-mix(in_oklab,var(--paper)_5%,transparent),transparent_60%)]",
          )}
          animate={{ opacity: i === active ? 1 : 0 }}
          transition={{ duration: 1.2 }}
        />
      ))}

      <div className="container-x relative flex h-full flex-col pb-8 pt-24">
        <div className="grid min-h-0 flex-1 grid-cols-12 gap-10">
          {/* Copy column: panels stay mounted and cross-fade. */}
          <div className="relative col-span-4">
            {projects.map((p, i) => {
              const on = i === active;
              return (
                <motion.article
                  key={p.slug}
                  aria-hidden={!on}
                  className={cn("absolute inset-0 flex flex-col justify-center", !on && "pointer-events-none")}
                  initial={false}
                  animate={{ opacity: on ? 1 : 0, y: on ? 0 : i < active ? -32 : 32 }}
                  transition={{ duration: 0.8, ease: EASE, delay: on ? 0.15 : 0 }}
                >
                  <p className="label">
                    <span className="text-signal">{pad2(i + 1)}</span> / {pad2(n)} · {p.category}
                  </p>
                  <h3 className="mt-5 text-[clamp(2.5rem,4.2vw,4rem)] font-medium leading-[0.95] tracking-[-0.04em]">
                    {p.title}
                  </h3>
                  <p className="mt-4 text-xl leading-snug tracking-tight text-paper/90">{p.headline}</p>
                  <p className="mt-5 text-[15px] leading-relaxed text-mist">{p.description}</p>
                  <div className="mt-7 space-y-5">
                    <ProjectMeta project={p} />
                  </div>
                  <div className="mt-8">
                    <DetailsLink project={p} tabIndex={on ? undefined : -1} />
                  </div>
                </motion.article>
              );
            })}
          </div>

          {/* Stage */}
          <div className="relative col-span-8 min-h-0">
            <div className="viewfinder relative size-full overflow-hidden rounded-md border border-paper/10">
              {projects.map((p, i) => {
                const on = i === active;
                return (
                  <motion.div
                    key={p.slug}
                    aria-hidden={!on}
                    className="absolute inset-0"
                    initial={false}
                    animate={{
                      opacity: on ? 1 : 0,
                      scale: on ? 1 : 1.04,
                      clipPath: on ? "inset(0% 0% 0% 0%)" : i < active ? "inset(0% 0% 100% 0%)" : "inset(100% 0% 0% 0%)",
                    }}
                    transition={{ duration: 1, ease: EASE }}
                  >
                    <ProjectVisual project={p} progress={progresses[i]} active={on} mode="stage" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <ProjectNavigation projects={projects} active={active} progresses={progresses} onSelect={goTo} />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Phones, tablets, and reduced motion: a calm vertical sequence              */
/* ------------------------------------------------------------------------ */

function StackedShowcase({ projects }: { projects: Project[] }) {
  return (
    <div className="container-x space-y-24 pb-8 sm:space-y-32">
      {projects.map((p, i) => (
        <ScrollReveal key={p.slug} as="article" className="grid gap-8 md:grid-cols-12 md:gap-10">
          <div data-reveal className="md:col-span-7">
            <div className="viewfinder relative aspect-[4/3] overflow-hidden rounded-md border border-paper/10">
              <ProjectVisual project={p} mode="card" />
            </div>
          </div>
          <div className="space-y-5 md:col-span-5 md:self-center">
            <p data-reveal className="label">
              <span className="text-signal">{pad2(i + 1)}</span> / {pad2(projects.length)} · {p.category}
            </p>
            <h3 data-reveal className="text-4xl font-medium leading-none tracking-[-0.04em] sm:text-5xl">
              {p.title}
            </h3>
            <p data-reveal className="text-lg leading-snug text-paper/90">
              {p.headline}
            </p>
            <p data-reveal className="text-[15px] leading-relaxed text-mist">
              {p.description}
            </p>
            <div data-reveal className="space-y-5">
              <ProjectMeta project={p} />
            </div>
            <div data-reveal className="pt-2">
              <DetailsLink project={p} />
            </div>
          </div>
        </ScrollReveal>
      ))}
    </div>
  );
}

export function ProjectShowcase({ projects }: { projects: Project[] }) {
  return (
    <section id="work" aria-labelledby="work-title" className="relative">
      <div className="container-x pb-14 pt-10 lg:pb-4">
        <SectionLabel index="02">Featured work</SectionLabel>
        <div className="mt-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <h2 id="work-title" className="max-w-[16ch] text-[clamp(2.25rem,5vw,4.5rem)] font-medium leading-[1] tracking-[-0.04em]">
            Systems I&apos;m building, and learning from.
          </h2>
          <p className="max-w-sm text-[15px] leading-relaxed text-mist">
            From sensors at a park boundary to a wearable on a breadboard, each project started as a prototype and is
            still growing into a system.
          </p>
        </div>
      </div>

      {/*
        CSS decides which layout is visible, so server and client render the
        same markup. Media inside the hidden layout never loads, because it is
        only fetched when it scrolls near the viewport.
      */}
      <div className="hidden lg:motion-safe:block">
        <PinnedShowcase projects={projects} />
      </div>
      <div className="lg:motion-safe:hidden">
        <StackedShowcase projects={projects} />
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * Fades and lifts its children (or every `[data-reveal]` descendant, staggered)
 * when they enter the viewport. Content is fully visible without JavaScript
 * and with reduced motion, because GSAP only sets the hidden state itself.
 */
export function ScrollReveal({
  children,
  className,
  stagger = 0.08,
  y = 28,
  as: Tag = "div",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  stagger?: number;
  y?: number;
  as?: "div" | "section" | "article" | "header" | "footer" | "ul";
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const el = ref.current!;
        const items = el.querySelectorAll("[data-reveal]");
        const targets = items.length ? items : [el];
        gsap.from(targets, {
          opacity: 0,
          y,
          duration: 1.1,
          ease: "expo.out",
          stagger,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref as React.Ref<never>} id={id} className={cn(className)}>
      {children}
    </Tag>
  );
}

/** Headline whose words brighten one by one as the reader scrolls past. */
export function ScrubWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ref.current!.querySelectorAll("[data-word]"),
          { opacity: 0.14 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top 82%", end: "bottom 45%", scrub: 0.6 },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <h2 ref={ref} className={className} aria-label={text}>
      {text.split(" ").map((word, i) => (
        <span key={i} data-word aria-hidden className="inline-block">
          {word}
          {" "}
        </span>
      ))}
    </h2>
  );
}

export function SectionLabel({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <p className="label flex items-center gap-3">
      <span className="text-signal">{index}</span>
      <span className="h-px w-8 bg-paper/20" />
      {children}
    </p>
  );
}

"use client";

import { useRef } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { HeroScene } from "./HeroScene";

const headline = ["I build technology", "for problems", "worth solving."];

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Intro: atmosphere first, then name, headline lines, and supporting copy.
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.from("[data-hero-scene]", { opacity: 0, scale: 1.08, duration: 2.6, ease: "power2.out" })
          .from("[data-hero-label]", { opacity: 0, y: 12, duration: 1 }, 0.5)
          .from("[data-hero-line]", { yPercent: 110, duration: 1.4, stagger: 0.12 }, 0.65)
          .from("[data-hero-fade]", { opacity: 0, y: 18, duration: 1.2, stagger: 0.1 }, 1.25)
          .from("[data-hero-cue]", { opacity: 0, duration: 1 }, 1.9);

        // Exit: content lifts away and the network recedes as the page scrolls.
        gsap
          .timeline({
            scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
          })
          .to("[data-hero-content]", { yPercent: -18, opacity: 0, ease: "none" }, 0)
          .to("[data-hero-backdrop]", { opacity: 0.25, scale: 1.12, ease: "none" }, 0);
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate h-[100svh] min-h-[640px] overflow-hidden"
    >
      <div data-hero-backdrop className="absolute inset-0 -z-10">
        {/*
          The network lives in its own area on the right on large screens, so it
          never sits behind the headline. Its left edge fades out softly. On
          small screens it fills the background at reduced strength.
        */}
        <div
          data-hero-scene
          className="absolute inset-0 opacity-45 [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_75%,transparent)] lg:left-auto lg:right-0 lg:w-[54%] lg:opacity-100 lg:[mask-image:linear-gradient(to_right,transparent,black_22%,black_88%,transparent)]"
        >
          <HeroScene eventSource={root} />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-ink" />
      </div>

      <div data-hero-content className="container-x flex h-full flex-col justify-end pb-28 pt-24 md:justify-center md:pb-16">
        <div className="lg:max-w-[46%]">
          <p data-hero-label className="label flex items-center gap-3">
            <span className="size-1.5 rounded-full bg-signal shadow-[0_0_10px_var(--color-signal)]" />
            Joyeux Shalom Uwoyatoranije
          </p>

          <h1
            id="hero-title"
            className="mt-6 max-w-[14ch] text-[clamp(2.4rem,5.2vw,5rem)] font-medium leading-[0.98] tracking-[-0.04em]"
          >
            {headline.map((line, i) => (
              <span key={line} className="mask-line">
                <span data-hero-line className={i === 2 ? "block text-mist" : "block"}>
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p data-hero-fade className="mt-8 font-mono text-[11px] tracking-[0.32em] text-signal/90 sm:text-xs">
            AI · IoT · SOFTWARE · ENGINEERING
          </p>

          <p data-hero-fade className="mt-5 max-w-md text-[15px] leading-relaxed text-mist sm:text-base">
            I&apos;m an engineer and technology founder exploring how intelligent systems can solve practical problems,
            from conservation to healthcare.
          </p>

          <div data-hero-fade className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#work"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-paper pl-6 pr-5 text-[13px] font-medium tracking-[0.08em] text-ink transition-colors hover:bg-signal"
            >
              EXPLORE MY WORK
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <a
              href="#about"
              className="inline-flex h-12 items-center rounded-full border hairline px-6 text-[13px] tracking-[0.08em] text-paper transition-colors hover:border-paper/40"
            >
              ABOUT ME
            </a>
        </div>
        </div>
      </div>

      <div
        data-hero-cue
        className="pointer-events-none absolute inset-x-0 bottom-0 hidden md:block"
      >
        <div className="container-x flex items-end justify-between pb-8">
          <div className="flex items-center gap-3">
            <span className="relative block h-10 w-px overflow-hidden bg-paper/15">
              <span className="animate-scroll-cue absolute inset-0 bg-paper/80" />
            </span>
            <span className="label flex items-center gap-2">
              Scroll <ArrowDown className="size-3" />
            </span>
          </div>
          <p className="label text-right">
            Kigali, Rwanda
            <br />
            <span className="text-mist/60">−1.9441° · 30.0619°</span>
          </p>
        </div>
      </div>
    </section>
  );
}

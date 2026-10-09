"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register once, in the browser only. Every component imports GSAP from here
// so plugins are never registered twice or during server rendering.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  // Keep animations on real time even when frames are slow (busy devices,
  // background tabs). Otherwise intro text can stay hidden far too long.
  gsap.ticker.lagSmoothing(0);
}

export { gsap, ScrollTrigger, useGSAP };

"use client";

import { useEffect, useRef, useState } from "react";
import type { MotionValue } from "framer-motion";
import { ScrollTrigger } from "@/lib/gsap";
import { useNearViewport } from "@/lib/hooks";
import { cn } from "@/lib/utils";

/**
 * Scroll-controlled video.
 *
 * HOW TO ADD A VIDEO
 *   1. Put the file in /public/videos, e.g. /public/videos/my-project.mp4
 *   2. Reference it by its browser URL: src="/videos/my-project.mp4"
 *   3. For smooth scrubbing, encode with frequent keyframes and no audio:
 *        ffmpeg -i input.mp4 -an -vf "scale=960:-2,fps=24" -c:v libx264 -crf 28 \
 *               -g 8 -keyint_min 8 -sc_threshold 0 -movflags +faststart my-project.mp4
 *      Seeking jumps to the nearest keyframe and decodes forward, so a short
 *      keyframe interval (-g) is what makes scrubbing feel continuous.
 *
 * TWO WAYS TO DRIVE IT
 *   - `progress`: a 0–1 MotionValue supplied by a parent (the project
 *     showcase computes one per project from its pinned ScrollTrigger).
 *   - otherwise the component creates its own ScrollTrigger on its container,
 *     between `start` and `end`.
 *
 * Safety: nothing is fetched until the element is near the viewport; seeking
 * waits for metadata; only one seek is in flight at a time; a missing or
 * broken file shows `fallback` instead of breaking the page.
 */
export type ScrollScrubVideoProps = {
  src: string;
  poster?: string;
  /** width / height */
  aspect: number;
  progress?: MotionValue<number>;
  start?: string;
  end?: string;
  /** Rendered beneath the video, and on its own if the video cannot play. */
  fallback?: React.ReactNode;
  className?: string;
  label?: string;
};

const SEEK_EPSILON = 1 / 30;

export function ScrollScrubVideo({
  src,
  poster,
  aspect,
  progress,
  start = "top bottom",
  end = "bottom top",
  fallback,
  className,
  label,
}: ScrollScrubVideoProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const near = useNearViewport(wrap, "100% 0px");
  const [status, setStatus] = useState<"idle" | "ready" | "error">("idle");

  useEffect(() => {
    const v = video.current;
    if (!near || !v) return;

    let target = 0;
    let frame = 0;
    let duration = 0;

    const seek = () => {
      frame = 0;
      if (!duration || v.seeking) return; // `seeked` will call us again
      const t = Math.min(Math.max(target, 0), duration - 0.05);
      if (Math.abs(v.currentTime - t) > SEEK_EPSILON) v.currentTime = t;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(seek);
    };
    const setProgress = (p: number) => {
      target = p * duration;
      schedule();
    };

    const onMeta = () => {
      duration = Number.isFinite(v.duration) ? v.duration : 0;
      if (!duration) return;
      setStatus("ready");
      setProgress(progress ? progress.get() : 0);
    };
    const onError = () => setStatus("error");

    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("seeked", schedule);
    v.addEventListener("error", onError);
    // Upgrade from metadata to full buffering once we know it will be used.
    v.preload = "auto";
    if (v.readyState >= 1) onMeta();

    let unsubscribe: (() => void) | undefined;
    let trigger: ScrollTrigger | undefined;
    if (progress) {
      unsubscribe = progress.on("change", setProgress);
    } else {
      trigger = ScrollTrigger.create({
        trigger: wrap.current,
        start,
        end,
        onUpdate: (self) => setProgress(self.progress),
      });
    }

    return () => {
      cancelAnimationFrame(frame);
      unsubscribe?.();
      trigger?.kill();
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("seeked", schedule);
      v.removeEventListener("error", onError);
    };
  }, [near, progress, start, end]);

  return (
    <div
      ref={wrap}
      className={cn("relative overflow-hidden bg-coal", className)}
      style={{ aspectRatio: String(aspect) }}
    >
      {fallback && <div className="absolute inset-0">{fallback}</div>}
      {status !== "error" && (
        <video
          ref={video}
          // The src is only attached when near the viewport (lazy loading).
          src={near ? src : undefined}
          poster={poster}
          muted
          playsInline
          preload="metadata"
          disablePictureInPicture
          aria-label={label}
          className={cn(
            "absolute inset-0 size-full object-cover transition-opacity duration-700",
            status === "ready" ? "opacity-100" : "opacity-0",
          )}
        />
      )}
    </div>
  );
}

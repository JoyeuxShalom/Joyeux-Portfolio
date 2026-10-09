"use client";

import { useEffect, useRef, useState } from "react";
import { useInViewport, useNearViewport, usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

/**
 * Muted loop that plays only while visible: the lighter alternative to
 * scroll scrubbing used on phones, tablets, and in collages. With reduced
 * motion it shows the poster and native controls instead of autoplaying.
 */
export function InViewVideo({
  src,
  poster,
  aspect,
  label,
  className,
  fallback,
}: {
  src: string;
  poster?: string;
  aspect: number;
  label: string;
  className?: string;
  fallback?: React.ReactNode;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const near = useNearViewport(wrap, "300px");
  const visible = useInViewport(wrap);
  const reduced = usePrefersReducedMotion();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const v = video.current;
    if (!v || reduced) return;
    if (visible) v.play().catch(() => {});
    else v.pause();
  }, [visible, reduced, near]);

  return (
    <div
      ref={wrap}
      className={cn("relative overflow-hidden bg-coal", className)}
      style={{ aspectRatio: String(aspect) }}
    >
      {fallback && <div className="absolute inset-0">{fallback}</div>}
      {!failed && (
        <video
          ref={video}
          src={near ? src : undefined}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
          controls={reduced}
          aria-label={label}
          onError={() => setFailed(true)}
          className="absolute inset-0 size-full object-cover"
        />
      )}
    </div>
  );
}

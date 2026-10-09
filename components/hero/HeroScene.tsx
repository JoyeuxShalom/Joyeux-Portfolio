"use client";

import dynamic from "next/dynamic";
import { useRef, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { NetworkFallback } from "@/components/three/NetworkFallback";
import { useInViewport, useMediaQuery, usePrefersReducedMotion } from "@/lib/hooks";
import { hasWebGL } from "@/lib/webgl";
import { useTheme } from "@/lib/theme";

// Three.js is loaded only in the browser, after the page is interactive.
const ParticleNetwork = dynamic(() => import("@/components/three/ParticleNetwork"), {
  ssr: false,
  loading: () => null,
});

let webglSupport: boolean | undefined;
const noopSubscribe = () => () => {};
const getWebGL = () => (webglSupport ??= hasWebGL());

export function HeroScene({ eventSource }: { eventSource: React.RefObject<HTMLElement | null> }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const compact = useMediaQuery("(max-width: 767px)");
  const active = useInViewport(ref);
  const theme = useTheme();
  // null on the server and during hydration, then the real capability.
  const webgl = useSyncExternalStore(noopSubscribe, getWebGL, () => null);

  return (
    <div ref={ref} className="absolute inset-0" aria-hidden>
      {webgl === false && <NetworkFallback />}
      {webgl && (
        <ErrorBoundary fallback={<NetworkFallback />}>
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduced ? 0 : 2.4, ease: "easeOut" }}
          >
            <ParticleNetwork eventSource={eventSource} reduced={reduced} compact={compact} active={active} theme={theme} />
          </motion.div>
        </ErrorBoundary>
      )}
    </div>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import { seeded } from "@/lib/random";

/**
 * A network of connected nodes: clusters of "devices" joined by fine links,
 * with small signals travelling along the edges. It reacts to the pointer by
 * tilting and by brightening nodes near the cursor.
 *
 * Everything is built once in useMemo; per-frame work only touches uniforms,
 * the group transform, and a small buffer of signal positions.
 */

type Palette = {
  signal: THREE.Color;
  ember: THREE.Color;
  mist: THREE.Color;
  pulse: THREE.Color;
  background: string;
  lineOpacity: number;
  blending: THREE.Blending;
};

/** Colors per theme. Light mode uses deeper tones and normal blending, since additive glow vanishes on a light background. */
const PALETTES: Record<"dark" | "light", Palette> = {
  dark: {
    signal: new THREE.Color("#63E6FF"),
    ember: new THREE.Color("#FF6A35"),
    mist: new THREE.Color("#A4AAB5"),
    pulse: new THREE.Color("#E9FBFF"),
    background: "#08090B",
    lineOpacity: 0.11,
    blending: THREE.AdditiveBlending,
  },
  light: {
    signal: new THREE.Color("#0A7E9C"),
    ember: new THREE.Color("#D2491A"),
    mist: new THREE.Color("#7A818D"),
    pulse: new THREE.Color("#0A7E9C"),
    background: "#F4F5F7",
    lineOpacity: 0.2,
    blending: THREE.NormalBlending,
  },
};

type Graph = {
  points: THREE.Vector3[];
  positions: Float32Array;
  colors: Float32Array;
  sizes: Float32Array;
  lines: Float32Array;
  edges: [number, number][];
  adjacency: number[][];
};

function buildGraph(count: number, palette: Palette): Graph {
  const rand = seeded(11);
  const gauss = () => {
    const u = Math.max(rand(), 1e-6);
    const v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };

  const clusters = Array.from(
    { length: 9 },
    () => new THREE.Vector3((rand() - 0.5) * 11, (rand() - 0.5) * 9, -rand() * 6),
  );

  const points: THREE.Vector3[] = [];
  for (let i = 0; i < count; i++) {
    if (rand() < 0.72) {
      const c = clusters[i % clusters.length];
      points.push(new THREE.Vector3(c.x + gauss() * 1.4, c.y + gauss() * 1.0, c.z + gauss() * 1.1));
    } else {
      points.push(new THREE.Vector3((rand() - 0.5) * 15, (rand() - 0.5) * 12, -rand() * 8 + 1.5));
    }
  }

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const hubs = Math.max(3, Math.round(count * 0.025));

  points.forEach((p, i) => {
    positions.set([p.x, p.y, p.z], i * 3);
    const roll = rand();
    const color = i < hubs ? palette.ember : roll < 0.4 ? palette.signal : palette.mist;
    colors.set([color.r, color.g, color.b], i * 3);
    sizes[i] = i < hubs ? 2.1 : roll < 0.4 ? 1.25 : 0.85;
  });

  // Connect each node to its nearest neighbours within range.
  const maxDist = 2.7;
  const seen = new Set<string>();
  const edges: [number, number][] = [];
  const adjacency: number[][] = points.map(() => []);
  for (let i = 0; i < count; i++) {
    const near: { j: number; d: number }[] = [];
    for (let j = 0; j < count; j++) {
      if (i === j) continue;
      const d = points[i].distanceTo(points[j]);
      if (d < maxDist) near.push({ j, d });
    }
    near.sort((a, b) => a.d - b.d);
    for (const { j } of near.slice(0, 3)) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push([i, j]);
      adjacency[i].push(j);
      adjacency[j].push(i);
    }
  }

  const lines = new Float32Array(edges.length * 6);
  edges.forEach(([a, b], k) => {
    lines.set([points[a].x, points[a].y, points[a].z, points[b].x, points[b].y, points[b].z], k * 6);
  });

  return { points, positions, colors, sizes, lines, edges, adjacency };
}

const vertexShader = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  uniform float uPixelRatio;
  uniform float uTime;
  uniform vec3 uPointer;
  uniform vec3 uGlow;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float glow = smoothstep(3.4, 0.0, distance(position, uPointer));
    float twinkle = 0.86 + 0.14 * sin(uTime * 1.3 + position.x * 3.1 + position.y * 2.7);
    gl_PointSize = aSize * (1.0 + glow * 1.3) * uPixelRatio * (110.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
    float depth = smoothstep(27.0, 9.0, -mv.z);
    vColor = mix(aColor, uGlow, glow * 0.55);
    vAlpha = depth * twinkle * (0.5 + glow * 0.5);
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    float a = pow(smoothstep(0.5, 0.0, r), 2.4) * vAlpha;
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor, a);
  }
`;

function makePointMaterial(palette: Palette) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
      uPointer: { value: new THREE.Vector3(999, 999, 999) },
      uGlow: { value: palette.signal.clone() },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: palette.blending,
  });
}

type Route = { from: number[]; to: number[]; t: number[]; speed: number[] };

function Network({ count, reduced, palette }: { count: number; reduced: boolean; palette: Palette }) {
  const group = useRef<THREE.Group>(null);
  const nodes = useRef<THREE.Points>(null);
  const signalPoints = useRef<THREE.Points>(null);
  const graph = useMemo(() => buildGraph(count, palette), [count, palette]);
  const signalCount = reduced ? 0 : Math.round(count / 6);

  const nodeMaterial = useMemo(() => makePointMaterial(palette), [palette]);
  const signalMaterial = useMemo(() => makePointMaterial(palette), [palette]);
  useEffect(
    () => () => {
      nodeMaterial.dispose();
      signalMaterial.dispose();
    },
    [nodeMaterial, signalMaterial],
  );

  // Static buffers for the signals; their positions are rewritten every frame
  // through the geometry ref, never through these render-time values.
  const signalBuffers = useMemo(
    () => ({
      positions: new Float32Array(signalCount * 3),
      colors: new Float32Array(Array.from({ length: signalCount }, () => [palette.pulse.r, palette.pulse.g, palette.pulse.b]).flat()),
      sizes: new Float32Array(signalCount).fill(1.15),
    }),
    [signalCount, palette],
  );

  // Per-frame simulation state lives in refs.
  const routes = useRef<Route | null>(null);
  const time = useRef(0);
  const scratch = useRef({ v: new THREE.Vector3(), dir: new THREE.Vector3() });

  useEffect(() => {
    const rand = seeded(23);
    const edge = Array.from({ length: signalCount }, () => Math.floor(rand() * graph.edges.length));
    routes.current = {
      from: edge.map((e) => graph.edges[e]?.[0] ?? 0),
      to: edge.map((e) => graph.edges[e]?.[1] ?? 0),
      t: edge.map(() => rand()),
      speed: edge.map(() => 0.25 + rand() * 0.45),
    };
  }, [graph, signalCount]);

  useFrame((state, delta) => {
    const g = group.current;
    const nodeMat = nodes.current?.material as THREE.ShaderMaterial | undefined;
    if (!g || !nodeMat) return;
    const signalMat = signalPoints.current?.material as THREE.ShaderMaterial | undefined;
    const mats = signalMat ? [nodeMat, signalMat] : [nodeMat];
    const dt = Math.min(delta, 0.05);
    const ratio = state.gl.getPixelRatio();
    for (const m of mats) m.uniforms.uPixelRatio.value = ratio;
    if (reduced) return;

    time.current += dt;
    for (const m of mats) m.uniforms.uTime.value = time.current;
    const { pointer, camera } = state;

    // Gentle tilt toward the pointer plus a slow, bounded drift.
    const drift = Math.sin(time.current * 0.06) * 0.12;
    g.rotation.y += (pointer.x * 0.2 + drift - g.rotation.y) * 0.035;
    g.rotation.x += (-pointer.y * 0.1 - g.rotation.x) * 0.035;

    // Project the pointer onto the z=0 plane, then into the group's local space.
    if (pointer.x !== 0 || pointer.y !== 0) {
      const { v, dir } = scratch.current;
      v.set(pointer.x, pointer.y, 0.5).unproject(camera);
      dir.copy(v).sub(camera.position).normalize();
      const dist = -camera.position.z / dir.z;
      v.copy(camera.position).addScaledVector(dir, dist);
      g.worldToLocal(v);
      for (const m of mats) (m.uniforms.uPointer.value as THREE.Vector3).lerp(v, 0.12);
    }

    // Move signals along edges; at the end of an edge, hop to a neighbour.
    const r = routes.current;
    const attr = signalPoints.current?.geometry.getAttribute("position") as THREE.BufferAttribute | undefined;
    if (!r || !attr) return;
    const out = attr.array as Float32Array;
    const pts = graph.points;
    for (let i = 0; i < r.t.length; i++) {
      r.t[i] += dt * r.speed[i];
      if (r.t[i] >= 1) {
        const at = r.to[i];
        const next = graph.adjacency[at];
        r.from[i] = at;
        r.to[i] = next.length ? next[Math.floor(Math.random() * next.length)] : at;
        r.t[i] = 0;
      }
      const a = pts[r.from[i]];
      const b = pts[r.to[i]];
      const t = r.t[i];
      out[i * 3] = a.x + (b.x - a.x) * t;
      out[i * 3 + 1] = a.y + (b.y - a.y) * t;
      out[i * 3 + 2] = a.z + (b.z - a.z) * t;
    }
    attr.needsUpdate = true;
  });

  return (
    <group ref={group}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[graph.lines, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color={palette.signal}
          transparent
          opacity={palette.lineOpacity}
          depthWrite={false}
          blending={palette.blending}
        />
      </lineSegments>

      <points ref={nodes} material={nodeMaterial}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[graph.positions, 3]} />
          <bufferAttribute attach="attributes-aColor" args={[graph.colors, 3]} />
          <bufferAttribute attach="attributes-aSize" args={[graph.sizes, 1]} />
        </bufferGeometry>
      </points>

      {signalCount > 0 && (
        <points ref={signalPoints} material={signalMaterial} frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[signalBuffers.positions, 3]} />
            <bufferAttribute attach="attributes-aColor" args={[signalBuffers.colors, 3]} />
            <bufferAttribute attach="attributes-aSize" args={[signalBuffers.sizes, 1]} />
          </bufferGeometry>
        </points>
      )}
    </group>
  );
}

export type ParticleNetworkProps = {
  /** Element that receives pointer events (the hero), since text overlays the canvas. */
  eventSource: React.RefObject<HTMLElement | null>;
  reduced: boolean;
  compact: boolean;
  /** When false the render loop stops (hero offscreen). */
  active: boolean;
  theme: "dark" | "light";
};

export default function ParticleNetwork({ eventSource, reduced, compact, active, theme }: ParticleNetworkProps) {
  const palette = PALETTES[theme];
  const [maxDpr, setMaxDpr] = useState(compact ? 1.5 : 1.75);
  return (
    <Canvas
      aria-hidden
      dpr={[1, maxDpr]}
      camera={{ position: [0, 0, 13], fov: 50, near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={active && !reduced ? "always" : "demand"}
      eventSource={eventSource as React.RefObject<HTMLElement>}
      eventPrefix="client"
      style={{ position: "absolute", inset: 0 }}
    >
      <fog attach="fog" args={[palette.background, 12, 27]} />
      <PerformanceMonitor onDecline={() => setMaxDpr(1)} />
      <Network count={compact ? 70 : 150} reduced={reduced} palette={palette} />
    </Canvas>
  );
}

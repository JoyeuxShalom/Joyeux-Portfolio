import { r2, seeded } from "@/lib/random";

/**
 * Static SVG version of the hero network for browsers without WebGL.
 * Deterministic, so it renders identically on server and client.
 */
const W = 1600;
const H = 900;

const graph = (() => {
  const rand = seeded(5);
  const nodes = Array.from({ length: 90 }, (_, i) => ({
    x: r2(W * 0.35 + rand() * W * 0.65),
    y: r2(rand() * H),
    r: i < 3 ? 2.6 : r2(0.8 + rand() * 1.2),
    hub: i < 3,
  }));
  const edges: [number, number][] = [];
  nodes.forEach((a, i) => {
    nodes
      .map((b, j) => ({ j, d: Math.hypot(a.x - b.x, a.y - b.y) }))
      .filter(({ j, d }) => j > i && d < 150)
      .slice(0, 3)
      .forEach(({ j }) => edges.push([i, j]));
  });
  return { nodes, edges };
})();

export function NetworkFallback() {
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 size-full"
    >
      <g className="stroke-signal" strokeOpacity="0.12" strokeWidth="0.7">
        {graph.edges.map(([a, b]) => (
          <line
            key={`${a}-${b}`}
            x1={graph.nodes[a].x}
            y1={graph.nodes[a].y}
            x2={graph.nodes[b].x}
            y2={graph.nodes[b].y}
          />
        ))}
      </g>
      {graph.nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={n.r} className={n.hub ? "fill-ember" : "fill-signal"} fillOpacity={n.hub ? 0.9 : 0.5} />
      ))}
    </svg>
  );
}

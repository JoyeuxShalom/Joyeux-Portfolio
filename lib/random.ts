/**
 * Small seeded PRNG (mulberry32). Visuals that are rendered on the server use
 * this instead of Math.random so server and client markup match exactly.
 */
export function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Round to keep SVG attribute strings short and identical across runtimes. */
export const r2 = (n: number) => Math.round(n * 100) / 100;

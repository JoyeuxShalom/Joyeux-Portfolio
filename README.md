# Joyeux Shalom Uwoyatoranije — Portfolio

A cinematic portfolio built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4,
GSAP + ScrollTrigger, Framer Motion, and React Three Fiber.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
npm run lint
npm run typecheck
```

## Where things live

| What | Where |
| --- | --- |
| Contact email, LinkedIn, GitHub, CV path, domain | `config/site.ts` |
| Projects (showcase + `/projects/[slug]` pages) | `data/projects.ts` |
| Leadership entries and the photo mosaic | `data/leadership.ts` |
| Bio, capabilities, experience, recognition | `data/about.ts` |
| Videos | `public/videos/` → referenced as `/videos/name.mp4` |
| Video poster frames | `public/images/posters/` |
| Photos (portrait, events, projects) | `public/images/` |
| Downloadable CV | `public/cv/Joyeux-Shalom-Uwoyatoranije-CV.pdf` |

Any link left as `""` in `config/site.ts` is hidden, so the site never shows a dead button.
Add your LinkedIn and GitHub URLs there to make those buttons appear.

## Add a project

1. Add an object to `projects` in `data/projects.ts` with a unique `slug`.
2. Choose a scene with `visual` (`"parkshield" | "axon" | "getech"`), or build a new one in
   `components/projects/visuals/` and register it in `components/projects/ProjectVisual.tsx`.
3. Optional: add a scroll-scrubbed clip via `scrubVideo`, films via `films`, photos via `gallery`,
   a public repository via `repo`, and verified numbers via `metrics`.

The homepage showcase, its navigation, and the detail page are all generated from that list.

## Add or replace a video

Put the file in `public/videos/` and use its browser URL (`/videos/my-clip.mp4`, not `/public/...`).
For smooth scroll-scrubbing, encode it with frequent keyframes and no audio:

```bash
ffmpeg -i input.mp4 -an -vf "scale=960:-2,fps=24" -c:v libx264 -crf 28 -g 8 -keyint_min 8 -sc_threshold 0 -movflags +faststart my-clip.mp4
```

If a video file is missing or fails to load, the scene keeps its designed poster/composition and
the page keeps working (`components/media/ScrollScrubVideo.tsx`).

## How the experience adapts

- **Desktop (≥1024px), motion allowed:** pinned, scroll-driven project showcase with video scrubbing.
- **Phones, tablets, or `prefers-reduced-motion`:** a stacked layout with muted loops that play only
  while visible (or posters with controls when motion is reduced).
- **No WebGL:** the hero shows a static SVG network instead of the 3D scene.
- The 3D scene, videos, and Three.js bundle load lazily and pause when offscreen.

## Media in this repo

- `parkshield.mp4`: ParkShield prototype hardware clip (scrub-ready encode).
- `axon.mp4`: first 30s of the Axon demo, cropped to the hardware bench (scrub-ready encode).
- `axon-demo-full.mp4`, `parkshield-pitch.mp4`: full-length films on the project pages.
- `bnr-talk.mp4`: short loop in the AIESEC entry.

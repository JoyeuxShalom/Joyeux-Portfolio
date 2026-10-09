"use client";

import type { Project } from "@/data/projects";
import { ParkShieldVisual } from "./visuals/ParkShieldVisual";
import { AxonVisual } from "./visuals/AxonVisual";
import { GetechVisual } from "./visuals/GetechVisual";
import type { VisualProps } from "./visuals/shared";

/** Register new project scenes here, keyed by `project.visual`. */
const scenes: Record<Project["visual"], React.ComponentType<VisualProps>> = {
  parkshield: ParkShieldVisual,
  axon: AxonVisual,
  getech: GetechVisual,
};

export function ProjectVisual({ project, ...props }: VisualProps & { project: Project }) {
  const Scene = scenes[project.visual];
  return <Scene {...props} />;
}

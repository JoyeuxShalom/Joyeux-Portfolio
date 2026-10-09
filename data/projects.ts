/**
 * Project content. The homepage showcase and the /projects/[slug] pages are
 * generated from this list, so adding a project means adding one object here.
 *
 * To add a project:
 *   1. Copy an existing entry and give it a unique `slug`.
 *   2. Pick a `visual`: "parkshield" | "axon" | "getech" reuse an existing scene,
 *      or add a new scene in components/projects/visuals and register it in
 *      components/projects/ProjectVisual.tsx.
 *   3. (Optional) Drop a clip into /public/videos and set `scrubVideo`.
 *
 * Only list facts you can stand behind. `metrics` stays empty until a number
 * is verified, and empty sections are not rendered.
 */

export type Media = {
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
};

export type Film = {
  src: string;
  poster: string;
  title: string;
  /** width / height of the video frame */
  aspect: number;
};

export type SystemStep = { label: string; detail: string };

export type Project = {
  slug: string;
  title: string;
  category: string;
  headline: string;
  description: string;
  role: string;
  period: string;
  context: string;
  focus: string[];
  stack: string[];
  /** Which art-directed scene renders this project. */
  visual: "parkshield" | "axon" | "getech";
  /**
   * Scroll-scrubbed clip for the homepage showcase.
   * Use the browser URL (/videos/...) not the file path (/public/videos/...).
   * If the file is missing the scene falls back to its designed composition.
   */
  scrubVideo?: { src: string; poster: string; aspect: number; label: string };
  system: { title: string; steps: SystemStep[] };
  overview: string[];
  contributions: string[];
  status: string;
  team?: string;
  nextSteps?: string[];
  films?: Film[];
  gallery?: Media[];
  /** Public repository URL, shown on the project page and in Contact when set. */
  repo?: string;
  /** Verified figures only. Rendered only when non-empty. */
  metrics?: { label: string; value: string }[];
};

export const projects: Project[] = [
  {
    slug: "parkshield",
    title: "ParkShield",
    category: "AI · IoT · Conservation Technology",
    headline: "Intelligence at the boundary between people and wildlife.",
    description:
      "ParkShield is an AI and IoT concept developed through the Carnegie Mellon University Africa Bridge Program to address human-wildlife conflict. The project explores how connected sensing, data pipelines, and predictive intelligence can help communities and conservation teams respond to wildlife risks.",
    role: "Engineering Team Lead",
    period: "Sept 2025 — Present",
    context: "Carnegie Mellon University Africa · Bridge Program 2025",
    focus: ["AI", "IoT", "Data pipelines", "Predictive systems", "Connected hardware"],
    stack: ["Microcontrollers", "Camera modules", "Edge Impulse", "Image classification", "Mobile alerts"],
    visual: "parkshield",
    scrubVideo: {
      src: "/videos/parkshield.mp4",
      poster: "/images/posters/parkshield.jpg",
      aspect: 540 / 1168,
      label: "Prototype node",
    },
    system: {
      title: "From detection to response",
      steps: [
        { label: "Detect", detail: "Sensing nodes register movement near the park boundary." },
        { label: "Transmit", detail: "Detections travel from the field node into the data pipeline." },
        { label: "Classify", detail: "A model estimates what kind of animal was detected." },
        { label: "Alert", detail: "Rangers receive an instant mobile notification." },
        { label: "Deter", detail: "Active deterrence can be triggered at the boundary." },
        { label: "Respond", detail: "Rangers respond to the incident with better context." },
      ],
    },
    overview: [
      "Communities living beside protected areas deal with crop raiding, damaged homes, and dangerous encounters at the park edge. Fences help, but they are often incomplete or damaged, and animals still get through.",
      "ParkShield explores a complementary layer: connected sensing at the boundary, a pipeline that classifies what was detected, and alerts that reach rangers early enough to act.",
    ],
    contributions: [
      "Lead the engineering team across the system design, from field sensing to ranger alerts.",
      "Work on the IoT–AI data pipeline and on training image models for wildlife detection.",
      "Prototyped embedded vision on microcontroller hardware during the Bridge Program.",
      "Presented the concept with a call for pilot deployment, co-design with rangers, and research partnerships.",
    ],
    status:
      "Concept and prototype stage. The team continues to develop ParkShield beyond the Bridge Program. No field deployment results are claimed here.",
    films: [
      {
        src: "/videos/parkshield-pitch.mp4",
        poster: "/images/posters/parkshield-pitch.jpg",
        title: "Presenting ParkShield at CMU Africa, Bridge Program 2025",
        aspect: 480 / 848,
      },
    ],
    gallery: [
      {
        src: "/images/parkshield-edge-impulse.jpg",
        alt: "Laptop running Edge Impulse feature generation beside a microcontroller board with a camera module",
        caption: "Embedded vision prototyping with Edge Impulse",
        width: 1500,
        height: 2000,
      },
      {
        src: "/images/cmu-africa-seal.jpg",
        alt: "Joyeux giving two thumbs up beneath the Carnegie Mellon University seal",
        caption: "CMU Africa, Kigali",
        width: 1500,
        height: 2000,
      },
    ],
    metrics: [],
  },
  {
    slug: "axon",
    title: "Axon",
    category: "IoT · Machine Learning · Healthcare Exploration",
    headline: "Exploring earlier signals through intelligent systems.",
    description:
      "Axon is an early project exploring how an IoT wearable could collect physiological data and use machine learning to investigate patterns associated with stroke risk. It brings together connected sensing, data processing, and predictive modeling.",
    role: "Project Engineer",
    period: "Jan 2026 — Present",
    context: "Final-year project · University of Rwanda",
    focus: ["IoT", "Physiological data", "Random Forest classification", "Predictive modeling"],
    stack: ["ESP32", "MAX30102 (PPG)", "MPU6050 (IMU)", "Bluetooth", "Random Forest", "Mobile app", "Web dashboard"],
    visual: "axon",
    scrubVideo: {
      src: "/videos/axon.mp4",
      poster: "/images/posters/axon.jpg",
      aspect: 16 / 9,
      label: "Live prototype demo",
    },
    system: {
      title: "A connected loop",
      steps: [
        { label: "Sense", detail: "ESP32 wearable reads pulse, oxygen saturation, and motion." },
        { label: "Stream", detail: "Readings stream over Bluetooth to the patient's mobile app." },
        { label: "Model", detail: "A Random Forest model flags patterns associated with stroke risk." },
        { label: "Inform", detail: "Patient app and clinician dashboard surface trends and alerts." },
      ],
    },
    overview: [
      "Hypertension, a major stroke risk factor, often goes unnoticed. Periodic hospital visits capture a snapshot and can miss what happens in between.",
      "Axon explores a connected alternative: a low-power wearable that streams physiological readings to a mobile app, a Random Forest model that looks for risk patterns, and dashboards that keep the patient and the clinician in the same loop.",
    ],
    contributions: [
      "Engineered the wearable prototype around an ESP32 with MAX30102 and MPU6050 sensors.",
      "Set up live data streaming from the hardware to the mobile app.",
      "Trained and deployed a Random Forest classifier on secondary datasets, using published medical thresholds as reference.",
      "Worked with the team on the patient app and the clinician web dashboard.",
    ],
    status:
      "Academic research prototype. Axon is not a medical device, makes no diagnostic claims, and has not been clinically validated.",
    team: "Built with Sylvie Unsabire and Olivier Hirwa Nshuti · Supervised by Mr. Dominique Harerimana",
    nextSteps: [
      "Miniaturization: a custom PCB and a TPU wristband",
      "Integration with hospital information systems (HMIS APIs)",
      "Long-term, on-device AI testing",
    ],
    films: [
      {
        src: "/videos/axon-demo-full.mp4",
        poster: "/images/posters/axon-demo-full.jpg",
        title: "Full prototype demo: hardware, patient app, and clinician dashboard",
        aspect: 16 / 9,
      },
    ],
    gallery: [
      {
        src: "/images/axon-final-report.jpg",
        alt: "Joyeux smiling on campus holding the bound Axon final-year project report",
        caption: "Final-year project report, University of Rwanda",
        width: 1600,
        height: 2000,
      },
    ],
    metrics: [],
  },
  {
    slug: "getech-solutions",
    title: "Getech Solutions",
    category: "Software Engineering · Entrepreneurship",
    headline: "Turning ideas into useful software.",
    description:
      "Getech Solutions is the technology company I co-founded to build software solutions for organizations. It is where I continue to develop my experience in engineering, product thinking, and translating real needs into practical digital tools.",
    role: "Co-Founder & Technical Lead",
    period: "July 2024 — Present",
    context: "Co-founded technology company · Kigali",
    focus: ["Product engineering", "Web platforms", "Mobile apps", "APIs & architecture"],
    stack: ["Web applications", "Mobile applications", "APIs", "Cloud infrastructure"],
    visual: "getech",
    system: {
      title: "How an idea becomes a product",
      steps: [
        { label: "Listen", detail: "Understand what the organization actually needs." },
        { label: "Design", detail: "Shape the product and the architecture beneath it." },
        { label: "Build", detail: "Ship web, mobile, and API layers that work together." },
        { label: "Support", detail: "Keep the system reliable as people start depending on it." },
      ],
    },
    overview: [
      "Getech Solutions builds custom digital platforms for organizations: web and mobile products that help teams reach and serve their communities.",
      "For me it is a practical engineering school: scoping real needs, choosing architectures that can grow, and owning a product after launch day.",
    ],
    contributions: [
      "Lead end-to-end product engineering for custom digital platforms.",
      "Architect the web and mobile infrastructure behind partner products.",
      "Translate organizational needs into scoped, buildable software.",
    ],
    status: "Active. Client work and client data are intentionally not shown here.",
    metrics: [],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

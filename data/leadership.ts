import type { Media } from "./projects";

/**
 * Leadership and community work.
 *
 * `layout` controls how the entry is presented:
 *   "feature" – a full row with a photo collage
 *   "compact" – a text-only card; consecutive compact entries sit side by side
 *
 * `stats` is intentionally empty. Add a figure only once you have verified it,
 * e.g. { value: "4,000+", label: "Fellows selected" }.
 */

export type LeadershipEntry = {
  id: string;
  org: string;
  role: string;
  period: string;
  summary: string;
  note?: string;
  layout: "feature" | "compact";
  media?: (Media & { kind?: "image" })[];
  /** Short muted loop shown inside the collage. */
  loop?: { src: string; poster: string; caption: string; width: number; height: number };
  stats?: { value: string; label: string }[];
};

export const leadership: LeadershipEntry[] = [
  {
    id: "unleash",
    org: "UNLEASH",
    role: "Global Facilitator",
    period: "Oct 2024 — Present",
    summary:
      "I have contributed to youth innovation experiences that help teams explore practical solutions to real-world challenges and the UN Sustainable Development Goals, including as a global facilitator at UNLEASH Hack Global.",
    note: "1st Prize, UNLEASH Hack Rwanda · 2024",
    layout: "feature",
    media: [
      {
        src: "/images/unleash-global.jpg",
        alt: "Joyeux standing with four fellow UNLEASH facilitators and organizers in a brick-floored hall",
        caption: "Global facilitator, UNLEASH Hack Global",
        width: 1500,
        height: 2000,
      },
      {
        src: "/images/unleash-facilitators.jpg",
        alt: "Joyeux with two members of the organizing team, wearing a facilitator badge at UNLEASH Hack Kigali",
        caption: "Facilitating at UNLEASH Hack Kigali",
        width: 1200,
        height: 1600,
      },
      {
        src: "/images/unleash-sdg-wall.jpg",
        alt: "Joyeux laughing with a fellow participant in front of a wall of UN Sustainable Development Goal tiles",
        caption: "In front of the SDG wall",
        width: 960,
        height: 1280,
      },
    ],
    stats: [],
  },
  {
    id: "mcn",
    org: "Millennium Campus Network",
    role: "Team Lead Africa, Global Admission Committee · Campus Director, Millennium Fellowship",
    period: "Aug 2024 — Sept 2025",
    summary:
      "I help coordinate African reviewers and support quality and consistency in the evaluation process. On campus, I co-directed our Millennium Fellowship cohort, guiding fellows from their first session to the close of the program.",
    layout: "feature",
    media: [
      {
        src: "/images/mcn-campus-directors.jpg",
        alt: "Joyeux and his co-campus director at UniPod holding a flip chart of the cohort's agreed values",
        caption: "With my co-campus director at UniPod",
        width: 800,
        height: 1066,
      },
      {
        src: "/images/mcn-fellowship-cohort.jpg",
        alt: "Millennium Fellows celebrating with raised hands among boxes printed with the UN Sustainable Development Goals",
        caption: "Closing the Millennium Fellowship",
        width: 1280,
        height: 960,
      },
    ],
    stats: [],
  },
  {
    id: "hult",
    org: "Hult Prize",
    role: "Campus Director",
    period: "Nov 2024 — Aug 2025",
    summary:
      "I led campus-level entrepreneurship programming, helping students explore ideas, organize teams, and engage with the innovation ecosystem.",
    layout: "feature",
    media: [
      {
        src: "/images/hult-prize.jpg",
        alt: "Joyeux in a Hult Prize shirt and badge beside a fellow organizer in front of the OnCampus Program backdrop",
        caption: "Hult Prize OnCampus Program",
        width: 1280,
        height: 853,
      },
    ],
    stats: [],
  },
  {
    id: "aiesec",
    org: "AIESEC in Rwanda",
    role: "Projects & Events Manager",
    period: "July 2025 — June 2026",
    summary:
      "I organized national events and workshops for young people across Rwanda and worked with partners, including the National Bank of Rwanda, to make them possible.",
    note: "Outstanding Contribution Award · AIESEC in Rwanda",
    layout: "feature",
    media: [
      {
        src: "/images/global-money-week.jpg",
        alt: "Joyeux smiling through a Global Money Week 2026 photo frame branded with AIESEC and the Rwanda Stock Exchange",
        caption: "Global Money Week 2026",
        width: 1500,
        height: 2000,
      },
      {
        src: "/images/aiesec-award.jpg",
        alt: "AIESEC in Rwanda Outstanding Contribution Award card featuring Joyeux's portrait",
        caption: "Outstanding Contribution Award",
        width: 864,
        height: 1080,
      },
    ],
    loop: {
      src: "/videos/bnr-talk.mp4",
      poster: "/images/posters/bnr-talk.jpg",
      caption: "Speaking at the National Bank of Rwanda",
      width: 360,
      height: 640,
    },
    stats: [],
  },
  {
    id: "upg",
    org: "United People Global",
    role: "Sustainability Leader",
    period: "Mar 2024 — Nov 2024",
    summary:
      "I ran digital literacy sessions that introduced young people in underserved communities to foundational tech skills.",
    layout: "feature",
    media: [
      {
        src: "/images/upg-session.jpg",
        alt: "Joyeux presenting an Introduction to United People Global slide to a seated audience at night",
        caption: "Introducing United People Global to new members",
        width: 2000,
        height: 1500,
      },
    ],
    stats: [],
  },
  {
    id: "community",
    org: "Community & Church Technology",
    role: "Volunteer technologist",
    period: "Ongoing",
    summary:
      "I use my IT skills to support community and church initiatives, from digital platforms to the media systems that help people gather, listen, and stay connected. It is where I am reminded that technology is only useful when it serves people.",
    layout: "feature",
    media: [
      {
        src: "/images/community-speaking.jpg",
        alt: "Joyeux speaking into a microphone at a podium during a community gathering",
        caption: "Serving at a community gathering",
        width: 717,
        height: 1080,
      },
    ],
    stats: [],
  },
];

/** Rooms I have learned in: events and programs, shown as a photo mosaic. */
export const moments: (Media & { place: string; span: "tall" | "wide" })[] = [
  {
    src: "/images/cmu-africa-hallway.jpg",
    alt: "Joyeux standing with a faculty member in a CMU Africa hallway",
    caption: "Bridge Program",
    place: "Carnegie Mellon University Africa",
    width: 810,
    height: 1080,
    span: "tall",
  },
  {
    src: "/images/ai-summit-conversation.jpg",
    alt: "Black and white photo of Joyeux in conversation with another participant at a summit",
    caption: "In conversation",
    place: "Global AI Summit on Africa · Kigali, 2025",
    width: 2000,
    height: 1333,
    span: "wide",
  },
  {
    src: "/images/icca-launch.jpg",
    alt: "Joyeux on stage holding a book titled Breaking into Cybersecurity at the ICCA official launch",
    caption: "Official launch",
    place: "International Cybersecurity Community for Africa · 2026",
    width: 1500,
    height: 2000,
    span: "tall",
  },
  {
    src: "/images/cmu-africa-session.jpg",
    alt: "Joyeux smiling in the audience during a session at CMU Africa",
    caption: "Learning in the room",
    place: "Carnegie Mellon University Africa",
    width: 2000,
    height: 1333,
    span: "wide",
  },
];

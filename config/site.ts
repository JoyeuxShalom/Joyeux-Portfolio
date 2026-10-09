/**
 * Site-wide settings. Edit this file to change contact details and links.
 *
 * Any link left as an empty string is hidden on the site, so nothing points
 * to a placeholder. Fill a value in and the matching button appears.
 */
export const site = {
  name: "Joyeux Shalom Uwoyatoranije",
  shortName: "Joyeux Shalom",
  focus: "AI · IoT · Software Engineering",
  description:
    "Joyeux Shalom Uwoyatoranije is an AI and IoT engineer and technology founder in Kigali, Rwanda, building intelligent systems for practical problems, from conservation to healthcare.",
  location: "Kigali, Rwanda",

  /** Your deployed domain, e.g. "https://joyeuxshalom.com". Used for social previews. */
  url: "https://joyeux-shalom.netlify.app",

  email: "shalomjoyeux520@gmail.com",

  links: {
    /** e.g. "https://www.linkedin.com/in/your-handle" */
    linkedin: "",
    /** e.g. "https://github.com/your-handle" */
    github: "",
  },

  /** Path to the downloadable CV inside /public. Set to "" to hide the button. */
  cv: "/cv/Joyeux-Shalom-Uwoyatoranije-CV.pdf",
} as const;

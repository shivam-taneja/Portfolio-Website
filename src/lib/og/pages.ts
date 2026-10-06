import type { OgCardContent } from "@/types/og.types";

export const pageOgCards = {
  contact: {
    path: "~/contact",
    title: "Contact",
    description: "open to new projects, ideas, and ways to work together.",
    tags: ["Email", "Projects", "Ideas"],
    titleSize: 76,
  },
  socials: {
    path: "~/socials",
    title: "Socials",
    description: "every profile in one place — follow, subscribe, say hi.",
    tags: ["LinkedIn", "GitHub", "YouTube", "Bluesky", "Threads"],
    titleSize: 76,
  },
  experience: {
    path: "~/experience",
    title: "Experience",
    description: "KPMG, NTT Data, and the roles along the way.",
    tags: ["KPMG", "NTT Data", "Consulting"],
    titleSize: 62,
  },
  certificates: {
    path: "~/certificates",
    title: "Certificates",
    description: "courses and credentials, from Azure to generative AI.",
    tags: ["Azure", "GenAI", "MongoDB"],
    titleSize: 62,
  },
  mentorship: {
    path: "~/mentorship",
    title: "Mentorship",
    description: "mentoring and judging hackathons and tech events.",
    tags: ["Mentor", "Judge", "Hackathons"],
    titleSize: 62,
  },
  stats: {
    path: "~/stats",
    title: "Stats",
    description: "visits, project activity, and how people find the site.",
    tags: ["Visits", "Traffic", "Projects"],
    titleSize: 76,
  },
} satisfies Record<string, OgCardContent>;

export type PageOgKey = keyof typeof pageOgCards;

const pageOgAliases: Record<string, PageOgKey> = {
  social: "socials",
};

export function getPageOg(page: string): OgCardContent | undefined {
  const key = pageOgAliases[page] ?? page;

  if (key in pageOgCards) {
    return pageOgCards[key as PageOgKey];
  }

  return undefined;
}

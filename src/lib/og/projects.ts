import { sideProjects } from "@/lib/constants/side-projects";
import type { ProjectOg } from "@/types/og.types";

export const projectOgAccents = [
  "#8b5cf6",
  "#38bdf8",
  "#34d399",
  "#fbbf24",
  "#fb7185",
  "#f97316",
  "#2dd4bf",
  "#a78bfa",
  "#4ade80",
  "#f472b6",
] as const;

const otherProjectOgCards = {
  "chat-bot": {
    name: "Ask Shivam",
    description:
      "an AI chatbot on this site that answers questions about my work.",
    tags: ["Next.js", "React", "MongoDB", "Groq AI"],
  },
} satisfies Record<string, ProjectOg>;

export function sideProjectSlug(descLink: string) {
  return descLink.split("/").filter(Boolean)[1];
}

export function projectOgTitleSize(name: string) {
  if (name.length > 32) return 48;
  if (name.length > 18) return 62;
  return 76;
}

export function projectOgPath(name: string) {
  return `~/projects/"${name}"`;
}

export function getProjectOg(slug: string): ProjectOg | undefined {
  if (slug in otherProjectOgCards) {
    return otherProjectOgCards[slug as keyof typeof otherProjectOgCards];
  }

  const project = sideProjects.find(
    (item) => sideProjectSlug(item.descLink) === slug,
  );

  if (!project) return undefined;

  return {
    name: project.og?.name ?? project.title,
    description: project.og?.description ?? project.desc,
    tags: project.tags,
    accent: project.og?.accent,
  };
}

export function accentForProject(slug: string, accent?: string) {
  if (accent) return accent;

  let hash = 0;
  for (const char of slug) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }

  return projectOgAccents[hash % projectOgAccents.length];
}

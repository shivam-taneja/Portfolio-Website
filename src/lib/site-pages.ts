import { MetadataRoute } from "next";

import { blogPosts } from "@/lib/constants/blog";
import { sideProjects } from "@/lib/constants/side-projects";

export const SITE_ORIGIN = "https://www.shivamtaneja.com";

export type SitePage = {
  path: string;
  title: string;
  priority: number;
  changeFrequency: NonNullable<
    MetadataRoute.Sitemap[number]["changeFrequency"]
  >;
  lastModified?: Date | string;
};

/** Chatbot project lives outside sideProjects (rendered separately on the site). */
const CHATBOT_PROJECT: SitePage = {
  path: "/projects/chat-bot",
  title: "Ask Shivam",
  priority: 0.6,
  changeFrequency: "yearly",
};

export const mainSitePages: SitePage[] = [
  { path: "/", title: "Home", priority: 1.0, changeFrequency: "monthly" },
  {
    path: "/contact",
    title: "Contact",
    priority: 0.8,
    changeFrequency: "yearly",
  },
  {
    path: "/socials",
    title: "Socials",
    priority: 0.6,
    changeFrequency: "yearly",
  },
  {
    path: "/experience",
    title: "Experience",
    priority: 0.9,
    changeFrequency: "monthly",
  },
  {
    path: "/projects",
    title: "Projects Overview",
    priority: 0.9,
    changeFrequency: "monthly",
  },
  {
    path: "/certificates",
    title: "Certificates",
    priority: 0.7,
    changeFrequency: "yearly",
  },
  {
    path: "/mentorship",
    title: "Mentorship",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  { path: "/stats", title: "Stats", priority: 0.5, changeFrequency: "daily" },
  { path: "/blog", title: "Writing", priority: 0.8, changeFrequency: "weekly" },
];

export function getProjectSitePages(): SitePage[] {
  const fromSideProjects: SitePage[] = sideProjects.map((project) => {
    const path = project.descLink.replace(/\/$/, "") || project.descLink;
    return {
      path,
      title: project.title,
      priority: 0.6,
      changeFrequency: "yearly" as const,
    };
  });

  return [CHATBOT_PROJECT, ...fromSideProjects].sort((a, b) =>
    a.path.localeCompare(b.path),
  );
}

export function getBlogSitePages(): SitePage[] {
  return blogPosts.map((post) => ({
    path: post.href,
    title: post.title,
    priority: 0.7,
    changeFrequency: "monthly" as const,
    lastModified: new Date(post.datePublished),
  }));
}

/** Single source of truth for sitemap + llms.txt URL coverage. */
export function getAllSitePages(): SitePage[] {
  return [...mainSitePages, ...getBlogSitePages(), ...getProjectSitePages()];
}

export function getSitemapEntries(): MetadataRoute.Sitemap {
  return getAllSitePages().map((page) => ({
    url: `${SITE_ORIGIN}${page.path === "/" ? "" : page.path}`,
    lastModified: page.lastModified ?? new Date(),
    priority: page.priority,
    changeFrequency: page.changeFrequency,
  }));
}

export function absoluteUrl(path: string): string {
  if (path === "/") return `${SITE_ORIGIN}/`;
  return `${SITE_ORIGIN}${path}`;
}

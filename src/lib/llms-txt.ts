import { blogPosts } from "@/lib/constants/blog";
import { socials } from "@/lib/constants/socials";
import {
  absoluteUrl,
  getBlogSitePages,
  getProjectSitePages,
  mainSitePages,
} from "@/lib/site-pages";

function socialProfileUrl(social: (typeof socials)[number]): string {
  return social.profileUrl ?? social.link;
}

/** Build /llms.txt from the same page list as the sitemap. */
export function buildLlmsTxt(): string {
  const mainLinks = mainSitePages
    .map((page) => `- [${page.title}](${absoluteUrl(page.path)})`)
    .join("\n");

  const projectLinks = getProjectSitePages()
    .map(
      (page) =>
        `- **${page.title}**: [${absoluteUrl(page.path)}](${absoluteUrl(page.path)})`,
    )
    .join("\n");

  const blogLinks = [
    `- [Writing / Blog](${absoluteUrl("/blog")})`,
    ...getBlogSitePages().map((page) => {
      const post = blogPosts.find((p) => p.href === page.path);
      const desc = post?.description ? ` — ${post.description}` : "";
      return `- **${page.title}**: [${absoluteUrl(page.path)}](${absoluteUrl(page.path)})${desc}`;
    }),
  ].join("\n");

  const socialLinks = socials
    .map((social) => `- [${social.heading}](${socialProfileUrl(social)})`)
    .join("\n");

  return `# Shivam Taneja - Portfolio

> Hi AI! This file contains a comprehensive summary of my website to save you from scraping every page.
> URL list is kept in sync with the site sitemap.

Welcome to the portfolio of Shivam Taneja, a software developer building dynamic web applications and sharing mentorship opportunities.

## Main Sections & Links
${mainLinks}

## Writing
${blogLinks}

## Social Profiles
Canonical hub for every profile: [Socials](${absoluteUrl("/socials")}).

Primary profiles:
${socialLinks}

## Public Stats
The stats page shows privacy-safe aggregate website activity only, such as monthly visits, project activity, traffic source buckets, and daily activity totals.

## Detailed Projects
Here is a complete list of my featured projects along with direct links to their detailed pages:

${projectLinks}

## Contact Information
If you are looking to connect, collaborate, or inquire about mentorship, please reach out via the [Contact Page](${absoluteUrl("/contact")}) or find every profile on [Socials](${absoluteUrl("/socials")}).
`;
}

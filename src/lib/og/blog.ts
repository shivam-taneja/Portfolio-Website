import { getBlogPost } from "@/lib/constants/blog";
import type { OgCardContent } from "@/types/og.types";

export function blogOgPath(title: string) {
  return `~/blog/"${title}"`;
}

export function blogOgTitleSize(title: string) {
  if (title.length > 32) return 48;
  if (title.length > 18) return 56;
  return 70;
}

export function getBlogOg(slug: string): OgCardContent | undefined {
  const post = getBlogPost(slug);

  if (!post) return undefined;

  return {
    path: blogOgPath(post.title),
    title: post.title,
    titleSize: blogOgTitleSize(post.title),
    description: post.og?.description ?? post.description,
    tags: post.tags,
    accent: post.og?.accent,
  };
}

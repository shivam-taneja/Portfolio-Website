export type BlogPost = {
  title: string;
  slug: string;
  href: string;
  description: string;
  dateLabel: string;
  datePublished: string;
  keywords: string[];
  tags: string[];
  og?: {
    description?: string;
    accent?: string;
  };
};

export const blogPosts: BlogPost[] = [
  {
    title: "Building Chat Mingle",
    slug: "building-chat-mingle",
    href: "/blog/building-chat-mingle",
    description:
      "How I built Chat Mingle, a real-time chat app with React and Firebase. Auth, live messages, and what shipping a small chat room taught me.",
    dateLabel: "Nov 16, 2026",
    datePublished: "2026-11-16",
    keywords: [
      "Chat Mingle",
      "chat mingle",
      "chatmingle",
      "real-time chat app",
      "React Firebase chat",
      "Shivam Taneja",
      "Vite chat app",
    ],
    tags: ["React", "Firebase", "Vite", "SASS"],
    og: {
      description:
        "a real-time chat app with React and Firebase. how I built it.",
      accent: "#38bdf8",
    },
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

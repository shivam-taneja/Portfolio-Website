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
    title: "Building Bhondu Game",
    slug: "building-bhondu-game",
    href: "/blog/building-bhondu-game",
    description:
      "How I built Bhondu Life, a desi turn-based life simulator. Daily situations, choices, a leaderboard, and what shipping the game taught me.",
    dateLabel: "Nov 23, 2026",
    datePublished: "2026-11-23",
    keywords: [
      "Bhondu Game",
      "Bhondu Life",
      "bhondu game",
      "bhondu life",
      "bhondugame",
      "desi life simulator",
      "turn-based game",
      "Shivam Taneja",
    ],
    tags: ["React Native", "Next.js", "NestJS", "Firebase"],
    og: {
      description: "a desi turn-based life simulator. how I built it.",
    },
  },
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

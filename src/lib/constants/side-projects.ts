import type { ProjectOgOverride } from "@/types/og.types";

export type SideProject = {
  title: string;
  projLink: string;
  desc: string;
  descLink: string;
  userCount: string | null;
  activelyWorking: boolean;

  /** Short stack shown on the social card. */
  tags: string[];
  /** Card copy when it should differ from the listing title or description. */
  og?: ProjectOgOverride;
};

export const sideProjects: SideProject[] = [
  {
    title: "Moo-ve It",
    projLink: "https://mooveit.shivamtaneja.com/",
    desc: "an endless runner starring a balloon cow on four wobbly teats. jump the fences. don't pancake.",
    descLink: "/projects/mooveit/",
    userCount: "247 users",
    activelyWorking: false,
    tags: ["TanStack Start", "React", "TypeScript", "Canvas"],
    og: {
      description:
        "endless runner: a balloon cow on four teat-legs jumping fences. don't pancake.",
    },
  },
  {
    title: "MyYearOnX",
    projLink: "https://www.myyearonx.com/",
    desc: "spotify wrapped but for X (Twitter) - your year on X, beautifully visualized.",
    descLink: "/projects/myyearonx/",
    userCount: null,
    activelyWorking: true,
    tags: ["Next.js", "TypeScript", "Twitter/X API", "PostgreSQL"],
    og: {
      description:
        "spotify wrapped but for X (Twitter) — your year on X, beautifully visualized.",
    },
  },
  {
    title: "Farside",
    projLink: "https://farside.shivamtaneja.com/",
    desc: "look away and get the iPhone Duo-style fade. webcam-based, fully on-device.",
    descLink: "/projects/farside/",
    userCount: null,
    activelyWorking: false,
    tags: ["Tauri", "Rust", "TypeScript", "MediaPipe"],
  },
  {
    title: "Yeet",
    projLink: "https://yeet.shivamtaneja.com/",
    desc: "write a post on X or Threads and it lands on the other. no copy-paste.",
    descLink: "/projects/yeet/",
    userCount: "4 users",
    activelyWorking: true,
    tags: ["WXT", "React", "TypeScript", "Tailwind CSS"],
  },
  {
    title: "Bhondu Life",
    projLink: "https://www.bhondugame.com/",
    desc: "a desi turn-based life simulator where every day throws a new, hilariously relatable situation at you.",
    descLink: "/projects/bhondu-game/",
    userCount: "170 users",
    activelyWorking: false,
    tags: ["React Native", "Next.js", "NestJS", "Firebase"],
  },
  {
    title: "Do You Play Badminton",
    projLink: "https://www.doyouplaybadminton.com/",
    desc: "someone asks if you play. you send the card. plus mini games.",
    descLink: "/projects/doyouplaybadminton/",
    userCount: "13 users",
    activelyWorking: true,
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Firebase"],
  },
  {
    title: "Exactly What I Have Been Looking For",
    projLink: "https://www.exactlywhatihavebeenlookingfor.com/",
    desc: "a growing, crowdsourced database of useful-but-forgettable tools and links, with a touch of desi humor.",
    descLink: "/projects/exactlywhatihavebeenlookingfor/",
    userCount: null,
    activelyWorking: false,
    tags: ["Next.js"],
    og: {
      description:
        "a growing, crowdsourced database of useful-but-forgettable tools and links.",
    },
  },
  {
    title: "The Guy She Told You About",
    projLink: "https://www.theguyshetoldyouabout.com/",
    desc: "my another profile/portfolio i got just cause for funziess xD so it has details about me and its like a fun random domain i bought.",
    descLink: "/projects/theguyshetoldyouabout/",
    userCount: null,
    activelyWorking: false,
    tags: ["Next.js"],
    og: {
      description:
        "another profile, bought because the domain was too fun to leave alone.",
    },
  },
  {
    title: "GraphMySelf",
    projLink: "https://www.graphmyself.com/",
    desc: "a personal AI memory layer that knows who you are, so every AI tool you use stops starting from zero.",
    descLink: "/projects/graphmyself/",
    userCount: "5 users",
    activelyWorking: false,
    tags: ["NestJS", "Next.js", "PostgreSQL", "pgvector"],
    og: {
      description:
        "a personal AI memory layer that knows who you are, so every AI tool stops starting from zero.",
    },
  },
  {
    title: "MySkillRoad",
    projLink: "https://www.myskillroad.com/",
    desc: "a personalized learning roadmap that tracks your growth across platforms and tells you exactly what to learn next.",
    descLink: "/projects/myskill-road/",
    userCount: null,
    activelyWorking: false,
    tags: ["Next.js", "React", "Prisma", "PostgreSQL"],
    og: {
      description:
        "a personalized learning roadmap that tracks your growth and tells you what to learn next.",
    },
  },
  {
    title: "EZNotify",
    projLink: "https://www.eznotify.dev/",
    desc: "a developer friendly SDK for sending multi-channel notifications like email, SMS, WhatsApp, push and more built for reliability at scale.",
    descLink: "/projects/eznotify/",
    userCount: null,
    activelyWorking: false,
    tags: ["Next.js", "TypeScript", "Notification APIs"],
    og: {
      description:
        "a developer-friendly SDK for email, SMS, WhatsApp, push, and the rest.",
    },
  },
  {
    title: "DecodeMyCode",
    projLink: "https://www.decodemycode.com/",
    desc: "an AI powered SaaS that turns any code into clear explanations, flowcharts and summaries.",
    descLink: "/projects/decode-mycode/",
    userCount: "5 users",
    activelyWorking: false,
    tags: ["AI", "Code Analysis", "Developer Tools", "SaaS"],
    og: {
      description:
        "an AI tool that turns code into explanations, flowcharts, and summaries.",
    },
  },
  {
    title: "CollabWrite",
    projLink: "https://collabwrite.appwrite.network/",
    desc: "an open source, real-time collaborative knowledge-sharing platform.",
    descLink: "/projects/collab-write/",
    userCount: "10 users",
    activelyWorking: false,
    tags: ["Next.js", "React", "Appwrite", "Tiptap"],
  },
  {
    title: "NagarIQ",
    projLink: "https://nagar-iq.shivamtaneja.com/",
    desc: "an AI-powered system that understands the world around it.",
    descLink: "/projects/nagar-iq/",
    userCount: "12 users",
    activelyWorking: false,
    tags: ["React Native", "Appwrite", "Data Visualization"],
    og: {
      description: "a gamified, real-time city data and quiz platform.",
    },
  },
  {
    title: "Tilt Bot",
    projLink: "https://tilt-bot.shivamtaneja.com/",
    desc: "an AI-powered gaming roast generator for witty, non-toxic comebacks.",
    descLink: "/projects/tilt-bot/",
    userCount: "05 users",
    activelyWorking: false,
    tags: ["Next.js", "React", "NestJS", "Groq AI"],
  },
  {
    title: "Chat Mingle",
    projLink: "https://chat-mingle.shivamtaneja.com/",
    desc: "a fun, experimental chat app.",
    descLink: "/projects/chat-mingle/",
    userCount: "19 users",
    activelyWorking: false,
    tags: ["React", "Firebase", "SASS", "Vite"],
    og: {
      description: "a fun, experimental real-time chat app.",
    },
  },
  {
    title: "Circle Catcher",
    projLink: "https://circle-game.shivamtaneja.com/",
    desc: "a game where you grow by eating smaller circles while avoiding larger ones.",
    descLink: "/projects/circle-catcher/",
    userCount: "09 users",
    activelyWorking: false,
    tags: ["JavaScript", "HTML5 Canvas", "CSS"],
  },
  {
    title: "Career Guide Hub (Freelance)",
    projLink: "https://www.saina.co.in/",
    desc: "a web app with assessments to provide personalized career recommendations, empowering student decisions.",
    descLink: "/projects/career-guidance/",
    userCount: null,
    activelyWorking: false,
    tags: ["Next.js", "React", "TypeScript", "Node.js"],
    og: {
      name: "Career Guide Hub",
      description:
        "assessments that turn into a personalized career recommendation.",
    },
  },
];

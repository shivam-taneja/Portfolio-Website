import { MetadataRoute } from "next";

export default async function sitemaps(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: "https://www.shivamtaneja.com/",
      lastModified: new Date(),
      priority: 1.0,
      changeFrequency: "monthly",
    },
    {
      url: "https://www.shivamtaneja.com/contact",
      lastModified: new Date(),
      priority: 0.8,
      changeFrequency: "yearly",
    },
    {
      url: "https://www.shivamtaneja.com/experience",
      lastModified: new Date(),
      priority: 0.9,
      changeFrequency: "monthly",
    },
    {
      url: "https://www.shivamtaneja.com/projects",
      lastModified: new Date(),
      priority: 0.9,
      changeFrequency: "monthly",
    },
    {
      url: "https://www.shivamtaneja.com/certificates",
      lastModified: new Date(),
      priority: 0.7,
      changeFrequency: "yearly",
    },
    {
      url: "https://www.shivamtaneja.com/mentorship",
      lastModified: new Date(),
      priority: 0.7,
      changeFrequency: "monthly",
    },
    {
      url: "https://www.shivamtaneja.com/stats",
      lastModified: new Date(),
      priority: 0.5,
      changeFrequency: "daily",
    },

    // projects
    {
      url: "https://www.shivamtaneja.com/projects/bhondu-game",
      lastModified: new Date(),
      priority: 0.6,
      changeFrequency: "yearly",
    },
    {
      url: "https://www.shivamtaneja.com/projects/career-guidance",
      lastModified: new Date(),
      priority: 0.6,
      changeFrequency: "yearly",
    },
    {
      url: "https://www.shivamtaneja.com/projects/chat-bot",
      lastModified: new Date(),
      priority: 0.6,
      changeFrequency: "yearly",
    },
    {
      url: "https://www.shivamtaneja.com/projects/chat-mingle",
      lastModified: new Date(),
      priority: 0.6,
      changeFrequency: "yearly",
    },
    {
      url: "https://www.shivamtaneja.com/projects/circle-catcher",
      lastModified: new Date(),
      priority: 0.6,
      changeFrequency: "yearly",
    },
    {
      url: "https://www.shivamtaneja.com/projects/collab-write",
      lastModified: new Date(),
      priority: 0.6,
      changeFrequency: "yearly",
    },
    {
      url: "https://www.shivamtaneja.com/projects/decode-mycode",
      lastModified: new Date(),
      priority: 0.6,
      changeFrequency: "yearly",
    },
    {
      url: "https://www.shivamtaneja.com/projects/eznotify",
      lastModified: new Date(),
      priority: 0.6,
      changeFrequency: "yearly",
    },
    {
      url: "https://www.shivamtaneja.com/projects/graphmyself",
      lastModified: new Date(),
      priority: 0.6,
      changeFrequency: "yearly",
    },
    {
      url: "https://www.shivamtaneja.com/projects/myskill-road",
      lastModified: new Date(),
      priority: 0.6,
      changeFrequency: "yearly",
    },
    {
      url: "https://www.shivamtaneja.com/projects/nagar-iq",
      lastModified: new Date(),
      priority: 0.6,
      changeFrequency: "yearly",
    },
    {
      url: "https://www.shivamtaneja.com/projects/tilt-bot",
      lastModified: new Date(),
      priority: 0.6,
      changeFrequency: "yearly",
    },
    {
      url: "https://www.shivamtaneja.com/projects/exactlywhatihavebeenlookingfor",
      lastModified: new Date(),
      priority: 0.6,
      changeFrequency: "yearly",
    },
    {
      url: "https://www.shivamtaneja.com/projects/theguyshetoldyouabout",
      lastModified: new Date(),
      priority: 0.6,
      changeFrequency: "yearly",
    },
    {
      url: "https://www.shivamtaneja.com/projects/myyearonx",
      lastModified: new Date(),
      priority: 0.6,
      changeFrequency: "yearly",
    },
    {
      url: "https://www.shivamtaneja.com/projects/farside",
      lastModified: new Date(),
      priority: 0.6,
      changeFrequency: "yearly",
    },
    {
      url: "https://www.shivamtaneja.com/projects/doyouplaybadminton",
      lastModified: new Date(),
      priority: 0.6,
      changeFrequency: "yearly",
    },
  ];
}

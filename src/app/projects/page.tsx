import { Metadata } from "next";
import Script from "next/script";

import { defaultMetadata } from "@/lib/constants/metadata";
import { sideProjects } from "@/lib/constants/side-projects";

import ChatBotProject from "@/components/home/chat-bot-project";
import TrackedLink from "@/components/tracked-link";
import Wrapper from "@/components/wrapper";
import { analyticsEvents } from "@/lib/analytics";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ExternalLink, Info } from "lucide-react";
import { GoDotFill } from "react-icons/go";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Projects | Shivam Taneja - Full Stack Developer",
  description:
    "Explore all projects by Shivam Taneja including web applications, AI tools, and open source contributions.",
  alternates: {
    canonical: "https://www.shivamtaneja.com/projects",
  },
  openGraph: {
    title: "Projects | Shivam Taneja - Full Stack Developer",
    description:
      "Explore all projects by Shivam Taneja including web applications, AI tools, and open source contributions.",
    ...defaultMetadata.openGraph,
  },
  twitter: {
    title: "Projects | Shivam Taneja",
    description:
      "Explore all projects by Shivam Taneja including web applications, AI tools, and open source contributions.",
    ...defaultMetadata.twitter,
  },
};

const ProjectsPage = () => {
  const projects = [...sideProjects].sort((a, b) => {
    const active = Number(b.activelyWorking) - Number(a.activelyWorking);
    if (active !== 0) return active;

    const count = (value: string | null) =>
      Number(value?.match(/\d+/)?.[0] ?? 0);

    return count(b.userCount) - count(a.userCount);
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Projects by Shivam Taneja",
    url: "https://www.shivamtaneja.com/projects",
    description:
      "A collection of projects built by Shivam Taneja including web applications, AI tools, and open source work.",
    about: {
      "@id": "https://www.shivamtaneja.com/#person",
    },
  };

  return (
    <>
      <Script
        id="projects-collection-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Wrapper>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">All Projects</h1>
            <p>
              A collection of projects I&apos;ve built, ranging from AI-powered
              tools to collaborative platforms.
            </p>
          </div>

          <ul className="flex flex-col gap-4">
            <ChatBotProject />

            {projects.map((item, idx) => (
              <li
                className="dark:text-neutral-400 text-neutral-600 flex w-full gap-4 items-start justify-between"
                key={idx}
              >
                <div className="flex flex-col gap-2 flex-1">
                  <div className="flex gap-2 items-center flex-wrap">
                    <p className="dark:text-white text-zinc-900">
                      {idx + 2}
                      {"."}
                    </p>
                    <div className="flex items-center gap-2">
                      <TrackedLink
                        href={item.projLink}
                        className="dark:text-white text-zinc-900 underline capitalize dark:hover:text-neutral-300 hover:text-zinc-600 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                        analyticsEvent={analyticsEvents.projectLiveOpened}
                        analyticsProperties={{
                          project: item.title,
                          source: "projects_page",
                        }}
                      >
                        <Tooltip delayDuration={50}>
                          <TooltipTrigger asChild>
                            <div>
                              {item.title}
                              <ExternalLink
                                className="inline-block ml-1 w-3 h-3"
                                aria-hidden="true"
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View project</p>
                          </TooltipContent>
                        </Tooltip>
                      </TrackedLink>

                      <TrackedLink
                        href={item.descLink}
                        className="dark:text-neutral-400 text-neutral-600 dark:hover:text-white hover:text-zinc-900 transition-colors"
                        aria-label={`View details for ${item.title}`}
                        analyticsEvent={analyticsEvents.projectDetailOpened}
                        analyticsProperties={{
                          project: item.title,
                          source: "projects_page",
                        }}
                      >
                        <Tooltip delayDuration={50}>
                          <TooltipTrigger asChild>
                            <Info className="w-4 h-4" aria-hidden="true" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View project details</p>
                          </TooltipContent>
                        </Tooltip>
                      </TrackedLink>
                    </div>
                  </div>
                  <p className="dark:text-neutral-400 text-neutral-600 break-words ml-4">
                    {item.desc}
                  </p>
                </div>

                <div className="flex gap-2 items-center shrink-0">
                  {item.userCount && <p>{item.userCount}</p>}

                  {item.activelyWorking && (
                    <Tooltip delayDuration={50}>
                      <TooltipTrigger asChild>
                        <GoDotFill
                          size={15}
                          className="hover:scale-110 scale-100 transition duration-75 ease-in-out text-green-500"
                          aria-hidden="true"
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Actively working on it</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Wrapper>
    </>
  );
};

export default ProjectsPage;

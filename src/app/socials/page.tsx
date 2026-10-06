import { Metadata } from "next";
import Script from "next/script";
import { ExternalLink } from "lucide-react";

import { defaultMetadata } from "@/lib/constants/metadata";
import { socials } from "@/lib/constants/socials";
import { analyticsEvents } from "@/lib/analytics";

import Wrapper from "@/components/wrapper";
import TrackedLink from "@/components/tracked-link";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Socials | Shivam Taneja - Full Stack Developer",
  description:
    "Find Shivam Taneja across LinkedIn, GitHub, YouTube, Threads, Bluesky, and more.",
  alternates: {
    canonical: "https://www.shivamtaneja.com/socials",
  },
  openGraph: {
    title: "Socials | Shivam Taneja - Full Stack Developer",
    description:
      "Find Shivam Taneja across LinkedIn, GitHub, YouTube, Threads, Bluesky, and more.",
    ...defaultMetadata.openGraph,
    url: "https://www.shivamtaneja.com/socials",
    images: [
      {
        url: "/og/socials",
        alt: "Socials | Shivam Taneja",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    title: "Socials | Shivam Taneja",
    description:
      "Find Shivam Taneja across LinkedIn, GitHub, YouTube, Threads, Bluesky, and more.",
    ...defaultMetadata.twitter,
    images: ["/og/socials"],
  },
};

const SocialsPage = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Socials | Shivam Taneja",
    url: "https://www.shivamtaneja.com/socials",
    description:
      "All public profiles for Shivam Taneja — LinkedIn, GitHub, YouTube, Bluesky, and more.",
    about: {
      "@id": "https://www.shivamtaneja.com/#person",
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: socials.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.heading,
        url: item.profileUrl ?? item.link,
      })),
    },
  };

  return (
    <>
      <Script
        id="socials-collection-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Wrapper>
        <section className="mx-auto w-full space-y-8 md:text-start text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold dark:text-white text-zinc-900">
              Socials.
            </h1>
            <p className="dark:text-muted-foreground text-neutral-600">
              Everywhere I show up online — pick a place and say hi.
            </p>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 list-none p-0 m-0">
            {socials.map((item) => (
              <li key={item.id} className="min-w-0">
                <TrackedLink
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full w-full items-center gap-3 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/40 px-4 py-3.5 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                  analyticsEvent={analyticsEvents.socialClicked}
                  analyticsProperties={{
                    platform: item.id,
                    source: "socials_page",
                  }}
                >
                  <item.icon
                    size={22}
                    className="shrink-0 dark:text-white text-zinc-900"
                    aria-hidden="true"
                  />
                  <div className="min-w-0 flex-1 text-left">
                    <p className="font-medium dark:text-white text-zinc-900">
                      {item.heading}
                    </p>
                    {item.description ? (
                      <p className="text-sm dark:text-muted-foreground text-neutral-600 truncate">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                  <ExternalLink
                    className="h-4 w-4 shrink-0 text-zinc-400 dark:text-zinc-500 opacity-0 transition-opacity group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </TrackedLink>
              </li>
            ))}
          </ul>
        </section>
      </Wrapper>
    </>
  );
};

export default SocialsPage;

import { Metadata } from "next";
import Script from "next/script";
import { ExternalLink } from "lucide-react";

import { defaultMetadata } from "@/lib/constants/metadata";
import { socials } from "@/lib/constants/socials";
import { analyticsEvents } from "@/lib/analytics";
import { getSocialStats, resolveSocialId } from "@/lib/social-stats";

import Wrapper from "@/components/wrapper";
import TrackedLink from "@/components/tracked-link";
import FeaturedSocials from "@/components/featured-socials";

export const revalidate = 3600;

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

const SocialsPage = async () => {
  const stats = await getSocialStats();
  const featuredIds = new Set(
    stats.rows.map((row) => resolveSocialId(row.id)),
  );
  const moreSocials = socials.filter((s) => !featuredIds.has(s.id));

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
        <section className="mx-auto flex w-full flex-col gap-10 text-center md:text-start">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
              Socials.
            </h1>
            <p className="text-neutral-600 dark:text-muted-foreground">
              Everywhere I show up online — pick a place and say hi.
            </p>
          </div>

          {stats.rows.length > 0 ? (
            <FeaturedSocials
              rows={stats.rows}
              totalFollowers={stats.totalFollowers}
              lastSyncedAt={stats.lastSyncedAt}
            />
          ) : null}

          <section className="flex flex-col gap-4">
            <div className="flex flex-col gap-1 text-left">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                Everywhere else
              </h2>
              <p className="text-sm text-neutral-600 dark:text-muted-foreground">
                More profiles, tools, and link-in-bio spots.
              </p>
            </div>

            <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 xl:grid-cols-3">
              {moreSocials.map((item) => (
                <li key={item.id} className="min-w-0">
                  <TrackedLink
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full w-full items-center gap-3 rounded-md border border-zinc-200 bg-zinc-50/80 px-4 py-3.5 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:bg-zinc-800/60"
                    analyticsEvent={analyticsEvents.socialClicked}
                    analyticsProperties={{
                      platform: item.id,
                      source: "socials_page",
                    }}
                  >
                    <item.icon
                      size={22}
                      className="shrink-0 text-zinc-900 dark:text-white"
                      aria-hidden="true"
                    />
                    <div className="min-w-0 flex-1 text-left">
                      <p className="font-medium text-zinc-900 dark:text-white">
                        {item.heading}
                      </p>
                      {item.description ? (
                        <p className="truncate text-sm text-neutral-600 dark:text-muted-foreground">
                          {item.description}
                        </p>
                      ) : null}
                    </div>
                    <ExternalLink
                      className="h-4 w-4 shrink-0 text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100 dark:text-zinc-500"
                      aria-hidden="true"
                    />
                  </TrackedLink>
                </li>
              ))}
            </ul>
          </section>
        </section>
      </Wrapper>
    </>
  );
};

export default SocialsPage;

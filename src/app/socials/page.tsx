import { Metadata } from "next";
import Script from "next/script";
import { ArrowUpRight, ExternalLink } from "lucide-react";

import { defaultMetadata } from "@/lib/constants/metadata";
import { navSocials } from "@/lib/constants/socials";
import { analyticsEvents } from "@/lib/analytics";
import { getSocialStats, resolveSocialId } from "@/lib/social-stats";

import Wrapper from "@/components/wrapper";
import TrackedLink from "@/components/tracked-link";
import FeaturedSocials from "@/components/featured-socials";

export const revalidate = 3600;

const PAGE_DESCRIPTION =
  "Find Shivam Taneja on LinkedIn, GitHub, YouTube, X, and Instagram — plus the @codesbyshivam brand home.";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Socials | Shivam Taneja - Full Stack Developer",
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "https://www.shivamtaneja.com/socials",
  },
  openGraph: {
    title: "Socials | Shivam Taneja - Full Stack Developer",
    description: PAGE_DESCRIPTION,
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
    description: PAGE_DESCRIPTION,
    ...defaultMetadata.twitter,
    images: ["/og/socials"],
  },
};

const SocialsPage = async () => {
  const stats = await getSocialStats();
  const featuredIds = new Set(
    stats.rows.map((row) => resolveSocialId(row.id)),
  );
  const otherMainSocials = navSocials.filter((s) => !featuredIds.has(s.id));

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Socials | Shivam Taneja",
    url: "https://www.shivamtaneja.com/socials",
    description:
      "Main public profiles for Shivam Taneja — LinkedIn, GitHub, YouTube, X, and Instagram.",
    about: {
      "@id": "https://www.shivamtaneja.com/#person",
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: navSocials.map((item, index) => ({
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
              The main places I show up online — pick one and say hi.
            </p>
          </div>

          <TrackedLink
            href="https://codesbyshivam.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex w-full items-center gap-3 rounded-md border border-zinc-200 bg-zinc-50/80 px-4 py-4 text-left transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:bg-zinc-800/60"
            analyticsEvent={analyticsEvents.socialClicked}
            analyticsProperties={{
              platform: "codesbyshivam",
              source: "socials_page_brand",
            }}
          >
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-zinc-900 dark:text-white">
                @codesbyshivam
              </p>
              <p className="mt-0.5 text-sm text-neutral-600 dark:text-muted-foreground">
                Brand home — media kit, assets, and collaborations on
                codesbyshivam.com
              </p>
            </div>
            <ArrowUpRight
              className="h-4 w-4 shrink-0 text-zinc-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 dark:text-zinc-500"
              aria-hidden="true"
            />
          </TrackedLink>

          {stats.rows.length > 0 ? (
            <FeaturedSocials
              rows={stats.rows}
              totalFollowers={stats.totalFollowers}
              lastSyncedAt={stats.lastSyncedAt}
            />
          ) : null}

          {otherMainSocials.length > 0 ? (
            <section className="flex flex-col gap-4">
              <div className="flex flex-col gap-1 text-left">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {stats.rows.length > 0 ? "Also on" : "Main platforms"}
                </h2>
                <p className="text-sm text-neutral-600 dark:text-muted-foreground">
                  Core profiles without a live stats card yet.
                </p>
              </div>

              <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2">
                {otherMainSocials.map((item) => (
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
          ) : null}
        </section>
      </Wrapper>
    </>
  );
};

export default SocialsPage;

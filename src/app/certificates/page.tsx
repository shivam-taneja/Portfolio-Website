import { Metadata } from "next";
import Script from "next/script";

import { defaultMetadata } from "@/lib/constants/metadata";
import { certifications } from "@/lib/constants/certifications";

import Wrapper from "@/components/wrapper";
import TrackedLink from "@/components/tracked-link";
import { analyticsEvents } from "@/lib/analytics";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Certificates | Shivam Taneja - Full Stack Developer",
  description: "Explore all certificates and achievements by Shivam Taneja.",
  alternates: {
    canonical: "https://www.shivamtaneja.com/certificates",
  },
  openGraph: {
    title: "Certificates | Shivam Taneja - Full Stack Developer",
    description: "Explore all certificates and achievements by Shivam Taneja.",
    ...defaultMetadata.openGraph,
    url: "https://www.shivamtaneja.com/certificates",
    images: [
      {
        url: "/og/certificates",
        alt: "Certificates | Shivam Taneja",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    title: "Certificates | Shivam Taneja",
    description: "Explore all certificates and achievements by Shivam Taneja.",
    ...defaultMetadata.twitter,
    images: ["/og/certificates"],
  },
};

const CertificatesPage = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Certificates by Shivam Taneja",
    url: "https://www.shivamtaneja.com/certificates",
    description: "A collection of certificates achieved by Shivam Taneja.",
    about: {
      "@id": "https://www.shivamtaneja.com/#person",
    },
  };

  return (
    <>
      <Script
        id="certificates-collection-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Wrapper>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">All Certificates</h1>
            <p>
              A collection of certificates and achievements I&apos;ve earned.
            </p>
          </div>

          <ul className="flex flex-col gap-4">
            {certifications.map((item, idx) => (
              <li
                className="dark:text-neutral-400 text-neutral-600 flex w-full gap-4 items-start justify-between"
                key={idx}
              >
                <div className="flex flex-col gap-2 flex-1">
                  <div className="flex gap-2 items-center flex-wrap">
                    <p className="dark:text-white text-zinc-900">
                      {idx + 1}
                      {"."}
                    </p>
                    <div className="flex items-center gap-2">
                      <TrackedLink
                        href={item.link}
                        className="dark:text-white text-zinc-900 underline capitalize dark:hover:text-neutral-300 hover:text-zinc-600 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                        analyticsEvent={analyticsEvents.certificateOpened}
                        analyticsProperties={{
                          certificate: item.title,
                          company: item.company,
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
                            <p>View certificate</p>
                          </TooltipContent>
                        </Tooltip>
                      </TrackedLink>

                      <span className="text-sm dark:text-neutral-400 text-neutral-500 hidden sm:inline-block">
                        |
                      </span>
                      <span className="text-sm dark:text-neutral-400 text-neutral-500">
                        {item.company}
                      </span>
                      <span className="sr-only">
                        {item.description} Skills: {item.skills?.join(", ")}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Wrapper>
    </>
  );
};

export default CertificatesPage;

import { Metadata } from "next";
import Script from "next/script";

import { defaultMetadata } from "@/lib/constants/metadata";
import { experiences } from "@/lib/constants/experience";
import { calculateTotalExperience } from "@/lib/utils";

import Wrapper from "@/components/wrapper";
import { CircleDot } from "lucide-react";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Experience | Shivam Taneja - Full Stack Developer",
  description:
    "Detailed professional experience and career journey of Shivam Taneja.",
  alternates: {
    canonical: "https://www.shivamtaneja.com/experience",
  },
  openGraph: {
    title: "Experience | Shivam Taneja - Full Stack Developer",
    description:
      "Detailed professional experience and career journey of Shivam Taneja.",
    ...defaultMetadata.openGraph,
    url: "https://www.shivamtaneja.com/experience",
    images: [
      {
        url: "/og/experience",
        alt: "Experience | Shivam Taneja",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    title: "Experience | Shivam Taneja",
    description:
      "Detailed professional experience and career journey of Shivam Taneja.",
    ...defaultMetadata.twitter,
    images: ["/og/experience"],
  },
};

const ExperiencePage = () => {
  const totalExp = calculateTotalExperience(experiences);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Professional Experience of Shivam Taneja",
    url: "https://www.shivamtaneja.com/experience",
    description: `Professional career journey of Shivam Taneja. Total experience: ${totalExp}.`,
    about: {
      "@id": "https://www.shivamtaneja.com/#person",
    },
  };

  return (
    <>
      <Script
        id="experience-collection-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Wrapper>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Experience</h1>
            <p className="dark:text-neutral-400 text-neutral-600">
              My professional journey and career milestones. Total Experience:{" "}
              <span className="font-semibold text-zinc-900 dark:text-white">
                {totalExp}
              </span>
            </p>
          </div>

          <div className="relative pl-4 after:absolute after:inset-y-0 after:w-px dark:after:bg-white/20 after:bg-zinc-400/40 after:left-0">
            <ul className="flex flex-col gap-8 ml-4">
              {experiences.map((item, idx) => (
                <li
                  className="dark:text-neutral-400 text-neutral-600 flex w-full gap-4 items-start justify-between relative"
                  key={idx}
                >
                  <div className="absolute -left-[21px] top-1">
                    <CircleDot
                      className="h-4 w-4 dark:text-white text-zinc-900"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="flex flex-col gap-4 flex-1">
                    <div className="flex justify-between items-start md:items-center md:flex-row flex-col gap-1">
                      <div className="flex flex-col">
                        <h3 className="text-lg font-bold dark:text-white text-zinc-900">
                          {item.title}
                        </h3>
                        <p className="font-medium">
                          {item.companyName} | {item.workLocation}
                        </p>
                      </div>
                      <p className="text-sm font-medium">
                        <time dateTime={item.startISO}>{item.start}</time>
                        {" - "}
                        {item.end ? (
                          <time dateTime={item.endISO}>{item.end}</time>
                        ) : (
                          "Present"
                        )}
                      </p>
                    </div>

                    <p className="dark:text-neutral-300 text-neutral-700 leading-relaxed max-w-2xl">
                      {item.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Wrapper>
    </>
  );
};

export default ExperiencePage;

import React from "react";

import Link from "next/link";

import { aboutMeContent } from "@/lib/constants/about-me";
import { BarChart3, Share2 } from "lucide-react";

const AboutMeSection = () => {
  return (
    <section aria-labelledby="about-heading">
      <div className="flex flex-col gap-4">
        <div className="flex gap-2 items-center">
          <h1
            className="text-2xl font-bold dark:text-white text-zinc-900"
            id="about-heading"
          >
            Hi, I&apos;m Shivam Taneja
          </h1>
        </div>

        <ul className="flex list-disc ml-4 flex-col gap-2">
          {aboutMeContent.map((item) => (
            <li
              className="dark:text-neutral-400 text-neutral-600 font-semibold"
              key={item}
              dangerouslySetInnerHTML={{ __html: item }}
            />
          ))}
        </ul>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/stats"
            className="inline-flex w-fit items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium dark:text-white text-zinc-900 dark:hover:bg-zinc-900 hover:bg-zinc-100 transition-colors"
          >
            <BarChart3 className="h-4 w-4" aria-hidden="true" />
            <span>View site stats</span>
          </Link>
          <Link
            href="/socials"
            className="inline-flex w-fit items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium dark:text-white text-zinc-900 dark:hover:bg-zinc-900 hover:bg-zinc-100 transition-colors"
          >
            <Share2 className="h-4 w-4" aria-hidden="true" />
            <span>View social stats</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutMeSection;

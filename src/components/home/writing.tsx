import Link from "next/link";

import { blogPosts } from "@/lib/constants/blog";
import { analyticsEvents } from "@/lib/analytics";

import TrackedLink from "../tracked-link";

const WritingSection = () => {
  return (
    <section aria-labelledby="writing-heading">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <h2
            className="text-xl font-bold dark:text-white text-zinc-900"
            id="writing-heading"
          >
            Writing
          </h2>
          <Link
            href="/blog"
            className="underline p-0 text-sm dark:text-white text-zinc-900"
            aria-label="View all writing"
          >
            View More
          </Link>
        </div>

        <ul className="flex flex-col gap-4">
          {blogPosts.map((post, idx) => (
            <li
              className="dark:text-neutral-400 text-neutral-600 flex w-full gap-4 items-start justify-between"
              key={post.slug}
            >
              <div className="flex flex-col gap-2 flex-1">
                <div className="flex gap-2 items-center flex-wrap">
                  <p className="dark:text-white text-zinc-900">
                    {idx + 1}
                    {"."}
                  </p>
                  <TrackedLink
                    href={post.href}
                    className="dark:text-white text-zinc-900 underline dark:hover:text-neutral-300 hover:text-zinc-600 transition-colors"
                    analyticsEvent={analyticsEvents.projectDetailOpened}
                    analyticsProperties={{
                      project: post.title,
                      source: "home_writing_section",
                    }}
                  >
                    {post.title}
                  </TrackedLink>
                </div>
                <p className="dark:text-neutral-400 text-neutral-600 break-words ml-4">
                  {post.description}
                </p>
              </div>

              <p className="shrink-0 text-sm">{post.dateLabel}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default WritingSection;

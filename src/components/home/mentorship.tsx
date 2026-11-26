import React from "react";
import Link from "next/link";
import { mentorships } from "@/lib/constants/mentorship";
import { ExternalLink } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { appendUTM } from "@/lib/utils";

const MentorshipSection = () => {
  return (
    <section aria-labelledby="mentorship-heading">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <h2
            className="text-xl font-bold dark:text-white text-zinc-900"
            id="mentorship-heading"
          >
            Mentorship & Judging
          </h2>
          <Link
            href={"/mentorship"}
            className="underline p-0 text-sm dark:text-white text-zinc-900"
            aria-label="View more mentorship and judging work"
          >
            View More
          </Link>
        </div>

        <ul className="flex flex-col gap-4">
          {[...mentorships]
            .reverse()
            .slice(0, 3)
            .map((item, idx) => (
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
                      <Link
                        href={appendUTM(item.link)}
                        className="dark:text-white text-zinc-900 underline capitalize dark:hover:text-neutral-300 hover:text-zinc-600 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Tooltip delayDuration={50}>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-1">
                              {item.title}
                              <ExternalLink
                                className="inline-block ml-1 w-3 h-3"
                                aria-hidden="true"
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View LinkedIn Post</p>
                          </TooltipContent>
                        </Tooltip>
                      </Link>
                      <span className="text-sm dark:text-neutral-400 text-neutral-500 hidden sm:inline-block">
                        |
                      </span>
                      <span className="text-sm dark:text-neutral-400 text-neutral-500 capitalize">
                        {item.role}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
};

export default MentorshipSection;

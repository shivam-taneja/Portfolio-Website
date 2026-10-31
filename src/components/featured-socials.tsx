"use client";

import { useState } from "react";
import { ExternalLink, TrendingUp, Users } from "lucide-react";

import { socials } from "@/lib/constants/socials";
import { analyticsEvents } from "@/lib/analytics";
import {
  formatAsOfDate,
  formatEngagementRate,
  formatStatNumber,
  formatSyncedAt,
  resolveSocialId,
  trendWindows,
  type SocialStatRow,
  type TrendWindowKey,
} from "@/lib/social-stats";

import AnimatedNumber from "@/components/animated-number";
import TrackedLink from "@/components/tracked-link";

type FeaturedSocialsProps = {
  rows: SocialStatRow[];
  totalFollowers: number | null;
  lastSyncedAt: string | null;
};

export default function FeaturedSocials({
  rows,
  totalFollowers,
  lastSyncedAt,
}: FeaturedSocialsProps) {
  const [windowKey, setWindowKey] = useState<TrendWindowKey>("now");
  const socialById = new Map(socials.map((s) => [s.id, s]));

  return (
    <div className="flex flex-col gap-10">
      {totalFollowers != null && (
        <div className="flex flex-col gap-2 rounded-md border border-zinc-200 bg-zinc-50/80 px-4 py-4 dark:border-zinc-800 dark:bg-zinc-900/40 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-center gap-3 sm:justify-start">
            <Users
              className="h-5 w-5 shrink-0 text-zinc-500 dark:text-zinc-400"
              aria-hidden="true"
            />
            <div className="text-left">
              <p className="text-sm text-neutral-600 dark:text-muted-foreground">
                Combined audience
              </p>
              <p className="text-2xl font-semibold tabular-nums text-zinc-900 dark:text-white">
                <AnimatedNumber
                  value={totalFollowers}
                  format={formatStatNumber}
                />
                <span className="ml-2 text-sm font-normal text-neutral-600 dark:text-muted-foreground">
                  followers
                </span>
              </p>
            </div>
          </div>
          {lastSyncedAt ? (
            <p className="text-xs text-neutral-500 dark:text-muted-foreground">
              Updated {formatSyncedAt(lastSyncedAt)}
            </p>
          ) : null}
        </div>
      )}

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-1 text-left">
            <div className="flex items-center justify-center gap-2 text-neutral-600 dark:text-muted-foreground sm:justify-start">
              <TrendingUp className="h-4 w-4" aria-hidden="true" />
              <p className="text-sm font-medium">Main platforms</p>
            </div>
            <p className="text-sm text-neutral-600 dark:text-muted-foreground">
              Followers, views, and engagement for the selected window.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Lookback window"
            className="mx-auto flex w-fit max-w-full flex-wrap justify-center rounded-md border border-zinc-200 p-1 dark:border-zinc-800 sm:mx-0"
          >
            {trendWindows.map((window) => {
              const selected = windowKey === window.key;
              return (
                <button
                  key={window.key}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setWindowKey(window.key)}
                  className={`rounded-sm px-3 py-1.5 text-sm font-medium transition-colors ${
                    selected
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                      : "text-neutral-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                  }`}
                >
                  {window.label}
                </button>
              );
            })}
          </div>
        </div>

        <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2">
          {rows.map((row) => {
            const social = socialById.get(resolveSocialId(row.id));
            const Icon = social?.icon;
            const href = social?.link ?? row.url;
            const metrics = row.windows[windowKey];
            const isInactive = row.status === "inactive";
            const hasSnapshot = metrics != null;

            return (
              <li key={row.id} className="min-w-0">
                <TrackedLink
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex h-full w-full flex-col gap-4 rounded-md border px-4 py-4 text-left transition-colors ${
                    isInactive
                      ? "border-zinc-200/70 bg-zinc-50/40 opacity-70 dark:border-zinc-800/70 dark:bg-zinc-900/20"
                      : "border-zinc-200 bg-zinc-50/80 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:bg-zinc-800/60"
                  }`}
                  analyticsEvent={analyticsEvents.socialClicked}
                  analyticsProperties={{
                    platform: resolveSocialId(row.id),
                    source: "socials_page_featured",
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      {Icon ? (
                        <Icon
                          size={24}
                          className="shrink-0 text-zinc-900 dark:text-white"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-zinc-900 dark:text-white">
                            {row.name}
                          </p>
                          {isInactive ? (
                            <span className="rounded-sm bg-zinc-200/80 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                              inactive
                            </span>
                          ) : null}
                        </div>
                        <p className="truncate text-sm text-neutral-600 dark:text-muted-foreground">
                          {row.handle}
                        </p>
                      </div>
                    </div>
                    <ExternalLink
                      className="h-4 w-4 shrink-0 text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100 dark:text-zinc-500"
                      aria-hidden="true"
                    />
                  </div>

                  {hasSnapshot ? (
                    <>
                      <div>
                        <p className="text-3xl font-semibold tabular-nums tracking-tight text-zinc-900 dark:text-white">
                          <AnimatedNumber
                            value={metrics.primary_value}
                            format={formatStatNumber}
                          />
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-muted-foreground">
                          {row.primary_label}
                          {windowKey !== "now" && metrics.as_of ? (
                            <span className="text-neutral-500">
                              {" "}
                              · as of {formatAsOfDate(metrics.as_of)}
                            </span>
                          ) : null}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-zinc-200/80 pt-3 dark:border-zinc-800">
                        {metrics.secondary_label ? (
                          <p className="text-xs text-neutral-500 dark:text-muted-foreground">
                            <span className="text-neutral-600 dark:text-zinc-400">
                              {metrics.secondary_label}:
                            </span>{" "}
                            <AnimatedNumber
                              value={metrics.secondary_value}
                              format={formatStatNumber}
                              className="tabular-nums text-zinc-700 dark:text-zinc-300"
                              duration={0.75}
                            />
                          </p>
                        ) : null}
                        {metrics.avg_views != null ? (
                          <p className="text-xs text-neutral-500 dark:text-muted-foreground">
                            <span className="text-neutral-600 dark:text-zinc-400">
                              Avg views:
                            </span>{" "}
                            <AnimatedNumber
                              value={metrics.avg_views}
                              format={formatStatNumber}
                              className="tabular-nums text-zinc-700 dark:text-zinc-300"
                              duration={0.75}
                            />
                          </p>
                        ) : null}
                        {metrics.engagement_rate != null ? (
                          <p className="text-xs text-neutral-500 dark:text-muted-foreground">
                            <span className="text-neutral-600 dark:text-zinc-400">
                              Engagement:
                            </span>{" "}
                            <AnimatedNumber
                              value={metrics.engagement_rate}
                              format={formatEngagementRate}
                              className="tabular-nums text-zinc-700 dark:text-zinc-300"
                              duration={0.75}
                            />
                          </p>
                        ) : null}
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-neutral-500 dark:text-zinc-500">
                      No snapshot far enough back for this window yet.
                    </p>
                  )}
                </TrackedLink>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

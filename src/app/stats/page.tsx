import { Metadata } from "next";
import {
  BarChart3,
  Bot,
  ExternalLink,
  FileText,
  MailCheck,
  MousePointerClick,
  TrendingUp,
  UsersRound,
} from "lucide-react";

import Wrapper from "@/components/wrapper";
import { defaultMetadata } from "@/lib/constants/metadata";
import { getStats } from "@/lib/stats";

export const revalidate = 60;

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Stats | Shivam Taneja",
  description:
    "High-level aggregate portfolio stats including visits, project activity, traffic sources, and chatbot activity.",
  alternates: {
    canonical: "https://www.shivamtaneja.com/stats",
  },
  openGraph: {
    title: "Stats | Shivam Taneja",
    description:
      "Privacy-safe aggregate portfolio stats including visits, project activity, traffic sources, and chatbot activity.",
    ...defaultMetadata.openGraph,
    url: "https://www.shivamtaneja.com/stats",
    images: [
      {
        url: "/og/stats",
        alt: "Stats | Shivam Taneja",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    title: "Stats | Shivam Taneja",
    description:
      "Privacy-safe aggregate portfolio stats including visits, project activity, traffic sources, and chatbot activity.",
    ...defaultMetadata.twitter,
    images: ["/og/stats"],
  },
};

const numberFormatter = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const fullNumberFormatter = new Intl.NumberFormat("en");

export default async function StatsPage() {
  const stats = await getStats();
  const maxTraffic = Math.max(
    ...stats.trafficSources.map((source) => source.total),
    1,
  );
  const maxProjectTotal = Math.max(
    ...stats.trendingProjects.map((project) => project.total),
    1,
  );

  const metrics = [
    {
      label: "Visits this month",
      value: stats.metrics.visitsThisMonth,
      helper: "Pageview events",
      icon: UsersRound,
    },
    {
      label: "Resume opens",
      value: stats.metrics.resumeOpens,
      helper: "Resume link clicks",
      icon: FileText,
    },
    {
      label: "Project demo clicks",
      value: stats.metrics.projectDemoClicks,
      helper: "Live project links",
      icon: ExternalLink,
    },
    {
      label: "Contact submissions",
      value: stats.metrics.contactFormSubmissions,
      helper: "Successful form sends",
      icon: MailCheck,
    },
  ];

  return (
    <Wrapper>
      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 dark:text-muted-foreground text-neutral-600">
            <BarChart3 className="h-4 w-4" aria-hidden="true" />
            <p className="text-sm">Aggregate stats for {stats.monthLabel}</p>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold dark:text-white text-zinc-900">
              Site stats
            </h1>
            <p className="dark:text-muted-foreground text-neutral-600">
              High-level portfolio activity only. No users, sessions,
              recordings, device details, or full referrer URLs.
            </p>
          </div>
        </div>

        {!stats.isConfigured && (
          <StatusNote>
            Add POSTHOG_PROJECT_ID and POSTHOG_PERSONAL_API_KEY to show live
            aggregate stats.
          </StatusNote>
        )}

        {stats.error && <StatusNote>{stats.error}</StatusNote>}

        <div className="grid gap-3 sm:grid-cols-2">
          {metrics.map((metric) => (
            <MetricTile key={metric.label} {...metric} />
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <MetricTile
            label="Chatbot conversations"
            value={stats.metrics.chatbotConversations}
            helper="Chatbot opens"
            icon={Bot}
          />
          <MetricTile
            label="Chatbot messages"
            value={stats.metrics.chatbotMessages}
            helper="Messages sent"
            icon={MousePointerClick}
          />
        </div>

        <section className="flex flex-col gap-4">
          <SectionHeader
            icon={TrendingUp}
            title="Trending projects"
            detail="Ranked by demo clicks and project page/detail views"
          />

          {stats.trendingProjects.length > 0 ? (
            <div className="flex flex-col gap-3">
              {stats.trendingProjects.map((project, index) => (
                <div
                  key={project.project}
                  className="flex flex-col gap-2 border-b border-border pb-3 last:border-b-0"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="w-5 shrink-0 text-sm dark:text-muted-foreground text-neutral-500">
                        {index + 1}.
                      </span>
                      <p className="truncate font-medium dark:text-white text-zinc-900">
                        {project.project}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm dark:text-muted-foreground text-neutral-600">
                      {fullNumberFormatter.format(project.total)}
                    </p>
                  </div>
                  <div className="ml-8 h-2 overflow-hidden rounded-sm bg-muted">
                    <div
                      className="h-full rounded-sm bg-zinc-900 dark:bg-white"
                      style={{
                        width: `${Math.max((project.total / maxProjectTotal) * 100, 4)}%`,
                      }}
                    />
                  </div>
                  <p className="ml-8 text-xs dark:text-muted-foreground text-neutral-500">
                    {fullNumberFormatter.format(project.clicks)} clicks /{" "}
                    {fullNumberFormatter.format(project.views)} views
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState>No project activity yet for this month.</EmptyState>
          )}
        </section>

        <section className="flex flex-col gap-4">
          <SectionHeader
            icon={BarChart3}
            title="Traffic sources"
            detail="Grouped into privacy-safe buckets"
          />
          <div className="flex flex-col gap-3">
            {stats.trafficSources.map((source) => (
              <div
                key={source.source}
                className="grid grid-cols-[5.5rem_1fr_3rem] items-center gap-3"
              >
                <p className="text-sm dark:text-white text-zinc-900">
                  {source.source}
                </p>
                <div className="h-2 overflow-hidden rounded-sm bg-muted">
                  <div
                    className="h-full rounded-sm bg-zinc-900 dark:bg-white"
                    style={{
                      width: `${Math.max((source.total / maxTraffic) * 100, source.total ? 4 : 0)}%`,
                    }}
                  />
                </div>
                <p className="text-right text-sm dark:text-muted-foreground text-neutral-600">
                  {fullNumberFormatter.format(source.total)}
                </p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </Wrapper>
  );
}

function MetricTile({
  label,
  value,
  helper,
  icon: Icon,
}: {
  label: string;
  value: number;
  helper: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-md border border-border p-4">
      <div className="flex flex-col gap-1">
        <p className="text-sm dark:text-muted-foreground text-neutral-600">
          {label}
        </p>
        <p className="text-3xl font-bold dark:text-white text-zinc-900">
          {numberFormatter.format(value)}
        </p>
        <p className="text-xs dark:text-muted-foreground text-neutral-500">
          {helper}
        </p>
      </div>
      <Icon
        className="mt-1 h-5 w-5 shrink-0 dark:text-muted-foreground text-neutral-500"
        aria-hidden
      />
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  detail,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  title: string;
  detail: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold dark:text-white text-zinc-900">
          {title}
        </h2>
        <p className="text-sm dark:text-muted-foreground text-neutral-600">
          {detail}
        </p>
      </div>
      <Icon
        className="mt-1 h-5 w-5 shrink-0 dark:text-muted-foreground text-neutral-500"
        aria-hidden
      />
    </div>
  );
}

function StatusNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-border bg-muted/50 p-3 text-sm dark:text-muted-foreground text-neutral-600">
      {children}
    </div>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-md border border-border p-4 text-sm dark:text-muted-foreground text-neutral-600">
      {children}
    </p>
  );
}

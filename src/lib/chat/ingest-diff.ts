import { createHash } from "crypto";
import { parseStringPromise } from "xml2js";

import {
  extractPageContent,
  shouldSkipIngestUrl,
} from "@/lib/chat/extract-page-content";
import { getAllCrawlingMeta } from "@/lib/mongo";
import { CrawlingMetaData } from "@/types/crawl.types";

const SITE_ORIGIN = "https://www.shivamtaneja.com";
const LOCAL_ORIGIN = "http://localhost:3000";

export function hashContent(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

export type IngestDiffStatus =
  | "would_add"
  | "would_update"
  | "unchanged"
  | "skipped_path"
  | "no_content"
  | "would_remove"
  | "failed";

export type IngestDiffPage = {
  url: string;
  status: IngestDiffStatus;
  contentHash?: string;
  storedHash?: string | null;
  preview?: string;
  error?: string;
};

export type IngestDiffResult = {
  pages: IngestDiffPage[];
  counts: Record<IngestDiffStatus, number>;
};

export async function diffSitemapAgainstMeta(): Promise<IngestDiffResult> {
  const sitemapRes = await fetch(`${LOCAL_ORIGIN}/sitemap.xml`);
  if (!sitemapRes.ok) {
    throw new Error(`Failed to fetch sitemap: ${sitemapRes.status}`);
  }

  const xml = await sitemapRes.text();
  const result = await parseStringPromise(xml);
  const urls: string[] = result.urlset.url.map(
    (u: { loc: string[] }) => u.loc[0],
  );

  const existingMeta = await getAllCrawlingMeta();
  const metaByUrl = new Map<string, CrawlingMetaData>(
    existingMeta.map((m) => [m.url, m]),
  );
  const seenUrls = new Set<string>();
  const pages: IngestDiffPage[] = [];

  for (const url of urls) {
    seenUrls.add(url);

    if (shouldSkipIngestUrl(url)) {
      pages.push({ url, status: "skipped_path" });
      continue;
    }

    const localUrl = url.replace(SITE_ORIGIN, LOCAL_ORIGIN);

    try {
      const pageRes = await fetch(localUrl);
      if (!pageRes.ok) {
        pages.push({
          url,
          status: "failed",
          error: `HTTP ${pageRes.status}`,
        });
        continue;
      }

      const html = await pageRes.text();
      const text = extractPageContent(html);

      if (!text) {
        pages.push({ url, status: "no_content" });
        continue;
      }

      const contentHash = hashContent(text);
      const previous = metaByUrl.get(url);
      const preview = text.substring(0, 80).replace(/\n/g, " ");

      if (previous && previous.contentHash === contentHash) {
        pages.push({
          url,
          status: "unchanged",
          contentHash,
          storedHash: previous.contentHash,
          preview,
        });
        continue;
      }

      pages.push({
        url,
        status: previous ? "would_update" : "would_add",
        contentHash,
        storedHash: previous?.contentHash ?? null,
        preview,
      });
    } catch (err) {
      pages.push({
        url,
        status: "failed",
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  for (const meta of existingMeta) {
    const goneFromSitemap = !seenUrls.has(meta.url);
    const nowSkipped = shouldSkipIngestUrl(meta.url);
    if (!goneFromSitemap && !nowSkipped) continue;

    pages.push({
      url: meta.url,
      status: "would_remove",
      storedHash: meta.contentHash,
    });
  }

  const counts: Record<IngestDiffStatus, number> = {
    would_add: 0,
    would_update: 0,
    unchanged: 0,
    skipped_path: 0,
    no_content: 0,
    would_remove: 0,
    failed: 0,
  };

  for (const page of pages) {
    counts[page.status] += 1;
  }

  return { pages, counts };
}

import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { parseStringPromise } from "xml2js";

import { MEM0_USER_ID, memoryClient } from "@/lib/chat";
import {
  clearAllCrawlingMeta,
  deleteCrawlingMetaByUrl,
  getAllCrawlingMeta,
  upsertCrawlingMeta,
} from "@/lib/mongo";
import { serverEnv } from "@/lib/env/server";
import { CrawlingMetaData } from "@/types/crawl.types";

const SITE_ORIGIN = "https://www.shivamtaneja.com";
const LOCAL_ORIGIN = "http://localhost:3000";

function hashContent(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

async function deleteMemories(memoryIds: string[]): Promise<void> {
  for (const id of memoryIds) {
    try {
      await memoryClient.delete(id);
    } catch (err) {
      console.error(`Failed to delete Mem0 memory ${id}:`, err);
    }
  }
}

function extractMemoryIds(response: unknown): string[] {
  const list = Array.isArray(response)
    ? response
    : response &&
        typeof response === "object" &&
        Array.isArray((response as { results?: unknown }).results)
      ? (response as { results: unknown[] }).results
      : [];

  return list
    .map((item) =>
      item && typeof item === "object" && "id" in item
        ? String((item as { id: unknown }).id)
        : null,
    )
    .filter((id): id is string => Boolean(id));
}

async function ingestPage(
  url: string,
  text: string,
): Promise<{ memoryIds: string[]; contentHash: string }> {
  const contentHash = hashContent(text);
  const memories = await memoryClient.add(
    [
      {
        role: "user",
        content: `Here is information about Shivam Taneja from the page ${url}: \n\n${text}`,
      },
    ],
    {
      user_id: MEM0_USER_ID,
      metadata: { source: url, type: "website_content" },
    },
  );

  return {
    contentHash,
    memoryIds: extractMemoryIds(memories),
  };
}

export async function GET(req: NextRequest) {
  if (serverEnv().NODE_ENV !== "development") {
    return new NextResponse("Not Found", { status: 404 });
  }

  const reset = req.nextUrl.searchParams.get("reset") === "1";

  try {
    if (reset) {
      console.log("Reset requested: wiping Mem0 + crawling_meta only...");
      await memoryClient.deleteAll({ userId: MEM0_USER_ID });
      await clearAllCrawlingMeta();
      return NextResponse.json({
        success: true,
        reset: true,
        message:
          "Reset complete. Mem0 and crawling_meta wiped. Call /api/chat/ingest (no reset) to ingest.",
      });
    }

    console.log("Starting sitemap fetch from localhost:3000...");

    const sitemapRes = await fetch(`${LOCAL_ORIGIN}/sitemap.xml`);
    if (!sitemapRes.ok) {
      throw new Error(`Failed to fetch sitemap: ${sitemapRes.status}`);
    }

    const xml = await sitemapRes.text();
    const result = await parseStringPromise(xml);

    const urls: string[] = result.urlset.url.map(
      (u: { loc: string[] }) => u.loc[0],
    );
    console.log(`Found ${urls.length} URLs in sitemap.`);

    const existingMeta = await getAllCrawlingMeta();
    const metaByUrl = new Map<string, CrawlingMetaData>(
      existingMeta.map((m) => [m.url, m]),
    );
    const seenUrls = new Set<string>();

    const summary = {
      added: [] as string[],
      updated: [] as string[],
      skipped: [] as string[],
      removed: [] as string[],
      failed: [] as string[],
    };

    for (const url of urls) {
      seenUrls.add(url);
      const localUrl = url.replace(SITE_ORIGIN, LOCAL_ORIGIN);
      console.log(`Fetching ${localUrl}...`);

      try {
        const pageRes = await fetch(localUrl);
        if (!pageRes.ok) {
          console.error(`Failed to fetch ${localUrl}: ${pageRes.status}`);
          summary.failed.push(url);
          continue;
        }

        const html = await pageRes.text();
        const $ = cheerio.load(html);

        $("script, style, nav, footer, header, noscript, iframe").remove();

        const mainContent = $("main").length ? $("main") : $("body");
        const text = mainContent.text().replace(/\s+/g, " ").trim();

        if (!text) {
          console.log(`No text content for ${url}, skipping.`);
          summary.skipped.push(url);
          continue;
        }

        const contentHash = hashContent(text);
        const previous = metaByUrl.get(url);

        if (previous && previous.contentHash === contentHash) {
          console.log(`Unchanged: ${url}`);
          summary.skipped.push(url);
          continue;
        }

        if (previous?.memoryIds?.length) {
          console.log(
            `Deleting ${previous.memoryIds.length} old memories for ${url}...`,
          );
          await deleteMemories(previous.memoryIds);
        }

        console.log(
          `${previous ? "Updating" : "Adding"} ${url} (${text.substring(0, 50)}...)`,
        );

        const { memoryIds } = await ingestPage(url, text);

        await upsertCrawlingMeta({
          url,
          contentHash,
          memoryIds,
          lastIngestedAt: new Date(),
        });

        if (previous) {
          summary.updated.push(url);
        } else {
          summary.added.push(url);
        }
      } catch (err) {
        console.error(`Error processing ${localUrl}:`, err);
        summary.failed.push(url);
      }
    }

    for (const meta of existingMeta) {
      if (seenUrls.has(meta.url)) continue;

      console.log(`Removing stale page from Mem0: ${meta.url}`);
      if (meta.memoryIds?.length) {
        await deleteMemories(meta.memoryIds);
      }
      await deleteCrawlingMetaByUrl(meta.url);
      summary.removed.push(meta.url);
    }

    return NextResponse.json({
      success: true,
      message: "Sitemap sync complete",
      counts: {
        added: summary.added.length,
        updated: summary.updated.length,
        skipped: summary.skipped.length,
        removed: summary.removed.length,
        failed: summary.failed.length,
      },
      details: summary,
    });
  } catch (error) {
    console.error("Failed to process sitemap ingestion:", error);
    return NextResponse.json(
      { error: "Failed to process sitemap ingestion", details: String(error) },
      { status: 500 },
    );
  }
}

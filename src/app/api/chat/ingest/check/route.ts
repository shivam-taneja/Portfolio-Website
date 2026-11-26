import { NextResponse } from "next/server";

import { diffSitemapAgainstMeta } from "@/lib/chat/ingest-diff";
import { serverEnv } from "@/lib/env/server";

export async function GET() {
  if (serverEnv().NODE_ENV !== "development") {
    return new NextResponse("Not Found", { status: 404 });
  }

  try {
    const { pages, counts } = await diffSitemapAgainstMeta();

    return NextResponse.json({
      success: true,
      dryRun: true,
      message:
        "Hash check only — nothing written to Mem0 or crawling_meta. would_* = what ingest would change.",
      counts,
      pages,
    });
  } catch (error) {
    console.error("Ingest hash check failed:", error);
    return NextResponse.json(
      { error: "Ingest hash check failed", details: String(error) },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";

import { getLatestKnowledgeUpdatedAt } from "@/lib/mongo";

export async function GET() {
  try {
    const updatedAt = await getLatestKnowledgeUpdatedAt();

    return NextResponse.json({
      updatedAt: updatedAt ? updatedAt.toISOString() : null,
    });
  } catch (error) {
    console.error("Failed to read knowledge freshness: ", error);
    return NextResponse.json(
      { error: "Failed to read knowledge freshness" },
      { status: 500 },
    );
  }
}

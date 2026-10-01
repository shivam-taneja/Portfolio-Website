import { ImageResponse } from "next/og";

import { OgCard } from "@/components/og/og-card";
import { loadHeadshot, loadOgFonts } from "@/lib/og/fonts";
import { getPageOg } from "@/lib/og/pages";
import { accentForProject } from "@/lib/og/projects";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ page: string }> },
) {
  const { page } = await params;
  const card = getPageOg(page);

  if (!card) {
    return new Response("Not found", { status: 404 });
  }

  const [fonts, headshot] = await Promise.all([loadOgFonts(), loadHeadshot()]);

  return new ImageResponse(
    <OgCard
      path={card.path}
      title={card.title}
      titleSize={card.titleSize}
      description={card.description}
      tags={card.tags}
      accent={accentForProject(page, card.accent)}
      headshot={headshot}
    />,
    {
      width: 1200,
      height: 630,
      fonts,
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    },
  );
}

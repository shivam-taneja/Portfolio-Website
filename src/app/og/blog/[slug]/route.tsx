import { ImageResponse } from "next/og";

import { OgCard } from "@/components/og/og-card";
import { getBlogOg } from "@/lib/og/blog";
import { loadHeadshot, loadOgFonts } from "@/lib/og/fonts";
import { accentForProject } from "@/lib/og/projects";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const card = getBlogOg(slug);

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
      accent={accentForProject(slug, card.accent)}
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

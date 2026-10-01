import { ImageResponse } from "next/og";

import { OgCard } from "@/components/og/og-card";
import { loadHeadshot, loadOgFonts } from "@/lib/og/fonts";
import { homeOg, homeOgKey } from "@/lib/og/home";
import { accentForProject } from "@/lib/og/projects";

export const runtime = "nodejs";

export async function GET() {
  const [fonts, headshot] = await Promise.all([loadOgFonts(), loadHeadshot()]);

  return new ImageResponse(
    <OgCard
      path={homeOg.path}
      title={homeOg.title}
      titleSize={homeOg.titleSize}
      description={homeOg.description}
      tags={homeOg.tags}
      accent={accentForProject(homeOgKey, homeOg.accent)}
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

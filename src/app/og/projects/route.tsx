import { ImageResponse } from "next/og";

import { OgCard } from "@/components/og/og-card";
import { loadHeadshot, loadOgFonts } from "@/lib/og/fonts";
import { accentForProject } from "@/lib/og/projects";
import { projectsIndexOg, projectsIndexOgKey } from "@/lib/og/projects-index";

export const runtime = "nodejs";

export async function GET() {
  const [fonts, headshot] = await Promise.all([loadOgFonts(), loadHeadshot()]);

  return new ImageResponse(
    <OgCard
      path={projectsIndexOg.path}
      title={projectsIndexOg.title}
      titleSize={projectsIndexOg.titleSize}
      description={projectsIndexOg.description}
      tags={projectsIndexOg.tags}
      accent={accentForProject(projectsIndexOgKey, projectsIndexOg.accent)}
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

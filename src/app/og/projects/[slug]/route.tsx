import { ImageResponse } from "next/og";

import { OgCard } from "@/components/og/og-card";
import { loadHeadshot, loadOgFonts } from "@/lib/og/fonts";
import {
  accentForProject,
  getProjectOg,
  projectOgPath,
  projectOgTitleSize,
} from "@/lib/og/projects";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const project = getProjectOg(slug);

  if (!project) {
    return new Response("Not found", { status: 404 });
  }

  const [fonts, headshot] = await Promise.all([loadOgFonts(), loadHeadshot()]);

  return new ImageResponse(
    <OgCard
      path={projectOgPath(project.name)}
      title={project.name}
      titleSize={projectOgTitleSize(project.name)}
      description={project.description}
      tags={project.tags}
      accent={accentForProject(slug, project.accent)}
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

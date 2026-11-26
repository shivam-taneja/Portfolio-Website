import { MetadataRoute } from "next";

import { getSitemapEntries } from "@/lib/site-pages";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getSitemapEntries();
}

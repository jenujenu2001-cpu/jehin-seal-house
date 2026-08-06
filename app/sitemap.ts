import type { MetadataRoute } from "next";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.jehinsealhouse.lk";
  const content = await getContent();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/services`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/contact`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/search`, changeFrequency: "monthly", priority: 0.4 }
  ];

  const categoryRoutes: MetadataRoute.Sitemap = content.categories.map((c) => ({
    url: `${siteUrl}/services/${c.id}`,
    changeFrequency: "weekly",
    priority: 0.7
  }));

  return [...staticRoutes, ...categoryRoutes];
}

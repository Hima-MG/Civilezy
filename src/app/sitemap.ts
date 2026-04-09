import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/data/blogs";

const BASE_URL = "https://civilezy.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // ── Static routes ────────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url:             `${BASE_URL}/`,
      lastModified:    now,
      changeFrequency: "weekly",
      priority:        1,
    },
    {
      url:             `${BASE_URL}/pricing`,
      lastModified:    now,
      changeFrequency: "weekly",
      priority:        0.9,
    },
    {
      url:             `${BASE_URL}/game-arena`,
      lastModified:    now,
      changeFrequency: "weekly",
      priority:        0.9,
    },
    {
      url:             `${BASE_URL}/blog`,
      lastModified:    now,
      changeFrequency: "weekly",
      priority:        0.8,
    },
  ];

  // ── Dynamic blog post routes ─────────────────────────────────────
  const blogRoutes: MetadataRoute.Sitemap = getAllSlugs().map(slug => ({
    url:             `${BASE_URL}/blog/${slug}`,
    lastModified:    now,
    changeFrequency: "weekly" as const,
    priority:        0.7,
  }));

  return [...staticRoutes, ...blogRoutes];
}
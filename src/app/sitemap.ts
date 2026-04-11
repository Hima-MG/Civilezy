import type { MetadataRoute } from "next";

// Canonical domain — must match layout.tsx metadataBase and robots.ts
const BASE_URL = "https://civilezy.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
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
  ];
}

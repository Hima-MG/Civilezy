import type { MetadataRoute } from "next";

const BASE_URL = "https://civilezy.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    // ── Core pages ──────────────────────────────────────────────────────────
    { url: `${BASE_URL}/`,                              lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE_URL}/pricing`,                       lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE_URL}/game-arena`,                    lastModified: now, changeFrequency: "weekly",  priority: 0.9 },

    // ── SEO landing page ─────────────────────────────────────────────────────
    { url: `${BASE_URL}/civil-psc-coaching-kerala`,     lastModified: now, changeFrequency: "monthly", priority: 0.95 },

    // ── Course pages ─────────────────────────────────────────────────────────
    { url: `${BASE_URL}/courses/iti`,                   lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/courses/diploma`,               lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/courses/btech`,                 lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/courses/surveyor`,              lastModified: now, changeFrequency: "monthly", priority: 0.8 },

    // ── Blog ────────────────────────────────────────────────────────────────
    { url: `${BASE_URL}/blogs`,                          lastModified: now, changeFrequency: "daily",   priority: 0.85 },

    // ── Company / legal ──────────────────────────────────────────────────────
    { url: `${BASE_URL}/about`,          lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/contact`,        lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE_URL}/terms`,          lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
  ];
}

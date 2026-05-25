import type { Timestamp } from "firebase/firestore";

export type BlogStatus = "draft" | "published" | "archived";

export interface Blog {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  tags: string[];
  authorName: string;
  authorPhoto: string;
  status: BlogStatus;
  isFeatured: boolean;
  seoTitle: string;
  seoDescription: string;
  views: number;
  readingTime: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  publishedAt: Timestamp | null;
}

export type BlogCreateInput = Omit<Blog, "id" | "createdAt" | "updatedAt" | "publishedAt" | "views">;

export type BlogUpdateInput = Partial<BlogCreateInput>;

export const BLOG_CATEGORIES = [
  "Kerala PSC AE",
  "BTech Engineering",
  "Civil Engineering",
  "Exam Preparation",
  "Career Guidance",
  "Interview Tips",
  "Government Jobs",
  "Technical Tutorials",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export const CATEGORY_META: Record<string, { color: string; bg: string; border: string }> = {
  "Kerala PSC AE":       { color: "#FF8534", bg: "rgba(255,133,52,0.12)",  border: "rgba(255,133,52,0.3)"  },
  "BTech Engineering":   { color: "#60a5fa", bg: "rgba(96,165,250,0.12)",  border: "rgba(96,165,250,0.3)"  },
  "Civil Engineering":   { color: "#34d399", bg: "rgba(52,211,153,0.12)",  border: "rgba(52,211,153,0.3)"  },
  "Exam Preparation":    { color: "#FFB800", bg: "rgba(255,184,0,0.12)",   border: "rgba(255,184,0,0.3)"   },
  "Career Guidance":     { color: "#c084fc", bg: "rgba(192,132,252,0.12)", border: "rgba(192,132,252,0.3)" },
  "Interview Tips":      { color: "#f472b6", bg: "rgba(244,114,182,0.12)", border: "rgba(244,114,182,0.3)" },
  "Government Jobs":     { color: "#a3e635", bg: "rgba(163,230,53,0.12)",  border: "rgba(163,230,53,0.3)"  },
  "Technical Tutorials": { color: "#38bdf8", bg: "rgba(56,189,248,0.12)",  border: "rgba(56,189,248,0.3)"  },
};

export function getCategoryMeta(cat: string) {
  return CATEGORY_META[cat] ?? { color: "#FF8534", bg: "rgba(255,133,52,0.12)", border: "rgba(255,133,52,0.3)" };
}

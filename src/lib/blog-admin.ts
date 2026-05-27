import { getAdminDb } from "@/lib/firebase-admin";
import type { Blog } from "@/types/blog";

const COL = "blogs";

function sortByPublishedAt(blogs: Blog[]): Blog[] {
  return blogs.sort((a, b) => {
    const aMs = (a.publishedAt as unknown as { toMillis?: () => number } | null)?.toMillis?.() ?? 0;
    const bMs = (b.publishedAt as unknown as { toMillis?: () => number } | null)?.toMillis?.() ?? 0;
    return bMs - aMs;
  });
}

export async function getPublishedBlogsAdmin(limitCount = 24): Promise<Blog[]> {
  const db = getAdminDb();
  try {
    const snap = await db
      .collection(COL)
      .where("status", "==", "published")
      .orderBy("publishedAt", "desc")
      .limit(limitCount)
      .get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Blog));
  } catch (err) {
    console.error("[blog-admin] getPublishedBlogsAdmin indexed query failed — falling back to in-memory sort:", err);
    try {
      const snap = await db
        .collection(COL)
        .where("status", "==", "published")
        .get();
      const blogs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Blog));
      return sortByPublishedAt(blogs).slice(0, limitCount);
    } catch (fallbackErr) {
      console.error("[blog-admin] getPublishedBlogsAdmin fallback also failed:", fallbackErr);
      return [];
    }
  }
}

export async function getFeaturedBlogsAdmin(limitCount = 3): Promise<Blog[]> {
  const db = getAdminDb();
  try {
    const snap = await db
      .collection(COL)
      .where("status", "==", "published")
      .where("isFeatured", "==", true)
      .orderBy("publishedAt", "desc")
      .limit(limitCount)
      .get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Blog));
  } catch (err) {
    console.error("[blog-admin] getFeaturedBlogsAdmin indexed query failed — falling back:", err);
    try {
      const snap = await db
        .collection(COL)
        .where("status", "==", "published")
        .where("isFeatured", "==", true)
        .get();
      const blogs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Blog));
      return sortByPublishedAt(blogs).slice(0, limitCount);
    } catch (fallbackErr) {
      console.error("[blog-admin] getFeaturedBlogsAdmin fallback also failed:", fallbackErr);
      return [];
    }
  }
}

export async function getBlogBySlugAdmin(slug: string): Promise<Blog | null> {
  const db = getAdminDb();
  try {
    const snap = await db
      .collection(COL)
      .where("slug", "==", slug)
      .where("status", "==", "published")
      .limit(1)
      .get();
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...d.data() } as Blog;
  } catch (err) {
    console.error(`[blog-admin] getBlogBySlugAdmin("${slug}") failed — trying slug-only fallback:`, err);
    try {
      const snap = await db
        .collection(COL)
        .where("slug", "==", slug)
        .limit(1)
        .get();
      if (snap.empty) return null;
      const d = snap.docs[0];
      const blog = { id: d.id, ...d.data() } as Blog;
      if (blog.status !== "published") return null;
      return blog;
    } catch (fallbackErr) {
      console.error(`[blog-admin] getBlogBySlugAdmin fallback also failed:`, fallbackErr);
      return null;
    }
  }
}

export async function getRelatedBlogsAdmin(
  category: string,
  excludeId: string,
  limitCount = 3,
): Promise<Blog[]> {
  const db = getAdminDb();
  try {
    const snap = await db
      .collection(COL)
      .where("status", "==", "published")
      .where("category", "==", category)
      .orderBy("publishedAt", "desc")
      .limit(limitCount + 1)
      .get();
    return snap.docs
      .filter((d) => d.id !== excludeId)
      .slice(0, limitCount)
      .map((d) => ({ id: d.id, ...d.data() } as Blog));
  } catch (err) {
    console.error("[blog-admin] getRelatedBlogsAdmin indexed query failed — falling back:", err);
    try {
      const snap = await db
        .collection(COL)
        .where("status", "==", "published")
        .where("category", "==", category)
        .get();
      const blogs = snap.docs
        .filter((d) => d.id !== excludeId)
        .map((d) => ({ id: d.id, ...d.data() } as Blog));
      return sortByPublishedAt(blogs).slice(0, limitCount);
    } catch (fallbackErr) {
      console.error("[blog-admin] getRelatedBlogsAdmin fallback also failed:", fallbackErr);
      return [];
    }
  }
}

export async function getBlogsByCategory(category: string, limitCount = 12): Promise<Blog[]> {
  const db = getAdminDb();
  try {
    const snap = await db
      .collection(COL)
      .where("status", "==", "published")
      .where("category", "==", category)
      .orderBy("publishedAt", "desc")
      .limit(limitCount)
      .get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Blog));
  } catch (err) {
    console.error("[blog-admin] getBlogsByCategory indexed query failed — falling back:", err);
    try {
      const snap = await db
        .collection(COL)
        .where("status", "==", "published")
        .where("category", "==", category)
        .get();
      const blogs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Blog));
      return sortByPublishedAt(blogs).slice(0, limitCount);
    } catch (fallbackErr) {
      console.error("[blog-admin] getBlogsByCategory fallback also failed:", fallbackErr);
      return [];
    }
  }
}

export async function getAllPublishedSlugsAdmin(): Promise<string[]> {
  try {
    const db = getAdminDb();
    const snap = await db
      .collection(COL)
      .where("status", "==", "published")
      .select("slug")
      .get();
    return snap.docs.map((d) => d.data().slug as string).filter(Boolean);
  } catch (err) {
    console.error("[blog-admin] getAllPublishedSlugsAdmin failed:", err);
    return [];
  }
}

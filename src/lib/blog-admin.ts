import { getAdminDb } from "@/lib/firebase-admin";
import type { Blog } from "@/types/blog";

const COL = "blogs";

export async function getPublishedBlogsAdmin(limitCount = 24): Promise<Blog[]> {
  try {
    const db = getAdminDb();
    const snap = await db
      .collection(COL)
      .where("status", "==", "published")
      .orderBy("publishedAt", "desc")
      .limit(limitCount)
      .get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Blog));
  } catch {
    return [];
  }
}

export async function getFeaturedBlogsAdmin(limitCount = 3): Promise<Blog[]> {
  try {
    const db = getAdminDb();
    const snap = await db
      .collection(COL)
      .where("status", "==", "published")
      .where("isFeatured", "==", true)
      .orderBy("publishedAt", "desc")
      .limit(limitCount)
      .get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Blog));
  } catch {
    return [];
  }
}

export async function getBlogBySlugAdmin(slug: string): Promise<Blog | null> {
  try {
    const db = getAdminDb();
    const snap = await db
      .collection(COL)
      .where("slug", "==", slug)
      .where("status", "==", "published")
      .limit(1)
      .get();
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...d.data() } as Blog;
  } catch {
    return null;
  }
}

export async function getRelatedBlogsAdmin(
  category: string,
  excludeId: string,
  limitCount = 3,
): Promise<Blog[]> {
  try {
    const db = getAdminDb();
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
  } catch {
    return [];
  }
}

export async function getBlogsByCategory(category: string, limitCount = 12): Promise<Blog[]> {
  try {
    const db = getAdminDb();
    const snap = await db
      .collection(COL)
      .where("status", "==", "published")
      .where("category", "==", category)
      .orderBy("publishedAt", "desc")
      .limit(limitCount)
      .get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Blog));
  } catch {
    return [];
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
    return snap.docs.map((d) => d.data().slug as string);
  } catch {
    return [];
  }
}

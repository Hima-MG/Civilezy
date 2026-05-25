import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Blog, BlogCreateInput, BlogUpdateInput } from "@/types/blog";

const COL = "blogs";
const col = () => collection(db, COL);

export function calcReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export async function createBlog(input: BlogCreateInput): Promise<string> {
  const ref = await addDoc(col(), {
    ...input,
    views: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    publishedAt: input.status === "published" ? serverTimestamp() : null,
  });
  return ref.id;
}

export async function updateBlog(id: string, input: BlogUpdateInput): Promise<void> {
  const ref = doc(db, COL, id);
  const payload: Record<string, unknown> = { ...input, updatedAt: serverTimestamp() };
  if (input.status === "published") {
    const snap = await getDoc(ref);
    if (snap.exists() && !snap.data().publishedAt) {
      payload.publishedAt = serverTimestamp();
    }
  }
  await updateDoc(ref, payload);
}

export async function deleteBlog(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}

export async function getBlogById(id: string): Promise<Blog | null> {
  const snap = await getDoc(doc(db, COL, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Blog;
}

export async function listAllBlogs(): Promise<Blog[]> {
  const snap = await getDocs(query(col(), orderBy("createdAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Blog));
}

export async function publishBlog(id: string): Promise<void> {
  await updateDoc(doc(db, COL, id), {
    status: "published",
    publishedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function unpublishBlog(id: string): Promise<void> {
  await updateDoc(doc(db, COL, id), {
    status: "draft",
    updatedAt: serverTimestamp(),
  });
}

export async function incrementViews(id: string): Promise<void> {
  await updateDoc(doc(db, COL, id), { views: increment(1) });
}

export async function listPublishedBlogs(limitCount = 20): Promise<Blog[]> {
  const q = query(col(), where("status", "==", "published"), orderBy("publishedAt", "desc"), limit(limitCount));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Blog));
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  const q = query(col(), where("slug", "==", slug), where("status", "==", "published"), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as Blog;
}

export async function listFeaturedBlogs(limitCount = 3): Promise<Blog[]> {
  const q = query(
    col(),
    where("status", "==", "published"),
    where("isFeatured", "==", true),
    orderBy("publishedAt", "desc"),
    limit(limitCount),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Blog));
}

export async function listBlogsByCategory(category: string, limitCount = 10): Promise<Blog[]> {
  const q = query(
    col(),
    where("status", "==", "published"),
    where("category", "==", category),
    orderBy("publishedAt", "desc"),
    limit(limitCount),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Blog));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

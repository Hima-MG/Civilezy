/**
 * POST /api/admin/chatbot/sync
 *
 * Syncs the `knowledge_base` Firestore collection from various sources.
 * Supports syncing: static (hardcoded course/feature data), ebooks,
 * announcements, and blogs.
 *
 * Body: { source: "all" | "static" | "ebooks" | "announcements" | "blogs" }
 *
 * GET /api/admin/chatbot/sync
 * Returns knowledge base stats (total, by source, last sync times).
 */

import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { buildStaticChunks, type KnowledgeChunk } from "@/lib/chatbotKnowledge";

const ADMIN_PASSPHRASE = "civilezy2026admin";

function checkAuth(req: NextRequest): boolean {
  return req.headers.get("x-admin-passphrase") === ADMIN_PASSPHRASE;
}

// ── Delete all knowledge_base docs for a given source ─────────────────────────
async function deleteBySource(
  db: FirebaseFirestore.Firestore,
  source: string
): Promise<number> {
  const snap = await db
    .collection("knowledge_base")
    .where("source", "==", source)
    .get();

  if (snap.empty) return 0;

  // Delete in batches of 400 (safe Firestore batch limit)
  const batches: FirebaseFirestore.WriteBatch[] = [];
  let current = db.batch();
  let count = 0;

  snap.docs.forEach((doc) => {
    current.delete(doc.ref);
    count++;
    if (count % 400 === 0) {
      batches.push(current);
      current = db.batch();
    }
  });
  if (count % 400 !== 0) batches.push(current);

  await Promise.all(batches.map((b) => b.commit()));
  return snap.size;
}

// ── Write chunks in batches of 400 ───────────────────────────────────────────
async function writeChunks(
  db: FirebaseFirestore.Firestore,
  chunks: KnowledgeChunk[]
): Promise<void> {
  const batches: FirebaseFirestore.WriteBatch[] = [];
  let current = db.batch();
  let count = 0;

  for (const chunk of chunks) {
    const ref = db.collection("knowledge_base").doc();
    current.set(ref, chunk);
    count++;
    if (count % 400 === 0) {
      batches.push(current);
      current = db.batch();
    }
  }
  if (count % 400 !== 0) batches.push(current);

  for (const batch of batches) {
    await batch.commit();
  }
}

// ── Sync static knowledge (hardcoded course/feature data) ────────────────────
async function syncStatic(db: FirebaseFirestore.Firestore): Promise<number> {
  await deleteBySource(db, "static");
  await deleteBySource(db, "course"); // course chunks are also hardcoded static
  const chunks = buildStaticChunks();
  await writeChunks(db, chunks);
  return chunks.length;
}

// ── Sync ebooks from Firestore ──────────────────────────────────────────────
async function syncEbooks(db: FirebaseFirestore.Firestore): Promise<number> {
  await deleteBySource(db, "ebook");

  const snap = await db
    .collection("ebooks")
    .where("published", "==", true)
    .get();

  if (snap.empty) return 0;

  const now = new Date().toISOString();
  const chunks: KnowledgeChunk[] = snap.docs.map((doc) => {
    const d = doc.data();
    const priceInfo = d.promotion?.enabled
      ? `Offer price: ₹${d.promotion.offerPrice} (was ₹${d.price}). ${d.promotion.badgeText || ""}`
      : `Price: ₹${d.price}`;

    const features = Array.isArray(d.features)
      ? d.features.slice(0, 6).join(", ")
      : "";

    const modules = Array.isArray(d.modules)
      ? `Modules: ${d.modules.slice(0, 5).join(", ")}`
      : "";

    const content = [
      `${d.title}`,
      d.description ? d.description.slice(0, 300) : "",
      priceInfo,
      features ? `Includes: ${features}` : "",
      modules,
      `Exam: ${d.exam || "Kerala PSC Civil Engineering"}`,
      d.level ? `Level: ${d.level}` : "",
      `Purchase: https://www.civilezy.in/ebooks/${d.slug || doc.id}`,
    ]
      .filter(Boolean)
      .join("\n");

    // Extract keywords from title, exam, level, modules
    const rawWords = [
      ...(d.title || "").toLowerCase().split(/\s+/),
      d.exam?.toLowerCase() || "",
      d.level?.toLowerCase() || "",
      "ebook", "e-book", "book", "study material", "buy", "purchase",
      ...(Array.isArray(d.modules)
        ? d.modules.map((m: string) => m.toLowerCase())
        : []),
    ].filter((w) => w.length > 2);
    const keywords = Array.from(new Set(rawWords)).slice(0, 20);

    return {
      source: "ebook" as const,
      title: d.title || "CivilEzy E-Book",
      content,
      keywords,
      category: "EBooks",
      url: `https://www.civilezy.in/ebooks/${d.slug || doc.id}`,
      sourceId: doc.id,
      syncedAt: now,
      status: "active" as const,
    };
  });

  await writeChunks(db, chunks);
  return chunks.length;
}

// ── Sync announcements from Firestore ─────────────────────────────────────────
async function syncAnnouncements(db: FirebaseFirestore.Firestore): Promise<number> {
  await deleteBySource(db, "announcement");

  const snap = await db
    .collection("announcements")
    .orderBy("createdAt", "desc")
    .limit(50)
    .get();

  if (snap.empty) return 0;

  const now = new Date().toISOString();
  const chunks: KnowledgeChunk[] = snap.docs.map((doc) => {
    const d = doc.data();
    const rawText = (d.content || d.message || d.body || d.text || "").slice(0, 500);

    const content = [
      d.title ? `Announcement: ${d.title}` : "CivilEzy Announcement",
      rawText,
      d.date
        ? `Date: ${
            typeof d.date === "string"
              ? d.date
              : d.date?.toDate?.()?.toLocaleDateString?.("en-IN") ?? ""
          }`
        : "",
    ]
      .filter(Boolean)
      .join("\n");

    const titleWords = (d.title || "").toLowerCase().split(/\s+/).filter((w: string) => w.length > 2);
    const keywords = [
      ...titleWords,
      "announcement", "update", "news", "notice",
      ...(d.category ? [d.category.toLowerCase()] : []),
    ].slice(0, 15);

    return {
      source: "announcement" as const,
      title: d.title || "CivilEzy Announcement",
      content,
      keywords,
      category: d.category || "General",
      sourceId: doc.id,
      syncedAt: now,
      status: "active" as const,
    };
  });

  await writeChunks(db, chunks);
  return chunks.length;
}

// ── Sync blogs from Firestore ─────────────────────────────────────────────────
async function syncBlogs(db: FirebaseFirestore.Firestore): Promise<number> {
  await deleteBySource(db, "blog");

  const snap = await db
    .collection("blogs")
    .where("status", "==", "published")
    .limit(100)
    .get();

  if (snap.empty) return 0;

  const now = new Date().toISOString();
  const chunks: KnowledgeChunk[] = snap.docs.map((doc) => {
    const d = doc.data();
    // Use excerpt for search, not full content (keeps chunks lean)
    const content = [
      d.title,
      d.excerpt ? d.excerpt.slice(0, 400) : "",
      d.category ? `Category: ${d.category}` : "",
      Array.isArray(d.tags) && d.tags.length
        ? `Topics: ${d.tags.slice(0, 6).join(", ")}`
        : "",
      `Read more: https://www.civilezy.in/blogs/${d.slug}`,
    ]
      .filter(Boolean)
      .join("\n");

    const titleWords = (d.title || "").toLowerCase().split(/\s+/).filter((w: string) => w.length > 2);
    const tagWords = Array.isArray(d.tags)
      ? d.tags.map((t: string) => t.toLowerCase())
      : [];
    const keywords = [
      ...titleWords,
      ...tagWords,
      "blog", "article", "read",
      ...(d.category ? [d.category.toLowerCase()] : []),
    ].slice(0, 20);

    return {
      source: "blog" as const,
      title: d.title || "CivilEzy Blog",
      content,
      keywords,
      category: d.category || "General",
      url: `https://www.civilezy.in/blogs/${d.slug}`,
      sourceId: doc.id,
      syncedAt: now,
      status: "active" as const,
    };
  });

  await writeChunks(db, chunks);
  return chunks.length;
}

// ── GET: Knowledge base stats ─────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = getAdminDb();
    const snap = await db.collection("knowledge_base").get();

    const bySource: Record<string, number> = {};
    let lastSyncAt: string | null = null;

    snap.docs.forEach((doc) => {
      const d = doc.data();
      const src = d.source || "unknown";
      bySource[src] = (bySource[src] || 0) + 1;
      if (!lastSyncAt || (d.syncedAt && d.syncedAt > lastSyncAt)) {
        lastSyncAt = d.syncedAt;
      }
    });

    return NextResponse.json({
      total: snap.size,
      bySource,
      lastSyncAt,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// ── POST: Trigger sync ────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const source: string = body.source ?? "all";

    const db = getAdminDb();
    const results: Record<string, number> = {};

    if (source === "all" || source === "static") {
      results.static = await syncStatic(db);
    }
    if (source === "all" || source === "ebooks") {
      results.ebooks = await syncEbooks(db);
    }
    if (source === "all" || source === "announcements") {
      results.announcements = await syncAnnouncements(db);
    }
    if (source === "all" || source === "blogs") {
      results.blogs = await syncBlogs(db);
    }

    const total = Object.values(results).reduce((s, n) => s + n, 0);

    return NextResponse.json({
      success: true,
      synced: results,
      total,
      syncedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[sync/route] error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Ebook, EbookInput } from "@/types/ebook";

const COL = "ebooks";

function toEbook(id: string, data: Record<string, unknown>): Ebook {
  return { id, ...(data as Omit<Ebook, "id">) };
}

// Sorts newest-first using the Firestore Timestamp if present.
function byCreatedAtDesc(a: Ebook, b: Ebook): number {
  const toMs = (t: unknown) =>
    t && typeof (t as Timestamp).toMillis === "function"
      ? (t as Timestamp).toMillis()
      : 0;
  return toMs(b.createdAt) - toMs(a.createdAt);
}

// ── Read functions ────────────────────────────────────────────────────────────

/** Admin: fetch every ebook regardless of published status. */
export async function getAllEbooks(): Promise<Ebook[]> {
  const snap = await getDocs(collection(db, COL));
  return snap.docs.map((d) => toEbook(d.id, d.data())).sort(byCreatedAtDesc);
}

/**
 * Public listing page: published ebooks only.
 * Single-field where clause → no composite index needed.
 */
export async function getPublishedEbooks(): Promise<Ebook[]> {
  const snap = await getDocs(
    query(collection(db, COL), where("published", "==", true))
  );
  return snap.docs.map((d) => toEbook(d.id, d.data())).sort(byCreatedAtDesc);
}

/**
 * Homepage featured section: published + featured.
 * Filters featured client-side to avoid a composite index.
 */
export async function getFeaturedEbooks(): Promise<Ebook[]> {
  const snap = await getDocs(
    query(collection(db, COL), where("published", "==", true))
  );
  return snap.docs
    .map((d) => toEbook(d.id, d.data()))
    .filter((e) => e.featured)
    .sort(byCreatedAtDesc);
}

/**
 * Featured offers section: published ebooks where promotion.featured == true.
 * Filters client-side to avoid composite indexes.
 */
export async function getFeaturedOfferEbooks(): Promise<Ebook[]> {
  const snap = await getDocs(
    query(collection(db, COL), where("published", "==", true))
  );
  return snap.docs
    .map((d) => toEbook(d.id, d.data()))
    .filter((e) => e.promotion?.enabled && e.promotion?.featured)
    .sort(byCreatedAtDesc);
}

/**
 * Detail page: look up by slug, check published client-side.
 * Single-field where clause → no composite index needed.
 */
export async function getEbookBySlug(slug: string): Promise<Ebook | null> {
  const snap = await getDocs(
    query(collection(db, COL), where("slug", "==", slug))
  );
  if (snap.empty) return null;
  const ebook = toEbook(snap.docs[0].id, snap.docs[0].data());
  return ebook.published ? ebook : null;
}

// ── Write functions ───────────────────────────────────────────────────────────

export async function addEbook(input: EbookInput): Promise<string> {
  const docRef = await addDoc(collection(db, COL), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateEbook(
  id: string,
  input: Partial<EbookInput>
): Promise<void> {
  await updateDoc(doc(db, COL, id), {
    ...input,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteEbook(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}

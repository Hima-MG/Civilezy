import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Ebook, EbookInput } from "@/types/ebook";

const COL = "ebooks";

function toEbook(id: string, data: Record<string, unknown>): Ebook {
  return { id, ...(data as Omit<Ebook, "id">) };
}

export async function getAllEbooks(): Promise<Ebook[]> {
  const snap = await getDocs(
    query(collection(db, COL), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => toEbook(d.id, d.data()));
}

export async function getPublishedEbooks(): Promise<Ebook[]> {
  const snap = await getDocs(
    query(
      collection(db, COL),
      where("published", "==", true),
      orderBy("createdAt", "desc")
    )
  );
  return snap.docs.map((d) => toEbook(d.id, d.data()));
}

export async function getFeaturedEbooks(): Promise<Ebook[]> {
  const snap = await getDocs(
    query(
      collection(db, COL),
      where("published", "==", true),
      where("featured", "==", true),
      orderBy("createdAt", "desc")
    )
  );
  return snap.docs.map((d) => toEbook(d.id, d.data()));
}

export async function getEbookBySlug(slug: string): Promise<Ebook | null> {
  const snap = await getDocs(
    query(
      collection(db, COL),
      where("slug", "==", slug),
      where("published", "==", true)
    )
  );
  if (snap.empty) return null;
  const d = snap.docs[0];
  return toEbook(d.id, d.data());
}

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

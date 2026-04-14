import { collection, getDocs, writeBatch, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const COL = "questions";
const BATCH_SIZE = 500; // Firestore writeBatch limit

/**
 * Deletes ALL documents from the "questions" collection in batches.
 *
 * @param onProgress  Called after each batch with (deleted, total).
 * @returns           Total number of documents deleted.
 * @throws            On any Firestore error — caller must handle.
 */
export async function deleteAllQuestions(
  onProgress?: (deleted: number, total: number) => void,
): Promise<number> {
  // 1. Fetch every doc ID (lightweight — we only need refs)
  const snap = await getDocs(collection(db, COL));
  const total = snap.size;

  if (total === 0) return 0;

  // 2. Delete in batches of 500
  const docRefs = snap.docs.map((d) => d.ref);
  let deleted = 0;

  for (let i = 0; i < docRefs.length; i += BATCH_SIZE) {
    const chunk = docRefs.slice(i, i + BATCH_SIZE);
    const batch = writeBatch(db);
    chunk.forEach((ref) => batch.delete(ref));
    await batch.commit();
    deleted += chunk.length;
    onProgress?.(deleted, total);
  }

  return deleted;
}

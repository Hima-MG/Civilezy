import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * Permanently delete a game arena report from Firestore.
 *
 * Throws (and logs) on failure so the caller can surface the real reason.
 */
export async function deleteReport(reportId: string): Promise<void> {
  if (!reportId) {
    throw new Error("deleteReport: reportId is empty");
  }

  console.log(`[deleteReport] deleting ${reportId}`);

  try {
    await deleteDoc(doc(db, "game_arena_reports", reportId));
    console.log(`[deleteReport] ✅ success`);
  } catch (err) {
    console.error(`[deleteReport] ❌ failed — reportId: ${reportId}`, err);
    throw err;
  }
}

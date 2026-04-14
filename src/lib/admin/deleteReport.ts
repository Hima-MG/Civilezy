import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * Permanently delete a game arena report from Firestore.
 */
export async function deleteReport(reportId: string): Promise<void> {
  await deleteDoc(doc(db, "game_arena_reports", reportId));
}

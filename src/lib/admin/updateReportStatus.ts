import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { ReportStatus } from "./getReportedIssues";

/**
 * Update the status field of a game_arena_reports document.
 *
 * Throws (and logs) on failure so the caller can surface the real reason
 * instead of showing a generic "failed" message.
 */
export async function updateReportStatus(
  reportId: string,
  status: ReportStatus,
): Promise<void> {
  if (!reportId) {
    throw new Error("updateReportStatus: reportId is empty");
  }

  console.log(`[updateReportStatus] ${reportId} → "${status}"`);

  try {
    await updateDoc(doc(db, "game_arena_reports", reportId), { status });
    console.log(`[updateReportStatus] ✅ success`);
  } catch (err) {
    // Surface the real Firebase error code (e.g. "permission-denied")
    console.error(`[updateReportStatus] ❌ failed — reportId: ${reportId}, status: ${status}`, err);
    throw err;          // re-throw so UI catch block can inspect it
  }
}

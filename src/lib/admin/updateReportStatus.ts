import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { ReportStatus } from "./getReportedIssues";

/**
 * Update the status of a game arena report.
 */
export async function updateReportStatus(
  reportId: string,
  status: ReportStatus,
): Promise<void> {
  await updateDoc(doc(db, "game_arena_reports", reportId), { status });
}

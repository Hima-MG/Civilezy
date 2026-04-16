import { collection, getDocs, query, orderBy, limit, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { IssueType } from "@/lib/reportGameArenaIssue";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type ReportStatus = "pending" | "reviewed" | "resolved";

export interface ReportDoc {
  id: string;
  questionId: string;
  questionText: string;
  selectedDomain: string;
  selectedDifficulty: string;
  issueType: IssueType;
  description: string;
  userName: string | null;
  createdAt: Timestamp | null;
  status: ReportStatus;
}

// ---------------------------------------------------------------------------
// Fetch all reports, newest first
// ---------------------------------------------------------------------------
export async function getReportedIssues(max: number = 100): Promise<ReportDoc[]> {
  const q = query(
    collection(db, "game_arena_reports"),
    orderBy("createdAt", "desc"),
    limit(max),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ReportDoc);
}

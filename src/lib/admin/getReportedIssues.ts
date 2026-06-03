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
  createdAt: { toDate: () => Date } | string | null;
  status: ReportStatus;
}

// ---------------------------------------------------------------------------
// Fetch all reports via Admin-SDK API route
//
// WHY: The Firestore rule `allow read: if isAdmin()` requires a Firebase Auth
// user with the custom claim admin==true.  The admin panel uses a passphrase,
// so request.auth is null → every direct client-SDK read returns
// PERMISSION_DENIED.  The /api/admin/reports route uses the Admin SDK which
// bypasses Firestore rules entirely.
// ---------------------------------------------------------------------------
export async function getReportedIssues(_max?: number): Promise<ReportDoc[]> {
  console.log("[getReportedIssues] fetching via /api/admin/reports");

  const res = await fetch("/api/admin/reports", { cache: "no-store" });

  if (!res.ok) {
    let errMsg = `HTTP ${res.status}`;
    try {
      const json = await res.json() as { error?: string };
      if (json.error) errMsg = json.error;
    } catch { /* ignore parse errors */ }

    console.error("[getReportedIssues] ✗ API error:", errMsg);
    throw new Error(errMsg);
  }

  const json = await res.json() as { reports: ReportDoc[]; _count: number };
  console.log(`[getReportedIssues] ✅ ${json._count} report(s) loaded`);

  if (json._count > 0) {
    console.log("[getReportedIssues] Sample report:", {
      id:         json.reports[0]?.id,
      issueType:  json.reports[0]?.issueType,
      status:     json.reports[0]?.status,
      questionId: json.reports[0]?.questionId,
    });
  }

  return json.reports ?? [];
}

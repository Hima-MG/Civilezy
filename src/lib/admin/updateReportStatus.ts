import type { ReportStatus } from "./getReportedIssues";

/**
 * Update the status field of a game_arena_reports document via Admin-SDK
 * API route.
 *
 * WHY NOT client SDK:
 *   Firestore rule `allow update: if isAdmin()` requires Firebase Auth with
 *   admin custom claim.  The admin panel uses a passphrase (no Firebase Auth),
 *   so direct client-SDK writes return PERMISSION_DENIED.  The API route uses
 *   the Admin SDK which bypasses rules entirely.
 *
 * Throws on failure so the caller can surface the real reason.
 */
export async function updateReportStatus(
  reportId: string,
  status: ReportStatus,
): Promise<void> {
  if (!reportId) {
    throw new Error("updateReportStatus: reportId is empty");
  }

  console.log(`[updateReportStatus] ${reportId} → "${status}"`);

  const res = await fetch("/api/admin/reports", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: reportId, status }),
  });

  if (!res.ok) {
    let errMsg = `HTTP ${res.status}`;
    try {
      const json = await res.json() as { error?: string };
      if (json.error) errMsg = json.error;
    } catch { /* ignore */ }

    console.error(`[updateReportStatus] ❌ failed — reportId: ${reportId}`, errMsg);
    // Mimic the Firebase "permission-denied" code shape so callers that check
    // `err.code === "permission-denied"` still work correctly.
    if (res.status === 403) {
      const e = new Error(errMsg) as Error & { code: string };
      e.code = "permission-denied";
      throw e;
    }
    throw new Error(errMsg);
  }

  console.log(`[updateReportStatus] ✅ success`);
}

/**
 * Permanently delete a game arena report via Admin-SDK API route.
 *
 * WHY NOT client SDK:
 *   The Firestore rule for game_arena_reports has `allow delete: if false`
 *   which blocks ALL client-SDK deletes regardless of auth state.  The API
 *   route uses the Admin SDK which bypasses rules entirely.
 *
 * Throws on failure so the caller can surface the real reason.
 */
export async function deleteReport(reportId: string): Promise<void> {
  if (!reportId) {
    throw new Error("deleteReport: reportId is empty");
  }

  console.log(`[deleteReport] deleting ${reportId}`);

  const res = await fetch(`/api/admin/reports?id=${encodeURIComponent(reportId)}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    let errMsg = `HTTP ${res.status}`;
    try {
      const json = await res.json() as { error?: string };
      if (json.error) errMsg = json.error;
    } catch { /* ignore */ }

    console.error(`[deleteReport] ❌ failed — reportId: ${reportId}`, errMsg);
    if (res.status === 403) {
      const e = new Error(errMsg) as Error & { code: string };
      e.code = "permission-denied";
      throw e;
    }
    throw new Error(errMsg);
  }

  console.log(`[deleteReport] ✅ success`);
}

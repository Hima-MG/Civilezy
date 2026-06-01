import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

/**
 * Admin-SDK route for game_arena_reports.
 *
 * WHY THIS EXISTS:
 *   The client-side Firestore rules protect game_arena_reports with
 *   `allow read: if isAdmin()` — which requires a Firebase Auth user with
 *   the custom claim `admin == true`.  The admin panel uses a passphrase
 *   (not Firebase Auth), so request.auth is null and every client-SDK read
 *   returns PERMISSION_DENIED.
 *
 *   The Admin SDK bypasses Firestore security rules entirely, so we can
 *   safely serve reports here.  Same pattern as /api/tickets/list.
 *
 * Force-dynamic: this route reads live Firestore data. Without this flag,
 * Next.js App Router may statically cache the GET response at build time
 * (same bug fixed in /api/tickets/list).
 */
export const dynamic = "force-dynamic";

// ── GET /api/admin/reports  →  list all reports, newest first ────────────────
export async function GET() {
  const t0 = Date.now();
  console.log("[api/admin/reports] GET — fetching game_arena_reports via Admin SDK");

  try {
    const db = getAdminDb();
    const snap = await db
      .collection("game_arena_reports")
      .orderBy("createdAt", "desc")
      .limit(200)
      .get();

    console.log(`[api/admin/reports] snap.size = ${snap.size}`);

    if (snap.empty) {
      console.warn("[api/admin/reports] ⚠️  Collection is empty or does not exist");
    }

    const reports = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        // Serialize Firestore Timestamps to ISO strings so they survive JSON
        createdAt: data.createdAt?.toDate?.()?.toISOString() ?? null,
      };
    });

    console.log(
      `[api/admin/reports] ✅ Returning ${reports.length} reports in ${Date.now() - t0}ms`,
    );
    return NextResponse.json({ reports, _count: reports.length });
  } catch (err) {
    const msg = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    console.error(`[api/admin/reports] ✗ GET failed:`, msg);
    return NextResponse.json({ error: msg, reports: [], _count: 0 }, { status: 500 });
  }
}

// ── PATCH /api/admin/reports  →  update status ───────────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json() as { id: string; status: string };
    const { id, status } = body;

    if (!id)     return NextResponse.json({ error: "Missing id" },     { status: 400 });
    if (!status) return NextResponse.json({ error: "Missing status" }, { status: 400 });

    const allowed = ["pending", "reviewed", "resolved"];
    if (!allowed.includes(status)) {
      return NextResponse.json({ error: `Invalid status: ${status}` }, { status: 400 });
    }

    console.log(`[api/admin/reports] PATCH — ${id} → "${status}"`);

    const db = getAdminDb();
    await db.collection("game_arena_reports").doc(id).update({
      status,
      updatedAt: FieldValue.serverTimestamp(),
    });

    console.log(`[api/admin/reports] ✅ PATCH success`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    console.error(`[api/admin/reports] ✗ PATCH failed:`, msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// ── DELETE /api/admin/reports?id=<docId>  →  delete a report ────────────────
export async function DELETE(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  console.log(`[api/admin/reports] DELETE — ${id}`);

  try {
    const db = getAdminDb();
    await db.collection("game_arena_reports").doc(id).delete();
    console.log(`[api/admin/reports] ✅ DELETE success`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    console.error(`[api/admin/reports] ✗ DELETE failed:`, msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

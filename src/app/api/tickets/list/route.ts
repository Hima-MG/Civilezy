import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

const STATUS_NORM: Record<string, string> = {
  open: "OPEN", "in progress": "IN_PROGRESS", in_progress: "IN_PROGRESS",
  "waiting for student": "WAITING_FOR_STUDENT", waiting_for_student: "WAITING_FOR_STUDENT",
  resolved: "RESOLVED", closed: "CLOSED", reopened: "REOPENED",
};
function normalizeStatus(s: unknown): string | undefined {
  if (typeof s !== "string") return s as undefined;
  return STATUS_NORM[s.toLowerCase()] ?? s;
}

export async function GET() {
  const t0 = Date.now();
  console.log("[tickets/list] ▶ GET /api/tickets/list");

  try {
    const db = getAdminDb();

    // ── Fetch WITHOUT orderBy ──────────────────────────────────────────────────
    // IMPORTANT: Firestore silently drops documents whose `createdAt` field is
    // not a valid Timestamp when you add .orderBy("createdAt").  To avoid this
    // edge-case we fetch the whole collection and sort in JavaScript instead.
    console.log("[tickets/list] Querying collection: support_tickets (no orderBy)");
    const snap = await db.collection("support_tickets").get();

    console.log(`[tickets/list] Firestore snap.size = ${snap.size}`);
    if (snap.empty) {
      console.warn("[tickets/list] ⚠️  Collection is empty (snap.empty = true)");
    }

    // Log the first few doc IDs so we can confirm we're reading the right project
    const sampleIds = snap.docs.slice(0, 5).map((d) => d.id);
    console.log("[tickets/list] Sample doc IDs:", sampleIds);

    const tickets = snap.docs.map((d) => {
      const data = d.data();
      // Log individual doc fields on first doc to confirm field names
      if (d === snap.docs[0]) {
        console.log("[tickets/list] First doc fields:", Object.keys(data));
        console.log("[tickets/list] First doc sample:", {
          ticketId:  data.ticketId,
          status:    data.status,
          priority:  data.priority,
          email:     data.studentEmail,
          createdAt: data.createdAt?.constructor?.name ?? typeof data.createdAt,
        });
      }
      return {
        id: d.id,
        ...data,
        status: normalizeStatus(data.status),
        // Safely serialise Timestamp → ISO string; null stays null
        createdAt:  data.createdAt?.toDate?.()?.toISOString()  ?? null,
        updatedAt:  data.updatedAt?.toDate?.()?.toISOString()  ?? null,
        resolvedAt: data.resolvedAt?.toDate?.()?.toISOString() ?? null,
      };
    });

    // Sort newest-first in memory (avoids orderBy index/type issues)
    tickets.sort((a, b) => {
      const aMs = a.createdAt ? new Date(a.createdAt as string).getTime() : 0;
      const bMs = b.createdAt ? new Date(b.createdAt as string).getTime() : 0;
      return bMs - aMs;
    });

    const elapsed = Date.now() - t0;
    console.log(`[tickets/list] ✅ Returning ${tickets.length} tickets in ${elapsed}ms`);

    return NextResponse.json({ tickets, _count: tickets.length });
  } catch (err) {
    const elapsed = Date.now() - t0;
    const msg = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    console.error(`[tickets/list] ✗ FAILED after ${elapsed}ms:`, msg);
    if (err instanceof Error && err.stack) console.error(err.stack);
    return NextResponse.json({ error: msg, _count: 0 }, { status: 500 });
  }
}

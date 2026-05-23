import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import type { DocumentReference } from "firebase-admin/firestore";

// ── Criteria: what counts as a test ticket ─────────────────────────────────────
// Checked server-side so the client can NEVER accidentally delete real tickets.
function isTestTicket(data: FirebaseFirestore.DocumentData): boolean {
  const email    = (data.studentEmail as string  ?? "").toLowerCase();
  const name     = (data.studentName  as string  ?? "").toLowerCase();
  const ticketId = (data.ticketId     as string  ?? "");
  return (
    email.includes("test")       ||
    name.includes("test")        ||
    ticketId.startsWith("TEST-") ||
    ticketId.startsWith("test-")
  );
}

/**
 * GET  – preview: returns list of test tickets without deleting anything
 * POST – delete:  deletes test tickets (all or a specific subset)
 *
 * POST body:
 *   { mode: "all" }                          → delete every detected test ticket
 *   { mode: "selected"; selectedIds: string[] } → delete only these Firestore doc IDs
 *                                                  (server still verifies each is a test ticket)
 */

// ── GET: preview ───────────────────────────────────────────────────────────────
export async function GET() {
  try {
    const db = getAdminDb();
    const snap = await db.collection("support_tickets").get();

    const testTickets = snap.docs
      .filter((d) => isTestTicket(d.data()))
      .map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ticketId:     data.ticketId     as string,
          studentName:  data.studentName  as string,
          studentEmail: data.studentEmail as string,
          status:       data.status       as string,
          createdAt:    data.createdAt?.toDate?.()?.toISOString() ?? null,
        };
      });

    return NextResponse.json({ tickets: testTickets, count: testTickets.length });
  } catch (err) {
    const msg = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    console.error("[delete-test GET]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// ── POST: delete ───────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const t0 = Date.now();
  console.log("[delete-test] ▶ Request received");

  try {
    const body = await req.json() as
      | { mode: "all" }
      | { mode: "selected"; selectedIds: string[] };

    const db = getAdminDb();

    // ── Step 1: Identify target ticket documents ─────────────────────────────
    let ticketDocs: FirebaseFirestore.QueryDocumentSnapshot[];

    if (body.mode === "selected") {
      const ids: string[] = body.selectedIds ?? [];
      if (ids.length === 0) {
        return NextResponse.json({ deleted: 0, ticketIds: [], docIds: [] });
      }

      // Fetch in parallel (batches of 30 to stay well under Firestore limits)
      const CHUNK = 30;
      const chunks: string[][] = [];
      for (let i = 0; i < ids.length; i += CHUNK) chunks.push(ids.slice(i, i + CHUNK));

      const allDocs = (
        await Promise.all(
          chunks.map((chunk) =>
            Promise.all(chunk.map((id) => db.collection("support_tickets").doc(id).get()))
          )
        )
      ).flat();

      // Server-side safety: only delete docs that actually pass the test criteria
      ticketDocs = allDocs.filter(
        (snap) => snap.exists && isTestTicket(snap.data()!)
      ) as FirebaseFirestore.QueryDocumentSnapshot[];
    } else {
      // mode === "all"
      const snap = await db.collection("support_tickets").get();
      ticketDocs = snap.docs.filter((d) => isTestTicket(d.data()));
    }

    if (ticketDocs.length === 0) {
      console.log("[delete-test] No test tickets found — nothing to delete");
      return NextResponse.json({ deleted: 0, ticketIds: [], docIds: [] });
    }

    const deletedTicketIds: string[] = ticketDocs.map((d) => d.data().ticketId as string);
    const deletedDocIds:    string[] = ticketDocs.map((d) => d.id);
    console.log(`[delete-test] Found ${ticketDocs.length} test tickets:`, deletedTicketIds);

    // ── Step 2: Collect ALL refs to delete (ticket + messages + events) ──────
    // Run all secondary queries in parallel for speed
    const [messagesSnapshots, eventsSnapshots] = await Promise.all([
      Promise.all(
        deletedTicketIds.map((tid) =>
          db.collection("ticket_messages").where("ticketId", "==", tid).get()
        )
      ),
      Promise.all(
        deletedTicketIds.map((tid) =>
          db.collection("ticket_events").where("ticketId", "==", tid).get()
        )
      ),
    ]);

    const allRefs: DocumentReference[] = [
      ...ticketDocs.map((d) => d.ref),
    ];

    let msgCount = 0, evtCount = 0;
    for (const snap of messagesSnapshots) {
      snap.docs.forEach((d) => { allRefs.push(d.ref); msgCount++; });
    }
    for (const snap of eventsSnapshots) {
      snap.docs.forEach((d) => { allRefs.push(d.ref); evtCount++; });
    }

    console.log(
      `[delete-test] Total docs to delete: ${allRefs.length}` +
      ` (${ticketDocs.length} tickets + ${msgCount} messages + ${evtCount} events)`
    );
    console.log("[delete-test] Deleted doc IDs:", deletedDocIds);

    // ── Step 3: Batch-delete — max 500 ops per Firestore batch ───────────────
    const BATCH_SIZE = 500;
    const batches: DocumentReference[][] = [];
    for (let i = 0; i < allRefs.length; i += BATCH_SIZE) {
      batches.push(allRefs.slice(i, i + BATCH_SIZE));
    }

    // Run batches sequentially (safe for large deletes)
    for (let b = 0; b < batches.length; b++) {
      const batch = db.batch();
      batches[b].forEach((ref) => batch.delete(ref));
      await batch.commit();
      console.log(`[delete-test] Batch ${b + 1}/${batches.length} committed (${batches[b].length} ops)`);
    }

    const elapsed = Date.now() - t0;
    console.log(
      `[delete-test] ✅ Done in ${elapsed}ms — deleted ${ticketDocs.length} tickets,` +
      ` ${msgCount} messages, ${evtCount} events`
    );

    return NextResponse.json({
      deleted:   ticketDocs.length,
      ticketIds: deletedTicketIds,
      docIds:    deletedDocIds,
      msgCount,
      evtCount,
    });
  } catch (err) {
    const elapsed = Date.now() - t0;
    const msg = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    console.error(`[delete-test] ✗ FAILED after ${elapsed}ms:`, msg);
    if (err instanceof Error && err.stack) console.error(err.stack);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

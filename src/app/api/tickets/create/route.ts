import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import type { TicketCategory, TicketPriority, TicketStatus } from "@/lib/tickets";

const META_COL = "meta";
const COUNTER_DOC = "ticket_counter";
const TICKETS_COL = "support_tickets";

function getAutoPriority(category: TicketCategory): TicketPriority {
  if (["Login Issue", "Payment Issue", "Course Access Issue"].includes(category)) return "HIGH";
  if (["Video Not Playing", "Ebook Issue", "Test Series Issue"].includes(category)) return "MEDIUM";
  return "LOW";
}

/**
 * Creates the ticket counter increment + ticket document in a SINGLE Firestore
 * transaction — reduces 3 sequential RTTs (tx-read, tx-write, addDoc) down to
 * 1 transaction round-trip.
 *
 * Pre-generates the Firestore doc ID so the transaction only needs to SET it
 * (no separate addDoc call afterwards).
 */
async function createTicketInTransaction(
  db: FirebaseFirestore.Firestore,
  docData: Record<string, unknown>
): Promise<{ id: string; ticketId: string }> {
  const counterRef = db.collection(META_COL).doc(COUNTER_DOC);
  // Pre-generate the Firestore document ID — avoids a second round-trip
  const ticketDocRef = db.collection(TICKETS_COL).doc();
  let ticketId = "";

  await db.runTransaction(async (tx) => {
    const counterSnap = await tx.get(counterRef);
    const count = counterSnap.exists
      ? ((counterSnap.data()?.count as number) ?? 0) + 1
      : 1;
    ticketId = `TECH-${String(count).padStart(6, "0")}`;
    // Write counter + ticket document in the same transaction commit
    tx.set(counterRef, { count });
    tx.set(ticketDocRef, { ...docData, ticketId });
  });

  return { id: ticketDocRef.id, ticketId };
}

export async function POST(req: NextRequest) {
  const t0 = Date.now();
  console.log("[tickets/create] ▶ Request received");

  try {
    // ── Parse & validate ──────────────────────────────────────────────────────
    const body = await req.json() as {
      studentName: string;
      studentEmail: string;
      whatsappNumber: string;
      courseName: string;
      category: TicketCategory;
      description: string;
      screenshotUrl: string | null;
      studentUid: string | null;
      attachments?: string[];
      voiceNotes?: Array<{ url: string; duration: number }>;
      screenRecordings?: string[];
      // legacy fields
      voiceNoteUrl?: string | null;
      voiceDuration?: number | null;
      screenRecordingUrl?: string | null;
    };

    const { studentName, studentEmail, whatsappNumber, courseName, category, description } = body;

    if (!studentName?.trim() || !studentEmail?.trim() || !whatsappNumber?.trim() || !category || !description?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentEmail)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const tValidate = Date.now();
    console.log(`[tickets/create] ✓ Validation — ${tValidate - t0}ms`);

    // ── Init Admin SDK (cached singleton after first call) ────────────────────
    const db = getAdminDb();
    const tSdk = Date.now();
    console.log(`[tickets/create] ✓ Admin SDK ready — ${tSdk - t0}ms`);

    // ── Build document data ───────────────────────────────────────────────────
    const priority = getAutoPriority(category);
    const now = FieldValue.serverTimestamp();

    const docData: Record<string, unknown> = {
      studentName: studentName.trim(),
      studentEmail: studentEmail.trim().toLowerCase(),
      whatsappNumber: whatsappNumber.trim().replace(/\s/g, ""),
      courseName,
      category,
      description: description.trim(),
      screenshotUrl: body.screenshotUrl ?? null,
      attachments: body.attachments ?? [],
      voiceNotes: body.voiceNotes ?? [],
      screenRecordings: body.screenRecordings ?? [],
      studentUid: body.studentUid ?? null,
      status: "OPEN" as TicketStatus,
      priority,
      assignedTo: null,
      adminNotes: null,
      createdAt: now,
      updatedAt: now,
      resolvedAt: null,
    };

    // ── Single transaction: counter + ticket write ────────────────────────────
    const tTxStart = Date.now();
    const { id, ticketId } = await createTicketInTransaction(db, docData);
    const tTxEnd = Date.now();
    console.log(`[tickets/create] ✓ Transaction (counter + ticket) — ${tTxEnd - tTxStart}ms`);
    console.log(`[tickets/create] ✓ Total Firestore write — ${tTxEnd - t0}ms | docId: ${id} | ticketId: ${ticketId}`);

    // ── Fire-and-forget: record creation event ────────────────────────────────
    db.collection("ticket_events").add({
      ticketId,
      type: "CREATED",
      actor: studentName.trim(),
      note: "Ticket submitted",
      createdAt: FieldValue.serverTimestamp(),
    }).catch(() => {});

    const tTotal = Date.now() - t0;
    console.log(`[tickets/create] ✅ Done in ${tTotal}ms`);

    return NextResponse.json({ id, ticketId }, { status: 201 });

  } catch (err) {
    const elapsed = Date.now() - t0;
    const errStr = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    console.error(`[tickets/create] ✗ FAILED after ${elapsed}ms:`, errStr);
    if (err instanceof Error && err.stack) console.error(err.stack);
    return NextResponse.json({ error: errStr }, { status: 500 });
  }
}

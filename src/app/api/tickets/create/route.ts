import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { FieldValue, type Firestore } from "firebase-admin/firestore";
import type { TicketCategory, TicketPriority, TicketStatus } from "@/lib/tickets";

const META_COL = "meta";
const COUNTER_DOC = "ticket_counter";
const TICKETS_COL = "support_tickets";

function getAutoPriority(category: TicketCategory): TicketPriority {
  if (["Login Issue", "Payment Issue", "Course Access Issue"].includes(category)) return "HIGH";
  if (["Video Not Playing", "Ebook Issue", "Test Series Issue"].includes(category)) return "MEDIUM";
  return "LOW";
}

async function generateTicketId(db: Firestore): Promise<string> {
  const counterRef = db.collection(META_COL).doc(COUNTER_DOC);
  let count = 1;
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(counterRef);
    count = snap.exists ? ((snap.data()?.count as number) ?? 0) + 1 : 1;
    tx.set(counterRef, { count });
  });
  return `TECH-${String(count).padStart(6, "0")}`;
}

export async function POST(req: NextRequest) {
  console.log("[tickets/create] Request received");
  try {
    const body = await req.json() as {
      studentName: string;
      studentEmail: string;
      whatsappNumber: string;
      courseName: string;
      category: TicketCategory;
      description: string;
      screenshotUrl: string | null;
      studentUid: string | null;
      // Rich attachments
      attachments?: string[];
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

    console.log("[tickets/create] Validation passed, initialising Admin SDK...");
    const db = getAdminDb();
    console.log("[tickets/create] Admin SDK ready, generating ticket ID...");
    const ticketId = await generateTicketId(db);
    console.log("[tickets/create] Ticket ID generated:", ticketId);
    const priority = getAutoPriority(category);
    const now = FieldValue.serverTimestamp();

    const docData = {
      ticketId,
      studentName: studentName.trim(),
      studentEmail: studentEmail.trim().toLowerCase(),
      whatsappNumber: whatsappNumber.trim().replace(/\s/g, ""),
      courseName,
      category,
      description: description.trim(),
      screenshotUrl: body.screenshotUrl ?? null,
      attachments: body.attachments ?? [],
      voiceNoteUrl: body.voiceNoteUrl ?? null,
      voiceDuration: body.voiceDuration ?? null,
      screenRecordingUrl: body.screenRecordingUrl ?? null,
      studentUid: body.studentUid ?? null,
      status: "OPEN" as TicketStatus,
      priority,
      assignedTo: null,
      adminNotes: null,
      createdAt: now,
      updatedAt: now,
      resolvedAt: null,
    };

    console.log("[tickets/create] Writing ticket to Firestore...");
    const ref = await db.collection(TICKETS_COL).add(docData);
    console.log("[tickets/create] Success — doc id:", ref.id, "ticketId:", ticketId);

    // Record creation event (fire-and-forget)
    db.collection("ticket_events").add({
      ticketId,
      type: "CREATED",
      actor: body.studentName?.trim() ?? "Student",
      note: "Ticket submitted",
      createdAt: FieldValue.serverTimestamp(),
    }).catch(() => {});

    return NextResponse.json({ id: ref.id, ticketId }, { status: 201 });
  } catch (err) {
    const errStr = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    console.error("[tickets/create] FAILED:", errStr);
    if (err instanceof Error && err.stack) console.error(err.stack);
    return NextResponse.json({ error: errStr }, { status: 500 });
  }
}

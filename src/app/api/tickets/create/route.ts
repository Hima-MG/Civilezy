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
    };

    const { studentName, studentEmail, whatsappNumber, courseName, category, description } = body;
    if (!studentName?.trim() || !studentEmail?.trim() || !whatsappNumber?.trim() || !category || !description?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentEmail)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const db = getAdminDb();
    const ticketId = await generateTicketId(db);
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
      studentUid: body.studentUid ?? null,
      status: "OPEN" as TicketStatus,
      priority,
      assignedTo: null,
      adminNotes: null,
      createdAt: now,
      updatedAt: now,
      resolvedAt: null,
    };

    const ref = await db.collection(TICKETS_COL).add(docData);
    return NextResponse.json({ id: ref.id, ticketId }, { status: 201 });
  } catch (err) {
    console.error("[tickets/create]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

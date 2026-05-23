import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

function serializeMsg(id: string, data: FirebaseFirestore.DocumentData) {
  return {
    id,
    ...data,
    createdAt: data.createdAt?.toDate?.()?.toISOString() ?? null,
  };
}

// GET /api/tickets/messages?ticketId=<ticketId>
export async function GET(req: NextRequest) {
  const ticketId = new URL(req.url).searchParams.get("ticketId");
  if (!ticketId) return NextResponse.json({ error: "Missing ticketId" }, { status: 400 });

  try {
    const db = getAdminDb();
    const snap = await db
      .collection("ticket_messages")
      .where("ticketId", "==", ticketId)
      .get();

    const messages = snap.docs
      .map((d) => serializeMsg(d.id, d.data()))
      .sort((a, b) => {
        const aMs = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bMs = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return aMs - bMs;
      });
    return NextResponse.json({ messages });
  } catch (err) {
    const msg = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    console.error("[tickets/messages GET]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// POST /api/tickets/messages  { ticketId, senderType, senderName, message, attachmentUrl }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      ticketId: string;
      senderType: "ADMIN" | "STUDENT";
      senderName: string;
      message: string;
      attachmentUrl: string | null;
    };

    const { ticketId, senderType, senderName, message } = body;
    if (!ticketId || !senderType || !senderName || !message?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = getAdminDb();
    const data = {
      ticketId,
      senderType,
      senderName,
      message: message.trim(),
      attachmentUrl: body.attachmentUrl ?? null,
      createdAt: FieldValue.serverTimestamp(),
    };

    const ref = await db.collection("ticket_messages").add(data);

    // Record activity event (fire-and-forget)
    const eventType = senderType === "ADMIN" ? "ADMIN_REPLY" : "STUDENT_REPLY";
    db.collection("ticket_events").add({
      ticketId,
      type: eventType,
      actor: senderName,
      note: message.trim().slice(0, 80) + (message.trim().length > 80 ? "…" : ""),
      createdAt: FieldValue.serverTimestamp(),
    }).catch(() => {});

    const newSnap = await ref.get();
    return NextResponse.json({ message: serializeMsg(ref.id, newSnap.data()!) }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    console.error("[tickets/messages POST]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

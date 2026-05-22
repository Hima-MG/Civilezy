import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, getAdminAuth } from "@/lib/firebase-admin";

function serializeTicket(id: string, data: FirebaseFirestore.DocumentData) {
  return {
    id,
    ...data,
    createdAt: data.createdAt?.toDate?.()?.toISOString() ?? null,
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() ?? null,
    resolvedAt: data.resolvedAt?.toDate?.()?.toISOString() ?? null,
  };
}

function serializeMsg(id: string, data: FirebaseFirestore.DocumentData) {
  return {
    id,
    ...data,
    createdAt: data.createdAt?.toDate?.()?.toISOString() ?? null,
  };
}

// GET /api/tickets/student-ticket?id=<firestoreDocId>  (Authorization: Bearer <idToken>)
// Returns ticket + messages; enforces ownership so Student A cannot read Student B's ticket.
export async function GET(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized — no token" }, { status: 401 });
  }

  try {
    const decoded = await getAdminAuth().verifyIdToken(token);
    const uid = decoded.uid;

    const db = getAdminDb();
    const snap = await db.collection("support_tickets").doc(id).get();

    if (!snap.exists) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const data = snap.data()!;

    // Ownership check — prevent cross-student access
    if (data.studentUid !== uid) {
      console.warn(
        `[student-ticket] Ownership mismatch — uid=${uid} tried to access ticket owned by ${data.studentUid}`
      );
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const ticket = serializeTicket(snap.id, data);

    // Fetch messages using the human-readable ticketId (TECH-XXXXXX), NOT the Firestore doc ID
    const msgsSnap = await db
      .collection("ticket_messages")
      .where("ticketId", "==", data.ticketId)
      .get();

    const messages = msgsSnap.docs
      .map((d) => serializeMsg(d.id, d.data()))
      .sort((a, b) => {
        const aMs = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bMs = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return aMs - bMs; // oldest first (chat order)
      });

    return NextResponse.json({ ticket, messages });
  } catch (err) {
    const msg = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    console.error("[student-ticket GET]", msg);

    if (
      msg.includes("auth/") ||
      msg.includes("FirebaseAuthError") ||
      msg.toLowerCase().includes("token")
    ) {
      return NextResponse.json({ error: "Unauthorized — invalid token" }, { status: 401 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

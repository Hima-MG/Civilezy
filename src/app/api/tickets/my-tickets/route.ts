import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, getAdminAuth } from "@/lib/firebase-admin";

const STATUS_NORM: Record<string, string> = {
  open: "OPEN", "in progress": "IN_PROGRESS", in_progress: "IN_PROGRESS",
  "waiting for student": "WAITING_FOR_STUDENT", waiting_for_student: "WAITING_FOR_STUDENT",
  resolved: "RESOLVED", closed: "CLOSED", reopened: "REOPENED",
};
function normalizeStatus(s: unknown): string | undefined {
  if (typeof s !== "string") return s as undefined;
  return STATUS_NORM[s.toLowerCase()] ?? s;
}

function serializeTicket(id: string, data: FirebaseFirestore.DocumentData) {
  return {
    id,
    ...data,
    status: normalizeStatus(data.status),
    createdAt: data.createdAt?.toDate?.()?.toISOString() ?? null,
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() ?? null,
    resolvedAt: data.resolvedAt?.toDate?.()?.toISOString() ?? null,
  };
}

// GET /api/tickets/my-tickets  (Authorization: Bearer <idToken>)
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized — no token" }, { status: 401 });
  }

  try {
    const decoded = await getAdminAuth().verifyIdToken(token);
    const uid = decoded.uid;

    const db = getAdminDb();
    const snap = await db
      .collection("support_tickets")
      .where("studentUid", "==", uid)
      .get();

    const tickets = snap.docs
      .map((d) => serializeTicket(d.id, d.data()))
      .sort((a, b) => {
        const aMs = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bMs = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bMs - aMs; // newest first
      });

    return NextResponse.json({ tickets });
  } catch (err) {
    const msg = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    console.error("[my-tickets GET]", msg);

    // Firebase Auth token errors → 401
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

import { NextRequest, NextResponse } from "next/server";
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

function serializeDoc(id: string, data: FirebaseFirestore.DocumentData) {
  return {
    id,
    ...data,
    status: normalizeStatus(data.status),
    createdAt: data.createdAt?.toDate?.()?.toISOString() ?? null,
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() ?? null,
    resolvedAt: data.resolvedAt?.toDate?.()?.toISOString() ?? null,
  };
}

export async function GET(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  try {
    const db = getAdminDb();
    const snap = await db.collection("support_tickets").doc(id).get();
    if (!snap.exists) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ticket: serializeDoc(snap.id, snap.data()!) });
  } catch (err) {
    const msg = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    console.error("[tickets/detail]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

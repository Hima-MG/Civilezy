import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

// PATCH /api/tickets/update  { id, status?, priority?, assignedTo?, adminNotes?, resolvedAt? }
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json() as {
      id: string;
      status?: string;
      priority?: string;
      assignedTo?: string | null;
      adminNotes?: string | null;
      [key: string]: unknown;
    };

    const { id, ...fields } = body;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const updates: Record<string, unknown> = {
      ...fields,
      updatedAt: FieldValue.serverTimestamp(),
    };

    // Set resolvedAt when moving to WAITING_FOR_STUDENT or RESOLVED
    if (fields.status === "WAITING_FOR_STUDENT" || fields.status === "RESOLVED") {
      updates.resolvedAt = FieldValue.serverTimestamp();
    }

    const db = getAdminDb();
    await db.collection("support_tickets").doc(id).update(updates);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    console.error("[tickets/update]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

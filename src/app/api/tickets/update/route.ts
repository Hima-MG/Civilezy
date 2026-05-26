import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

const STATUS_NORM: Record<string, string> = {
  open: "OPEN", "in progress": "IN_PROGRESS", in_progress: "IN_PROGRESS",
  "waiting for student": "WAITING_FOR_STUDENT", waiting_for_student: "WAITING_FOR_STUDENT",
  resolved: "RESOLVED", closed: "CLOSED", reopened: "REOPENED",
};
function normalizeStatus(s: unknown): string | undefined {
  if (typeof s !== "string") return s as undefined;
  return STATUS_NORM[s.toLowerCase()] ?? s;
}

// PATCH /api/tickets/update  { id, status?, priority?, assignedTo?, adminNotes?, _event? }
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json() as {
      id: string;
      status?: string;
      priority?: string;
      assignedTo?: string | null;
      adminNotes?: string | null;
      _event?: {
        ticketId: string;
        oldStatus?: string;
        oldPriority?: string;
      };
      [key: string]: unknown;
    };

    const { id, _event, ...fields } = body;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    // Ensure status is always stored in canonical uppercase form
    if (fields.status) fields.status = normalizeStatus(fields.status);

    // Log when attachment fields arrive (helps diagnose the upload→Firestore pipeline)
    const attachmentFields = ["attachments", "screenshotUrl", "voiceNoteUrl", "voiceDuration", "screenRecordingUrl"];
    const incomingAttachments = attachmentFields.filter(k => k in fields);
    if (incomingAttachments.length > 0) {
      console.log(`[tickets/update] Saving attachments for doc ${id}:`, incomingAttachments.map(k => `${k}=${JSON.stringify(fields[k as keyof typeof fields])}`).join(", "));
    }

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

    // Record activity log events
    if (_event?.ticketId) {
      const eventPromises: Promise<unknown>[] = [];
      if (fields.status && fields.status !== _event.oldStatus) {
        eventPromises.push(db.collection("ticket_events").add({
          ticketId: _event.ticketId,
          type: "STATUS_CHANGE",
          actor: "Technical Team",
          oldValue: _event.oldStatus ?? "",
          newValue: fields.status,
          createdAt: FieldValue.serverTimestamp(),
        }));
      }
      if (fields.priority && fields.priority !== _event.oldPriority) {
        eventPromises.push(db.collection("ticket_events").add({
          ticketId: _event.ticketId,
          type: "PRIORITY_CHANGE",
          actor: "Technical Team",
          oldValue: _event.oldPriority ?? "",
          newValue: fields.priority,
          createdAt: FieldValue.serverTimestamp(),
        }));
      }
      await Promise.all(eventPromises);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    console.error("[tickets/update]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

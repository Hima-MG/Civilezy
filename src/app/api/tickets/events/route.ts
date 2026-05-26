import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

// GET /api/tickets/events?ticketId=<TECH-XXXXXX>
// Returns all ticket_events for a given human-readable ticketId, oldest-first.
export async function GET(req: NextRequest) {
  const ticketId = new URL(req.url).searchParams.get("ticketId");
  if (!ticketId) return NextResponse.json({ error: "Missing ticketId" }, { status: 400 });

  try {
    const db = getAdminDb();
    const snap = await db
      .collection("ticket_events")
      .where("ticketId", "==", ticketId)
      .get();

    const events = snap.docs
      .map((d) => ({
        id: d.id,
        ...d.data(),
        createdAt: d.data().createdAt?.toDate?.()?.toISOString() ?? null,
      }))
      .sort((a, b) => {
        const aMs = a.createdAt ? new Date(a.createdAt as string).getTime() : 0;
        const bMs = b.createdAt ? new Date(b.createdAt as string).getTime() : 0;
        return aMs - bMs; // oldest first
      });

    return NextResponse.json({ events });
  } catch (err) {
    const msg = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    console.error("[tickets/events GET]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

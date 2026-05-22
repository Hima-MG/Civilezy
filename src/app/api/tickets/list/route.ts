import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const db = getAdminDb();
    const snap = await db
      .collection("support_tickets")
      .orderBy("createdAt", "desc")
      .get();

    const tickets = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() ?? null,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() ?? null,
        resolvedAt: data.resolvedAt?.toDate?.()?.toISOString() ?? null,
      };
    });

    return NextResponse.json({ tickets });
  } catch (err) {
    const msg = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    console.error("[tickets/list]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

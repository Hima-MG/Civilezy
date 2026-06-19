import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

const ADMIN_PASSPHRASE = "civilezy2026admin";

function checkAuth(req: NextRequest): boolean {
  return req.headers.get("x-admin-passphrase") === ADMIN_PASSPHRASE;
}

// GET — list unanswered queries
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = getAdminDb();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status"); // pending | reviewed | converted_to_faq | all

    let q = db.collection("unanswered_queries").orderBy("timestamp", "desc");

    const snap = await q.limit(100).get();
    let docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    if (status && status !== "all") {
      docs = docs.filter((d: any) => d.status === status);
    }

    return NextResponse.json({ queries: docs });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// PATCH — update status / add admin response
export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, status, adminResponse } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    const db = getAdminDb();
    const updates: Record<string, unknown> = {};
    if (status) updates.status = status;
    if (adminResponse !== undefined) updates.adminResponse = adminResponse;

    await db.collection("unanswered_queries").doc(id).update(updates);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// DELETE — remove a query
export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    const db = getAdminDb();
    await db.collection("unanswered_queries").doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import type { AiFaq } from "@/types/chatbot";

const ADMIN_PASSPHRASE = "civilezy2026admin";

function checkAuth(req: NextRequest): boolean {
  const auth = req.headers.get("x-admin-passphrase");
  return auth === ADMIN_PASSPHRASE;
}

// GET /api/admin/faqs — list all FAQs
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = getAdminDb();
    const snap = await db
      .collection("ai_faqs")
      .orderBy("createdAt", "desc")
      .get();

    const faqs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return NextResponse.json({ faqs });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// POST /api/admin/faqs — create FAQ
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { question, answer, category, keywords } = body as Partial<AiFaq>;

    if (!question?.trim() || !answer?.trim() || !category) {
      return NextResponse.json(
        { error: "question, answer, and category are required" },
        { status: 400 }
      );
    }

    const db = getAdminDb();
    const now = new Date().toISOString();

    const docRef = await db.collection("ai_faqs").add({
      question: question.trim(),
      answer: answer.trim(),
      category,
      keywords: Array.isArray(keywords) ? keywords : [],
      status: "active",
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({ id: docRef.id, success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// PATCH /api/admin/faqs — update FAQ
export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, ...updates } = body as Partial<AiFaq> & { id: string };

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const db = getAdminDb();
    await db
      .collection("ai_faqs")
      .doc(id)
      .update({ ...updates, updatedAt: new Date().toISOString() });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// DELETE /api/admin/faqs — delete FAQ
export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const db = getAdminDb();
    await db.collection("ai_faqs").doc(id).delete();

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

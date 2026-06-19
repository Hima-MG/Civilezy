import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

const ADMIN_PASSPHRASE = "civilezy2026admin";

function checkAuth(req: NextRequest): boolean {
  return req.headers.get("x-admin-passphrase") === ADMIN_PASSPHRASE;
}

// GET /api/admin/chatbot/analytics
// Returns last 30 days of analytics + totals + chatbot stats
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = getAdminDb();

    // Last 30 days
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    const cutoffStr = cutoff.toISOString().split("T")[0];

    const analyticsSnap = await db
      .collection("chatbot_analytics")
      .where("date", ">=", cutoffStr)
      .orderBy("date", "asc")
      .get();

    const daily = analyticsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // Aggregate totals
    const totals = daily.reduce(
      (acc: any, d: any) => ({
        totalQuestions: acc.totalQuestions + (d.totalQuestions ?? 0),
        answeredQuestions: acc.answeredQuestions + (d.answeredQuestions ?? 0),
        unansweredQuestions:
          acc.unansweredQuestions + (d.unansweredQuestions ?? 0),
        faqHits: acc.faqHits + (d.faqHits ?? 0),
        aiGeneratedAnswers: acc.aiGeneratedAnswers + (d.aiGeneratedAnswers ?? 0),
      }),
      {
        totalQuestions: 0,
        answeredQuestions: 0,
        unansweredQuestions: 0,
        faqHits: 0,
        aiGeneratedAnswers: 0,
      }
    );

    // FAQ count
    const faqSnap = await db.collection("ai_faqs").get();
    const totalFaqs = faqSnap.size;
    const activeFaqs = faqSnap.docs.filter(
      (d) => d.data().status === "active"
    ).length;

    // Pending unanswered count
    const unansweredSnap = await db
      .collection("unanswered_queries")
      .where("status", "==", "pending")
      .get();
    const pendingUnanswered = unansweredSnap.size;

    return NextResponse.json({
      daily,
      totals,
      totalFaqs,
      activeFaqs,
      pendingUnanswered,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

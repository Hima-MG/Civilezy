import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

function getAdminDb() {
  if (getApps().length === 0) {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (serviceAccount) {
      initializeApp({ credential: cert(JSON.parse(serviceAccount)) });
    } else {
      initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "civilezy-game-e0fcf",
      });
    }
  }
  return getFirestore();
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://civilezy.in";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const action = searchParams.get("action");

  if (!id || !action || !["solved", "reopen"].includes(action)) {
    return new NextResponse("Invalid request", { status: 400 });
  }

  try {
    const adminDb = getAdminDb();
    const ref = adminDb.collection("support_tickets").doc(id);
    const snap = await ref.get();

    if (!snap.exists) {
      return new NextResponse("Ticket not found", { status: 404 });
    }

    const ticket = snap.data()!;

    if (!["WAITING_FOR_STUDENT", "RESOLVED"].includes(ticket.status)) {
      return NextResponse.redirect(`${SITE_URL}/support/${id}?msg=already_handled`);
    }

    const newStatus = action === "solved" ? "CLOSED" : "REOPENED";
    await ref.update({
      status: newStatus,
      updatedAt: FieldValue.serverTimestamp(),
      ...(newStatus === "CLOSED" ? { closedAt: FieldValue.serverTimestamp() } : {}),
    });

    // Notify tech head via email API
    const siteUrl = SITE_URL;
    try {
      await fetch(`${siteUrl}/api/send-ticket-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "student_confirm",
          ticket: {
            ticketId: ticket.ticketId,
            id,
            studentName: ticket.studentName,
            studentEmail: ticket.studentEmail,
            category: ticket.category,
            courseName: ticket.courseName,
            description: ticket.description,
            status: newStatus,
          },
          siteUrl,
        }),
      });
    } catch {
      // Non-critical — don't fail the redirect
    }

    const msg = action === "solved" ? "issue_solved" : "issue_reopened";
    return NextResponse.redirect(`${SITE_URL}/support/${id}?msg=${msg}`);
  } catch (err) {
    console.error("Confirm error:", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

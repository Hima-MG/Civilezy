import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://civilezy.in";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const action = searchParams.get("action");

  if (!id || !action || !["solved", "reopen"].includes(action)) {
    return new NextResponse("Invalid request", { status: 400 });
  }

  try {
    const db = getAdminDb();
    const ref = db.collection("support_tickets").doc(id);
    const snap = await ref.get();

    if (!snap.exists) {
      return new NextResponse("Ticket not found", { status: 404 });
    }

    const ticket = snap.data()!;

    if (!["WAITING_FOR_STUDENT", "RESOLVED"].includes(ticket.status as string)) {
      return NextResponse.redirect(`${SITE_URL}/support/${id}?msg=already_handled`);
    }

    const newStatus = action === "solved" ? "CLOSED" : "REOPENED";
    await ref.update({
      status: newStatus,
      updatedAt: FieldValue.serverTimestamp(),
      ...(newStatus === "CLOSED" ? { closedAt: FieldValue.serverTimestamp() } : {}),
    });

    // Notify tech head via email (fire-and-forget)
    fetch(`${SITE_URL}/api/send-ticket-email`, {
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
        siteUrl: SITE_URL,
      }),
    }).catch(() => {});

    const msg = action === "solved" ? "issue_solved" : "issue_reopened";
    return NextResponse.redirect(`${SITE_URL}/support/${id}?msg=${msg}`);
  } catch (err) {
    console.error("[tickets/confirm]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";

const RESEND_API = "https://api.resend.com/emails";
const FROM = "CivilEzy Support <support@civilezy.in>";

const STATUS_LABEL: Record<string, string> = {
  OPEN: "Open", IN_PROGRESS: "In Progress",
  WAITING_FOR_STUDENT: "Waiting for Student",
  RESOLVED: "Resolved", CLOSED: "Closed", REOPENED: "Reopened",
};
function statusLabel(s: string | undefined): string {
  if (!s) return "—";
  return STATUS_LABEL[s.toUpperCase()] ?? s.replace(/_/g, " ");
}
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://civilezy.in";
const TECH_HEAD_EMAIL = process.env.TECH_HEAD_EMAIL ?? "";
const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";

async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY || !to) return;
  await fetch(RESEND_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM, to: [to], subject, html }),
  });
}

function baseTemplate(content: string) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body{margin:0;padding:0;background:#060D1A;font-family:Nunito,Arial,sans-serif;color:#fff}
  .wrap{max-width:580px;margin:32px auto;background:rgba(255,255,255,0.04);border:1px solid rgba(255,98,0,0.2);border-radius:20px;overflow:hidden}
  .header{background:linear-gradient(135deg,#FF6200,#FF8534);padding:28px 32px;text-align:center}
  .header h1{margin:0;font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.3px}
  .body{padding:28px 32px}
  .field{margin-bottom:14px}
  .label{font-size:12px;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:4px}
  .value{font-size:15px;color:#fff;font-weight:600}
  .badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:700}
  .btn{display:inline-block;padding:12px 28px;border-radius:50px;font-weight:700;font-size:14px;text-decoration:none;color:#fff}
  .btn-green{background:#22c55e}
  .btn-red{background:#ef4444}
  .footer{padding:18px 32px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;font-size:12px;color:rgba(255,255,255,0.35)}
</style></head>
<body><div class="wrap">
  <div class="header"><h1>⚙️ CivilEzy Technical Support</h1></div>
  <div class="body">${content}</div>
  <div class="footer">CivilEzy by Wincentre | <a href="${SITE_URL}" style="color:#FF8534;text-decoration:none">civilezy.in</a></div>
</div></body></html>`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, ticket, siteUrl } = body as {
      type: "new_ticket" | "status_update" | "resolution_confirm" | "student_confirm" | "admin_reply";
      ticket: {
        ticketId: string;
        id: string;
        studentName: string;
        studentEmail: string;
        category: string;
        courseName: string;
        description: string;
        status?: string;
        priority?: string;
      };
      siteUrl?: string;
    };

    const base = siteUrl ?? SITE_URL;

    if (type === "new_ticket") {
      // Email to tech head
      if (TECH_HEAD_EMAIL) {
        await sendEmail(
          TECH_HEAD_EMAIL,
          `New Technical Ticket — ${ticket.ticketId}`,
          baseTemplate(`
            <p style="font-size:16px;font-weight:700;color:#FF8534;margin-top:0">New support ticket received</p>
            <div class="field"><div class="label">Ticket ID</div><div class="value" style="color:#60a5fa">${ticket.ticketId}</div></div>
            <div class="field"><div class="label">Student Name</div><div class="value">${ticket.studentName}</div></div>
            <div class="field"><div class="label">Email</div><div class="value">${ticket.studentEmail}</div></div>
            <div class="field"><div class="label">Course</div><div class="value">${ticket.courseName}</div></div>
            <div class="field"><div class="label">Category</div><div class="value">${ticket.category}</div></div>
            <div class="field"><div class="label">Description</div><div class="value" style="font-weight:400;line-height:1.6;color:rgba(255,255,255,0.8)">${ticket.description}</div></div>
            <p style="margin-top:24px"><a href="${base}/admin/support/${ticket.id}" class="btn" style="background:linear-gradient(135deg,#FF6200,#FF8534)">View Ticket in Admin Panel</a></p>
          `)
        );
      }

      // Confirmation email to student
      await sendEmail(
        ticket.studentEmail,
        `Your Support Ticket — ${ticket.ticketId}`,
        baseTemplate(`
          <p style="font-size:16px;font-weight:700;color:#fff;margin-top:0">Hi ${ticket.studentName},</p>
          <p style="color:rgba(255,255,255,0.7);line-height:1.6">We've received your technical support request. Our team will review it shortly.</p>
          <div class="field"><div class="label">Ticket ID</div><div class="value" style="color:#60a5fa;font-size:20px">${ticket.ticketId}</div></div>
          <div class="field"><div class="label">Category</div><div class="value">${ticket.category}</div></div>
          <div class="field"><div class="label">Status</div><span class="badge" style="background:rgba(96,165,250,0.15);color:#60a5fa">Open</span></div>
          <p style="color:rgba(255,255,255,0.5);font-size:13px;line-height:1.6;margin-top:20px">Please keep this ticket ID for reference. You can track your ticket status at any time.</p>
          <p style="margin-top:20px"><a href="${base}/support/${ticket.id}" class="btn" style="background:linear-gradient(135deg,#FF6200,#FF8534)">View My Ticket</a></p>
        `)
      );
    }

    if (type === "status_update") {
      const label = statusLabel(ticket.status);
      await sendEmail(
        ticket.studentEmail,
        `Ticket ${ticket.ticketId} — Status Updated`,
        baseTemplate(`
          <p style="font-size:16px;font-weight:700;color:#fff;margin-top:0">Hi ${ticket.studentName},</p>
          <p style="color:rgba(255,255,255,0.7);line-height:1.6">There's an update on your support ticket.</p>
          <div class="field"><div class="label">Ticket ID</div><div class="value" style="color:#60a5fa">${ticket.ticketId}</div></div>
          <div class="field"><div class="label">New Status</div><div class="value" style="color:#fb923c">${label}</div></div>
          <p style="margin-top:20px"><a href="${base}/support/${ticket.id}" class="btn" style="background:linear-gradient(135deg,#FF6200,#FF8534)">View Ticket</a></p>
        `)
      );
    }

    if (type === "resolution_confirm") {
      await sendEmail(
        ticket.studentEmail,
        `Is Your Issue Resolved? — ${ticket.ticketId}`,
        baseTemplate(`
          <p style="font-size:16px;font-weight:700;color:#fff;margin-top:0">Hi ${ticket.studentName},</p>
          <p style="color:rgba(255,255,255,0.7);line-height:1.6">We believe your issue has been resolved. Please let us know:</p>
          <div class="field"><div class="label">Ticket ID</div><div class="value" style="color:#60a5fa">${ticket.ticketId}</div></div>
          <div class="field"><div class="label">Category</div><div class="value">${ticket.category}</div></div>
          <div style="display:flex;gap:12px;margin-top:24px;flex-wrap:wrap">
            <a href="${base}/api/tickets/confirm?id=${ticket.id}&action=solved" class="btn btn-green">✓ Issue Solved</a>
            <a href="${base}/api/tickets/confirm?id=${ticket.id}&action=reopen" class="btn btn-red">✗ Still Facing Issue</a>
          </div>
          <p style="color:rgba(255,255,255,0.4);font-size:12px;margin-top:20px">If the buttons above don't work, copy this link to your browser:<br>${base}/support/${ticket.id}</p>
        `)
      );
    }

    if (type === "admin_reply") {
      const replyMsg = (ticket as { message?: string }).message ?? "";
      await sendEmail(
        ticket.studentEmail,
        `New Reply on Ticket ${ticket.ticketId}`,
        baseTemplate(`
          <p style="font-size:16px;font-weight:700;color:#fff;margin-top:0">Hi ${ticket.studentName},</p>
          <p style="color:rgba(255,255,255,0.7);line-height:1.6">The support team has replied to your ticket.</p>
          <div class="field"><div class="label">Ticket ID</div><div class="value" style="color:#60a5fa">${ticket.ticketId}</div></div>
          <div class="field"><div class="label">Category</div><div class="value">${ticket.category}</div></div>
          ${replyMsg ? `<div class="field"><div class="label">Message</div><div class="value" style="font-weight:400;line-height:1.6;color:rgba(255,255,255,0.8)">${replyMsg}</div></div>` : ""}
          <p style="margin-top:24px"><a href="${base}/support/${ticket.id}" class="btn" style="background:linear-gradient(135deg,#FF6200,#FF8534)">View Reply →</a></p>
        `)
      );
    }

    if (type === "student_confirm") {
      if (TECH_HEAD_EMAIL) {
        await sendEmail(
          TECH_HEAD_EMAIL,
          `Ticket ${ticket.ticketId} — Student Confirmed ${ticket.status === "CLOSED" ? "Resolved" : "Still Facing Issue"}`,
          baseTemplate(`
            <p style="font-size:16px;font-weight:700;color:#FF8534;margin-top:0">Student Response Received</p>
            <div class="field"><div class="label">Ticket ID</div><div class="value" style="color:#60a5fa">${ticket.ticketId}</div></div>
            <div class="field"><div class="label">Student</div><div class="value">${ticket.studentName}</div></div>
            <div class="field"><div class="label">Response</div><div class="value" style="color:${ticket.status === "CLOSED" ? "#34d399" : "#f87171"}">${ticket.status === "CLOSED" ? "✓ Issue Solved" : "✗ Still Facing Issue"}</div></div>
            <p style="margin-top:20px"><a href="${base}/admin/support/${ticket.id}" class="btn" style="background:linear-gradient(135deg,#FF6200,#FF8534)">View Ticket</a></p>
          `)
        );
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Email send error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

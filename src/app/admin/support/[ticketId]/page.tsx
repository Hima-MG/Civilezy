"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  STATUS_LABELS,
  STATUS_COLORS,
  PRIORITY_COLORS,
  formatDate,
  type ApiTicket,
  type ApiMessage,
  type TicketStatus,
  type TicketPriority,
} from "@/lib/tickets";

const STATUS_OPTIONS: TicketStatus[] = [
  "OPEN", "IN_PROGRESS", "WAITING_FOR_STUDENT", "RESOLVED", "REOPENED", "CLOSED",
];

export default function AdminTicketDetailPage() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const router = useRouter();

  const [ticket, setTicket] = useState<ApiTicket | null>(null);
  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [flash, setFlash] = useState("");
  const [flashType, setFlashType] = useState<"ok" | "err">("ok");

  const [newStatus, setNewStatus] = useState<TicketStatus>("OPEN");
  const [newPriority, setNewPriority] = useState<TicketPriority>("MEDIUM");
  const [assignedTo, setAssignedTo] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [replyText, setReplyText] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [sendingReply, setSendingReply] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const showFlash = (msg: string, type: "ok" | "err" = "ok") => {
    setFlash(msg);
    setFlashType(type);
    setTimeout(() => setFlash(""), 8000);
  };

  const fetchAll = useCallback(async () => {
    if (!ticketId) return;
    setLoading(true);
    try {
      // Step 1: fetch the ticket by its Firestore doc ID (from the URL param)
      const tRes = await fetch(`/api/tickets/detail?id=${ticketId}`);
      const tJson = await tRes.json() as { ticket?: ApiTicket; error?: string };

      if (!tRes.ok) {
        if (tRes.status === 404) { router.push("/admin/support"); return; }
        throw new Error(tJson.error ?? `HTTP ${tRes.status}`);
      }

      const t = tJson.ticket!;
      console.log("[admin-detail] ticket loaded — doc id:", t.id, " ticketId:", t.ticketId);

      // Step 2: fetch messages using ticket.ticketId (TECH-XXXXXX), NOT the Firestore doc ID
      const mRes = await fetch(`/api/tickets/messages?ticketId=${encodeURIComponent(t.ticketId)}`);
      const mJson = await mRes.json() as { messages?: ApiMessage[]; error?: string };
      if (!mRes.ok) throw new Error(mJson.error ?? `HTTP ${mRes.status}`);

      setTicket(t);
      setMessages(mJson.messages ?? []);
      setNewStatus(t.status);
      setNewPriority(t.priority);
      setAssignedTo(t.assignedTo ?? "");
      setAdminNotes(t.adminNotes ?? "");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[admin-detail] fetchAll failed:", msg);
      showFlash(msg, "err");
    } finally {
      setLoading(false);
    }
  }, [ticketId, router]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleStatusUpdate() {
    if (!ticket) return;
    console.log("[admin-detail] handleStatusUpdate — doc id:", ticket.id, "new status:", newStatus, "new priority:", newPriority);
    setSavingStatus(true);
    try {
      const payload = { id: ticket.id, status: newStatus, priority: newPriority, assignedTo: assignedTo || null };
      console.log("[admin-detail] PATCH /api/tickets/update →", payload);
      const res = await fetch("/api/tickets/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await res.json() as { ok?: boolean; error?: string };
      console.log("[admin-detail] update response:", res.status, j);
      if (!res.ok) throw new Error(j.error ?? `HTTP ${res.status}`);
      setTicket((t) => t ? { ...t, status: newStatus, priority: newPriority, assignedTo: assignedTo || null } : t);

      // Email notifications
      const emailPayload = {
        ticketId: ticket.ticketId,
        id: ticket.id,
        studentName: ticket.studentName,
        studentEmail: ticket.studentEmail,
        category: ticket.category,
        courseName: ticket.courseName,
        description: ticket.description,
        status: newStatus,
      };

      if (newStatus === "WAITING_FOR_STUDENT") {
        fetch("/api/send-ticket-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "resolution_confirm", ticket: emailPayload }),
        }).catch(() => {});
      } else if (newStatus !== ticket.status) {
        fetch("/api/send-ticket-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "status_update", ticket: emailPayload }),
        }).catch(() => {});
      }

      showFlash("Ticket updated successfully");
    } catch (err) {
      showFlash(err instanceof Error ? err.message : "Failed to update ticket", "err");
    } finally {
      setSavingStatus(false);
    }
  }

  async function handleSaveNotes() {
    if (!ticket) return;
    console.log("[admin-detail] handleSaveNotes — doc id:", ticket.id);
    setSavingNotes(true);
    try {
      const res = await fetch("/api/tickets/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: ticket.id, adminNotes }),
      });
      const j = await res.json() as { ok?: boolean; error?: string };
      console.log("[admin-detail] notes response:", res.status, j);
      if (!res.ok) throw new Error(j.error ?? `HTTP ${res.status}`);
      setTicket((t) => t ? { ...t, adminNotes } : t);
      showFlash("Notes saved");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[admin-detail] save notes failed:", msg);
      showFlash(msg, "err");
    } finally {
      setSavingNotes(false);
    }
  }

  async function handleSendReply() {
    if (!ticket || !replyText.trim()) return;
    console.log("[admin-detail] handleSendReply — ticketId (TECH):", ticket.ticketId, "doc id:", ticket.id);
    setSendingReply(true);
    try {
      const res = await fetch("/api/tickets/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: ticket.ticketId,   // human-readable TECH-XXXXXX
          senderType: "ADMIN",
          senderName: "Technical Team",
          message: replyText.trim(),
          attachmentUrl: null,
        }),
      });
      const j = await res.json() as { message?: ApiMessage; error?: string };
      console.log("[admin-detail] message POST response:", res.status, j);
      if (!res.ok) throw new Error(j.error ?? `HTTP ${res.status}`);

      setMessages((prev) => [...prev, j.message!]);
      setReplyText("");

      // Auto-move to IN_PROGRESS on first admin reply
      if (ticket.status === "OPEN") {
        const upRes = await fetch("/api/tickets/update", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: ticket.id, status: "IN_PROGRESS" }),
        });
        if (upRes.ok) {
          setTicket((t) => t ? { ...t, status: "IN_PROGRESS" } : t);
          setNewStatus("IN_PROGRESS");
        }
      }
      showFlash("Reply sent");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[admin-detail] send reply failed:", msg);
      showFlash(msg, "err");
    } finally {
      setSendingReply(false);
    }
  }

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", flexDirection: "column", gap: "12px" }}>
        <div style={{ fontSize: "32px" }}>⏳</div>
        <div style={{ color: "rgba(255,255,255,0.45)", fontFamily: "Nunito, sans-serif" }}>Loading ticket…</div>
      </div>
    );
  }

  if (!ticket) return null;

  const sc = STATUS_COLORS[ticket.status];
  const pc = PRIORITY_COLORS[ticket.priority];

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto", fontFamily: "Nunito, sans-serif" }}>
      {/* Flash */}
      {flash && (
        <div
          onClick={() => setFlash("")}
          style={{
            position: "fixed", top: "70px", right: "24px", zIndex: 9999,
            background: flashType === "ok" ? "rgba(52,211,153,0.15)" : "rgba(248,113,113,0.15)",
            border: `1px solid ${flashType === "ok" ? "rgba(52,211,153,0.3)" : "rgba(248,113,113,0.3)"}`,
            borderRadius: "12px", padding: "12px 20px",
            color: flashType === "ok" ? "#34d399" : "#f87171",
            fontSize: "14px", fontFamily: "Nunito, sans-serif", maxWidth: "440px", wordBreak: "break-all",
            cursor: "pointer",
          }}
        >
          {flash}
          <span style={{ marginLeft: "10px", opacity: 0.6, fontSize: "12px" }}>(click to dismiss)</span>
        </div>
      )}

      {/* Back + Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
        <Link href="/admin/support" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: "13px", display: "flex", alignItems: "center", gap: "5px" }}>
          ← Back to Support
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, flexWrap: "wrap" }}>
          <h1 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "22px", fontWeight: 700, color: "#60a5fa", margin: 0 }}>
            {ticket.ticketId}
          </h1>
          <Badge text={STATUS_LABELS[ticket.status]} colors={sc} />
          <Badge text={ticket.priority} colors={pc} />
          <Badge text={ticket.category} colors={{ color: "rgba(255,255,255,0.6)", bg: "rgba(255,255,255,0.06)", border: "rgba(255,255,255,0.1)" }} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "20px", alignItems: "start" }}>
        {/* Left: Info + Chat */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <Card title="Student Information">
            <InfoGrid>
              <Info label="Name" value={ticket.studentName} />
              <Info label="Email" value={ticket.studentEmail} />
              <Info label="WhatsApp" value={ticket.whatsappNumber} />
              <Info label="Course" value={ticket.courseName} />
              <Info label="Submitted" value={formatDate(ticket.createdAt)} />
              <Info label="Last Updated" value={formatDate(ticket.updatedAt)} />
            </InfoGrid>
          </Card>

          <Card title="Issue Description">
            <p style={{ color: "rgba(255,255,255,0.8)", lineHeight: "1.7", margin: 0, fontSize: "14px" }}>
              {ticket.description}
            </p>
          </Card>

          {ticket.screenshotUrl && (
            <Card title="Screenshot">
              <a href={ticket.screenshotUrl} target="_blank" rel="noopener noreferrer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ticket.screenshotUrl} alt="Ticket screenshot"
                  style={{ maxWidth: "100%", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer" }} />
              </a>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginTop: "8px" }}>Click to open full size</div>
            </Card>
          )}

          <Card title={`Conversation Thread (${messages.length} messages)`}>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px", minHeight: "80px" }}>
              {messages.length === 0 ? (
                <div style={{ textAlign: "center", padding: "24px", color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>
                  No messages yet. Start the conversation below.
                </div>
              ) : messages.map((msg) => {
                const isAdmin = msg.senderType === "ADMIN";
                return (
                  <div key={msg.id} style={{ display: "flex", flexDirection: isAdmin ? "row-reverse" : "row", gap: "10px", alignItems: "flex-end" }}>
                    <div style={{
                      width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0,
                      background: isAdmin ? "linear-gradient(135deg,#FF6200,#FF8534)" : "rgba(96,165,250,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px",
                    }}>{isAdmin ? "⚙️" : "🎓"}</div>
                    <div style={{ maxWidth: "75%", display: "flex", flexDirection: "column", gap: "4px", alignItems: isAdmin ? "flex-end" : "flex-start" }}>
                      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>
                        {isAdmin ? "Technical Team" : msg.senderName} · {formatDate(msg.createdAt)}
                      </div>
                      <div style={{
                        padding: "10px 14px", borderRadius: isAdmin ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
                        background: isAdmin ? "rgba(255,98,0,0.15)" : "rgba(96,165,250,0.12)",
                        border: isAdmin ? "1px solid rgba(255,98,0,0.2)" : "1px solid rgba(96,165,250,0.2)",
                        color: "#fff", fontSize: "14px", lineHeight: "1.6",
                      }}>{msg.message}</div>
                    </div>
                  </div>
                );
              })}
              <div ref={chatBottomRef} />
            </div>

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "16px" }}>
              <textarea
                rows={3}
                placeholder="Type your reply to the student..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                style={{
                  width: "100%", boxSizing: "border-box",
                  background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px", padding: "12px 14px", color: "#fff",
                  fontSize: "14px", fontFamily: "Nunito, sans-serif",
                  lineHeight: "1.6", resize: "vertical", outline: "none", marginBottom: "10px",
                }}
              />
              <button
                onClick={handleSendReply}
                disabled={sendingReply || !replyText.trim()}
                style={{
                  padding: "10px 22px", borderRadius: "10px",
                  background: sendingReply || !replyText.trim() ? "rgba(255,98,0,0.3)" : "linear-gradient(135deg,#FF6200,#FF8534)",
                  border: "none", color: "#fff", fontSize: "14px", fontWeight: 700,
                  cursor: sendingReply || !replyText.trim() ? "not-allowed" : "pointer",
                  fontFamily: "Nunito, sans-serif",
                }}
              >
                {sendingReply ? "Sending…" : "Send Reply →"}
              </button>
            </div>
          </Card>
        </div>

        {/* Right: Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", position: "sticky", top: "70px" }}>
          <Card title="Update Ticket">
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <SideLabel>Status</SideLabel>
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value as TicketStatus)} style={selectStyle}>
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                </select>
              </div>
              <div>
                <SideLabel>Priority</SideLabel>
                <select value={newPriority} onChange={(e) => setNewPriority(e.target.value as TicketPriority)} style={selectStyle}>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>
              <div>
                <SideLabel>Assigned To</SideLabel>
                <input type="text" placeholder="Team member name" value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)} style={inputStyle} />
              </div>
              <button onClick={handleStatusUpdate} disabled={savingStatus} style={primaryBtnStyle(savingStatus)}>
                {savingStatus ? "Saving…" : "Save Changes"}
              </button>
              {newStatus === "WAITING_FOR_STUDENT" && (
                <div style={{
                  padding: "10px 12px", borderRadius: "10px",
                  background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)",
                  fontSize: "12px", color: "rgba(251,191,36,0.9)", lineHeight: "1.5",
                }}>
                  ℹ️ This will send a resolution confirmation email to the student.
                </div>
              )}
            </div>
          </Card>

          <Card title="Internal Notes">
            <textarea rows={5} placeholder="Internal notes (not visible to student)..."
              value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)}
              style={{ ...inputStyle, resize: "vertical", height: "auto", fontFamily: "Nunito, sans-serif", lineHeight: "1.6" }}
            />
            <button onClick={handleSaveNotes} disabled={savingNotes} style={{ ...primaryBtnStyle(savingNotes), marginTop: "10px" }}>
              {savingNotes ? "Saving…" : "Save Notes"}
            </button>
          </Card>

          <Card title="Timeline">
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { label: "Created", date: ticket.createdAt, color: "#60a5fa" },
                { label: "Last Updated", date: ticket.updatedAt, color: "#fb923c" },
                { label: "Resolved", date: ticket.resolvedAt, color: "#34d399" },
              ].map(({ label, date, color }) => date ? (
                <div key={label} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: color, flexShrink: 0, marginTop: "4px" }} />
                  <div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>
                    <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", marginTop: "1px" }}>{formatDate(date)}</div>
                  </div>
                </div>
              ) : null)}
            </div>
          </Card>

          <Card title="Student Info">
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <Info label="Category" value={ticket.category} />
              <Info label="Course" value={ticket.courseName} />
              {ticket.studentUid && <Info label="UID" value={ticket.studentUid} />}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const selectStyle: React.CSSProperties = {
  width: "100%", boxSizing: "border-box",
  background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "10px", padding: "9px 12px", color: "#fff",
  fontSize: "13px", outline: "none", cursor: "pointer",
  fontFamily: "Nunito, sans-serif", appearance: "none",
};

const inputStyle: React.CSSProperties = {
  width: "100%", boxSizing: "border-box",
  background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "10px", padding: "9px 12px", color: "#fff",
  fontSize: "13px", outline: "none", fontFamily: "Nunito, sans-serif",
};

function primaryBtnStyle(disabled: boolean): React.CSSProperties {
  return {
    width: "100%", padding: "10px",
    background: disabled ? "rgba(255,98,0,0.3)" : "linear-gradient(135deg,#FF6200,#FF8534)",
    border: "none", borderRadius: "10px",
    color: "#fff", fontSize: "14px", fontWeight: 700,
    cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "Nunito, sans-serif",
  };
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "20px" }}>
      <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "15px", fontWeight: 700, color: "rgba(255,255,255,0.7)", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{title}</div>
      {children}
    </div>
  );
}

function Badge({ text, colors }: { text: string; colors: { color: string; bg: string; border: string } }) {
  return (
    <span style={{ display: "inline-block", padding: "3px 11px", borderRadius: "20px", fontSize: "11px", fontWeight: 700, whiteSpace: "nowrap", color: colors.color, background: colors.bg, border: `1px solid ${colors.border}`, fontFamily: "Nunito, sans-serif" }}>
      {text}
    </span>
  );
}

function InfoGrid({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>{children}</div>;
}

function Info({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "3px" }}>{label}</div>
      <div style={{ fontSize: "13px", color: "#fff", fontWeight: 600 }}>{value || "—"}</div>
    </div>
  );
}

function SideLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "6px" }}>{children}</div>
  );
}

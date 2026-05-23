"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useSupportModal } from "@/contexts/SupportContext";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  STATUS_LABELS,
  STATUS_COLORS,
  PRIORITY_COLORS,
  formatDate,
  type ApiTicket,
  type ApiMessage,
} from "@/lib/tickets";

interface TicketEvent {
  id: string;
  type: "STATUS_CHANGE" | "PRIORITY_CHANGE" | "ADMIN_REPLY" | "STUDENT_REPLY" | "CREATED";
  actor: string;
  oldValue?: string;
  newValue?: string;
  note?: string;
  createdAt: string | null;
}

export default function StudentTicketDetailPage() {
  const { ticketId: docId } = useParams<{ ticketId: string }>();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const { openModal } = useSupportModal();

  const [ticket, setTicket] = useState<ApiTicket | null>(null);
  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [events, setEvents] = useState<TicketEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [forbidden, setForbidden] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [flash, setFlash] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const urlMsg = searchParams?.get("msg");

  const showFlash = (msg: string, type: "ok" | "err" = "ok") => {
    setFlash({ msg, type });
    setTimeout(() => setFlash(null), 5000);
  };

  useEffect(() => {
    if (urlMsg === "issue_solved") showFlash("✅ Thank you! Your ticket has been marked as resolved.");
    else if (urlMsg === "issue_reopened") showFlash("↺ Your ticket has been reopened. Our team will follow up.");
    else if (urlMsg === "already_handled") showFlash("ℹ️ This ticket has already been handled.");
  }, [urlMsg]);

  // Fetch ticket + messages via secure ownership-verified API
  const fetchAll = useCallback(async () => {
    if (!docId || !user) return;
    setLoading(true);
    setNotFound(false);
    setForbidden(false);
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/tickets/student-ticket?id=${docId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json() as { ticket?: ApiTicket; messages?: ApiMessage[]; error?: string };

      if (res.status === 404) { setNotFound(true); setLoading(false); return; }
      if (res.status === 403) { setForbidden(true); setLoading(false); return; }
      if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`);

      setTicket(json.ticket!);
      setMessages(json.messages ?? []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[student-ticket-detail] fetchAll failed:", msg);
      showFlash(`Failed to load ticket: ${msg}`, "err");
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [docId, user]);

  useEffect(() => {
    if (!authLoading && user) fetchAll();
  }, [authLoading, user, fetchAll]);

  // Real-time messages listener — updates chat without manual refresh
  useEffect(() => {
    if (!ticket?.ticketId) return;
    const q = query(
      collection(db, "ticket_messages"),
      where("ticketId", "==", ticket.ticketId),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map((d) => {
        const raw = d.data();
        return { id: d.id, ...raw, createdAt: raw.createdAt?.toDate?.()?.toISOString() ?? null } as ApiMessage;
      });
      setMessages(msgs);
    }, () => { /* silently ignore permission errors */ });
    return unsub;
  }, [ticket?.ticketId]);

  // Real-time ticket event log (timeline)
  useEffect(() => {
    if (!ticket?.ticketId) return;
    const q = query(
      collection(db, "ticket_events"),
      where("ticketId", "==", ticket.ticketId),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const evts = snap.docs.map((d) => {
        const raw = d.data();
        return { id: d.id, ...raw, createdAt: raw.createdAt?.toDate?.()?.toISOString() ?? null } as TicketEvent;
      });
      setEvents(evts);
    }, () => { /* silently ignore if rules deny */ });
    return unsub;
  }, [ticket?.ticketId]);

  // Real-time ticket status/field updates (starts once ticket is loaded)
  useEffect(() => {
    if (!ticket?.ticketId) return;
    const q = query(
      collection(db, "support_tickets"),
      where("ticketId", "==", ticket.ticketId)
    );
    const unsub = onSnapshot(q, (snap) => {
      if (snap.empty) return;
      const raw = snap.docs[0].data();
      setTicket((prev) => prev ? {
        ...prev,
        status: raw.status ?? prev.status,
        priority: raw.priority ?? prev.priority,
        assignedTo: raw.assignedTo ?? prev.assignedTo,
        adminNotes: raw.adminNotes ?? prev.adminNotes,
        updatedAt: raw.updatedAt?.toDate?.()?.toISOString() ?? prev.updatedAt,
        resolvedAt: raw.resolvedAt?.toDate?.()?.toISOString() ?? prev.resolvedAt,
      } : prev);
    }, () => { /* silently ignore if Firestore rules deny */ });
    return unsub;
  }, [ticket?.ticketId]);

  // Auto-scroll to bottom of chat when messages change
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSendReply() {
    if (!ticket || !replyText.trim() || !user) return;
    setSendingReply(true);
    try {
      // Upload attachment if present
      let attachmentUrl: string | null = null;
      if (attachment) {
        const path = `support_screenshots/${Date.now()}_${attachment.name}`;
        const sRef = storageRef(storage, path);
        await uploadBytes(sRef, attachment);
        attachmentUrl = await getDownloadURL(sRef);
      }

      // Use the messages API (Admin SDK — bypasses Firestore rules)
      const token = await user.getIdToken();
      const res = await fetch("/api/tickets/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ticketId: ticket.ticketId, // TECH-XXXXXX format — NOT the Firestore doc ID
          senderType: "STUDENT",
          senderName: user.displayName ?? ticket.studentName,
          message: replyText.trim(),
          attachmentUrl,
        }),
      });

      const json = await res.json() as { message?: ApiMessage; error?: string };
      if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`);

      setMessages((prev) => [...prev, json.message!]);
      setReplyText("");
      setAttachment(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      showFlash(`Failed to send reply: ${msg}`, "err");
    } finally {
      setSendingReply(false);
    }
  }

  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    background: "#060D1A",
    fontFamily: "Nunito, sans-serif",
    paddingTop: "100px",
    paddingBottom: "60px",
  };

  // ── Auth loading ───────────────────────────────────────────────────────────
  if (authLoading || (loading && !notFound && !forbidden)) {
    return (
      <div style={{ ...pageStyle, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>⏳</div>
          <div style={{ color: "rgba(255,255,255,0.45)" }}>Loading ticket…</div>
        </div>
      </div>
    );
  }

  // ── Not logged in ──────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div style={{ ...pageStyle, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: "400px", padding: "0 20px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔒</div>
          <h2 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "22px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
            Login Required
          </h2>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "14px", marginBottom: "24px" }}>
            Please log in to view your support tickets.
          </p>
          <Link href="/support" style={{
            padding: "10px 22px", borderRadius: "50px",
            background: "linear-gradient(135deg,#FF6200,#FF8534)",
            color: "#fff", textDecoration: "none", fontSize: "14px", fontWeight: 700,
          }}>← My Tickets</Link>
        </div>
      </div>
    );
  }

  // ── Forbidden (not their ticket) ───────────────────────────────────────────
  if (forbidden) {
    return (
      <div style={{ ...pageStyle, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: "400px", padding: "0 20px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🚫</div>
          <h2 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "22px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
            Access Denied
          </h2>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "14px", marginBottom: "24px" }}>
            You don&apos;t have permission to view this ticket.
          </p>
          <Link href="/support" style={{
            padding: "10px 22px", borderRadius: "50px",
            background: "linear-gradient(135deg,#FF6200,#FF8534)",
            color: "#fff", textDecoration: "none", fontSize: "14px", fontWeight: 700,
          }}>← My Tickets</Link>
        </div>
      </div>
    );
  }

  // ── Not found ──────────────────────────────────────────────────────────────
  if (notFound || !ticket) {
    return (
      <div style={{ ...pageStyle, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: "400px", padding: "0 20px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
          <h2 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "22px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
            Ticket Not Found
          </h2>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "14px", marginBottom: "24px" }}>
            This ticket doesn&apos;t exist or may have been removed.
          </p>
          <Link href="/support" style={{
            padding: "10px 22px", borderRadius: "50px",
            background: "linear-gradient(135deg,#FF6200,#FF8534)",
            color: "#fff", textDecoration: "none", fontSize: "14px", fontWeight: 700,
          }}>← My Tickets</Link>
        </div>
      </div>
    );
  }

  const sc = STATUS_COLORS[ticket.status];
  const pc = PRIORITY_COLORS[ticket.priority];
  const isWaitingForStudent = ticket.status === "WAITING_FOR_STUDENT";
  const isClosed = ticket.status === "CLOSED";

  return (
    <div style={pageStyle}>
      {/* Image lightbox */}
      {lightboxUrl && (
        <div
          onClick={() => setLightboxUrl(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 10000,
            background: "rgba(0,0,0,0.92)", backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "20px", cursor: "zoom-out",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightboxUrl} alt="Full size"
            style={{ maxWidth: "90vw", maxHeight: "88vh", objectFit: "contain", borderRadius: "12px" }}
            onClick={e => e.stopPropagation()}
          />
          <a
            href={lightboxUrl} download target="_blank" rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{
              position: "absolute", bottom: "24px", right: "24px",
              padding: "8px 18px", borderRadius: "10px",
              background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff", fontSize: "13px", fontWeight: 600, textDecoration: "none",
            }}
          >
            ⬇️ Download
          </a>
          <button
            onClick={() => setLightboxUrl(null)}
            style={{
              position: "absolute", top: "20px", right: "20px",
              background: "rgba(255,255,255,0.1)", border: "none",
              borderRadius: "50%", width: "40px", height: "40px",
              color: "#fff", fontSize: "20px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >×</button>
        </div>
      )}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 20px" }}>

        {/* Flash */}
        {flash && (
          <div
            onClick={() => setFlash(null)}
            style={{
              background: flash.type === "err"
                ? "rgba(248,113,113,0.12)" : "rgba(52,211,153,0.12)",
              border: flash.type === "err"
                ? "1px solid rgba(248,113,113,0.3)" : "1px solid rgba(52,211,153,0.3)",
              borderRadius: "14px", padding: "14px 18px", marginBottom: "20px",
              color: flash.type === "err" ? "#f87171" : "#34d399",
              fontSize: "14px", cursor: "pointer",
            }}
          >
            {flash.msg} <span style={{ opacity: 0.5, fontSize: "12px" }}>(click to dismiss)</span>
          </div>
        )}

        {/* Back */}
        <div style={{ marginBottom: "20px" }}>
          <Link href="/support" style={{
            color: "rgba(255,255,255,0.4)", fontSize: "13px", textDecoration: "none",
            display: "inline-flex", alignItems: "center", gap: "5px",
          }}>
            ← Back to My Tickets
          </Link>
        </div>

        {/* Ticket header card */}
        <div style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "20px", padding: "22px 24px", marginBottom: "16px",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Ticket ID + status badges */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", flexWrap: "wrap" }}>
                <span style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, color: "#60a5fa", fontSize: "20px" }}>
                  {ticket.ticketId}
                </span>
                <StatusBadge text={STATUS_LABELS[ticket.status]} colors={sc} />
                <StatusBadge text={ticket.priority} colors={pc} />
              </div>
              <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", marginBottom: "4px" }}>
                {ticket.category} — {ticket.courseName}
              </div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>
                Submitted {formatDate(ticket.createdAt)}
              </div>
              {ticket.assignedTo && (
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", marginTop: "2px" }}>
                  Assigned to: {ticket.assignedTo}
                </div>
              )}
            </div>
            <button
              onClick={openModal}
              style={{
                padding: "8px 16px", borderRadius: "10px",
                background: "rgba(255,133,52,0.1)", border: "1px solid rgba(255,133,52,0.25)",
                color: "#FF8534", fontSize: "12px", fontWeight: 700,
                cursor: "pointer", fontFamily: "Nunito, sans-serif", whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              + New Ticket
            </button>
          </div>
        </div>

        {/* Resolution confirmation banner */}
        {isWaitingForStudent && (
          <div style={{
            background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.3)",
            borderRadius: "16px", padding: "20px 22px", marginBottom: "16px",
          }}>
            <div style={{ fontSize: "15px", fontWeight: 700, color: "#fbbf24", marginBottom: "8px" }}>
              ⚠️ Has your issue been resolved?
            </div>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "13px", lineHeight: "1.6", margin: "0 0 16px" }}>
              Our technical team believes your issue has been resolved. Please confirm below.
            </p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <a
                href={`/api/tickets/confirm?id=${ticket.id}&action=solved`}
                style={{
                  padding: "10px 20px", borderRadius: "10px",
                  background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.4)",
                  color: "#34d399", textDecoration: "none", fontSize: "14px", fontWeight: 700,
                  display: "inline-flex", alignItems: "center", gap: "6px",
                }}
              >
                ✓ Issue Solved
              </a>
              <a
                href={`/api/tickets/confirm?id=${ticket.id}&action=reopen`}
                style={{
                  padding: "10px 20px", borderRadius: "10px",
                  background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)",
                  color: "#f87171", textDecoration: "none", fontSize: "14px", fontWeight: 700,
                  display: "inline-flex", alignItems: "center", gap: "6px",
                }}
              >
                ✗ Still Facing Issue
              </a>
            </div>
          </div>
        )}

        {/* Issue description */}
        <div style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "16px", padding: "20px 22px", marginBottom: "16px",
        }}>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "10px" }}>
            Issue Description
          </div>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", lineHeight: "1.7", margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {ticket.description}
          </p>

          {/* Screenshots and media are shown in the Attachments block below */}
        </div>

        {/* Media attachments */}
        <AttachmentsBlock ticket={ticket} onLightbox={setLightboxUrl} />

        {/* Admin notes — show to student if present */}
        {ticket.adminNotes && (
          <div style={{
            background: "rgba(96,165,250,0.05)", border: "1px solid rgba(96,165,250,0.2)",
            borderRadius: "16px", padding: "16px 20px", marginBottom: "16px",
          }}>
            <div style={{ fontSize: "12px", color: "rgba(96,165,250,0.7)", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "8px" }}>
              📋 Notes from Support Team
            </div>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
              {ticket.adminNotes}
            </p>
          </div>
        )}

        {/* Conversation thread */}
        <div style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "16px", padding: "20px 22px", marginBottom: "16px",
        }}>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "16px" }}>
            Conversation Thread {messages.length > 0 && `(${messages.length})`}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px", minHeight: "60px" }}>
            {messages.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px", color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>
                No messages yet. The support team will reply here.
              </div>
            ) : (
              messages.map((msg) => {
                const isAdmin = msg.senderType === "ADMIN";
                return (
                  <div key={msg.id} style={{
                    display: "flex",
                    flexDirection: isAdmin ? "row" : "row-reverse",
                    gap: "10px",
                    alignItems: "flex-end",
                  }}>
                    {/* Avatar */}
                    <div style={{
                      width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0,
                      background: isAdmin ? "linear-gradient(135deg,#FF6200,#FF8534)" : "rgba(96,165,250,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px",
                    }}>
                      {isAdmin ? "⚙️" : "🎓"}
                    </div>

                    {/* Bubble */}
                    <div style={{
                      maxWidth: "78%",
                      display: "flex", flexDirection: "column", gap: "4px",
                      alignItems: isAdmin ? "flex-start" : "flex-end",
                    }}>
                      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>
                        {isAdmin ? "Technical Team" : msg.senderName} · {formatDate(msg.createdAt)}
                      </div>
                      <div style={{
                        padding: "10px 14px",
                        borderRadius: isAdmin ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
                        background: isAdmin ? "rgba(255,98,0,0.12)" : "rgba(96,165,250,0.1)",
                        border: isAdmin ? "1px solid rgba(255,98,0,0.18)" : "1px solid rgba(96,165,250,0.18)",
                        color: "#fff", fontSize: "14px", lineHeight: "1.6",
                        wordBreak: "break-word", whiteSpace: "pre-wrap",
                      }}>
                        {msg.message}
                      </div>
                      {msg.attachmentUrl && (
                        <a href={msg.attachmentUrl} target="_blank" rel="noopener noreferrer">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={msg.attachmentUrl}
                            alt="Attachment"
                            style={{
                              maxWidth: "180px", borderRadius: "8px",
                              border: "1px solid rgba(255,255,255,0.1)", marginTop: "4px",
                              display: "block",
                            }}
                          />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Reply area */}
          {!isClosed ? (
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "16px", marginTop: "16px" }}>
              <textarea
                rows={3}
                placeholder="Reply to the technical team…"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => {
                  // Ctrl/Cmd + Enter sends
                  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleSendReply();
                }}
                style={{
                  width: "100%", boxSizing: "border-box",
                  background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px", padding: "12px 14px", color: "#fff",
                  fontSize: "14px", fontFamily: "Nunito, sans-serif",
                  lineHeight: "1.6", resize: "vertical", outline: "none",
                  marginBottom: "10px",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(255,133,52,0.5)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
              />

              {/* Attachment preview */}
              {attachment && (
                <div style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  marginBottom: "10px", fontSize: "12px", color: "rgba(255,255,255,0.5)",
                }}>
                  <span>📎 {attachment.name}</span>
                  <button
                    onClick={() => { setAttachment(null); if (fileRef.current) fileRef.current.value = ""; }}
                    style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: "14px" }}
                  >×</button>
                </div>
              )}

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  style={{
                    padding: "9px 16px", borderRadius: "10px",
                    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.65)", fontSize: "13px", cursor: "pointer",
                    fontFamily: "Nunito, sans-serif",
                  }}
                >
                  📎 Attach
                </button>
                <button
                  onClick={handleSendReply}
                  disabled={sendingReply || !replyText.trim()}
                  style={{
                    padding: "9px 22px", borderRadius: "10px",
                    background: sendingReply || !replyText.trim()
                      ? "rgba(255,98,0,0.3)"
                      : "linear-gradient(135deg,#FF6200,#FF8534)",
                    border: "none", color: "#fff", fontSize: "14px", fontWeight: 700,
                    cursor: sendingReply || !replyText.trim() ? "not-allowed" : "pointer",
                    fontFamily: "Nunito, sans-serif",
                    transition: "all 0.2s",
                  }}
                >
                  {sendingReply ? "Sending…" : "Send Reply →"}
                </button>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>
                  Ctrl+Enter to send
                </span>
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  if (f.size > 5 * 1024 * 1024) { alert("File must be under 5 MB"); return; }
                  setAttachment(f);
                }}
              />
            </div>
          ) : (
            <div style={{
              marginTop: "16px", padding: "12px 16px", borderRadius: "10px",
              background: "rgba(255,255,255,0.04)", fontSize: "13px",
              color: "rgba(255,255,255,0.4)", textAlign: "center",
            }}>
              This ticket is closed.{" "}
              <button
                onClick={openModal}
                style={{
                  background: "none", border: "none", color: "#FF8534",
                  cursor: "pointer", fontSize: "13px", fontFamily: "Nunito, sans-serif",
                }}
              >
                Report a new issue →
              </button>
            </div>
          )}
        </div>

        {/* Ticket timeline */}
        {(events.length > 0 || ticket.createdAt) && (
          <div style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "16px", padding: "20px 22px", marginBottom: "16px",
          }}>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "16px" }}>
              📋 Ticket Timeline
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {/* Created */}
              {ticket.createdAt && (
                <TimelineRow icon="🎫" label="Ticket Created" date={ticket.createdAt} color="#60a5fa" isFirst />
              )}
              {/* Dynamic events */}
              {events.map((ev) => {
                const icon = ev.type === "STATUS_CHANGE" ? "↔️"
                  : ev.type === "PRIORITY_CHANGE" ? "🔺"
                  : ev.type === "ADMIN_REPLY" ? "⚙️"
                  : ev.type === "STUDENT_REPLY" ? "🎓"
                  : "📋";
                const label = ev.type === "STATUS_CHANGE"
                  ? `Status changed to ${ev.newValue?.replace(/_/g, " ")}`
                  : ev.type === "PRIORITY_CHANGE"
                  ? `Priority changed to ${ev.newValue}`
                  : ev.type === "ADMIN_REPLY"
                  ? "Support team replied"
                  : ev.type === "STUDENT_REPLY"
                  ? "You replied"
                  : ev.note ?? ev.type.replace(/_/g, " ");
                const color = ev.type === "STATUS_CHANGE"
                  ? (ev.newValue === "RESOLVED" || ev.newValue === "CLOSED" ? "#34d399" : ev.newValue === "REOPENED" ? "#f87171" : "#fb923c")
                  : ev.type === "ADMIN_REPLY" ? "#FF8534"
                  : "#60a5fa";
                return (
                  <TimelineRow key={ev.id} icon={icon} label={label} date={ev.createdAt} color={color} />
                );
              })}
              {/* Resolved */}
              {ticket.resolvedAt && ticket.status !== "REOPENED" && (
                <TimelineRow icon="✅" label={`Ticket ${ticket.status === "CLOSED" ? "Closed" : "Resolved"}`} date={ticket.resolvedAt} color="#34d399" />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function StatusBadge({ text, colors }: { text: string; colors: { color: string; bg: string; border: string } }) {
  return (
    <span style={{
      display: "inline-block", padding: "3px 10px", borderRadius: "20px",
      fontSize: "11px", fontWeight: 700, whiteSpace: "nowrap",
      color: colors.color, background: colors.bg, border: `1px solid ${colors.border}`,
    }}>
      {text}
    </span>
  );
}

function TimelineRow({
  icon, label, date, color, isFirst,
}: {
  icon: string; label: string; date: string | null; color: string; isFirst?: boolean;
}) {
  return (
    <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", paddingBottom: "14px", position: "relative" }}>
      {/* Vertical line */}
      {!isFirst && (
        <div style={{
          position: "absolute", left: "11px", top: "-14px", width: "2px", height: "14px",
          background: "rgba(255,255,255,0.08)",
        }} />
      )}
      {/* Dot */}
      <div style={{
        width: "24px", height: "24px", borderRadius: "50%", flexShrink: 0,
        background: `${color}20`, border: `2px solid ${color}60`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "11px", zIndex: 1,
      }}>{icon}</div>
      <div style={{ paddingTop: "2px" }}>
        <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginTop: "2px" }}>{formatDate(date)}</div>
      </div>
    </div>
  );
}

function AttachmentsBlock({
  ticket,
  onLightbox,
}: {
  ticket: ApiTicket;
  onLightbox: (url: string) => void;
}) {
  // Merge new attachments array with old screenshotUrl (backward compat)
  const images = [
    ...(ticket.attachments ?? []),
    ...(!ticket.attachments?.length && ticket.screenshotUrl ? [ticket.screenshotUrl] : []),
  ];

  const hasAudio = !!ticket.voiceNoteUrl;
  const hasVideo = !!ticket.screenRecordingUrl;

  if (!images.length && !hasAudio && !hasVideo) return null;

  return (
    <div style={{
      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: "16px", padding: "20px 22px", marginBottom: "16px",
    }}>
      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "16px" }}>
        📎 Attachments
      </div>

      {/* Image gallery */}
      {images.length > 0 && (
        <div style={{ marginBottom: hasAudio || hasVideo ? "16px" : 0 }}>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "10px" }}>
            📸 Screenshots ({images.length})
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {images.map((url, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onLightbox(url)}
                style={{ background: "none", border: "none", padding: 0, cursor: "zoom-in", borderRadius: "10px", overflow: "hidden" }}
                title="Click to enlarge"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url} alt={`Screenshot ${i + 1}`}
                  style={{
                    width: "100px", height: "80px", objectFit: "cover",
                    borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)",
                    display: "block", transition: "opacity 0.2s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.opacity = "0.8"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.opacity = "1"; }}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Voice note */}
      {hasAudio && (
        <div style={{ marginBottom: hasVideo ? "16px" : 0 }}>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "8px" }}>
            🎙️ Voice Note{ticket.voiceDuration ? ` (${Math.floor(ticket.voiceDuration / 60)}:${(ticket.voiceDuration % 60).toString().padStart(2, "0")})` : ""}
          </div>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <audio
            controls
            src={ticket.voiceNoteUrl!}
            style={{ width: "100%", maxWidth: "400px", height: "40px" }}
          />
          <div style={{ marginTop: "6px" }}>
            <a
              href={ticket.voiceNoteUrl!}
              download
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: "12px", color: "#60a5fa", textDecoration: "none" }}
            >
              ⬇️ Download Voice Note
            </a>
          </div>
        </div>
      )}

      {/* Screen recording */}
      {hasVideo && (
        <div>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "8px" }}>
            📹 Screen Recording
          </div>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            controls
            src={ticket.screenRecordingUrl!}
            style={{
              width: "100%", maxWidth: "480px", borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.1)", display: "block",
            }}
          />
          <a
            href={ticket.screenRecordingUrl!}
            download target="_blank" rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: "5px",
              marginTop: "8px", fontSize: "12px", color: "#60a5fa", textDecoration: "none",
            }}
          >
            ⬇️ Download Recording
          </a>
        </div>
      )}
    </div>
  );
}

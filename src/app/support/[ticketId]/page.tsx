"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useSupportModal } from "@/contexts/SupportContext";
import {
  getTicketById,
  getTicketMessages,
  addTicketMessage,
  STATUS_LABELS,
  STATUS_COLORS,
  PRIORITY_COLORS,
  formatDate,
  type SupportTicket,
  type TicketMessage,
} from "@/lib/tickets";
import { storage } from "@/lib/firebase";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

export default function StudentTicketDetailPage() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { openModal } = useSupportModal();

  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [flash, setFlash] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const msg = searchParams?.get("msg");

  const showFlash = (m: string) => {
    setFlash(m);
    setTimeout(() => setFlash(""), 4000);
  };

  // Map query param message
  useEffect(() => {
    if (msg === "issue_solved") showFlash("✅ Thank you! Your ticket has been marked as resolved.");
    if (msg === "issue_reopened") showFlash("↺ Your ticket has been reopened. Our team will follow up.");
    if (msg === "already_handled") showFlash("ℹ️ This ticket has already been handled.");
  }, [msg]);

  const fetchAll = useCallback(async () => {
    if (!ticketId) return;
    setLoading(true);
    try {
      const [t, msgs] = await Promise.all([
        getTicketById(ticketId),
        getTicketMessages(ticketId),
      ]);
      if (!t) { setNotFound(true); setLoading(false); return; }
      setTicket(t);
      setMessages(msgs);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSendReply() {
    if (!ticket || !replyText.trim()) return;
    setSendingReply(true);
    try {
      let attachmentUrl: string | null = null;
      if (attachment) {
        const path = `support_screenshots/${Date.now()}_${attachment.name}`;
        const sRef = storageRef(storage, path);
        await uploadBytes(sRef, attachment);
        attachmentUrl = await getDownloadURL(sRef);
      }

      const senderName = user?.displayName ?? ticket.studentName;
      const msg = await addTicketMessage(ticket.ticketId, "STUDENT", senderName, replyText.trim(), attachmentUrl);
      setMessages((prev) => [...prev, msg]);
      setReplyText("");
      setAttachment(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch {
      showFlash("Failed to send reply. Please try again.");
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

  if (loading) {
    return (
      <div style={{ ...pageStyle, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>⏳</div>
          <div style={{ color: "rgba(255,255,255,0.45)" }}>Loading ticket…</div>
        </div>
      </div>
    );
  }

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

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 20px" }}>
        {/* Flash */}
        {flash && (
          <div style={{
            background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.25)",
            borderRadius: "14px", padding: "14px 18px", marginBottom: "20px",
            color: "#34d399", fontSize: "14px",
          }}>{flash}</div>
        )}

        {/* Back */}
        <div style={{ marginBottom: "20px" }}>
          <Link href="/support" style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", textDecoration: "none", display: "flex", alignItems: "center", gap: "5px" }}>
            ← Back to My Tickets
          </Link>
        </div>

        {/* Header */}
        <div style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "20px", padding: "22px 24px", marginBottom: "16px",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
            <div>
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
            </div>
            <button
              onClick={openModal}
              style={{
                padding: "8px 16px", borderRadius: "10px",
                background: "rgba(255,133,52,0.1)", border: "1px solid rgba(255,133,52,0.25)",
                color: "#FF8534", fontSize: "12px", fontWeight: 700,
                cursor: "pointer", fontFamily: "Nunito, sans-serif", whiteSpace: "nowrap",
              }}
            >
              + New Ticket
            </button>
          </div>
        </div>

        {/* Resolution Confirmation Banner */}
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

        {/* Description */}
        <div style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "16px", padding: "20px 22px", marginBottom: "16px",
        }}>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "10px" }}>
            Issue Description
          </div>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", lineHeight: "1.7", margin: 0 }}>
            {ticket.description}
          </p>

          {ticket.screenshotUrl && (
            <div style={{ marginTop: "14px" }}>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Attached Screenshot
              </div>
              <a href={ticket.screenshotUrl} target="_blank" rel="noopener noreferrer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ticket.screenshotUrl}
                  alt="Issue screenshot"
                  style={{ maxWidth: "100%", maxHeight: "220px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", objectFit: "contain" }}
                />
              </a>
            </div>
          )}
        </div>

        {/* Chat */}
        <div style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "16px", padding: "20px 22px", marginBottom: "16px",
        }}>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "16px" }}>
            Conversation Thread
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px", minHeight: "60px" }}>
            {messages.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px", color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>
                No messages yet. The support team will reply here.
              </div>
            ) : messages.map((msg) => {
              const isAdmin = msg.senderType === "ADMIN";
              return (
                <div key={msg.id} style={{ display: "flex", flexDirection: isAdmin ? "row" : "row-reverse", gap: "10px", alignItems: "flex-end" }}>
                  <div style={{
                    width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0,
                    background: isAdmin ? "linear-gradient(135deg,#FF6200,#FF8534)" : "rgba(96,165,250,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px",
                  }}>
                    {isAdmin ? "⚙️" : "🎓"}
                  </div>
                  <div style={{ maxWidth: "78%", display: "flex", flexDirection: "column", gap: "4px", alignItems: isAdmin ? "flex-start" : "flex-end" }}>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>
                      {isAdmin ? "Technical Team" : msg.senderName} · {formatDate(msg.createdAt)}
                    </div>
                    <div style={{
                      padding: "10px 14px",
                      borderRadius: isAdmin ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
                      background: isAdmin ? "rgba(255,98,0,0.12)" : "rgba(96,165,250,0.1)",
                      border: isAdmin ? "1px solid rgba(255,98,0,0.18)" : "1px solid rgba(96,165,250,0.18)",
                      color: "#fff", fontSize: "14px", lineHeight: "1.6",
                    }}>
                      {msg.message}
                    </div>
                    {msg.attachmentUrl && (
                      <a href={msg.attachmentUrl} target="_blank" rel="noopener noreferrer">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={msg.attachmentUrl}
                          alt="Attachment"
                          style={{ maxWidth: "200px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", marginTop: "4px" }}
                        />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={chatBottomRef} />
          </div>

          {/* Reply area — only if ticket is not closed */}
          {!["CLOSED"].includes(ticket.status) && (
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "16px", marginTop: "16px" }}>
              <textarea
                rows={3}
                placeholder="Reply to the technical team…"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                style={{
                  width: "100%", boxSizing: "border-box",
                  background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px", padding: "12px 14px", color: "#fff",
                  fontSize: "14px", fontFamily: "Nunito, sans-serif",
                  lineHeight: "1.6", resize: "vertical", outline: "none",
                  marginBottom: "10px",
                }}
              />

              {/* Attachment preview */}
              {attachment && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
                  <span>📎 {attachment.name}</span>
                  <button
                    onClick={() => { setAttachment(null); if (fileRef.current) fileRef.current.value = ""; }}
                    style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: "13px" }}
                  >×</button>
                </div>
              )}

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
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
                  📎 Attach Screenshot
                </button>
                <button
                  onClick={handleSendReply}
                  disabled={sendingReply || !replyText.trim()}
                  style={{
                    padding: "9px 20px", borderRadius: "10px",
                    background: sendingReply || !replyText.trim() ? "rgba(255,98,0,0.3)" : "linear-gradient(135deg,#FF6200,#FF8534)",
                    border: "none", color: "#fff", fontSize: "14px", fontWeight: 700,
                    cursor: sendingReply || !replyText.trim() ? "not-allowed" : "pointer",
                    fontFamily: "Nunito, sans-serif",
                  }}
                >
                  {sendingReply ? "Sending…" : "Send Reply →"}
                </button>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f && f.size <= 5 * 1024 * 1024) setAttachment(f);
                  else if (f) alert("File must be under 5 MB");
                }}
              />
            </div>
          )}

          {ticket.status === "CLOSED" && (
            <div style={{
              marginTop: "16px", padding: "12px 16px", borderRadius: "10px",
              background: "rgba(255,255,255,0.04)", fontSize: "13px", color: "rgba(255,255,255,0.4)",
              textAlign: "center",
            }}>
              This ticket is closed. <button onClick={openModal} style={{ background: "none", border: "none", color: "#FF8534", cursor: "pointer", fontSize: "13px", fontFamily: "Nunito, sans-serif" }}>Report a new issue →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ text, colors }: { text: string; colors: { color: string; bg: string; border: string } }) {
  return (
    <span style={{
      display: "inline-block", padding: "3px 10px", borderRadius: "20px",
      fontSize: "11px", fontWeight: 700,
      color: colors.color, background: colors.bg, border: `1px solid ${colors.border}`,
    }}>
      {text}
    </span>
  );
}

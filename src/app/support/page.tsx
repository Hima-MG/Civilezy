"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useSupportModal } from "@/contexts/SupportContext";
import { getTicketsByEmail, STATUS_LABELS, STATUS_COLORS, PRIORITY_COLORS, formatDate, type SupportTicket } from "@/lib/tickets";

export default function StudentSupportPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const { openModal } = useSupportModal();

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [lookupEmail, setLookupEmail] = useState("");
  const [lookupError, setLookupError] = useState("");
  const [searched, setSearched] = useState(false);

  const fetchTickets = useCallback(async (email: string) => {
    setLoading(true);
    try {
      const data = await getTicketsByEmail(email.trim().toLowerCase());
      setTickets(data);
      setSearched(true);
    } catch {
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch if logged in
  useEffect(() => {
    if (user?.email) {
      fetchTickets(user.email);
    }
  }, [user, fetchTickets]);

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lookupEmail.trim())) {
      setLookupError("Enter a valid email address");
      return;
    }
    setLookupError("");
    await fetchTickets(lookupEmail);
  }

  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    background: "#060D1A",
    fontFamily: "Nunito, sans-serif",
    paddingTop: "100px",
    paddingBottom: "60px",
  };

  if (authLoading) {
    return (
      <div style={{ ...pageStyle, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>⏳</div>
          <div style={{ color: "rgba(255,255,255,0.45)" }}>Loading…</div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 20px" }}>
        {/* Page header */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "8px", flexWrap: "wrap" }}>
            <div style={{
              width: "48px", height: "48px", borderRadius: "14px",
              background: "linear-gradient(135deg,#FF6200,#FF8534)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px",
            }}>🛠️</div>
            <h1 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "28px", fontWeight: 700, color: "#fff", margin: 0 }}>
              My Support Tickets
            </h1>
          </div>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "14px", margin: "0 0 20px" }}>
            Track the status of your technical issues and chat with the support team.
          </p>
          <button
            onClick={openModal}
            style={{
              padding: "11px 24px", borderRadius: "50px",
              background: "linear-gradient(135deg,#FF6200,#FF8534)",
              border: "none", color: "#fff", fontSize: "14px", fontWeight: 700,
              cursor: "pointer", fontFamily: "Nunito, sans-serif",
              boxShadow: "0 4px 16px rgba(255,98,0,0.35)",
            }}
          >
            + Report New Issue
          </button>
        </div>

        {/* If not logged in — show lookup form */}
        {!user && (
          <div style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "20px", padding: "28px", marginBottom: "24px",
          }}>
            <h2 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "18px", fontWeight: 700, color: "#fff", margin: "0 0 6px" }}>
              Look Up Your Tickets
            </h2>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "13px", margin: "0 0 18px" }}>
              Enter the email address you used when submitting your ticket.
            </p>
            <form onSubmit={handleLookup} style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <input
                type="email"
                placeholder="your@email.com"
                value={lookupEmail}
                onChange={(e) => { setLookupEmail(e.target.value); setLookupError(""); }}
                style={{
                  flex: "1 1 220px",
                  background: "rgba(0,0,0,0.3)", border: `1px solid ${lookupError ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.12)"}`,
                  borderRadius: "12px", padding: "11px 14px", color: "#fff",
                  fontSize: "14px", outline: "none", fontFamily: "Nunito, sans-serif",
                }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "11px 22px", borderRadius: "12px",
                  background: "linear-gradient(135deg,#FF6200,#FF8534)",
                  border: "none", color: "#fff", fontSize: "14px", fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer", fontFamily: "Nunito, sans-serif",
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? "Searching…" : "Search"}
              </button>
            </form>
            {lookupError && <div style={{ fontSize: "12px", color: "#f87171", marginTop: "8px" }}>{lookupError}</div>}
          </div>
        )}

        {/* Tickets list */}
        {loading && (
          <div style={{ textAlign: "center", padding: "48px 20px" }}>
            <div style={{ fontSize: "28px", marginBottom: "10px" }}>⏳</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>Loading your tickets…</div>
          </div>
        )}

        {!loading && searched && tickets.length === 0 && (
          <div style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "20px", padding: "48px 28px", textAlign: "center",
          }}>
            <div style={{ fontSize: "48px", marginBottom: "14px" }}>📭</div>
            <div style={{ color: "#fff", fontSize: "16px", fontWeight: 600, marginBottom: "6px" }}>No tickets found</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", marginBottom: "20px" }}>
              No support tickets found for this email address.
            </div>
            <button
              onClick={openModal}
              style={{
                padding: "10px 22px", borderRadius: "50px",
                background: "linear-gradient(135deg,#FF6200,#FF8534)",
                border: "none", color: "#fff", fontSize: "14px", fontWeight: 700,
                cursor: "pointer", fontFamily: "Nunito, sans-serif",
              }}
            >
              Report an Issue
            </button>
          </div>
        )}

        {!loading && tickets.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {user && (
              <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "13px", marginBottom: "4px" }}>
                Showing {tickets.length} ticket{tickets.length !== 1 ? "s" : ""} for {user.email}
              </div>
            )}
            {tickets.map((ticket) => {
              const sc = STATUS_COLORS[ticket.status];
              const pc = PRIORITY_COLORS[ticket.priority];
              return (
                <Link
                  key={ticket.id}
                  href={`/support/${ticket.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "16px", padding: "18px 20px",
                      transition: "all 0.2s", cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.05)";
                      (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,133,52,0.3)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.03)";
                      (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.08)";
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
                          <span style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, color: "#60a5fa", fontSize: "15px" }}>
                            {ticket.ticketId}
                          </span>
                          <StatusBadge text={STATUS_LABELS[ticket.status]} colors={sc} />
                          <StatusBadge text={ticket.priority} colors={pc} />
                        </div>
                        <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", marginBottom: "4px" }}>
                          {ticket.category} — {ticket.courseName}
                        </div>
                        <div style={{
                          fontSize: "13px", color: "rgba(255,255,255,0.4)",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "500px",
                        }}>
                          {ticket.description}
                        </div>
                      </div>
                      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", whiteSpace: "nowrap", textAlign: "right" }}>
                        <div>{formatDate(ticket.createdAt)}</div>
                        {ticket.status === "WAITING_FOR_STUDENT" && (
                          <div style={{
                            marginTop: "6px", padding: "4px 10px", borderRadius: "20px",
                            background: "rgba(251,191,36,0.15)", color: "#fbbf24",
                            fontSize: "11px", fontWeight: 700,
                          }}>
                            ⚠️ Action Required
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Not logged in, haven't searched yet */}
        {!user && !searched && !loading && (
          <div style={{
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "16px", padding: "32px", textAlign: "center", marginTop: "8px",
          }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>🎫</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", lineHeight: "1.7" }}>
              Enter your email above to look up your support tickets.<br />
              Or report a new technical issue using the button above.
            </div>
          </div>
        )}

        {/* Profile note if logged in */}
        {user && profile && (
          <div style={{ marginTop: "20px", fontSize: "13px", color: "rgba(255,255,255,0.3)", textAlign: "center" }}>
            Logged in as {profile.displayName} ({user.email}) ·{" "}
            <button
              onClick={() => fetchTickets(user.email!)}
              style={{ background: "none", border: "none", color: "#FF8534", cursor: "pointer", fontSize: "13px", fontFamily: "Nunito, sans-serif" }}
            >
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ text, colors }: { text: string; colors: { color: string; bg: string; border: string } }) {
  return (
    <span style={{
      display: "inline-block", padding: "2px 9px", borderRadius: "20px",
      fontSize: "11px", fontWeight: 700,
      color: colors.color, background: colors.bg, border: `1px solid ${colors.border}`,
    }}>
      {text}
    </span>
  );
}

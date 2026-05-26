"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useSupportModal } from "@/contexts/SupportContext";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { STATUS_LABELS, STATUS_COLORS, PRIORITY_COLORS, formatDate, normalizeTicketStatus, type ApiTicket } from "@/lib/tickets";

export default function StudentSupportPage() {
  const { user, loading: authLoading } = useAuth();
  const { openModal, setUnreadCount } = useSupportModal();
  const router = useRouter();

  const [tickets, setTickets] = useState<ApiTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  const fetchTickets = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setLoadError("");
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/tickets/my-tickets", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json() as { tickets?: ApiTicket[]; error?: string };
      if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
      const data = json.tickets ?? [];
      setTickets(data);

      // Set notification badge: count tickets waiting for student action
      const waiting = data.filter((t) => t.status === "WAITING_FOR_STUDENT").length;
      setUnreadCount(waiting);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setLoadError(msg);
    } finally {
      setLoading(false);
    }
  }, [user, setUnreadCount]);

  // Redirect to login if not authenticated after auth resolves
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(
        `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/login?redirect=/support`
      );
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user) fetchTickets();
  }, [user, fetchTickets]);

  // Real-time listener on student's own tickets
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "support_tickets"),
      where("studentUid", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => {
          const raw = d.data();
          return {
            id: d.id,
            ...raw,
            status: normalizeTicketStatus(raw.status as string) ?? raw.status,
            createdAt: raw.createdAt?.toDate?.()?.toISOString() ?? null,
            updatedAt: raw.updatedAt?.toDate?.()?.toISOString() ?? null,
            resolvedAt: raw.resolvedAt?.toDate?.()?.toISOString() ?? null,
          } as ApiTicket;
        });
        setTickets(data);
        const waiting = data.filter((t) => t.status === "WAITING_FOR_STUDENT").length;
        setUnreadCount(waiting);
        setLoading(false);
      },
      () => { /* Firestore rules may not allow — API fetch already loaded data */ }
    );
    return unsub;
  }, [user, setUnreadCount]);

  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    background: "#060D1A",
    fontFamily: "Nunito, sans-serif",
    paddingTop: "100px",
    paddingBottom: "60px",
  };

  // ── Loading auth ───────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div style={{ ...pageStyle, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CenteredSpinner label="Loading…" />
      </div>
    );
  }

  // ── Not logged in (redirect in progress) ──────────────────────────────────
  if (!user) {
    return (
      <div style={{ ...pageStyle, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: "360px", padding: "0 20px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔒</div>
          <h2 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "22px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
            Login Required
          </h2>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "14px", marginBottom: "24px" }}>
            Please log in to view your support tickets.
          </p>
          <a
            href={process.env.NEXT_PUBLIC_SITE_URL
              ? `${process.env.NEXT_PUBLIC_SITE_URL}/login?redirect=/support`
              : "/login?redirect=/support"}
            style={{
              display: "inline-block", padding: "11px 28px", borderRadius: "50px",
              background: "linear-gradient(135deg,#FF6200,#FF8534)",
              color: "#fff", textDecoration: "none", fontSize: "14px", fontWeight: 700,
            }}
          >
            Login →
          </a>
        </div>
      </div>
    );
  }

  // ── Authenticated ──────────────────────────────────────────────────────────
  const waitingCount = tickets.filter((t) => t.status === "WAITING_FOR_STUDENT").length;

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 20px" }}>

        {/* Page header */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "8px", flexWrap: "wrap" }}>
            <div style={{
              width: "48px", height: "48px", borderRadius: "14px",
              background: "linear-gradient(135deg,#FF6200,#FF8534)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0,
            }}>🛠️</div>
            <div>
              <h1 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "28px", fontWeight: 700, color: "#fff", margin: 0 }}>
                My Support Tickets
              </h1>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: "2px 0 0" }}>
                {user.email}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "16px", flexWrap: "wrap" }}>
            <button
              onClick={openModal}
              style={{
                padding: "10px 22px", borderRadius: "50px",
                background: "linear-gradient(135deg,#FF6200,#FF8534)",
                border: "none", color: "#fff", fontSize: "14px", fontWeight: 700,
                cursor: "pointer", fontFamily: "Nunito, sans-serif",
                boxShadow: "0 4px 16px rgba(255,98,0,0.35)",
              }}
            >
              + Report New Issue
            </button>
            <button
              onClick={fetchTickets}
              disabled={loading}
              style={{
                padding: "10px 20px", borderRadius: "50px",
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.7)", fontSize: "14px", fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer", fontFamily: "Nunito, sans-serif",
                opacity: loading ? 0.6 : 1,
              }}
            >
              ↻ Refresh
            </button>
          </div>
        </div>

        {/* Action-required banner */}
        {waitingCount > 0 && (
          <div style={{
            background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.3)",
            borderRadius: "16px", padding: "16px 20px", marginBottom: "20px",
            display: "flex", alignItems: "center", gap: "12px",
          }}>
            <span style={{ fontSize: "20px" }}>⚠️</span>
            <div>
              <div style={{ color: "#fbbf24", fontWeight: 700, fontSize: "14px" }}>
                {waitingCount} ticket{waitingCount > 1 ? "s" : ""} waiting for your response
              </div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", marginTop: "2px" }}>
                Our team has responded — please review and confirm.
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {loadError && (
          <div style={{
            background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.3)",
            borderRadius: "14px", padding: "14px 18px", marginBottom: "20px",
            color: "#f87171", fontSize: "13px",
          }}>
            <strong>Failed to load tickets:</strong> {loadError}
          </div>
        )}

        {/* Loading tickets */}
        {loading && (
          <div style={{ textAlign: "center", padding: "48px 20px" }}>
            <CenteredSpinner label="Loading your tickets…" />
          </div>
        )}

        {/* Empty state */}
        {!loading && tickets.length === 0 && !loadError && (
          <div style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "20px", padding: "48px 28px", textAlign: "center",
          }}>
            <div style={{ fontSize: "48px", marginBottom: "14px" }}>📭</div>
            <div style={{ color: "#fff", fontSize: "16px", fontWeight: 600, marginBottom: "6px" }}>No tickets yet</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", marginBottom: "24px" }}>
              Have a technical issue? Report it and we&apos;ll get back to you shortly.
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

        {/* Ticket list */}
        {!loading && tickets.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", marginBottom: "4px" }}>
              {tickets.length} ticket{tickets.length !== 1 ? "s" : ""} total
            </div>
            {tickets.map((ticket) => {
              const sc = STATUS_COLORS[ticket.status];
              const pc = PRIORITY_COLORS[ticket.priority];
              const needsAction = ticket.status === "WAITING_FOR_STUDENT";

              return (
                <Link
                  key={ticket.id}
                  href={`/support/${ticket.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      background: needsAction
                        ? "rgba(251,191,36,0.04)"
                        : "rgba(255,255,255,0.03)",
                      border: needsAction
                        ? "1px solid rgba(251,191,36,0.25)"
                        : "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "16px", padding: "18px 20px",
                      transition: "all 0.2s", cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.background = needsAction
                        ? "rgba(251,191,36,0.07)"
                        : "rgba(255,255,255,0.05)";
                      (e.currentTarget as HTMLDivElement).style.borderColor = needsAction
                        ? "rgba(251,191,36,0.4)"
                        : "rgba(255,133,52,0.3)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.background = needsAction
                        ? "rgba(251,191,36,0.04)"
                        : "rgba(255,255,255,0.03)";
                      (e.currentTarget as HTMLDivElement).style.borderColor = needsAction
                        ? "rgba(251,191,36,0.25)"
                        : "rgba(255,255,255,0.08)";
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {/* ID + badges */}
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
                          <span style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, color: "#60a5fa", fontSize: "15px", whiteSpace: "nowrap" }}>
                            {ticket.ticketId}
                          </span>
                          <StatusBadge text={STATUS_LABELS[ticket.status]} colors={sc} />
                          <StatusBadge text={ticket.priority} colors={pc} />
                        </div>

                        {/* Category + course */}
                        <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", marginBottom: "4px", fontWeight: 600 }}>
                          {ticket.category}
                        </div>
                        <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "4px" }}>
                          {ticket.courseName}
                        </div>

                        {/* Description preview */}
                        <div style={{
                          fontSize: "13px", color: "rgba(255,255,255,0.35)",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                          maxWidth: "480px",
                        }}>
                          {ticket.description}
                        </div>
                      </div>

                      {/* Right side: date + action badge */}
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", whiteSpace: "nowrap" }}>
                          {formatDate(ticket.createdAt)}
                        </div>
                        {ticket.updatedAt && ticket.updatedAt !== ticket.createdAt && (
                          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", marginTop: "2px", whiteSpace: "nowrap" }}>
                            Updated {formatDate(ticket.updatedAt)}
                          </div>
                        )}
                        {needsAction && (
                          <div style={{
                            marginTop: "8px", padding: "4px 10px", borderRadius: "20px",
                            background: "rgba(251,191,36,0.15)", color: "#fbbf24",
                            fontSize: "11px", fontWeight: 700, whiteSpace: "nowrap",
                          }}>
                            ⚠️ Action Required
                          </div>
                        )}
                        <div style={{ marginTop: "8px", color: "rgba(255,133,52,0.8)", fontSize: "12px", fontWeight: 600 }}>
                          View →
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
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
      display: "inline-block", padding: "2px 9px", borderRadius: "20px",
      fontSize: "11px", fontWeight: 700, whiteSpace: "nowrap",
      color: colors.color, background: colors.bg, border: `1px solid ${colors.border}`,
    }}>
      {text}
    </span>
  );
}

function CenteredSpinner({ label }: { label: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "28px", marginBottom: "10px" }}>⏳</div>
      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>{label}</div>
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  STATUS_LABELS,
  STATUS_COLORS,
  PRIORITY_COLORS,
  CATEGORIES,
  formatDate,
  type ApiTicket,
  type TicketStatus,
  type TicketPriority,
  type TicketCategory,
} from "@/lib/tickets";

type SortKey = "newest" | "oldest" | "priority";

const PRIORITY_ORDER: Record<TicketPriority, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };
const STATUS_FILTER_OPTIONS: Array<TicketStatus | "ALL"> = [
  "ALL", "OPEN", "IN_PROGRESS", "WAITING_FOR_STUDENT", "REOPENED", "RESOLVED", "CLOSED",
];

// ── Test-ticket detection (mirrors server-side logic in /api/tickets/delete-test) ──
function isTestTicket(t: ApiTicket): boolean {
  const email    = t.studentEmail.toLowerCase();
  const name     = t.studentName.toLowerCase();
  const ticketId = t.ticketId;
  return (
    email.includes("test")       ||
    name.includes("test")        ||
    ticketId.startsWith("TEST-") ||
    ticketId.startsWith("test-")
  );
}

// ── Flash type ────────────────────────────────────────────────────────────────
interface FlashMsg { text: string; type: "ok" | "err" }

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<ApiTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  // Raw count returned directly by the API before any client-side processing
  const [apiCount, setApiCount] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "ALL">("ALL");
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | "ALL">("ALL");
  const [categoryFilter, setCategoryFilter] = useState<TicketCategory | "ALL">("ALL");
  const [sort, setSort] = useState<SortKey>("newest");
  const [flash, setFlash] = useState<FlashMsg | null>(null);
  // Debug view: shows every ticket bypassing all filters
  const [showRawDebug, setShowRawDebug] = useState(false);

  // Delete-test modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);

  const showFlash = useCallback((text: string, type: FlashMsg["type"] = "ok") => {
    setFlash({ text, type });
    setTimeout(() => setFlash(null), 6000);
  }, []);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      console.log("[admin/support] ▶ fetchTickets → GET /api/tickets/list");
      const res = await fetch("/api/tickets/list");
      const json = await res.json() as { tickets?: ApiTicket[]; _count?: number; error?: string };
      console.log(`[admin/support] API response — HTTP ${res.status}`, json);

      if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`);

      const loaded = json.tickets ?? [];
      const rawCount = json._count ?? loaded.length;

      // ── Step 7: log raw count BEFORE any client-side filtering ────────────
      console.log(`[admin/support] Firestore docs loaded (raw _count): ${rawCount}`);
      console.log(`[admin/support] tickets array length after mapping: ${loaded.length}`);

      // ── Steps 1-3: log each ticket's key fields ───────────────────────────
      if (loaded.length > 0) {
        console.log("[admin/support] Raw Firestore docs (mapped):", loaded);
        console.log("[admin/support] Mapped tickets summary:",
          loaded.map((t) => ({
            id:       t.id,
            ticketId: t.ticketId,
            status:   t.status,
            email:    t.studentEmail,
            createdAt: t.createdAt,
          }))
        );
        console.log(
          `[admin/support] ✓ ${loaded.length} ticket(s) loaded:`,
          loaded.map((t) => `${t.ticketId} [${t.status}]`)
        );
      } else {
        console.warn("[admin/support] ⚠️ tickets array is empty — check API route logs for snap.size");
      }

      setApiCount(rawCount);
      setTickets(loaded);
    } catch (err) {
      const msg = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
      console.error("[admin/support] ✗ fetchTickets failed:", msg);
      setLoadError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load on mount
  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Auto-refresh every 30 s so new tickets appear without a manual reload.
  // (We cannot use onSnapshot here: the Firestore security rules only allow
  //  authenticated students to read their own ticket via the client SDK.
  //  The admin is not a Firebase Auth user — reads must go through the
  //  Admin-SDK API route which bypasses security rules entirely.)
  useEffect(() => {
    const id = setInterval(() => {
      console.log("[admin/support] ↻ auto-refresh");
      fetchTickets();
    }, 30_000);
    return () => clearInterval(id);
  }, [fetchTickets]);

  // Stats — counted directly from current ticket data
  const stats = {
    open:              tickets.filter((t) => t.status === "OPEN").length,
    inProgress:        tickets.filter((t) => t.status === "IN_PROGRESS").length,
    waitingForStudent: tickets.filter((t) => t.status === "WAITING_FOR_STUDENT").length,
    resolved:          tickets.filter((t) => t.status === "RESOLVED").length,
    closed:            tickets.filter((t) => t.status === "CLOSED").length,
    reopened:          tickets.filter((t) => t.status === "REOPENED").length,
    total:             tickets.length,
  };

  // Filter + search + sort
  const filtered = tickets
    .filter((t) => {
      if (statusFilter !== "ALL" && t.status !== statusFilter) return false;
      if (priorityFilter !== "ALL" && t.priority !== priorityFilter) return false;
      if (categoryFilter !== "ALL" && t.category !== categoryFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          t.ticketId.toLowerCase().includes(q) ||
          t.studentEmail.toLowerCase().includes(q) ||
          t.whatsappNumber.includes(q) ||
          t.studentName.toLowerCase().includes(q) ||
          t.courseName.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sort === "priority") return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      const aMs = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bMs = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (sort === "oldest") return aMs - bMs;
      return bMs - aMs;
    });

  // All tickets that qualify as test data (derived once from tickets state)
  const testTickets = useMemo(() => tickets.filter(isTestTicket), [tickets]);

  // Open the modal — pre-select ALL detected test tickets
  function openDeleteModal() {
    setSelectedIds(new Set(testTickets.map((t) => t.id)));
    setShowDeleteModal(true);
  }

  function closeDeleteModal() {
    if (deleting) return; // Don't close mid-delete
    setShowDeleteModal(false);
    setSelectedIds(new Set());
  }

  function toggleId(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelectedIds((prev) =>
      prev.size === testTickets.length
        ? new Set()
        : new Set(testTickets.map((t) => t.id))
    );
  }

  async function handleDelete() {
    if (selectedIds.size === 0) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/tickets/delete-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "selected", selectedIds: Array.from(selectedIds) }),
      });
      const json = await res.json() as {
        deleted?: number;
        ticketIds?: string[];
        docIds?: string[];
        msgCount?: number;
        evtCount?: number;
        error?: string;
      };
      if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`);

      const n = json.deleted ?? 0;
      console.log(
        `[admin] Deleted ${n} test ticket(s):`, json.ticketIds,
        `| +${json.msgCount ?? 0} messages +${json.evtCount ?? 0} events`
      );

      closeDeleteModal();
      await fetchTickets(); // Refresh dashboard
      showFlash(
        n === 0
          ? "No test tickets were deleted."
          : `Deleted ${n} test ticket${n !== 1 ? "s" : ""} successfully.`,
        "ok"
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[admin] delete-test failed:", msg);
      showFlash(`Delete failed: ${msg}`, "err");
    } finally {
      setDeleting(false);
    }
  }

  const allSelected = selectedIds.size === testTickets.length && testTickets.length > 0;
  const noneSelected = selectedIds.size === 0;

  return (
    <div style={{ padding: "24px", minHeight: "100vh", fontFamily: "Nunito, sans-serif" }}>

      {/* ── Delete confirmation modal ── */}
      {showDeleteModal && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget && !deleting) closeDeleteModal(); }}
          style={{
            position: "fixed", inset: 0, zIndex: 10000,
            background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "20px",
          }}
        >
          <div style={{
            background: "rgba(8,18,42,0.99)",
            border: "1px solid rgba(248,113,113,0.3)",
            borderRadius: "20px",
            width: "100%", maxWidth: "520px",
            boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
            display: "flex", flexDirection: "column", maxHeight: "85vh",
          }}>

            {/* Modal header */}
            <div style={{
              padding: "22px 24px 18px",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px",
            }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }}>
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "10px",
                    background: "rgba(248,113,113,0.15)", border: "1px solid rgba(248,113,113,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0,
                  }}>🗑</div>
                  <h2 style={{
                    fontFamily: "Rajdhani, sans-serif", fontSize: "20px", fontWeight: 700,
                    color: "#f87171", margin: 0,
                  }}>
                    Delete Test Data?
                  </h2>
                </div>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: "1.5" }}>
                  This will permanently delete the selected tickets plus all associated messages and events.
                  <strong style={{ color: "rgba(255,255,255,0.65)" }}> This cannot be undone.</strong>
                </p>
              </div>
              {!deleting && (
                <button
                  onClick={closeDeleteModal}
                  style={{
                    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px", color: "rgba(255,255,255,0.5)", cursor: "pointer",
                    width: "32px", height: "32px", fontSize: "18px", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >×</button>
              )}
            </div>

            {/* Body: ticket list */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>

              {testTickets.length === 0 ? (
                <div style={{ padding: "32px", textAlign: "center" }}>
                  <div style={{ fontSize: "40px", marginBottom: "12px" }}>🎉</div>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", fontWeight: 600 }}>
                    No test tickets found
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", marginTop: "4px" }}>
                    All existing tickets appear to be real student tickets.
                  </div>
                </div>
              ) : (
                <>
                  {/* Select all row */}
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    marginBottom: "12px",
                  }}>
                    <label style={{
                      display: "flex", alignItems: "center", gap: "8px",
                      cursor: "pointer", userSelect: "none",
                    }}>
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleAll}
                        disabled={deleting}
                        style={{ width: "15px", height: "15px", accentColor: "#f87171", cursor: "pointer" }}
                      />
                      <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.65)", fontWeight: 600 }}>
                        {allSelected ? "Deselect All" : "Select All"}
                      </span>
                    </label>
                    <span style={{
                      fontSize: "12px", fontWeight: 700, padding: "3px 10px",
                      borderRadius: "20px",
                      background: selectedIds.size > 0 ? "rgba(248,113,113,0.12)" : "rgba(255,255,255,0.06)",
                      border: `1px solid ${selectedIds.size > 0 ? "rgba(248,113,113,0.3)" : "rgba(255,255,255,0.1)"}`,
                      color: selectedIds.size > 0 ? "#f87171" : "rgba(255,255,255,0.35)",
                    }}>
                      {selectedIds.size} / {testTickets.length} selected
                    </span>
                  </div>

                  {/* Ticket rows */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {testTickets.map((t) => {
                      const checked = selectedIds.has(t.id);
                      return (
                        <label
                          key={t.id}
                          style={{
                            display: "flex", alignItems: "flex-start", gap: "10px",
                            padding: "10px 12px", borderRadius: "10px", cursor: "pointer",
                            background: checked ? "rgba(248,113,113,0.06)" : "rgba(255,255,255,0.02)",
                            border: `1px solid ${checked ? "rgba(248,113,113,0.2)" : "rgba(255,255,255,0.06)"}`,
                            transition: "all 0.15s",
                            userSelect: "none",
                          }}
                          onMouseEnter={(e) => {
                            if (!checked) (e.currentTarget as HTMLLabelElement).style.background = "rgba(255,255,255,0.04)";
                          }}
                          onMouseLeave={(e) => {
                            if (!checked) (e.currentTarget as HTMLLabelElement).style.background = "rgba(255,255,255,0.02)";
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleId(t.id)}
                            disabled={deleting}
                            onClick={(e) => e.stopPropagation()}
                            style={{ width: "15px", height: "15px", accentColor: "#f87171", cursor: "pointer", marginTop: "1px", flexShrink: 0 }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                              <span style={{
                                fontFamily: "Rajdhani, sans-serif", fontWeight: 700,
                                fontSize: "13px", color: "#60a5fa",
                              }}>{t.ticketId}</span>
                              <StatusBadge text={t.status.replace(/_/g, " ")} colors={STATUS_COLORS[t.status]} />
                            </div>
                            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", marginTop: "3px", fontWeight: 600 }}>
                              {t.studentName}
                            </div>
                            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginTop: "2px" }}>
                              {t.studentEmail} · {formatDate(t.createdAt)}
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  {/* Detection criteria note */}
                  <div style={{
                    marginTop: "14px", padding: "10px 12px", borderRadius: "10px",
                    background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.15)",
                    fontSize: "11px", color: "rgba(251,191,36,0.7)", lineHeight: "1.6",
                  }}>
                    ⚠️ Detected by: email/name contains &quot;test&quot; · ticketId starts with TEST-
                  </div>
                </>
              )}
            </div>

            {/* Footer: action buttons */}
            <div style={{
              padding: "16px 24px",
              borderTop: "1px solid rgba(255,255,255,0.07)",
              display: "flex", gap: "10px", justifyContent: "flex-end", flexWrap: "wrap",
            }}>
              <button
                onClick={closeDeleteModal}
                disabled={deleting}
                style={{
                  padding: "10px 20px", borderRadius: "10px",
                  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                  color: deleting ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.7)",
                  fontSize: "14px", fontWeight: 600, cursor: deleting ? "not-allowed" : "pointer",
                  fontFamily: "Nunito, sans-serif",
                }}
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting || noneSelected || testTickets.length === 0}
                style={{
                  padding: "10px 22px", borderRadius: "10px",
                  background: deleting || noneSelected
                    ? "rgba(248,113,113,0.25)"
                    : "linear-gradient(135deg,#ef4444,#dc2626)",
                  border: "1px solid rgba(248,113,113,0.3)",
                  color: deleting || noneSelected ? "rgba(248,113,113,0.5)" : "#fff",
                  fontSize: "14px", fontWeight: 700,
                  cursor: deleting || noneSelected ? "not-allowed" : "pointer",
                  fontFamily: "Nunito, sans-serif",
                  display: "flex", alignItems: "center", gap: "7px",
                  minWidth: "200px", justifyContent: "center",
                  transition: "all 0.2s",
                }}
              >
                {deleting ? (
                  <>
                    <span style={{
                      display: "inline-block", width: "14px", height: "14px",
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "#fff", borderRadius: "50%",
                      animation: "dtSpin 0.7s linear infinite",
                    }} />
                    Deleting…
                  </>
                ) : (
                  <>
                    🗑 Delete Permanently
                    {selectedIds.size > 0 && (
                      <span style={{
                        background: "rgba(255,255,255,0.2)", borderRadius: "20px",
                        padding: "1px 8px", fontSize: "12px",
                      }}>
                        {selectedIds.size}
                      </span>
                    )}
                  </>
                )}
              </button>
            </div>

            <style>{`
              @keyframes dtSpin { to { transform: rotate(360deg); } }
            `}</style>
          </div>
        </div>
      )}

      {/* ── Flash ── */}
      {flash && (
        <div
          onClick={() => setFlash(null)}
          style={{
            position: "fixed", top: "70px", right: "24px", zIndex: 9999,
            background: flash.type === "ok"
              ? "rgba(52,211,153,0.15)" : "rgba(248,113,113,0.15)",
            border: `1px solid ${flash.type === "ok" ? "rgba(52,211,153,0.3)" : "rgba(248,113,113,0.3)"}`,
            borderRadius: "12px", padding: "12px 20px",
            color: flash.type === "ok" ? "#34d399" : "#f87171",
            fontSize: "14px", maxWidth: "420px", wordBreak: "break-all", cursor: "pointer",
            fontFamily: "Nunito, sans-serif",
          }}
        >
          {flash.text}
          <span style={{ marginLeft: "8px", opacity: 0.5, fontSize: "11px" }}>(click to dismiss)</span>
        </div>
      )}

      {/* ── Page header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "28px", fontWeight: 700, color: "#fff", margin: "0 0 4px" }}>
            Technical Support
          </h1>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "14px", margin: 0 }}>
            Manage student technical support tickets
          </p>
        </div>

        {/* Delete test data button — only shown when test tickets exist */}
        {testTickets.length > 0 && (
          <button
            onClick={openDeleteModal}
            title={`${testTickets.length} test ticket${testTickets.length !== 1 ? "s" : ""} detected`}
            style={{
              display: "flex", alignItems: "center", gap: "7px",
              padding: "9px 18px", borderRadius: "10px",
              background: "rgba(248,113,113,0.08)",
              border: "1px solid rgba(248,113,113,0.25)",
              color: "#f87171", fontSize: "13px", fontWeight: 700,
              cursor: "pointer", fontFamily: "Nunito, sans-serif",
              whiteSpace: "nowrap", flexShrink: 0,
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(248,113,113,0.14)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(248,113,113,0.4)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(248,113,113,0.08)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(248,113,113,0.25)";
            }}
          >
            🗑
            <span>Delete Test Data</span>
            <span style={{
              background: "rgba(248,113,113,0.2)", border: "1px solid rgba(248,113,113,0.3)",
              borderRadius: "20px", padding: "1px 7px", fontSize: "11px",
            }}>{testTickets.length}</span>
          </button>
        )}
      </div>

      {/* ── Error banner ── */}
      {loadError && !loading && (
        <div style={{
          background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.3)",
          borderRadius: "14px", padding: "16px 20px", marginBottom: "20px",
          color: "#f87171", fontSize: "13px", lineHeight: "1.7",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
            <div>
              <strong style={{ fontSize: "14px" }}>⚠️ Error loading tickets</strong>
              <pre style={{
                margin: "6px 0 0", padding: "8px 12px",
                background: "rgba(0,0,0,0.35)", borderRadius: "8px",
                fontSize: "12px", color: "#fca5a5",
                whiteSpace: "pre-wrap", wordBreak: "break-all",
                fontFamily: "monospace", lineHeight: "1.5",
              }}>{loadError}</pre>
            </div>
            <button
              onClick={fetchTickets}
              style={{
                padding: "8px 16px", borderRadius: "8px", flexShrink: 0,
                background: "rgba(248,113,113,0.15)", border: "1px solid rgba(248,113,113,0.35)",
                color: "#f87171", fontSize: "13px", fontWeight: 700, cursor: "pointer",
                fontFamily: "Nunito, sans-serif",
              }}
            >
              ↻ Retry
            </button>
          </div>
        </div>
      )}

      {/* ── Step 7: Diagnostic banner — raw Firestore count before any filtering ── */}
      {!loading && apiCount !== null && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: "10px",
          background: apiCount === 0
            ? "rgba(248,113,113,0.07)"
            : "rgba(96,165,250,0.07)",
          border: `1px solid ${apiCount === 0 ? "rgba(248,113,113,0.22)" : "rgba(96,165,250,0.22)"}`,
          borderRadius: "12px", padding: "12px 18px", marginBottom: "16px",
          fontSize: "13px",
        }}>
          <span style={{ color: apiCount === 0 ? "#f87171" : "#93c5fd", fontWeight: 600 }}>
            {apiCount === 0
              ? "⚠️  Firestore docs loaded: 0 — collection may be empty or Admin SDK credentials are wrong"
              : `✅ Firestore docs loaded: ${apiCount} (before any client-side filtering)`}
          </span>
          {/* Step 5 toggle — raw debug view */}
          <button
            onClick={() => setShowRawDebug((v) => !v)}
            style={{
              padding: "6px 14px", borderRadius: "8px", flexShrink: 0,
              background: showRawDebug ? "rgba(251,191,36,0.15)" : "rgba(255,255,255,0.06)",
              border: `1px solid ${showRawDebug ? "rgba(251,191,36,0.4)" : "rgba(255,255,255,0.12)"}`,
              color: showRawDebug ? "#fbbf24" : "rgba(255,255,255,0.6)",
              fontSize: "12px", fontWeight: 700, cursor: "pointer",
              fontFamily: "Nunito, sans-serif", whiteSpace: "nowrap",
            }}
          >
            {showRawDebug ? "🔍 Hide Raw Debug" : "🔍 Show Raw Debug"}
          </button>
        </div>
      )}

      {/* ── Step 5: Raw debug view — all docs, NO filtering ── */}
      {showRawDebug && !loading && (
        <div style={{
          background: "rgba(251,191,36,0.04)", border: "1px solid rgba(251,191,36,0.2)",
          borderRadius: "14px", padding: "16px 18px", marginBottom: "20px",
        }}>
          <div style={{
            fontFamily: "Rajdhani, sans-serif", fontSize: "15px", fontWeight: 700,
            color: "#fbbf24", marginBottom: "12px",
            display: "flex", alignItems: "center", gap: "8px",
          }}>
            🔍 Raw Debug View — {tickets.length} doc{tickets.length !== 1 ? "s" : ""} (all filters bypassed)
          </div>
          {tickets.length === 0 ? (
            <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "13px" }}>
              No documents returned from /api/tickets/list. Check server logs for <code style={{ color: "#fbbf24" }}>snap.size</code>.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                <thead>
                  <tr>
                    {["#", "id (Firestore)", "ticketId", "status", "priority", "studentEmail", "createdAt"].map((h) => (
                      <th key={h} style={{
                        textAlign: "left", padding: "6px 10px",
                        color: "rgba(251,191,36,0.7)", fontWeight: 700,
                        borderBottom: "1px solid rgba(251,191,36,0.15)",
                        whiteSpace: "nowrap", fontSize: "11px",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t, i) => (
                    <tr key={t.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <td style={{ padding: "6px 10px", color: "rgba(255,255,255,0.3)" }}>{i + 1}</td>
                      <td style={{ padding: "6px 10px", color: "rgba(255,255,255,0.45)", fontFamily: "monospace", fontSize: "11px" }}>{t.id}</td>
                      <td style={{ padding: "6px 10px", color: "#60a5fa", fontWeight: 700, fontFamily: "Rajdhani, sans-serif" }}>{t.ticketId ?? <span style={{ color: "#f87171" }}>MISSING</span>}</td>
                      <td style={{ padding: "6px 10px", color: t.status ? "#34d399" : "#f87171" }}>{t.status ?? "MISSING"}</td>
                      <td style={{ padding: "6px 10px", color: "rgba(255,255,255,0.6)" }}>{t.priority ?? "?"}</td>
                      <td style={{ padding: "6px 10px", color: "rgba(255,255,255,0.5)" }}>{t.studentEmail ?? "?"}</td>
                      <td style={{ padding: "6px 10px", color: "rgba(255,255,255,0.4)", fontFamily: "monospace", fontSize: "11px" }}>{t.createdAt ?? "null"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Stats ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "14px", marginBottom: "24px" }}>
        {[
          { label: "Open",        value: stats.open,              color: "#60a5fa" },
          { label: "In Progress", value: stats.inProgress,        color: "#fb923c" },
          { label: "Waiting",     value: stats.waitingForStudent,  color: "#fbbf24" },
          { label: "Resolved",    value: stats.resolved,           color: "#34d399" },
          { label: "Closed",      value: stats.closed,             color: "rgba(255,255,255,0.4)" },
          { label: "Total",       value: stats.total,              color: "rgba(255,255,255,0.6)" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px", padding: "18px 20px",
          }}>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", marginBottom: "8px" }}>{label}</div>
            <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "30px", fontWeight: 700, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* ── Filters row ── */}
      <div style={{
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "16px", padding: "16px 20px", marginBottom: "20px",
        display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center",
      }}>
        <input
          type="text"
          placeholder="Search ticket ID, email, name, phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: "1 1 220px", background: "rgba(0,0,0,0.3)",
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px",
            padding: "9px 14px", color: "#fff", fontSize: "13px", outline: "none",
            fontFamily: "Nunito, sans-serif",
          }}
        />

        <FilterSelect value={statusFilter} onChange={(v) => setStatusFilter(v as TicketStatus | "ALL")}>
          {STATUS_FILTER_OPTIONS.map((s) => (
            <option key={s} value={s}>{s === "ALL" ? "All Statuses" : STATUS_LABELS[s as TicketStatus]}</option>
          ))}
        </FilterSelect>

        <FilterSelect value={priorityFilter} onChange={(v) => setPriorityFilter(v as TicketPriority | "ALL")}>
          <option value="ALL">All Priorities</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </FilterSelect>

        <FilterSelect value={categoryFilter} onChange={(v) => setCategoryFilter(v as TicketCategory | "ALL")}>
          <option value="ALL">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </FilterSelect>

        <FilterSelect value={sort} onChange={(v) => setSort(v as SortKey)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="priority">By Priority</option>
        </FilterSelect>

        <button
          onClick={fetchTickets}
          style={{
            background: "rgba(255,133,52,0.1)", border: "1px solid rgba(255,133,52,0.3)",
            borderRadius: "10px", color: "#FF8534", padding: "9px 16px",
            fontSize: "13px", cursor: "pointer", whiteSpace: "nowrap", fontFamily: "Nunito, sans-serif",
          }}
        >
          ↻ Refresh
        </button>
      </div>

      {/* ── Table ── */}
      {loading ? (
        <LoadingState />
      ) : filtered.length === 0 ? (
        <EmptyState hasSearch={!!search || statusFilter !== "ALL"} />
      ) : (
        <div style={{ overflowX: "auto", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.07)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "900px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                {["Ticket ID", "Student", "Course", "Category", "Priority", "Status", "Created", ""].map((h) => (
                  <th key={h} style={{
                    padding: "12px 16px", textAlign: "left",
                    fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase",
                    letterSpacing: "0.7px", fontWeight: 600, background: "rgba(255,255,255,0.02)",
                    whiteSpace: "nowrap",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((ticket, i) => {
                const isTest = isTestTicket(ticket);
                return (
                  <tr
                    key={ticket.id}
                    style={{
                      borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                      transition: "background 0.15s",
                      background: isTest ? "rgba(248,113,113,0.02)" : "transparent",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = isTest ? "rgba(248,113,113,0.04)" : "rgba(255,255,255,0.03)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = isTest ? "rgba(248,113,113,0.02)" : "transparent")}
                  >
                    <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                      <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, color: "#60a5fa", fontSize: "14px" }}>
                        {ticket.ticketId}
                        {isTest && (
                          <span style={{
                            marginLeft: "6px", fontSize: "9px", padding: "1px 5px", borderRadius: "4px",
                            background: "rgba(248,113,113,0.15)", color: "#f87171",
                            border: "1px solid rgba(248,113,113,0.25)", verticalAlign: "middle",
                            fontFamily: "Nunito, sans-serif", fontWeight: 700, letterSpacing: "0.3px",
                          }}>TEST</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontSize: "14px", color: "#fff", fontWeight: 600 }}>{ticket.studentName}</div>
                      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>{ticket.studentEmail}</div>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "13px", color: "rgba(255,255,255,0.7)", whiteSpace: "nowrap" }}>
                      {ticket.courseName}
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "13px", color: "rgba(255,255,255,0.7)", whiteSpace: "nowrap" }}>
                      {ticket.category}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <StatusBadge text={ticket.priority} colors={PRIORITY_COLORS[ticket.priority]} />
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <StatusBadge text={STATUS_LABELS[ticket.status]} colors={STATUS_COLORS[ticket.status]} />
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "12px", color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap" }}>
                      {formatDate(ticket.createdAt)}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <Link
                        href={`/admin/support/${ticket.id}`}
                        style={{
                          padding: "7px 14px", borderRadius: "8px",
                          background: "rgba(255,133,52,0.1)", border: "1px solid rgba(255,133,52,0.25)",
                          color: "#FF8534", fontSize: "12px", fontWeight: 700, textDecoration: "none",
                          whiteSpace: "nowrap", display: "inline-block",
                        }}
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: "12px", fontSize: "13px", color: "rgba(255,255,255,0.3)" }}>
        Showing {filtered.length} of {tickets.length} tickets
        {testTickets.length > 0 && (
          <span style={{ marginLeft: "10px", color: "rgba(248,113,113,0.6)" }}>
            · {testTickets.length} test ticket{testTickets.length !== 1 ? "s" : ""} detected
          </span>
        )}
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

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

function FilterSelect({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "10px", padding: "9px 14px", color: "#fff", fontSize: "13px",
        outline: "none", cursor: "pointer", fontFamily: "Nunito, sans-serif",
        appearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='rgba(255,255,255,0.35)' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center",
        paddingRight: "30px",
      }}
    >
      {children}
    </select>
  );
}

function LoadingState() {
  return (
    <div style={{ padding: "60px 20px", textAlign: "center" }}>
      <div style={{ fontSize: "32px", marginBottom: "12px" }}>⏳</div>
      <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "14px" }}>Loading tickets…</div>
    </div>
  );
}

function EmptyState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <div style={{ padding: "60px 20px", textAlign: "center" }}>
      <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎉</div>
      <div style={{ color: "#fff", fontSize: "16px", fontWeight: 600, marginBottom: "6px" }}>
        {hasSearch ? "No tickets match your search" : "No tickets yet"}
      </div>
      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>
        {hasSearch ? "Try adjusting your filters" : "When students submit issues they will appear here"}
      </div>
    </div>
  );
}

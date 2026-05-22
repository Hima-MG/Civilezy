"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  getAllTickets,
  STATUS_LABELS,
  STATUS_COLORS,
  PRIORITY_COLORS,
  CATEGORIES,
  formatDate,
  type SupportTicket,
  type TicketStatus,
  type TicketPriority,
  type TicketCategory,
} from "@/lib/tickets";

// ─── Types ────────────────────────────────────────────────────────────────────

type SortKey = "newest" | "oldest" | "priority";

const PRIORITY_ORDER: Record<TicketPriority, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };
const STATUS_FILTER_OPTIONS: Array<TicketStatus | "ALL"> = [
  "ALL", "OPEN", "IN_PROGRESS", "WAITING_FOR_STUDENT", "REOPENED", "RESOLVED", "CLOSED",
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "ALL">("ALL");
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | "ALL">("ALL");
  const [categoryFilter, setCategoryFilter] = useState<TicketCategory | "ALL">("ALL");
  const [sort, setSort] = useState<SortKey>("newest");
  const [flash, setFlash] = useState("");

  const showFlash = (msg: string) => {
    setFlash(msg);
    setTimeout(() => setFlash(""), 3000);
  };

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      setTickets(await getAllTickets());
    } catch {
      showFlash("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  // ── Stats ──
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const stats = {
    open: tickets.filter((t) => t.status === "OPEN").length,
    inProgress: tickets.filter((t) => t.status === "IN_PROGRESS").length,
    resolvedToday: tickets.filter((t) => {
      const d = t.resolvedAt?.toDate();
      return d && d >= today && (t.status === "RESOLVED" || t.status === "CLOSED");
    }).length,
    total: tickets.length,
    reopened: tickets.filter((t) => t.status === "REOPENED").length,
  };

  // ── Filter + search + sort ──
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
      if (sort === "oldest") return (a.createdAt?.toMillis() ?? 0) - (b.createdAt?.toMillis() ?? 0);
      return (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0);
    });

  return (
    <div style={{ padding: "24px", minHeight: "100vh", fontFamily: "Nunito, sans-serif" }}>
      {/* Flash */}
      {flash && (
        <div style={{
          position: "fixed", top: "70px", right: "24px", zIndex: 9999,
          background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)",
          borderRadius: "12px", padding: "12px 20px", color: "#34d399", fontSize: "14px",
        }}>{flash}</div>
      )}

      {/* Page header */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "28px", fontWeight: 700, color: "#fff", margin: "0 0 4px" }}>
          Technical Support
        </h1>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "14px", margin: 0 }}>
          Manage student technical support tickets
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "14px", marginBottom: "24px" }}>
        {[
          { label: "Open", value: stats.open, color: "#60a5fa" },
          { label: "In Progress", value: stats.inProgress, color: "#fb923c" },
          { label: "Reopened", value: stats.reopened, color: "#f87171" },
          { label: "Resolved Today", value: stats.resolvedToday, color: "#34d399" },
          { label: "Total Tickets", value: stats.total, color: "rgba(255,255,255,0.6)" },
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

      {/* Filters row */}
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

        {/* Status filter */}
        <FilterSelect value={statusFilter} onChange={(v) => setStatusFilter(v as TicketStatus | "ALL")}>
          {STATUS_FILTER_OPTIONS.map((s) => (
            <option key={s} value={s}>{s === "ALL" ? "All Statuses" : STATUS_LABELS[s as TicketStatus]}</option>
          ))}
        </FilterSelect>

        {/* Priority filter */}
        <FilterSelect value={priorityFilter} onChange={(v) => setPriorityFilter(v as TicketPriority | "ALL")}>
          <option value="ALL">All Priorities</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </FilterSelect>

        {/* Category filter */}
        <FilterSelect value={categoryFilter} onChange={(v) => setCategoryFilter(v as TicketCategory | "ALL")}>
          <option value="ALL">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </FilterSelect>

        {/* Sort */}
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

      {/* Table */}
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
              {filtered.map((ticket, i) => (
                <tr
                  key={ticket.id}
                  style={{
                    borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                    <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, color: "#60a5fa", fontSize: "14px" }}>
                      {ticket.ticketId}
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
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: "12px", fontSize: "13px", color: "rgba(255,255,255,0.3)" }}>
        Showing {filtered.length} of {tickets.length} tickets
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

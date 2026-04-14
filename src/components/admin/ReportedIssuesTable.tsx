"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { getReportedIssues, type ReportDoc, type ReportStatus } from "@/lib/admin/getReportedIssues";
import { updateReportStatus } from "@/lib/admin/updateReportStatus";
import { deleteReport } from "@/lib/admin/deleteReport";
import type { IssueType } from "@/lib/reportGameArenaIssue";
import ReportStatusBadge from "./ReportStatusBadge";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const ISSUE_LABELS: Record<IssueType, string> = {
  wrong_answer: "Wrong Answer",
  typo: "Typo",
  question_error: "Question Error",
  ui_bug: "UI Bug",
  other: "Other",
};

const STATUS_OPTIONS: { value: ReportStatus | "all"; label: string }[] = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "reviewed", label: "Reviewed" },
  { value: "resolved", label: "Resolved" },
];

const ISSUE_OPTIONS: { value: IssueType | "all"; label: string }[] = [
  { value: "all", label: "All Types" },
  { value: "wrong_answer", label: "Wrong Answer" },
  { value: "typo", label: "Typo" },
  { value: "question_error", label: "Question Error" },
  { value: "ui_bug", label: "UI Bug" },
  { value: "other", label: "Other" },
];

// ---------------------------------------------------------------------------
// Styles (matches admin panel design)
// ---------------------------------------------------------------------------
const S = {
  select: {
    background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px",
    padding: "10px 14px", color: "#fff", fontSize: "13px", outline: "none", cursor: "pointer", minWidth: "120px",
  } as React.CSSProperties,
  row: {
    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "12px", padding: "16px",
  } as React.CSSProperties,
  miniBtn: {
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px", padding: "6px 12px", cursor: "pointer", fontSize: "11px",
    fontWeight: 600, transition: "background 0.15s", whiteSpace: "nowrap",
  } as React.CSSProperties,
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function ReportedIssuesTable() {
  const [reports, setReports] = useState<ReportDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Filters
  const [fStatus, setFStatus] = useState<ReportStatus | "all">("all");
  const [fIssue, setFIssue] = useState<IssueType | "all">("all");

  const flash = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getReportedIssues();
      setReports(data);
    } catch {
      flash("Failed to load reports");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Filtered list
  const filtered = useMemo(() => {
    return reports.filter((r) => {
      if (fStatus !== "all" && r.status !== fStatus) return false;
      if (fIssue !== "all" && r.issueType !== fIssue) return false;
      return true;
    });
  }, [reports, fStatus, fIssue]);

  // Status counts for filter badges
  const counts = useMemo(() => {
    const c = { pending: 0, reviewed: 0, resolved: 0 };
    reports.forEach((r) => { if (r.status in c) c[r.status as ReportStatus]++; });
    return c;
  }, [reports]);

  // Actions
  const handleStatusChange = async (id: string, status: ReportStatus) => {
    try {
      await updateReportStatus(id, status);
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r)),
      );
      flash(`Report marked as ${status}`);
    } catch {
      flash("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this report permanently?")) return;
    try {
      await deleteReport(id);
      setReports((prev) => prev.filter((r) => r.id !== id));
      flash("Report deleted");
    } catch {
      flash("Failed to delete");
    }
  };

  const formatDate = (ts: ReportDoc["createdAt"]) => {
    if (!ts) return "—";
    const d = ts.toDate();
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {/* Flash message */}
      {message && (
        <div
          style={{
            position: "fixed", top: "70px", right: "20px", background: "rgba(255,98,0,0.9)",
            color: "#fff", padding: "10px 20px", borderRadius: "10px", fontSize: "14px",
            fontWeight: 600, zIndex: 100, boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          }}
        >
          {message}
        </div>
      )}

      {/* Header with counts */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <CountPill label="Total" count={reports.length} color="rgba(255,255,255,0.6)" />
          <CountPill label="Pending" count={counts.pending} color="#f59e0b" />
          <CountPill label="Reviewed" count={counts.reviewed} color="#3b82f6" />
          <CountPill label="Resolved" count={counts.resolved} color="#22c55e" />
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
        <select
          value={fStatus}
          onChange={(e) => setFStatus(e.target.value as ReportStatus | "all")}
          style={S.select}
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <select
          value={fIssue}
          onChange={(e) => setFIssue(e.target.value as IssueType | "all")}
          style={S.select}
        >
          {ISSUE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", display: "flex", alignItems: "center", marginLeft: "auto" }}>
          {filtered.length} report{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                ...S.row,
                height: "100px",
                animation: "pulse 1.5s ease-in-out infinite",
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>
            {reports.length === 0 ? "📭" : "🔍"}
          </div>
          <p style={{ fontSize: "16px", fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: "4px" }}>
            {reports.length === 0 ? "No reports yet" : "No reports match your filters"}
          </p>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)" }}>
            {reports.length === 0
              ? "Reports submitted by students from the Game Arena will appear here."
              : "Try changing the status or issue type filter."}
          </p>
        </div>
      )}

      {/* Report cards */}
      {!loading && filtered.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filtered.map((r) => (
            <div key={r.id} style={S.row}>
              {/* Top row: badges */}
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center", marginBottom: "8px" }}>
                <ReportStatusBadge status={r.status} />
                <IssueBadge type={r.issueType} />
                {r.selectedDomain && (
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#FF8534", background: "rgba(255,98,0,0.12)", padding: "2px 8px", borderRadius: "6px", border: "1px solid rgba(255,98,0,0.25)" }}>
                    {r.selectedDomain}
                  </span>
                )}
                {r.selectedDifficulty && (
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
                    {r.selectedDifficulty}
                  </span>
                )}
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", marginLeft: "auto" }}>
                  {formatDate(r.createdAt)}
                </span>
              </div>

              {/* Question text */}
              <div style={{ fontSize: "14px", color: "#fff", lineHeight: 1.5, marginBottom: "6px", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>
                {r.questionText}
              </div>

              {/* Description (if any) */}
              {r.description && (
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.5, marginBottom: "8px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "8px 12px" }}>
                  &ldquo;{r.description}&rdquo;
                </div>
              )}

              {/* Bottom row: reporter + actions */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>
                  Reported by: <strong style={{ color: "rgba(255,255,255,0.55)" }}>{r.userName || "Anonymous"}</strong>
                </span>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>
                  ID: {r.questionId?.slice(0, 8)}...
                </span>

                {/* Action buttons */}
                <div style={{ display: "flex", gap: "6px", marginLeft: "auto" }}>
                  {r.status === "pending" && (
                    <ActionBtn
                      label="📋 Mark Reviewed"
                      color="#3b82f6"
                      onClick={() => handleStatusChange(r.id, "reviewed")}
                    />
                  )}
                  {r.status !== "resolved" && (
                    <ActionBtn
                      label="✅ Resolve"
                      color="#22c55e"
                      onClick={() => handleStatusChange(r.id, "resolved")}
                    />
                  )}
                  <ActionBtn
                    label="🗑️"
                    color="#ef4444"
                    onClick={() => handleDelete(r.id)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------
function CountPill({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "6px 12px" }}>
      <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)" }}>{label}</span>
      <span style={{ fontSize: "14px", fontWeight: 700, color, fontFamily: "Rajdhani, sans-serif" }}>{count}</span>
    </div>
  );
}

function IssueBadge({ type }: { type: IssueType }) {
  return (
    <span style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.06)", padding: "2px 8px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.1)" }}>
      {ISSUE_LABELS[type] ?? type}
    </span>
  );
}

function ActionBtn({ label, color, onClick }: { label: string; color: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...S.miniBtn,
        color,
        borderColor: `${color}30`,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = `${color}15`; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
    >
      {label}
    </button>
  );
}

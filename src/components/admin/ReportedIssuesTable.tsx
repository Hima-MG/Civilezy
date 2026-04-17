"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { getReportedIssues, type ReportDoc, type ReportStatus } from "@/lib/admin/getReportedIssues";
import { updateReportStatus } from "@/lib/admin/updateReportStatus";
import { deleteReport } from "@/lib/admin/deleteReport";
import { getQuestionById, updateQuestion, type QuestionDoc } from "@/lib/questions";
import type { IssueType } from "@/lib/reportGameArenaIssue";
import ReportStatusBadge from "./ReportStatusBadge";

// ─── Constants ────────────────────────────────────────────────────────────────

const ISSUE_LABELS: Record<IssueType, string> = {
  wrong_answer:   "Wrong Answer",
  typo:           "Typo",
  question_error: "Question Error",
  ui_bug:         "UI Bug",
  other:          "Other",
};

const OPTION_LABELS = ["A", "B", "C", "D"] as const;

const STATUS_OPTIONS: { value: ReportStatus | "all"; label: string }[] = [
  { value: "all",      label: "All Status" },
  { value: "pending",  label: "Pending"    },
  { value: "reviewed", label: "Reviewed"   },
  { value: "resolved", label: "Resolved"   },
];

const ISSUE_OPTIONS: { value: IssueType | "all"; label: string }[] = [
  { value: "all",            label: "All Types"      },
  { value: "wrong_answer",   label: "Wrong Answer"   },
  { value: "typo",           label: "Typo"           },
  { value: "question_error", label: "Question Error" },
  { value: "ui_bug",         label: "UI Bug"         },
  { value: "other",          label: "Other"          },
];

// ─── Shared styles ────────────────────────────────────────────────────────────

const S = {
  select: {
    background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "10px", padding: "10px 14px", color: "#fff", fontSize: "13px",
    outline: "none", cursor: "pointer", minWidth: "120px",
  } as React.CSSProperties,

  card: {
    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "14px", padding: "16px",
  } as React.CSSProperties,

  input: {
    width: "100%", boxSizing: "border-box" as const,
    background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "10px", padding: "10px 14px", color: "#fff",
    fontSize: "14px", outline: "none", fontFamily: "Nunito, sans-serif",
    resize: "vertical" as const,
  } as React.CSSProperties,

  miniBtn: (color: string): React.CSSProperties => ({
    background: "rgba(255,255,255,0.05)", border: `1px solid ${color}30`,
    borderRadius: "8px", padding: "6px 12px", cursor: "pointer",
    fontSize: "11px", fontWeight: 600, color,
    transition: "background 0.15s", whiteSpace: "nowrap",
  }),

  primaryBtn: (color: string, disabled = false): React.CSSProperties => ({
    background: disabled ? "rgba(255,255,255,0.07)" : `linear-gradient(135deg,${color},${color}cc)`,
    color: disabled ? "rgba(255,255,255,0.3)" : "#fff",
    border: "none", borderRadius: "10px", padding: "10px 20px",
    fontFamily: "Nunito, sans-serif", fontSize: "14px", fontWeight: 700,
    cursor: disabled ? "not-allowed" : "pointer",
    boxShadow: disabled ? "none" : `0 4px 16px ${color}44`,
    opacity: disabled ? 0.5 : 1, transition: "all 0.2s",
  }),

  ghostBtn: {
    background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.65)",
    border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px",
    padding: "10px 20px", fontFamily: "Nunito, sans-serif",
    fontSize: "14px", fontWeight: 600, cursor: "pointer",
  } as React.CSSProperties,
};

// ─── Main component ───────────────────────────────────────────────────────────

export default function ReportedIssuesTable() {
  const [reports,      setReports]      = useState<ReportDoc[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [message,      setMessage]      = useState("");
  const [editingReport,setEditingReport]= useState<ReportDoc | null>(null);

  const [fStatus, setFStatus] = useState<ReportStatus | "all">("all");
  const [fIssue,  setFIssue]  = useState<IssueType    | "all">("all");

  // ── Flash ──
  const flash = useCallback((msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3500);
  }, []);

  // ── Fetch reports ──
  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      setReports(await getReportedIssues());
    } catch {
      flash("Failed to load reports");
    } finally {
      setLoading(false);
    }
  }, [flash]);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  const filtered = useMemo(() => reports.filter((r) => {
    if (fStatus !== "all" && r.status !== fStatus) return false;
    if (fIssue  !== "all" && r.issueType !== fIssue) return false;
    return true;
  }), [reports, fStatus, fIssue]);

  const counts = useMemo(() => {
    const c = { pending: 0, reviewed: 0, resolved: 0 };
    reports.forEach((r) => { if (r.status in c) c[r.status as ReportStatus]++; });
    return c;
  }, [reports]);

  // ── Status change ──
  const handleStatusChange = async (id: string, status: ReportStatus) => {
    try {
      await updateReportStatus(id, status);
      setReports((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
      flash(`✅ Report marked as ${status}`);
    } catch (err) {
      const code = (err as { code?: string })?.code ?? "";
      flash(code === "permission-denied"
        ? "❌ Permission denied — update Firestore rules"
        : `❌ Failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  };

  // ── Delete ──
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this report permanently?")) return;
    try {
      await deleteReport(id);
      setReports((prev) => prev.filter((r) => r.id !== id));
      flash("🗑️ Report deleted");
    } catch (err) {
      const code = (err as { code?: string })?.code ?? "";
      flash(code === "permission-denied"
        ? "❌ Permission denied — update Firestore rules"
        : `❌ Failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  };

  // ── After edit/resolve from modal ──
  const handleModalSaved = (reportId: string, resolveAlso: boolean) => {
    if (resolveAlso) {
      setReports((prev) =>
        prev.map((r) => r.id === reportId ? { ...r, status: "resolved" } : r)
      );
      flash("✅ Question updated and report resolved");
    } else {
      flash("💾 Question updated successfully");
    }
    setEditingReport(null);
  };

  const formatDate = (ts: ReportDoc["createdAt"]) => {
    if (!ts) return "—";
    return ts.toDate().toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Flash */}
      {message && (
        <div style={{
          position: "fixed", top: "70px", right: "20px", zIndex: 9999,
          background: "rgba(11,30,61,0.95)", border: "1px solid rgba(255,98,0,0.4)",
          color: "#fff", padding: "12px 20px", borderRadius: "12px",
          fontSize: "14px", fontWeight: 600, backdropFilter: "blur(12px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}>
          {message}
        </div>
      )}

      {/* Edit modal */}
      {editingReport && (
        <EditQuestionModal
          report={editingReport}
          onClose={() => setEditingReport(null)}
          onSaved={handleModalSaved}
        />
      )}

      {/* Count pills */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
        <CountPill label="Total"    count={reports.length}   color="rgba(255,255,255,0.6)" />
        <CountPill label="Pending"  count={counts.pending}   color="#f59e0b" />
        <CountPill label="Reviewed" count={counts.reviewed}  color="#3b82f6" />
        <CountPill label="Resolved" count={counts.resolved}  color="#22c55e" />
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
        <select value={fStatus} onChange={(e) => setFStatus(e.target.value as ReportStatus | "all")} style={S.select}>
          {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select value={fIssue} onChange={(e) => setFIssue(e.target.value as IssueType | "all")} style={S.select}>
          {ISSUE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", display: "flex", alignItems: "center", marginLeft: "auto" }}>
          {filtered.length} report{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Skeleton */}
      {loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ ...S.card, height: "110px", animation: "pulse 1.5s ease-in-out infinite", animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>{reports.length === 0 ? "📭" : "🔍"}</div>
          <p style={{ fontSize: "15px", fontWeight: 600, color: "rgba(255,255,255,0.45)", marginBottom: "4px" }}>
            {reports.length === 0 ? "No reports yet" : "No reports match filters"}
          </p>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.25)" }}>
            {reports.length === 0
              ? "Reports from Game Arena will appear here."
              : "Try a different filter."}
          </p>
        </div>
      )}

      {/* Report cards */}
      {!loading && filtered.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filtered.map((r) => (
            <div
              key={r.id}
              style={{
                ...S.card,
                borderLeft: `3px solid ${
                  r.status === "resolved" ? "#22c55e"
                  : r.status === "reviewed" ? "#3b82f6"
                  : "#f59e0b"
                }`,
              }}
            >
              {/* Badges row */}
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center", marginBottom: "10px" }}>
                <ReportStatusBadge status={r.status} />
                <IssueBadge type={r.issueType} />
                {r.selectedDomain && (
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#FF8534", background: "rgba(255,98,0,0.12)", padding: "2px 8px", borderRadius: "6px", border: "1px solid rgba(255,98,0,0.25)" }}>
                    {r.selectedDomain}
                  </span>
                )}
                {r.selectedDifficulty && (
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>{r.selectedDifficulty}</span>
                )}
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", marginLeft: "auto" }}>{formatDate(r.createdAt)}</span>
              </div>

              {/* Question text */}
              <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.9)", lineHeight: 1.55, marginBottom: "8px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
                {r.questionText}
              </div>

              {/* Reporter's description */}
              {r.description && (
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.5, marginBottom: "10px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "8px 12px", fontStyle: "italic" }}>
                  &ldquo;{r.description}&rdquo;
                </div>
              )}

              {/* Reporter + ID + actions */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>
                  By <strong style={{ color: "rgba(255,255,255,0.55)" }}>{r.userName || "Anonymous"}</strong>
                </span>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.18)", fontFamily: "monospace" }}>
                  {r.questionId?.slice(0, 10)}…
                </span>

                {/* Actions */}
                <div style={{ display: "flex", gap: "6px", marginLeft: "auto", flexWrap: "wrap" }}>
                  {/* Edit Question — always available unless no questionId */}
                  {r.questionId && (
                    <button
                      onClick={() => setEditingReport(r)}
                      style={S.miniBtn("#FF8534")}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,133,52,0.12)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                    >
                      ✏️ Edit Question
                    </button>
                  )}

                  {r.status === "pending" && (
                    <button
                      onClick={() => handleStatusChange(r.id, "reviewed")}
                      style={S.miniBtn("#3b82f6")}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(59,130,246,0.12)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                    >
                      📋 Reviewed
                    </button>
                  )}

                  {r.status !== "resolved" && (
                    <button
                      onClick={() => handleStatusChange(r.id, "resolved")}
                      style={S.miniBtn("#22c55e")}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(34,197,94,0.12)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                    >
                      ✅ Resolve
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(r.id)}
                    style={S.miniBtn("#ef4444")}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.12)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ─── Edit Question Modal ──────────────────────────────────────────────────────

interface EditModalProps {
  report:   ReportDoc;
  onClose:  () => void;
  onSaved:  (reportId: string, resolveAlso: boolean) => void;
}

function EditQuestionModal({ report, onClose, onSaved }: EditModalProps) {
  const [question, setQuestion]   = useState<QuestionDoc | null>(null);
  const [fetching, setFetching]   = useState(true);
  const [fetchErr, setFetchErr]   = useState("");

  // Editable fields
  const [qText,       setQText]       = useState("");
  const [options,     setOptions]     = useState<[string,string,string,string]>(["","","",""]);
  const [correct,     setCorrect]     = useState<0|1|2|3>(0);
  const [explanation, setExplanation] = useState("");

  const [saving, setSaving] = useState(false);
  const [saveErr, setSaveErr] = useState("");

  // ── Fetch question on mount ──
  useEffect(() => {
    if (!report.questionId) {
      setFetchErr("This report has no questionId — cannot locate the original question.");
      setFetching(false);
      return;
    }
    getQuestionById(report.questionId)
      .then((doc) => {
        setQuestion(doc);
        setQText(doc.question);
        setOptions([...doc.options] as [string,string,string,string]);
        setCorrect(doc.correct);
        setExplanation(doc.explanation ?? "");
      })
      .catch((err: Error) => {
        console.error("[EditQuestionModal] fetch failed:", err);
        setFetchErr(err.message);
      })
      .finally(() => setFetching(false));
  }, [report.questionId]);

  // ── Close on Escape ──
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  const handleSave = async (resolveAlso: boolean) => {
    if (!question) return;
    if (!qText.trim()) { setSaveErr("Question text cannot be empty."); return; }
    if (options.some((o) => !o.trim())) { setSaveErr("All four options must be filled in."); return; }

    setSaving(true);
    setSaveErr("");
    try {
      await updateQuestion(question.id, {
        question:    qText.trim(),
        options:     options.map((o) => o.trim()) as [string,string,string,string],
        correct,
        explanation: explanation.trim(),
      });

      if (resolveAlso) {
        await updateReportStatus(report.id, "resolved");
      }

      onSaved(report.id, resolveAlso);
    } catch (err) {
      console.error("[EditQuestionModal] save failed:", err);
      const code = (err as { code?: string })?.code ?? "";
      setSaveErr(code === "permission-denied"
        ? "Permission denied — check Firestore rules for 'questions' collection."
        : (err instanceof Error ? err.message : "Save failed. Try again."));
    } finally {
      setSaving(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 1200,
          background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)",
        }}
      />

      {/* Modal panel */}
      <div
        style={{
          position: "fixed", top: "50%", left: "50%", zIndex: 1201,
          transform: "translate(-50%, -50%)",
          width: "min(680px, calc(100vw - 32px))",
          maxHeight: "calc(100vh - 48px)",
          overflowY: "auto",
          background: "#0B1E3D",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "20px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
          fontFamily: "Nunito, sans-serif",
          animation: "modalIn 0.25s cubic-bezier(0.22,1,0.36,1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 24px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          position: "sticky", top: 0,
          background: "#0B1E3D", zIndex: 1,
        }}>
          <div>
            <h2 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "20px", fontWeight: 700, color: "#fff", margin: 0 }}>
              ✏️ Edit Reported Question
            </h2>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: "2px 0 0" }}>
              Fix the question, then save or save &amp; resolve in one click
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer",
              color: "rgba(255,255,255,0.6)", fontSize: "16px", display: "flex",
              alignItems: "center", justifyContent: "center",
            }}
          >
            ×
          </button>
        </div>

        <div style={{ padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* ── Report context ── */}
          <div style={{
            background: "rgba(255,133,52,0.07)", border: "1px solid rgba(255,133,52,0.2)",
            borderRadius: "12px", padding: "14px 16px",
          }}>
            <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.1em", color: "#FF8534", marginBottom: "8px", fontFamily: "Rajdhani, sans-serif" }}>
              📋 REPORT CONTEXT
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: report.description ? "8px" : 0 }}>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#FF8534", background: "rgba(255,133,52,0.15)", padding: "2px 10px", borderRadius: "20px" }}>
                {ISSUE_LABELS[report.issueType] ?? report.issueType}
              </span>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)" }}>
                Reported by <strong style={{ color: "rgba(255,255,255,0.7)" }}>{report.userName || "Anonymous"}</strong>
              </span>
              {report.selectedDomain && (
                <span style={{ fontSize: "12px", color: "rgba(255,133,52,0.7)" }}>{report.selectedDomain}</span>
              )}
            </div>
            {report.description && (
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.5, fontStyle: "italic" }}>
                &ldquo;{report.description}&rdquo;
              </div>
            )}
          </div>

          {/* ── Fetch loading ── */}
          {fetching && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[80, 50, 50, 50, 50, 70].map((w, i) => (
                <div key={i} style={{ height: "14px", width: `${w}%`, background: "rgba(255,255,255,0.06)", borderRadius: "6px", animation: "pulse 1.4s ease-in-out infinite", animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          )}

          {/* ── Fetch error ── */}
          {!fetching && fetchErr && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "16px", color: "#fca5a5", fontSize: "14px" }}>
              <strong>⚠️ Could not load question:</strong><br />
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>{fetchErr}</span>
              <br /><br />
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>Question ID: <code style={{ fontFamily: "monospace" }}>{report.questionId}</code></span>
            </div>
          )}

          {/* ── Edit form ── */}
          {!fetching && !fetchErr && question && (
            <>
              {/* Question text */}
              <div>
                <Label>Question Text *</Label>
                <textarea
                  value={qText}
                  onChange={(e) => setQText(e.target.value)}
                  rows={3}
                  style={{ ...S.input, lineHeight: 1.6 }}
                  placeholder="Enter the question…"
                />
              </div>

              {/* Options */}
              <div>
                <Label>Options — click the radio to set correct answer</Label>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {options.map((opt, i) => {
                    const isCorrect = correct === i;
                    return (
                      <div
                        key={i}
                        style={{
                          display: "flex", alignItems: "center", gap: "10px",
                          background: isCorrect ? "rgba(34,197,94,0.08)" : "rgba(0,0,0,0.2)",
                          border: `1px solid ${isCorrect ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.08)"}`,
                          borderRadius: "10px", padding: "8px 12px",
                          transition: "all 0.15s",
                        }}
                      >
                        {/* Radio */}
                        <button
                          onClick={() => setCorrect(i as 0|1|2|3)}
                          title={isCorrect ? "Correct answer" : "Mark as correct"}
                          style={{
                            width: "20px", height: "20px", borderRadius: "50%", flexShrink: 0,
                            border: `2px solid ${isCorrect ? "#22c55e" : "rgba(255,255,255,0.2)"}`,
                            background: isCorrect ? "#22c55e" : "transparent",
                            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                            transition: "all 0.15s",
                          }}
                        >
                          {isCorrect && (
                            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#fff", display: "block" }} />
                          )}
                        </button>

                        {/* Label */}
                        <span style={{
                          fontSize: "12px", fontWeight: 800, width: "18px", textAlign: "center", flexShrink: 0,
                          color: isCorrect ? "#22c55e" : "rgba(255,255,255,0.4)",
                          fontFamily: "Rajdhani, sans-serif",
                        }}>
                          {OPTION_LABELS[i]}
                        </span>

                        {/* Input */}
                        <input
                          value={opt}
                          onChange={(e) => {
                            const next = [...options] as [string,string,string,string];
                            next[i] = e.target.value;
                            setOptions(next);
                          }}
                          style={{ ...S.input, resize: undefined, padding: "6px 10px", fontSize: "13px" }}
                          placeholder={`Option ${OPTION_LABELS[i]}`}
                        />

                        {isCorrect && (
                          <span style={{ fontSize: "11px", color: "#22c55e", fontWeight: 700, flexShrink: 0, fontFamily: "Rajdhani, sans-serif" }}>✓ CORRECT</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Explanation */}
              <div>
                <Label>Explanation (optional)</Label>
                <textarea
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  rows={2}
                  style={{ ...S.input, lineHeight: 1.6 }}
                  placeholder="Why is this the correct answer?"
                />
              </div>

              {/* Save error */}
              {saveErr && (
                <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", padding: "10px 14px", color: "#fca5a5", fontSize: "13px" }}>
                  ⚠️ {saveErr}
                </div>
              )}

              {/* Actions */}
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", paddingTop: "4px" }}>
                <button onClick={onClose} style={S.ghostBtn} disabled={saving}>
                  Cancel
                </button>
                <button
                  onClick={() => handleSave(false)}
                  disabled={saving}
                  style={S.primaryBtn("#3b82f6", saving)}
                >
                  {saving ? "Saving…" : "💾 Save Question"}
                </button>
                <button
                  onClick={() => handleSave(true)}
                  disabled={saving || report.status === "resolved"}
                  style={{
                    ...S.primaryBtn("#22c55e", saving || report.status === "resolved"),
                    flex: 1,
                  }}
                  title={report.status === "resolved" ? "Already resolved" : "Save question and mark report as resolved"}
                >
                  {saving ? "Saving…" : "✅ Save & Resolve"}
                </button>
              </div>

              {report.status === "resolved" && (
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", textAlign: "center", margin: 0 }}>
                  This report is already resolved. &ldquo;Save &amp; Resolve&rdquo; is disabled.
                </p>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: translate(-50%, -48%) scale(0.97); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1);    }
        }
      `}</style>
    </>
  );
}

// ─── Small helpers ────────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.08em", color: "rgba(255,255,255,0.45)", marginBottom: "7px", fontFamily: "Rajdhani, sans-serif", textTransform: "uppercase" }}>
      {children}
    </div>
  );
}

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

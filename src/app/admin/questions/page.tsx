"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getAllQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  computeStats,
  type QuestionDoc,
  type QuestionInput,
  type Domain,
  type Difficulty,
  type Status,
} from "@/lib/questions";
import { SUBJECTS_BY_DOMAIN } from "@/data/subjectHierarchy";
import CsvImport from "@/components/admin/CsvImport";

// ─── Constants ──────────────────────────────────────────────────────────────
const DOMAINS: Domain[] = ["iti", "diploma", "btech"];
const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];
const DOMAIN_LABELS: Record<Domain, string> = { iti: "ITI", diploma: "Diploma", btech: "BTech" };
const DIFF_COLORS: Record<Difficulty, string> = { easy: "#22c55e", medium: "#f59e0b", hard: "#ef4444" };

const EMPTY_FORM: QuestionInput = {
  domain: "iti",
  category: "",
  subject: "",
  difficulty: "medium",
  level: 2,
  question: "",
  options: ["", "", "", ""],
  correct: 0,
  explanation: "",
  xp: 10,
  status: "draft",
  isActive: true,
  createdBy: "",
};

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function AdminQuestionsPage() {
  const [questions, setQuestions]   = useState<QuestionDoc[]>([]);
  const [loading, setLoading]       = useState(true);
  const [tab, setTab]               = useState<"list" | "add" | "import" | "stats">("list");
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [saving, setSaving]         = useState(false);
  const [message, setMessage]       = useState("");
  const [adminName, setAdminName]   = useState("");

  // Filters
  const [fDomain, setFDomain]       = useState<Domain | "all">("all");
  const [fSubject, setFSubject]     = useState("all");
  const [fDiff, setFDiff]           = useState<Difficulty | "all">("all");
  const [fStatus, setFStatus]       = useState<Status | "all">("all");
  const [fSearch, setFSearch]       = useState("");

  // Form
  const [form, setForm] = useState<QuestionInput>({ ...EMPTY_FORM });

  // ── Load admin name from localStorage ──
  useEffect(() => {
    const stored = localStorage.getItem("civilezy_admin_name");
    if (stored) setAdminName(stored);
  }, []);

  // ── Fetch questions ──
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllQuestions();
      setQuestions(data);
    } catch { setMessage("Failed to load questions"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Filtered list ──
  const filtered = useMemo(() => {
    return questions.filter((q) => {
      if (fDomain !== "all" && q.domain !== fDomain) return false;
      if (fSubject !== "all" && q.subject !== fSubject) return false;
      if (fDiff !== "all" && q.difficulty !== fDiff) return false;
      if (fStatus !== "all" && q.status !== fStatus) return false;
      if (fSearch && !q.question.toLowerCase().includes(fSearch.toLowerCase())) return false;
      return true;
    });
  }, [questions, fDomain, fSubject, fDiff, fStatus, fSearch]);

  // ── Subjects for selected domain in filter ──
  const filterSubjects = useMemo(() => {
    if (fDomain === "all") {
      const all = new Set<string>();
      DOMAINS.forEach((d) => SUBJECTS_BY_DOMAIN[d].forEach((s) => all.add(s)));
      return Array.from(all).sort();
    }
    return SUBJECTS_BY_DOMAIN[fDomain];
  }, [fDomain]);

  // ── Subjects for form ──
  const formSubjects = useMemo(() => SUBJECTS_BY_DOMAIN[form.domain] || [], [form.domain]);

  // ── Stats ──
  const stats = useMemo(() => computeStats(questions), [questions]);

  // ── Flash message ──
  const flash = (msg: string) => { setMessage(msg); setTimeout(() => setMessage(""), 3000); };

  // ── Handle admin name setup ──
  const saveAdminName = (name: string) => {
    setAdminName(name);
    localStorage.setItem("civilezy_admin_name", name);
  };

  // ── Save question (add or update) ──
  const handleSave = async () => {
    if (!adminName.trim()) { flash("Set your admin name first"); return; }
    if (!form.question.trim()) { flash("Question text is required"); return; }
    if (!form.subject) { flash("Select a subject"); return; }
    if (form.options.some((o) => !o.trim())) { flash("All 4 options are required"); return; }

    setSaving(true);
    try {
      const payload = { ...form, createdBy: form.createdBy || adminName };
      if (editingId) {
        await updateQuestion(editingId, { ...payload, reviewedBy: adminName });
        flash("Question updated");
      } else {
        await addQuestion({ ...payload, createdBy: adminName });
        flash("Question added");
      }
      setForm({ ...EMPTY_FORM, domain: form.domain, subject: form.subject, createdBy: adminName });
      setEditingId(null);
      await fetchAll();
      if (!editingId) { /* Stay on add tab for fast bulk entry */ }
      else setTab("list");
    } catch { flash("Failed to save"); }
    finally { setSaving(false); }
  };

  // ── Delete ──
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this question permanently?")) return;
    try { await deleteQuestion(id); flash("Deleted"); await fetchAll(); }
    catch { flash("Failed to delete"); }
  };

  // ── Toggle status / active ──
  const handleToggle = async (id: string, field: "status" | "isActive", current: string | boolean) => {
    try {
      if (field === "status") {
        await updateQuestion(id, { status: current === "published" ? "draft" : "published", reviewedBy: adminName });
      } else {
        await updateQuestion(id, { isActive: !current });
      }
      await fetchAll();
    } catch { flash("Failed to update"); }
  };

  // ── Edit question ──
  const startEdit = (q: QuestionDoc) => {
    setForm({
      domain: q.domain,
      category: q.category || "",
      subject: q.subject,
      difficulty: q.difficulty,
      level: q.level || 2,
      question: q.question,
      options: [...q.options],
      correct: q.correct,
      explanation: q.explanation,
      xp: q.xp,
      status: q.status,
      isActive: q.isActive,
      createdBy: q.createdBy,
    });
    setEditingId(q.id);
    setTab("add");
  };

  // ── Admin name gate ──
  if (!adminName) {
    return (
      <div style={{ padding: "60px 24px", maxWidth: "400px", margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: "32px", marginBottom: "12px" }}>👤</div>
        <h2 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "22px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
          Set Your Admin Name
        </h2>
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", marginBottom: "20px" }}>
          This will be saved as createdBy / reviewedBy on every question you touch.
        </p>
        <input
          type="text"
          placeholder="e.g. Arun, Meera, Admin1"
          maxLength={30}
          autoFocus
          style={S.input}
          onKeyDown={(e) => { if (e.key === "Enter" && (e.target as HTMLInputElement).value.trim()) saveAdminName((e.target as HTMLInputElement).value.trim()); }}
        />
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", marginTop: "8px" }}>Press Enter to save</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 20px 80px" }}>

      {/* ── Flash message ── */}
      {message && (
        <div style={{ position: "fixed", top: "70px", right: "20px", background: "rgba(255,98,0,0.9)", color: "#fff", padding: "10px 20px", borderRadius: "10px", fontSize: "14px", fontWeight: 600, zIndex: 100, boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
          {message}
        </div>
      )}

      {/* ── Tab bar ── */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap", alignItems: "center" }}>
        {(["list", "add", "import", "stats"] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); if (t === "add" && !editingId) setForm({ ...EMPTY_FORM, domain: form.domain, createdBy: adminName }); }}
            style={{
              padding: "8px 20px", borderRadius: "10px", border: "1px solid", fontSize: "13px", fontWeight: 700, cursor: "pointer",
              background: tab === t ? "rgba(255,98,0,0.15)" : "rgba(255,255,255,0.04)",
              borderColor: tab === t ? "rgba(255,98,0,0.4)" : "rgba(255,255,255,0.1)",
              color: tab === t ? "#FF8534" : "rgba(255,255,255,0.6)",
            }}
          >
            {t === "list" ? `📋 Questions (${questions.length})` : t === "add" ? (editingId ? "✏️ Edit Question" : "➕ Add Question") : t === "import" ? "📄 CSV Import" : "📊 Stats"}
          </button>
        ))}
        <div style={{ marginLeft: "auto", fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>
          Logged in as <strong style={{ color: "#FF8534" }}>{adminName}</strong>
        </div>
      </div>

      {/* ═══════════════ LIST TAB ═══════════════ */}
      {tab === "list" && (
        <>
          {/* Filters */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
            <select value={fDomain} onChange={(e) => { setFDomain(e.target.value as Domain | "all"); setFSubject("all"); }} style={S.select}>
              <option value="all">All Domains</option>
              {DOMAINS.map((d) => <option key={d} value={d}>{DOMAIN_LABELS[d]}</option>)}
            </select>
            <select value={fSubject} onChange={(e) => setFSubject(e.target.value)} style={S.select}>
              <option value="all">All Subjects</option>
              {filterSubjects.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={fDiff} onChange={(e) => setFDiff(e.target.value as Difficulty | "all")} style={S.select}>
              <option value="all">All Difficulties</option>
              {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <select value={fStatus} onChange={(e) => setFStatus(e.target.value as Status | "all")} style={S.select}>
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <input
              type="text"
              value={fSearch}
              onChange={(e) => setFSearch(e.target.value)}
              placeholder="Search question text..."
              style={{ ...S.input, flex: "1 1 200px", minWidth: "200px" }}
            />
          </div>

          {/* Count */}
          <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", marginBottom: "12px" }}>
            Showing {filtered.length} of {questions.length} questions
          </div>

          {/* Table */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", color: "rgba(255,255,255,0.4)" }}>Loading...</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "rgba(255,255,255,0.4)" }}>
              {questions.length === 0 ? "No questions yet. Start adding!" : "No questions match your filters."}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {filtered.map((q) => (
                <div key={q.id} style={S.row}>
                  {/* Left: badges + question */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "6px" }}>
                      <Badge color="#FF8534" bg="rgba(255,98,0,0.12)">{DOMAIN_LABELS[q.domain]}</Badge>
                      <Badge color={DIFF_COLORS[q.difficulty]} bg={`${DIFF_COLORS[q.difficulty]}18`}>{q.difficulty}</Badge>
                      <Badge
                        color={q.status === "published" ? "#22c55e" : "#f59e0b"}
                        bg={q.status === "published" ? "rgba(34,197,94,0.12)" : "rgba(245,158,11,0.12)"}
                      >
                        {q.status}
                      </Badge>
                      {!q.isActive && <Badge color="#ef4444" bg="rgba(239,68,68,0.12)">inactive</Badge>}
                      <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>{q.subject}</span>
                    </div>
                    <div style={{ fontSize: "14px", color: "#fff", lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {q.question}
                    </div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", marginTop: "4px" }}>
                      by {q.createdBy} &middot; {q.xp} XP &middot; Answer: {q.options[q.correct]}
                    </div>
                  </div>

                  {/* Right: actions */}
                  <div style={{ display: "flex", gap: "6px", flexShrink: 0, alignItems: "center" }}>
                    <MiniBtn onClick={() => handleToggle(q.id, "status", q.status)} title={q.status === "published" ? "Unpublish" : "Publish"}>
                      {q.status === "published" ? "📤" : "📥"}
                    </MiniBtn>
                    <MiniBtn onClick={() => handleToggle(q.id, "isActive", q.isActive)} title={q.isActive ? "Deactivate" : "Activate"}>
                      {q.isActive ? "🟢" : "🔴"}
                    </MiniBtn>
                    <MiniBtn onClick={() => startEdit(q)} title="Edit">✏️</MiniBtn>
                    <MiniBtn onClick={() => handleDelete(q.id)} title="Delete">🗑️</MiniBtn>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ═══════════════ ADD / EDIT TAB ═══════════════ */}
      {tab === "add" && (
        <div style={S.formCard}>
          <h3 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "20px" }}>
            {editingId ? "Edit Question" : "Add New Question"}
          </h3>

          {/* Row 1: Domain + Subject + Difficulty */}
          <div style={S.formRow}>
            <div style={S.field}>
              <label style={S.label}>Domain</label>
              <select value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value as Domain, subject: "" })} style={S.select}>
                {DOMAINS.map((d) => <option key={d} value={d}>{DOMAIN_LABELS[d]}</option>)}
              </select>
            </div>
            <div style={{ ...S.field, flex: 2 }}>
              <label style={S.label}>Subject</label>
              <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} style={S.select}>
                <option value="">Select subject...</option>
                {formSubjects.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div style={S.field}>
              <label style={S.label}>Difficulty</label>
              <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value as Difficulty })} style={S.select}>
                {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div style={{ ...S.field, maxWidth: "80px" }}>
              <label style={S.label}>XP</label>
              <input type="number" value={form.xp} onChange={(e) => setForm({ ...form, xp: Number(e.target.value) })} min={1} max={50} style={S.input} />
            </div>
          </div>

          {/* Question */}
          <div style={S.field}>
            <label style={S.label}>Question</label>
            <textarea
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              rows={3}
              placeholder="Enter the question text..."
              style={{ ...S.input, resize: "vertical", fontFamily: "inherit" }}
            />
          </div>

          {/* Options */}
          <div style={S.field}>
            <label style={S.label}>Options (click the radio to mark correct answer)</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {form.options.map((opt, i) => (
                <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <input
                    type="radio"
                    name="correct"
                    checked={form.correct === i}
                    onChange={() => setForm({ ...form, correct: i as 0 | 1 | 2 | 3 })}
                    style={{ accentColor: "#FF6200", width: "18px", height: "18px", cursor: "pointer" }}
                  />
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", width: "24px", fontWeight: 700 }}>
                    {String.fromCharCode(65 + i)}.
                  </span>
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const opts = [...form.options] as [string, string, string, string];
                      opts[i] = e.target.value;
                      setForm({ ...form, options: opts });
                    }}
                    placeholder={`Option ${String.fromCharCode(65 + i)}`}
                    style={{ ...S.input, flex: 1 }}
                  />
                  {form.correct === i && <span style={{ fontSize: "12px", color: "#22c55e", fontWeight: 700 }}>CORRECT</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Explanation */}
          <div style={S.field}>
            <label style={S.label}>Explanation</label>
            <textarea
              value={form.explanation}
              onChange={(e) => setForm({ ...form, explanation: e.target.value })}
              rows={2}
              placeholder="Explain why this is the correct answer..."
              style={{ ...S.input, resize: "vertical", fontFamily: "inherit" }}
            />
          </div>

          {/* Status + Active + Save */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center", marginTop: "8px" }}>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Status })} style={{ ...S.select, width: "auto" }}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "rgba(255,255,255,0.6)", cursor: "pointer" }}>
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} style={{ accentColor: "#FF6200" }} />
              Active
            </label>
            <div style={{ marginLeft: "auto", display: "flex", gap: "10px" }}>
              {editingId && (
                <button onClick={() => { setEditingId(null); setForm({ ...EMPTY_FORM, domain: form.domain, createdBy: adminName }); }} style={S.btnSecondary}>
                  Cancel Edit
                </button>
              )}
              <button onClick={handleSave} disabled={saving} style={S.btnPrimary}>
                {saving ? "Saving..." : editingId ? "Update Question" : "Add Question"}
              </button>
            </div>
          </div>

          {/* Fast-entry tip */}
          {!editingId && (
            <div style={{ marginTop: "16px", padding: "12px 16px", background: "rgba(255,184,0,0.08)", border: "1px solid rgba(255,184,0,0.2)", borderRadius: "10px", fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>
              💡 <strong>Fast entry mode:</strong> After saving, domain &amp; subject are preserved so you can quickly add the next question in the same category.
            </div>
          )}
        </div>
      )}

      {/* ═══════════════ CSV IMPORT TAB ═══════════════ */}
      {tab === "import" && (
        <CsvImport adminName={adminName} onImportDone={fetchAll} />
      )}

      {/* ═══════════════ STATS TAB ═══════════════ */}
      {tab === "stats" && (
        <>
          {/* Domain stats cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px", marginBottom: "32px" }}>
            {/* Total card */}
            <div style={S.statCard}>
              <div style={{ fontSize: "28px", marginBottom: "6px" }}>📦</div>
              <div style={{ fontSize: "28px", fontFamily: "Rajdhani, sans-serif", fontWeight: 700, color: "#FF8534" }}>{questions.length}</div>
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>Total Questions</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", marginTop: "4px" }}>
                {questions.filter((q) => q.status === "published" && q.isActive).length} live in game
              </div>
            </div>

            {DOMAINS.map((d) => {
              const ds = stats.byDomain.find((s) => s.domain === d);
              return (
                <div key={d} style={S.statCard}>
                  <div style={{ fontSize: "16px", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>{DOMAIN_LABELS[d]}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "13px" }}>
                    <StatRow label="Total" value={ds?.total ?? 0} />
                    <StatRow label="Published" value={ds?.published ?? 0} color="#22c55e" />
                    <StatRow label="Draft" value={ds?.draft ?? 0} color="#f59e0b" />
                    <StatRow label="Easy" value={ds?.easy ?? 0} color={DIFF_COLORS.easy} />
                    <StatRow label="Medium" value={ds?.medium ?? 0} color={DIFF_COLORS.medium} />
                    <StatRow label="Hard" value={ds?.hard ?? 0} color={DIFF_COLORS.hard} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Subject breakdown */}
          <h3 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "18px", fontWeight: 700, color: "#fff", marginBottom: "16px" }}>
            Questions Per Subject
          </h3>

          {DOMAINS.map((d) => {
            const subjects = SUBJECTS_BY_DOMAIN[d];
            const domainSubjStats = stats.bySubject.filter((s) => s.domain === d);
            return (
              <div key={d} style={{ marginBottom: "24px" }}>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#FF8534", marginBottom: "10px" }}>{DOMAIN_LABELS[d]}</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "6px" }}>
                  {subjects.map((s) => {
                    const ss = domainSubjStats.find((x) => x.subject === s);
                    const count = ss?.total ?? 0;
                    const pub = ss?.published ?? 0;
                    const isLow = count < 5;
                    return (
                      <div
                        key={s}
                        style={{
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                          padding: "8px 12px", borderRadius: "8px", fontSize: "13px",
                          background: isLow ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.03)",
                          border: `1px solid ${isLow ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.06)"}`,
                        }}
                      >
                        <span style={{ color: "rgba(255,255,255,0.7)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                          {isLow && "⚠️ "}{s}
                        </span>
                        <span style={{ fontWeight: 700, color: count === 0 ? "#ef4444" : pub > 0 ? "#22c55e" : "#f59e0b", marginLeft: "8px", flexShrink: 0 }}>
                          {count === 0 ? "0" : `${pub}/${count}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

// ─── Reusable tiny components ───────────────────────────────────────────────
function Badge({ children, color, bg }: { children: React.ReactNode; color: string; bg: string }) {
  return (
    <span style={{ display: "inline-block", padding: "1px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: 700, color, background: bg, border: `1px solid ${color}25`, whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}

function MiniBtn({ children, onClick, title }: { children: React.ReactNode; onClick: () => void; title: string }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "14px", transition: "background 0.15s" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,98,0,0.15)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}
    >
      {children}
    </button>
  );
}

function StatRow({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span style={{ color: "rgba(255,255,255,0.5)" }}>{label}</span>
      <span style={{ fontWeight: 700, color: color ?? "#fff" }}>{value}</span>
    </div>
  );
}

// ─── Shared styles ──────────────────────────────────────────────────────────
const S = {
  input: {
    width: "100%", boxSizing: "border-box", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "10px", padding: "10px 14px", color: "#fff", fontSize: "14px", outline: "none",
  } as React.CSSProperties,
  select: {
    background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px",
    padding: "10px 14px", color: "#fff", fontSize: "13px", outline: "none", cursor: "pointer", minWidth: "120px",
  } as React.CSSProperties,
  label: {
    display: "block", fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: "6px", letterSpacing: "0.3px",
  } as React.CSSProperties,
  field: {
    flex: 1, minWidth: "120px", marginBottom: "16px",
  } as React.CSSProperties,
  formRow: {
    display: "flex", gap: "12px", flexWrap: "wrap",
  } as React.CSSProperties,
  formCard: {
    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px",
  } as React.CSSProperties,
  statCard: {
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "20px", textAlign: "center",
  } as React.CSSProperties,
  row: {
    display: "flex", alignItems: "center", gap: "16px", background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "14px 16px",
  } as React.CSSProperties,
  btnPrimary: {
    background: "linear-gradient(135deg,#FF6200,#FF8534)", color: "#fff", border: "none", borderRadius: "10px",
    padding: "10px 24px", fontSize: "14px", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
  } as React.CSSProperties,
  btnSecondary: {
    background: "transparent", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px",
    padding: "10px 20px", fontSize: "14px", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
  } as React.CSSProperties,
};

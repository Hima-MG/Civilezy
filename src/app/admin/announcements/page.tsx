"use client";

import { useState, useEffect, useCallback } from "react";
import { Timestamp } from "firebase/firestore";
import {
  getAllAnnouncements,
  addAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  type Announcement,
  type AnnouncementType,
  type AnnouncementInput,
} from "@/lib/announcements";

// ─── Constants ────────────────────────────────────────────────────────────────

const TYPES: AnnouncementType[] = ["exam", "result", "achievement", "update"];

const TYPE_CFG: Record<AnnouncementType, { color: string; bg: string; icon: string; label: string }> = {
  exam:        { color: "#FF8534", bg: "rgba(255,133,52,0.15)", icon: "📋", label: "Exam" },
  result:      { color: "#22c55e", bg: "rgba(34,197,94,0.15)",  icon: "🏆", label: "Result" },
  achievement: { color: "#FFB800", bg: "rgba(255,184,0,0.15)",  icon: "⭐", label: "Achievement" },
  update:      { color: "#3b82f6", bg: "rgba(59,130,246,0.15)", icon: "📢", label: "Update" },
};

interface FormState {
  title: string;
  type: AnnouncementType;
  link: string;
  isActive: boolean;
  priority: number;
  expiresAtInput: string; // datetime-local string
}

const EMPTY: FormState = {
  title:         "",
  type:          "exam",
  link:          "",
  isActive:      true,
  priority:      5,
  expiresAtInput:"",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminAnnouncementsPage() {
  const [items,     setItems]     = useState<Announcement[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [tab,       setTab]       = useState<"list" | "form">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form,      setForm]      = useState<FormState>({ ...EMPTY });
  const [saving,    setSaving]    = useState(false);
  const [message,   setMessage]   = useState("");
  const [deleteId,  setDeleteId]  = useState<string | null>(null);

  // ── Flash message ──
  const flash = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  // ── Fetch ──
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await getAllAnnouncements());
    } catch {
      flash("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Save (add or update) ──
  const handleSave = async () => {
    if (!form.title.trim()) return flash("Title is required");
    setSaving(true);
    try {
      const expiresAt: Timestamp | null = form.expiresAtInput
        ? Timestamp.fromDate(new Date(form.expiresAtInput))
        : null;

      const input: AnnouncementInput = {
        title:     form.title.trim(),
        type:      form.type,
        link:      form.link.trim(),
        isActive:  form.isActive,
        priority:  Number(form.priority),
        expiresAt,
      };

      if (editingId) {
        await updateAnnouncement(editingId, input);
        flash("✅ Announcement updated");
      } else {
        await addAnnouncement(input);
        flash("✅ Announcement added");
      }
      resetForm();
      setTab("list");
      await fetchAll();
    } catch {
      flash("❌ Save failed — please try again");
    } finally {
      setSaving(false);
    }
  };

  // ── Start edit ──
  const startEdit = (ann: Announcement) => {
    setForm({
      title:          ann.title,
      type:           ann.type,
      link:           ann.link ?? "",
      isActive:       ann.isActive,
      priority:       ann.priority,
      expiresAtInput: ann.expiresAt
        ? new Date(ann.expiresAt.toMillis()).toISOString().slice(0, 16)
        : "",
    });
    setEditingId(ann.id);
    setTab("form");
  };

  // ── Toggle active ──
  const handleToggle = async (ann: Announcement) => {
    try {
      await updateAnnouncement(ann.id, { isActive: !ann.isActive });
      flash(ann.isActive ? "Deactivated" : "Activated");
      await fetchAll();
    } catch {
      flash("Toggle failed");
    }
  };

  // ── Delete ──
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteAnnouncement(deleteId);
      setDeleteId(null);
      flash("🗑️ Deleted");
      await fetchAll();
    } catch {
      flash("Delete failed");
    }
  };

  const resetForm = () => {
    setForm({ ...EMPTY });
    setEditingId(null);
  };

  const isExpired = (a: Announcement) =>
    !!a.expiresAt && a.expiresAt.toMillis() < Date.now();

  const activeCount   = items.filter((a) => a.isActive && !isExpired(a)).length;
  const inactiveCount = items.length - activeCount;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#060D1A", padding: "28px 24px", fontFamily: "Nunito, sans-serif" }}>

      {/* ── Flash message ── */}
      {message && (
        <div style={{
          position: "fixed", top: "70px", right: "24px", zIndex: 9999,
          background: "rgba(11,30,61,0.95)", border: "1px solid rgba(255,98,0,0.4)",
          borderRadius: "12px", padding: "12px 20px", color: "#fff",
          fontSize: "14px", fontWeight: 600, backdropFilter: "blur(12px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}>
          {message}
        </div>
      )}

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px", gap: "16px", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "26px", fontWeight: 700, color: "#fff", margin: 0 }}>
            📣 Announcement Manager
          </h1>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "13px", margin: "4px 0 0" }}>
            Control what notifications appear at the top of the website
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setTab("form"); }}
          style={btn.primary}
        >
          + New Announcement
        </button>
      </div>

      {/* ── Stats row ── */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
        {[
          { label: "Total",    value: items.length,  color: "rgba(255,255,255,0.6)" },
          { label: "Active",   value: activeCount,   color: "#22c55e" },
          { label: "Inactive", value: inactiveCount, color: "rgba(255,255,255,0.35)" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px", padding: "12px 20px", minWidth: "100px",
          }}>
            <div style={{ fontSize: "22px", fontWeight: 700, color, fontFamily: "Rajdhani, sans-serif" }}>{value}</div>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* ── Tab bar ── */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "20px" }}>
        {(["list", "form"] as const).map((t) => (
          <button
            key={t}
            onClick={() => { if (t === "list") resetForm(); setTab(t); }}
            style={{
              padding: "8px 18px", borderRadius: "10px", cursor: "pointer",
              fontFamily: "Nunito, sans-serif", fontSize: "13px", fontWeight: 700,
              background: tab === t ? "rgba(255,98,0,0.2)" : "rgba(255,255,255,0.05)",
              color: tab === t ? "#FF8534" : "rgba(255,255,255,0.5)",
              border: `1px solid ${tab === t ? "rgba(255,98,0,0.35)" : "transparent"}`,
              transition: "all 0.2s",
            }}
          >
            {t === "list"
              ? `📋 All (${items.length})`
              : editingId ? "✏️ Edit" : "➕ Add New"}
          </button>
        ))}
      </div>

      {/* ══ LIST TAB ══════════════════════════════════════════════════════════ */}
      {tab === "list" && (
        <div>
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px", color: "rgba(255,255,255,0.35)", fontSize: "14px" }}>
              Loading…
            </div>
          ) : items.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "60px 20px",
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "16px", color: "rgba(255,255,255,0.35)", fontSize: "14px",
            }}>
              <div style={{ fontSize: "36px", marginBottom: "12px" }}>📭</div>
              No announcements yet.{" "}
              <span
                style={{ color: "#FF8534", cursor: "pointer", fontWeight: 700 }}
                onClick={() => { resetForm(); setTab("form"); }}
              >
                Add one →
              </span>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {items.map((ann) => {
                const cfg      = TYPE_CFG[ann.type];
                const expired  = isExpired(ann);
                const showStatus = !ann.isActive ? "Inactive" : expired ? "Expired" : "Active";
                const statusColor = showStatus === "Active" ? "#22c55e" : showStatus === "Expired" ? "#f59e0b" : "rgba(255,255,255,0.3)";

                return (
                  <div
                    key={ann.id}
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "14px",
                      padding: "14px 18px",
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      flexWrap: "wrap",
                      borderLeft: `3px solid ${cfg.color}`,
                    }}
                  >
                    {/* Type badge */}
                    <span style={{
                      fontSize: "11px", fontWeight: 700, padding: "3px 10px",
                      borderRadius: "20px", background: cfg.bg, color: cfg.color,
                      flexShrink: 0, letterSpacing: "0.06em",
                      fontFamily: "Rajdhani, sans-serif",
                    }}>
                      {cfg.icon} {cfg.label.toUpperCase()}
                    </span>

                    {/* Title */}
                    <div style={{ flex: 1, minWidth: "180px" }}>
                      <div style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>
                        {ann.title}
                      </div>
                      {ann.link && (
                        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "260px" }}>
                          🔗 {ann.link}
                        </div>
                      )}
                    </div>

                    {/* Priority */}
                    <div style={{ textAlign: "center", flexShrink: 0 }}>
                      <div style={{ fontSize: "16px", fontWeight: 700, color: "#FF8534", fontFamily: "Rajdhani, sans-serif" }}>{ann.priority}</div>
                      <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)" }}>Priority</div>
                    </div>

                    {/* Expires */}
                    {ann.expiresAt && (
                      <div style={{ textAlign: "center", flexShrink: 0 }}>
                        <div style={{ fontSize: "12px", color: expired ? "#f59e0b" : "rgba(255,255,255,0.5)" }}>
                          {new Date(ann.expiresAt.toMillis()).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}
                        </div>
                        <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>Expires</div>
                      </div>
                    )}

                    {/* Status pill */}
                    <span style={{
                      fontSize: "11px", fontWeight: 700, padding: "3px 10px",
                      borderRadius: "20px",
                      background: `${statusColor}18`,
                      color: statusColor,
                      border: `1px solid ${statusColor}44`,
                      flexShrink: 0,
                      fontFamily: "Rajdhani, sans-serif",
                      letterSpacing: "0.06em",
                    }}>
                      {showStatus.toUpperCase()}
                    </span>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                      <button onClick={() => startEdit(ann)} style={btn.icon} title="Edit">✏️</button>
                      <button
                        onClick={() => handleToggle(ann)}
                        style={{ ...btn.icon, color: ann.isActive ? "#f59e0b" : "#22c55e" }}
                        title={ann.isActive ? "Deactivate" : "Activate"}
                      >
                        {ann.isActive ? "⏸" : "▶️"}
                      </button>
                      <button onClick={() => setDeleteId(ann.id)} style={{ ...btn.icon, color: "#ef4444" }} title="Delete">🗑️</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ══ FORM TAB ══════════════════════════════════════════════════════════ */}
      {tab === "form" && (
        <div style={{
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
          borderRadius: "18px", padding: "28px",
        }}>
          <h2 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "20px", fontWeight: 700, color: "#fff", margin: "0 0 22px" }}>
            {editingId ? "✏️ Edit Announcement" : "➕ New Announcement"}
          </h2>

          <div style={{ display: "grid", gap: "18px" }}>

            {/* Title */}
            <label style={lbl}>
              <span style={lblText}>Title *</span>
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Kerala PSC AE Civil Exam 2026 — Notification Released"
                style={inputStyle}
              />
            </label>

            {/* Type + Priority row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <label style={lbl}>
                <span style={lblText}>Type</span>
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as AnnouncementType }))}
                  style={inputStyle}
                >
                  {TYPES.map((t) => (
                    <option key={t} value={t}>
                      {TYPE_CFG[t].icon} {TYPE_CFG[t].label}
                    </option>
                  ))}
                </select>
              </label>

              <label style={lbl}>
                <span style={lblText}>Priority (1 = low, 10 = high)</span>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={form.priority}
                  onChange={(e) => setForm((f) => ({ ...f, priority: Number(e.target.value) }))}
                  style={inputStyle}
                />
              </label>
            </div>

            {/* Link */}
            <label style={lbl}>
              <span style={lblText}>Link (optional)</span>
              <input
                value={form.link}
                onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
                placeholder="https://..."
                style={inputStyle}
              />
            </label>

            {/* Expires At */}
            <label style={lbl}>
              <span style={lblText}>Expires At (optional)</span>
              <input
                type="datetime-local"
                value={form.expiresAtInput}
                onChange={(e) => setForm((f) => ({ ...f, expiresAtInput: e.target.value }))}
                style={inputStyle}
              />
            </label>

            {/* Is Active toggle */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
                style={{
                  width: "44px", height: "24px", borderRadius: "12px", cursor: "pointer",
                  background: form.isActive ? "#22c55e" : "rgba(255,255,255,0.15)",
                  position: "relative", transition: "background 0.25s",
                  flexShrink: 0,
                }}
              >
                <div style={{
                  position: "absolute", top: "3px",
                  left: form.isActive ? "23px" : "3px",
                  width: "18px", height: "18px", borderRadius: "50%",
                  background: "#fff", transition: "left 0.25s",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                }} />
              </div>
              <span style={{ fontSize: "14px", color: form.isActive ? "#22c55e" : "rgba(255,255,255,0.45)", fontWeight: 600 }}>
                {form.isActive ? "Active — will show on site" : "Inactive — hidden from site"}
              </span>
            </div>

            {/* Preview */}
            {form.title && (
              <div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", marginBottom: "8px", fontWeight: 600 }}>PREVIEW</div>
                <div style={{
                  background: TYPE_CFG[form.type].bg,
                  border: `1px solid ${TYPE_CFG[form.type].color}44`,
                  borderLeft: `3px solid ${TYPE_CFG[form.type].color}`,
                  borderRadius: "10px", padding: "10px 16px",
                  display: "flex", alignItems: "center", gap: "10px",
                }}>
                  <span style={{ fontSize: "14px" }}>{TYPE_CFG[form.type].icon}</span>
                  <span style={{
                    fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em",
                    color: TYPE_CFG[form.type].color, fontFamily: "Rajdhani, sans-serif",
                    background: `${TYPE_CFG[form.type].color}22`, padding: "1px 7px", borderRadius: "20px",
                  }}>
                    {form.type.toUpperCase()}
                  </span>
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>{form.title}</span>
                  {form.link && <span style={{ fontSize: "11px", color: TYPE_CFG[form.type].color, fontWeight: 600, marginLeft: "auto" }}>View →</span>}
                </div>
              </div>
            )}

            {/* Buttons */}
            <div style={{ display: "flex", gap: "10px", paddingTop: "4px" }}>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{ ...btn.primary, opacity: saving ? 0.6 : 1 }}
              >
                {saving ? "Saving…" : editingId ? "Update Announcement" : "Publish Announcement"}
              </button>
              <button
                onClick={() => { resetForm(); setTab("list"); }}
                style={btn.secondary}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete confirm modal ── */}
      {deleteId && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
        }}>
          <div style={{
            background: "#0B1E3D", border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "20px", padding: "32px 28px", maxWidth: "360px", width: "100%",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>🗑️</div>
            <h3 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "20px", fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>
              Delete Announcement?
            </h3>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", margin: "0 0 24px" }}>
              This cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setDeleteId(null)} style={{ ...btn.secondary, flex: 1 }}>Cancel</button>
              <button
                onClick={handleDelete}
                style={{ flex: 1, background: "linear-gradient(135deg,#ef4444,#dc2626)", color: "#fff", border: "none", borderRadius: "10px", padding: "10px", fontFamily: "Nunito, sans-serif", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Shared style helpers ─────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width:        "100%",
  boxSizing:    "border-box",
  background:   "rgba(0,0,0,0.35)",
  border:       "1px solid rgba(255,255,255,0.12)",
  borderRadius: "10px",
  padding:      "11px 14px",
  color:        "#fff",
  fontSize:     "14px",
  outline:      "none",
  fontFamily:   "Nunito, sans-serif",
};

const lbl: React.CSSProperties = {
  display:       "flex",
  flexDirection: "column",
  gap:           "6px",
};

const lblText: React.CSSProperties = {
  fontSize:   "12px",
  fontWeight: 700,
  color:      "rgba(255,255,255,0.5)",
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  fontFamily: "Rajdhani, sans-serif",
};

const btn = {
  primary: {
    background:   "linear-gradient(135deg,#FF6200,#FF8534)",
    color:        "#fff",
    border:       "none",
    borderRadius: "10px",
    padding:      "11px 22px",
    fontFamily:   "Nunito, sans-serif",
    fontSize:     "14px",
    fontWeight:   700,
    cursor:       "pointer",
    boxShadow:    "0 4px 16px rgba(255,98,0,0.3)",
  } as React.CSSProperties,

  secondary: {
    background:   "rgba(255,255,255,0.07)",
    color:        "rgba(255,255,255,0.65)",
    border:       "1px solid rgba(255,255,255,0.12)",
    borderRadius: "10px",
    padding:      "11px 22px",
    fontFamily:   "Nunito, sans-serif",
    fontSize:     "14px",
    fontWeight:   600,
    cursor:       "pointer",
  } as React.CSSProperties,

  icon: {
    background:   "rgba(255,255,255,0.06)",
    border:       "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    padding:      "6px 9px",
    cursor:       "pointer",
    fontSize:     "14px",
    color:        "rgba(255,255,255,0.7)",
    lineHeight:   1,
  } as React.CSSProperties,
};

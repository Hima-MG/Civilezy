"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { requireAdminSession } from "@/lib/adminAuth";
import type { AiFaq, FaqCategory } from "@/types/chatbot";
import { FAQ_CATEGORIES } from "@/types/chatbot";

const PASSPHRASE = "civilezy2026admin";

const EMPTY_FORM: Omit<AiFaq, "id" | "createdAt" | "updatedAt"> = {
  question: "",
  answer: "",
  category: "General",
  keywords: [],
  status: "active",
};

export default function FaqManagerPage() {
  const [faqs, setFaqs] = useState<AiFaq[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<FaqCategory | "All">("All");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<AiFaq | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [keywordInput, setKeywordInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchFaqs = useCallback(async () => {
    setLoading(true);
    try {
      requireAdminSession();
    } catch {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/admin/faqs", {
        headers: { "x-admin-passphrase": PASSPHRASE },
      });
      const data = await res.json();
      setFaqs(data.faqs ?? []);
    } catch {
      setError("Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setKeywordInput("");
    setError("");
    setShowModal(true);
  };

  const openEdit = (faq: AiFaq) => {
    setEditing(faq);
    setForm({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      keywords: faq.keywords ?? [],
      status: faq.status,
    });
    setKeywordInput("");
    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setError("");
  };

  const addKeyword = () => {
    const kw = keywordInput.trim().toLowerCase();
    if (kw && !form.keywords.includes(kw)) {
      setForm((f) => ({ ...f, keywords: [...f.keywords, kw] }));
    }
    setKeywordInput("");
  };

  const removeKeyword = (kw: string) => {
    setForm((f) => ({ ...f, keywords: f.keywords.filter((k) => k !== kw) }));
  };

  const handleSave = async () => {
    if (!form.question.trim() || !form.answer.trim()) {
      setError("Question and answer are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (editing?.id) {
        await fetch("/api/admin/faqs", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-admin-passphrase": PASSPHRASE,
          },
          body: JSON.stringify({ id: editing.id, ...form }),
        });
      } else {
        await fetch("/api/admin/faqs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-passphrase": PASSPHRASE,
          },
          body: JSON.stringify(form),
        });
      }
      closeModal();
      await fetchFaqs();
    } catch {
      setError("Failed to save FAQ.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/admin/faqs?id=${id}`, {
        method: "DELETE",
        headers: { "x-admin-passphrase": PASSPHRASE },
      });
      setDeleteConfirm(null);
      await fetchFaqs();
    } catch {
      setError("Failed to delete.");
    }
  };

  const toggleStatus = async (faq: AiFaq) => {
    const newStatus = faq.status === "active" ? "inactive" : "active";
    await fetch("/api/admin/faqs", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-passphrase": PASSPHRASE,
      },
      body: JSON.stringify({ id: faq.id, status: newStatus }),
    });
    await fetchFaqs();
  };

  const filtered = faqs.filter((f) => {
    const matchSearch =
      !search ||
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === "All" || f.category === filterCategory;
    return matchSearch && matchCat;
  });

  return (
    <div
      style={{
        minHeight: "calc(100vh - 56px)",
        background: "#060D1A",
        padding: "32px 24px 60px",
        fontFamily: "Nunito, sans-serif",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "24px" }}>
          <Link href="/admin" style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>Admin</Link>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
          <Link href="/admin/chatbot" style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>AI Chatbot</Link>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
          <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>FAQ Manager</span>
        </div>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "26px", fontWeight: 700, color: "#fff", margin: 0 }}>
              FAQ Manager
            </h1>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", margin: "4px 0 0" }}>
              {faqs.length} FAQs · {faqs.filter((f) => f.status === "active").length} active
            </p>
          </div>
          <button
            onClick={openCreate}
            style={{
              background: "linear-gradient(135deg,#FF6200,#FF8534)",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              padding: "10px 20px",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "Nunito, sans-serif",
            }}
          >
            + Add FAQ
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Search FAQs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: "1 1 220px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "10px",
              padding: "9px 14px",
              color: "#fff",
              fontSize: "13.5px",
              outline: "none",
              fontFamily: "Nunito, sans-serif",
            }}
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as FaqCategory | "All")}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "10px",
              padding: "9px 14px",
              color: "#fff",
              fontSize: "13.5px",
              outline: "none",
              fontFamily: "Nunito, sans-serif",
              cursor: "pointer",
            }}
          >
            <option value="All">All Categories</option>
            {FAQ_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* FAQ list */}
        {loading ? (
          <div style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", padding: "60px 0" }}>
            Loading FAQs…
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", padding: "60px 0" }}>
            {faqs.length === 0 ? "No FAQs yet. Add your first FAQ!" : "No FAQs match your search."}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {filtered.map((faq) => (
              <div
                key={faq.id}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${faq.status === "active" ? "rgba(52,211,153,0.15)" : "rgba(255,255,255,0.07)"}`,
                  borderRadius: "14px",
                  padding: "16px 18px",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
                      <span
                        style={{
                          fontSize: "10.5px",
                          padding: "2px 8px",
                          borderRadius: "20px",
                          background: "rgba(96,165,250,0.12)",
                          color: "#60a5fa",
                          border: "1px solid rgba(96,165,250,0.2)",
                          fontWeight: 600,
                        }}
                      >
                        {faq.category}
                      </span>
                      <span
                        style={{
                          fontSize: "10.5px",
                          padding: "2px 8px",
                          borderRadius: "20px",
                          background: faq.status === "active" ? "rgba(52,211,153,0.12)" : "rgba(255,255,255,0.06)",
                          color: faq.status === "active" ? "#34d399" : "rgba(255,255,255,0.3)",
                          border: `1px solid ${faq.status === "active" ? "rgba(52,211,153,0.25)" : "rgba(255,255,255,0.08)"}`,
                          fontWeight: 600,
                        }}
                      >
                        {faq.status}
                      </span>
                    </div>
                    <p style={{ fontSize: "14px", fontWeight: 700, color: "#fff", margin: "0 0 6px", lineHeight: 1.4 }}>
                      {faq.question}
                    </p>
                    <p style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {faq.answer}
                    </p>
                    {faq.keywords?.length > 0 && (
                      <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginTop: "8px" }}>
                        {faq.keywords.map((kw) => (
                          <span
                            key={kw}
                            style={{
                              fontSize: "10px",
                              padding: "2px 7px",
                              borderRadius: "20px",
                              background: "rgba(255,255,255,0.05)",
                              color: "rgba(255,255,255,0.35)",
                              border: "1px solid rgba(255,255,255,0.08)",
                            }}
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                    <button
                      onClick={() => toggleStatus(faq)}
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                        padding: "6px 10px",
                        color: "rgba(255,255,255,0.5)",
                        cursor: "pointer",
                        fontSize: "11px",
                        fontFamily: "Nunito, sans-serif",
                      }}
                    >
                      {faq.status === "active" ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => openEdit(faq)}
                      style={{
                        background: "rgba(96,165,250,0.1)",
                        border: "1px solid rgba(96,165,250,0.2)",
                        borderRadius: "8px",
                        padding: "6px 10px",
                        color: "#60a5fa",
                        cursor: "pointer",
                        fontSize: "11px",
                        fontFamily: "Nunito, sans-serif",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(faq.id!)}
                      style={{
                        background: "rgba(248,113,113,0.1)",
                        border: "1px solid rgba(248,113,113,0.2)",
                        borderRadius: "8px",
                        padding: "6px 10px",
                        color: "#f87171",
                        cursor: "pointer",
                        fontSize: "11px",
                        fontFamily: "Nunito, sans-serif",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Create/Edit Modal ── */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div
            style={{
              background: "#0F1E3A",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "20px",
              padding: "28px",
              width: "100%",
              maxWidth: "580px",
              maxHeight: "90vh",
              overflowY: "auto",
              fontFamily: "Nunito, sans-serif",
            }}
          >
            <h2 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "22px", fontWeight: 700, color: "#fff", margin: "0 0 20px" }}>
              {editing ? "Edit FAQ" : "Add New FAQ"}
            </h2>

            {error && (
              <div style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: "10px", padding: "10px 14px", color: "#f87171", fontSize: "13px", marginBottom: "16px" }}>
                {error}
              </div>
            )}

            <label style={labelStyle}>Question *</label>
            <input
              value={form.question}
              onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
              placeholder="e.g. How do I renew my membership?"
              style={inputStyle}
            />

            <label style={labelStyle}>Answer *</label>
            <textarea
              value={form.answer}
              onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
              placeholder="Detailed answer. You can use **bold** for emphasis and new lines for structure."
              rows={5}
              style={{ ...inputStyle, resize: "vertical", minHeight: "120px" }}
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={labelStyle}>Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as FaqCategory }))}
                  style={{ ...inputStyle, cursor: "pointer" }}
                >
                  {FAQ_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as "active" | "inactive" }))}
                  style={{ ...inputStyle, cursor: "pointer" }}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <label style={labelStyle}>Keywords (helps search matching)</label>
            <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
              <input
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addKeyword(); } }}
                placeholder="Type a keyword and press Enter"
                style={{ ...inputStyle, flex: 1, marginBottom: 0 }}
              />
              <button
                onClick={addKeyword}
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px", padding: "0 14px", color: "#fff", cursor: "pointer", fontFamily: "Nunito, sans-serif", fontSize: "13px", flexShrink: 0 }}
              >
                Add
              </button>
            </div>
            {form.keywords.length > 0 && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "20px" }}>
                {form.keywords.map((kw) => (
                  <span
                    key={kw}
                    style={{ fontSize: "12px", padding: "3px 10px", borderRadius: "20px", background: "rgba(255,98,0,0.12)", color: "#FF8534", border: "1px solid rgba(255,98,0,0.2)", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}
                    onClick={() => removeKeyword(kw)}
                  >
                    {kw} ×
                  </span>
                ))}
              </div>
            )}

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "8px" }}>
              <button onClick={closeModal} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "10px 20px", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: "14px", fontFamily: "Nunito, sans-serif" }}>
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{ background: saving ? "rgba(255,98,0,0.5)" : "linear-gradient(135deg,#FF6200,#FF8534)", color: "#fff", border: "none", borderRadius: "12px", padding: "10px 24px", fontSize: "14px", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", fontFamily: "Nunito, sans-serif" }}
              >
                {saving ? "Saving…" : editing ? "Save Changes" : "Add FAQ"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete confirm ── */}
      {deleteConfirm && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 1001, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
          onClick={(e) => { if (e.target === e.currentTarget) setDeleteConfirm(null); }}
        >
          <div style={{ background: "#0F1E3A", border: "1px solid rgba(248,113,113,0.3)", borderRadius: "18px", padding: "28px", maxWidth: "360px", width: "100%", textAlign: "center", fontFamily: "Nunito, sans-serif" }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>🗑️</div>
            <h3 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "20px", color: "#fff", margin: "0 0 8px" }}>Delete FAQ?</h3>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", margin: "0 0 24px" }}>This cannot be undone.</p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "9px 18px", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontFamily: "Nunito, sans-serif" }}>
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)} style={{ background: "#f87171", border: "none", borderRadius: "10px", padding: "9px 18px", color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "Nunito, sans-serif" }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "12px",
  fontWeight: 700,
  color: "rgba(255,255,255,0.45)",
  marginBottom: "6px",
  marginTop: "14px",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  background: "rgba(0,0,0,0.3)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "10px",
  padding: "10px 14px",
  color: "#fff",
  fontSize: "13.5px",
  outline: "none",
  fontFamily: "Nunito, sans-serif",
  marginBottom: "4px",
};

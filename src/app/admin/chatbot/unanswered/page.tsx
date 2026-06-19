"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { requireAdminSession } from "@/lib/adminAuth";
import type { UnansweredQuery, FaqCategory } from "@/types/chatbot";
import { FAQ_CATEGORIES } from "@/types/chatbot";

const PASSPHRASE = "civilezy2026admin";

type StatusFilter = "all" | "pending" | "reviewed" | "converted_to_faq";

export default function UnansweredQueriesPage() {
  const [queries, setQueries] = useState<UnansweredQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending");
  const [error, setError] = useState("");

  // Convert-to-FAQ modal state
  const [convertModal, setConvertModal] = useState<UnansweredQuery | null>(null);
  const [faqAnswer, setFaqAnswer] = useState("");
  const [faqCategory, setFaqCategory] = useState<FaqCategory>("General");
  const [faqKeywords, setFaqKeywords] = useState("");
  const [converting, setConverting] = useState(false);

  // Answer modal state
  const [answerModal, setAnswerModal] = useState<UnansweredQuery | null>(null);
  const [answerText, setAnswerText] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchQueries = useCallback(async () => {
    setLoading(true);
    try { requireAdminSession(); } catch { setLoading(false); return; }
    try {
      const res = await fetch(`/api/admin/chatbot/unanswered?status=${statusFilter}`, {
        headers: { "x-admin-passphrase": PASSPHRASE },
      });
      const data = await res.json();
      setQueries(data.queries ?? []);
    } catch {
      setError("Failed to load queries.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetchQueries(); }, [fetchQueries]);

  const updateStatus = async (id: string, status: string, adminResponse?: string) => {
    await fetch("/api/admin/chatbot/unanswered", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-passphrase": PASSPHRASE },
      body: JSON.stringify({ id, status, adminResponse }),
    });
    await fetchQueries();
  };

  const deleteQuery = async (id: string) => {
    await fetch(`/api/admin/chatbot/unanswered?id=${id}`, {
      method: "DELETE",
      headers: { "x-admin-passphrase": PASSPHRASE },
    });
    await fetchQueries();
  };

  const handleAnswer = async () => {
    if (!answerModal?.id || !answerText.trim()) return;
    setSaving(true);
    try {
      await updateStatus(answerModal.id, "reviewed", answerText.trim());
      setAnswerModal(null);
      setAnswerText("");
    } finally {
      setSaving(false);
    }
  };

  const handleConvertToFaq = async () => {
    if (!convertModal?.id || !faqAnswer.trim()) return;
    setConverting(true);
    try {
      // Create FAQ
      const keywords = faqKeywords
        .split(",")
        .map((k) => k.trim().toLowerCase())
        .filter(Boolean);

      await fetch("/api/admin/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-passphrase": PASSPHRASE },
        body: JSON.stringify({
          question: convertModal.question,
          answer: faqAnswer.trim(),
          category: faqCategory,
          keywords,
        }),
      });

      // Mark as converted
      await updateStatus(convertModal.id, "converted_to_faq", faqAnswer.trim());

      setConvertModal(null);
      setFaqAnswer("");
      setFaqKeywords("");
    } finally {
      setConverting(false);
    }
  };

  const statusColor: Record<string, string> = {
    pending: "#fb923c",
    reviewed: "#60a5fa",
    converted_to_faq: "#34d399",
  };

  return (
    <div style={{ minHeight: "calc(100vh - 56px)", background: "#060D1A", padding: "32px 24px 60px", fontFamily: "Nunito, sans-serif" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "24px" }}>
          <Link href="/admin" style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>Admin</Link>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
          <Link href="/admin/chatbot" style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>AI Chatbot</Link>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
          <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>Unanswered Questions</span>
        </div>

        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "26px", fontWeight: 700, color: "#fff", margin: "0 0 4px" }}>
            Unanswered Questions
          </h1>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", margin: 0 }}>
            Review questions the chatbot couldn&apos;t answer confidently. Convert them to FAQs to improve accuracy.
          </p>
        </div>

        {/* Status filter tabs */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "20px", flexWrap: "wrap" }}>
          {(["pending", "reviewed", "converted_to_faq", "all"] as StatusFilter[]).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                padding: "7px 16px",
                borderRadius: "20px",
                border: `1px solid ${statusFilter === s ? "rgba(255,98,0,0.4)" : "rgba(255,255,255,0.1)"}`,
                background: statusFilter === s ? "rgba(255,98,0,0.15)" : "transparent",
                color: statusFilter === s ? "#FF8534" : "rgba(255,255,255,0.5)",
                fontSize: "12.5px",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "Nunito, sans-serif",
                textTransform: "capitalize",
              }}
            >
              {s.replace("_", " ")}
            </button>
          ))}
        </div>

        {error && (
          <div style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: "10px", padding: "12px 16px", color: "#f87171", fontSize: "13px", marginBottom: "16px" }}>
            {error}
          </div>
        )}

        {/* List */}
        {loading ? (
          <div style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", padding: "60px 0" }}>Loading…</div>
        ) : queries.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>✅</div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>
              {statusFilter === "pending" ? "No pending questions — great!" : "Nothing here."}
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {queries.map((q) => (
              <div
                key={q.id}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "14px",
                  padding: "16px 18px",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px", flexWrap: "wrap" }}>
                      <span
                        style={{
                          fontSize: "10.5px",
                          padding: "2px 8px",
                          borderRadius: "20px",
                          background: `${statusColor[q.status]}18`,
                          color: statusColor[q.status],
                          border: `1px solid ${statusColor[q.status]}30`,
                          fontWeight: 600,
                          textTransform: "capitalize",
                        }}
                      >
                        {q.status.replace("_", " ")}
                      </span>
                      <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
                        {new Date(q.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                    <p style={{ fontSize: "14px", fontWeight: 700, color: "#fff", margin: "0 0 6px" }}>
                      {q.question}
                    </p>
                    {q.adminResponse && (
                      <div style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.15)", borderRadius: "8px", padding: "8px 12px", marginTop: "8px" }}>
                        <p style={{ fontSize: "11px", color: "rgba(52,211,153,0.6)", margin: "0 0 3px", fontWeight: 700 }}>Admin Response:</p>
                        <p style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.5)", margin: 0 }}>{q.adminResponse}</p>
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", flexShrink: 0 }}>
                    {q.status === "pending" && (
                      <>
                        <button
                          onClick={() => { setConvertModal(q); setFaqAnswer(""); setFaqKeywords(""); setFaqCategory("General"); }}
                          style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)", borderRadius: "8px", padding: "6px 12px", color: "#34d399", cursor: "pointer", fontSize: "11.5px", fontFamily: "Nunito, sans-serif", fontWeight: 700, whiteSpace: "nowrap" }}
                        >
                          → Convert to FAQ
                        </button>
                        <button
                          onClick={() => { setAnswerModal(q); setAnswerText(""); }}
                          style={{ background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.25)", borderRadius: "8px", padding: "6px 12px", color: "#60a5fa", cursor: "pointer", fontSize: "11.5px", fontFamily: "Nunito, sans-serif", whiteSpace: "nowrap" }}
                        >
                          Answer
                        </button>
                        <button
                          onClick={() => updateStatus(q.id!, "reviewed")}
                          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "6px 12px", color: "rgba(255,255,255,0.45)", cursor: "pointer", fontSize: "11.5px", fontFamily: "Nunito, sans-serif", whiteSpace: "nowrap" }}
                        >
                          Mark Reviewed
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => deleteQuery(q.id!)}
                      style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.15)", borderRadius: "8px", padding: "6px 12px", color: "#f87171", cursor: "pointer", fontSize: "11.5px", fontFamily: "Nunito, sans-serif", whiteSpace: "nowrap" }}
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

      {/* ── Answer modal ── */}
      {answerModal && (
        <div style={overlayStyle} onClick={(e) => { if (e.target === e.currentTarget) setAnswerModal(null); }}>
          <div style={modalStyle}>
            <h3 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "20px", color: "#fff", margin: "0 0 16px" }}>Answer Question</h3>
            <p style={{ fontSize: "13.5px", color: "rgba(255,255,255,0.7)", margin: "0 0 16px", background: "rgba(255,255,255,0.05)", borderRadius: "10px", padding: "10px 14px" }}>
              {answerModal.question}
            </p>
            <textarea
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Type your answer..."
              rows={4}
              style={{ width: "100%", boxSizing: "border-box", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px", padding: "10px 14px", color: "#fff", fontSize: "13.5px", outline: "none", fontFamily: "Nunito, sans-serif", resize: "vertical", marginBottom: "16px" }}
            />
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button onClick={() => setAnswerModal(null)} style={cancelBtnStyle}>Cancel</button>
              <button onClick={handleAnswer} disabled={saving || !answerText.trim()} style={{ ...saveBtnStyle, opacity: !answerText.trim() ? 0.5 : 1 }}>
                {saving ? "Saving…" : "Save Answer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Convert to FAQ modal ── */}
      {convertModal && (
        <div style={overlayStyle} onClick={(e) => { if (e.target === e.currentTarget) setConvertModal(null); }}>
          <div style={{ ...modalStyle, maxWidth: "560px" }}>
            <h3 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "20px", color: "#fff", margin: "0 0 6px" }}>Convert to FAQ</h3>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: "0 0 16px" }}>This will add a new entry to the chatbot knowledge base.</p>

            <label style={labelStyle}>Question (auto-filled from student)</label>
            <input value={convertModal.question} readOnly style={{ ...inputStyle, opacity: 0.7 }} />

            <label style={labelStyle}>Answer *</label>
            <textarea
              value={faqAnswer}
              onChange={(e) => setFaqAnswer(e.target.value)}
              placeholder="Write a clear, helpful answer for future students..."
              rows={5}
              style={{ ...inputStyle, resize: "vertical", minHeight: "120px" }}
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={labelStyle}>Category</label>
                <select value={faqCategory} onChange={(e) => setFaqCategory(e.target.value as FaqCategory)} style={{ ...inputStyle, cursor: "pointer" }}>
                  {FAQ_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Keywords (comma-separated)</label>
                <input value={faqKeywords} onChange={(e) => setFaqKeywords(e.target.value)} placeholder="renewal, membership, extend" style={inputStyle} />
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "8px" }}>
              <button onClick={() => setConvertModal(null)} style={cancelBtnStyle}>Cancel</button>
              <button onClick={handleConvertToFaq} disabled={converting || !faqAnswer.trim()} style={{ ...saveBtnStyle, opacity: !faqAnswer.trim() ? 0.5 : 1 }}>
                {converting ? "Converting…" : "Convert & Add to FAQ"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const overlayStyle: React.CSSProperties = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 1000,
  display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
};

const modalStyle: React.CSSProperties = {
  background: "#0F1E3A", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "20px",
  padding: "28px", width: "100%", maxWidth: "480px", maxHeight: "90vh", overflowY: "auto",
  fontFamily: "Nunito, sans-serif",
};

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.4)",
  marginBottom: "5px", marginTop: "12px", textTransform: "uppercase", letterSpacing: "0.05em",
};

const inputStyle: React.CSSProperties = {
  width: "100%", boxSizing: "border-box", background: "rgba(0,0,0,0.3)",
  border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px", padding: "10px 14px",
  color: "#fff", fontSize: "13.5px", outline: "none", fontFamily: "Nunito, sans-serif", marginBottom: "4px",
};

const cancelBtnStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "12px", padding: "10px 20px", color: "rgba(255,255,255,0.6)", cursor: "pointer",
  fontSize: "14px", fontFamily: "Nunito, sans-serif",
};

const saveBtnStyle: React.CSSProperties = {
  background: "linear-gradient(135deg,#FF6200,#FF8534)", color: "#fff", border: "none",
  borderRadius: "12px", padding: "10px 24px", fontSize: "14px", fontWeight: 700,
  cursor: "pointer", fontFamily: "Nunito, sans-serif",
};

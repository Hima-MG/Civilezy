"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { requireAdminSession } from "@/lib/adminAuth";

const PASSPHRASE = "civilezy2026admin";

interface KbStats {
  total: number;
  bySource: Record<string, number>;
  lastSyncAt: string | null;
}

interface SyncResult {
  success: boolean;
  synced: Record<string, number>;
  total: number;
  syncedAt: string;
  error?: string;
}

const SOURCES = [
  {
    id: "static",
    label: "Course & Platform Data",
    icon: "📚",
    desc: "Course details, pricing, features, Game Arena, Study Circle, contact info. Hardcoded from website.",
    color: "#34d399",
    bg: "rgba(52,211,153,0.1)",
    border: "rgba(52,211,153,0.25)",
  },
  {
    id: "ebooks",
    label: "E-Books",
    icon: "📖",
    desc: "Syncs from Firestore ebooks collection. Fetches all published e-books with titles, descriptions, and pricing.",
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.1)",
    border: "rgba(167,139,250,0.25)",
  },
  {
    id: "announcements",
    label: "Announcements",
    icon: "📣",
    desc: "Syncs from Firestore announcements collection. Students can ask about recent updates.",
    color: "#fb923c",
    bg: "rgba(251,146,60,0.1)",
    border: "rgba(251,146,60,0.25)",
  },
  {
    id: "blogs",
    label: "Blog Articles",
    icon: "📰",
    desc: "Syncs published blogs (title + excerpt). Students can ask about blog topics and CivilEzy articles.",
    color: "#38bdf8",
    bg: "rgba(56,189,248,0.1)",
    border: "rgba(56,189,248,0.25)",
  },
] as const;

type SourceId = "static" | "ebooks" | "announcements" | "blogs" | "all";

export default function KnowledgeManagerPage() {
  const [stats, setStats] = useState<KbStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<SourceId | null>(null);
  const [lastResult, setLastResult] = useState<SyncResult | null>(null);
  const [error, setError] = useState("");

  const fetchStats = useCallback(async () => {
    try { requireAdminSession(); } catch { return; }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/chatbot/sync", {
        headers: { "x-admin-passphrase": PASSPHRASE },
      });
      const data = await res.json();
      setStats(data);
    } catch {
      setError("Failed to load knowledge base stats.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const triggerSync = async (source: SourceId) => {
    setSyncing(source);
    setError("");
    setLastResult(null);
    try {
      const res = await fetch("/api/admin/chatbot/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passphrase": PASSPHRASE,
        },
        body: JSON.stringify({ source }),
      });
      const data: SyncResult = await res.json();
      setLastResult(data);
      if (data.success) {
        await fetchStats();
      } else {
        setError(data.error ?? "Sync failed.");
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setSyncing(null);
    }
  };

  const formatDate = (iso: string | null) => {
    if (!iso) return "Never";
    return new Date(iso).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div style={{ minHeight: "calc(100vh - 56px)", background: "#060D1A", padding: "32px 24px 80px", fontFamily: "Nunito, sans-serif" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "24px" }}>
          <Link href="/admin" style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>Admin</Link>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
          <Link href="/admin/chatbot" style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>AI Chatbot</Link>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
          <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>Knowledge Base</span>
        </div>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "14px" }}>
          <div>
            <h1 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "26px", fontWeight: 700, color: "#fff", margin: "0 0 6px" }}>
              Knowledge Base Manager
            </h1>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", margin: 0, maxWidth: "560px" }}>
              Sync website content into the AI knowledge base so the chatbot can answer questions about courses, e-books, announcements, and blogs automatically.
            </p>
          </div>
          <button
            onClick={() => triggerSync("all")}
            disabled={!!syncing}
            style={{
              background: syncing ? "rgba(255,98,0,0.4)" : "linear-gradient(135deg,#FF6200,#FF8534)",
              color: "#fff", border: "none", borderRadius: "12px",
              padding: "11px 22px", fontSize: "14px", fontWeight: 700,
              cursor: syncing ? "not-allowed" : "pointer",
              fontFamily: "Nunito, sans-serif", whiteSpace: "nowrap",
              display: "flex", alignItems: "center", gap: "8px",
            }}
          >
            {syncing === "all" ? (
              <>⏳ Rebuilding…</>
            ) : (
              <>🔄 Rebuild All Knowledge</>
            )}
          </button>
        </div>

        {error && (
          <div style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: "10px", padding: "12px 16px", color: "#f87171", fontSize: "13px", marginBottom: "20px" }}>
            {error}
          </div>
        )}

        {/* Last sync result */}
        {lastResult?.success && (
          <div style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: "12px", padding: "14px 18px", marginBottom: "20px" }}>
            <p style={{ fontSize: "13px", color: "#34d399", margin: "0 0 6px", fontWeight: 700 }}>
              ✅ Sync completed at {formatDate(lastResult.syncedAt)}
            </p>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              {Object.entries(lastResult.synced).map(([src, count]) => (
                <span key={src} style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
                  {src}: <strong style={{ color: "#fff" }}>{count} chunks</strong>
                </span>
              ))}
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
                Total: <strong style={{ color: "#fff" }}>{lastResult.total}</strong>
              </span>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px", marginBottom: "32px" }}>
          {[
            { label: "Total Chunks", value: loading ? "…" : stats?.total ?? 0, color: "#FF8534" },
            { label: "Course & Platform", value: loading ? "…" : (stats?.bySource?.["static"] ?? 0) + (stats?.bySource?.["course"] ?? 0), color: "#34d399" },
            { label: "E-Books", value: loading ? "…" : stats?.bySource?.["ebook"] ?? 0, color: "#a78bfa" },
            { label: "Announcements", value: loading ? "…" : stats?.bySource?.["announcement"] ?? 0, color: "#fb923c" },
            { label: "Blogs", value: loading ? "…" : stats?.bySource?.["blog"] ?? 0, color: "#38bdf8" },
            { label: "Last Sync", value: loading ? "…" : formatDate(stats?.lastSyncAt ?? null), color: "rgba(255,255,255,0.5)" },
          ].map((s) => (
            <div key={s.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "14px 16px" }}>
              <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: typeof s.value === "number" ? "24px" : "13px", fontWeight: 700, color: s.color, lineHeight: 1.2 }}>
                {s.value}
              </div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginTop: "4px" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div style={{ background: "rgba(255,133,52,0.06)", border: "1px solid rgba(255,133,52,0.15)", borderRadius: "14px", padding: "18px 20px", marginBottom: "28px" }}>
          <h3 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "15px", color: "#FF8534", margin: "0 0 10px" }}>
            💡 How the Knowledge Base Works
          </h3>
          <p style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.5)", margin: "0 0 8px", lineHeight: "1.6" }}>
            When a student asks a question, the AI searches these sources in order:
          </p>
          <ol style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.5)", margin: 0, paddingLeft: "20px", lineHeight: "2" }}>
            <li><strong style={{ color: "rgba(255,255,255,0.7)" }}>Intent Detection</strong> — verified hardcoded answers for renewal, e-books, technical issues</li>
            <li><strong style={{ color: "rgba(255,255,255,0.7)" }}>FAQ Database</strong> — manually managed Q&A pairs</li>
            <li><strong style={{ color: "rgba(255,255,255,0.7)" }}>Knowledge Base</strong> — this synced content (courses, e-books, blogs, announcements)</li>
            <li><strong style={{ color: "rgba(255,255,255,0.7)" }}>OpenAI</strong> — generates answer using retrieved context as source of truth</li>
          </ol>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", margin: "10px 0 0" }}>
            Sync regularly to keep the knowledge base current. Recommended: after adding new e-books, publishing announcements, or publishing blog posts.
          </p>
        </div>

        {/* Source sync cards */}
        <h2 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "18px", color: "#fff", margin: "0 0 16px" }}>
          Sync by Source
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
          {SOURCES.map((src) => {
            const count = (stats?.bySource?.[src.id === "static" ? "static" : src.id === "ebooks" ? "ebook" : src.id === "announcements" ? "announcement" : "blog"] ?? 0)
              + (src.id === "static" ? (stats?.bySource?.["course"] ?? 0) : 0);
            const isSyncing = syncing === src.id;

            return (
              <div
                key={src.id}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${src.border}`,
                  borderRadius: "16px",
                  padding: "20px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                    <span style={{ fontSize: "20px" }}>{src.icon}</span>
                    <span style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "16px", fontWeight: 700, color: "#fff" }}>
                      {src.label}
                    </span>
                  </div>
                  <span style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "20px", fontWeight: 700, color: src.color }}>
                    {loading ? "…" : count}
                  </span>
                </div>

                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: "0 0 14px", lineHeight: "1.6" }}>
                  {src.desc}
                </p>

                <button
                  onClick={() => triggerSync(src.id as SourceId)}
                  disabled={!!syncing}
                  style={{
                    width: "100%",
                    background: isSyncing ? `${src.bg}` : src.bg,
                    border: `1px solid ${src.border}`,
                    borderRadius: "10px",
                    padding: "9px 16px",
                    color: isSyncing ? "rgba(255,255,255,0.4)" : src.color,
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: syncing ? "not-allowed" : "pointer",
                    fontFamily: "Nunito, sans-serif",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "7px",
                    transition: "opacity 0.2s",
                    opacity: syncing && !isSyncing ? 0.5 : 1,
                  }}
                >
                  {isSyncing ? "⏳ Syncing…" : `🔄 Sync ${src.label}`}
                </button>
              </div>
            );
          })}
        </div>

        {/* Tips */}
        <div style={{ marginTop: "28px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "18px 20px" }}>
          <h3 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "15px", color: "rgba(255,255,255,0.6)", margin: "0 0 12px" }}>
            📋 Sync Schedule Recommendations
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
            {[
              { when: "After adding new e-books", action: "Sync E-Books" },
              { when: "After publishing announcements", action: "Sync Announcements" },
              { when: "After publishing blog posts", action: "Sync Blogs" },
              { when: "After updating course/pricing", action: "Sync Course Data" },
              { when: "Weekly maintenance", action: "Rebuild All" },
            ].map((tip) => (
              <div key={tip.when} style={{ padding: "10px 14px", background: "rgba(255,255,255,0.03)", borderRadius: "8px" }}>
                <div style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.6)", fontWeight: 700, marginBottom: "2px" }}>
                  {tip.action}
                </div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
                  {tip.when}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick link to FAQs */}
        <div style={{ marginTop: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Link
            href="/admin/chatbot/faqs"
            style={{ fontSize: "13px", color: "#34d399", textDecoration: "none", padding: "8px 16px", background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: "8px" }}
          >
            📋 Manage FAQs →
          </Link>
          <Link
            href="/admin/chatbot/unanswered"
            style={{ fontSize: "13px", color: "#fb923c", textDecoration: "none", padding: "8px 16px", background: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.2)", borderRadius: "8px" }}
          >
            ❓ Review Unanswered →
          </Link>
          <Link
            href="/admin/chatbot/analytics"
            style={{ fontSize: "13px", color: "#60a5fa", textDecoration: "none", padding: "8px 16px", background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.2)", borderRadius: "8px" }}
          >
            📊 View Analytics →
          </Link>
        </div>
      </div>
    </div>
  );
}

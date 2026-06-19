"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { requireAdminSession } from "@/lib/adminAuth";

interface DailyRecord {
  date: string;
  totalQuestions: number;
  answeredQuestions: number;
  unansweredQuestions: number;
  faqHits: number;
  aiGeneratedAnswers: number;
}

interface AnalyticsData {
  daily: DailyRecord[];
  totals: {
    totalQuestions: number;
    answeredQuestions: number;
    unansweredQuestions: number;
    faqHits: number;
    aiGeneratedAnswers: number;
  };
  totalFaqs: number;
  activeFaqs: number;
  pendingUnanswered: number;
}

export default function ChatbotAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    try { requireAdminSession(); } catch { return; }
    fetch("/api/admin/chatbot/analytics", {
      headers: { "x-admin-passphrase": "civilezy2026admin" },
    })
      .then((r) => r.json())
      .then(setData)
      .catch(() => setError("Failed to load analytics."))
      .finally(() => setLoading(false));
  }, []);

  const faqRate =
    data && data.totals.totalQuestions > 0
      ? Math.round((data.totals.faqHits / data.totals.totalQuestions) * 100)
      : 0;

  const answerRate =
    data && data.totals.totalQuestions > 0
      ? Math.round((data.totals.answeredQuestions / data.totals.totalQuestions) * 100)
      : 0;

  const unansweredRate =
    data && data.totals.totalQuestions > 0
      ? Math.round((data.totals.unansweredQuestions / data.totals.totalQuestions) * 100)
      : 0;

  // Bar chart max value
  const maxDailyQ = data
    ? Math.max(...data.daily.map((d) => d.totalQuestions), 1)
    : 1;

  // Last 14 days for chart (most recent)
  const chartData = data ? data.daily.slice(-14) : [];

  return (
    <div style={{ minHeight: "calc(100vh - 56px)", background: "#060D1A", padding: "32px 24px 60px", fontFamily: "Nunito, sans-serif" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "24px" }}>
          <Link href="/admin" style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>Admin</Link>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
          <Link href="/admin/chatbot" style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>AI Chatbot</Link>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
          <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>Analytics</span>
        </div>

        <h1 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "26px", fontWeight: 700, color: "#fff", margin: "0 0 6px" }}>
          Chatbot Analytics
        </h1>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", margin: "0 0 28px" }}>
          Last 30 days · Updates in real-time
        </p>

        {error && (
          <div style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: "10px", padding: "12px 16px", color: "#f87171", fontSize: "13px", marginBottom: "20px" }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", padding: "60px 0" }}>Loading analytics…</div>
        ) : (
          <>
            {/* KPI Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "14px", marginBottom: "32px" }}>
              {[
                { label: "Total Questions (30d)", value: data?.totals.totalQuestions ?? 0, color: "#60a5fa", icon: "💬" },
                { label: "FAQ Hit Rate", value: `${faqRate}%`, color: "#34d399", icon: "✅" },
                { label: "AI Answer Rate", value: `${answerRate - faqRate > 0 ? answerRate - faqRate : 0}%`, color: "#a78bfa", icon: "🤖" },
                { label: "Unanswered Rate", value: `${unansweredRate}%`, color: "#fb923c", icon: "❓" },
                { label: "Total FAQs", value: data?.totalFaqs ?? 0, color: "#34d399", icon: "📋" },
                { label: "Pending Review", value: data?.pendingUnanswered ?? 0, color: "#fb923c", icon: "⏳" },
              ].map((kpi) => (
                <div
                  key={kpi.label}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "14px",
                    padding: "16px 18px",
                  }}
                >
                  <div style={{ fontSize: "20px", marginBottom: "8px" }}>{kpi.icon}</div>
                  <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "26px", fontWeight: 700, color: kpi.color, lineHeight: 1.1 }}>
                    {kpi.value}
                  </div>
                  <div style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>
                    {kpi.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Breakdown cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "32px" }}>
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "20px" }}>
                <h3 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "16px", color: "#fff", margin: "0 0 16px" }}>Response Sources (30d)</h3>
                {[
                  { label: "FAQ Answers", value: data?.totals.faqHits ?? 0, color: "#34d399", total: data?.totals.totalQuestions ?? 1 },
                  { label: "AI Generated", value: data?.totals.aiGeneratedAnswers ?? 0, color: "#a78bfa", total: data?.totals.totalQuestions ?? 1 },
                  { label: "Unanswered", value: data?.totals.unansweredQuestions ?? 0, color: "#fb923c", total: data?.totals.totalQuestions ?? 1 },
                ].map((row) => {
                  const pct = row.total > 0 ? Math.round((row.value / row.total) * 100) : 0;
                  return (
                    <div key={row.label} style={{ marginBottom: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                        <span style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.6)" }}>{row.label}</span>
                        <span style={{ fontSize: "12.5px", color: row.color, fontWeight: 700 }}>
                          {row.value} ({pct}%)
                        </span>
                      </div>
                      <div style={{ height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "3px", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: row.color, borderRadius: "3px", transition: "width 0.6s ease" }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "20px" }}>
                <h3 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "16px", color: "#fff", margin: "0 0 16px" }}>Knowledge Base Health</h3>
                {[
                  { label: "Active FAQs", value: data?.activeFaqs ?? 0, color: "#34d399" },
                  { label: "Total FAQs", value: data?.totalFaqs ?? 0, color: "#60a5fa" },
                  { label: "Inactive FAQs", value: (data?.totalFaqs ?? 0) - (data?.activeFaqs ?? 0), color: "rgba(255,255,255,0.3)" },
                  { label: "Pending Reviews", value: data?.pendingUnanswered ?? 0, color: "#fb923c" },
                ].map((row) => (
                  <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <span style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.55)" }}>{row.label}</span>
                    <span style={{ fontSize: "16px", fontWeight: 700, color: row.color, fontFamily: "Rajdhani, sans-serif" }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily chart */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "22px" }}>
              <h3 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "16px", color: "#fff", margin: "0 0 20px" }}>
                Daily Questions (last 14 days)
              </h3>

              {chartData.length === 0 ? (
                <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", padding: "30px 0", fontSize: "13px" }}>
                  No data yet — activity will appear here once students start chatting.
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "flex-end", gap: "6px", height: "120px" }}>
                  {chartData.map((d) => {
                    const pct = (d.totalQuestions / maxDailyQ) * 100;
                    const date = new Date(d.date);
                    return (
                      <div
                        key={d.date}
                        style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", height: "100%" }}
                        title={`${d.date}: ${d.totalQuestions} questions`}
                      >
                        <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
                          <div
                            style={{
                              width: "100%",
                              height: `${Math.max(pct, 4)}%`,
                              background: "linear-gradient(180deg,#FF6200,rgba(255,98,0,0.3))",
                              borderRadius: "4px 4px 0 0",
                              minHeight: "4px",
                            }}
                          />
                        </div>
                        <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", whiteSpace: "nowrap" }}>
                          {date.getDate()}/{date.getMonth() + 1}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Tips */}
            {(data?.pendingUnanswered ?? 0) > 0 && (
              <div style={{ marginTop: "20px", background: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.2)", borderRadius: "12px", padding: "16px 18px" }}>
                <p style={{ fontSize: "13px", color: "#fb923c", margin: "0 0 8px", fontWeight: 700 }}>
                  💡 {data?.pendingUnanswered} unanswered question{data!.pendingUnanswered !== 1 ? "s" : ""} need review
                </p>
                <p style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.5)", margin: 0 }}>
                  Converting unanswered questions to FAQs improves the chatbot&apos;s accuracy and reduces your support workload.
                </p>
                <Link
                  href="/admin/chatbot/unanswered"
                  style={{ display: "inline-block", marginTop: "10px", fontSize: "12.5px", color: "#fb923c", fontWeight: 700, textDecoration: "none" }}
                >
                  Review now →
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

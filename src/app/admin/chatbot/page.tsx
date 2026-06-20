"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { requireAdminSession } from "@/lib/adminAuth";

interface Stats {
  totalFaqs: number;
  activeFaqs: number;
  pendingUnanswered: number;
  totals: {
    totalQuestions: number;
    answeredQuestions: number;
    unansweredQuestions: number;
    faqHits: number;
    aiGeneratedAnswers: number;
  };
}

const CARDS = [
  {
    href: "/admin/chatbot/knowledge",
    icon: "🧠",
    title: "Knowledge Base",
    desc: "Sync course data, e-books, announcements, and blog content so the AI can answer any website question automatically.",
    accent: "#FF8534",
    accentBg: "rgba(255,133,52,0.10)",
    border: "rgba(255,133,52,0.22)",
    hoverBorder: "rgba(255,133,52,0.45)",
    action: "Manage Knowledge →",
  },
  {
    href: "/admin/chatbot/faqs",
    icon: "📋",
    title: "FAQ Manager",
    desc: "Add, edit, and manage hand-crafted Q&A pairs for precise, instant answers to common questions.",
    accent: "#34d399",
    accentBg: "rgba(52,211,153,0.10)",
    border: "rgba(52,211,153,0.22)",
    hoverBorder: "rgba(52,211,153,0.45)",
    action: "Manage FAQs →",
  },
  {
    href: "/admin/chatbot/unanswered",
    icon: "❓",
    title: "Unanswered Questions",
    desc: "Review questions the chatbot couldn't answer confidently. Convert them to FAQs to improve accuracy.",
    accent: "#fb923c",
    accentBg: "rgba(251,146,60,0.10)",
    border: "rgba(251,146,60,0.22)",
    hoverBorder: "rgba(251,146,60,0.45)",
    action: "Review Questions →",
  },
  {
    href: "/admin/chatbot/analytics",
    icon: "📊",
    title: "Analytics",
    desc: "Track chatbot usage, FAQ hit rates, AI response rates, and daily conversation trends.",
    accent: "#60a5fa",
    accentBg: "rgba(96,165,250,0.10)",
    border: "rgba(96,165,250,0.22)",
    hoverBorder: "rgba(96,165,250,0.45)",
    action: "View Analytics →",
  },
] as const;

export default function ChatbotAdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      requireAdminSession();
    } catch {
      return;
    }

    fetch("/api/admin/chatbot/analytics", {
      headers: { "x-admin-passphrase": "civilezy2026admin" },
    })
      .then((r) => r.json())
      .then((data) => {
        setStats({
          totalFaqs: data.totalFaqs ?? 0,
          activeFaqs: data.activeFaqs ?? 0,
          pendingUnanswered: data.pendingUnanswered ?? 0,
          totals: data.totals ?? {
            totalQuestions: 0,
            answeredQuestions: 0,
            unansweredQuestions: 0,
            faqHits: 0,
            aiGeneratedAnswers: 0,
          },
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const faqRate =
    stats && stats.totals.totalQuestions > 0
      ? Math.round((stats.totals.faqHits / stats.totals.totalQuestions) * 100)
      : 0;

  const answerRate =
    stats && stats.totals.totalQuestions > 0
      ? Math.round(
          (stats.totals.answeredQuestions / stats.totals.totalQuestions) * 100
        )
      : 0;

  return (
    <div
      style={{
        minHeight: "calc(100vh - 56px)",
        background: "#060D1A",
        padding: "40px 24px 60px",
        fontFamily: "Nunito, sans-serif",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "36px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <Link
              href="/admin"
              style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", textDecoration: "none" }}
            >
              ← Admin
            </Link>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
            <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>AI Chatbot</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                background: "linear-gradient(135deg,#FF6200,#FF8534)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                boxShadow: "0 6px 20px rgba(255,98,0,0.35)",
              }}
            >
              🤖
            </div>
            <div>
              <h1
                style={{
                  fontFamily: "Rajdhani, sans-serif",
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "#fff",
                  margin: 0,
                  lineHeight: 1.1,
                }}
              >
                AI Chatbot Manager
              </h1>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", margin: 0, marginTop: "3px" }}>
                Manage the CivilEzy AI Student Support Assistant
              </p>
            </div>
          </div>
          <div
            style={{
              height: "1px",
              background: "linear-gradient(90deg,rgba(255,98,0,0.35),rgba(255,255,255,0.04) 70%)",
              marginTop: "24px",
            }}
          />
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "14px",
            marginBottom: "36px",
          }}
        >
          {[
            { label: "Total FAQs", value: loading ? "…" : stats?.totalFaqs ?? 0, color: "#34d399" },
            { label: "Active FAQs", value: loading ? "…" : stats?.activeFaqs ?? 0, color: "#34d399" },
            { label: "Pending Review", value: loading ? "…" : stats?.pendingUnanswered ?? 0, color: "#fb923c" },
            { label: "Total Questions (30d)", value: loading ? "…" : stats?.totals.totalQuestions ?? 0, color: "#60a5fa" },
            { label: "FAQ Hit Rate (30d)", value: loading ? "…" : `${faqRate}%`, color: "#a78bfa" },
            { label: "Answer Rate (30d)", value: loading ? "…" : `${answerRate}%`, color: "#34d399" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "14px",
                padding: "16px 18px",
              }}
            >
              <div
                style={{
                  fontFamily: "Rajdhani, sans-serif",
                  fontSize: "26px",
                  fontWeight: 700,
                  color: s.color,
                  lineHeight: 1.1,
                }}
              >
                {s.value}
              </div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "18px",
          }}
        >
          {CARDS.map((card, i) => (
            <Link
              key={card.href}
              href={card.href}
              style={{
                textDecoration: "none",
                display: "block",
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(16px)",
                transition: `opacity 0.35s ease ${i * 80}ms, transform 0.35s ease ${i * 80}ms`,
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div
                style={{
                  background: hovered === i ? card.accentBg : "rgba(255,255,255,0.03)",
                  border: `1px solid ${hovered === i ? card.hoverBorder : card.border}`,
                  borderRadius: "18px",
                  padding: "24px 22px 20px",
                  height: "100%",
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  transition: "background 0.2s, border-color 0.2s, box-shadow 0.2s",
                  boxShadow: hovered === i ? `0 8px 32px ${card.accentBg}` : "none",
                  cursor: "pointer",
                  position: "relative",
                }}
              >
                {/* Pending badge on unanswered card */}
                {card.href.includes("unanswered") &&
                  stats &&
                  stats.pendingUnanswered > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        top: "16px",
                        right: "16px",
                        background: "#f87171",
                        color: "#fff",
                        fontSize: "11px",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "20px",
                      }}
                    >
                      {stats.pendingUnanswered} pending
                    </div>
                  )}

                <div
                  style={{
                    width: "46px",
                    height: "46px",
                    borderRadius: "12px",
                    background: card.accentBg,
                    border: `1px solid ${card.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "22px",
                    flexShrink: 0,
                    transform: hovered === i ? "scale(1.08)" : "scale(1)",
                    transition: "transform 0.2s",
                  }}
                >
                  {card.icon}
                </div>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: "Rajdhani, sans-serif",
                      fontSize: "18px",
                      fontWeight: 700,
                      color: hovered === i ? card.accent : "#fff",
                      marginBottom: "6px",
                      transition: "color 0.2s",
                    }}
                  >
                    {card.title}
                  </div>
                  <p
                    style={{
                      fontSize: "12.5px",
                      color: "rgba(255,255,255,0.5)",
                      lineHeight: "1.6",
                      margin: 0,
                    }}
                  >
                    {card.desc}
                  </p>
                </div>

                <div
                  style={{
                    fontSize: "12.5px",
                    fontWeight: 700,
                    color: card.accent,
                    opacity: hovered === i ? 1 : 0.6,
                    transform: hovered === i ? "translateX(4px)" : "translateX(0)",
                    transition: "opacity 0.2s, transform 0.2s",
                  }}
                >
                  {card.action}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

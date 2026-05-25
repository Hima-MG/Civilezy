"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// ── Card definitions ───────────────────────────────────────────────────────────
const CARDS = [
  {
    href:    "/admin/support",
    icon:    "🛠️",
    title:   "Technical Support",
    desc:    "View and manage student support tickets. Update statuses, reply to students, and resolve issues.",
    accent:  "#60a5fa",
    accentBg:"rgba(96,165,250,0.10)",
    border:  "rgba(96,165,250,0.22)",
    hoverBorder: "rgba(96,165,250,0.45)",
    action:  "Open Support →",
  },
  {
    href:    "/admin/announcements",
    icon:    "📣",
    title:   "Announcements",
    desc:    "Create and publish exam notifications, result alerts, and important updates shown to all students.",
    accent:  "#fb923c",
    accentBg:"rgba(251,146,60,0.10)",
    border:  "rgba(251,146,60,0.22)",
    hoverBorder: "rgba(251,146,60,0.45)",
    action:  "Manage Announcements →",
  },
  {
    href:    "/admin/questions",
    icon:    "📚",
    title:   "Questions Manager",
    desc:    "Add, edit, publish, and organise MCQ question banks across all domains, subjects and difficulty levels.",
    accent:  "#34d399",
    accentBg:"rgba(52,211,153,0.10)",
    border:  "rgba(52,211,153,0.22)",
    hoverBorder: "rgba(52,211,153,0.45)",
    action:  "Manage Questions →",
  },
  {
    href:    "/admin/ebooks",
    icon:    "📖",
    title:   "E-Book Manager",
    desc:    "Add, edit, publish, and feature e-books in the marketplace. Manage cover images, pricing, modules and more.",
    accent:  "#a78bfa",
    accentBg:"rgba(167,139,250,0.10)",
    border:  "rgba(167,139,250,0.22)",
    hoverBorder: "rgba(167,139,250,0.45)",
    action:  "Manage E-Books →",
  },
  {
    href:    "/admin/blogs",
    icon:    "📰",
    title:   "Blog Manager",
    desc:    "Create, edit, and publish blog posts. Manage categories, featured images, SEO metadata, and view analytics.",
    accent:  "#38bdf8",
    accentBg:"rgba(56,189,248,0.10)",
    border:  "rgba(56,189,248,0.22)",
    hoverBorder: "rgba(56,189,248,0.45)",
    action:  "Manage Blogs →",
  },
] as const;

export default function AdminHomePage() {
  // Track which card is hovered for smooth border transition
  const [hovered, setHovered] = useState<number | null>(null);

  // Animate cards on mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div style={{
      minHeight: "calc(100vh - 56px)", // subtract header height
      background: "#060D1A",
      padding: "40px 24px 60px",
      fontFamily: "Nunito, sans-serif",
    }}>

      {/* ── Welcome header ── */}
      <div style={{ maxWidth: "860px", margin: "0 auto", marginBottom: "44px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "10px" }}>
          <div style={{
            width: "48px", height: "48px", borderRadius: "14px",
            background: "linear-gradient(135deg,#FF6200,#FF8534)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "24px", flexShrink: 0,
            boxShadow: "0 6px 20px rgba(255,98,0,0.35)",
          }}>⚙️</div>
          <div>
            <h1 style={{
              fontFamily: "Rajdhani, sans-serif",
              fontSize: "30px", fontWeight: 700, color: "#fff",
              margin: 0, lineHeight: 1.1,
            }}>
              CivilEzy Admin
            </h1>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", margin: 0, marginTop: "3px" }}>
              Select a section to get started
            </p>
          </div>
        </div>

        {/* Thin divider */}
        <div style={{
          height: "1px",
          background: "linear-gradient(90deg, rgba(255,98,0,0.35), rgba(255,255,255,0.04) 70%)",
          marginTop: "24px",
        }} />
      </div>

      {/* ── Navigation cards ── */}
      <div style={{
        maxWidth: "860px", margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "20px",
      }}>
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
            <div style={{
              background: hovered === i ? card.accentBg : "rgba(255,255,255,0.03)",
              border: `1px solid ${hovered === i ? card.hoverBorder : card.border}`,
              borderRadius: "20px",
              padding: "28px 24px 24px",
              height: "100%",
              boxSizing: "border-box",
              display: "flex", flexDirection: "column", gap: "14px",
              transition: "background 0.2s, border-color 0.2s, box-shadow 0.2s",
              boxShadow: hovered === i ? `0 8px 32px ${card.accentBg}` : "none",
              cursor: "pointer",
            }}>

              {/* Icon */}
              <div style={{
                width: "52px", height: "52px", borderRadius: "14px",
                background: card.accentBg,
                border: `1px solid ${card.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "26px", flexShrink: 0,
                transition: "transform 0.2s",
                transform: hovered === i ? "scale(1.08)" : "scale(1)",
              }}>
                {card.icon}
              </div>

              {/* Text */}
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: "Rajdhani, sans-serif",
                  fontSize: "20px", fontWeight: 700,
                  color: hovered === i ? card.accent : "#fff",
                  marginBottom: "8px",
                  transition: "color 0.2s",
                }}>
                  {card.title}
                </div>
                <p style={{
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.5)",
                  lineHeight: "1.65",
                  margin: 0,
                }}>
                  {card.desc}
                </p>
              </div>

              {/* Action link */}
              <div style={{
                fontSize: "13px", fontWeight: 700,
                color: card.accent,
                display: "flex", alignItems: "center", gap: "4px",
                opacity: hovered === i ? 1 : 0.6,
                transition: "opacity 0.2s, transform 0.2s",
                transform: hovered === i ? "translateX(4px)" : "translateX(0)",
              }}>
                {card.action}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Footer note ── */}
      <div style={{
        maxWidth: "860px", margin: "48px auto 0",
        display: "flex", alignItems: "center", gap: "8px",
        padding: "14px 18px", borderRadius: "12px",
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}>
        <span style={{ fontSize: "16px" }}>🔒</span>
        <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", lineHeight: "1.5" }}>
          Admin session is protected by passphrase and expires when you close this browser tab.
          Use the <strong style={{ color: "rgba(255,255,255,0.45)" }}>Logout</strong> button in the header to end the session early.
        </span>
      </div>
    </div>
  );
}

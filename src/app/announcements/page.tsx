"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { getAnnouncementsPage, type Announcement, type AnnouncementType } from "@/lib/announcements";

// ─── Type config ─────────────────────────────────────────────────────────────

const TYPE_CFG: Record<
  AnnouncementType,
  { label: string; icon: string; accent: string; bg: string; border: string; badge: string }
> = {
  exam: {
    label:  "Exam",
    icon:   "🚨",
    accent: "#ef4444",
    bg:     "rgba(239,68,68,0.07)",
    border: "rgba(239,68,68,0.25)",
    badge:  "rgba(239,68,68,0.15)",
  },
  result: {
    label:  "Result",
    icon:   "🔥",
    accent: "#10b981",
    bg:     "rgba(16,185,129,0.07)",
    border: "rgba(16,185,129,0.25)",
    badge:  "rgba(16,185,129,0.15)",
  },
  achievement: {
    label:  "Achievement",
    icon:   "🎉",
    accent: "#f59e0b",
    bg:     "rgba(245,158,11,0.07)",
    border: "rgba(245,158,11,0.25)",
    badge:  "rgba(245,158,11,0.15)",
  },
  update: {
    label:  "Update",
    icon:   "📢",
    accent: "#3b82f6",
    bg:     "rgba(59,130,246,0.07)",
    border: "rgba(59,130,246,0.25)",
    badge:  "rgba(59,130,246,0.15)",
  },
};

type FilterKey = "all" | AnnouncementType;

const FILTERS: { key: FilterKey; label: string; icon: string }[] = [
  { key: "all",         label: "All",          icon: "📋" },
  { key: "exam",        label: "Exams",        icon: "🚨" },
  { key: "result",      label: "Results",      icon: "🔥" },
  { key: "achievement", label: "Achievements", icon: "🎉" },
  { key: "update",      label: "Updates",      icon: "📢" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(ts: { toMillis: () => number } | undefined | null): string {
  if (!ts) return "";
  return new Date(ts.toMillis()).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function AnnouncementCard({ ann }: { ann: Announcement }) {
  const cfg = TYPE_CFG[ann.type] ?? TYPE_CFG.update;
  const date = formatDate(ann.createdAt);

  return (
    <article
      style={{
        background:   `linear-gradient(135deg, ${cfg.bg}, rgba(255,255,255,0.02))`,
        border:       `1px solid ${cfg.border}`,
        borderRadius: "16px",
        padding:      "20px 22px",
        display:      "flex",
        flexDirection:"column",
        gap:          "10px",
        transition:   "transform 0.2s ease, box-shadow 0.2s ease",
        cursor:       ann.link ? "pointer" : "default",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform  = "translateY(-2px)";
        (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 28px ${cfg.bg.replace("0.07", "0.18")}`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform  = "translateY(0)";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      {/* ── Header row ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
        {/* Type badge */}
        <span style={{
          display:       "inline-flex",
          alignItems:    "center",
          gap:           "5px",
          background:    cfg.badge,
          border:        `1px solid ${cfg.border}`,
          borderRadius:  "20px",
          padding:       "3px 10px",
          fontSize:      "11px",
          fontWeight:    800,
          color:         cfg.accent,
          letterSpacing: "0.06em",
          fontFamily:    "Rajdhani, sans-serif",
          flexShrink:    0,
        }}>
          <span aria-hidden>{cfg.icon}</span>
          {cfg.label.toUpperCase()}
        </span>

        {/* Date */}
        {date && (
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", fontFamily: "Nunito, sans-serif", whiteSpace: "nowrap" }}>
            {date}
          </span>
        )}
      </div>

      {/* ── Title ── */}
      <h2 style={{
        fontFamily: "Rajdhani, sans-serif",
        fontSize:   "clamp(1rem, 2.5vw, 1.2rem)",
        fontWeight: 700,
        color:      "#fff",
        lineHeight: 1.3,
        margin:     0,
      }}>
        {ann.title}
      </h2>

      {/* ── Description ── */}
      {ann.description && (
        <p style={{
          fontSize:   "14px",
          color:      "rgba(255,255,255,0.58)",
          lineHeight: 1.65,
          margin:     0,
          fontFamily: "Nunito, sans-serif",
        }}>
          {ann.description}
        </p>
      )}

      {/* ── Link CTA ── */}
      {ann.link && (
        <div style={{ marginTop: "4px" }}>
          <a
            href={ann.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display:        "inline-flex",
              alignItems:     "center",
              gap:            "6px",
              background:     cfg.bg,
              border:         `1px solid ${cfg.border}`,
              borderRadius:   "10px",
              padding:        "7px 14px",
              fontSize:       "13px",
              fontWeight:     700,
              color:          cfg.accent,
              textDecoration: "none",
              fontFamily:     "Nunito, sans-serif",
              transition:     "background 0.18s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = cfg.border)}
            onMouseLeave={(e) => (e.currentTarget.style.background = cfg.bg)}
          >
            View Details <span aria-hidden>→</span>
          </a>
        </div>
      )}
    </article>
  );
}

function EmptyState({ filter }: { filter: FilterKey }) {
  const label = FILTERS.find((f) => f.key === filter)?.label ?? "announcements";
  return (
    <div style={{ textAlign: "center", padding: "60px 20px", color: "rgba(255,255,255,0.3)" }}>
      <div style={{ fontSize: "3rem", marginBottom: "12px" }}>📭</div>
      <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "15px" }}>
        No {label.toLowerCase()} at the moment.
      </p>
      <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "13px", marginTop: "4px" }}>
        Check back soon — we post updates regularly.
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AnnouncementsPage() {
  const [items,   setItems]   = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);
  const [filter,  setFilter]  = useState<FilterKey>("all");

  useEffect(() => {
    getAnnouncementsPage()
      .then((data) => { setItems(data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  // Count per type for filter badge
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: items.length };
    for (const ann of items) c[ann.type] = (c[ann.type] ?? 0) + 1;
    return c;
  }, [items]);

  const filtered = filter === "all" ? items : items.filter((a) => a.type === filter);

  return (
    <main style={{ background: "var(--navy)", color: "#fff", minHeight: "100vh", paddingBottom: "80px" }}>

      {/* ── Hero header ─────────────────────────────────────────────────── */}
      <div style={{
        background:  "linear-gradient(160deg, #040C18 0%, #0B1E3D 100%)",
        padding:     "72px 5% 56px",
        textAlign:   "center",
        borderBottom:"1px solid rgba(255,98,0,0.12)",
      }}>
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <span style={{
            display:      "inline-flex",
            alignItems:   "center",
            gap:          "6px",
            background:   "rgba(255,98,0,0.12)",
            border:       "1px solid rgba(255,98,0,0.25)",
            borderRadius: "100px",
            padding:      "4px 14px",
            fontSize:     "12px",
            fontWeight:   600,
            color:        "#FF8534",
            marginBottom: "18px",
            fontFamily:   "Nunito, sans-serif",
          }}>
            <span aria-hidden>📣</span> Live Updates
          </span>

          <h1 style={{
            fontFamily:  "Rajdhani, sans-serif",
            fontSize:    "clamp(2rem, 5vw, 3rem)",
            fontWeight:  700,
            color:       "#fff",
            lineHeight:  1.15,
            marginBottom:"14px",
          }}>
            Kerala PSC{" "}
            <span style={{ color: "#FF6200" }}>Announcements</span>
          </h1>

          <p style={{
            color:      "rgba(255,255,255,0.55)",
            fontSize:   "1rem",
            lineHeight: 1.7,
            fontFamily: "Nunito, sans-serif",
            margin:     0,
          }}>
            Stay ahead with the latest exam notifications, results, and updates
            for Kerala PSC Civil Engineering aspirants.
          </p>

          {/* Back link */}
          <div style={{ marginTop: "24px" }}>
            <Link href="/" style={{
              display:        "inline-flex",
              alignItems:     "center",
              gap:            "6px",
              color:          "rgba(255,255,255,0.4)",
              fontSize:       "13px",
              fontFamily:     "Nunito, sans-serif",
              textDecoration: "none",
              transition:     "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#FF8534")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
            >
              <span aria-hidden>←</span> Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* ── Filter tabs ─────────────────────────────────────────────────── */}
      <div style={{
        position:   "sticky",
        top:        "70px",
        zIndex:     10,
        background: "rgba(11,30,61,0.95)",
        backdropFilter: "blur(12px)",
        borderBottom:   "1px solid rgba(255,255,255,0.07)",
        padding:    "0 5%",
      }}>
        <div style={{
          maxWidth:       "900px",
          margin:         "0 auto",
          display:        "flex",
          gap:            "4px",
          overflowX:      "auto",
          scrollbarWidth: "none",
          padding:        "10px 0",
        }}>
          {FILTERS.map(({ key, label, icon }) => {
            const count   = counts[key] ?? 0;
            const active  = filter === key;
            const hasItems = count > 0 || key === "all";
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                disabled={!hasItems && !loading}
                style={{
                  display:        "inline-flex",
                  alignItems:     "center",
                  gap:            "6px",
                  padding:        "7px 14px",
                  borderRadius:   "10px",
                  border:         active ? "1px solid rgba(255,98,0,0.4)" : "1px solid rgba(255,255,255,0.08)",
                  background:     active ? "rgba(255,98,0,0.12)" : "transparent",
                  color:          active ? "#FF8534" : "rgba(255,255,255,0.55)",
                  fontSize:       "13px",
                  fontWeight:     active ? 700 : 500,
                  fontFamily:     "Nunito, sans-serif",
                  cursor:         hasItems || loading ? "pointer" : "default",
                  whiteSpace:     "nowrap",
                  transition:     "all 0.18s ease",
                  opacity:        !hasItems && !loading ? 0.35 : 1,
                  touchAction:    "manipulation",
                }}
                onMouseEnter={(e) => {
                  if (!active) (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  if (!active) (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.55)";
                }}
              >
                <span aria-hidden>{icon}</span>
                {label}
                {count > 0 && (
                  <span style={{
                    background:   active ? "rgba(255,98,0,0.25)" : "rgba(255,255,255,0.1)",
                    borderRadius: "20px",
                    padding:      "1px 7px",
                    fontSize:     "11px",
                    fontWeight:   700,
                    color:        active ? "#FF8534" : "rgba(255,255,255,0.4)",
                  }}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 5% 0" }}>

        {/* Loading skeleton */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{
                height:       "110px",
                borderRadius: "16px",
                background:   "rgba(255,255,255,0.04)",
                border:       "1px solid rgba(255,255,255,0.07)",
                animation:    "annSkeleton 1.4s ease-in-out infinite",
              }} />
            ))}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div style={{
            textAlign:    "center",
            padding:      "48px 20px",
            background:   "rgba(239,68,68,0.06)",
            border:       "1px solid rgba(239,68,68,0.2)",
            borderRadius: "16px",
          }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>⚠️</div>
            <p style={{ color: "rgba(255,255,255,0.6)", fontFamily: "Nunito, sans-serif", fontSize: "14px" }}>
              Failed to load announcements. Please check your connection and refresh.
            </p>
            <button
              onClick={() => { setError(false); setLoading(true); getAnnouncementsPage().then(setItems).catch(() => setError(true)).finally(() => setLoading(false)); }}
              style={{ marginTop: "16px", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", color: "#ef4444", padding: "8px 20px", cursor: "pointer", fontFamily: "Nunito, sans-serif", fontSize: "13px", fontWeight: 700 }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Cards */}
        {!loading && !error && (
          <>
            {filtered.length === 0 ? (
              <EmptyState filter={filter} />
            ) : (
              <>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", fontFamily: "Nunito, sans-serif", marginBottom: "16px" }}>
                  {filtered.length} announcement{filtered.length !== 1 ? "s" : ""}
                  {filter !== "all" && ` · ${FILTERS.find((f) => f.key === filter)?.label}`}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {filtered.map((ann) => (
                    <AnnouncementCard key={ann.id} ann={ann} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes annSkeleton {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 0.7; }
        }
        @media (max-width: 600px) {
          .ann-card-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}

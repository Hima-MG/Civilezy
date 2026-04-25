"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getActiveAnnouncements,
  type Announcement,
  type AnnouncementType,
} from "@/lib/announcements";
import { useAnnouncementBar } from "@/contexts/AnnouncementContext";

const BAR_HEIGHT  = 46;
const DISMISS_KEY = "civilezy_ann_dismissed_at";
const DISMISS_TTL = 24 * 60 * 60 * 1000;

const TYPE_CFG: Record<
  AnnouncementType,
  {
    gradient: string;
    glow:     string;
    text:     string;
    pulse:    string;
    icon:     string;
    prefix:   string;
    ctaBg:    string;
    ctaText:  string;
  }
> = {
  exam: {
    gradient: "linear-gradient(90deg, #b91c1c 0%, #dc2626 45%, #FF6200 100%)",
    glow:     "0 3px 24px rgba(220,38,38,0.55)",
    text:     "#fff",
    pulse:    "rgba(255,200,180,0.8)",
    icon:     "🚨",
    prefix:   "NEW EXAM",
    ctaBg:    "rgba(255,255,255,0.18)",
    ctaText:  "#fff",
  },
  result: {
    gradient: "linear-gradient(90deg, #065f46 0%, #059669 45%, #10b981 100%)",
    glow:     "0 3px 24px rgba(5,150,105,0.55)",
    text:     "#fff",
    pulse:    "rgba(167,243,208,0.8)",
    icon:     "🔥",
    prefix:   "RESULT OUT",
    ctaBg:    "rgba(255,255,255,0.18)",
    ctaText:  "#fff",
  },
  achievement: {
    gradient: "linear-gradient(90deg, #78350f 0%, #d97706 45%, #FFB800 100%)",
    glow:     "0 3px 24px rgba(217,119,6,0.55)",
    text:     "#1a0800",
    pulse:    "rgba(253,230,138,0.9)",
    icon:     "🎉",
    prefix:   "ACHIEVEMENT",
    ctaBg:    "rgba(0,0,0,0.18)",
    ctaText:  "#1a0800",
  },
  update: {
    gradient: "linear-gradient(90deg, #1e3a5f 0%, #1d4ed8 45%, #3b82f6 100%)",
    glow:     "0 3px 24px rgba(29,78,216,0.55)",
    text:     "#fff",
    pulse:    "rgba(147,197,253,0.8)",
    icon:     "📢",
    prefix:   "UPDATE",
    ctaBg:    "rgba(255,255,255,0.18)",
    ctaText:  "#fff",
  },
};

export default function AnnouncementBar() {
  const { setBarHeight } = useAnnouncementBar();

  const [ann,       setAnn]       = useState<Announcement | null>(null);
  const [visible,   setVisible]   = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Check 24-hour dismiss TTL
  useEffect(() => {
    try {
      const ts = localStorage.getItem(DISMISS_KEY);
      if (ts && Date.now() - parseInt(ts, 10) < DISMISS_TTL) setDismissed(true);
    } catch { /* private browsing */ }
  }, []);

  // Fetch highest-priority active announcement
  useEffect(() => {
    if (dismissed) return;
    getActiveAnnouncements()
      .then((items) => {
        if (items.length > 0) {
          setAnn(items[0]);
          setVisible(true);
          setBarHeight(BAR_HEIGHT);
        }
      })
      .catch(() => {});
  }, [dismissed, setBarHeight]);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try { localStorage.setItem(DISMISS_KEY, Date.now().toString()); } catch { /* */ }
    setVisible(false);
    setBarHeight(0);
  };

  if (!visible || !ann) return null;

  const cfg = TYPE_CFG[ann.type] ?? TYPE_CFG.update;

  const textContent = (
    <div className="ann-content" style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: 0 }}>
      {/* Pulsing dot */}
      <span style={{ position: "relative", display: "flex", flexShrink: 0 }}>
        <span className="ann-pulse-ring" style={{ position: "absolute", inset: "-3px", borderRadius: "50%", background: cfg.pulse }} />
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: cfg.text, display: "block", position: "relative", zIndex: 1 }} />
      </span>

      {/* Icon */}
      <span aria-hidden style={{ fontSize: "15px", lineHeight: 1, flexShrink: 0 }}>{cfg.icon}</span>

      {/* Prefix badge */}
      <span style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.12em", color: cfg.text, background: "rgba(255,255,255,0.22)", padding: "2px 8px", borderRadius: "20px", flexShrink: 0, fontFamily: "Rajdhani, sans-serif", whiteSpace: "nowrap" }}>
        {cfg.prefix}
      </span>

      {/* Divider */}
      <span style={{ width: "1px", height: "14px", background: "rgba(255,255,255,0.3)", flexShrink: 0 }} />

      {/* Title */}
      <span className="ann-title" style={{ fontSize: "13px", fontWeight: 700, color: cfg.text, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", fontFamily: "Nunito, sans-serif" }}>
        {ann.title}
      </span>
    </div>
  );

  return (
    <div
      role="banner"
      aria-label="Site announcement"
      style={{
        position:             "fixed",
        top:                  0,
        left:                 0,
        right:                0,
        height:               `${BAR_HEIGHT}px`,
        zIndex:               1100,
        background:           cfg.gradient,
        boxShadow:            cfg.glow,
        display:              "flex",
        alignItems:           "center",
        padding:              "0 12px",
        gap:                  "8px",
        overflow:             "hidden",
        animation:            "annSlideDown 0.4s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      {/* ── Main content — links to external URL if provided ── */}
      {ann.link ? (
        <a href={ann.link} target="_blank" rel="noopener noreferrer"
          style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", textDecoration: "none" }}>
          {textContent}
        </a>
      ) : (
        <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center" }}>
          {textContent}
        </div>
      )}

      {/* ── "View All" chip — links to /announcements ── */}
      <Link
        href="/announcements"
        className="ann-view-all"
        style={{
          fontSize:      "12px",
          fontWeight:    700,
          color:         cfg.ctaText,
          background:    cfg.ctaBg,
          border:        "1px solid rgba(255,255,255,0.25)",
          borderRadius:  "20px",
          padding:       "3px 11px",
          flexShrink:    0,
          fontFamily:    "Nunito, sans-serif",
          whiteSpace:    "nowrap",
          display:       "flex",
          alignItems:    "center",
          gap:           "4px",
          textDecoration:"none",
          transition:    "background 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.3)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = cfg.ctaBg)}
      >
        View All <span style={{ fontSize: "11px" }}>→</span>
      </Link>

      {/* ── Dismiss ── */}
      <button
        onClick={handleDismiss}
        aria-label="Dismiss announcement"
        style={{
          background:     "rgba(255,255,255,0.15)",
          border:         "1px solid rgba(255,255,255,0.25)",
          borderRadius:   "50%",
          color:          cfg.text,
          cursor:         "pointer",
          width:          "22px",
          height:         "22px",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          fontSize:       "14px",
          lineHeight:     1,
          flexShrink:     0,
          transition:     "background 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.3)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
      >
        ×
      </button>

      <style>{`
        @keyframes annSlideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }
        @keyframes annPulse {
          0%, 100% { transform: scale(1);   opacity: 0.8; }
          50%      { transform: scale(2.2); opacity: 0;   }
        }
        .ann-pulse-ring { animation: annPulse 1.6s ease-out infinite; }

        @media (max-width: 600px) {
          .ann-view-all { display: none !important; }
          .ann-title    { font-size: 12px !important; }
        }
        @media (max-width: 400px) {
          [aria-label="Site announcement"] { padding: 0 8px !important; gap: 6px !important; }
        }
      `}</style>
    </div>
  );
}

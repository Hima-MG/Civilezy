"use client";

import { useEffect, useState } from "react";
import {
  getActiveAnnouncements,
  type Announcement,
  type AnnouncementType,
} from "@/lib/announcements";
import { useAnnouncementBar } from "@/contexts/AnnouncementContext";

const BAR_HEIGHT = 40;
const ROTATE_MS  = 5000;
const DISMISS_KEY = "civilezy_ann_dismissed";

const TYPE_CFG: Record<
  AnnouncementType,
  { color: string; bg: string; border: string; icon: string; label: string }
> = {
  exam:        { color: "#FF8534", bg: "rgba(255,133,52,0.13)", border: "rgba(255,133,52,0.28)", icon: "📋", label: "EXAM" },
  result:      { color: "#22c55e", bg: "rgba(34,197,94,0.12)",  border: "rgba(34,197,94,0.28)",  icon: "🏆", label: "RESULT" },
  achievement: { color: "#FFB800", bg: "rgba(255,184,0,0.12)",  border: "rgba(255,184,0,0.28)",  icon: "⭐", label: "ACHIEVEMENT" },
};

export default function AnnouncementBar() {
  const { setBarHeight } = useAnnouncementBar();
  const [items,     setItems]     = useState<Announcement[]>([]);
  const [index,     setIndex]     = useState(0);
  const [visible,   setVisible]   = useState(false);
  const [fadeIn,    setFadeIn]    = useState(true);
  const [dismissed, setDismissed] = useState(false);

  // Check session-dismissed state
  useEffect(() => {
    if (sessionStorage.getItem(DISMISS_KEY)) setDismissed(true);
  }, []);

  // Fetch active announcements
  useEffect(() => {
    if (dismissed) return;
    getActiveAnnouncements()
      .then((data) => {
        if (data.length > 0) {
          setItems(data);
          setVisible(true);
          setBarHeight(BAR_HEIGHT);
        }
      })
      .catch(() => {});
  }, [dismissed, setBarHeight]);

  // Auto-rotate through multiple announcements
  useEffect(() => {
    if (items.length <= 1) return;
    const t = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % items.length);
        setFadeIn(true);
      }, 300);
    }, ROTATE_MS);
    return () => clearInterval(t);
  }, [items.length]);

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
    setBarHeight(0);
  };

  if (!visible || items.length === 0) return null;

  const ann = items[index];
  const cfg = TYPE_CFG[ann.type];

  const inner = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        flex: 1,
        minWidth: 0,
        opacity: fadeIn ? 1 : 0,
        transition: "opacity 0.28s ease",
      }}
    >
      <span style={{ fontSize: "13px", flexShrink: 0 }}>{cfg.icon}</span>
      <span
        style={{
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.1em",
          color: cfg.color,
          flexShrink: 0,
          fontFamily: "Rajdhani, sans-serif",
          background: `${cfg.color}22`,
          padding: "1px 7px",
          borderRadius: "20px",
          border: `1px solid ${cfg.color}44`,
        }}
      >
        {cfg.label}
      </span>
      <span
        style={{
          width: "1px",
          height: "12px",
          background: "rgba(255,255,255,0.18)",
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontSize: "13px",
          color: "rgba(255,255,255,0.92)",
          fontWeight: 500,
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          fontFamily: "Nunito, sans-serif",
        }}
      >
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
        background:           cfg.bg,
        borderBottom:         `1px solid ${cfg.border}`,
        backdropFilter:       "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        display:              "flex",
        alignItems:           "center",
        padding:              "0 16px",
        gap:                  "10px",
        animation:            "annSlideDown 0.35s ease",
      }}
    >
      {/* Left accent strip */}
      <div
        style={{
          width:        "3px",
          height:       "20px",
          background:   cfg.color,
          borderRadius: "2px",
          flexShrink:   0,
        }}
      />

      {/* Clickable content */}
      {ann.link ? (
        <a
          href={ann.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex:           1,
            minWidth:       0,
            textDecoration: "none",
            display:        "flex",
            alignItems:     "center",
            gap:            "8px",
          }}
        >
          {inner}
          <span
            style={{
              fontSize:   "11px",
              color:      cfg.color,
              fontWeight: 600,
              flexShrink: 0,
              fontFamily: "Nunito, sans-serif",
            }}
          >
            View →
          </span>
        </a>
      ) : (
        <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center" }}>
          {inner}
        </div>
      )}

      {/* Dot indicators for multiple items */}
      {items.length > 1 && (
        <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
          {items.map((_, i) => (
            <div
              key={i}
              style={{
                width:        i === index ? "16px" : "5px",
                height:       "5px",
                borderRadius: "3px",
                background:   i === index ? cfg.color : "rgba(255,255,255,0.18)",
                transition:   "width 0.3s ease, background 0.3s ease",
              }}
            />
          ))}
        </div>
      )}

      {/* Dismiss */}
      <button
        onClick={handleDismiss}
        aria-label="Dismiss announcement"
        style={{
          background:  "none",
          border:      "none",
          color:       "rgba(255,255,255,0.38)",
          cursor:      "pointer",
          fontSize:    "18px",
          lineHeight:  1,
          padding:     "2px 4px",
          flexShrink:  0,
          transition:  "color 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.38)")}
      >
        ×
      </button>

      <style>{`
        @keyframes annSlideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }
        @media (max-width: 480px) {
          [aria-label="Site announcement"] { padding: 0 10px; gap: 6px; }
        }
      `}</style>
    </div>
  );
}

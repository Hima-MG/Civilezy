"use client";

import { useEffect, useState } from "react";
import {
  getActiveAnnouncements,
  type Announcement,
  type AnnouncementType,
} from "@/lib/announcements";
import { useAnnouncementBar } from "@/contexts/AnnouncementContext";

// ─── Config ──────────────────────────────────────────────────────────────────

const BAR_HEIGHT  = 46;
const ROTATE_MS   = 6000;
const DISMISS_KEY = "civilezy_ann_dismissed_at";
const DISMISS_TTL = 24 * 60 * 60 * 1000; // re-show after 24 h

const TYPE_CFG: Record<
  AnnouncementType,
  {
    gradient:   string;
    glow:       string;
    text:       string;       // main text color
    dimText:    string;       // secondary text color
    icon:       string;
    prefix:     string;
    pulse:      string;       // pulse ring color
    ctaBg:      string;
    ctaText:    string;
  }
> = {
  exam: {
    gradient:  "linear-gradient(90deg, #b91c1c 0%, #dc2626 45%, #FF6200 100%)",
    glow:      "0 3px 24px rgba(220,38,38,0.55)",
    text:      "#fff",
    dimText:   "rgba(255,255,255,0.75)",
    icon:      "🚨",
    prefix:    "NEW EXAM",
    pulse:     "rgba(255,200,180,0.8)",
    ctaBg:     "rgba(255,255,255,0.18)",
    ctaText:   "#fff",
  },
  result: {
    gradient:  "linear-gradient(90deg, #065f46 0%, #059669 45%, #10b981 100%)",
    glow:      "0 3px 24px rgba(5,150,105,0.55)",
    text:      "#fff",
    dimText:   "rgba(255,255,255,0.75)",
    icon:      "🔥",
    prefix:    "RESULT OUT",
    pulse:     "rgba(167,243,208,0.8)",
    ctaBg:     "rgba(255,255,255,0.18)",
    ctaText:   "#fff",
  },
  achievement: {
    gradient:  "linear-gradient(90deg, #78350f 0%, #d97706 45%, #FFB800 100%)",
    glow:      "0 3px 24px rgba(217,119,6,0.55)",
    text:      "#1a0800",
    dimText:   "rgba(30,15,0,0.65)",
    icon:      "🎉",
    prefix:    "ACHIEVEMENT",
    pulse:     "rgba(253,230,138,0.9)",
    ctaBg:     "rgba(0,0,0,0.18)",
    ctaText:   "#1a0800",
  },
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function AnnouncementBar() {
  const { setBarHeight } = useAnnouncementBar();

  const [items,     setItems]     = useState<Announcement[]>([]);
  const [index,     setIndex]     = useState(0);
  const [phase,     setPhase]     = useState<"in" | "out">("in");
  const [visible,   setVisible]   = useState(false);
  const [dismissed, setDismissed] = useState(false);
  // progress bar key — changes on each rotation to restart the CSS animation
  const [progKey,   setProgKey]   = useState(0);

  // ── Check localStorage dismiss (24 h TTL) ──
  useEffect(() => {
    try {
      const ts = localStorage.getItem(DISMISS_KEY);
      if (ts && Date.now() - parseInt(ts, 10) < DISMISS_TTL) setDismissed(true);
    } catch { /* private browsing */ }
  }, []);

  // ── Fetch ──
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

  // ── Auto-rotate ──
  useEffect(() => {
    if (items.length <= 1) return;
    const t = setInterval(() => {
      // slide out
      setPhase("out");
      setTimeout(() => {
        setIndex((i) => (i + 1) % items.length);
        setProgKey((k) => k + 1);
        setPhase("in");
      }, 280);
    }, ROTATE_MS);
    return () => clearInterval(t);
  }, [items.length]);

  // ── Dismiss ──
  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try { localStorage.setItem(DISMISS_KEY, Date.now().toString()); } catch { /* */ }
    setVisible(false);
    setBarHeight(0);
  };

  if (!visible || items.length === 0) return null;

  const ann = items[index];
  const cfg = TYPE_CFG[ann.type];

  // Content block (shared between link + non-link)
  const content = (
    <div
      style={{
        display:    "flex",
        alignItems: "center",
        gap:        "10px",
        flex:       1,
        minWidth:   0,
        opacity:    phase === "in" ? 1 : 0,
        transform:  phase === "in" ? "translateY(0)" : "translateY(-7px)",
        transition: "opacity 0.25s ease, transform 0.25s ease",
      }}
    >
      {/* Pulsing live dot */}
      <span style={{ position: "relative", display: "flex", flexShrink: 0 }}>
        <span
          className="ann-pulse-ring"
          style={{
            position:     "absolute",
            inset:        "-3px",
            borderRadius: "50%",
            background:   cfg.pulse,
          }}
        />
        <span
          style={{
            width:        "8px",
            height:       "8px",
            borderRadius: "50%",
            background:   cfg.text,
            display:      "block",
            position:     "relative",
            zIndex:       1,
          }}
        />
      </span>

      {/* Icon */}
      <span
        style={{
          fontSize:   "15px",
          lineHeight: 1,
          flexShrink: 0,
        }}
        aria-hidden
      >
        {cfg.icon}
      </span>

      {/* Prefix badge */}
      <span
        style={{
          fontSize:      "10px",
          fontWeight:    800,
          letterSpacing: "0.12em",
          color:         cfg.text,
          background:    "rgba(255,255,255,0.22)",
          padding:       "2px 8px",
          borderRadius:  "20px",
          flexShrink:    0,
          fontFamily:    "Rajdhani, sans-serif",
          whiteSpace:    "nowrap",
        }}
      >
        {cfg.prefix}
      </span>

      {/* Divider */}
      <span
        style={{
          width:      "1px",
          height:     "14px",
          background: "rgba(255,255,255,0.3)",
          flexShrink: 0,
        }}
      />

      {/* Title */}
      <span
        className="ann-title"
        style={{
          fontSize:     "13px",
          fontWeight:   700,
          color:        cfg.text,
          overflow:     "hidden",
          whiteSpace:   "nowrap",
          textOverflow: "ellipsis",
          fontFamily:   "Nunito, sans-serif",
          letterSpacing: "0.01em",
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
        background:           cfg.gradient,
        boxShadow:            cfg.glow,
        display:              "flex",
        alignItems:           "center",
        padding:              "0 16px 0 12px",
        gap:                  "8px",
        overflow:             "hidden",
        animation:            "annSlideDown 0.4s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      {/* ── Entire bar is clickable if link exists ── */}
      {ann.link ? (
        <a
          href={ann.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex:           1,
            minWidth:       0,
            display:        "flex",
            alignItems:     "center",
            gap:            "8px",
            textDecoration: "none",
          }}
        >
          {content}

          {/* CTA chip */}
          <span
            className="ann-cta"
            style={{
              fontSize:      "12px",
              fontWeight:    700,
              color:         cfg.ctaText,
              background:    cfg.ctaBg,
              border:        `1px solid rgba(255,255,255,0.25)`,
              borderRadius:  "20px",
              padding:       "3px 11px",
              flexShrink:    0,
              fontFamily:    "Nunito, sans-serif",
              whiteSpace:    "nowrap",
              display:       "flex",
              alignItems:    "center",
              gap:           "4px",
              transition:    "background 0.2s",
            }}
          >
            View Details
            <span style={{ fontSize: "11px" }}>→</span>
          </span>
        </a>
      ) : (
        <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center" }}>
          {content}
        </div>
      )}

      {/* ── Dot indicators (multiple announcements) ── */}
      {items.length > 1 && (
        <div
          style={{
            display:    "flex",
            gap:        "4px",
            flexShrink: 0,
            alignItems: "center",
          }}
        >
          {items.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (i === index) return;
                setPhase("out");
                setTimeout(() => { setIndex(i); setProgKey((k) => k + 1); setPhase("in"); }, 280);
              }}
              aria-label={`Go to announcement ${i + 1}`}
              style={{
                width:        i === index ? "18px" : "6px",
                height:       "6px",
                borderRadius: "3px",
                background:   i === index ? cfg.text : "rgba(255,255,255,0.3)",
                border:       "none",
                padding:      0,
                cursor:       i === index ? "default" : "pointer",
                transition:   "width 0.3s ease, background 0.3s ease",
              }}
            />
          ))}
        </div>
      )}

      {/* ── Dismiss ── */}
      <button
        onClick={handleDismiss}
        aria-label="Dismiss announcement"
        style={{
          background:  "rgba(255,255,255,0.15)",
          border:      "1px solid rgba(255,255,255,0.25)",
          borderRadius:"50%",
          color:       cfg.text,
          cursor:      "pointer",
          width:       "22px",
          height:      "22px",
          display:     "flex",
          alignItems:  "center",
          justifyContent: "center",
          fontSize:    "14px",
          lineHeight:  1,
          flexShrink:  0,
          transition:  "background 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.3)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
      >
        ×
      </button>

      {/* ── Progress bar (rotation timer) ── */}
      {items.length > 1 && (
        <div
          key={progKey}
          style={{
            position:   "absolute",
            bottom:     0,
            left:       0,
            height:     "2px",
            background: "rgba(255,255,255,0.5)",
            animation:  `annProgress ${ROTATE_MS}ms linear forwards`,
          }}
        />
      )}

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes annSlideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }
        @keyframes annProgress {
          from { width: 0%; }
          to   { width: 100%; }
        }
        @keyframes annPulse {
          0%, 100% { transform: scale(1);   opacity: 0.8; }
          50%      { transform: scale(2.2); opacity: 0;   }
        }
        .ann-pulse-ring {
          animation: annPulse 1.6s ease-out infinite;
        }

        /* ── Mobile tweaks ── */
        @media (max-width: 600px) {
          .ann-cta { display: none !important; }
          .ann-title { font-size: 12px !important; }
        }
        @media (max-width: 400px) {
          [aria-label="Site announcement"] { padding: 0 10px 0 8px !important; gap: 6px !important; }
        }
      `}</style>
    </div>
  );
}

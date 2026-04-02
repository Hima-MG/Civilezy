"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const LMS_FREE_TEST = "https://lms.civilezy.com/free-test";

export default function StickyCTA() {
  const router          = useRouter();
  const [visible, setVisible]   = useState(false);   // slide-up after mount
  const [hidden,  setHidden]    = useState(false);   // hide when user scrolls near top
  const lastScrollY             = useRef(0);

  // 1. Slide up after a short delay on mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(t);
  }, []);

  // 2. Hide when user is near the very top (hero CTA is visible)
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      // hide when within 80px of top, show once user scrolls past hero
      setHidden(y < 80);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // run once on mount
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const shouldShow = visible && !hidden;

  return (
    <>
      <div
        role="complementary"
        aria-label="Quick access CTA"
        style={{
          position:             "fixed",
          bottom:               0,
          left:                 0,
          right:                0,
          zIndex:               900,
          /* slide-up transition */
          transform:            shouldShow ? "translateY(0)" : "translateY(110%)",
          opacity:              shouldShow ? 1 : 0,
          transition:           "transform 0.45s cubic-bezier(0.16,1,0.3,1), opacity 0.35s ease",
          /* glassmorphism */
          background:           "rgba(8, 15, 30, 0.88)",
          backdropFilter:       "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderTop:            "1px solid rgba(255, 98, 0, 0.25)",
          /* inner glow line at top */
          boxShadow:            "0 -1px 0 rgba(255,98,0,0.08), 0 -20px 60px rgba(0,0,0,0.4)",
          padding:              "14px 5%",
        }}
      >
        {/* Inner layout */}
        <div
          style={{
            maxWidth:       "1200px",
            margin:         "0 auto",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
            gap:            "20px",
          }}
          className="sticky-cta-inner"
        >
          {/* ── Left: text ─────────────────────────────────────── */}
          <div className="sticky-cta-text" style={{ flexShrink: 0 }}>
            {/* Live indicator dot */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
              <span style={{
                width:        "7px",
                height:       "7px",
                borderRadius: "50%",
                background:   "#32C864",
                display:      "inline-block",
                flexShrink:   0,
                animation:    "stickyPulse 2s infinite",
              }} />
              <span style={{ fontSize: "11px", color: "#32C864", fontWeight: 700, letterSpacing: "0.5px" }}>
                247 students online now
              </span>
            </div>
            <div style={{
              fontFamily:  "Rajdhani, sans-serif",
              fontSize:    "18px",
              fontWeight:  700,
              color:       "#ffffff",
              lineHeight:  1.2,
            }}>
              Start your PSC Civil Engineering preparation today
            </div>
            <div style={{
              fontSize: "13px",
              color:    "rgba(255,255,255,0.45)",
              marginTop:"2px",
            }}>
              Join thousands of students using Civilezy
            </div>
          </div>

          {/* ── Right: buttons ─────────────────────────────────── */}
          <div
            className="sticky-cta-buttons"
            style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}
          >
            {/* Secondary: Game Arena */}
            <button
              onClick={() => router.push("/game-arena")}
              style={{
                display:      "inline-flex",
                alignItems:   "center",
                gap:          "7px",
                background:   "rgba(255,255,255,0.06)",
                border:       "1px solid rgba(255,255,255,0.15)",
                color:        "rgba(255,255,255,0.85)",
                padding:      "10px 20px",
                borderRadius: "50px",
                fontFamily:   "Nunito, sans-serif",
                fontSize:     "14px",
                fontWeight:   700,
                cursor:       "pointer",
                transition:   "background 0.2s, border-color 0.2s",
                whiteSpace:   "nowrap",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget;
                el.style.background   = "rgba(255,98,0,0.12)";
                el.style.borderColor  = "rgba(255,98,0,0.4)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget;
                el.style.background   = "rgba(255,255,255,0.06)";
                el.style.borderColor  = "rgba(255,255,255,0.15)";
              }}
            >
              🎮 Play Game Arena
            </button>

            {/* Primary: Start Free Test */}
            <a
              href={LMS_FREE_TEST}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display:        "inline-flex",
                alignItems:     "center",
                gap:            "7px",
                background:     "linear-gradient(135deg, #FF6200, #FF4500)",
                color:          "white",
                border:         "none",
                padding:        "11px 26px",
                borderRadius:   "50px",
                fontFamily:     "Nunito, sans-serif",
                fontSize:       "15px",
                fontWeight:     800,
                cursor:         "pointer",
                boxShadow:      "0 4px 20px rgba(255,98,0,0.45)",
                transition:     "transform 0.2s, box-shadow 0.2s",
                whiteSpace:     "nowrap",
                textDecoration: "none",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget;
                el.style.transform = "translateY(-2px)";
                el.style.boxShadow = "0 8px 28px rgba(255,98,0,0.6)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget;
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "0 4px 20px rgba(255,98,0,0.45)";
              }}
            >
              🚀 Start Free Test
            </a>
          </div>
        </div>
      </div>

      {/* ── Keyframes + responsive (no apostrophes → no hydration issue) ── */}
      <style>{`
        @keyframes stickyPulse {
          0%, 100% { opacity: 1; transform: scale(1);   }
          50%       { opacity: 0.5; transform: scale(0.75); }
        }

        /* Mobile: stack layout */
        @media (max-width: 640px) {
          .sticky-cta-inner {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 12px !important;
          }
          .sticky-cta-buttons {
            width: 100%;
            flex-direction: column !important;
            gap: 8px !important;
          }
          .sticky-cta-buttons a,
          .sticky-cta-buttons button {
            width: 100% !important;
            justify-content: center !important;
          }
          .sticky-cta-text div:first-child {
            font-size: 15px !important;
          }
        }

        /* Tablet: keep side-by-side but tighten text */
        @media (max-width: 900px) and (min-width: 641px) {
          .sticky-cta-text div:nth-child(2) {
            font-size: 15px !important;
          }
        }
      `}</style>
    </>
  );
}
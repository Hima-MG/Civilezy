"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { EXTERNAL_URLS } from "@/lib/constants";

const LMS_FREE_TEST = EXTERNAL_URLS.freeTest;

// ─── Stable hover handlers (module-level, never recreated) ───────────────────
const onSecondaryEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.currentTarget.style.background  = "rgba(255,98,0,0.12)";
  e.currentTarget.style.borderColor = "rgba(255,98,0,0.4)";
};
const onSecondaryLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.currentTarget.style.background  = "rgba(255,255,255,0.06)";
  e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
};
const onPrimaryEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.transform = "translateY(-2px)";
  e.currentTarget.style.boxShadow = "0 8px 28px rgba(255,98,0,0.6)";
};
const onPrimaryLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.transform = "translateY(0)";
  e.currentTarget.style.boxShadow = "0 4px 20px rgba(255,98,0,0.45)";
};

// ─── Component ──────────────────────────────────────────────────────────────
export default function StickyCTA() {
  const router   = useRouter();
  const pathname = usePathname();

  const [visible, setVisible] = useState(false);
  const [hidden,  setHidden]  = useState(false);

  // Suppress entirely on game-arena — buttons there must never be blocked
  const isGameArena = pathname === "/game-arena";

  // Delay initial appearance
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(t);
  }, []);

  // Hide when near top of page (no previous scroll reference needed)
  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY < 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // run once on mount
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (isGameArena) return null;

  const shouldShow = visible && !hidden;

  return (
    <>
      <div
        role="region"
        aria-label="Start your free Kerala PSC preparation"
        style={{
          position:             "fixed",
          bottom:               0,
          left:                 0,
          right:                0,
          zIndex:               900,
          transform:            shouldShow ? "translateY(0)" : "translateY(110%)",
          opacity:              shouldShow ? 1 : 0,
          transition:           "transform 0.45s cubic-bezier(0.16,1,0.3,1), opacity 0.35s ease",
          background:           "rgba(8,15,30,0.88)",
          backdropFilter:       "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderTop:            "1px solid rgba(255,98,0,0.25)",
          boxShadow:            "0 -1px 0 rgba(255,98,0,0.08), 0 -20px 60px rgba(0,0,0,0.4)",
          padding:              "14px 5%",
        }}
      >
        <div
          style={{ maxWidth:"1200px", margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"20px" }}
          className="sticky-cta-inner"
        >
          {/* ── Left: text ── */}
          <div className="sticky-cta-text" style={{ flexShrink:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"3px" }}>
              {/* Decorative live dot — aria-hidden */}
              <span
                aria-hidden="true"
                style={{ width:"7px", height:"7px", borderRadius:"50%", background:"#32C864", display:"inline-block", flexShrink:0, animation:"stickyPulse 2s infinite" }}
              />
              <span style={{ fontSize:"11px", color:"#32C864", fontWeight:700, letterSpacing:"0.5px" }}>
                5,200+ students preparing right now
              </span>
            </div>
            <div style={{ fontFamily:"Rajdhani, sans-serif", fontSize:"18px", fontWeight:700, color:"#ffffff", lineHeight:1.2 }}>
              98+ rank holders started here for free
            </div>
            {/* Trust signals — ✓ is decorative punctuation */}
            <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.45)", marginTop:"2px", margin:"2px 0 0" }}
               aria-label="No sign-up required. Kerala PSC-specific. Free forever."
            >
              <span aria-hidden="true">✓</span> No sign-up &nbsp;·&nbsp;
              <span aria-hidden="true">✓</span> Kerala PSC-specific &nbsp;·&nbsp;
              <span aria-hidden="true">✓</span> Free forever
            </p>
          </div>

          {/* ── Right: buttons ── */}
          <div
            className="sticky-cta-buttons"
            style={{ display:"flex", alignItems:"center", gap:"12px", flexShrink:0 }}
          >
            {/* Secondary */}
            <button
              onClick={() => router.push("/game-arena")}
              aria-label="Go to Game Arena practice mode"
              style={{ display:"inline-flex", alignItems:"center", gap:"7px", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.15)", color:"rgba(255,255,255,0.85)", padding:"10px 20px", borderRadius:"50px", fontFamily:"Nunito, sans-serif", fontSize:"14px", fontWeight:700, cursor:"pointer", transition:"background 0.2s, border-color 0.2s", whiteSpace:"nowrap" }}
              onMouseEnter={onSecondaryEnter}
              onMouseLeave={onSecondaryLeave}
            >
              <span aria-hidden="true">🎮</span> Play Game Arena
            </button>

            {/* Primary */}
            <a
              href={LMS_FREE_TEST}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Sign up for 48 hour free demo — opens in new tab"
              style={{ display:"inline-flex", alignItems:"center", gap:"7px", background:"linear-gradient(135deg,#FF6200,#FF4500)", color:"white", border:"none", padding:"11px 26px", borderRadius:"50px", fontFamily:"Nunito, sans-serif", fontSize:"15px", fontWeight:800, cursor:"pointer", boxShadow:"0 4px 20px rgba(255,98,0,0.45)", transition:"transform 0.2s, box-shadow 0.2s", whiteSpace:"nowrap", textDecoration:"none" }}
              onMouseEnter={onPrimaryEnter}
              onMouseLeave={onPrimaryLeave}
            >
              <span aria-hidden="true">🚀</span> 48 Hr Free Demo
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes stickyPulse {
          0%, 100% { opacity: 1; transform: scale(1);    }
          50%       { opacity: 0.5; transform: scale(0.75); }
        }

        @media (max-width: 640px) {
          .sticky-cta-inner   { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
          .sticky-cta-buttons { width: 100%; flex-direction: column !important; gap: 8px !important; }
          .sticky-cta-buttons a,
          .sticky-cta-buttons button { width: 100% !important; justify-content: center !important; }
          .sticky-cta-text div:first-child { font-size: 15px !important; }
        }

        @media (max-width: 900px) and (min-width: 641px) {
          .sticky-cta-text div:nth-child(2) { font-size: 15px !important; }
        }
      `}</style>
    </>
  );
}
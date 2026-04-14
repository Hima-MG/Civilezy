"use client";

import { EXTERNAL_URLS } from "@/lib/constants";

// ─── URL Constants ──────────────────────────────────────────────────────────
const LMS_FREE_TEST = EXTERNAL_URLS.freeTest;

const WA_LINK = EXTERNAL_URLS.telegram; 

// ─── Stable hover handlers (defined once, not re-created per render) ─────────
function onPrimaryEnter(e: React.MouseEvent<HTMLAnchorElement>) {
  e.currentTarget.style.transform = "translateY(-3px)";
  e.currentTarget.style.boxShadow = "0 12px 40px rgba(255,98,0,0.6)";
}
function onPrimaryLeave(e: React.MouseEvent<HTMLAnchorElement>) {
  e.currentTarget.style.transform = "translateY(0)";
  e.currentTarget.style.boxShadow = "0 6px 30px rgba(255,98,0,0.5)";
}
function onSecondaryEnter(e: React.MouseEvent<HTMLAnchorElement>) {
  e.currentTarget.style.borderColor = "#FF6200";
  e.currentTarget.style.background  = "rgba(255,98,0,0.1)";
}
function onSecondaryLeave(e: React.MouseEvent<HTMLAnchorElement>) {
  e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
  e.currentTarget.style.background  = "transparent";
}

// ─── Component ──────────────────────────────────────────────────────────────
export default function FinalCTASection() {
  return (
    <section
      aria-labelledby="final-cta-heading"
      style={{
        textAlign:  "center",
        background: "linear-gradient(180deg, #0B1E3D 0%, #05101F 100%)",
        padding:    "80px 5%",
        position:   "relative",
        overflow:   "hidden",
      }}
    >
      {/* Decorative glow — hidden from assistive tech */}
      <div
        aria-hidden="true"
        style={{
          position:      "absolute",
          top:           "50%",
          left:          "50%",
          transform:     "translate(-50%, -50%)",
          width:         "600px",
          height:        "600px",
          borderRadius:  "50%",
          background:    "radial-gradient(circle, rgba(255,98,0,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position:"relative", zIndex:1, maxWidth:"700px", margin:"0 auto" }}>

        {/* Malayalam decorative line — NOT a heading, screen readers
            will read it with lang="ml" for correct pronunciation       */}
        <p
          lang="ml"
          aria-hidden="false"
          style={{
            fontFamily:           "Rajdhani, sans-serif",
            fontSize:             "clamp(24px, 4vw, 48px)",
            fontWeight:           700,
            background:           "linear-gradient(135deg, #FF6200, #FFB800)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor:  "transparent",
            backgroundClip:       "text",
            marginBottom:         "12px",
          }}
        >
          ഇനി ആശയക്കുഴപ്പം വേണ്ട.
        </p>

        {/* Primary heading — h2 fits within page hierarchy below h1 in Hero */}
        <h2
          id="final-cta-heading"
          style={{
            fontFamily:   "Rajdhani, sans-serif",
            fontSize:     "clamp(20px, 3vw, 36px)",
            fontWeight:   700,
            color:        "#ffffff",
            marginBottom: "16px",
          }}
        >
          Your Rank is Waiting.<br />Start Today.
        </h2>

        {/* Subtext */}
        <p
          style={{
            fontSize:     "17px",
            color:        "rgba(255,255,255,0.85)",
            marginBottom: "40px",
            lineHeight:   1.7,
          }}
        >
          Take a free mock test right now. See exactly where you stand. Then decide.
          No registration, no payment needed to start.
        </p>

        {/* CTA Buttons */}
        <div
          style={{ display:"flex", gap:"16px", justifyContent:"center", flexWrap:"wrap" }}
          role="group"
          aria-label="Call to action buttons"
        >
          <a
            href={LMS_FREE_TEST}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Sign up for 48 hour free demo — opens in new tab"
            style={{
              background:     "linear-gradient(135deg, #FF6200, #FF4500)",
              color:          "white",
              border:         "none",
              padding:        "18px 40px",
              borderRadius:   "50px",
              fontFamily:     "Nunito, sans-serif",
              fontSize:       "19px",
              fontWeight:     800,
              cursor:         "pointer",
              boxShadow:      "0 6px 30px rgba(255,98,0,0.5)",
              transition:     "transform 0.2s, box-shadow 0.2s",
              textDecoration: "none",
              display:        "inline-block",
            }}
            onMouseEnter={onPrimaryEnter}
            onMouseLeave={onPrimaryLeave}
          >
            🚀 Sign Up for 48 Hr Free Demo
          </a>

          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Join the CivilEzy Telegram community — opens in new tab"
            style={{
              background:     "transparent",
              color:          "white",
              border:         "2px solid rgba(255,255,255,0.3)",
              padding:        "16px 28px",
              borderRadius:   "50px",
              fontFamily:     "Nunito, sans-serif",
              fontSize:       "16px",
              fontWeight:     600,
              cursor:         "pointer",
              transition:     "border-color 0.2s, background 0.2s",
              textDecoration: "none",
              display:        "inline-flex",
              alignItems:     "center",
              gap:            "8px",
            }}
            onMouseEnter={onSecondaryEnter}
            onMouseLeave={onSecondaryLeave}
          >
            📱 Join Telegram Community
          </a>
        </div>

        {/* Trust signals */}
        <p
          style={{ marginTop:"24px", fontSize:"13px", color:"rgba(255,255,255,0.55)" }}
          aria-label="CivilEzy trust guarantees"
        >
         
          ✓ Instant access &nbsp;&nbsp;
          ✓ Kerala PSC-specific &nbsp;&nbsp;
          ✓ Malayalam Audio lessons &nbsp;&nbsp;
        </p>
      </div>
    </section>
  );
}
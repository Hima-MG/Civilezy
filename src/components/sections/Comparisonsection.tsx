"use client";

// Kept as Client Component solely for row onMouseEnter/Leave hover effects.
// If you want a pure Server Component, remove the hover handlers and use
// a CSS :hover rule in globals.css instead.

// ─── Types ─────────────────────────────────────────────────────────────────
interface ComparisonRow {
  feature:    string;
  us:         string;
  usIsCheck?: boolean;
  usIsGold?:  boolean;
  them1:      string;
  them1Cross: boolean;
  them2:      string;
  them2Cross: boolean;
  isLast:     boolean;
}

// ─── Data ───────────────────────────────────────────────────────────────────
// NOTE: The "Price (Full Access)" row shows "₹1,999 one-time" — update this
// to reflect current monthly pricing (₹1,800–₹2,500) before going live.
const ROWS: ComparisonRow[] = [
  {
    feature:"Kerala PSC Pool-Based Tests",
    us:"✓ Exact pools",          usIsCheck:true,
    them1:"✗",  them1Cross:true,
    them2:"✗",  them2Cross:true,  isLast:false,
  },
  {
    feature:"Malayalam Content",
    us:"✓ Full support",          usIsCheck:true,
    them1:"✗",  them1Cross:true,
    them2:"✗",  them2Cross:true,  isLast:false,
  },
  {
    feature:"ITI / Diploma / AE Split",
    us:"✓ All 3 pools",           usIsCheck:true,
    them1:"Partial", them1Cross:false,
    them2:"✗",  them2Cross:true,  isLast:false,
  },
  {
    feature:"Department-Specific Papers (KWA, PWD)",
    us:"✓ All depts",             usIsCheck:true,
    them1:"✗",  them1Cross:true,
    them2:"✗",  them2Cross:true,  isLast:false,
  },
  {
    feature:"Gamified Learning (XP, Streaks)",
    us:"✓ Full system",           usIsCheck:true,
    them1:"Basic", them1Cross:false,
    them2:"✗",  them2Cross:true,  isLast:false,
  },
  {
    // ⚠️  Update this price to match current plans before launch
    feature:"Price (Full Access)",
    us:"From ₹1,800/mo",          usIsGold:true,
    them1:"₹5,999/yr", them1Cross:false,
    them2:"₹7,200/yr", them2Cross:false, isLast:false,
  },
  {
    feature:"Weekly Live Mentorship",
    us:"✓ Included",              usIsCheck:true,
    them1:"Paid extra", them1Cross:false,
    them2:"Paid extra", them2Cross:false, isLast:true,
  },
];

// ─── Row hover style helpers (avoids inline function creation per render) ──
const hoverOn  = (e: React.MouseEvent<HTMLDivElement>) => {
  (e.currentTarget as HTMLDivElement).style.background = "rgba(255,98,0,0.04)";
};
const hoverOff = (e: React.MouseEvent<HTMLDivElement>) => {
  (e.currentTarget as HTMLDivElement).style.background = "transparent";
};

// ─── Component ──────────────────────────────────────────────────────────────
export default function ComparisonSection() {
  return (
    <section
      aria-labelledby="comparison-heading"
      style={{ background:"#060D1A", padding:"80px 5%" }}
    >
      {/* ── Header ─────────────────────────────────────────────── */}
      <div style={{ textAlign:"center", maxWidth:"700px", margin:"0 auto 60px" }}>
        <div style={styles.tag} aria-hidden="true">WHY CIVILEZY</div>

        <h2 id="comparison-heading" style={styles.heading}>
          We&apos;re Not Just{" "}
          <span style={styles.highlight}>Different</span>
          {" "}— We&apos;re Built For You
        </h2>

        <p style={styles.sub}>
          National platforms serve 500 million students. We serve one specific
          student — a Kerala PSC Civil Engineering aspirant. That&apos;s our entire focus.
        </p>
      </div>

      {/* ── Table wrapper — overflow-x:auto for mobile scrollability ── */}
      <div
        style={{ maxWidth:"900px", margin:"0 auto", overflowX:"auto", WebkitOverflowScrolling:"touch" }}
        role="region"
        aria-label="Feature comparison between Civilezy, Testbook, and Others"
      >
        <div
          style={{ minWidth:"560px", borderRadius:"20px", overflow:"hidden", border:"1px solid rgba(255,255,255,0.08)" }}
          role="table"
          aria-label="Platform comparison table"
        >
          {/* ── Table head ── */}
          <div
            role="row"
            style={{
              display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr",
              background:"rgba(255,255,255,0.05)",
              padding:"16px 24px",
              fontFamily:"Rajdhani, sans-serif", fontSize:"18px", fontWeight:700,
              borderBottom:"1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div role="columnheader" style={{ color:"rgba(255,255,255,0.7)" }}>Feature</div>
            <div role="columnheader" style={{ color:"#FF8534" }}>Civilezy</div>
            <div role="columnheader">Testbook</div>
            <div role="columnheader">Others</div>
          </div>

          {/* ── Table rows ── */}
          {ROWS.map((row) => (
            <div
              key={row.feature}
              role="row"
              style={{
                display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr",
                padding:"14px 24px",
                borderBottom: row.isLast ? "none" : "1px solid rgba(255,255,255,0.05)",
                fontSize:"14px", alignItems:"center",
                transition:"background 0.2s",
              }}
              onMouseEnter={hoverOn}
              onMouseLeave={hoverOff}
            >
              <div role="cell" style={{ color:"rgba(255,255,255,0.85)" }}>{row.feature}</div>
              <div
                role="cell"
                style={{
                  color:      row.usIsCheck ? "#32C864" : row.usIsGold ? "#FFB800" : "#FF8534",
                  fontWeight: 700,
                }}
              >
                {row.us}
              </div>
              <div role="cell" style={{ color: row.them1Cross ? "#FF3232" : "rgba(255,255,255,0.55)" }}>
                {row.them1}
              </div>
              <div role="cell" style={{ color: row.them2Cross ? "#FF3232" : "rgba(255,255,255,0.55)" }}>
                {row.them2}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Mobile scroll hint (visible only on small screens) ── */}
      <p
        style={{ textAlign:"center", fontSize:"12px", color:"rgba(255,255,255,0.3)", marginTop:"12px" }}
        aria-hidden="true"
        className="comparison-scroll-hint"
      >
        ← Scroll to see full comparison →
      </p>

      <style>{`
        .comparison-scroll-hint { display: none; }
        @media (max-width: 640px) {
          .comparison-scroll-hint { display: block; }
        }
      `}</style>
    </section>
  );
}

// ─── Shared styles ──────────────────────────────────────────────────────────
const styles = {
  tag: {
    display:"inline-block",
    background:"rgba(255,98,0,0.15)",
    border:"1px solid rgba(255,98,0,0.3)",
    borderRadius:"20px",
    padding:"4px 16px",
    fontSize:"12px",
    fontWeight:700,
    color:"#FF8534",
    letterSpacing:"0.5px",
    marginBottom:"16px",
  } as React.CSSProperties,
  heading: {
    fontFamily:"Rajdhani, sans-serif",
    fontSize:"clamp(28px, 4vw, 44px)",
    fontWeight:700,
    lineHeight:1.2,
    marginBottom:"16px",
    color:"#ffffff",
  } as React.CSSProperties,
  highlight: {
    background:"linear-gradient(135deg, #FF6200, #FFB800)",
    WebkitBackgroundClip:"text",
    WebkitTextFillColor:"transparent",
    backgroundClip:"text",
  } as React.CSSProperties,
  sub: {
    fontSize:"17px",
    color:"rgba(255,255,255,0.85)",
    lineHeight:1.7,
    margin:0,
  } as React.CSSProperties,
} as const;
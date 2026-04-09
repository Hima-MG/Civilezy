"use client";

const ROWS = [
  {
    feature:   "Kerala PSC Pool-Based Tests",
    us:        "✓ Exact pools",
    usIsCheck: true,
    them1:     "✗",
    them1Cross:true,
    them2:     "✗",
    them2Cross:true,
    isLast:    false,
  },
  {
    feature:   "Malayalam Content",
    us:        "✓ Full support",
    usIsCheck: true,
    them1:     "✗",
    them1Cross:true,
    them2:     "✗",
    them2Cross:true,
    isLast:    false,
  },
  {
    feature:   "ITI / Diploma / AE Split",
    us:        "✓ All 3 pools",
    usIsCheck: true,
    them1:     "Partial",
    them1Cross:false,
    them2:     "✗",
    them2Cross:true,
    isLast:    false,
  },
  {
    feature:   "Department-Specific Papers (KWA, PWD)",
    us:        "✓ All depts",
    usIsCheck: true,
    them1:     "✗",
    them1Cross:true,
    them2:     "✗",
    them2Cross:true,
    isLast:    false,
  },
  {
    feature:   "Gamified Learning (XP, Streaks)",
    us:        "✓ Full system",
    usIsCheck: true,
    them1:     "Basic",
    them1Cross:false,
    them2:     "✗",
    them2Cross:true,
    isLast:    false,
  },
  {
    feature:   "Price (Full Access)",
    us:        "₹1,999 one-time",
    usIsCheck: false,
    usIsGold:  true,
    them1:     "₹5,999/yr",
    them1Cross:false,
    them2:     "₹7,200/yr",
    them2Cross:false,
    isLast:    false,
  },
  {
    feature:   "Weekly Live Mentorship",
    us:        "✓ Included",
    usIsCheck: true,
    them1:     "Paid extra",
    them1Cross:false,
    them2:     "Paid extra",
    them2Cross:false,
    isLast:    true,
  },
] as const;

export default function ComparisonSection() {
  return (
    <section style={{ background: "#060D1A", padding: "80px 5%" }}>
      {/* Header */}
      <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 60px" }}>
        <div style={styles.tag}>WHY CIVILEZY</div>
        <h2 style={styles.heading}>
          We&apos;re Not Just{" "}
          <span style={styles.highlight}>Different</span> — We&apos;re Built For You
        </h2>
        <p style={styles.sub}>
          National platforms serve 500 million students. We serve one specific student — a
          Kerala PSC Civil Engineering aspirant. That&apos;s our entire focus.
        </p>
      </div>

      {/* Table */}
      <div
        style={{
          maxWidth:     "900px",
          margin:       "0 auto",
          borderRadius: "20px",
          overflow:     "hidden",
          border:       "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Head */}
        <div
          style={{
            display:          "grid",
            gridTemplateColumns:"2fr 1fr 1fr 1fr",
            background:       "rgba(255,255,255,0.05)",
            padding:          "16px 24px",
            fontFamily:       "Rajdhani, sans-serif",
            fontSize:         "18px",
            fontWeight:       700,
            borderBottom:     "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div>Feature</div>
          <div style={{ color: "#FF8534" }}>Civilezy</div>
          <div>Testbook</div>
          <div>Unacademy</div>
        </div>

        {/* Rows */}
        {ROWS.map((row) => (
          <div
            key={row.feature}
            style={{
              display:          "grid",
              gridTemplateColumns:"2fr 1fr 1fr 1fr",
              padding:          "14px 24px",
              borderBottom:     row.isLast ? "none" : "1px solid rgba(255,255,255,0.05)",
              fontSize:         "14px",
              alignItems:       "center",
              transition:       "background 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,98,0,0.04)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            <div style={{ color: "rgba(255,255,255,0.85)" }}>{row.feature}</div>
            <div
              style={{
                color:      row.usIsCheck ? "#32C864" : row.usIsGold ? "#FFB800" : "#FF8534",
                fontWeight: 700,
              }}
            >
              {row.us}
            </div>
            <div style={{ color: row.them1Cross ? "#FF3232" : "rgba(255,255,255,0.55)" }}>
              {row.them1}
            </div>
            <div style={{ color: row.them2Cross ? "#FF3232" : "rgba(255,255,255,0.55)" }}>
              {row.them2}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const styles = {
  tag: {
    display:       "inline-block",
    background:    "rgba(255,98,0,0.15)",
    border:        "1px solid rgba(255,98,0,0.3)",
    borderRadius:  "20px",
    padding:       "4px 16px",
    fontSize:      "12px",
    fontWeight:    700,
    color:         "#FF8534",
    letterSpacing: "0.5px",
    marginBottom:  "16px",
  } as React.CSSProperties,
  heading: {
    fontFamily:   "Rajdhani, sans-serif",
    fontSize:     "clamp(28px, 4vw, 44px)",
    fontWeight:   700,
    lineHeight:   1.2,
    marginBottom: "16px",
    color:        "#ffffff",
  } as React.CSSProperties,
  highlight: {
    background:           "linear-gradient(135deg, #FF6200, #FFB800)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor:  "transparent",
    backgroundClip:       "text",
  } as React.CSSProperties,
  sub: {
    fontSize:   "17px",
    color:      "rgba(255,255,255,0.85)",
    lineHeight: 1.7,
    margin:     0,
  } as React.CSSProperties,
} as const;
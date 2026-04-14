
"use client";

// ─── Types ─────────────────────────────────────────────────────────────────
interface ComparisonRow {
  feature: string;
  us: string;
  usIsCheck?: boolean;
  usIsGold?: boolean;
  them1: string;
  them1Cross: boolean;
  them2: string;
  them2Cross: boolean;
  isLast: boolean;
}

// ─── Data ───────────────────────────────────────────────────────────────────
const ROWS: ComparisonRow[] = [
  {
    feature: "Kerala PSC Category-Based Tests",
    us: "✓ Exact category",
    usIsCheck: true,
    them1: "Generic tests only",
    them1Cross: false,
    them2: "Rarely PSC-specific",
    them2Cross: false,
    isLast: false,
  },
  {
    feature: "Smart Interactive Lessons",
    us: "✓ Full system",
    usIsCheck: true,
    them1: "Videos only",
    them1Cross: false,
    them2: "Classroom notes PDF",
    them2Cross: false,
    isLast: false,
  },
  {
    feature: "Malayalam Audio Lessons",
    us: "✓ Full support",
    usIsCheck: true,
    them1: "✗",
    them1Cross: true,
    them2: "✗",
    them2Cross: true,
    isLast: false,
  },
  {
    feature: "Graded Practice Quiz per Lesson",
    us: "✓ Every lesson",
    usIsCheck: true,
    them1: "✗",
    them1Cross: true,
    them2: "✗",
    them2Cross: true,
    isLast: false,
  },
  {
    feature: "Live Leaderboard & Progress Tracking",
    us: "✓ Full system",
    usIsCheck: true,
    them1: "✗",
    them1Cross: true,
    them2: "✗",
    them2Cross: true,
    isLast: false,
  },
  {
    feature: "Daily Study Plan & Roadmap",
    us: "✓ Exact roadmap",
    usIsCheck: true,
    them1: "✗",
    them1Cross: true,
    them2: "✗",
    them2Cross: true,
    isLast: false,
  },
  {
    feature: "ITI / Diploma / B.Tech Split",
    us: "✓ All 3 categories",
    usIsCheck: true,
    them1: "One-size-fits-all",
    them1Cross: false,
    them2: "Rarely separated",
    them2Cross: false,
    isLast: false,
  },
  {
    feature: "Transparent Pricing",
    us: "✓ Always published",
    usIsCheck: true,
    them1: "Hidden charges",
    them1Cross: false,
    them2: "Fee on enquiry only",
    them2Cross: false,
    isLast: false,
  },
  {
    feature: "Flexible Monthly Plans",
    us: "✓ From ₹1,800/mo",
    usIsGold: true,
    them1: "Annual only",
    them1Cross: false,
    them2: "Lump sum only",
    them2Cross: false,
    isLast: false,
  },
  {
    feature: "Mentorship System",
    us: "✓ Course Specific",
    usIsCheck: true,
    them1: "No mentorship",
    them1Cross: false,
    them2: "Paid extra",
    them2Cross: false,
    isLast: false,
  },
  {
    feature: "Study Community",
    us: "✓ 24 hr Active",
    usIsCheck: true,
    them1: "No community",
    them1Cross: false,
    them2: "Closed WhatsApp group",
    them2Cross: false,
    isLast: true,
  },
];

// ─── Hover Helpers ──────────────────────────────────────────────────────────
const hoverOn = (e: React.MouseEvent<HTMLDivElement>) => {
  e.currentTarget.style.background = "rgba(255,98,0,0.04)";
};

const hoverOff = (e: React.MouseEvent<HTMLDivElement>) => {
  e.currentTarget.style.background = "transparent";
};

// ─── Component ──────────────────────────────────────────────────────────────
export default function ComparisonSection() {
  return (
    <section
      aria-labelledby="comparison-heading"
      style={{ background: "#060D1A", padding: "90px 5%" }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", maxWidth: "760px", margin: "0 auto 60px" }}>
        <div style={styles.tag}>WHY CIVILEZY</div>

        <h2 id="comparison-heading" style={styles.heading}>
          Built Specifically For{" "}
          <span style={styles.highlight}>Kerala PSC Aspirants</span>
        </h2>

        <p style={styles.sub}>
          Most platforms offer generic content for everyone. CivilEzy is
          purpose-built for Kerala PSC students with category-based preparation,
          interactive learning, mentorship, and structured study systems
          designed for real exam success.
        </p>
      </div>

      {/* Table */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div
          style={{
            minWidth: "700px",
            borderRadius: "20px",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.02)",
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Head */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr",
              padding: "18px 24px",
              background: "rgba(255,255,255,0.05)",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              fontWeight: 700,
              fontSize: "16px",
              fontFamily: "Rajdhani, sans-serif",
            }}
          >
            <div style={{ color: "rgba(255,255,255,0.65)" }}>Feature</div>
            <div style={{ color: "#FF8534" }}>CivilEzy</div>
            <div style={{ color: "#ffffff" }}>Online Platforms</div>
            <div style={{ color: "#ffffff" }}>Others</div>
          </div>

          {/* Rows */}
          {ROWS.map((row) => (
            <div
              key={row.feature}
              onMouseEnter={hoverOn}
              onMouseLeave={hoverOff}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr",
                padding: "16px 24px",
                borderBottom: row.isLast
                  ? "none"
                  : "1px solid rgba(255,255,255,0.05)",
                alignItems: "center",
                transition: "all 0.2s ease",
                fontSize: "14px",
              }}
            >
              <div style={{ color: "rgba(255,255,255,0.85)" }}>{row.feature}</div>

              <div
                style={{
                  color: row.usIsCheck
                    ? "#32C864"
                    : row.usIsGold
                    ? "#FFB800"
                    : "#FF8534",
                  fontWeight: 700,
                }}
              >
                {row.us}
              </div>

              <div
                style={{
                  color: row.them1Cross
                    ? "#FF4D4D"
                    : "rgba(255,255,255,0.55)",
                }}
              >
                {row.them1}
              </div>

              <div
                style={{
                  color: row.them2Cross
                    ? "#FF4D4D"
                    : "rgba(255,255,255,0.55)",
                }}
              >
                {row.them2}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Hint */}
      <p style={styles.scrollHint}>← Scroll horizontally on mobile →</p>
    </section>
  );
}

// ─── Shared Styles ──────────────────────────────────────────────────────────
const styles = {
  tag: {
    display: "inline-block",
    background: "rgba(255,98,0,0.15)",
    border: "1px solid rgba(255,98,0,0.3)",
    borderRadius: "20px",
    padding: "5px 16px",
    fontSize: "12px",
    fontWeight: 700,
    color: "#FF8534",
    marginBottom: "18px",
  },

  heading: {
    fontFamily: "Rajdhani, sans-serif",
    fontSize: "clamp(30px, 5vw, 48px)",
    fontWeight: 700,
    lineHeight: 1.15,
    color: "#ffffff",
    marginBottom: "18px",
  },

  highlight: {
    background: "linear-gradient(135deg, #FF6200, #FFB800)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  sub: {
    fontSize: "17px",
    color: "rgba(255,255,255,0.75)",
    lineHeight: 1.8,
    margin: 0,
  },

  scrollHint: {
    textAlign: "center" as const,
    fontSize: "12px",
    color: "rgba(255,255,255,0.3)",
    marginTop: "12px",
  },
} as const;

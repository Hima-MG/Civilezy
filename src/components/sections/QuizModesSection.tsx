
import { useEffect, useRef } from "react";

const MODES = [
  {
    topBar:   "linear-gradient(90deg, #32C864, #00E676)",
    icon:     "🎮",
    title:    "Practice Mode",
    desc:     "Relaxed, subject-wise practice. You choose Easy / Medium / Hard. Instant explanations. XP on every correct answer.",
    features: [
      "Topic-wise filtering (Soil, RCC, Surveying…)",
      "Student-set timer — no pressure",
      "Weak subject auto-detection after 20 questions",
      "XP + streak points on every session",
    ],
  },
  {
    topBar:   "linear-gradient(90deg, #FFB800, #FF6200)",
    icon:     "📋",
    title:    "Topic Test",
    desc:     "Focused 20-question tests on specific topics. Know exactly where you stand on Fluid Mechanics, Estimation, Strength of Materials.",
    features: [
      "Single-topic deep dive — 20 questions",
      "Accuracy % shown after each test",
      "Comparison: your score vs toppers",
      "Recommended next topic based on weak areas",
    ],
  },
  {
    topBar:   "linear-gradient(90deg, #FF3232, #FF6B00)",
    icon:     "🏆",
    title:    "Full Mock Exam",
    desc:     "Exact PSC simulation. Real pool-based questions. Department-specific papers. Feel the real exam before the real exam.",
    features: [
      "PSC pool-based: DIP-G1, AE-KWA, ITI-PWD…",
      "Full PSC paper pattern (100Q / 75 marks)",
      "Rank prediction after each mock",
      "Downloadable certificate on completion",
    ],
  },
] as const;

export default function QuizModesSection() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("in-view");
        });
      },
      { threshold: 0.1 }
    );
    cardRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  return (
    <section id="mock-tests" style={{ background: "#0B1E3D", padding: "80px 5%" }}>
      {/* Header */}
      <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 60px" }}>
        <div style={styles.tag}>QUIZ SYSTEM</div>
        <h2 style={styles.heading}>
          Three Modes.{" "}
          <span style={styles.highlight}>One Goal.</span> Top Rank.
        </h2>
        <p style={styles.sub}>
          From casual practice to full PSC simulation — every mode is engineered
          for Kerala PSC Civil Engineering exam success.
        </p>
      </div>

      {/* Mode Cards */}
      <div
        style={{
          display:             "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap:                 "24px",
          maxWidth:            "1100px",
          margin:              "0 auto",
        }}
      >
        {MODES.map((mode, i) => (
          <div
            key={mode.title}
            ref={(el) => { cardRefs.current[i] = el; }}
            className="pain-card-animate"
            style={{
              background:   "rgba(255,255,255,0.04)",
              border:       "1px solid rgba(255,255,255,0.1)",
              borderRadius: "20px",
              padding:      "28px",
              position:     "relative",
              overflow:     "hidden",
              transition:   "transform 0.3s, border-color 0.3s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform   = "translateY(-6px)";
              el.style.borderColor = "rgba(255,98,0,0.3)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform   = "translateY(0)";
              el.style.borderColor = "rgba(255,255,255,0.1)";
            }}
          >
            {/* Top accent bar */}
            <div
              style={{
                position:   "absolute",
                top:        0,
                left:       0,
                right:      0,
                height:     "3px",
                background: mode.topBar,
              }}
            />

            {/* Icon */}
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>{mode.icon}</div>

            {/* Title */}
            <div
              style={{
                fontFamily:   "Rajdhani, sans-serif",
                fontSize:     "24px",
                fontWeight:   700,
                marginBottom: "8px",
                color:        "#ffffff",
              }}
            >
              {mode.title}
            </div>

            {/* Desc */}
            <p
              style={{
                fontSize:     "14px",
                color:        "rgba(255,255,255,0.85)",
                marginBottom: "20px",
                lineHeight:   1.6,
              }}
            >
              {mode.desc}
            </p>

            {/* Features */}
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
              {mode.features.map((feat) => (
                <li
                  key={feat}
                  style={{
                    display:    "flex",
                    alignItems: "center",
                    gap:        "8px",
                    fontSize:   "13px",
                    color:      "rgba(255,255,255,0.85)",
                  }}
                >
                  <span
                    style={{
                      width:        "6px",
                      height:       "6px",
                      borderRadius: "50%",
                      background:   "#FF6200",
                      flexShrink:   0,
                    }}
                  />
                  {feat}
                </li>
              ))}
            </ul>
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
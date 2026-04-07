"use client";

import { useState, useEffect, useRef } from "react";

// ─── Types ──────────────────────────────────────────────────────────────────
type Level = "iti" | "dip" | "ae";
type AnswerState = "unanswered" | "correct" | "wrong";

interface QuizData {
  question: string;
  options: string[];
  correctIndex: number;
}

// ─── Data ───────────────────────────────────────────────────────────────────
const QUIZ_BY_LEVEL: Record<Level, QuizData> = {
  iti: {
    question:     "Q. The minimum reinforcement in a RCC slab as per IS 456 is:",
    options:      ["A. 0.10% of bD", "B. 0.12% of bD (HYSD)", "C. 0.15% of bD", "D. 0.20% of bD"],
    correctIndex: 1,
  },
  dip: {
    question:     "Q. In a singly reinforced beam, the neutral axis depth factor 'n' depends on:",
    options:      ["A. Steel percentage only", "B. Modular ratio & steel %", "C. Concrete grade only", "D. Load intensity"],
    correctIndex: 1,
  },
  ae: {
    question:     "Q. As per IS 1893, the seismic zone factor for Zone III in Kerala is:",
    options:      ["A. 0.10", "B. 0.16", "C. 0.24", "D. 0.36"],
    correctIndex: 1,
  },
};

const STATS = [
  { num: "5,200+", label: "Active Students" },
  { num: "98+",    label: "Rank Holders"    },
  { num: "12,000+",label: "PSC Questions"   },
  { num: "4.9★",   label: "Student Rating"  },
];

const STREAK_DAYS = [
  { letter: "M", state: "done"  },
  { letter: "T", state: "done"  },
  { letter: "W", state: "done"  },
  { letter: "T", state: "done"  },
  { letter: "F", state: "done"  },
  { letter: "S", state: "today" },
  { letter: "S", state: "miss"  },
];

const LMS_FREE_TEST = "https://lms.civilezy.com/free-test";

// ─── Component ──────────────────────────────────────────────────────────────
export default function Hero() {
  const [activeLevel,  setActiveLevel]  = useState<Level>("iti");
  const [answered,     setAnswered]     = useState(false);
  const [answerStates, setAnswerStates] = useState<AnswerState[]>(["unanswered","unanswered","unanswered","unanswered"]);
  const [xpPop,        setXpPop]        = useState<string | null>(null);
  const [xpWidth,      setXpWidth]      = useState("0%");
  const heroRef = useRef<HTMLElement>(null);

  // Animate XP bar to 73.6% after mount
  useEffect(() => {
    const t = setTimeout(() => setXpWidth("73.6%"), 500);
    return () => clearTimeout(t);
  }, []);

  // Reset quiz when level changes
  useEffect(() => {
    setAnswered(false);
    setAnswerStates(["unanswered","unanswered","unanswered","unanswered"]);
  }, [activeLevel]);

  function handleAnswer(index: number) {
    if (answered) return;
    setAnswered(true);

    const correct = QUIZ_BY_LEVEL[activeLevel].correctIndex;
    const next: AnswerState[] = ["unanswered","unanswered","unanswered","unanswered"];

    if (index === correct) {
      next[index] = "correct";
      setXpPop("+10 XP 🔥");
    } else {
      next[index]   = "wrong";
      next[correct] = "correct";
      setXpPop("Try Again! 💡");
    }

    setAnswerStates(next);

    // Hide popup after 2s, reset options after 2.5s
    setTimeout(() => setXpPop(null), 2000);
    setTimeout(() => {
      setAnswerStates(["unanswered","unanswered","unanswered","unanswered"]);
      setAnswered(false);
    }, 2500);
  }

  const quiz = QUIZ_BY_LEVEL[activeLevel];

  return (
    <>
      <section
        ref={heroRef}
        style={{
          minHeight:  "100vh",
          padding:    "100px 5% 60px",
          position:   "relative",
          overflow:   "hidden",
          display:    "flex",
          alignItems: "center",
        }}
        className="hero-section-pad"
      >
        {/* ── Background radial gradients ──────────────────────────── */}
        <div style={{
          position:   "absolute",
          inset:      0,
          zIndex:     0,
          background: `
            radial-gradient(ellipse at 70% 50%, rgba(255,98,0,0.12) 0%, transparent 60%),
            radial-gradient(ellipse at 20% 80%, rgba(255,184,0,0.06) 0%, transparent 50%),
            linear-gradient(180deg, #0B1E3D 0%, #0A1B35 100%)
          `,
        }} />

        {/* ── Grid overlay ─────────────────────────────────────────── */}
        <div style={{
          position:        "absolute",
          inset:           0,
          opacity:         0.04,
          backgroundImage: `
            linear-gradient(rgba(255,98,0,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,98,0,0.5) 1px, transparent 1px)
          `,
          backgroundSize:  "60px 60px",
        }} />

        {/* ── Two-column content ───────────────────────────────────── */}
        <div className="hero-content-grid" style={{
          position:  "relative",
          zIndex:    1,
          display:   "grid",
          gap:       "4rem",
          alignItems:"center",
          width:     "100%",
          maxWidth:  "1300px",
          margin:    "0 auto",
        }}>

          {/* ════════════════════════════════════════════════════════
              LEFT SIDE
          ════════════════════════════════════════════════════════ */}
          <div style={{ animation: "heroFadeUp 0.7s ease forwards" }}>

            {/* Badge */}
            <div style={{
              display:      "inline-flex",
              alignItems:   "center",
              gap:          "8px",
              background:   "rgba(255,98,0,0.15)",
              border:       "1px solid rgba(255,98,0,0.4)",
              borderRadius: "30px",
              padding:      "6px 16px",
              marginBottom: "20px",
              fontSize:     "13px",
              fontWeight:   600,
              color:        "#FF8534",
            }}>
              <span style={{
                width:        "8px",
                height:       "8px",
                borderRadius: "50%",
                background:   "#FF6200",
                flexShrink:   0,
                animation:    "pulseDot 2s infinite",
              }} />
              Kerala&apos;s #1 PSC Civil Engineering Platform
            </div>

            {/* Heading */}
            <h1 style={{
              fontFamily:   "Rajdhani, sans-serif",
              lineHeight:   1.1,
              marginBottom: "12px",
              fontWeight:   700,
            }}>
              {/* Malayalam line */}
              <span style={{
                display:    "block",
                fontSize:   "clamp(28px, 4vw, 48px)",
                background: "linear-gradient(135deg, #FF6200, #FFB800)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                ആശയക്കുഴപ്പം മാറ്റൂ.
              </span>
              {/* English line */}
              <span style={{
                display:   "block",
                color:     "#ffffff",
                fontSize:  "clamp(22px, 3.5vw, 40px)",
                marginTop: "4px",
              }}>
                Become a Confident<br />Rank Holder.
              </span>
            </h1>

            {/* Subtext */}
            <p style={{
              fontSize:     "17px",
              color:        "rgba(255,255,255,0.85)",
              marginBottom: "32px",
              maxWidth:     "480px",
              lineHeight:   1.7,
            }}>
              The{" "}
              <strong style={{ color: "#FF8534", fontWeight: 700 }}>only platform</strong>{" "}
              built exclusively for Kerala PSC Civil Engineering —
              pool-based mock tests, Malayalam content, ITI/Diploma/AE prep,
              expert-crafted questions.{" "}
              <strong style={{ color: "#FF8534", fontWeight: 700 }}>No more confusion.</strong>
            </p>

            {/* CTA Buttons */}
            <div
              className="hero-ctas"
              style={{
                display:      "flex",
                gap:          "16px",
                flexWrap:     "wrap",
                marginBottom: "40px",
              }}
            >
              <a
                href={LMS_FREE_TEST}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-cta-btn"
                style={{
                  background:     "linear-gradient(135deg, #FF6200, #FF4500)",
                  color:          "white",
                  border:         "none",
                  padding:        "16px 32px",
                  borderRadius:   "50px",
                  fontFamily:     "Nunito, sans-serif",
                  fontSize:       "17px",
                  fontWeight:     800,
                  cursor:         "pointer",
                  boxShadow:      "0 6px 30px rgba(255,98,0,0.5)",
                  transition:     "transform 0.2s, box-shadow 0.2s",
                  display:        "inline-flex",
                  alignItems:     "center",
                  gap:            "8px",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform  = "translateY(-3px)";
                  (e.currentTarget as HTMLElement).style.boxShadow  = "0 12px 40px rgba(255,98,0,0.6)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform  = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow  = "0 6px 30px rgba(255,98,0,0.5)";
                }}
              >
                🚀 Take Free Mock Test
              </a>

              <button
                className="hero-cta-btn"
                style={{
                  background:   "transparent",
                  color:        "#ffffff",
                  border:       "2px solid rgba(255,255,255,0.3)",
                  padding:      "14px 28px",
                  borderRadius: "50px",
                  fontFamily:   "Nunito, sans-serif",
                  fontSize:     "16px",
                  fontWeight:   600,
                  cursor:       "pointer",
                  transition:   "border-color 0.2s, background 0.2s",
                  display:      "inline-flex",
                  alignItems:   "center",
                  gap:          "8px",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#FF6200";
                  (e.currentTarget as HTMLElement).style.background  = "rgba(255,98,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.3)";
                  (e.currentTarget as HTMLElement).style.background  = "transparent";
                }}
              >
                ▶ Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
              {STATS.map(({ num, label }) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div style={{
                    fontFamily:  "Rajdhani, sans-serif",
                    fontSize:    "28px",
                    fontWeight:  700,
                    background:  "linear-gradient(135deg, #FF6200, #FFB800)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor:  "transparent",
                    backgroundClip: "text",
                  }}>
                    {num}
                  </div>
                  <span style={{
                    fontSize:   "12px",
                    color:      "rgba(255,255,255,0.55)",
                    display:    "block",
                    marginTop:  "-4px",
                  }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════
              RIGHT SIDE — Interactive Card
          ════════════════════════════════════════════════════════ */}
          <div style={{
            position:  "relative",
            animation: "heroFadeUp 0.7s 0.2s ease both",
          }}>
            {/* Floating badge — top right */}
            <div style={{
              position:       "absolute",
              top:            "-16px",
              right:          "-16px",
              background:     "rgba(11,30,61,0.9)",
              border:         "1px solid rgba(255,98,0,0.4)",
              borderRadius:   "12px",
              padding:        "8px 14px",
              fontSize:       "13px",
              fontWeight:     700,
              backdropFilter: "blur(8px)",
              boxShadow:      "0 8px 24px rgba(0,0,0,0.4)",
              color:          "#FFB800",
              zIndex:         2,
              whiteSpace:     "nowrap",
            }}>
              🏆 Global Rank #247
            </div>

            {/* ── Main glass card ──────────────────────────────── */}
            <div style={{
              background:     "rgba(255,255,255,0.06)",
              border:         "1px solid rgba(255,255,255,0.12)",
              borderRadius:   "20px",
              padding:        "24px",
              backdropFilter: "blur(10px)",
            }}>

              {/* Level selector label */}
              <div style={{
                fontSize:     "13px",
                color:        "rgba(255,255,255,0.55)",
                marginBottom: "8px",
                fontWeight:   700,
                letterSpacing:"0.5px",
              }}>
                SELECT YOUR LEVEL
              </div>

              {/* Level buttons */}
              <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                <LevelBtn
                  label="🔧 ITI"
                  isActive={activeLevel === "iti"}
                  colorScheme="orange"
                  onClick={() => setActiveLevel("iti")}
                />
                <LevelBtn
                  label="📐 Diploma"
                  isActive={activeLevel === "dip"}
                  colorScheme="gold"
                  onClick={() => setActiveLevel("dip")}
                />
                <LevelBtn
                  label="🏗️ AE"
                  isActive={activeLevel === "ae"}
                  colorScheme="blue"
                  onClick={() => setActiveLevel("ae")}
                />
              </div>

              {/* Quiz preview */}
              <div style={{
                background:   "rgba(0,0,0,0.3)",
                borderRadius: "14px",
                padding:      "16px",
                marginBottom: "16px",
              }}>
                {/* Question */}
                <div style={{
                  fontSize:     "14px",
                  fontWeight:   600,
                  marginBottom: "12px",
                  lineHeight:   1.5,
                  color:        "#fff",
                }}>
                  {quiz.question}
                </div>

                {/* Options grid */}
                <div style={{
                  display:             "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap:                 "8px",
                }}>
                  {quiz.options.map((opt, i) => (
                    <QuizOption
                      key={`${activeLevel}-${i}`}
                      label={opt}
                      state={answerStates[i]}
                      disabled={answered}
                      onClick={() => handleAnswer(i)}
                    />
                  ))}
                </div>
              </div>

              {/* XP bar */}
              <div style={{
                display:    "flex",
                alignItems: "center",
                gap:        "10px",
                marginTop:  "12px",
              }}>
                <span style={{
                  fontSize:   "12px",
                  color:      "#FF8534",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}>
                  ⚡ XP 1,840 / 2,500
                </span>
                <div style={{
                  flex:         1,
                  height:       "8px",
                  background:   "rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  overflow:     "hidden",
                }}>
                  <div style={{
                    height:     "100%",
                    background: "linear-gradient(90deg, #FF6200, #FFB800)",
                    borderRadius:"10px",
                    width:       xpWidth,
                    transition: "width 1.5s ease",
                  }} />
                </div>
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)" }}>
                  Pro
                </span>
              </div>

              {/* Streak row */}
              <div style={{
                display:        "flex",
                alignItems:     "center",
                justifyContent: "space-between",
                background:     "rgba(255,98,0,0.1)",
                border:         "1px solid rgba(255,98,0,0.2)",
                borderRadius:   "10px",
                padding:        "10px 14px",
                marginTop:      "12px",
              }}>
                <div style={{
                  display:    "flex",
                  alignItems: "center",
                  gap:        "8px",
                  fontSize:   "14px",
                  fontWeight: 700,
                }}>
                  🔥 <strong>14-Day Streak</strong>
                </div>
                <div style={{ display: "flex", gap: "4px" }}>
                  {STREAK_DAYS.map(({ letter, state }, i) => (
                    <StreakDay key={i} letter={letter} state={state as "done"|"today"|"miss"} />
                  ))}
                </div>
              </div>
            </div>
            {/* END glass card */}

            {/* Floating badge — bottom left */}
            <div style={{
              position:       "absolute",
              bottom:         "-16px",
              left:           "-16px",
              background:     "rgba(11,30,61,0.9)",
              border:         "1px solid rgba(255,98,0,0.4)",
              borderRadius:   "12px",
              padding:        "8px 14px",
              fontSize:       "13px",
              fontWeight:     700,
              backdropFilter: "blur(8px)",
              boxShadow:      "0 8px 24px rgba(0,0,0,0.4)",
              color:          "#64C8FF",
              zIndex:         2,
              display:        "flex",
              alignItems:     "center",
              gap:            "6px",
              whiteSpace:     "nowrap",
            }}>
              <span style={{
                width:        "8px",
                height:       "8px",
                borderRadius: "50%",
                background:   "#32C864",
                flexShrink:   0,
                animation:    "pulseDot 1.5s infinite",
              }} />
              247 students online now
            </div>
          </div>
          {/* END right side */}

        </div>
        {/* END two-column grid */}

      </section>

      {/* ── XP pop-up toast ──────────────────────────────────────── */}
      {xpPop && (
        <div style={{
          position:     "fixed",
          top:          "50%",
          left:         "50%",
          transform:    "translate(-50%, -50%)",
          background:   "linear-gradient(135deg, #FF6200, #FF8534)",
          color:        "white",
          padding:      "12px 24px",
          borderRadius: "30px",
          fontFamily:   "Rajdhani, sans-serif",
          fontSize:     "22px",
          fontWeight:   700,
          zIndex:       9999,
          pointerEvents:"none",
          animation:    "xpPopUp 2s ease forwards",
          whiteSpace:   "nowrap",
        }}>
          {xpPop}
        </div>
      )}

      {/* Keyframes and responsive rules are in globals.css */}
    </>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function LevelBtn({
  label,
  isActive,
  colorScheme,
  onClick,
}: {
  label: string;
  isActive: boolean;
  colorScheme: "orange" | "gold" | "blue";
  onClick: () => void;
}) {
  const schemes = {
    orange: {
      background:  "rgba(255,98,0,0.15)",
      color:       "#FF8534",
      border:      "1px solid rgba(255,98,0,0.3)",
      activeBox:   "0 4px 15px rgba(255,98,0,0.35)",
    },
    gold: {
      background:  "rgba(255,184,0,0.15)",
      color:       "#FFB800",
      border:      "1px solid rgba(255,184,0,0.3)",
      activeBox:   "0 4px 15px rgba(255,184,0,0.35)",
    },
    blue: {
      background:  "rgba(100,200,255,0.1)",
      color:       "#64C8FF",
      border:      "1px solid rgba(100,200,255,0.3)",
      activeBox:   "0 4px 15px rgba(100,200,255,0.3)",
    },
  };

  const s = schemes[colorScheme];

  return (
    <button
      onClick={onClick}
      style={{
        flex:        1,
        padding:     "10px",
        borderRadius:"12px",
        border:      s.border,
        cursor:      "pointer",
        fontFamily:  "Nunito, sans-serif",
        fontSize:    "14px",
        fontWeight:  700,
        transition:  "all 0.2s",
        background:  s.background,
        color:       s.color,
        transform:   isActive ? "scale(1.05)" : "scale(1)",
        boxShadow:   isActive ? s.activeBox : "none",
      }}
    >
      {label}
    </button>
  );
}

function QuizOption({
  label,
  state,
  disabled,
  onClick,
}: {
  label: string;
  state: AnswerState;
  disabled: boolean;
  onClick: () => void;
}) {
  const stateStyles: Record<AnswerState, React.CSSProperties> = {
    unanswered: {
      background:  "rgba(255,255,255,0.06)",
      border:      "1px solid rgba(255,255,255,0.1)",
      color:       "rgba(255,255,255,0.85)",
    },
    correct: {
      background:  "rgba(50,200,100,0.2)",
      border:      "1px solid #32C864",
      color:       "#32C864",
    },
    wrong: {
      background:  "rgba(255,50,50,0.2)",
      border:      "1px solid #FF3232",
      color:       "#FF6464",
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...stateStyles[state],
        borderRadius: "8px",
        padding:      "8px 12px",
        fontSize:     "12px",
        cursor:       disabled ? "default" : "pointer",
        transition:   "all 0.2s",
        textAlign:    "center",
        fontFamily:   "Nunito, sans-serif",
        fontWeight:   500,
        lineHeight:   1.4,
        background:   stateStyles[state].background,
      }}
      onMouseEnter={(e) => {
        if (disabled || state !== "unanswered") return;
        (e.currentTarget as HTMLElement).style.background  = "rgba(255,98,0,0.2)";
        (e.currentTarget as HTMLElement).style.borderColor = "#FF6200";
      }}
      onMouseLeave={(e) => {
        if (disabled || state !== "unanswered") return;
        (e.currentTarget as HTMLElement).style.background  = "rgba(255,255,255,0.06)";
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
      }}
    >
      {state === "correct" ? `✓ ${label}` : label}
    </button>
  );
}

function StreakDay({ letter, state }: { letter: string; state: "done" | "today" | "miss" }) {
  const styles: Record<"done"|"today"|"miss", React.CSSProperties> = {
    done:  { background: "#FF6200", color: "white" },
    today: { background: "rgba(255,98,0,0.3)", border: "1px solid #FF6200", color: "#FF6200" },
    miss:  { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.55)" },
  };

  return (
    <div style={{
      width:          "24px",
      height:         "24px",
      borderRadius:   "6px",
      display:        "flex",
      alignItems:     "center",
      justifyContent: "center",
      fontSize:       "10px",
      fontWeight:     700,
      ...styles[state],
    }}>
      {letter}
    </div>
  );
}
"use client";

import { useEffect, useRef } from "react";

const solutions = [
  {
    color: "#FF8534",
    borderColor: "rgba(255,133,52,0.25)",
    bgColor: "rgba(255,98,0,0.10)",
    glowColor: "rgba(255,98,0,0.08)",
    topBarColor: "#FF8534",
    chipBg: "rgba(255,98,0,0.12)",
    chipBorder: "rgba(255,98,0,0.25)",
    titleEn: "Smart Interactive Lessons",
    titleMl: "സ്മാർട്ട് ഇന്ററാക്ടീവ് ലെസ്സൺസ്",
    bodyEn:
      "Dynamic widgets and live quizzes embedded in every lesson — learning and practice happen together. A clear daily study roadmap so you always know exactly what to do next.",
    bodyMl:
      "ഓരോ lesson-ലും live quiz ഉണ്ട്. പഠനവും practice-ഉം ഒന്നിച്ച്. എന്ത് പഠിക്കണം, എപ്പോൾ പഠിക്കണം — daily roadmap നിങ്ങളെ guide ചെയ്യും.",
    chip: "✓ Pool-mapped daily study plan",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="14" rx="3" stroke="#FF8534" strokeWidth="1.5" />
        <path d="M8 9h8M8 12h5" stroke="#FF8534" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="17" cy="12" r="2.5" fill="#0d1b2e" stroke="#FF8534" strokeWidth="1.3" />
        <path d="M16.2 12l.8.8 1.5-1.5" stroke="#FF8534" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    color: "#FFB800",
    borderColor: "rgba(255,184,0,0.25)",
    bgColor: "rgba(255,184,0,0.10)",
    glowColor: "rgba(255,184,0,0.08)",
    topBarColor: "#FFB800",
    chipBg: "rgba(255,184,0,0.10)",
    chipBorder: "rgba(255,184,0,0.25)",
    titleEn: "Malayalam Audio Lessons",
    titleMl: "മലയാളം ഓഡിയോ ലെസ്സൺസ്",
    bodyEn:
      "Hard civil engineering concepts explained like a story — in Malayalam. No textbooks, no notes needed. Study while commuting or on a break. Anyone can learn, anytime, anywhere.",
    bodyMl:
      "Design, Analysis — കഥ പോലെ മലയാളത്തിൽ പഠിക്കാം. യാത്രയ്ക്കിടയിലോ, ഇടവേളയിലോ — notes ഇല്ലാതെ. കേട്ടു പഠിക്കാം — kettu padikkam!",
    chip: "✓ Full syllabus in Malayalam audio",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#FFB800" strokeWidth="1.5" />
        <path d="M9 10c0-1.66 1.34-3 3-3s3 1.34 3 3v2c0 1.66-1.34 3-3 3s-3-1.34-3-3v-2z" stroke="#FFB800" strokeWidth="1.4" />
        <path d="M7 12v1a5 5 0 0 0 10 0v-1" stroke="#FFB800" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M12 18v2" stroke="#FFB800" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    color: "#64C8FF",
    borderColor: "rgba(100,200,255,0.2)",
    bgColor: "rgba(100,200,255,0.08)",
    glowColor: "rgba(100,200,255,0.06)",
    topBarColor: "#64C8FF",
    chipBg: "rgba(100,200,255,0.10)",
    chipBorder: "rgba(100,200,255,0.2)",
    titleEn: "Quiz-Based Learning & Tracking",
    titleMl: "Quiz വഴി പഠിക്കൂ, Exam-ന് Ready ആകൂ",
    bodyEn:
      "After every lesson, practice quizzes reinforce what you learned. A live progress tracker shows exactly where you stand — so exam day holds no surprises. No more studying blind.",
    bodyMl:
      "ഓരോ lesson കഴിഞ്ഞും practice quiz. Progress tracker നിങ്ങളുടെ exam readiness കാണിക്കും. Exam-ന് പോകുമ്പോൾ ഇനി പേടി വേണ്ട.",
    chip: "✓ Track progress · Exam-ready always",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M12 3l2.5 5.5L20 9.5l-4 4 1 5.5L12 16l-5 3 1-5.5-4-4 5.5-1z" stroke="#64C8FF" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    color: "#32C864",
    borderColor: "rgba(50,200,100,0.2)",
    bgColor: "rgba(50,200,100,0.08)",
    glowColor: "rgba(50,200,100,0.06)",
    topBarColor: "#32C864",
    chipBg: "rgba(50,200,100,0.10)",
    chipBorder: "rgba(50,200,100,0.2)",
    titleEn: "Affordable & Flexible Courses",
    titleMl: "നിങ്ങൾക്ക് ചേർന്ന Course, നിങ്ങളുടെ Budget-ൽ",
    bodyEn:
      "Choose your course by qualification — ITI, Diploma, or AE — or by your preparation timeline. Monthly plans, no large upfront fees. Kerala PSC-specific content at a price anyone can afford.",
    bodyMl:
      "ITI ആണോ, Diploma ആണോ, AE ആണോ? Timeline short ആണോ? നിങ്ങൾക്ക് ചേർന്ന plan തിരഞ്ഞെടുക്കാം. Monthly payment — ഒറ്റത്തവണ വലിയ തുക വേണ്ട.",
    chip: "✓ Monthly plans · ITI · Diploma · AE",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#32C864" strokeWidth="1.5" />
        <path d="M12 7v1.5M12 15.5V17" stroke="#32C864" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M9.5 9.5A2.5 2.5 0 0 1 14.5 11c0 1.5-1 2-2.5 2.5V15" stroke="#32C864" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function SolutionSection() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = "1";
            (entry.target as HTMLElement).style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.12 }
    );
    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <section
      aria-labelledby="solution-heading"
      style={{ background: "#080F1E", paddingTop: 0, paddingBottom: "80px" }}
    >
      <div
        style={{
          maxWidth: "1200px",
          width: "100%",
          margin: "0 auto",
          padding: "0 5%",
        }}
      >
        {/* Heading */}
        <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 64px" }}>
          <div
            aria-hidden="true"
            style={{
              display: "inline-block",
              background: "rgba(255,98,0,0.15)",
              border: "1px solid rgba(255,98,0,0.3)",
              borderRadius: "20px",
              padding: "4px 16px",
              fontSize: "12px",
              fontWeight: 700,
              color: "#FF8534",
              letterSpacing: "0.5px",
              marginBottom: "16px",
            }}
          >
            THE SOLUTION
          </div>

          <h2
            id="solution-heading"
            style={{
              fontFamily: "Rajdhani, sans-serif",
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: "12px",
              color: "#ffffff",
            }}
          >
            Civilezy തരുന്നു —{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #FF6200, #FFB800)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              ഒരു Smart Solution
            </span>
          </h2>

          <p
            style={{
              fontSize: "17px",
              color: "rgba(255,255,255,0.75)",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            Built specifically for Kerala PSC Civil Engineering aspirants —
            structured, simple, and result-focused.
          </p>
        </div>

        {/* Cards Grid */}
        <div
          className="solution-cards-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "20px",
          }}
        >
          {solutions.map((s, i) => (
            <div
              key={s.titleEn}
              ref={(el) => { cardRefs.current[i] = el; }}
              style={{
                position: "relative",
                background: "#0B1929",
                border: `1px solid ${s.borderColor}`,
                borderRadius: "20px",
                padding: "28px 26px",
                overflow: "hidden",
                opacity: 0,
                transform: "translateY(24px)",
                transition: `opacity 0.5s ease ${i * 80}ms, transform 0.5s ease ${i * 80}ms`,
                boxShadow: `0 8px 32px ${s.glowColor}`,
              }}
            >
              {/* Top accent bar */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: 0,
                  left: "15%",
                  right: "15%",
                  height: "2px",
                  background: `linear-gradient(90deg, transparent, ${s.topBarColor}, transparent)`,
                  opacity: 0.7,
                  borderRadius: "0 0 4px 4px",
                }}
              />

              {/* Icon */}
              <div
                aria-hidden="true"
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "14px",
                  background: s.bgColor,
                  border: `1px solid ${s.borderColor}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                  flexShrink: 0,
                }}
              >
                {s.icon}
              </div>

              {/* Title EN */}
              <h3
                style={{
                  fontFamily: "Rajdhani, sans-serif",
                  fontSize: "20px",
                  fontWeight: 700,
                  color: s.color,
                  marginBottom: "3px",
                  lineHeight: 1.3,
                }}
              >
                {s.titleEn}
              </h3>

              {/* Title ML */}
              <p
                lang="ml"
                style={{
                  fontSize: "13px",
                  color: s.color,
                  opacity: 0.6,
                  marginBottom: "12px",
                  fontWeight: 400,
                }}
              >
                {s.titleMl}
              </p>

              {/* Divider */}
              <div
                style={{
                  height: "1px",
                  background: "rgba(255,255,255,0.07)",
                  marginBottom: "14px",
                }}
              />

              {/* Body EN */}
              <p
                style={{
                  fontSize: "14px",
                  color: "rgba(255,255,255,0.8)",
                  lineHeight: 1.75,
                  marginBottom: "8px",
                }}
              >
                {s.bodyEn}
              </p>

              {/* Body ML */}
              <p
                lang="ml"
                style={{
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.5)",
                  lineHeight: 1.85,
                  marginBottom: "18px",
                }}
              >
                {s.bodyMl}
              </p>

              {/* Chip */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: s.chipBg,
                  border: `1px solid ${s.chipBorder}`,
                  borderRadius: "20px",
                  padding: "4px 14px",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: s.color,
                  letterSpacing: "0.3px",
                }}
              >
                {s.chip}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .solution-cards-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

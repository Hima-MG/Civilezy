"use client";

import { useEffect, useRef, useState } from "react";

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



"No more half-understood topics! Every topic is taught to 100% completion. Study Mode to learn it, Revision Mode to lock it in, Exam Mode to own it — our 3-mode system makes sure you walk into the exam hall fully loaded.",





bodyMl:
  "പകുതി മനസ്സിലായ ടോപ്പിക്കുകൾ ഇനി വേണ്ട! ഓരോ ടോപ്പിക്കും 100% പഠിച്ചു തീർക്കും. Study Mode-ൽ പഠിക്കുക, Revision Mode-ൽ ഉറപ്പിക്കുക, Exam Mode-ൽ തകർക്കുക — ഈ 3-മോഡ് സിസ്റ്റം നിങ്ങളെ എക്സാം ഹാളിലേക്ക് പൂർണ്ണ തയ്യാറെടുപ്പോടെ എത്തിക്കും.",

chip:  "Study · Revision · Exam ",
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
"Forget textbooks! Every tough civil engineering concept hits different when it's explained like a story — in pure Malayalam. Pop in your earphones and learn on the go — commute, lunch break, anywhere. If you understand Malayalam, you can crack PSC. Period.",
bodyMl:
"ടെക്സ്റ്റ്ബുക്ക് വേണ്ട, നോട്സ് വേണ്ട! കഠിനമായ Civil Engineering കോൺസെപ്റ്റുകൾ മലയാളത്തിൽ ഒരു കഥ പോലെ കേൾക്കൂ. യാത്രയിൽ, ഉച്ചഭക്ഷണ ഇടവേളയിൽ, എവിടെ വേണമെങ്കിലും പഠിക്കാം. മലയാളം അറിയാമെങ്കിൽ PSC ക്രാക്ക് ചെയ്യാം. അത്രേയുള്ളൂ!",
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
  
"Just 10 questions. Retake until you own it — F to A, one attempt at a time. The live leaderboard doesn't lie. Your rank is waiting. Go get it!",


bodyMl:
  "വെറും 10 ചോദ്യങ്ങൾ. F-ൽ നിന്ന് A-ലേക്ക് — Retake ചെയ്യൂ, തകർക്കൂ. Live Leaderboard-ൽ നിങ്ങളുടെ പേര് മുകളിലേക്ക് കയറും. റാങ്ക് കാത്തിരിക്കുന്നു — പോയി നേടൂ!",

chip: "✓ 10Q quizzes · Grades · Leaderboard",
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
    titleEn: "Affordable & Tailormade for You",
    titleMl: "നിങ്ങൾക്ക് ചേർന്ന Course, നിങ്ങളുടെ Budget-ൽ",
    bodyEn:
"ITI, Diploma, or B.Tech — we've got your course! Short on time? Pick a timeline that fits your schedule. Pay monthly or go all-in with a one-time payment — you choose. Zero excuses, just results!   ",
 bodyMl:
" ITI, Diploma, അല്ലെങ്കിൽ B.Tech — നിങ്ങൾക്ക് പറ്റിയ കോഴ്സ് ഇവിടെയുണ്ട്! സമയം കുറവാണോ? നിങ്ങളുടെ schedule-നു യോജിച്ച timeline തിരഞ്ഞെടുക്കൂ. Monthly ആയി pay ചെയ്യാം, അല്ലെങ്കിൽ One-time ആയും — തീരുമാനം നിങ്ങളുടേത്. ഒഴികഴിവുകൾ വേണ്ട, റിസൾട്ട് മാത്രം!", 
   chip: "✓ Flexible Payment Methods · ITI · Diploma · Btech",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#32C864" strokeWidth="1.5" />
        <path d="M12 7v1.5M12 15.5V17" stroke="#32C864" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M9.5 9.5A2.5 2.5 0 0 1 14.5 11c0 1.5-1 2-2.5 2.5V15" stroke="#32C864" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
];

type Lang = "en" | "ml";

export default function SolutionSection() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [lang, setLang] = useState<Lang>("en");

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
            <span lang="ml" style={{ fontSize: "0.65em" }}>CivilEzy തരുന്നു —</span>{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #FF6200, #FFB800)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              <span lang="ml" style={{ fontSize: "0.65em" }}>ഒരു</span> Smart Solution
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

          {/* Language toggle */}
          <div
            style={{
              display: "inline-flex",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "30px",
              padding: "3px",
              marginTop: "20px",
            }}
          >
            <button
              onClick={() => setLang("en")}
              style={{
                padding: "6px 18px",
                borderRadius: "26px",
                border: "none",
                fontFamily: "Nunito, sans-serif",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.25s",
                background: lang === "en" ? "linear-gradient(135deg, #FF6200, #FF8534)" : "transparent",
                color: lang === "en" ? "white" : "rgba(255,255,255,0.5)",
                boxShadow: lang === "en" ? "0 2px 10px rgba(255,98,0,0.3)" : "none",
              }}
            >
              English
            </button>
            <button
              onClick={() => setLang("ml")}
              style={{
                padding: "6px 18px",
                borderRadius: "26px",
                border: "none",
                fontFamily: "Nunito, sans-serif",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.25s",
                background: lang === "ml" ? "linear-gradient(135deg, #FF6200, #FF8534)" : "transparent",
                color: lang === "ml" ? "white" : "rgba(255,255,255,0.5)",
                boxShadow: lang === "ml" ? "0 2px 10px rgba(255,98,0,0.3)" : "none",
              }}
            >
              മലയാളം
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        <div
          className="solution-cards-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
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

              {/* Title */}
              <h3
                lang={lang === "ml" ? "ml" : undefined}
                style={{
                  fontFamily: "Rajdhani, sans-serif",
                  fontSize: "20px",
                  fontWeight: 700,
                  color: s.color,
                  marginBottom: "12px",
                  lineHeight: 1.3,
                }}
              >
                {lang === "en" ? s.titleEn : s.titleMl}
              </h3>

              {/* Divider */}
              <div
                style={{
                  height: "1px",
                  background: "rgba(255,255,255,0.07)",
                  marginBottom: "14px",
                }}
              />

              {/* Body */}
              <p
                lang={lang === "ml" ? "ml" : undefined}
                style={{
                  fontSize: "14px",
                  color: "rgba(255,255,255,0.8)",
                  lineHeight: 1.8,
                  marginBottom: "18px",
                }}
              >
                {lang === "en" ? s.bodyEn : s.bodyMl}
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
        @media (max-width: 1024px) {
          .solution-cards-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          .solution-cards-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

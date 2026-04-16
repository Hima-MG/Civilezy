"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

// ─── Types ──────────────────────────────────────────────────────────────────
type Level       = "iti" | "dip" | "btech";
type AnswerState = "unanswered" | "correct" | "wrong";

interface QuizData {
  question:     string;
  options:      string[];
  correctIndex: number;
}

import { EXTERNAL_URLS } from "@/lib/constants";

// ─── Constants ───────────────────────────────────────────────────────────────
// const LMS_FREE_TEST = EXTERNAL_URLS.freeTest;
const STORAGE_KEY = "civilezy_user";

// ─── Rank System ────────────────────────────────────────────────────────────
interface RankInfo {
  label: string;
  icon:  string;
  color: string;
}

function getRank(score: number): RankInfo {
  if (score >= 5000) return { label: "Top Performer", icon: "🏆", color: "#FFB800" };
  if (score >= 2000) return { label: "Advanced",      icon: "🟣", color: "#C864FF" };
  if (score >= 500)  return { label: "Intermediate",   icon: "🔵", color: "#64C8FF" };
  return                     { label: "Beginner",       icon: "🟢", color: "#32C864" };
}

// ─── Player data from localStorage ──────────────────────────────────────────
interface PlayerData {
  name:       string;
  totalScore: number;
  streak:     number;
}

// ─── Quiz data ───────────────────────────────────────────────────────────────
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
  btech: {
    question:     "Q. As per IS 1893, the seismic zone factor for Zone III in Kerala is:",
    options:      ["A. 0.10", "B. 0.16", "C. 0.24", "D. 0.36"],
    correctIndex: 1,
  },
};

const STATS = [
  { num: "5,200+",  label: "Active Students" },
  { num: "2000",     label: "Rank Holders"    },
  { num: "50,000+", label: "PSC Questions"   },
  { num: "4.9★",    label: "Student Rating"  },
];

// Streak day labels (Mon–Sun)
const WEEK_LETTERS = ["M","T","W","T","F","S","S"] as const;

// ─── Stable CTA hover handlers ───────────────────────────────────────────────
const onPrimaryEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.transform = "translateY(-3px)";
  e.currentTarget.style.boxShadow = "0 12px 40px rgba(255,98,0,0.6)";
};
const onPrimaryLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.transform = "translateY(0)";
  e.currentTarget.style.boxShadow = "0 6px 30px rgba(255,98,0,0.5)";
};
const onSecondaryEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.currentTarget.style.borderColor = "#FF6200";
  e.currentTarget.style.background  = "rgba(255,98,0,0.1)";
};
const onSecondaryLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
  e.currentTarget.style.background  = "transparent";
};

// ─── Hoisted style maps (not recreated per render) ───────────────────────────
const LEVEL_SCHEMES = {
  orange: { background:"rgba(255,98,0,0.15)",    color:"#FF8534", border:"1px solid rgba(255,98,0,0.3)",    activeBox:"0 4px 15px rgba(255,98,0,0.35)"    },
  gold:   { background:"rgba(255,184,0,0.15)",   color:"#FFB800", border:"1px solid rgba(255,184,0,0.3)",   activeBox:"0 4px 15px rgba(255,184,0,0.35)"   },
  blue:   { background:"rgba(100,200,255,0.1)",  color:"#64C8FF", border:"1px solid rgba(100,200,255,0.3)", activeBox:"0 4px 15px rgba(100,200,255,0.3)"  },
} as const;

const ANSWER_STYLES: Record<AnswerState, React.CSSProperties> = {
  unanswered: { background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.85)" },
  correct:    { background:"rgba(50,200,100,0.2)",   border:"1px solid #32C864",               color:"#32C864"                },
  wrong:      { background:"rgba(255,50,50,0.2)",    border:"1px solid #FF3232",               color:"#FF6464"                },
};

const STREAK_STYLES: Record<"done"|"today"|"miss", React.CSSProperties> = {
  done:  { background:"#FF6200",                color:"white" },
  today: { background:"rgba(255,98,0,0.3)",     border:"1px solid #FF6200", color:"#FF6200" },
  miss:  { background:"rgba(255,255,255,0.05)", color:"rgba(255,255,255,0.55)" },
};

const INITIAL_STATES: AnswerState[] = ["unanswered","unanswered","unanswered","unanswered"];

// ─── Hero Component ──────────────────────────────────────────────────────────
export default function Hero() {
  const [activeLevel,  setActiveLevel]  = useState<Level>("iti");
  const [answered,     setAnswered]     = useState(false);
  const [answerStates, setAnswerStates] = useState<AnswerState[]>(INITIAL_STATES);
  const [xpPop,        setXpPop]        = useState<string | null>(null);
  const [xpWidth,      setXpWidth]      = useState("0%");
  const [mounted,      setMounted]      = useState(false);
  const [totalScore,   setTotalScore]   = useState(0);
  const [streak,       setStreak]       = useState(0);
  const [onlineUsers,  setOnlineUsers]  = useState(0);

  // ── Hydration guard + load player from localStorage ──
  useEffect(() => {
    setMounted(true);

    // Load player data
    let score = Math.floor(Math.random() * (1500 - 100) + 100); // fallback
    let playerStreak = 0;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PlayerData;
        if (parsed && typeof parsed.totalScore === "number") {
          score = parsed.totalScore;
          playerStreak = parsed.streak ?? 0;
        }
      }
    } catch { /* no player data */ }

    setTotalScore(score);
    setStreak(playerStreak);
  }, []);

  // ── Derived rank (safe: returns Beginner for 0 during SSR) ──
  const rank = useMemo(() => getRank(totalScore), [totalScore]);

  // ── Compute XP bar percentage ──
  const xpTarget = useMemo(() => {
    const thresholds = [0, 500, 2000, 5000, 10000];
    let currentTierStart = 0;
    let nextTierEnd      = 500;
    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (totalScore >= thresholds[i]) {
        currentTierStart = thresholds[i];
        nextTierEnd      = thresholds[i + 1] ?? thresholds[i] + 5000;
        break;
      }
    }
    const range    = nextTierEnd - currentTierStart;
    const progress = totalScore - currentTierStart;
    const pct      = Math.min((progress / range) * 100, 100);
    return { current: totalScore, max: nextTierEnd, pct: `${pct.toFixed(1)}%` };
  }, [totalScore]);

  // Animate XP bar after mount
  useEffect(() => {
    if (!mounted) return;
    const t = setTimeout(() => setXpWidth(xpTarget.pct), 500);
    return () => clearTimeout(t);
  }, [mounted, xpTarget.pct]);

  // ── Build streak days for the week ──
  const streakDays = useMemo(() => {
    if (!mounted) {
      // SSR-safe default: all days are "miss"
      return WEEK_LETTERS.map((letter, i) => ({
        id: `${letter}${i}`, letter, state: "miss" as const,
      }));
    }
    const today     = new Date().getDay(); // 0=Sun
    const dayIndex  = today === 0 ? 6 : today - 1; // convert to 0=Mon
    return WEEK_LETTERS.map((letter, i) => {
      let state: "done" | "today" | "miss";
      if (i < dayIndex && i >= dayIndex - streak) state = "done";
      else if (i === dayIndex)                     state = streak > 0 ? "done" : "today";
      else                                         state = "miss";
      return { id: `${letter}${i}`, letter, state };
    });
  }, [streak, mounted]);

  // ── Random online users (100–300), updated every ~6s ──
  useEffect(() => {
    const updateUsers = () => {
      setOnlineUsers(Math.floor(Math.random() * (300 - 100) + 100));
    };
    updateUsers();
    const interval = setInterval(updateUsers, 6000);
    return () => clearInterval(interval);
  }, []);

  // Reset quiz when level changes
  useEffect(() => {
    setAnswered(false);
    setAnswerStates(INITIAL_STATES);
  }, [activeLevel]);

  const handleAnswer = useCallback((index: number) => {
    if (answered) return;
    setAnswered(true);

    const correct = QUIZ_BY_LEVEL[activeLevel].correctIndex;
    const next    = [...INITIAL_STATES] as AnswerState[];

    if (index === correct) {
      next[index] = "correct";
      setXpPop("+10 XP 🔥");
    } else {
      next[index]   = "wrong";
      next[correct] = "correct";
      setXpPop("Try Again! 💡");
    }

    setAnswerStates(next);
    setTimeout(() => setXpPop(null), 2000);
    setTimeout(() => { setAnswerStates(INITIAL_STATES); setAnswered(false); }, 2500);
  }, [answered, activeLevel]);

  const quiz = QUIZ_BY_LEVEL[activeLevel];

  return (
    <>
      <section
        aria-labelledby="hero-heading"
        style={{ minHeight:"100vh", padding:"100px 5% 60px", position:"relative", overflow:"hidden", display:"flex", alignItems:"center" }}
        className="hero-section-pad"
      >
        {/* Decorative backgrounds */}
        <div aria-hidden="true" style={{ position:"absolute", inset:0, zIndex:0, background:"radial-gradient(ellipse at 70% 50%,rgba(255,98,0,0.12) 0%,transparent 60%),radial-gradient(ellipse at 20% 80%,rgba(255,184,0,0.06) 0%,transparent 50%),linear-gradient(180deg,#0B1E3D 0%,#0A1B35 100%)" }} />
        <div aria-hidden="true" style={{ position:"absolute", inset:0, opacity:0.04, backgroundImage:"linear-gradient(rgba(255,98,0,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,98,0,0.5) 1px,transparent 1px)", backgroundSize:"60px 60px" }} />

        {/* Two-column grid */}
        <div className="hero-content-grid" style={{ position:"relative", zIndex:1, display:"grid", gap:"4rem", alignItems:"center", width:"100%", maxWidth:"1300px", margin:"0 auto" }}>

          {/* ═══ LEFT SIDE ═══ */}
          <div style={{ animation:"heroFadeUp 0.7s ease forwards" }}>

            {/* Live badge */}
            <div aria-hidden="true" style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"rgba(255,98,0,0.15)", border:"1px solid rgba(255,98,0,0.4)", borderRadius:"30px", padding:"6px 16px", marginBottom:"20px", fontSize:"13px", fontWeight:600, color:"#FF8534" }}>
              <span style={{ width:"8px", height:"8px", borderRadius:"50%", background:"#FF6200", flexShrink:0, animation:"pulseDot 2s infinite" }} />
              Kerala&apos;s #1 PSC Civil Platform
            </div>

            {/* H1 — primary page heading */}
            <h1 id="hero-heading" style={{ fontFamily:"Rajdhani, sans-serif", lineHeight:1.1, marginBottom:"12px", fontWeight:700 }}>
              {/* lang="ml" ensures correct screen reader pronunciation */}
              <span lang="ml" style={{ display:"block", fontSize:"clamp(28px,4vw,48px)", background:"linear-gradient(135deg,#FF6200,#FFB800)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                ആശയക്കുഴപ്പം മാറ്റൂ.
              </span>
              <span style={{ display:"block", color:"#ffffff", fontSize:"clamp(22px,3.5vw,40px)", marginTop:"4px" }}>
                Stop Guessing.<br />Start Ranking.
              </span>
            </h1>

            {/* Subtext */}
            <p style={{ fontSize:"17px", color:"rgba(255,255,255,0.85)", marginBottom:"28px", maxWidth:"480px", lineHeight:1.7 }}>
              The{" "}
              <strong style={{ color:"#FF8534", fontWeight:700 }}>only Kerala CIVIL ENGINEERING PSC platform</strong>{" "}
              with Category based content, Malayalam audio lessons, and a Game Arena that makes
              daily practice impossible to skip.
            </p>

            {/* Social proof */}
            <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"28px", flexWrap:"wrap" }}>
              <div
                style={{ display:"flex", alignItems:"center" }}
                role="img"
                aria-label="Profile pictures of students: Arjun Ravi, Meera Krishnan, Sreejith P., Anjali Nair"
              >
                {(["AR","MK","SP","AN"] as const).map((init, i) => (
                  <div key={init} aria-hidden="true" style={{ width:"32px", height:"32px", borderRadius:"50%", background:["rgba(255,98,0,0.3)","rgba(255,184,0,0.25)","rgba(100,200,255,0.2)","rgba(50,200,100,0.2)"][i], border:"2px solid #0B1E3D", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"10px", fontWeight:700, color:"#fff", marginLeft:i===0?0:"-10px", zIndex:4-i, position:"relative" }}>
                    {init}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize:"13px", fontWeight:700, color:"#fff", lineHeight:1.2 }}>5,200+ students preparing right now</div>
                <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.5)" }}>★★★★★ &nbsp;4.9 average rating</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="hero-ctas" style={{ display:"flex", gap:"14px", flexWrap:"wrap", marginBottom:"20px" }}>
              <a
                // href={LMS_FREE_TEST}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Sign up for 48 hour free demo — opens in new tab"
                className="hero-cta-btn"
                style={{ background:"linear-gradient(135deg,#FF6200,#FF4500)", color:"white", border:"none", padding:"16px 32px", borderRadius:"50px", fontFamily:"Nunito, sans-serif", fontSize:"17px", fontWeight:800, cursor:"pointer", boxShadow:"0 6px 30px rgba(255,98,0,0.5)", transition:"transform 0.2s, box-shadow 0.2s", display:"inline-flex", alignItems:"center", gap:"8px", textDecoration:"none" }}
                onMouseEnter={onPrimaryEnter}
                onMouseLeave={onPrimaryLeave}
              >
                🚀 Sign Up for 48 Hr Free Demo
              </a>

              <button
                className="hero-cta-btn"
                aria-label="See how CivilEzy works"
                style={{ background:"transparent", color:"#ffffff", border:"2px solid rgba(255,255,255,0.3)", padding:"14px 28px", borderRadius:"50px", fontFamily:"Nunito, sans-serif", fontSize:"16px", fontWeight:600, cursor:"pointer", transition:"border-color 0.2s, background 0.2s", display:"inline-flex", alignItems:"center", gap:"8px" }}
                onMouseEnter={onSecondaryEnter}
                onMouseLeave={onSecondaryLeave}
              >
                ▶ See How It Works
              </button>
            </div>

            {/* Trust micro-copy */}
            <p style={{ fontSize:"12px", color:"rgba(255,255,255,0.38)", marginBottom:"32px" }}>
              ✓ 48 Hr free access &nbsp;·&nbsp; ✓ Kerala PSC-specific questions
            </p>

            {/* Stats */}
            <dl style={{ display:"flex", gap:"28px", flexWrap:"wrap" }} aria-label="Platform statistics">
              {STATS.map(({ num, label }) => (
                <div key={label} style={{ textAlign:"center" }}>
                  <dt style={{ fontFamily:"Rajdhani, sans-serif", fontSize:"26px", fontWeight:700, background:"linear-gradient(135deg,#FF6200,#FFB800)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                    {num}
                  </dt>
                  <dd style={{ fontSize:"11px", color:"rgba(255,255,255,0.5)", marginTop:"-2px" }}>
                    {label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* ═══ RIGHT SIDE — Interactive Card ═══ */}
          <div style={{ position:"relative", animation:"heroFadeUp 0.7s 0.2s ease both" }}>

            {/* Floating badge top-right */}
            <div aria-hidden="true" style={{ position:"absolute", top:"-16px", right:"-16px", background:"rgba(11,30,61,0.9)", border:"1px solid rgba(255,98,0,0.4)", borderRadius:"12px", padding:"8px 14px", fontSize:"13px", fontWeight:700, backdropFilter:"blur(8px)", boxShadow:"0 8px 24px rgba(0,0,0,0.4)", color:mounted ? rank.color : "#FFB800", zIndex:2, whiteSpace:"nowrap" }}>
              {mounted ? `${rank.icon} Your Rank: ${rank.label}` : "🏆 Your Rank: —"}
            </div>

            {/* Glass card */}
            <div style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:"20px", padding:"24px", backdropFilter:"blur(10px)" }}>

              {/* Level selector */}
              <p id="level-selector-label" style={{ fontSize:"13px", color:"rgba(255,255,255,0.55)", marginBottom:"8px", fontWeight:700, letterSpacing:"0.5px" }}>
                EVALUATE YOURSELF
              </p>

              <div role="group" aria-labelledby="level-selector-label" style={{ display:"flex", gap:"10px", marginBottom:"20px" }}>
                <LevelBtn label="🔧 ITI"      isActive={activeLevel==="iti"} colorScheme="orange" onClick={() => setActiveLevel("iti")} />
                <LevelBtn label="📐 Diploma"  isActive={activeLevel==="dip"} colorScheme="gold"   onClick={() => setActiveLevel("dip")} />
                <LevelBtn label="🏗️ B.Tech"       isActive={activeLevel==="btech"}  colorScheme="blue"   onClick={() => setActiveLevel("btech")}  />
              </div>

              {/* Quiz */}
              <div role="region" aria-label="Sample quiz question" style={{ background:"rgba(0,0,0,0.3)", borderRadius:"14px", padding:"16px", marginBottom:"16px" }}>
                <p style={{ fontSize:"14px", fontWeight:600, marginBottom:"12px", lineHeight:1.5, color:"#fff" }}>
                  {quiz.question}
                </p>
                <div
                  style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}
                  role="group"
                  aria-label="Answer options"
                >
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
              <div style={{ display:"flex", alignItems:"center", gap:"10px", marginTop:"12px" }}>
                <span style={{ fontSize:"12px", color:"#FF8534", fontWeight:700, whiteSpace:"nowrap" }}>
                  ⚡ XP {mounted ? totalScore.toLocaleString() : "—"} / {mounted ? xpTarget.max.toLocaleString() : "—"}
                </span>
                <div
                  role="progressbar"
                  aria-valuenow={mounted ? totalScore : 0}
                  aria-valuemin={0}
                  aria-valuemax={mounted ? xpTarget.max : 500}
                  aria-label={mounted ? `XP progress: ${totalScore.toLocaleString()} of ${xpTarget.max.toLocaleString()}` : "XP progress loading"}
                  style={{ flex:1, height:"8px", background:"rgba(255,255,255,0.1)", borderRadius:"10px", overflow:"hidden" }}
                >
                  <div style={{ height:"100%", background:"linear-gradient(90deg,#FF6200,#FFB800)", borderRadius:"10px", width:xpWidth, transition:"width 1.5s ease" }} />
                </div>
                <span style={{ fontSize:"12px", color:"rgba(255,255,255,0.55)" }}>{mounted ? rank.label : "—"}</span>
              </div>

              {/* Streak row */}
              <div
                role="region"
                aria-label={`${streak}-day study streak`}
                style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(255,98,0,0.1)", border:"1px solid rgba(255,98,0,0.2)", borderRadius:"10px", padding:"10px 14px", marginTop:"12px" }}
              >
                <div style={{ display:"flex", alignItems:"center", gap:"8px", fontSize:"14px", fontWeight:700 }}>
                  <span aria-hidden="true">🔥</span>
                  <strong>{!mounted ? "Daily Streak" : streak > 0 ? `${streak}-Day Streak` : "Start Your Streak!"}</strong>
                </div>
                <div style={{ display:"flex", gap:"4px" }} aria-hidden="true">
                  {streakDays.map(({ id, letter, state }) => (
                    <StreakDay key={id} letter={letter} state={state} />
                  ))}
                </div>
              </div>

            </div>
            {/* END glass card */}

            {/* Floating badge bottom-left */}
            <div aria-hidden="true" style={{ position:"absolute", bottom:"-16px", left:"-16px", background:"rgba(11,30,61,0.9)", border:"1px solid rgba(255,98,0,0.4)", borderRadius:"12px", padding:"8px 14px", fontSize:"13px", fontWeight:700, backdropFilter:"blur(8px)", boxShadow:"0 8px 24px rgba(0,0,0,0.4)", color:"#64C8FF", zIndex:2, display:"flex", alignItems:"center", gap:"6px", whiteSpace:"nowrap" }}>
              <span style={{ width:"8px", height:"8px", borderRadius:"50%", background:"#32C864", flexShrink:0, animation:"pulseDot 1.5s infinite" }} />
              👥 {mounted ? onlineUsers : 200} students learning now
            </div>
          </div>

        </div>
      </section>

      {/* XP pop-up toast — role="status" announces to screen readers without interrupting */}
      {xpPop && (
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          style={{ position:"fixed", top:"50%", left:"50%", transform:"translate(-50%,-50%)", background:"linear-gradient(135deg,#FF6200,#FF8534)", color:"white", padding:"12px 24px", borderRadius:"30px", fontFamily:"Rajdhani, sans-serif", fontSize:"22px", fontWeight:700, zIndex:9999, pointerEvents:"none", animation:"xpPopUp 2s ease forwards", whiteSpace:"nowrap" }}
        >
          {xpPop}
        </div>
      )}
    </>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function LevelBtn({ label, isActive, colorScheme, onClick }: { label:string; isActive:boolean; colorScheme:"orange"|"gold"|"blue"; onClick:()=>void }) {
  const s = LEVEL_SCHEMES[colorScheme];
  return (
    <button
      onClick={onClick}
      aria-pressed={isActive}
      aria-label={`Select ${label.replace(/[^\w ]/g,"")} level`}
      style={{ flex:1, padding:"10px", borderRadius:"12px", border:s.border, cursor:"pointer", fontFamily:"Nunito, sans-serif", fontSize:"14px", fontWeight:700, transition:"all 0.2s", background:s.background, color:s.color, transform:isActive?"scale(1.05)":"scale(1)", boxShadow:isActive?s.activeBox:"none" }}
    >
      {label}
    </button>
  );
}

// Stable option hover handlers (outside component — no closure needed)
const onOptEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
  if ((e.currentTarget as HTMLButtonElement).disabled) return;
  e.currentTarget.style.background   = "rgba(255,98,0,0.2)";
  e.currentTarget.style.borderColor  = "#FF6200";
};
const onOptLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
  if ((e.currentTarget as HTMLButtonElement).disabled) return;
  e.currentTarget.style.background   = "rgba(255,255,255,0.06)";
  e.currentTarget.style.borderColor  = "rgba(255,255,255,0.1)";
};

function QuizOption({ label, state, disabled, onClick }: { label:string; state:AnswerState; disabled:boolean; onClick:()=>void }) {
  const s = ANSWER_STYLES[state];
  const isCorrect = state === "correct";
  const isWrong   = state === "wrong";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-pressed={isCorrect || isWrong ? true : undefined}
      aria-label={`${label}${isCorrect?" — correct":isWrong?" — incorrect":""}`}
      style={{ ...s, borderRadius:"8px", padding:"8px 12px", fontSize:"12px", cursor:disabled?"default":"pointer", transition:"all 0.2s", textAlign:"center", fontFamily:"Nunito, sans-serif", fontWeight:500, lineHeight:1.4 }}
      onMouseEnter={state==="unanswered" ? onOptEnter : undefined}
      onMouseLeave={state==="unanswered" ? onOptLeave : undefined}
    >
      {isCorrect ? `✓ ${label}` : label}
    </button>
  );
}

function StreakDay({ letter, state }: { letter:string; state:"done"|"today"|"miss" }) {
  return (
    <div style={{ width:"24px", height:"24px", borderRadius:"6px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"10px", fontWeight:700, ...STREAK_STYLES[state] }}>
      {letter}
    </div>
  );
}
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { HERO_DOMAINS, type HeroDomain } from "@/data/heroQuestions";
import { EXTERNAL_URLS } from "@/lib/constants";

// ─── Constants ───────────────────────────────────────────────────────────────
const LMS_FREE_TEST = EXTERNAL_URLS.demo;
const LMS_LOGIN= EXTERNAL_URLS.login

// ─── Rank System ────────────────────────────────────────────────────────────
interface RankInfo { label: string; icon: string; color: string; }

function getRank(score: number): RankInfo {
  if (score >= 5000) return { label: "Top Performer", icon: "🏆", color: "#FFB800" };
  if (score >= 2000) return { label: "Advanced",      icon: "🟣", color: "#C864FF" };
  if (score >= 500)  return { label: "Intermediate",   icon: "🔵", color: "#64C8FF" };
  return                     { label: "Beginner",       icon: "🟢", color: "#32C864" };
}

const STATS = [
  { num: "5,200+",  label: "Active Students" },
  { num: "2000",     label: "Rank Holders"    },
  { num: "50,000+", label: "PSC Questions"   },
  { num: "4.9★",    label: "Student Rating"  },
];

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

// ─── Hoisted style maps ─────────────────────────────────────────────────────
const LEVEL_SCHEMES = {
  orange: { background:"rgba(255,98,0,0.15)",   color:"#FF8534", border:"1px solid rgba(255,98,0,0.3)",    activeBox:"0 4px 15px rgba(255,98,0,0.35)"    },
  gold:   { background:"rgba(255,184,0,0.15)",  color:"#FFB800", border:"1px solid rgba(255,184,0,0.3)",   activeBox:"0 4px 15px rgba(255,184,0,0.35)"   },
  blue:   { background:"rgba(100,200,255,0.1)", color:"#64C8FF", border:"1px solid rgba(100,200,255,0.3)", activeBox:"0 4px 15px rgba(100,200,255,0.3)"  },
  green:  { background:"rgba(50,200,100,0.1)",  color:"#32C864", border:"1px solid rgba(50,200,100,0.3)",  activeBox:"0 4px 15px rgba(50,200,100,0.3)"  },
} as const;

const DOMAIN_COLOR: Record<HeroDomain, keyof typeof LEVEL_SCHEMES> = {
  iti: "orange", diploma: "gold", btech: "blue", surveyor: "green",
};

const STREAK_STYLES: Record<"done"|"today"|"miss", React.CSSProperties> = {
  done:  { background:"#FF6200",                color:"white" },
  today: { background:"rgba(255,98,0,0.3)",     border:"1px solid #FF6200", color:"#FF6200" },
  miss:  { background:"rgba(255,255,255,0.05)", color:"rgba(255,255,255,0.55)" },
};

// ─── Hero Component ──────────────────────────────────────────────────────────
export default function Hero() {
  const { profile } = useAuth();

  const [activeDomain, setActiveDomain] = useState<HeroDomain>("iti");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [showConversion, setShowConversion] = useState(false);
  const [quizDone, setQuizDone] = useState(false);

  const [mounted, setMounted] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [xpWidth, setXpWidth] = useState("0%");

  // ── Hydration guard ──
  useEffect(() => {
    setMounted(true);
    if (profile) {
      setTotalScore(profile.totalScore ?? 0);
      setStreak(profile.streak ?? 0);
    } else {
      setTotalScore(Math.floor(Math.random() * (1500 - 100) + 100));
      setStreak(0);
    }
  }, [profile]);

  const rank = useMemo(() => getRank(totalScore), [totalScore]);

  const xpTarget = useMemo(() => {
    const thresholds = [0, 500, 2000, 5000, 10000];
    let currentTierStart = 0;
    let nextTierEnd = 500;
    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (totalScore >= thresholds[i]) {
        currentTierStart = thresholds[i];
        nextTierEnd = thresholds[i + 1] ?? thresholds[i] + 5000;
        break;
      }
    }
    const range = nextTierEnd - currentTierStart;
    const progress = totalScore - currentTierStart;
    const pct = Math.min((progress / range) * 100, 100);
    return { current: totalScore, max: nextTierEnd, pct: `${pct.toFixed(1)}%` };
  }, [totalScore]);

  useEffect(() => {
    if (!mounted) return;
    const t = setTimeout(() => setXpWidth(xpTarget.pct), 500);
    return () => clearTimeout(t);
  }, [mounted, xpTarget.pct]);

  const streakDays = useMemo(() => {
    if (!mounted) return WEEK_LETTERS.map((letter, i) => ({ id: `${letter}${i}`, letter, state: "miss" as const }));
    const today = new Date().getDay();
    const dayIndex = today === 0 ? 6 : today - 1;
    return WEEK_LETTERS.map((letter, i) => {
      let state: "done" | "today" | "miss";
      if (i < dayIndex && i >= dayIndex - streak) state = "done";
      else if (i === dayIndex) state = streak > 0 ? "done" : "today";
      else state = "miss";
      return { id: `${letter}${i}`, letter, state };
    });
  }, [streak, mounted]);

  useEffect(() => {
    const updateUsers = () => setOnlineUsers(Math.floor(Math.random() * (300 - 100) + 100));
    updateUsers();
    const interval = setInterval(updateUsers, 6000);
    return () => clearInterval(interval);
  }, []);

  // ── Reset quiz when domain changes ──
  useEffect(() => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setQuizScore(0);
    setWrongCount(0);
    setShowConversion(false);
    setQuizDone(false);
  }, [activeDomain]);

  const domainConfig = HERO_DOMAINS.find(d => d.id === activeDomain)!;
  const questions = domainConfig.questions;
  const currentQ = questions[currentIndex];
  const TOTAL = questions.length;

  // ── Handle answer ──
  const handleAnswer = useCallback((optIndex: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optIndex);

    const isCorrect = optIndex === currentQ.correct;
    if (isCorrect) {
      setQuizScore(s => s + 1);
    } else {
      setWrongCount(w => w + 1);
      // Show conversion card on first wrong answer
      if (wrongCount === 0) {
        setShowConversion(true);
      }
    }

    // Auto advance after delay
    setTimeout(() => {
      if (currentIndex + 1 >= TOTAL) {
        setQuizDone(true);
      } else {
        setCurrentIndex(i => i + 1);
        setSelectedOption(null);
        setShowConversion(false);
      }
    }, 1200);
  }, [selectedOption, currentQ, currentIndex, TOTAL, wrongCount]);

  const handleRetry = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setQuizScore(0);
    setWrongCount(0);
    setShowConversion(false);
    setQuizDone(false);
  };

  return (
    <>
      <section
        aria-labelledby="hero-heading"
        style={{ minHeight: "100vh", padding: "40px 5% 60px", position: "relative", overflow: "hidden", display: "flex", alignItems: "center" }}
        className="hero-section-pad"
      >
        {/* Decorative backgrounds */}
        <div aria-hidden="true" style={{ position:"absolute", inset:0, zIndex:0, background:"radial-gradient(ellipse at 70% 50%,rgba(255,98,0,0.12) 0%,transparent 60%),radial-gradient(ellipse at 20% 80%,rgba(255,184,0,0.06) 0%,transparent 50%),linear-gradient(180deg,#0B1E3D 0%,#0A1B35 100%)" }} />
        <div aria-hidden="true" style={{ position:"absolute", inset:0, opacity:0.04, backgroundImage:"linear-gradient(rgba(255,98,0,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,98,0,0.5) 1px,transparent 1px)", backgroundSize:"60px 60px" }} />

        <div className="hero-content-grid" style={{ position:"relative", zIndex:1, display:"grid", gap:"4rem", alignItems:"center", width:"100%", maxWidth:"1300px", margin:"0 auto" }}>

          {/* ═══ LEFT SIDE ═══ */}
          <div style={{ animation:"heroFadeUp 0.7s ease forwards" }}>
            {/* Live badge */}
            <div aria-hidden="true" style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"rgba(255,98,0,0.15)", border:"1px solid rgba(255,98,0,0.4)", borderRadius:"30px", padding:"6px 16px", marginBottom:"20px", fontSize:"13px", fontWeight:600, color:"#FF8534" }}>
              <span style={{ width:"8px", height:"8px", borderRadius:"50%", background:"#FF6200", flexShrink:0, animation:"pulseDot 2s infinite" }} />
              Kerala&apos;s #1 PSC Civil Platform
            </div>

            {/* H1 */}
            <h1 id="hero-heading" style={{ fontFamily:"Rajdhani, sans-serif", lineHeight:1.1, marginBottom:"12px", fontWeight:700 }}>
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
                href={LMS_FREE_TEST}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Start Demo Course — opens in new tab"
                className="hero-cta-btn"
                style={{ background:"linear-gradient(135deg,#FF6200,#FF4500)", color:"white", border:"none", padding:"16px 32px", borderRadius:"50px", fontFamily:"Nunito, sans-serif", fontSize:"17px", fontWeight:800, cursor:"pointer", boxShadow:"0 6px 30px rgba(255,98,0,0.5)", transition:"transform 0.2s, box-shadow 0.2s", display:"inline-flex", alignItems:"center", gap:"8px", textDecoration:"none" }}
                onMouseEnter={onPrimaryEnter}
                onMouseLeave={onPrimaryLeave}
              >
                🚀 Start Demo Course
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

            <p style={{ fontSize:"12px", color:"rgba(255,255,255,0.38)", marginBottom:"32px" }}>
              ✓ Demo course access &nbsp;·&nbsp; ✓ Kerala PSC-specific questions
            </p>

            {/* Stats */}
            <dl style={{ display:"flex", gap:"28px", flexWrap:"wrap" }} aria-label="Platform statistics">
              {STATS.map(({ num, label }) => (
                <div key={label} style={{ textAlign:"center" }}>
                  <dt style={{ fontFamily:"Rajdhani, sans-serif", fontSize:"26px", fontWeight:700, background:"linear-gradient(135deg,#FF6200,#FFB800)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                    {num}
                  </dt>
                  <dd style={{ fontSize:"11px", color:"rgba(255,255,255,0.5)", marginTop:"-2px" }}>{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* ═══ RIGHT SIDE — PSC Challenge Teaser ═══ */}
          <div style={{ position:"relative", animation:"heroFadeUp 0.7s 0.2s ease both" }}>

            {/* Floating rank badge */}
            <div aria-hidden="true" style={{ position:"absolute", top:"-16px", right:"-16px", background:"rgba(11,30,61,0.9)", border:"1px solid rgba(255,98,0,0.4)", borderRadius:"12px", padding:"8px 14px", fontSize:"13px", fontWeight:700, backdropFilter:"blur(8px)", boxShadow:"0 8px 24px rgba(0,0,0,0.4)", color:mounted ? rank.color : "#FFB800", zIndex:2, whiteSpace:"nowrap" }}>
              {mounted ? `${rank.icon} Your Rank: ${rank.label}` : "🏆 Your Rank: —"}
            </div>

            {/* Glass card */}
            <div style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:"20px", padding:"24px", backdropFilter:"blur(10px)" }}>

              {/* SEO heading — visible, keyword-rich */}
              <h2 id="psc-challenge-heading" style={{ fontFamily:"Rajdhani, sans-serif", fontSize:"18px", fontWeight:700, color:"#fff", margin:"0 0 4px", lineHeight:1.3 }}>
                Evaluate YourSelf!
              </h2>
              <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.55)", marginBottom:"14px", lineHeight:1.5 }}>
                {domainConfig.seoSubtitle}
              </p>

              {/* Domain selector */}
              <div role="group" aria-label="Select exam category" style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:"8px", marginBottom:"16px" }}>
                {HERO_DOMAINS.map(d => (
                  <DomainBtn
                    key={d.id}
                    label={`${d.icon} ${d.label}`}
                    isActive={activeDomain === d.id}
                    colorScheme={DOMAIN_COLOR[d.id]}
                    onClick={() => setActiveDomain(d.id)}
                  />
                ))}
              </div>

              {/* ── Quiz / Result / Conversion ── */}
              {quizDone ? (
                /* ── Completion CTA ── */
                <div style={{ background:"rgba(0,0,0,0.3)", borderRadius:"14px", padding:"20px", textAlign:"center" }}>
                  <div style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:"52px", height:"52px", borderRadius:"50%", background: quizScore >= 4 ? "rgba(50,200,100,0.2)" : quizScore >= 2 ? "rgba(255,184,0,0.2)" : "rgba(255,100,100,0.15)", border: `2px solid ${quizScore >= 4 ? "#32C864" : quizScore >= 2 ? "#FFB800" : "#FF6464"}`, fontSize:"18px", fontWeight:800, color: quizScore >= 4 ? "#32C864" : quizScore >= 2 ? "#FFB800" : "#FF6464", fontFamily:"Rajdhani, sans-serif", marginBottom:"12px" }}>
                    {quizScore}/{TOTAL}
                  </div>

                  <h3 style={{ fontFamily:"Rajdhani, sans-serif", fontSize:"17px", fontWeight:700, color:"#fff", marginBottom:"6px" }}>
                    Ready for Real PSC Preparation?
                  </h3>
                  <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.6)", marginBottom:"16px", lineHeight:1.5 }}>
                    {quizScore >= 4
                      ? "Great job! You have strong fundamentals. Take it further with structured exam prep."
                      : quizScore >= 2
                      ? "Good attempt! Structured practice will help you crack the real exam."
                      : "PSC questions are tougher than they look. Prepare smarter with CivilEzy."}
                  </p>

                  <div style={{ display:"flex", gap:"8px", justifyContent:"center", flexWrap:"wrap" }}>
                    <a
                      href={LMS_LOGIN}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ background:"linear-gradient(135deg,#FF6200,#FF4500)", color:"white", border:"none", padding:"10px 22px", borderRadius:"10px", fontFamily:"Nunito, sans-serif", fontSize:"13px", fontWeight:800, cursor:"pointer", textDecoration:"none", display:"inline-flex", alignItems:"center", gap:"6px", boxShadow:"0 4px 16px rgba(255,98,0,0.4)" }}
                    >
                      🚀 Enroll Now
                    </a>
                    <Link
                      href="/game-arena"
                      style={{ background:"rgba(255,98,0,0.15)", border:"1px solid rgba(255,98,0,0.4)", color:"#FF8534", borderRadius:"10px", padding:"10px 22px", fontSize:"13px", fontWeight:700, cursor:"pointer", fontFamily:"Nunito, sans-serif", textDecoration:"none", display:"inline-flex", alignItems:"center", gap:"6px" }}
                    >
                      🎮 Go to Game Arena
                    </Link>
                  </div>

                  <button
                    onClick={handleRetry}
                    style={{ marginTop:"12px", background:"none", border:"none", color:"rgba(255,255,255,0.45)", fontSize:"12px", fontWeight:600, cursor:"pointer", fontFamily:"Nunito, sans-serif", textDecoration:"underline", textUnderlineOffset:"3px" }}
                  >
                    Try Again
                  </button>
                </div>
              ) : showConversion && selectedOption !== null ? (
                /* ── Wrong answer conversion card (shown briefly) ── */
                <div style={{ background:"rgba(0,0,0,0.3)", borderRadius:"14px", padding:"16px" }}>
                  {/* Still show question result */}
                  <p style={{ fontSize:"14px", fontWeight:600, marginBottom:"10px", lineHeight:1.5, color:"#fff" }}>
                    {currentQ.question}
                  </p>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px", marginBottom:"14px" }}>
                    {currentQ.options.map((opt, i) => {
                      const isCorrect = i === currentQ.correct;
                      const isWrong = i === selectedOption && !isCorrect;
                      let bg = "rgba(255,255,255,0.06)"; let bdr = "1px solid rgba(255,255,255,0.1)"; let clr = "rgba(255,255,255,0.85)";
                      if (isCorrect) { bg = "rgba(50,200,100,0.2)"; bdr = "1px solid #32C864"; clr = "#32C864"; }
                      else if (isWrong) { bg = "rgba(255,50,50,0.2)"; bdr = "1px solid #FF3232"; clr = "#FF6464"; }
                      else if (selectedOption !== null) { clr = "rgba(255,255,255,0.4)"; }
                      return (
                        <div key={i} style={{ background:bg, border:bdr, color:clr, borderRadius:"8px", padding:"8px 12px", fontSize:"12px", textAlign:"center", fontFamily:"Nunito, sans-serif", fontWeight:500, lineHeight:1.4 }}>
                          {isCorrect ? `✓ ${opt}` : opt}
                        </div>
                      );
                    })}
                  </div>
                  {/* Conversion nudge */}
                  <div style={{ background:"rgba(255,98,0,0.08)", border:"1px solid rgba(255,98,0,0.25)", borderRadius:"10px", padding:"12px", textAlign:"center" }}>
                    <p style={{ fontSize:"13px", fontWeight:700, color:"#FF8534", marginBottom:"4px" }}>
                      PSC questions are tougher than they look.
                    </p>
                    <p style={{ fontSize:"12px", color:"rgba(255,255,255,0.5)", marginBottom:"0" }}>
                      Prepare smarter with CivilEzy.
                    </p>
                  </div>
                </div>
              ) : (
                /* ── Active quiz ── */
                <div role="region" aria-labelledby="psc-challenge-heading" style={{ background:"rgba(0,0,0,0.3)", borderRadius:"14px", padding:"16px" }}>
                  {/* Progress */}
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"10px" }}>
                    <span style={{ fontSize:"11px", fontWeight:700, color:"rgba(255,255,255,0.45)", letterSpacing:"0.5px" }}>
                      QUESTION {currentIndex + 1}/{TOTAL}
                    </span>
                    <div style={{ display:"flex", gap:"4px" }}>
                      {Array.from({ length: TOTAL }).map((_, i) => (
                        <div key={i} style={{ width:"6px", height:"6px", borderRadius:"50%", background: i < currentIndex ? "#FF6200" : i === currentIndex ? "#FFB800" : "rgba(255,255,255,0.15)", transition:"background 0.3s" }} />
                      ))}
                    </div>
                  </div>

                  <p style={{ fontSize:"14px", fontWeight:600, marginBottom:"12px", lineHeight:1.5, color:"#fff" }}>
                    {currentQ.question}
                  </p>

                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }} role="group" aria-label="Answer options">
                    {currentQ.options.map((opt, i) => {
                      const revealed = selectedOption !== null;
                      const isCorrect = revealed && i === currentQ.correct;
                      const isWrong = revealed && i === selectedOption && i !== currentQ.correct;

                      let bg = "rgba(255,255,255,0.06)"; let bdr = "1px solid rgba(255,255,255,0.1)"; let clr = "rgba(255,255,255,0.85)"; let cursor = "pointer";
                      if (isCorrect) { bg = "rgba(50,200,100,0.2)"; bdr = "1px solid #32C864"; clr = "#32C864"; cursor = "default"; }
                      else if (isWrong) { bg = "rgba(255,50,50,0.2)"; bdr = "1px solid #FF3232"; clr = "#FF6464"; cursor = "default"; }
                      else if (revealed) { clr = "rgba(255,255,255,0.4)"; cursor = "default"; }

                      return (
                        <button
                          key={`${activeDomain}-${currentIndex}-${i}`}
                          onClick={() => handleAnswer(i)}
                          disabled={revealed}
                          style={{ background:bg, border:bdr, color:clr, borderRadius:"8px", padding:"8px 12px", fontSize:"12px", cursor, transition:"all 0.18s", textAlign:"center", fontFamily:"Nunito, sans-serif", fontWeight:500, lineHeight:1.4 }}
                          onMouseEnter={(e) => { if (!revealed) { e.currentTarget.style.background = "rgba(255,98,0,0.2)"; e.currentTarget.style.borderColor = "#FF6200"; }}}
                          onMouseLeave={(e) => { if (!revealed) { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}}
                        >
                          {isCorrect ? `✓ ${opt}` : opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* XP bar */}
              <div style={{ display:"flex", alignItems:"center", gap:"10px", marginTop:"12px" }}>
                <span style={{ fontSize:"12px", color:"#FF8534", fontWeight:700, whiteSpace:"nowrap" }}>
                  ⚡ XP {mounted ? totalScore.toLocaleString() : "—"} / {mounted ? xpTarget.max.toLocaleString() : "—"}
                </span>
                <div role="progressbar" aria-valuenow={mounted ? totalScore : 0} aria-valuemin={0} aria-valuemax={mounted ? xpTarget.max : 500} aria-label={mounted ? `XP progress: ${totalScore.toLocaleString()} of ${xpTarget.max.toLocaleString()}` : "XP progress loading"} style={{ flex:1, height:"8px", background:"rgba(255,255,255,0.1)", borderRadius:"10px", overflow:"hidden" }}>
                  <div style={{ height:"100%", background:"linear-gradient(90deg,#FF6200,#FFB800)", borderRadius:"10px", width:xpWidth, transition:"width 1.5s ease" }} />
                </div>
                <span style={{ fontSize:"12px", color:"rgba(255,255,255,0.55)" }}>{mounted ? rank.label : "—"}</span>
              </div>

              {/* Streak row */}
              <div role="region" aria-label={`${streak}-day study streak`} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(255,98,0,0.1)", border:"1px solid rgba(255,98,0,0.2)", borderRadius:"10px", padding:"10px 14px", marginTop:"12px" }}>
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

            {/* Floating online badge */}
            <div aria-hidden="true" style={{ position:"absolute", bottom:"-16px", left:"-16px", background:"rgba(11,30,61,0.9)", border:"1px solid rgba(255,98,0,0.4)", borderRadius:"12px", padding:"8px 14px", fontSize:"13px", fontWeight:700, backdropFilter:"blur(8px)", boxShadow:"0 8px 24px rgba(0,0,0,0.4)", color:"#64C8FF", zIndex:2, display:"flex", alignItems:"center", gap:"6px", whiteSpace:"nowrap" }}>
              <span style={{ width:"8px", height:"8px", borderRadius:"50%", background:"#32C864", flexShrink:0, animation:"pulseDot 1.5s infinite" }} />
              👥 {mounted ? onlineUsers : 200} students learning now
            </div>
          </div>
        </div>
      </section>

      {/* ── SEO: Structured crawlable question content ──
          Hidden visually but present in HTML for search engine indexing.
          Uses semantic <article> markup with proper headings. */}
      <section aria-hidden="true" style={{ position:"absolute", width:"1px", height:"1px", overflow:"hidden", clip:"rect(0,0,0,0)", whiteSpace:"nowrap" }}>
        <h2>Kerala PSC Civil Engineering Sample Questions</h2>
        {HERO_DOMAINS.map(domain => (
          <article key={domain.id}>
            <h3>Kerala PSC {domain.label} Civil Engineering Questions</h3>
            <p>{domain.seoSubtitle}</p>
            <ol>
              {domain.questions.map((q, i) => (
                <li key={i}>
                  <p><strong>{q.question}</strong></p>
                  <ul>
                    {q.options.map((opt, j) => (
                      <li key={j}>{j === q.correct ? <strong>{opt} (Correct Answer)</strong> : opt}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </article>
        ))}
      </section>
    </>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function DomainBtn({ label, isActive, colorScheme, onClick }: { label:string; isActive:boolean; colorScheme:keyof typeof LEVEL_SCHEMES; onClick:()=>void }) {
  const s = LEVEL_SCHEMES[colorScheme];
  return (
    <button
      onClick={onClick}
      aria-pressed={isActive}
      style={{ padding:"9px 4px", borderRadius:"10px", border:s.border, cursor:"pointer", fontFamily:"Nunito, sans-serif", fontSize:"12px", fontWeight:700, transition:"all 0.2s", background:s.background, color:s.color, transform:isActive?"scale(1.05)":"scale(1)", boxShadow:isActive?s.activeBox:"none", whiteSpace:"nowrap" }}
    >
      {label}
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

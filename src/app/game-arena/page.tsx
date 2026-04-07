"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Domain, Difficulty, Question } from "@/data/quesions";
import { SUBJECTS_BY_DOMAIN, DIFFICULTY_COUNTS, getQuestions } from "@/data/quesions";

// ─── Types ──────────────────────────────────────────────────────────────────
type Screen = "setup-domain" | "setup-subject" | "setup-difficulty" | "playing" | "result";

// ─── LOGIC: motivational messages (unchanged) ────────────────────────────────
function getMotivation(pct: number): { emoji: string; title: string; msg: string; color: string } {
  if (pct >= 90) return { emoji: "🏆", color: "#FFB800", title: "Exceptional! Rank Holder Material.", msg: "You are in the top percentile. This score in the real exam puts you in the first 10 ranks. Keep this consistency and the government job is yours." };
  if (pct >= 75) return { emoji: "🔥", color: "#FF8534", title: "Strong Performance! Almost There.", msg: "You are performing well above average. A focused 30-day revision plan will push you into the top rank bracket. You are very close." };
  if (pct >= 55) return { emoji: "⚡", color: "#64C8FF", title: "Good Start — Structured Practice Needed.", msg: "Your foundation is solid. The gap to a rank is just consistency. Daily 25-question practice sessions for 6 weeks will transform your score." };
  if (pct >= 35) return { emoji: "📘", color: "#A78BFA", title: "Keep Going — You Can Do This.", msg: "Every rank holder started somewhere. Your weak areas are now visible — that is the most valuable thing. Use Civilezy's smart lessons to fill those gaps." };
  return { emoji: "🌱", color: "#32C864", title: "Your Journey Starts Now.", msg: "Do not be discouraged — this score shows exactly where to focus. Start with the Smart Lessons on Civilezy and attempt this again in 2 weeks. The improvement will surprise you." };
}

// ─── LOGIC: timer hook (unchanged) ──────────────────────────────────────────
function useTimer(initialSecs: number, running: boolean) {
  const [secs, setSecs] = useState(initialSecs);
  useEffect(() => {
    if (!running) return;
    if (secs <= 0) return;
    const id = setInterval(() => setSecs(s => s - 1), 1000);
    return () => clearInterval(id);
  }, [running, secs]);
  return secs;
}

// ─── Sound helper ────────────────────────────────────────────────────────────
function playSound(type: "correct" | "wrong") {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    if (type === "correct") {
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.setValueAtTime(660, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start(); osc.stop(ctx.currentTime + 0.4);
    } else {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.setValueAtTime(140, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start(); osc.stop(ctx.currentTime + 0.35);
    }
  } catch { /* audio not supported */ }
}

// ─── Main page ───────────────────────────────────────────────────────────────
export default function GameArenaPage() {
  // ── All state (logic unchanged) ─────────────────────────────────
  const [screen,     setScreen]     = useState<Screen>("setup-domain");
  const [domain,     setDomain]     = useState<Domain>("diploma");
  const [subjects,   setSubjects]   = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [questions,    setQuestions]    = useState<Question[]>([]);
  const [qIndex,       setQIndex]       = useState(0);
  const [selected,     setSelected]     = useState<number | null>(null);
  const [answered,     setAnswered]     = useState(false);
  const [score,        setScore]        = useState(0);
  const [xp,           setXp]           = useState(0);
  const [streak,       setStreak]       = useState(0);
  const [bestStreak,   setBestStreak]   = useState(0);
  const [showXpPop,    setShowXpPop]    = useState<string | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeUsed,     setTimeUsed]     = useState(0);
  const [fadeIn,       setFadeIn]       = useState(true);
  const startTimeRef = useRef<number>(0);

  const TOTAL_SECS = 90;
  const secsLeft   = useTimer(TOTAL_SECS, timerRunning && !answered);
  const currentQ   = questions[qIndex];
  const totalQ     = questions.length;

  // Time up auto-submit (logic unchanged)
  useEffect(() => {
    if (timerRunning && secsLeft === 0 && !answered) handleAnswer(-1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secsLeft, timerRunning, answered]);

  // ── Start game (logic unchanged) ────────────────────────────────
  function startGame() {
    const qs = getQuestions(domain, subjects, difficulty, DIFFICULTY_COUNTS[difficulty]);
    setQuestions(qs);
    setQIndex(0); setScore(0); setXp(0); setStreak(0); setBestStreak(0);
    setSelected(null); setAnswered(false);
    startTimeRef.current = Date.now();
    setTimerRunning(true);
    setFadeIn(true);
    setScreen("playing");
  }

  // ── Handle answer (logic unchanged + sound added) ────────────────
  function handleAnswer(optionIndex: number) {
    if (answered) return;
    setAnswered(true);
    setTimerRunning(false);
    setSelected(optionIndex);

    const isCorrect = optionIndex === currentQ?.correct;
    if (isCorrect) {
      playSound("correct");
      const earnedXp = (currentQ.xp ?? 10) * (streak >= 3 ? 2 : 1);
      setScore(s => s + 1);
      setXp(x => x + earnedXp);
      setStreak(s => { const next = s + 1; setBestStreak(b => Math.max(b, next)); return next; });
      setShowXpPop(`+${earnedXp} XP${streak >= 2 ? " 🔥" : " ✓"}`);
    } else {
      playSound("wrong");
      setStreak(0);
      setShowXpPop(optionIndex === -1 ? "⏰ Time Up!" : "✗ Wrong");
    }
    setTimeout(() => setShowXpPop(null), 1800);
  }

  // ── Next question (logic unchanged + fade) ───────────────────────
  function nextQuestion() {
    const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
    setTimeUsed(elapsed);
    if (qIndex + 1 >= totalQ) {
      setTimerRunning(false);
      setScreen("result");
    } else {
      setFadeIn(false);
      setTimeout(() => {
        setQIndex(i => i + 1);
        setSelected(null);
        setAnswered(false);
        setTimerRunning(true);
        setFadeIn(true);
      }, 200);
    }
  }

  // ── Toggle subject (logic unchanged) ────────────────────────────
  const toggleSubject = useCallback((s: string) => {
    setSubjects(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  }, []);

  // ════════════════════════════════════════════════════════════════
  // SCREEN: SETUP DOMAIN
  // ════════════════════════════════════════════════════════════════
  if (screen === "setup-domain") return (
    <GameShell>
      <SetupCard step={1} title="Select Your Domain" sub="Choose the exam pool that matches your qualification">
        <div className="flex flex-col gap-3">
          {(["iti","diploma","btech"] as Domain[]).map(d => {
            const meta = {
              iti:     { emoji:"🔧", label:"ITI Civil",    desc:"KWA Helper · PWD Mazdoor · LSGD posts",        color:"rgba(255,98,0,0.15)",   border:"rgba(255,98,0,0.5)"    },
              diploma: { emoji:"📐", label:"Diploma Civil", desc:"Overseer · Technical Assistant · Site Supervisor", color:"rgba(255,184,0,0.12)", border:"rgba(255,184,0,0.5)"  },
              btech:   { emoji:"🏗️", label:"BTech / AE",   desc:"Assistant Engineer · KWA AE · PWD AE",         color:"rgba(100,200,255,0.1)", border:"rgba(100,200,255,0.5)" },
            }[d];
            const active = domain === d;
            return (
              <button key={d}
                onClick={() => { setDomain(d); setSubjects([]); setScreen("setup-subject"); }}
                className="flex items-center gap-4 rounded-2xl p-5 text-left transition-all duration-200 hover:scale-[1.01]"
                style={{ background: active ? meta.color : "rgba(255,255,255,0.04)", border:`2px solid ${active ? meta.border : "rgba(255,255,255,0.08)"}`, boxShadow: active ? `0 0 20px ${meta.color}` : "none" }}
              >
                <span className="text-3xl">{meta.emoji}</span>
                <div>
                  <div style={{ fontFamily:"Rajdhani, sans-serif" }} className="text-xl font-bold text-white">{meta.label}</div>
                  <div className="text-sm text-white/50 mt-0.5">{meta.desc}</div>
                </div>
                {active && <span className="ml-auto text-orange-400 text-lg">✓</span>}
              </button>
            );
          })}
        </div>
      </SetupCard>
    </GameShell>
  );

  // ════════════════════════════════════════════════════════════════
  // SCREEN: SETUP SUBJECT
  // ════════════════════════════════════════════════════════════════
  if (screen === "setup-subject") {
    const subs = SUBJECTS_BY_DOMAIN[domain];
    return (
      <GameShell>
        <SetupCard step={2} title="Select Subjects" sub="Choose topics (leave empty for all)" onBack={() => setScreen("setup-domain")}>
          <div className="flex flex-wrap gap-2 mb-6">
            {subs.map(s => {
              const on = subjects.includes(s);
              return (
                <button key={s} onClick={() => toggleSubject(s)}
                  className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105"
                  style={{ background: on ? "rgba(255,98,0,0.2)" : "rgba(255,255,255,0.06)", border:`1px solid ${on ? "#FF6200" : "rgba(255,255,255,0.12)"}`, color: on ? "#FF8534" : "rgba(255,255,255,0.75)", boxShadow: on ? "0 0 12px rgba(255,98,0,0.2)" : "none" }}>
                  {s}
                </button>
              );
            })}
          </div>
          <GlowBtn onClick={() => setScreen("setup-difficulty")}>
            {subjects.length === 0 ? "All Subjects →" : `${subjects.length} Selected →`}
          </GlowBtn>
        </SetupCard>
      </GameShell>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // SCREEN: SETUP DIFFICULTY
  // ════════════════════════════════════════════════════════════════
  if (screen === "setup-difficulty") return (
    <GameShell>
      <SetupCard step={3} title="Select Difficulty" sub="Choose your challenge level" onBack={() => setScreen("setup-subject")}>
        <div className="flex flex-col gap-3 mb-6">
          {([
            { key:"easy",   emoji:"🌱", label:"Easy",   desc:`${DIFFICULTY_COUNTS.easy} questions · Basics`,        color:"rgba(50,200,100,0.15)",  border:"rgba(50,200,100,0.5)"  },
            { key:"medium", emoji:"⚡", label:"Medium", desc:`${DIFFICULTY_COUNTS.medium} questions · Core topics`,  color:"rgba(255,184,0,0.12)",   border:"rgba(255,184,0,0.5)"  },
            { key:"hard",   emoji:"🔥", label:"Hard",   desc:`${DIFFICULTY_COUNTS.hard} questions · PSC-level`,      color:"rgba(255,98,0,0.15)",    border:"rgba(255,98,0,0.5)"   },
          ] as const).map(d => {
            const active = difficulty === d.key;
            return (
              <button key={d.key} onClick={() => setDifficulty(d.key as Difficulty)}
                className="flex items-center gap-4 rounded-2xl p-5 text-left transition-all duration-200 hover:scale-[1.01]"
                style={{ background: active ? d.color : "rgba(255,255,255,0.04)", border:`2px solid ${active ? d.border : "rgba(255,255,255,0.08)"}`, boxShadow: active ? `0 0 20px ${d.color}` : "none" }}>
                <span className="text-3xl">{d.emoji}</span>
                <div>
                  <div style={{ fontFamily:"Rajdhani, sans-serif" }} className="text-xl font-bold text-white">{d.label}</div>
                  <div className="text-sm text-white/50 mt-0.5">{d.desc}</div>
                </div>
                {active && <span className="ml-auto text-orange-400 text-lg">✓</span>}
              </button>
            );
          })}
        </div>
        <GlowBtn onClick={startGame}>🎮 Start Game →</GlowBtn>
      </SetupCard>
    </GameShell>
  );

  // ════════════════════════════════════════════════════════════════
  // SCREEN: PLAYING
  // ════════════════════════════════════════════════════════════════
  if (screen === "playing" && currentQ) {
    const progressPct = totalQ > 0 ? ((qIndex + 1) / totalQ) * 100 : 0;
    const timerPct    = (secsLeft / TOTAL_SECS) * 100;
    const timerColor  = secsLeft > 30 ? "#22c55e" : secsLeft > 10 ? "#eab308" : "#ef4444";
    const timerGlow   = secsLeft > 30 ? "rgba(34,197,94,0.4)" : secsLeft > 10 ? "rgba(234,179,8,0.4)" : "rgba(239,68,68,0.4)";

    return (
      <GameShell>
        {/* ── XP Float pop ──── */}
        {showXpPop && (
          <div className="fixed top-1/2 left-1/2 z-50 pointer-events-none"
            style={{ transform:"translate(-50%,-50%)", animation:"xpFloat 1.8s ease forwards" }}>
            <div className="px-6 py-3 rounded-full text-white font-bold text-2xl whitespace-nowrap"
              style={{ fontFamily:"Rajdhani, sans-serif", background:"linear-gradient(135deg,#FF6200,#FF8534)", boxShadow:"0 0 30px rgba(255,98,0,0.6)" }}>
              {showXpPop}
            </div>
          </div>
        )}

        <div style={{ opacity: fadeIn ? 1 : 0, transition:"opacity 0.2s ease" }}>

          {/* ── Top HUD ──────── */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            {/* Left: Q counter + XP */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-lg text-orange-400"
                style={{ background:"rgba(255,98,0,0.15)", border:"1px solid rgba(255,98,0,0.3)" }}>
                Q {qIndex + 1}/{totalQ}
              </span>
              <span className="text-sm font-semibold text-white/60">
                ⚡ <span className="text-orange-400 font-bold">{xp}</span> XP
              </span>
              {streak >= 2 && (
                <span className="text-xs font-bold px-3 py-1 rounded-lg animate-pulse"
                  style={{ background:"rgba(255,98,0,0.15)", border:"1px solid rgba(255,98,0,0.3)", color:"#FF8534" }}>
                  🔥 {streak}x
                </span>
              )}
            </div>

            {/* Right: Circular timer */}
            <div className="relative w-12 h-12">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
                <circle cx="24" cy="24" r="20" fill="none"
                  stroke={timerColor} strokeWidth="4" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 20}`}
                  strokeDashoffset={`${2 * Math.PI * 20 * (1 - timerPct / 100)}`}
                  style={{ transition:"stroke-dashoffset 1s linear, stroke 0.5s", filter:`drop-shadow(0 0 6px ${timerGlow})` }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold"
                style={{ color:timerColor, fontFamily:"Rajdhani, sans-serif" }}>
                {secsLeft}
              </span>
            </div>
          </div>

          {/* ── Progress bar ─── */}
          <div className="h-1 rounded-full mb-6 overflow-hidden" style={{ background:"rgba(255,255,255,0.07)" }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width:`${progressPct}%`, background:"linear-gradient(90deg,#FF6200,#FF8534)", boxShadow:"0 0 8px rgba(255,98,0,0.5)" }} />
          </div>

          {/* ── Question card ─── */}
          <div className="rounded-2xl p-4 sm:p-6 mb-5"
            style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", backdropFilter:"blur(12px)", boxShadow:"0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.04)" }}>
            <div className="text-xs font-bold tracking-widest text-orange-400 mb-3 uppercase">
              {currentQ.subject}
            </div>
            <p className="text-base font-semibold text-white leading-relaxed">
              {currentQ.question}
            </p>
          </div>

          {/* ── Options ─────────── */}
          <div className="flex flex-col gap-3 w-full mb-5">
            {currentQ.options.map((opt, i) => {
              const isSelected  = selected === i;
              const isCorrect   = i === currentQ.correct;
              const showCorrect = answered && isCorrect;
              const showWrong   = answered && isSelected && !isCorrect;

              let bg     = "rgba(255,255,255,0.05)";
              let border = "rgba(255,255,255,0.09)";
              let color  = "rgba(255,255,255,0.88)";
              let shadow = "none";
              let label  = String.fromCharCode(65 + i);
              let labelBg = "rgba(255,255,255,0.08)";
              let labelColor = "rgba(255,255,255,0.6)";

              if (showCorrect) {
                bg = "rgba(34,197,94,0.15)"; border = "#22c55e"; color = "#4ade80";
                shadow = "0 0 20px rgba(34,197,94,0.15)"; label = "✓";
                labelBg = "rgba(34,197,94,0.2)"; labelColor = "#4ade80";
              } else if (showWrong) {
                bg = "rgba(239,68,68,0.15)"; border = "#ef4444"; color = "#f87171";
                shadow = "0 0 20px rgba(239,68,68,0.1)"; label = "✗";
                labelBg = "rgba(239,68,68,0.2)"; labelColor = "#f87171";
              } else if (isSelected) {
                bg = "rgba(255,98,0,0.12)"; border = "#FF6200";
                labelBg = "rgba(255,98,0,0.25)"; labelColor = "#FF8534";
              }

              return (
                <button key={i} onClick={() => handleAnswer(i)} disabled={answered}
                  className="w-full flex items-center gap-3 rounded-xl p-3 sm:p-4 text-left transition-all duration-200"
                  style={{ background:bg, border:`1px solid ${border}`, color, boxShadow:shadow,
                    cursor:answered?"default":"pointer",
                  }}
                  onMouseEnter={e => { if (!answered) { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.09)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)"; } }}
                  onMouseLeave={e => { if (!answered) { (e.currentTarget as HTMLElement).style.background = bg; (e.currentTarget as HTMLElement).style.borderColor = border; } }}
                >
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background:labelBg, color:labelColor }}>
                    {label}
                  </span>
                  <span className="text-sm leading-snug font-medium">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* ── Explanation + Next ─── */}
          {answered && (
            <div style={{ animation:"heroFadeUp 0.35s ease forwards" }}>
              {currentQ.explanation && (
                <div className="rounded-xl px-4 py-3 mb-4 text-sm leading-relaxed"
                  style={{ background:"rgba(255,184,0,0.08)", border:"1px solid rgba(255,184,0,0.2)", color:"rgba(255,255,255,0.8)" }}>
                  💡 {currentQ.explanation}
                </div>
              )}
              <GlowBtn onClick={nextQuestion}>
                {qIndex + 1 >= totalQ ? "🏁 See Results" : "Next →"}
              </GlowBtn>
            </div>
          )}
        </div>
      </GameShell>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // SCREEN: RESULT
  // ════════════════════════════════════════════════════════════════
  if (screen === "result") {
    const pct        = totalQ > 0 ? Math.round((score / totalQ) * 100) : 0;
    const motivation = getMotivation(pct);
    const mins       = Math.floor(timeUsed / 60);
    const secs2      = timeUsed % 60;

    return (
      <GameShell>
        <div className="text-center" style={{ animation:"heroFadeUp 0.6s ease forwards" }}>

          {/* ── Score ring ─────── */}
          <div className="relative mx-auto mb-6" style={{ width:150, height:150 }}>
            <svg width="150" height="150" style={{ transform:"rotate(-90deg)" }}>
              <circle cx="75" cy="75" r="64" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10" />
              <circle cx="75" cy="75" r="64" fill="none"
                stroke={pct >= 75 ? "#FF6200" : pct >= 55 ? "#FFB800" : "#64C8FF"}
                strokeWidth="10" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 64}`}
                strokeDashoffset={`${2 * Math.PI * 64 * (1 - pct / 100)}`}
                style={{ transition:"stroke-dashoffset 1.2s ease", filter:`drop-shadow(0 0 10px ${pct >= 75 ? "rgba(255,98,0,0.6)" : "rgba(255,184,0,0.5)"})` }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span style={{ background:`linear-gradient(135deg,${motivation.color},#FFB800)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", fontFamily:"Rajdhani, sans-serif", fontSize:"38px", fontWeight:700, lineHeight:"1" }}>
                {pct}%
              </span>
              <span className="text-xs text-white/40 mt-1">accuracy</span>
            </div>
          </div>

          {/* ── Score headline ── */}
          <h1 style={{ fontFamily:"Rajdhani, sans-serif" }} className="text-4xl font-bold text-white mb-1">
            {score} / {totalQ} Correct
          </h1>
          <p className="text-sm text-white/40 mb-7">
            {mins}m {secs2}s &nbsp;·&nbsp; ⚡ {xp} XP &nbsp;·&nbsp; 🔥 {bestStreak} best streak
          </p>

          {/* ── Stat cards ────── */}
          <div className="flex justify-center flex-wrap gap-3 mb-7">
            {[
              { label:"Score",    val:`${score}/${totalQ}`, color:"#FF8534" },
              { label:"Accuracy", val:`${pct}%`,           color: pct>=75?"#22c55e":pct>=50?"#eab308":"#FF8534" },
              { label:"XP",       val:`+${xp}`,            color:"#FFB800" },
              { label:"Streak",   val:`${bestStreak}🔥`,   color:"#FF6200" },
            ].map(s => (
              <div key={s.label} className="rounded-2xl px-5 py-3 text-center min-w-[88px]"
                style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.09)", backdropFilter:"blur(8px)" }}>
                <div style={{ fontFamily:"Rajdhani, sans-serif", color:s.color }} className="text-2xl font-bold">{s.val}</div>
                <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* ── Motivation card ─ */}
          <div className="rounded-2xl p-5 mb-5 text-left"
            style={{ background:"rgba(255,255,255,0.04)", border:`1px solid ${motivation.color}33`, animation:"heroFadeUp 0.7s 0.3s ease both" }}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{motivation.emoji}</span>
              <span style={{ fontFamily:"Rajdhani, sans-serif", color:motivation.color }} className="text-xl font-bold">
                {motivation.title}
              </span>
            </div>
            <p className="text-sm text-white/75 leading-relaxed">{motivation.msg}</p>
          </div>

          {/* ── Conversion CTA ── */}
          <div className="rounded-2xl p-6 mb-4"
            style={{ background:"linear-gradient(135deg,#1A0800,#2A1000)", border:"2px solid rgba(255,98,0,0.4)", boxShadow:"0 0 40px rgba(255,98,0,0.15), inset 0 1px 0 rgba(255,255,255,0.05)", animation:"heroFadeUp 0.7s 0.5s ease both" }}>
            <div className="text-xs font-bold tracking-widest text-orange-400 uppercase mb-2">🎯 Ready to Rank?</div>
            <h2 style={{ fontFamily:"Rajdhani, sans-serif" }} className="text-2xl font-bold text-white mb-2 leading-tight">
              Improve your rank with the full Civilezy course
            </h2>
            <p className="text-sm text-white/55 leading-relaxed mb-5">
              Pool-mapped mock tests · Malayalam audio · Smart analytics · 100+ department papers
            </p>

            <div className="flex gap-3 flex-wrap justify-center">
              <a href="/pricing"
                className="inline-flex items-center gap-2 rounded-full font-extrabold transition-all duration-200 hover:scale-105"
                style={{ background:"linear-gradient(135deg,#FF6200,#FF4500)", color:"white", padding:"13px 28px", fontFamily:"Nunito, sans-serif", fontSize:"15px", boxShadow:"0 6px 28px rgba(255,98,0,0.5)", textDecoration:"none", flex:"1 1 auto", justifyContent:"center", minWidth:"165px" }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 10px 36px rgba(255,98,0,0.7)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 6px 28px rgba(255,98,0,0.5)"; }}
              >
                🚀 Start Preparation
              </a>

              <button
                onClick={() => { setScreen("setup-domain"); setScore(0); setXp(0); setStreak(0); setQIndex(0); setQuestions([]); }}
                className="inline-flex items-center gap-2 rounded-full font-bold transition-all duration-200 hover:scale-105"
                style={{ background:"rgba(255,255,255,0.07)", color:"white", border:"1px solid rgba(255,255,255,0.15)", padding:"13px 22px", fontFamily:"Nunito, sans-serif", fontSize:"14px", cursor:"pointer", flex:"1 1 auto", justifyContent:"center", minWidth:"140px" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,98,0,0.12)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,98,0,0.4)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.15)"; }}
              >
                🎮 Play Again
              </button>
            </div>

            <p className="text-xs text-white/25 text-center mt-4">
              ✓ Free to start &nbsp;·&nbsp; ✓ Kerala PSC-specific &nbsp;·&nbsp; ✓ Cancel anytime
            </p>
          </div>

        </div>
      </GameShell>
    );
  }

  return null;
}

// ─── GameShell ───────────────────────────────────────────────────────────────
function GameShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex flex-col overflow-x-hidden"
      style={{ background:"linear-gradient(160deg,#050E1F 0%,#0B1E3D 50%,#060F20 100%)" }}
    >
      {/* Ambient glow — pointer-events-none so nothing is blocked */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex:0, background:"radial-gradient(ellipse at 60% 20%, rgba(255,98,0,0.06) 0%, transparent 55%), radial-gradient(ellipse at 20% 80%, rgba(100,200,255,0.04) 0%, transparent 50%)" }} />

      {/* Scrollable centred content
           pt-[80px]  — clears the 70px fixed navbar with 10px breathing room
           pb-28      — clears the sticky bottom CTA bar                        */}
      <div className="relative z-10 flex-1 flex flex-col pt-[80px] pb-28">
        <div className="flex-1 flex items-start justify-center px-4 sm:px-6 py-6 sm:py-10">
          <div className="w-full max-w-2xl">
            {children}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes xpFloat {
          0%   { opacity:0; transform:translate(-50%,-50%) scale(0.6); }
          20%  { opacity:1; transform:translate(-50%,-65%) scale(1.1); }
          70%  { opacity:1; transform:translate(-50%,-80%) scale(1); }
          100% { opacity:0; transform:translate(-50%,-110%) scale(0.9); }
        }
      `}</style>
    </div>
  );
}

// ─── SetupCard ────────────────────────────────────────────────────────────────
function SetupCard({ step, title, sub, children, onBack }: {
  step: number; title: string; sub: string; children: React.ReactNode; onBack?: () => void;
}) {
  return (
    <div style={{ animation:"heroFadeUp 0.45s ease forwards" }}>
      {/* Step progress */}
      <div className="flex items-center gap-2 mb-8">
        {[1,2,3].map(s => (
          <div key={s} className="flex-1 h-1 rounded-full transition-all duration-400"
            style={{ background: s<=step ? "linear-gradient(90deg,#FF6200,#FF8534)" : "rgba(255,255,255,0.08)", boxShadow: s<=step ? "0 0 8px rgba(255,98,0,0.4)" : "none" }} />
        ))}
      </div>

      {onBack && (
        <button onClick={onBack} className="flex items-center gap-1 text-sm text-white/45 hover:text-white/75 mb-4 transition-colors" style={{ background:"none", border:"none", cursor:"pointer", padding:0 }}>
          ← Back
        </button>
      )}

      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-widest text-orange-400 mb-3"
        style={{ background:"rgba(255,98,0,0.12)", border:"1px solid rgba(255,98,0,0.25)" }}>
        STEP {step} OF 3
      </div>
      <h1 style={{ fontFamily:"Rajdhani, sans-serif" }} className="text-4xl font-bold text-white mb-2">{title}</h1>
      <p className="text-sm text-white/50 mb-7">{sub}</p>
      {children}
    </div>
  );
}

// ─── GlowBtn ──────────────────────────────────────────────────────────────────
function GlowBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full font-extrabold transition-all duration-200 hover:scale-105 active:scale-95"
      style={{ background:"linear-gradient(135deg,#FF6200,#FF4500)", color:"white", border:"none", padding:"14px 34px", fontFamily:"Nunito, sans-serif", fontSize:"16px", cursor:"pointer", boxShadow:"0 6px 28px rgba(255,98,0,0.45), inset 0 1px 0 rgba(255,255,255,0.15)" }}
      onMouseEnter={e => { (e.currentTarget).style.boxShadow = "0 10px 36px rgba(255,98,0,0.65), inset 0 1px 0 rgba(255,255,255,0.15)"; }}
      onMouseLeave={e => { (e.currentTarget).style.boxShadow = "0 6px 28px rgba(255,98,0,0.45), inset 0 1px 0 rgba(255,255,255,0.15)"; }}
    >
      {children}
    </button>
  );
}
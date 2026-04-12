"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { saveScore, getLeaderboard, getLevel, getNextLevel, type LeaderboardEntry } from "@/lib/leaderboard";
import { loadPlayer, createPlayer, recordGame, type PlayerData } from "@/lib/player";
import {
  SUBJECTS_BY_DOMAIN,
  ADDON_SUBJECTS,
  ADDON_GROUPS,
  getQuestions,
  type Domain     as DataDomain,
  type Question,
} from "@/data/quesions";

// ─── Types ───────────────────────────────────────────────────────────────────
type Domain = "ITI" | "Diploma" | "BTech";
type Difficulty = "Easy" | "Medium" | "Hard";

interface DomainOption    { id: Domain;     label: string; icon: string; desc: string; }
interface SubjectOption   { id: string;     label: string; icon: string; }
interface DifficultyOption{ id: Difficulty; label: string; questions: string; desc: string; icon: string; color: string; }

// ─── Domain map (UI casing → data casing) ───────────────────────────────────
const DOMAIN_MAP: Record<Domain, DataDomain> = { ITI:"iti", Diploma:"diploma", BTech:"btech" };

// ─── Subject icon helper ─────────────────────────────────────────────────────
function subjectIcon(s: string): string {
  const l = s.toLowerCase();
  if (l.includes("building material") || l.includes("construction tech")) return "🧱";
  if (l.includes("building construction") || l.includes("building drawing")) return "🏗️";
  if (l.includes("survey") || l.includes("levelling")) return "📏";
  if (l.includes("modern") && l.includes("instrument")) return "🔭";
  if (l.includes("drawing") || l.includes("autocad")) return "✏️";
  if (l.includes("estimat") || l.includes("costing") || l.includes("valuation")) return "📊";
  if (l.includes("rcc") || l.includes("structural") || l.includes("pre-stressed")) return "🏛️";
  if (l.includes("steel")) return "⚙️";
  if (l.includes("hydraulic") || l.includes("fluid") || l.includes("open channel")) return "💧";
  if (l.includes("hydrology") || l.includes("irrigation")) return "🌊";
  if (l.includes("water supply") || l.includes("sanit")) return "🚰";
  if (l.includes("wastewater") || l.includes("environmental") || l.includes("pollution") || l.includes("public health")) return "🌿";
  if (l.includes("highway") || l.includes("transport")) return "🛣️";
  if (l.includes("railway")) return "🚂";
  if (l.includes("bridge")) return "🌉";
  if (l.includes("tunnel")) return "🚇";
  if (l.includes("mechanic") && !l.includes("fluid")) return "⚡";
  if (l.includes("soil") || l.includes("geotech") || l.includes("foundation")) return "🏔️";
  if (l.includes("management") || l.includes("planning") && !l.includes("building")) return "📋";
  if (l.includes("math")) return "🔢";
  if (l.includes("electr")) return "⚡";
  if (l.includes("airport")) return "✈️";
  if (l.includes("dock") || l.includes("harbour")) return "⚓";
  if (l.includes("gis") || l.includes("remote") || l.includes("geoinformatics")) return "🗺️";
  if (l.includes("law") || l.includes("regulation")) return "⚖️";
  if (l.includes("noise")) return "🔊";
  if (l.includes("solid") || l.includes("hazardous") || l.includes("waste")) return "♻️";
  if (l.includes("chemical")) return "🧪";
  if (l.includes("dynamic") || l.includes("plastic") || l.includes("matrix")) return "🔬";
  return "📚";
}

// ─── Build subject options from data file ────────────────────────────────────
function buildSubjects(domain: DataDomain): { core: SubjectOption[]; addon: SubjectOption[] } {
  const addonSet = new Set(ADDON_SUBJECTS[domain]);
  return {
    core:  SUBJECTS_BY_DOMAIN[domain].filter(s => !addonSet.has(s)).map(s => ({ id: s, label: s, icon: subjectIcon(s) })),
    addon: ADDON_SUBJECTS[domain].map(s => ({ id: s, label: s, icon: subjectIcon(s) })),
  };
}

// ─── Data ────────────────────────────────────────────────────────────────────
const DOMAINS: DomainOption[] = [
  { id:"ITI",     label:"ITI",     icon:"🔧", desc:"Industrial Training Institute" },
  { id:"Diploma", label:"Diploma", icon:"📐", desc:"Diploma in Civil Engineering" },
  { id:"BTech",   label:"BTech",   icon:"🎓", desc:"Bachelor of Technology" },
];

const DOMAIN_SUBJECTS: Record<Domain, { core: SubjectOption[]; addon: SubjectOption[] }> = {
  ITI:     buildSubjects("iti"),
  Diploma: buildSubjects("diploma"),
  BTech:   buildSubjects("btech"),
};

const QUESTIONS_PER_GAME = 25;

const DIFFICULTIES: DifficultyOption[] = [
  { id:"Easy",   label:"Easy",   questions:`${QUESTIONS_PER_GAME} Questions`, desc:"Fundamental concepts & basics",  icon:"🌱", color:"emerald" },
  { id:"Medium", label:"Medium", questions:`${QUESTIONS_PER_GAME} Questions`, desc:"Application level problems",      icon:"⚡", color:"amber"   },
  { id:"Hard",   label:"Hard",   questions:`${QUESTIONS_PER_GAME} Questions`, desc:"Exam-standard questions",         icon:"🔥", color:"rose"    },
];

// ─── Sub-components ──────────────────────────────────────────────────────────
function StepHeader({ step, title, subtitle }: { step:number; title:string; subtitle:string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-white font-bold text-sm shrink-0">{step}</div>
      <div>
        <h2 className="text-white font-semibold text-lg leading-tight">{title}</h2>
        <p className="text-zinc-400 text-sm">{subtitle}</p>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function GameArenaPage() {
  const [selectedDomain,     setSelectedDomain]     = useState<Domain | null>(null);
  const [selectedSubjects,   setSelectedSubjects]   = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [showMoreSubjects,   setShowMoreSubjects]   = useState(false);

  // ── Game engine state ──
  const [gameStarted,          setGameStarted]          = useState(false);
  const [questions,            setQuestions]            = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer,       setSelectedAnswer]       = useState<string | null>(null);
  const [score,                setScore]                = useState(0);
  const [xp,                   setXp]                   = useState(0);
  const [showResult,           setShowResult]           = useState(false);
  const [animating,            setAnimating]            = useState(false);

  // ── Advanced features state ──
  const [timeLeft,     setTimeLeft]     = useState(15);
  const [streakCount,  setStreakCount]  = useState(0);
  const [bestStreak,   setBestStreak]   = useState(0);
  const [showXpBurst,  setShowXpBurst]  = useState(false);
  const [xpBurstVal,   setXpBurstVal]   = useState("+10 XP");
  const [streakGlow,   setStreakGlow]   = useState(false);
  const [timedOut,     setTimedOut]     = useState(false);
  const [clickedOpt,   setClickedOpt]   = useState<string | null>(null);

  // ── Player persistence state ──
  const [player,          setPlayer]          = useState<PlayerData | null>(null);
  const [playerLoaded,    setPlayerLoaded]    = useState(false);
  const [nameInput,       setNameInput]       = useState("");
  const [scoreSaved,      setScoreSaved]      = useState(false);
  const [savingScore,     setSavingScore]     = useState(false);
  const [saveError,       setSaveError]       = useState("");
  const [leaderboard,     setLeaderboard]     = useState<LeaderboardEntry[]>([]);
  const [lbLoading,       setLbLoading]       = useState(false);

  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // ── Load player from localStorage on mount ──
  useEffect(() => {
    const saved = loadPlayer();
    if (saved) setPlayer(saved);
    setPlayerLoaded(true);
  }, []);

  const handleDomainSelect = (domain: Domain) => {
    if (selectedDomain !== domain) { setSelectedSubjects([]); setShowMoreSubjects(false); }
    setSelectedDomain(domain);
  };

  const currentSubjects = selectedDomain ? DOMAIN_SUBJECTS[selectedDomain] : null;
  const isReady = selectedDomain !== null && selectedSubjects.length > 0 && selectedDifficulty !== null;
  const toggleSubject = (id: string) => setSelectedSubjects(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);

  // ── Sound engine (Web Audio API + file fallback) ─────────────────────────
  const playSound = useCallback((type: "correct" | "wrong" | "timeout") => {
    // Try Audio file first, fall back to synthesised tone
    const files: Record<string, string> = { correct:"/sounds/correct.mp3", wrong:"/sounds/wrong.mp3", timeout:"/sounds/wrong.mp3" };
    try {
      const audio = new Audio(files[type]);
      audio.volume = 0.5;
      const p = audio.play();
      if (p) p.catch(() => synthesise(type));
      return;
    } catch { /* fall through */ }
    synthesise(type);

    function synthesise(t: string) {
      try {
        if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const ctx  = audioCtxRef.current;
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        if (t === "correct") {
          osc.frequency.setValueAtTime(523, ctx.currentTime);
          osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
          osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
          gain.gain.setValueAtTime(0.18, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
          osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.5);
        } else {
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(200, ctx.currentTime);
          osc.frequency.setValueAtTime(150, ctx.currentTime + 0.15);
          gain.gain.setValueAtTime(0.15, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
          osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.35);
        }
      } catch { /* audio not supported */ }
    }
  }, []);

  // ── Timer ─────────────────────────────────────────────────────────────────
  const clearTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer(); setTimeLeft(15);
    timerRef.current = setInterval(() => setTimeLeft(t => { if (t <= 1) { clearTimer(); return 0; } return t - 1; }), 1000);
  }, [clearTimer]);

  // Auto-advance when timer hits 0
  useEffect(() => {
    if (!gameStarted || showResult || selectedAnswer !== null) return;
    if (timeLeft === 0) {
      playSound("timeout"); setTimedOut(true); setSelectedAnswer("__timeout__"); setStreakCount(0); clearTimer();
    }
  }, [timeLeft, gameStarted, showResult, selectedAnswer, playSound, clearTimer]);

  // ── Quiz engine helpers ──────────────────────────────────────────────────
  const [startingGame, setStartingGame] = useState(false);
  const [fetchError, setFetchError]     = useState("");

  const handleStart = async () => {
    if (!isReady || startingGame) return;
    setStartingGame(true);
    setFetchError("");
    try {
      const dataDomain     = DOMAIN_MAP[selectedDomain!];
      const dataDifficulty = selectedDifficulty!.toLowerCase() as "easy" | "medium" | "hard";
      const pool = await getQuestions(dataDomain, selectedSubjects, dataDifficulty, 25);
      setQuestions(pool); setCurrentQuestionIndex(0); setSelectedAnswer(null);
      setScore(0); setXp(0); setShowResult(false); setAnimating(false);
      setStreakCount(0); setBestStreak(0); setTimedOut(false);
      setShowXpBurst(false); setClickedOpt(null); setGameStarted(true);
      setScoreSaved(false); setSaveError(""); setLeaderboard([]);
    } catch (err) {
      if (err instanceof Error && err.message === "NO_QUESTIONS") {
        setFetchError("No questions available for your selection yet. Try different subjects or difficulty.");
      } else {
        setFetchError("Failed to load questions. Please check your connection and try again.");
      }
    } finally { setStartingGame(false); }
  };

  // ── Fetch leaderboard when results show ──
  const fetchLeaderboard = useCallback(async () => {
    setLbLoading(true);
    try { setLeaderboard(await getLeaderboard()); }
    catch { /* silently fail */ }
    finally { setLbLoading(false); }
  }, []);

  // ── Register player name (first time only) ──
  const handleRegisterName = () => {
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    const p = createPlayer(trimmed);
    setPlayer(p);
  };

  // ── Save score handler (auto-uses stored name) ──
  const handleSaveScore = async () => {
    if (!player) return;
    setSavingScore(true); setSaveError("");
    try {
      // Update local player data (totalScore + streak)
      const updated = recordGame(player, xp);
      setPlayer(updated);
      // Save to Firebase
      await saveScore({
        name: updated.name,
        score: xp,
        totalScore: updated.totalScore,
        streak: updated.streak,
      });
      setScoreSaved(true);
      fetchLeaderboard();
    } catch {
      setSaveError("Failed to save score. Please try again.");
    } finally { setSavingScore(false); }
  };

  useEffect(() => {
    if (gameStarted && !showResult) { setTimedOut(false); startTimer(); }
    return clearTimer;
  }, [gameStarted, showResult, currentQuestionIndex]); // eslint-disable-line

  const handleAnswerSelect = (option: string) => {
    if (selectedAnswer !== null) return;
    clearTimer();
    setClickedOpt(option);
    setTimeout(() => setClickedOpt(null), 200);
    setSelectedAnswer(option);
    const q = questions[currentQuestionIndex];
    const correctAnswer = q.options[q.correct];
    const isCorrect = option === correctAnswer;
    if (isCorrect) {
      playSound("correct");
      setScore(s => s + 1);
      const baseXp = q.xp ?? 10;
      const bonus  = streakCount >= 2 ? baseXp * 2 : baseXp;
      setXp(x => x + bonus);
      setXpBurstVal(streakCount >= 2 ? `+${bonus} XP 🔥` : `+${bonus} XP ⚡`);
      setStreakCount(s => { const next = s + 1; setBestStreak(b => Math.max(b, next)); return next; });
      setStreakGlow(true); setTimeout(() => setStreakGlow(false), 800);
      setShowXpBurst(true); setTimeout(() => setShowXpBurst(false), 1400);
    } else {
      playSound("wrong"); setStreakCount(0);
    }
  };

  const handleNext = () => {
    setAnimating(true); setTimedOut(false);
    setTimeout(() => {
      if (currentQuestionIndex + 1 >= questions.length) { clearTimer(); setShowResult(true); }
      else { setCurrentQuestionIndex(i => i + 1); setSelectedAnswer(null); }
      setAnimating(false);
    }, 280);
  };

  const handlePlayAgain = () => {
    clearTimer(); setGameStarted(false); setShowResult(false); setSelectedAnswer(null);
    setCurrentQuestionIndex(0); setScore(0); setXp(0); setStreakCount(0); setBestStreak(0); setTimedOut(false);
    setScoreSaved(false); setSaveError(""); setLeaderboard([]);
  };

  // ── Load leaderboard when game ends ──
  useEffect(() => { if (showResult) fetchLeaderboard(); }, [showResult, fetchLeaderboard]);

  // ── Derived quiz values ──────────────────────────────────────────────────
  const currentQ   = questions[currentQuestionIndex];
  const isLastQ    = currentQuestionIndex + 1 >= questions.length;
  const pct        = questions.length ? Math.round(((currentQuestionIndex + (selectedAnswer ? 1 : 0)) / questions.length) * 100) : 0;
  const grade      = score / (questions.length || 1);
  const gradeLabel = grade >= 0.8 ? "🔥 Excellent! You're PSC ready" : grade >= 0.6 ? "👍 Good progress, keep practicing" : "📘 Keep learning, you'll improve";
  const gradeColor = grade >= 0.8 ? "text-emerald-400" : grade >= 0.6 ? "text-amber-400" : "text-rose-400";
  const timerDanger = timeLeft <= 5;
  const timerPct    = (timeLeft / 15) * 100;
  const revealed    = selectedAnswer !== null;
  const BG = <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage:"linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize:"40px 40px" }} />;

  // ═══════════════════════════════════════════════════════════════════════════
  // QUIZ SCREEN
  // ═══════════════════════════════════════════════════════════════════════════
  if (gameStarted && !showResult && currentQ) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        {BG}

        {/* XP Burst — floats up and fades */}
        <div
          className="fixed top-24 right-6 z-50 pointer-events-none select-none"
          style={{
            transition: "opacity 0.4s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1)",
            opacity:    showXpBurst ? 1 : 0,
            transform:  showXpBurst ? "translateY(-36px) scale(1.1)" : "translateY(0px) scale(0.8)",
          }}
        >
          <span className="text-amber-400 font-extrabold text-xl drop-shadow-lg whitespace-nowrap">
            {xpBurstVal}
          </span>
        </div>

        <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">

          {/* ── Top bar ── */}
          <div className="flex items-center justify-between mb-5">
            <button onClick={handlePlayAgain} className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
              ← Exit
            </button>
            <div className="flex items-center gap-2.5">
              {/* Streak pill */}
              <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all duration-300 border
                ${streakCount >= 3
                  ? `bg-orange-500/20 border-orange-500/40 text-orange-400 ${streakGlow ? "shadow-[0_0_18px_rgba(249,115,22,0.7)] scale-110" : "shadow-[0_0_8px_rgba(249,115,22,0.2)]"}`
                  : "bg-zinc-800 border-zinc-700 text-zinc-400"}`}>
                🔥 {streakCount}
              </span>
              {/* XP pill */}
              <span className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1 text-amber-400 text-xs font-semibold">
                ⚡ {xp} XP
              </span>
              {/* Score pill */}
              <span className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1 text-orange-400 text-xs font-semibold">
                🎯 {score}/{questions.length}
              </span>
            </div>
          </div>

          {/* ── Progress + Timer bars ── */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs text-zinc-500">Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span className={`text-xs font-bold tabular-nums transition-colors duration-300 ${timerDanger ? "text-rose-400 animate-pulse" : "text-zinc-400"}`}>
                ⏱ {timeLeft}s
              </span>
            </div>
            <div className="h-1 bg-zinc-800 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-500" style={{ width:`${pct}%` }} />
            </div>
            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-linear
                  ${timerDanger ? "bg-gradient-to-r from-rose-600 to-red-400" : timeLeft <= 10 ? "bg-gradient-to-r from-amber-500 to-yellow-400" : "bg-gradient-to-r from-emerald-500 to-teal-400"}`}
                style={{ width:`${timerPct}%` }}
              />
            </div>
          </div>

          {/* Timed-out banner */}
          {timedOut && (
            <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-2.5 mb-4 text-rose-400 text-sm font-medium">
              ⏰ Time&apos;s up! The correct answer is highlighted below.
            </div>
          )}

          {/* ── Question card — fade + slide on transition ── */}
          <div style={{ transition:"opacity 0.28s ease, transform 0.28s ease", opacity:animating ? 0 : 1, transform:animating ? "translateY(10px)" : "translateY(0)" }}>
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 mb-4 backdrop-blur-sm shadow-xl shadow-black/30">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold px-2.5 py-1 rounded-full">
                  {currentQ.subject}
                </span>
                <span className="text-zinc-600 text-xs">{selectedDifficulty}</span>
              </div>
              <p className="text-white text-lg font-semibold leading-relaxed">{currentQ.question}</p>
            </div>

            {/* ── Options ── */}
            <div className="grid grid-cols-1 gap-2.5 mb-5">
              {currentQ.options.map((opt, i) => {
                const isCorrect  = i === currentQ.correct;
                const isSelected = opt === selectedAnswer;
                const isClicked  = opt === clickedOpt;
                let cls = "border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:border-zinc-500 hover:bg-zinc-800 hover:shadow-[0_0_12px_rgba(255,255,255,0.04)] hover:scale-[1.01]";
                if (revealed) {
                  if (isCorrect)       cls = "border-emerald-500 bg-emerald-500/10 text-emerald-300 shadow-[0_0_16px_rgba(16,185,129,0.18)]";
                  else if (isSelected) cls = "border-rose-500 bg-rose-500/10 text-rose-300 shadow-[0_0_16px_rgba(244,63,94,0.18)]";
                  else                 cls = "border-zinc-800 bg-zinc-900/40 text-zinc-600";
                }
                const optLabel = ["A","B","C","D"][i];
                return (
                  <button
                    key={opt}
                    onClick={() => handleAnswerSelect(opt)}
                    disabled={revealed}
                    style={{ transition:"all 0.18s ease", transform: isClicked ? "scale(0.97)" : "scale(1)" }}
                    className={`flex items-center gap-4 w-full px-4 py-3.5 rounded-xl border text-sm font-medium text-left
                      ${cls} ${!revealed ? "cursor-pointer active:scale-[0.97]" : "cursor-default"}`}
                  >
                    <span className={`flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold shrink-0 transition-all duration-200
                      ${revealed && isCorrect  ? "bg-emerald-500/25 text-emerald-300 scale-110"
                      : revealed && isSelected ? "bg-rose-500/25 text-rose-300"
                      : "bg-zinc-700/60 text-zinc-400"}`}>
                      {revealed && isCorrect ? "✓" : revealed && isSelected ? "✗" : optLabel}
                    </span>
                    <span className="flex-1 leading-snug">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* ── Explanation + Next ── */}
            {revealed && (
              <div className="space-y-3">
                <div className="bg-zinc-900/60 border border-zinc-700/50 rounded-xl px-4 py-3.5">
                  <p className="text-xs font-semibold text-zinc-400 mb-1 uppercase tracking-wide">💡 Explanation</p>
                  <p className="text-zinc-300 text-sm leading-relaxed">{currentQ.explanation}</p>
                </div>
                {selectedAnswer === currentQ.options[currentQ.correct] && streakCount >= 2 && (
                  <div className="flex items-center justify-center gap-2 text-orange-400 text-sm font-bold">
                    🔥 {streakCount} in a row! Keep going!
                  </div>
                )}
                <div className="flex justify-end">
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-400 text-white font-bold px-7 py-3 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-105 active:scale-100 transition-all duration-200"
                  >
                    {isLastQ ? "See Results 🏁" : "Next Question →"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RESULT SCREEN
  // ═══════════════════════════════════════════════════════════════════════════
  if (gameStarted && showResult) {
    const medal       = score === questions.length ? "🥇" : score >= questions.length * 0.7 ? "🥈" : "🥉";
    const accuracyPct = Math.round((score / questions.length) * 100);

    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        {BG}
        <div className="relative z-10 w-full max-w-md mx-auto text-center px-4 py-10">

          {/* Medal */}
          <div className="text-7xl mb-4" style={{ animation:"heroFadeUp 0.5s ease forwards" }}>{medal}</div>
          <h2 className="text-3xl font-extrabold text-white mb-1">Game Over!</h2>
          <p className={`text-lg font-semibold mb-8 ${gradeColor}`}>{gradeLabel}</p>

          {/* Score card */}
          <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 mb-5 backdrop-blur-sm shadow-xl shadow-black/30">
            <div className="grid grid-cols-4 gap-3 mb-5">
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl font-extrabold text-white leading-none">{score}<span className="text-zinc-600 text-base">/{questions.length}</span></span>
                <span className="text-zinc-500 text-xs">Score</span>
              </div>
              <div className="flex flex-col items-center gap-1 border-x border-zinc-800">
                <span className="text-2xl font-extrabold text-amber-400 leading-none">+{xp}</span>
                <span className="text-zinc-500 text-xs">XP</span>
              </div>
              <div className="flex flex-col items-center gap-1 border-r border-zinc-800">
                <span className="text-2xl font-extrabold text-orange-400 leading-none">🔥{bestStreak}</span>
                <span className="text-zinc-500 text-xs">Best Streak</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl font-extrabold text-sky-400 leading-none">{accuracyPct}%</span>
                <span className="text-zinc-500 text-xs">Accuracy</span>
              </div>
            </div>

            {/* Accuracy bar */}
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${grade >= 0.8 ? "bg-gradient-to-r from-emerald-500 to-teal-400" : grade >= 0.6 ? "bg-gradient-to-r from-amber-500 to-yellow-400" : "bg-gradient-to-r from-orange-500 to-amber-400"}`}
                style={{ width:`${accuracyPct}%` }}
              />
            </div>
            <div className="flex justify-between mt-1.5 text-xs text-zinc-600"><span>0%</span><span>100%</span></div>

            {bestStreak >= 3 && (
              <div className="mt-4 flex items-center justify-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-xl px-4 py-2">
                <span className="text-orange-400 text-sm font-bold">🔥 Best streak of {bestStreak}!</span>
                <span className="text-zinc-500 text-xs">Impressive focus</span>
              </div>
            )}
          </div>

          {/* Player stats + Level badge */}
          {(() => {
            const totalScore = player ? player.totalScore + (scoreSaved ? 0 : xp) : xp;
            const lvl = getLevel(totalScore);
            const next = getNextLevel(totalScore);
            const streak = player?.streak ?? 0;
            return (
              <div className={`${lvl.bgColor} border ${lvl.borderColor} rounded-2xl p-5 mb-5 shadow-lg ${lvl.glowColor}`}>
                {/* Level + name */}
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-2xl">{lvl.icon}</span>
                  <span className={`text-lg font-extrabold ${lvl.color}`}>{lvl.label}</span>
                </div>
                {player && <p className="text-zinc-300 text-sm font-semibold mb-3">{player.name}</p>}

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="flex flex-col items-center">
                    <span className="text-xl font-extrabold text-white">⭐ {totalScore.toLocaleString()}</span>
                    <span className="text-zinc-500 text-xs">Total Score</span>
                  </div>
                  <div className="flex flex-col items-center border-x border-white/10">
                    <span className="text-xl font-extrabold text-amber-400">+{score}</span>
                    <span className="text-zinc-500 text-xs">This Game</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xl font-extrabold text-orange-400">🔥 {streak}</span>
                    <span className="text-zinc-500 text-xs">{streak === 1 ? "Day" : "Days"} Streak</span>
                  </div>
                </div>

                {/* Next level progress */}
                {next ? (
                  <p className="text-zinc-500 text-xs">
                    Next: <span className={`font-bold ${next.color}`}>{next.icon} {next.label}</span> at {next.threshold.toLocaleString()} pts
                    <span className="block mt-1 text-orange-400/80">🔥 Keep playing to reach the next level</span>
                  </p>
                ) : (
                  <p className="text-orange-400 text-xs font-bold">🏆 You reached the highest level!</p>
                )}
              </div>
            );
          })()}

          {/* Config recap */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {[selectedDomain, selectedDifficulty, `${selectedSubjects.length} subject${selectedSubjects.length > 1 ? "s" : ""}`].map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 bg-zinc-800 border border-zinc-700 rounded-full px-3 py-1 text-xs text-zinc-400">
                <span className="text-orange-400">●</span> {tag}
              </span>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <button onClick={handleStart}     className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-400 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-105 active:scale-100 transition-all duration-200">
              🔄 Play Again
            </button>
            <button onClick={handlePlayAgain} className="flex items-center justify-center gap-2 bg-zinc-800 border border-zinc-700 text-zinc-300 font-semibold px-8 py-3.5 rounded-xl hover:bg-zinc-700 hover:border-zinc-500 transition-all duration-200">
              ⚙️ Change Setup
            </button>
          </div>

          {/* ── Save Score + Leaderboard ── */}
          <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 mb-5 backdrop-blur-sm shadow-xl shadow-black/30 text-left">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              🏆 Leaderboard
            </h3>

            {/* Save score */}
            {!scoreSaved ? (
              <div className="mb-5">
                {!player ? (
                  /* First-time: ask for name */
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleRegisterName(); }}
                      placeholder="Enter your name to save"
                      maxLength={30}
                      className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-all"
                    />
                    <button
                      onClick={handleRegisterName}
                      disabled={!nameInput.trim()}
                      className="bg-gradient-to-r from-orange-500 to-amber-400 text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:scale-105 active:scale-100 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 whitespace-nowrap"
                    >
                      Set Name
                    </button>
                  </div>
                ) : (
                  /* Returning player: one-click save */
                  <button
                    onClick={handleSaveScore}
                    disabled={savingScore}
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-400 text-white font-bold px-5 py-3 rounded-xl text-sm hover:scale-[1.02] active:scale-100 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {savingScore ? "Saving..." : `Save Score as ${player.name}`}
                  </button>
                )}
                {saveError && <p className="text-rose-400 text-xs mt-2">{saveError}</p>}
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2.5 mb-5 text-emerald-400 text-sm font-medium">
                ✓ Score saved!
              </div>
            )}

            {/* Leaderboard list */}
            {lbLoading ? (
              <div className="text-zinc-500 text-sm text-center py-4">Loading leaderboard...</div>
            ) : leaderboard.length > 0 ? (
              <ol className="space-y-1.5">
                {leaderboard.map((entry, i) => {
                  const medals = ["🥇", "🥈", "🥉"];
                  const rankDisplay = i < 3 ? medals[i] : `#${i + 1}`;
                  const isMe = player?.name?.toLowerCase() === entry.name?.toLowerCase();
                  return (
                    <li
                      key={`${entry.name}-${i}`}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isMe ? "bg-orange-500/10 ring-1 ring-orange-500/30" : "hover:bg-white/[0.03]"}`}
                    >
                      <span className="w-7 text-center text-sm font-bold text-zinc-400">{rankDisplay}</span>
                      <span className={`flex-1 text-sm font-semibold truncate ${isMe ? "text-orange-300" : "text-white"}`}>
                        {entry.name}{isMe && " (You)"}
                      </span>
                      {entry.level && <span className="text-xs text-zinc-400 shrink-0">{entry.level}</span>}
                      {entry.streak && entry.streak > 1 && <span className="text-xs text-orange-400/70 shrink-0">🔥{entry.streak}</span>}
                      <span className="text-sm font-bold text-orange-400 shrink-0">{(entry.totalScore ?? entry.score).toLocaleString()} pts</span>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <div className="text-zinc-500 text-sm text-center py-4">No players yet. Be the first to play!</div>
            )}
          </div>

          {/* ── Conversion CTA ── */}
          <div
            className="rounded-2xl p-6 text-left"
            style={{
              background:  "linear-gradient(135deg,#1A0800,#2A1000)",
              border:      "2px solid rgba(255,98,0,0.4)",
              boxShadow:   "0 0 36px rgba(255,98,0,0.12), inset 0 1px 0 rgba(255,255,255,0.04)",
              animation:   "heroFadeUp 0.6s 0.3s ease both",
            }}
          >
            <div className="text-xs font-bold tracking-widest text-orange-400 uppercase mb-2">🎯 Want to improve your score?</div>
            <h3 className="text-xl font-extrabold text-white mb-3 leading-tight">
              🔥 Unlock the full CivilEzy course
            </h3>

            <ul className="space-y-2 mb-5">
              {[
                "Real Kerala PSC mock tests — pool-mapped",
                "Malayalam audio explanations 🎧",
                "Smart analytics — track your weak areas",
                "100+ department-specific papers",
              ].map(item => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <span className="text-emerald-400 font-bold mt-0.5 shrink-0">✔</span>
                  {item}
                </li>
              ))}
            </ul>

            {/* Social proof */}
            <div className="flex items-center gap-2 mb-5 flex-wrap">
              <div className="flex -space-x-2">
                {["AR","MK","SP"].map((init,i) => (
                  <div key={init} className="w-7 h-7 rounded-full border-2 border-zinc-900 flex items-center justify-center text-xs font-bold"
                    style={{ background:["rgba(255,98,0,0.35)","rgba(255,184,0,0.3)","rgba(100,200,255,0.25)"][i], color:"#fff" }}>
                    {init}
                  </div>
                ))}
              </div>
              <span className="text-xs text-zinc-400">
                <span className="text-white font-semibold">98+ rank holders</span> started exactly like you
              </span>
            </div>

            <div className="flex gap-3 flex-col sm:flex-row">
              <Link
                href="/pricing"
                className="flex-1 flex items-center justify-center gap-2 rounded-xl font-extrabold text-white text-sm py-3 px-5 transition-all duration-200 hover:scale-105 hover:shadow-orange-500/50 hover:shadow-lg"
                style={{ background:"linear-gradient(135deg,#FF6200,#FF4500)", boxShadow:"0 4px 20px rgba(255,98,0,0.4)", textDecoration:"none" }}
              >
                🚀 Start Preparation
              </Link>
              <button
                onClick={handleStart}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl font-semibold text-zinc-300 text-sm py-3 px-5 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 hover:border-zinc-500 hover:scale-105 transition-all duration-200"
              >
                🎮 Play Again
              </button>
            </div>

            <p className="text-xs text-zinc-600 text-center mt-3">
              ✓ Free to start &nbsp;·&nbsp; ✓ No credit card &nbsp;·&nbsp; ✓ Kerala PSC-specific
            </p>
          </div>

        </div>
      </main>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SETUP SCREEN (unchanged)
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage:"linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize:"40px 40px" }} />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-12">
        {/* ── Header ── */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-5">
            <span className="text-orange-400 text-xs font-semibold tracking-widest uppercase">Quiz Mode</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 tracking-tight">
            🎮{" "}
            <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">Game Arena</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-md mx-auto">Learn PSC Civil Engineering by playing</p>
        </div>

        {/* ── Progress indicators ── */}
        <div className="flex items-center gap-2 mb-10 justify-center">
          {[{ n:1, done:!!selectedDomain },{ n:2, done:selectedSubjects.length>0 },{ n:3, done:!!selectedDifficulty }].map(({ n, done }, i, arr) => (
            <div key={n} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${done ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30" : "bg-zinc-800 text-zinc-500 border border-zinc-700"}`}>
                {done ? "✓" : n}
              </div>
              {i < arr.length - 1 && <div className={`w-12 h-0.5 mx-1 transition-all duration-500 ${done ? "bg-orange-500/60" : "bg-zinc-800"}`} />}
            </div>
          ))}
        </div>

        {/* ── STEP 1 — Domain ── */}
        <section className="mb-10 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm">
          <StepHeader step={1} title="Select Domain" subtitle="Choose your qualification level" />
          <div className="grid grid-cols-3 gap-3">
            {DOMAINS.map(d => {
              const isSelected = selectedDomain === d.id;
              return (
                <button key={d.id} onClick={() => handleDomainSelect(d.id)}
                  className={`group relative flex flex-col items-center justify-center gap-2 p-5 rounded-xl border transition-all duration-200 cursor-pointer text-center hover:scale-[1.02]
                    ${isSelected ? "border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/10" : "border-zinc-700 bg-zinc-800/50 hover:border-zinc-500 hover:bg-zinc-800"}`}>
                  {isSelected && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-orange-500 shadow-sm shadow-orange-400" />}
                  <span className="text-2xl">{d.icon}</span>
                  <span className={`font-bold text-base transition-colors ${isSelected ? "text-orange-400" : "text-white"}`}>{d.label}</span>
                  <span className="text-zinc-500 text-xs leading-tight">{d.desc}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── STEP 2 — Subjects ── */}
        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${selectedDomain ? "max-h-[1000px] opacity-100 mb-10" : "max-h-0 opacity-0 mb-0"}`}>
          <section className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm">
            <StepHeader step={2} title="Choose Subjects" subtitle={selectedSubjects.length > 0 ? `${selectedSubjects.length} subject${selectedSubjects.length > 1 ? "s" : ""} selected` : "Select one or more subjects based on your preparation"} />
            {currentSubjects && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {currentSubjects.core.map(s => {
                    const isSelected = selectedSubjects.includes(s.id);
                    return (
                      <button key={s.id} onClick={() => toggleSubject(s.id)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 cursor-pointer hover:scale-[1.02]
                          ${isSelected ? "border-orange-500 bg-orange-500/10 text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.15)]" : "border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:border-zinc-500 hover:bg-zinc-800"}`}>
                        <span className="text-base shrink-0">{s.icon}</span>
                        <span className="leading-tight flex-1 text-left">{s.label}</span>
                        {isSelected && <span className="text-orange-500 text-xs shrink-0">✓</span>}
                      </button>
                    );
                  })}
                </div>

                {currentSubjects.addon.length > 0 && (
                  <>
                    <button onClick={() => setShowMoreSubjects(p => !p)}
                      className="mt-4 flex items-center gap-2 text-sm text-orange-400 hover:text-orange-300 transition-colors font-medium">
                      <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full border border-orange-500/50 bg-orange-500/10 text-orange-400 text-xs transition-transform duration-300 ${showMoreSubjects ? "rotate-45" : "rotate-0"}`}>+</span>
                      {showMoreSubjects ? "Hide extra subjects" : `+ More Subjects (${currentSubjects.addon.length} add-ons)`}
                    </button>
                    <div className={`transition-all duration-400 ease-in-out overflow-hidden ${showMoreSubjects ? "max-h-[2000px] opacity-100 mt-2.5" : "max-h-0 opacity-0 mt-0"}`}>
                      {(() => {
                        const dataDomain = DOMAIN_MAP[selectedDomain!];
                        const groups = ADDON_GROUPS[dataDomain];
                        if (groups && groups.length > 0) {
                          return groups.map(group => (
                            <div key={group.label} className="mb-4 last:mb-0">
                              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">{group.label}</p>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                                {group.subjects.map(subj => {
                                  const isSelected = selectedSubjects.includes(subj);
                                  return (
                                    <button key={subj} onClick={() => toggleSubject(subj)}
                                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 cursor-pointer hover:scale-[1.02]
                                        ${isSelected ? "border-orange-500 bg-orange-500/10 text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.15)]" : "border-zinc-700/60 border-dashed bg-zinc-800/30 text-zinc-400 hover:border-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"}`}>
                                      <span className="text-base shrink-0">{subjectIcon(subj)}</span>
                                      <span className="leading-tight flex-1 text-left">{subj}</span>
                                      {isSelected && <span className="text-orange-500 text-xs shrink-0">✓</span>}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ));
                        }
                        return (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                            {currentSubjects.addon.map(s => {
                              const isSelected = selectedSubjects.includes(s.id);
                              return (
                                <button key={s.id} onClick={() => toggleSubject(s.id)}
                                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 cursor-pointer hover:scale-[1.02]
                                    ${isSelected ? "border-orange-500 bg-orange-500/10 text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.15)]" : "border-zinc-700/60 border-dashed bg-zinc-800/30 text-zinc-400 hover:border-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"}`}>
                                  <span className="text-base shrink-0">{s.icon}</span>
                                  <span className="leading-tight flex-1 text-left">{s.label}</span>
                                  {isSelected && <span className="text-orange-500 text-xs shrink-0">✓</span>}
                                </button>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>
                  </>
                )}

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-800">
                  <button onClick={() => {
                    const all = [...currentSubjects.core, ...(showMoreSubjects ? currentSubjects.addon : [])].map(s => s.id);
                    const allVisible = all.every(id => selectedSubjects.includes(id));
                    if (allVisible) setSelectedSubjects([]);
                    else setSelectedSubjects(prev => Array.from(new Set([...prev, ...all])));
                  }} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                    {[...currentSubjects.core, ...(showMoreSubjects ? currentSubjects.addon : [])].every(s => selectedSubjects.includes(s.id)) ? "Deselect all" : "Select all visible"}
                  </button>
                  {selectedSubjects.length > 0 && (
                    <button onClick={() => setSelectedSubjects([])} className="text-xs text-zinc-600 hover:text-rose-400 transition-colors">Clear all</button>
                  )}
                </div>
              </>
            )}
          </section>
        </div>

        {/* ── STEP 3 — Difficulty ── */}
        <section className="mb-10 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm">
          <StepHeader step={3} title="Select Difficulty" subtitle="How challenging do you want it?" />
          <div className="grid grid-cols-3 gap-3">
            {DIFFICULTIES.map(d => {
              const isSelected = selectedDifficulty === d.id;
              const accentMap: Record<string,string> = {
                emerald: isSelected ? "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10" : "border-zinc-700 bg-zinc-800/50 hover:border-emerald-700 hover:bg-zinc-800",
                amber:   isSelected ? "border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10"   : "border-zinc-700 bg-zinc-800/50 hover:border-amber-700 hover:bg-zinc-800",
                rose:    isSelected ? "border-rose-500 bg-rose-500/10 shadow-lg shadow-rose-500/10"     : "border-zinc-700 bg-zinc-800/50 hover:border-rose-700 hover:bg-zinc-800",
              };
              const textMap: Record<string,string> = { emerald:"text-emerald-400", amber:"text-amber-400", rose:"text-rose-400" };
              return (
                <button key={d.id} onClick={() => setSelectedDifficulty(d.id)}
                  className={`group relative flex flex-col items-center gap-2 p-5 rounded-xl border transition-all duration-200 cursor-pointer text-center hover:scale-[1.02] ${accentMap[d.color]}`}>
                  {isSelected && <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${d.color === "emerald" ? "bg-emerald-500" : d.color === "amber" ? "bg-amber-500" : "bg-rose-500"}`} />}
                  <span className="text-2xl">{d.icon}</span>
                  <span className={`font-bold text-base ${isSelected ? textMap[d.color] : "text-white"}`}>{d.label}</span>
                  <span className={`text-xs font-semibold ${isSelected ? textMap[d.color] : "text-zinc-400"}`}>{d.questions}</span>
                  <span className="text-zinc-500 text-xs">{d.desc}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Config summary + Start */}
        {isReady && (
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {[selectedDomain, selectedDifficulty, `${selectedSubjects.length} subject${selectedSubjects.length > 1 ? "s" : ""}`].map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 bg-zinc-800 border border-zinc-700 rounded-full px-3 py-1 text-xs text-zinc-300">
                <span className="text-orange-400">●</span> {tag}
              </span>
            ))}
          </div>
        )}

        {/* Error message */}
        {fetchError && (
          <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-500/30 rounded-xl px-5 py-3.5 mb-6 max-w-lg mx-auto">
            <span className="text-rose-400 text-sm font-medium">{fetchError}</span>
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={handleStart}
            disabled={!isReady || startingGame}
            className={`relative flex items-center gap-3 px-10 py-4 rounded-2xl text-lg font-bold tracking-wide transition-all duration-300
              ${isReady && !startingGame ? "bg-gradient-to-r from-orange-500 to-amber-400 text-white shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 active:scale-100 cursor-pointer" : "bg-zinc-800 text-zinc-600 border border-zinc-700 cursor-not-allowed"}`}>
            {isReady && !startingGame && <span className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-200" />}
            {startingGame ? (
              <>
                <span className="relative inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="relative">Loading questions...</span>
              </>
            ) : (
              <>
                <span className="relative">🚀</span>
                <span className="relative">{isReady ? "Start Game" : "Complete all steps to start"}</span>
              </>
            )}
          </button>
        </div>

        {!isReady && !fetchError && (
          <p className="text-center text-zinc-600 text-xs mt-3">
            {!selectedDomain ? "Select a domain to begin" : selectedSubjects.length === 0 ? "Pick at least one subject" : "Choose a difficulty level"}
          </p>
        )}
      </div>
    </main>
  );
}
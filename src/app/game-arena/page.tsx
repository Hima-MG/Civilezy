"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Domain = "ITI" | "Diploma" | "BTech";
type Difficulty = "Easy" | "Medium" | "Hard";

interface DomainOption {
  id: Domain;
  label: string;
  icon: string;
  desc: string;
}

interface SubjectOption {
  id: string;
  label: string;
  icon: string;
}

interface DifficultyOption {
  id: Difficulty;
  label: string;
  questions: string;
  desc: string;
  icon: string;
  color: string;
}

interface Question {
  id: number;
  subject: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

// ─── Mock Questions ───────────────────────────────────────────────────────────

const MOCK_QUESTIONS: Question[] = [
  {
    id: 1,
    subject: "Fluid Mechanics",
    question: "What is the unit of stress?",
    options: ["N/m", "N/m²", "kg/m³", "Pa"],
    answer: "N/m²",
    explanation: "Stress = Force / Area. Both N/m² and Pa are correct units; N/m² is the SI derived form.",
  },
  {
    id: 2,
    subject: "Soil Mechanics",
    question: "What is the specific gravity of water at 4°C?",
    options: ["0.85", "1.00", "1.25", "0.99"],
    answer: "1.00",
    explanation: "Water at 4°C is densest at 1000 kg/m³, giving a specific gravity of exactly 1.00.",
  },
  {
    id: 3,
    subject: "RCC",
    question: "Which of the following is a ferrous metal?",
    options: ["Copper", "Aluminium", "Cast Iron", "Zinc"],
    answer: "Cast Iron",
    explanation: "Ferrous metals contain iron as a primary component. Cast iron is an iron-carbon alloy.",
  },
  {
    id: 4,
    subject: "Surveying",
    question: "The angle of internal friction of loose sand is approximately:",
    options: ["15°–20°", "25°–30°", "35°–40°", "45°–50°"],
    answer: "25°–30°",
    explanation: "Loose dry sand typically has an internal friction angle in the range of 25°–30°.",
  },
  {
    id: 5,
    subject: "Transportation",
    question: "What does SBC stand for in foundation engineering?",
    options: ["Safe Bearing Capacity", "Soil Bearing Code", "Structural Base Coefficient", "Standard Bore Calculation"],
    answer: "Safe Bearing Capacity",
    explanation: "SBC is the maximum load per unit area that the soil can safely carry without failure or excessive settlement.",
  },
  {
    id: 6,
    subject: "Fluid Mechanics",
    question: "Bernoulli's theorem is applicable to:",
    options: ["Compressible flow only", "Viscous flow only", "Ideal fluid flow along a streamline", "Turbulent flow only"],
    answer: "Ideal fluid flow along a streamline",
    explanation: "Bernoulli's principle applies to steady, incompressible, irrotational flow of an ideal (non-viscous) fluid along a streamline.",
  },
  {
    id: 7,
    subject: "RCC",
    question: "The minimum grade of concrete for RCC work as per IS 456 is:",
    options: ["M10", "M15", "M20", "M25"],
    answer: "M20",
    explanation: "IS 456:2000 specifies M20 as the minimum grade for reinforced concrete structures.",
  },
  {
    id: 8,
    subject: "Surveying",
    question: "Which instrument is used to measure horizontal and vertical angles?",
    options: ["Planimeter", "Theodolite", "Dumpy Level", "Compass"],
    answer: "Theodolite",
    explanation: "A theodolite measures both horizontal and vertical angles precisely and is used in triangulation surveys.",
  },
  {
    id: 9,
    subject: "Soil Mechanics",
    question: "Consolidation settlement is primarily associated with:",
    options: ["Sandy soils", "Gravel", "Clay soils", "Rock"],
    answer: "Clay soils",
    explanation: "Clay soils undergo consolidation when water is squeezed out under load, causing long-term settlement.",
  },
  {
    id: 10,
    subject: "Transportation",
    question: "The camber on roads is provided to:",
    options: ["Increase speed", "Drain rainwater", "Improve aesthetics", "Reduce friction"],
    answer: "Drain rainwater",
    explanation: "Camber is the transverse slope on a road surface designed to quickly drain rainwater to the sides.",
  },
];

// ─── Data ────────────────────────────────────────────────────────────────────

const DOMAINS: DomainOption[] = [
  {
    id: "ITI",
    label: "ITI",
    icon: "🔧",
    desc: "Industrial Training Institute",
  },
  {
    id: "Diploma",
    label: "Diploma",
    icon: "📐",
    desc: "Diploma in Civil Engineering",
  },
  {
    id: "BTech",
    label: "BTech",
    icon: "🎓",
    desc: "Bachelor of Technology",
  },
];

interface SubjectGroup {
  core: SubjectOption[];
  addon: SubjectOption[];
}

const DOMAIN_SUBJECTS: Record<Domain, SubjectGroup> = {
  ITI: {
    core: [
      { id: "iti-math",    label: "Basic Mathematics", icon: "🔢" },
      { id: "iti-sci",     label: "Basic Science",     icon: "🔬" },
      { id: "iti-safety",  label: "Safety & First Aid", icon: "🩺" },
    ],
    addon: [
      { id: "iti-masonry",    label: "Masonry",    icon: "🧱" },
      { id: "iti-carpentry",  label: "Carpentry",  icon: "🪵" },
      { id: "iti-plumbing",   label: "Plumbing",   icon: "🔧" },
    ],
  },
  Diploma: {
    core: [
      { id: "dip-survey",   label: "Surveying",                  icon: "📏" },
      { id: "dip-bm",       label: "Building Materials",         icon: "🧱" },
      { id: "dip-ct",       label: "Construction Technology",    icon: "🏗️" },
      { id: "dip-em",       label: "Engineering Mechanics",      icon: "⚙️" },
      { id: "dip-irr",      label: "Irrigation Engineering",     icon: "💧" },
      { id: "dip-env",      label: "Environmental Engineering",  icon: "🌿" },
      { id: "dip-transport",label: "Transportation Engineering", icon: "🛣️" },
    ],
    addon: [
      { id: "dip-geo",   label: "Geotechnical Engineering",  icon: "🏔️" },
      { id: "dip-est",   label: "Estimation & Valuation",    icon: "📊" },
      { id: "dip-adv",   label: "Advanced Surveying",        icon: "🗺️" },
      { id: "dip-cm",    label: "Construction Management",   icon: "📋" },
    ],
  },
  BTech: {
    core: [
      { id: "bt-sa",    label: "Structural Analysis",            icon: "🏛️" },
      { id: "bt-fm",    label: "Fluid Mechanics",                icon: "💧" },
      { id: "bt-sq",    label: "Surveying & Quantity Surveying", icon: "📏" },
      { id: "bt-cm",    label: "Construction Management",        icon: "📋" },
      { id: "bt-env",   label: "Environmental Engineering",      icon: "🌿" },
      { id: "bt-ds",    label: "Design of Structures",           icon: "📐" },
      { id: "bt-geo",   label: "Geotechnical Engineering",       icon: "🏔️" },
      { id: "bt-trans", label: "Transportation Engineering",     icon: "🛣️" },
    ],
    addon: [
      { id: "bt-kwa",   label: "KWA",         icon: "🚰" },
      { id: "bt-lsgd",  label: "LSGD",        icon: "🏘️" },
      { id: "bt-irr",   label: "Irrigation",  icon: "🌾" },
      { id: "bt-pcb",   label: "PCB",         icon: "🔩" },
      { id: "bt-gw",    label: "Groundwater", icon: "🌊" },
    ],
  },
};

const DIFFICULTIES: DifficultyOption[] = [
  {
    id: "Easy",
    label: "Easy",
    questions: "25 Questions",
    desc: "Fundamental concepts & basics",
    icon: "🌱",
    color: "emerald",
  },
  {
    id: "Medium",
    label: "Medium",
    questions: "50 Questions",
    desc: "Application level problems",
    icon: "⚡",
    color: "amber",
  },
  {
    id: "Hard",
    label: "Hard",
    questions: "PSC Level",
    desc: "Exam-standard questions",
    icon: "🔥",
    color: "rose",
  },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function StepHeader({
  step,
  title,
  subtitle,
}: {
  step: number;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-white font-bold text-sm shrink-0">
        {step}
      </div>
      <div>
        <h2 className="text-white font-semibold text-lg leading-tight">
          {title}
        </h2>
        <p className="text-zinc-400 text-sm">{subtitle}</p>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function GameArenaPage() {
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty | null>(null);
  const [showMoreSubjects, setShowMoreSubjects] = useState(false);

  // ── Game engine state ──
  const [gameStarted, setGameStarted]                   = useState(false);
  const [questions, setQuestions]                       = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer]             = useState<string | null>(null);
  const [score, setScore]                               = useState(0);
  const [xp, setXp]                                     = useState(0);
  const [showResult, setShowResult]                     = useState(false);
  const [animating, setAnimating]                       = useState(false);

  // ── Advanced features state ──
  const [timeLeft, setTimeLeft]       = useState(15);
  const [streakCount, setStreakCount] = useState(0);
  const [bestStreak, setBestStreak]   = useState(0);
  const [showXpBurst, setShowXpBurst] = useState(false);
  const [streakGlow, setStreakGlow]   = useState(false);
  const [timedOut, setTimedOut]       = useState(false);

  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const handleDomainSelect = (domain: Domain) => {
    if (selectedDomain !== domain) {
      setSelectedSubjects([]);
      setShowMoreSubjects(false);
    }
    setSelectedDomain(domain);
  };

  const currentSubjects = selectedDomain ? DOMAIN_SUBJECTS[selectedDomain] : null;

  const isReady =
    selectedDomain !== null &&
    selectedSubjects.length > 0 &&
    selectedDifficulty !== null;

  const toggleSubject = (id: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  // ── Sound engine (Web Audio API, no external files needed) ──────────────
  const playSound = useCallback((type: "correct" | "wrong" | "timeout") => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "correct") {
        osc.frequency.setValueAtTime(523, ctx.currentTime);
        osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);
      } else if (type === "wrong") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.setValueAtTime(150, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.35);
      } else {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch (_) { /* Audio not supported — silently ignore */ }
  }, []);

  // ── Timer ─────────────────────────────────────────────────────────────────
  const clearTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    setTimeLeft(15);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearTimer();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [clearTimer]);

  // Auto-advance when timer hits 0
  useEffect(() => {
    if (!gameStarted || showResult || selectedAnswer !== null) return;
    if (timeLeft === 0) {
      playSound("timeout");
      setTimedOut(true);
      setSelectedAnswer("__timeout__");
      setStreakCount(0);
      clearTimer();
    }
  }, [timeLeft, gameStarted, showResult, selectedAnswer, playSound, clearTimer]);

  // ── Quiz engine helpers ──────────────────────────────────────────────────

  const handleStart = () => {
    if (!isReady) return;
    const count = selectedDifficulty === "Easy" ? 5 : selectedDifficulty === "Medium" ? 7 : 10;
    const pool  = [...MOCK_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, count);
    setQuestions(pool);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setXp(0);
    setShowResult(false);
    setAnimating(false);
    setStreakCount(0);
    setBestStreak(0);
    setTimedOut(false);
    setShowXpBurst(false);
    setGameStarted(true);
    // Timer starts via useEffect below
  };

  // Start timer when question changes
  useEffect(() => {
    if (gameStarted && !showResult) {
      setTimedOut(false);
      startTimer();
    }
    return clearTimer;
  }, [gameStarted, showResult, currentQuestionIndex]); // eslint-disable-line

  const handleAnswerSelect = (option: string) => {
    if (selectedAnswer !== null) return;
    clearTimer();
    setSelectedAnswer(option);
    const correct = option === questions[currentQuestionIndex].answer;

    if (correct) {
      playSound("correct");
      setScore((s) => s + 1);
      setXp((x) => x + 10);
      setStreakCount((s) => {
        const next = s + 1;
        setBestStreak((b) => Math.max(b, next));
        return next;
      });
      // Streak glow pulse
      setStreakGlow(true);
      setTimeout(() => setStreakGlow(false), 800);
      // XP burst animation
      setShowXpBurst(true);
      setTimeout(() => setShowXpBurst(false), 1200);
    } else {
      playSound("wrong");
      setStreakCount(0);
    }
  };

  const handleNext = () => {
    setAnimating(true);
    setTimedOut(false);
    setTimeout(() => {
      if (currentQuestionIndex + 1 >= questions.length) {
        clearTimer();
        setShowResult(true);
      } else {
        setCurrentQuestionIndex((i) => i + 1);
        setSelectedAnswer(null);
      }
      setAnimating(false);
    }, 300);
  };

  const handlePlayAgain = () => {
    clearTimer();
    setGameStarted(false);
    setShowResult(false);
    setSelectedAnswer(null);
    setCurrentQuestionIndex(0);
    setScore(0);
    setXp(0);
    setStreakCount(0);
    setBestStreak(0);
    setTimedOut(false);
  };

  // ── Derived quiz values ──────────────────────────────────────────────────
  const currentQ   = questions[currentQuestionIndex];
  const isLastQ    = currentQuestionIndex + 1 >= questions.length;
  const pct        = questions.length ? Math.round(((currentQuestionIndex + (selectedAnswer ? 1 : 0)) / questions.length) * 100) : 0;
  const grade      = score / (questions.length || 1);
  const gradeLabel = grade >= 0.8
    ? "🔥 Excellent! You're PSC ready"
    : grade >= 0.6
    ? "👍 Good progress, keep practicing"
    : "📘 Keep learning, you'll improve";
  const gradeColor = grade >= 0.8 ? "text-emerald-400" : grade >= 0.6 ? "text-amber-400" : "text-rose-400";
  const timerDanger = timeLeft <= 5;
  const timerPct    = (timeLeft / 15) * 100;
  const revealed    = selectedAnswer !== null;
  const BG = (
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
  );

  // ─── QUIZ SCREEN ─────────────────────────────────────────────────────────
  if (gameStarted && !showResult && currentQ) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        {BG}

        {/* XP Burst floating animation */}
        <div className={`fixed top-20 right-6 z-50 pointer-events-none transition-all duration-700 ${showXpBurst ? "opacity-100 -translate-y-8" : "opacity-0 translate-y-0"}`}>
          <span className="text-amber-400 font-extrabold text-xl drop-shadow-lg">+10 XP ⚡</span>
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
                  ? `bg-orange-500/20 border-orange-500/40 text-orange-400 ${streakGlow ? "shadow-[0_0_16px_rgba(249,115,22,0.6)]" : "shadow-[0_0_8px_rgba(249,115,22,0.2)]"}`
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

          {/* ── Timer bar ── */}
          <div className="mb-2">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs text-zinc-500">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className={`text-xs font-bold tabular-nums transition-colors duration-300 ${timerDanger ? "text-rose-400" : "text-zinc-400"}`}>
                ⏱ {timeLeft}s
              </span>
            </div>

            {/* Question progress bar */}
            <div className="h-1 bg-zinc-800 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }} />
            </div>

            {/* Timer countdown bar */}
            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-linear
                  ${timerDanger
                    ? "bg-gradient-to-r from-rose-600 to-red-400"
                    : timeLeft <= 10
                    ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                    : "bg-gradient-to-r from-emerald-500 to-teal-400"}`}
                style={{ width: `${timerPct}%` }}
              />
            </div>
          </div>

          {/* Timed out banner */}
          {timedOut && (
            <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-2.5 mb-4 text-rose-400 text-sm font-medium">
              ⏰ Time&apos;s up! The correct answer is highlighted below.
            </div>
          )}

          {/* ── Question card ── */}
          <div className={`transition-all duration-300 ${animating ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"}`}>
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 mb-4 backdrop-blur-sm">
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
                const isCorrect  = opt === currentQ.answer;
                const isSelected = opt === selectedAnswer;
                let cls = "border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:border-zinc-500 hover:bg-zinc-800 hover:shadow-[0_0_12px_rgba(255,255,255,0.04)]";
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
                    className={`flex items-center gap-4 w-full px-4 py-3.5 rounded-xl border text-sm font-medium text-left transition-all duration-200
                      ${cls} ${!revealed ? "cursor-pointer active:scale-[0.985]" : "cursor-default"}`}
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
                {/* Streak message on correct */}
                {selectedAnswer === currentQ.answer && streakCount >= 2 && (
                  <div className="flex items-center justify-center gap-2 text-orange-400 text-sm font-bold animate-pulse">
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

  // ─── RESULT SCREEN ────────────────────────────────────────────────────────
  if (gameStarted && showResult) {
    const medal = score === questions.length ? "🥇" : score >= questions.length * 0.7 ? "🥈" : "🥉";
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">
        {BG}
        <div className="relative z-10 w-full max-w-md text-center py-10">

          {/* Medal */}
          <div className="text-7xl mb-4">{medal}</div>
          <h2 className="text-3xl font-extrabold text-white mb-1">Game Over!</h2>
          <p className={`text-lg font-semibold mb-8 ${gradeColor}`}>{gradeLabel}</p>

          {/* Score card */}
          <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 mb-5 backdrop-blur-sm">
            {/* 4-stat grid */}
            <div className="grid grid-cols-4 gap-3 mb-5">
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl font-extrabold text-white leading-none">
                  {score}<span className="text-zinc-600 text-base">/{questions.length}</span>
                </span>
                <span className="text-zinc-500 text-xs">Score</span>
              </div>
              <div className="flex flex-col items-center gap-1 border-x border-zinc-800">
                <span className="text-2xl font-extrabold text-amber-400 leading-none">+{xp}</span>
                <span className="text-zinc-500 text-xs">XP</span>
              </div>
              <div className="flex flex-col items-center gap-1 border-r border-zinc-800">
                <span className="text-2xl font-extrabold text-orange-400 leading-none">
                  🔥{bestStreak}
                </span>
                <span className="text-zinc-500 text-xs">Best Streak</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl font-extrabold text-sky-400 leading-none">
                  {Math.round((score / questions.length) * 100)}%
                </span>
                <span className="text-zinc-500 text-xs">Accuracy</span>
              </div>
            </div>

            {/* Accuracy bar */}
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700
                  ${grade >= 0.8 ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                  : grade >= 0.6 ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                  : "bg-gradient-to-r from-orange-500 to-amber-400"}`}
                style={{ width: `${Math.round((score / questions.length) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between mt-1.5 text-xs text-zinc-600">
              <span>0%</span><span>100%</span>
            </div>

            {/* Best streak badge */}
            {bestStreak >= 3 && (
              <div className="mt-4 flex items-center justify-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-xl px-4 py-2">
                <span className="text-orange-400 text-sm font-bold">🔥 Best streak of {bestStreak}!</span>
                <span className="text-zinc-500 text-xs">Impressive focus</span>
              </div>
            )}
          </div>

          {/* Config recap */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {[selectedDomain, selectedDifficulty, `${selectedSubjects.length} subject${selectedSubjects.length > 1 ? "s" : ""}`].map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 bg-zinc-800 border border-zinc-700 rounded-full px-3 py-1 text-xs text-zinc-400">
                <span className="text-orange-400">●</span> {tag}
              </span>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleStart}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-400 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-105 active:scale-100 transition-all duration-200"
            >
              🔄 Play Again
            </button>
            <button
              onClick={handlePlayAgain}
              className="flex items-center justify-center gap-2 bg-zinc-800 border border-zinc-700 text-zinc-300 font-semibold px-8 py-3.5 rounded-xl hover:bg-zinc-700 hover:border-zinc-500 transition-all duration-200"
            >
              ⚙️ Change Setup
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ─── SETUP SCREEN ─────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* ── Background grid pattern ── */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-12">
        {/* ── Header ── */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-5">
            <span className="text-orange-400 text-xs font-semibold tracking-widest uppercase">
              Quiz Mode
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 tracking-tight">
            🎮{" "}
            <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
              Game Arena
            </span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-md mx-auto">
            Learn PSC Civil Engineering by playing
          </p>
        </div>

        {/* ── Progress indicators ── */}
        <div className="flex items-center gap-2 mb-10 justify-center">
          {[
            { n: 1, done: !!selectedDomain },
            { n: 2, done: selectedSubjects.length > 0 },
            { n: 3, done: !!selectedDifficulty },
          ].map(({ n, done }, i, arr) => (
            <div key={n} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  done
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
                    : "bg-zinc-800 text-zinc-500 border border-zinc-700"
                }`}
              >
                {done ? "✓" : n}
              </div>
              {i < arr.length - 1 && (
                <div
                  className={`w-12 h-0.5 mx-1 transition-all duration-500 ${
                    done ? "bg-orange-500/60" : "bg-zinc-800"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* ────────────────────────────────────────────
            STEP 1 — Select Domain
        ──────────────────────────────────────────── */}
        <section className="mb-10 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm">
          <StepHeader
            step={1}
            title="Select Domain"
            subtitle="Choose your qualification level"
          />

          <div className="grid grid-cols-3 gap-3">
            {DOMAINS.map((d) => {
              const isSelected = selectedDomain === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => handleDomainSelect(d.id)}
                  className={`group relative flex flex-col items-center justify-center gap-2 p-5 rounded-xl border transition-all duration-200 cursor-pointer text-center
                    ${
                      isSelected
                        ? "border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/10"
                        : "border-zinc-700 bg-zinc-800/50 hover:border-zinc-500 hover:bg-zinc-800"
                    }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-orange-500 shadow-sm shadow-orange-400" />
                  )}
                  <span className="text-2xl">{d.icon}</span>
                  <span
                    className={`font-bold text-base transition-colors ${
                      isSelected ? "text-orange-400" : "text-white"
                    }`}
                  >
                    {d.label}
                  </span>
                  <span className="text-zinc-500 text-xs leading-tight">
                    {d.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ────────────────────────────────────────────
            STEP 2 — Select Subjects (dynamic, domain-gated)
        ──────────────────────────────────────────── */}
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            selectedDomain
              ? "max-h-[1000px] opacity-100 mb-10"
              : "max-h-0 opacity-0 mb-0"
          }`}
        >
          <section className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm">
            <StepHeader
              step={2}
              title="Choose Subjects"
              subtitle={
                selectedSubjects.length > 0
                  ? `${selectedSubjects.length} subject${selectedSubjects.length > 1 ? "s" : ""} selected`
                  : "Select one or more subjects based on your preparation"
              }
            />

            {currentSubjects && (
              <>
                {/* ── Core subjects ── */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {currentSubjects.core.map((s) => {
                    const isSelected = selectedSubjects.includes(s.id);
                    return (
                      <button
                        key={s.id}
                        onClick={() => toggleSubject(s.id)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 cursor-pointer
                          ${
                            isSelected
                              ? "border-orange-500 bg-orange-500/10 text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.15)]"
                              : "border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:border-zinc-500 hover:bg-zinc-800"
                          }`}
                      >
                        <span className="text-base shrink-0">{s.icon}</span>
                        <span className="leading-tight flex-1 text-left">{s.label}</span>
                        {isSelected && (
                          <span className="text-orange-500 text-xs shrink-0">✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* ── More / Add-on subjects ── */}
                {currentSubjects.addon.length > 0 && (
                  <>
                    {/* Expand toggle */}
                    <button
                      onClick={() => setShowMoreSubjects((p) => !p)}
                      className="mt-4 flex items-center gap-2 text-sm text-orange-400 hover:text-orange-300 transition-colors font-medium group"
                    >
                      <span
                        className={`inline-flex items-center justify-center w-5 h-5 rounded-full border border-orange-500/50 bg-orange-500/10 text-orange-400 text-xs transition-transform duration-300 ${
                          showMoreSubjects ? "rotate-45" : "rotate-0"
                        }`}
                      >
                        +
                      </span>
                      {showMoreSubjects ? "Hide extra subjects" : `+ More Subjects (${currentSubjects.addon.length} add-ons)`}
                    </button>

                    {/* Add-on subject chips */}
                    <div
                      className={`grid grid-cols-2 sm:grid-cols-3 gap-2.5 transition-all duration-400 ease-in-out overflow-hidden ${
                        showMoreSubjects
                          ? "max-h-96 opacity-100 mt-2.5"
                          : "max-h-0 opacity-0 mt-0"
                      }`}
                    >
                      {currentSubjects.addon.map((s) => {
                        const isSelected = selectedSubjects.includes(s.id);
                        return (
                          <button
                            key={s.id}
                            onClick={() => toggleSubject(s.id)}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 cursor-pointer
                              ${
                                isSelected
                                  ? "border-orange-500 bg-orange-500/10 text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.15)]"
                                  : "border-zinc-700/60 border-dashed bg-zinc-800/30 text-zinc-400 hover:border-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
                              }`}
                          >
                            <span className="text-base shrink-0">{s.icon}</span>
                            <span className="leading-tight flex-1 text-left">{s.label}</span>
                            {isSelected && (
                              <span className="text-orange-500 text-xs shrink-0">✓</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}

                {/* ── Bottom bar: select-all + clear ── */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-800">
                  <button
                    onClick={() => {
                      const all = [
                        ...currentSubjects.core,
                        ...(showMoreSubjects ? currentSubjects.addon : []),
                      ].map((s) => s.id);
                      const allVisible = all.every((id) =>
                        selectedSubjects.includes(id)
                      );
                      if (allVisible) {
                        setSelectedSubjects([]);
                      } else {
                        setSelectedSubjects((prev) =>
                          Array.from(new Set([...prev, ...all]))
                        );
                      }
                    }}
                    className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {[
                      ...currentSubjects.core,
                      ...(showMoreSubjects ? currentSubjects.addon : []),
                    ].every((s) => selectedSubjects.includes(s.id))
                      ? "Deselect all"
                      : "Select all visible"}
                  </button>
                  {selectedSubjects.length > 0 && (
                    <button
                      onClick={() => setSelectedSubjects([])}
                      className="text-xs text-zinc-600 hover:text-rose-400 transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </>
            )}
          </section>
        </div>

        {/* ────────────────────────────────────────────
            STEP 3 — Select Difficulty
        ──────────────────────────────────────────── */}
        <section className="mb-10 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm">
          <StepHeader
            step={3}
            title="Select Difficulty"
            subtitle="How challenging do you want it?"
          />

          <div className="grid grid-cols-3 gap-3">
            {DIFFICULTIES.map((d) => {
              const isSelected = selectedDifficulty === d.id;

              const accentMap: Record<string, string> = {
                emerald: isSelected
                  ? "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10"
                  : "border-zinc-700 bg-zinc-800/50 hover:border-emerald-700 hover:bg-zinc-800",
                amber: isSelected
                  ? "border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10"
                  : "border-zinc-700 bg-zinc-800/50 hover:border-amber-700 hover:bg-zinc-800",
                rose: isSelected
                  ? "border-rose-500 bg-rose-500/10 shadow-lg shadow-rose-500/10"
                  : "border-zinc-700 bg-zinc-800/50 hover:border-rose-700 hover:bg-zinc-800",
              };

              const textMap: Record<string, string> = {
                emerald: "text-emerald-400",
                amber: "text-amber-400",
                rose: "text-rose-400",
              };

              return (
                <button
                  key={d.id}
                  onClick={() => setSelectedDifficulty(d.id)}
                  className={`group relative flex flex-col items-center gap-2 p-5 rounded-xl border transition-all duration-200 cursor-pointer text-center
                    ${accentMap[d.color]}`}
                >
                  {isSelected && (
                    <div
                      className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
                        d.color === "emerald"
                          ? "bg-emerald-500"
                          : d.color === "amber"
                          ? "bg-amber-500"
                          : "bg-rose-500"
                      }`}
                    />
                  )}
                  <span className="text-2xl">{d.icon}</span>
                  <span
                    className={`font-bold text-base ${
                      isSelected ? textMap[d.color] : "text-white"
                    }`}
                  >
                    {d.label}
                  </span>
                  <span
                    className={`text-xs font-semibold ${
                      isSelected ? textMap[d.color] : "text-zinc-400"
                    }`}
                  >
                    {d.questions}
                  </span>
                  <span className="text-zinc-500 text-xs">{d.desc}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ────────────────────────────────────────────
            Summary + Start Button
        ──────────────────────────────────────────── */}

        {/* Config summary pills (visible when all set) */}
        {isReady && (
          <div className="flex flex-wrap justify-center gap-2 mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <span className="inline-flex items-center gap-1 bg-zinc-800 border border-zinc-700 rounded-full px-3 py-1 text-xs text-zinc-300">
              <span className="text-orange-400">●</span> {selectedDomain}
            </span>
            <span className="inline-flex items-center gap-1 bg-zinc-800 border border-zinc-700 rounded-full px-3 py-1 text-xs text-zinc-300">
              <span className="text-orange-400">●</span>{" "}
              {selectedSubjects.length} subject
              {selectedSubjects.length > 1 ? "s" : ""}
            </span>
            <span className="inline-flex items-center gap-1 bg-zinc-800 border border-zinc-700 rounded-full px-3 py-1 text-xs text-zinc-300">
              <span className="text-orange-400">●</span> {selectedDifficulty}
            </span>
          </div>
        )}

        {/* Start Button */}
        <div className="flex justify-center">
          <button
            onClick={handleStart}
            disabled={!isReady}
            className={`
              relative flex items-center gap-3 px-10 py-4 rounded-2xl text-lg font-bold tracking-wide transition-all duration-300
              ${
                isReady
                  ? "bg-gradient-to-r from-orange-500 to-amber-400 text-white shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 active:scale-100 cursor-pointer"
                  : "bg-zinc-800 text-zinc-600 border border-zinc-700 cursor-not-allowed"
              }
            `}
          >
            {isReady && (
              <span className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-200" />
            )}
            <span className="relative">🚀</span>
            <span className="relative">
              {isReady ? "Start Game" : "Complete all steps to start"}
            </span>
          </button>
        </div>

        {!isReady && (
          <p className="text-center text-zinc-600 text-xs mt-3">
            {!selectedDomain
              ? "Select a domain to begin"
              : selectedSubjects.length === 0
              ? "Pick at least one subject"
              : "Choose a difficulty level"}
          </p>
        )}
      </div>
    </main>
  );
}
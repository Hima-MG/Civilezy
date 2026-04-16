"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getQuestions, getAllSubjects, type Question } from "@/data/quesions";
import type { Domain } from "@/data/subjectHierarchy";
import { EXTERNAL_URLS } from "@/lib/constants";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type Level = "iti" | "dip" | "btech";
type Phase = "loading" | "quiz" | "result" | "error";

interface MiniArenaPreviewProps {
  level: Level;
}

/** Lightweight question — only fields the mini arena needs */
interface MiniQuestion {
  question: string;
  options: [string, string, string, string];
  correct: 0 | 1 | 2 | 3;
}

// Map Hero's level keys → Domain type used by data layer
const LEVEL_TO_DOMAIN: Record<Level, Domain> = {
  iti: "iti",
  dip: "diploma",
  btech: "btech",
};

const TOTAL_QUESTIONS = 5;
const AUTO_ADVANCE_MS = 800; // snappy advance — no explanation to read

// ---------------------------------------------------------------------------
// Module-level in-memory cache — persists across re-renders & level switches
// ---------------------------------------------------------------------------
const questionCache: Record<Level, MiniQuestion[] | null> = {
  iti: null,
  dip: null,
  btech: null,
};

/** Strip a full Question down to only the fields the mini arena renders */
function toMini(q: Question): MiniQuestion {
  return { question: q.question, options: q.options, correct: q.correct };
}

/** Fetch, convert, and cache questions for a given level */
async function fetchAndCache(lvl: Level): Promise<MiniQuestion[]> {
  const domain = LEVEL_TO_DOMAIN[lvl];
  const subjects = getAllSubjects(domain);
  const full = await getQuestions(domain, subjects, undefined, TOTAL_QUESTIONS);
  const mini = full.map(toMini);
  questionCache[lvl] = mini;
  return mini;
}

// ---------------------------------------------------------------------------
// Inline style constants (matches Hero glass-morphism design)
// ---------------------------------------------------------------------------
const OPT_SHARED: React.CSSProperties = {
  borderRadius: "8px",
  padding: "8px 12px",
  fontSize: "12px",
  transition: "all 0.18s",
  textAlign: "center",
  fontFamily: "Nunito, sans-serif",
  fontWeight: 500,
  lineHeight: 1.4,
};

const STYLES = {
  option: {
    base:    { ...OPT_SHARED, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.85)", cursor: "pointer" },
    correct: { ...OPT_SHARED, background: "rgba(50,200,100,0.2)",   border: "1px solid #32C864",               color: "#32C864",                cursor: "default" },
    wrong:   { ...OPT_SHARED, background: "rgba(255,50,50,0.2)",    border: "1px solid #FF3232",               color: "#FF6464",                cursor: "default" },
    dimmed:  { ...OPT_SHARED, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.85)", cursor: "default", opacity: 0.5 },
  },
} as const;

const QUESTION_STYLE: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 600,
  marginBottom: "12px",
  lineHeight: 1.5,
  color: "#fff",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical" as const,
  overflow: "hidden",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function MiniArenaPreview({ level }: MiniArenaPreviewProps) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [questions, setQuestions] = useState<MiniQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  // Guard against stale fetches when level changes rapidly
  const fetchIdRef = useRef(0);

  // ── Load questions (from cache or network) ──
  const loadQuestions = useCallback(async (lvl: Level) => {
    const id = ++fetchIdRef.current;
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setErrorMsg("");

    // Instant path: use cached questions
    const cached = questionCache[lvl];
    if (cached) {
      setQuestions(cached);
      setPhase("quiz");
      return;
    }

    // Network path: show skeleton, fetch, cache
    setPhase("loading");
    try {
      const mini = await fetchAndCache(lvl);
      if (id !== fetchIdRef.current) return; // stale
      setQuestions(mini);
      setPhase("quiz");
    } catch (err) {
      if (id !== fetchIdRef.current) return;
      setErrorMsg(
        err instanceof Error && err.message === "NO_QUESTIONS"
          ? "No questions available for this level yet. Try another level!"
          : "Failed to load questions. Please try again.",
      );
      setPhase("error");
    }
  }, []);

  // Load current level + prefetch the other two in background
  useEffect(() => {
    loadQuestions(level);

    // Prefetch remaining levels silently (fire-and-forget)
    const others = (["iti", "dip", "btech"] as Level[]).filter((l) => l !== level);
    others.forEach((l) => {
      if (!questionCache[l]) fetchAndCache(l).catch(() => {});
    });
  }, [level, loadQuestions]);

  // ── Handle answer selection ──
  const handleAnswer = useCallback(
    (optionIndex: number) => {
      if (selectedOption !== null) return;
      setSelectedOption(optionIndex);

      if (optionIndex === questions[currentIndex].correct) {
        setScore((s) => s + 1);
      }

      // Fast auto-advance
      setTimeout(() => {
        if (currentIndex + 1 >= TOTAL_QUESTIONS) {
          setPhase("result");
        } else {
          setCurrentIndex((i) => i + 1);
          setSelectedOption(null);
        }
      }, AUTO_ADVANCE_MS);
    },
    [selectedOption, questions, currentIndex],
  );

  // ── Get option style based on answer state ──
  const getOptionStyle = (index: number): React.CSSProperties => {
    if (selectedOption === null) return STYLES.option.base;
    if (index === questions[currentIndex].correct) return STYLES.option.correct;
    if (index === selectedOption) return STYLES.option.wrong;
    return STYLES.option.dimmed;
  };

  // ── Loading skeleton ──
  if (phase === "loading") {
    return (
      <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: "14px", padding: "16px", marginBottom: "16px" }}>
        <div style={{ height: "14px", width: "60%", background: "rgba(255,255,255,0.08)", borderRadius: "6px", marginBottom: "12px", animation: "pulse 1.5s ease-in-out infinite" }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ height: "34px", background: "rgba(255,255,255,0.05)", borderRadius: "8px", animation: "pulse 1.5s ease-in-out infinite", animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      </div>
    );
  }

  // ── Error state ──
  if (phase === "error") {
    return (
      <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: "14px", padding: "20px", marginBottom: "16px", textAlign: "center" }}>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", marginBottom: "12px" }}>{errorMsg}</p>
        <button
          onClick={() => loadQuestions(level)}
          style={{ background: "rgba(255,98,0,0.2)", border: "1px solid rgba(255,98,0,0.4)", color: "#FF8534", borderRadius: "8px", padding: "8px 20px", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "Nunito, sans-serif" }}
        >
          Try Again
        </button>
      </div>
    );
  }

  // ── Result state ──
  if (phase === "result") {
    let heading: string;
    let subtext: string | null = null;
    let accentColor: string;

    if (score >= 4) {
      heading = "Excellent! You\u2019re Arena Ready.";
      accentColor = "#32C864";
    } else if (score >= 2) {
      heading = "Good Attempt \u2014 Practice More to Improve.";
      accentColor = "#FFB800";
    } else {
      heading = "Looks Like You Need More Preparation.";
      subtext = "Start with structured lessons before entering the full arena.";
      accentColor = "#FF6464";
    }

    return (
      <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: "14px", padding: "20px", marginBottom: "16px", textAlign: "center" }}>
        {/* Score badge */}
        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "48px", height: "48px", borderRadius: "50%", background: `${accentColor}20`, border: `2px solid ${accentColor}`, fontSize: "18px", fontWeight: 800, color: accentColor, fontFamily: "Rajdhani, sans-serif", marginBottom: "10px" }}>
          {score}/{TOTAL_QUESTIONS}
        </div>

        <p style={{ fontSize: "15px", fontWeight: 700, color: accentColor, marginBottom: subtext ? "6px" : "14px", fontFamily: "Rajdhani, sans-serif", lineHeight: 1.3 }}>
          {heading}
        </p>

        {subtext && (
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", marginBottom: "14px", lineHeight: 1.5 }}>{subtext}</p>
        )}

        {/* CTAs */}
        <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
          {score >= 4 && (
            <Link
              href="/game-arena"
              style={{ background: "linear-gradient(135deg,#FF6200,#FF4500)", color: "white", border: "none", padding: "10px 20px", borderRadius: "10px", fontFamily: "Nunito, sans-serif", fontSize: "13px", fontWeight: 800, cursor: "pointer", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              Enter Full Game Arena
            </Link>
          )}

          {score >= 2 && score < 4 && (
            <button
              onClick={() => { questionCache[level] = null; loadQuestions(level); }}
              style={{ background: "rgba(255,184,0,0.2)", border: "1px solid rgba(255,184,0,0.4)", color: "#FFB800", borderRadius: "10px", padding: "10px 20px", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "Nunito, sans-serif" }}
            >
              Retry Challenge
            </button>
          )}

          {score <= 1 && (
            <>
              <button
                onClick={() => { questionCache[level] = null; loadQuestions(level); }}
                style={{ background: "rgba(255,100,100,0.15)", border: "1px solid rgba(255,100,100,0.3)", color: "#FF6464", borderRadius: "10px", padding: "10px 20px", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "Nunito, sans-serif" }}
              >
                Retry Quiz
              </button>
              <a
                href={EXTERNAL_URLS.demo}
                target="_blank"
                rel="noopener noreferrer"
                style={{ background: "rgba(255,98,0,0.2)", border: "1px solid rgba(255,98,0,0.4)", color: "#FF8534", borderRadius: "10px", padding: "10px 20px", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "Nunito, sans-serif", textDecoration: "none" }}
              >
                Start Learning Path
              </a>
            </>
          )}
        </div>
      </div>
    );
  }

  // ── Quiz state ──
  const q = questions[currentIndex];
  if (!q) return null;

  return (
    <div
      role="region"
      aria-label="Mini arena quiz"
      style={{ background: "rgba(0,0,0,0.3)", borderRadius: "14px", padding: "16px", marginBottom: "16px" }}
    >
      {/* Progress indicator */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.45)", letterSpacing: "0.5px" }}>
          QUESTION {currentIndex + 1}/{TOTAL_QUESTIONS}
        </span>
        <div style={{ display: "flex", gap: "4px" }}>
          {Array.from({ length: TOTAL_QUESTIONS }).map((_, i) => (
            <div
              key={i}
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: i < currentIndex ? "#FF6200" : i === currentIndex ? "#FFB800" : "rgba(255,255,255,0.15)",
                transition: "background 0.3s",
              }}
            />
          ))}
        </div>
      </div>

      {/* Question text — clamped to 2 lines */}
      <p style={QUESTION_STYLE}>{q.question}</p>

      {/* Options grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }} role="group" aria-label="Answer options">
        {q.options.map((opt, i) => {
          const isCorrect = selectedOption !== null && i === q.correct;
          const isWrong = selectedOption === i && i !== q.correct;
          return (
            <button
              key={`${currentIndex}-${i}`}
              onClick={() => handleAnswer(i)}
              disabled={selectedOption !== null}
              aria-label={`${opt}${isCorrect ? " \u2014 correct" : isWrong ? " \u2014 incorrect" : ""}`}
              style={getOptionStyle(i)}
              onMouseEnter={(e) => {
                if (selectedOption !== null) return;
                e.currentTarget.style.background = "rgba(255,98,0,0.2)";
                e.currentTarget.style.borderColor = "#FF6200";
              }}
              onMouseLeave={(e) => {
                if (selectedOption !== null) return;
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              }}
            >
              {isCorrect ? `\u2713 ${opt}` : opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

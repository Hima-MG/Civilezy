"use client";

import { useEffect, useRef, forwardRef, useCallback, useState } from "react";

// ─── Types ──────────────────────────────────────────────────────────────────
type ColorScheme = "orange" | "gold" | "blue" | "emerald";
type DomainKey = "ITI" | "Diploma" | "BTech" | "Surveyor";

interface LevelCardData {
  scheme:    ColorScheme;
  domain:    DomainKey;
  tag:       string;
  title:     string;
  desc:      string;
  pools:     string[];
  info:      string;
  cta:       string;
  ariaLabel: string;
}

import { EXTERNAL_URLS } from "@/lib/constants";

// ─── Pricing links ──────────────────────────────────────────────────────────
const PRICING_LINKS: Record<DomainKey, string> = {
  ITI:      EXTERNAL_URLS.checkout.iti,
  Diploma:  EXTERNAL_URLS.checkout.diploma,
  BTech:    EXTERNAL_URLS.checkout.btech,
  Surveyor: EXTERNAL_URLS.checkout.surveyor,
};

// ─── Data ───────────────────────────────────────────────────────────────────
const LEVEL_CARDS: LevelCardData[] = [
  {
   scheme:    "orange",
domain:    "ITI",
tag:       "ITI LEVEL",
title:     "Civil PSC – ITI",
desc:      "For Overseer / Draughtsman Gr 2 & 3, Tradesman, Tracer, Work Superintendent and more — across various Kerala departments.",
pools:     ["KWA", "PWD", "LSGD", "Irrigation"],
info:      "30,000+ Questions • 1,000+ Mock Tests • Smart Interactive Lessons • Bite-sized Video Lectures • Malayalam Audio Lessons • Smart Practice Quiz",
cta:       "Start ITI Prep →",
ariaLabel: "Start ITI Civil PSC preparation",
  },
  {
   scheme:    "gold",
domain:    "Diploma",
tag:       "DIPLOMA LEVEL",
title:     "Civil PSC – Diploma",
desc:      "For Diploma Civil Engineering holders. Targets Overseer Gr 1, Overseer Gr 2 & 3, Junior Instructor, Site Engineer etc. across various Kerala departments.",
pools:     ["PWD", "Irrigation", "LSGD", "KWA", "Harbour", "KSEB"],
info:      "50,000+ Questions • 1200+ Mock Tests • Smart Interactive Lessons • Bite-sized Video Lectures • Malayalam Audio Lessons • Smart Practice Quiz",
cta:       "Start Diploma Prep →",
ariaLabel: "Start Diploma Civil PSC preparation",
  },
  {
    scheme:    "blue",
domain:    "BTech",
tag:       "B.TECH LEVEL",
title:     "Civil PSC – B.Tech",
desc:      "For B.Tech Civil Engineering graduates. Targets Assistant Engineer posts across various Kerala departments.",
pools:     ["PWD", "Irrigation", "LSGD", "KWA", "PCB"],
info:      "70,000+ Questions • 1500+ Mock Tests • Smart Interactive Lessons • Bite-sized Video Lectures • Malayalam Audio Lessons • Smart Practice Quiz • Rank Booster Lessons • AE Level Mock Tests",
cta:       "Start B.Tech Prep →",
ariaLabel: "Start B.Tech Civil PSC preparation",
  },
  {
    scheme:    "emerald",
  
domain:    "Surveyor",
tag:       "SURVEYOR",
title:     "Surveyor Course",
desc:      "For ITI Surveyor license holders. Covers all surveyor-grade Kerala PSC civil engineering pools — Surveyor Gr II, Tradesman (Survey) and others.",
pools:     ["KWA", "Survey & Land Records", "Tech. Education", "Groundwater Dept."],
info:      "30,000+ Questions • 1,000+ Mock Tests • Smart Interactive Lessons • Bite-sized Video Lectures • Malayalam Audio Lessons • Smart Practice Quiz",
cta:       "Start Surveyor Prep →",
ariaLabel: "Start Surveyor Civil PSC preparation",
  },
];

// ─── Per-scheme style tokens (module-level, never recreated) ─────────────────
const SCHEME_TOKENS: Record<ColorScheme, {
  cardBg: string; cardBorder: string; cardShadow: string; cardShadowHover: string;
  tagBg: string; tagColor: string; ctaBg: string; ctaColor: string; ctaShadow: string;
}> = {
  orange: {
    cardBg:"linear-gradient(135deg,#1A0A00,#3D1500)",
    cardBorder:"1px solid rgba(255,98,0,0.4)",
    cardShadow:"0 4px 30px rgba(255,98,0,0.15)",
    cardShadowHover:"0 16px 40px rgba(255,98,0,0.3)",
    tagBg:"rgba(255,98,0,0.25)",    tagColor:"#FF8534",
    ctaBg:"linear-gradient(90deg,#FF6200,#FF8534)", ctaColor:"white",
    ctaShadow:"0 4px 15px rgba(255,98,0,0.35)",
  },
  gold: {
    cardBg:"linear-gradient(135deg,#1A1500,#3D3000)",
    cardBorder:"1px solid rgba(255,184,0,0.4)",
    cardShadow:"0 4px 30px rgba(255,184,0,0.15)",
    cardShadowHover:"0 16px 40px rgba(255,184,0,0.3)",
    tagBg:"rgba(255,184,0,0.25)",   tagColor:"#FFB800",
    ctaBg:"linear-gradient(90deg,#FFB800,#FFD54F)", ctaColor:"#1A0F00",
    ctaShadow:"0 4px 15px rgba(255,184,0,0.35)",
  },
  blue: {
    cardBg:"linear-gradient(135deg,#001230,#002460)",
    cardBorder:"1px solid rgba(100,200,255,0.4)",
    cardShadow:"0 4px 30px rgba(100,200,255,0.15)",
    cardShadowHover:"0 16px 40px rgba(100,200,255,0.25)",
    tagBg:"rgba(100,200,255,0.15)", tagColor:"#64C8FF",
    ctaBg:"linear-gradient(90deg,#1565C0,#1E88E5)",  ctaColor:"white",
    ctaShadow:"0 4px 15px rgba(100,200,255,0.25)",
  },
  emerald: {
    cardBg:"linear-gradient(135deg,#001A0A,#003D1A)",
    cardBorder:"1px solid rgba(16,185,129,0.4)",
    cardShadow:"0 4px 30px rgba(16,185,129,0.15)",
    cardShadowHover:"0 16px 40px rgba(16,185,129,0.25)",
    tagBg:"rgba(16,185,129,0.2)",  tagColor:"#34D399",
    ctaBg:"linear-gradient(90deg,#059669,#10B981)", ctaColor:"white",
    ctaShadow:"0 4px 15px rgba(16,185,129,0.3)",
  },
};

// ─── Main Component ──────────────────────────────────────────────────────────
export default function LevelsSection() {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Stable ref setter — avoids creating new callback on every render
  const setCardRef = useCallback((i: number) => (el: HTMLDivElement | null) => {
    cardsRef.current[i] = el;
  }, []);

  // Scroll-triggered fade-up (logic unchanged)
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("in-view"); }),
      { threshold: 0.1 }
    );
    cardsRef.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="levels"
      aria-labelledby="levels-heading"
      style={{ padding:"80px 5%", background:"#0B1E3D" }}
    >
      {/* ── Section header ── */}
      <div style={{ textAlign:"center", maxWidth:"700px", margin:"0 auto 60px" }}>
        <div
          aria-hidden="true"
          style={{ display:"inline-block", background:"rgba(255,98,0,0.15)", border:"1px solid rgba(255,98,0,0.3)", borderRadius:"20px", padding:"4px 16px", fontSize:"12px", fontWeight:700, color:"#FF8534", letterSpacing:"0.5px", marginBottom:"16px" }}
        >
          YOUR LEARNING PATH
        </div>

        <h2
          id="levels-heading"
          style={{ fontFamily:"Rajdhani, sans-serif", fontSize:"clamp(28px,4vw,44px)", fontWeight:700, lineHeight:1.2, marginBottom:"16px", color:"#ffffff" }}
        >
          Choose Your{" "}
          <span style={{ background:"linear-gradient(135deg,#FF6200,#FFB800)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
            Course Category
          </span>
        </h2>

        <p style={{ fontSize:"17px", color:"rgba(255,255,255,0.85)", lineHeight:1.7, margin:0 }}>
          Kerala PSC Civil Engineering is category-driven — and so are we. Every lesson, every question, every mock test is mapped precisely to your course category. No guesswork, no irrelevant content. Just what you need, exactly when you need it.
        </p>
      </div>

      {/* ── Level cards grid ── */}
      <div className="levels-grid" role="list" aria-label="Available course levels">
        {LEVEL_CARDS.map((card, i) => (
          <LevelCard
            key={card.tag}
            data={card}
            ref={setCardRef(i)}
          />
        ))}
      </div>
    </section>
  );
}

// ─── Level Card ──────────────────────────────────────────────────────────────
const LevelCard = forwardRef<HTMLDivElement, { data: LevelCardData }>(
  function LevelCard({ data }, ref) {
    const t = SCHEME_TOKENS[data.scheme];
    const [redirecting, setRedirecting] = useState(false);

    const onCardEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      (e.currentTarget as HTMLDivElement).style.transform = "translateY(-8px)";
      (e.currentTarget as HTMLDivElement).style.boxShadow = t.cardShadowHover;
    }, [t.cardShadowHover]);

    const onCardLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      (e.currentTarget as HTMLDivElement).style.boxShadow = t.cardShadow;
    }, [t.cardShadow]);

    const onCtaEnter = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.opacity   = "0.9";
      e.currentTarget.style.transform = "scale(1.04)";
    }, []);

    const onCtaLeave = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.opacity   = "1";
      e.currentTarget.style.transform = "scale(1)";
    }, []);

    const handleClick = useCallback(() => {
      if (redirecting) return;
      // Save selection to localStorage
      try { localStorage.setItem("civilezy_domain", data.domain); } catch { /* ok */ }
      setRedirecting(true);
      // Brief delay for UX feedback, then redirect
      setTimeout(() => {
        window.location.href = PRICING_LINKS[data.domain];
      }, 300);
    }, [data.domain, redirecting]);

    return (
      <div
        ref={ref}
        role="listitem"
        className="level-card-animate"
        style={{ background:t.cardBg, border:t.cardBorder, borderRadius:"20px", padding:"32px", position:"relative", overflow:"hidden", boxShadow:t.cardShadow, transition:"transform 0.3s, box-shadow 0.3s, opacity 0.5s ease", cursor:"pointer" }}
        onMouseEnter={onCardEnter}
        onMouseLeave={onCardLeave}
        onClick={handleClick}
      >
        {/* Redirecting overlay */}
        {redirecting && (
          <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.6)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:10, borderRadius:"20px", backdropFilter:"blur(4px)" }}>
            <span style={{ color:"#fff", fontSize:"14px", fontWeight:700 }}>Redirecting to your course...</span>
          </div>
        )}

        {/* Level tag */}
        <div
          aria-hidden="true"
          style={{ display:"inline-block", borderRadius:"8px", padding:"4px 12px", fontSize:"11px", fontWeight:800, letterSpacing:"1px", marginBottom:"16px", background:t.tagBg, color:t.tagColor }}
        >
          {data.tag}
        </div>

        {/* Card title */}
        <h3 style={{ fontFamily:"Rajdhani, sans-serif", fontSize:"26px", fontWeight:700, marginBottom:"8px", color:"#ffffff" }}>
          {data.title}
        </h3>

        {/* Description */}
        <p style={{ fontSize:"14px", color:"rgba(255,255,255,0.85)", marginBottom:"20px", lineHeight:1.6 }}>
          {data.desc}
        </p>

        {/* Pool tags */}
        <div
          style={{ display:"flex", flexWrap:"wrap", gap:"8px", marginBottom:"20px" }}
          aria-label={`Exam pools covered: ${data.pools.join(", ")}`}
        >
          {data.pools.map(pool => (
            <span
              key={pool}
              aria-hidden="true"
              style={{ fontSize:"11px", fontWeight:700, padding:"4px 10px", borderRadius:"20px", background:"rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.85)", border:"1px solid rgba(255,255,255,0.1)" }}
            >
              {pool}
            </span>
          ))}
        </div>

        {/* Info line */}
        <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.55)", marginBottom:"16px" }}>
          {data.info}
        </p>

        {/* CTA button */}
        <button
          aria-label={data.ariaLabel}
          onClick={(e) => { e.stopPropagation(); handleClick(); }}
          style={{ display:"block", width:"100%", padding:"12px", borderRadius:"50px", fontFamily:"Nunito, sans-serif", fontSize:"15px", fontWeight:700, cursor:"pointer", textAlign:"center", border:"none", background:t.ctaBg, color:t.ctaColor, boxShadow:t.ctaShadow, transition:"opacity 0.2s, transform 0.2s" }}
          onMouseEnter={onCtaEnter}
          onMouseLeave={onCtaLeave}
        >
          {redirecting ? "Redirecting..." : data.cta}
        </button>
      </div>
    );
  }
);
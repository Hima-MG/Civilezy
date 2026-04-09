"use client";

import { useEffect, useRef, forwardRef, useCallback } from "react";
import Link from "next/link";

// ─── Types ──────────────────────────────────────────────────────────────────
type ColorScheme = "orange" | "gold" | "blue";

interface LevelCardData {
  scheme: ColorScheme;
  tag:    string;
  title:  string;
  desc:   string;
  pools:  string[];
  info:   string;
  cta:    string;
  href:   string;
  ariaLabel: string;   // descriptive CTA label for screen readers
}

// ─── Data ───────────────────────────────────────────────────────────────────
const LEVEL_CARDS: LevelCardData[] = [
  {
    scheme:    "orange",
    tag:       "ITI LEVEL",
    title:     "ITI Civil PSC",
    desc:      "For ITI Civil Trade holders. Covers KWA Helper, PWD Mazdoor, LSGD posts and all ITI-grade civil engineering PSC pools.",
    pools:     ["KWA-ITI","PWD-ITI","LSGD-ITI","IRD-ITI"],
    info:      "3,200+ Questions • 45 Mock Tests • Malayalam Notes",
    cta:       "Start ITI Prep →",
    href:      "/courses",
    ariaLabel: "Start ITI Civil PSC preparation",
  },
  {
    scheme:    "gold",
    tag:       "DIPLOMA LEVEL",
    title:     "Diploma Civil PSC",
    desc:      "For Diploma Civil Engineering holders. Targets Overseer, Site Supervisor, Technical Assistant posts across all Kerala departments.",
    pools:     ["DIP-G1","KWA-DIP","PWD-DIP","KSEB-DIP"],
    info:      "5,800+ Questions • 72 Mock Tests • Bilingual",
    cta:       "Start Diploma Prep →",
    href:      "/courses",
    ariaLabel: "Start Diploma Civil PSC preparation",
  },
  {
    scheme:    "blue",
    tag:       "AE / DEGREE",
    title:     "AE / B.Tech PSC",
    desc:      "For B.Tech Civil Engineering graduates. Targets Assistant Engineer posts in KWA, PWD, LSGD, KSEB — the most competitive PSC pool.",
    pools:     ["AE-KWA","AE-PWD","AE-LSGD","AE-KSEB"],
    info:      "7,400+ Questions • 95 Mock Tests • Expert Notes",
    cta:       "Start AE Prep →",
    href:      "/courses",
    ariaLabel: "Start AE / BTech Civil PSC preparation",
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
            Exam Pool
          </span>
        </h2>

        <p style={{ fontSize:"17px", color:"rgba(255,255,255,0.85)", lineHeight:1.7, margin:0 }}>
          Kerala PSC Civil Engineering follows a strict pool-based system.
          We&apos;ve mapped every question to the exact pool — something no other platform does.
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

    // Per-instance handlers — stable as long as `t` doesn't change (it never does)
    const onCardEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      (e.currentTarget as HTMLDivElement).style.transform = "translateY(-8px)";
      (e.currentTarget as HTMLDivElement).style.boxShadow = t.cardShadowHover;
    }, [t.cardShadowHover]);

    const onCardLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      (e.currentTarget as HTMLDivElement).style.boxShadow = t.cardShadow;
    }, [t.cardShadow]);

    const onCtaEnter = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
      e.currentTarget.style.opacity   = "0.9";
      e.currentTarget.style.transform = "scale(1.02)";
    }, []);

    const onCtaLeave = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
      e.currentTarget.style.opacity   = "1";
      e.currentTarget.style.transform = "scale(1)";
    }, []);

    return (
      <div
        ref={ref}
        role="listitem"
        className="level-card-animate"
        style={{ background:t.cardBg, border:t.cardBorder, borderRadius:"20px", padding:"32px", position:"relative", overflow:"hidden", boxShadow:t.cardShadow, transition:"transform 0.3s, box-shadow 0.3s, opacity 0.5s ease" }}
        onMouseEnter={onCardEnter}
        onMouseLeave={onCardLeave}
      >
        {/* Level tag — aria-hidden: title already conveys this */}
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

        {/* CTA — uses Next.js Link for client-side nav + prefetch */}
        <Link
          href={data.href}
          aria-label={data.ariaLabel}
          style={{ display:"block", width:"100%", padding:"12px", borderRadius:"50px", fontFamily:"Nunito, sans-serif", fontSize:"15px", fontWeight:700, cursor:"pointer", textAlign:"center", textDecoration:"none", background:t.ctaBg, color:t.ctaColor, boxShadow:t.ctaShadow, transition:"opacity 0.2s, transform 0.2s" }}
          onMouseEnter={onCtaEnter}
          onMouseLeave={onCtaLeave}
        >
          {data.cta}
        </Link>
      </div>
    );
  }
);
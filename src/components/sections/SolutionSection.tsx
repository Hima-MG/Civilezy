"use client";

import { useEffect, useRef, useCallback, forwardRef } from "react";

// ─── Types ──────────────────────────────────────────────────────────────────
interface FeatureCardData {
  icon:         string;
  title:        string;
  desc:         string;
  detail:       string;
  accentBg:     string;
  accentBorder: string;
  accentColor:  string;
  cardBorder:   string;
  cardShadow:   string;
  hoverBorder:  string;
  hoverShadow:  string;
}

// ─── Data ───────────────────────────────────────────────────────────────────
const FEATURE_CARDS: FeatureCardData[] = [
  {
    icon:"📘", title:"Smart Lessons",
    desc:"Structured syllabus based on PSC pools. No confusion. No wasted time.",
    detail:"Pool-mapped content",
    accentBg:"rgba(255,98,0,0.12)",   accentBorder:"rgba(255,98,0,0.25)",   accentColor:"#FF8534",
    cardBorder:"rgba(255,98,0,0.2)",  cardShadow:"0 8px 32px rgba(255,98,0,0.08)",
    hoverBorder:"rgba(255,98,0,0.5)", hoverShadow:"0 16px 48px rgba(255,98,0,0.2)",
  },
  {
    icon:"🎧", title:"Malayalam Audio Lessons",
    desc:"Learn complex civil concepts in Malayalam — anytime, anywhere.",
    detail:"Full syllabus in audio",
    accentBg:"rgba(255,184,0,0.12)",   accentBorder:"rgba(255,184,0,0.25)",   accentColor:"#FFB800",
    cardBorder:"rgba(255,184,0,0.2)",  cardShadow:"0 8px 32px rgba(255,184,0,0.08)",
    hoverBorder:"rgba(255,184,0,0.5)", hoverShadow:"0 16px 48px rgba(255,184,0,0.2)",
  },
  {
    icon:"⚡", title:"Smart Quiz System",
    desc:"Topic-wise quizzes, instant feedback, and weak area detection.",
    detail:"XP + streak system",
    accentBg:"rgba(100,200,255,0.1)",   accentBorder:"rgba(100,200,255,0.25)",   accentColor:"#64C8FF",
    cardBorder:"rgba(100,200,255,0.2)", cardShadow:"0 8px 32px rgba(100,200,255,0.08)",
    hoverBorder:"rgba(100,200,255,0.5)",hoverShadow:"0 16px 48px rgba(100,200,255,0.2)",
  },
  {
    icon:"🎥", title:"Short Video Lessons",
    desc:"40–50 minute focused videos — no fluff, only exam-relevant content.",
    detail:"Zero filler. 100% exam-focused",
    accentBg:"rgba(50,200,100,0.1)",   accentBorder:"rgba(50,200,100,0.25)",   accentColor:"#32C864",
    cardBorder:"rgba(50,200,100,0.2)", cardShadow:"0 8px 32px rgba(50,200,100,0.08)",
    hoverBorder:"rgba(50,200,100,0.5)",hoverShadow:"0 16px 48px rgba(50,200,100,0.2)",
  },
];

const LMS_FREE_TEST = "https://lms.civilezy.com/free-test";

// ─── Stable CTA hover handlers (module-level) ────────────────────────────────
const onCtaEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.transform = "translateY(-3px)";
  e.currentTarget.style.boxShadow = "0 14px 40px rgba(255,98,0,0.6)";
};
const onCtaLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.transform = "translateY(0)";
  e.currentTarget.style.boxShadow = "0 6px 30px rgba(255,98,0,0.45)";
};

// ─── Main Component ──────────────────────────────────────────────────────────
export default function SolutionSection() {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Stable ref setter — avoids new inline callback per render
  const setCardRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => { cardsRef.current[i] = el; },
    []
  );

  // Scroll-triggered reveal (logic unchanged)
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          (entry.target as HTMLDivElement).style.opacity   = "1";
          (entry.target as HTMLDivElement).style.transform = "translateY(0)";
        }
      }),
      { threshold: 0.1 }
    );
    cardsRef.current.forEach(el => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  return (
    <section
      aria-labelledby="solution-heading"
      style={{ background:"#080F1E", padding:"80px 0" }}
    >
      <div style={{ maxWidth:"1200px", width:"100%", margin:"0 auto", padding:"0 5%" }}>

        {/* ── Section header ── */}
        <div style={{ textAlign:"center", maxWidth:"700px", margin:"0 auto 64px" }}>
          <div
            aria-hidden="true"
            style={{ display:"inline-block", background:"rgba(255,98,0,0.15)", border:"1px solid rgba(255,98,0,0.3)", borderRadius:"20px", padding:"4px 16px", fontSize:"12px", fontWeight:700, color:"#FF8534", letterSpacing:"0.5px", marginBottom:"16px" }}
          >
            THE SOLUTION
          </div>

          <h2
            id="solution-heading"
            style={{ fontFamily:"Rajdhani, sans-serif", fontSize:"clamp(28px,4vw,44px)", fontWeight:700, lineHeight:1.2, marginBottom:"16px", color:"#ffffff" }}
          >
            Here&apos;s How Civilezy{" "}
            <span style={{ background:"linear-gradient(135deg,#FF6200,#FFB800)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
              Helps You Rank
            </span>
          </h2>

          <p style={{ fontSize:"17px", color:"rgba(255,255,255,0.85)", lineHeight:1.7, margin:0 }}>
            We&apos;ve built a system specifically for Kerala PSC Civil Engineering
            aspirants — structured, simple, and result-focused.
          </p>
        </div>

        {/* ── Feature cards grid ── */}
        <div
          style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"24px", marginBottom:"60px" }}
          className="solution-cards-grid"
        >
          {FEATURE_CARDS.map((card, i) => (
            <FeatureCard
              key={card.title}
              card={card}
              index={i}
              ref={setCardRef(i)}
            />
          ))}
        </div>

        {/* ── CTA ── */}
        <div style={{ textAlign:"center" }}>
          <a
            href={LMS_FREE_TEST}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Start a free Kerala PSC mock test — no registration required, opens in new tab"
            style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"linear-gradient(135deg,#FF6200,#FF4500)", color:"white", border:"none", padding:"16px 40px", borderRadius:"50px", fontFamily:"Nunito, sans-serif", fontSize:"18px", fontWeight:800, cursor:"pointer", boxShadow:"0 6px 30px rgba(255,98,0,0.45)", transition:"transform 0.2s, box-shadow 0.2s", textDecoration:"none" }}
            onMouseEnter={onCtaEnter}
            onMouseLeave={onCtaLeave}
          >
            🚀 Start Free Test
          </a>
          <p style={{ marginTop:"12px", fontSize:"13px", color:"rgba(255,255,255,0.4)", lineHeight:1.5 }}>
            No registration required. Instant access. Kerala PSC-specific.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) { .solution-cards-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 600px)  { .solution-cards-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

// ─── Feature Card ─────────────────────────────────────────────────────────────
const FeatureCard = forwardRef<
  HTMLDivElement,
  { card: FeatureCardData; index: number }
>(function FeatureCard({ card, index }, ref) {

  // Per-card hover handlers — close over card-specific values;
  // useCallback ensures they're stable across re-renders of this instance
  const onEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget as HTMLDivElement;
    el.style.transform   = "translateY(-8px)";
    el.style.boxShadow   = card.hoverShadow;
    el.style.borderColor = card.hoverBorder;
  }, [card.hoverShadow, card.hoverBorder]);

  const onLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget as HTMLDivElement;
    el.style.transform   = "translateY(0)";
    el.style.boxShadow   = card.cardShadow;
    el.style.borderColor = card.cardBorder;
  }, [card.cardShadow, card.cardBorder]);

  return (
    <div
      ref={ref}
      style={{
        position:"relative", background:"rgba(255,255,255,0.04)",
        border:`1px solid ${card.cardBorder}`, borderRadius:"20px",
        padding:"28px 24px", boxShadow:card.cardShadow,
        transition:"transform 0.3s, box-shadow 0.3s, border-color 0.3s, opacity 0.5s ease",
        overflow:"hidden",
        // Initial state for scroll animation
        opacity:0, transform:"translateY(24px)",
        transitionDelay:`${index * 80}ms`,
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {/* Decorative top glow — purely visual */}
      <div
        aria-hidden="true"
        style={{ position:"absolute", top:0, left:"20%", right:"20%", height:"2px", background:`linear-gradient(90deg,transparent,${card.accentColor},transparent)`, opacity:0.6, borderRadius:"0 0 4px 4px" }}
      />

      {/* Icon tile — aria-hidden: h3 below fully describes the feature */}
      <div
        aria-hidden="true"
        style={{ width:"52px", height:"52px", borderRadius:"14px", background:card.accentBg, border:`1px solid ${card.accentBorder}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"26px", marginBottom:"20px", flexShrink:0 }}
      >
        {card.icon}
      </div>

      {/* h3 — correct heading level under section h2 */}
      <h3 style={{ fontFamily:"Rajdhani, sans-serif", fontSize:"20px", fontWeight:700, color:"#ffffff", marginBottom:"10px", lineHeight:1.2 }}>
        {card.title}
      </h3>

      <p style={{ fontSize:"14px", color:"rgba(255,255,255,0.75)", lineHeight:1.65, margin:"0 0 18px" }}>
        {card.desc}
      </p>

      {/* Detail pill — ✓ is decorative; text carries the meaning */}
      <div
        style={{ display:"inline-flex", alignItems:"center", gap:"6px", background:card.accentBg, border:`1px solid ${card.accentBorder}`, borderRadius:"20px", padding:"4px 12px", fontSize:"11px", fontWeight:700, color:card.accentColor, letterSpacing:"0.3px" }}
      >
        <span aria-hidden="true">✓</span>
        {card.detail}
      </div>
    </div>
  );
});
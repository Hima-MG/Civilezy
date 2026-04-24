"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { CourseData } from "@/data/courseData";
import { EXTERNAL_URLS } from "@/lib/constants";

const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");
const savePct = (orig: number, sale: number) => Math.round(((orig - sale) / orig) * 100);

// ── Hover handlers (module-level — never recreated) ───────────────────────────
const onOrangeEnter = (e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.boxShadow = "0 12px 40px rgba(255,98,0,0.6)"; e.currentTarget.style.transform = "translateY(-2px)"; };
const onOrangeLeave = (e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.boxShadow = "0 6px 24px rgba(255,98,0,0.4)"; e.currentTarget.style.transform = "translateY(0)"; };
const onGhostEnter  = (e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.borderColor = "#FF6200"; e.currentTarget.style.background = "rgba(255,98,0,0.1)"; };
const onGhostLeave  = (e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; e.currentTarget.style.background = "transparent"; };
const onCardEnter   = (e: React.MouseEvent<HTMLDivElement>)   => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "rgba(255,98,0,0.4)"; };
const onCardLeave   = (e: React.MouseEvent<HTMLDivElement>)   => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; };

// ── Shared style tokens ───────────────────────────────────────────────────────
const S = {
  section:    { background: "#0B1E3D", padding: "80px 0", position: "relative" as const, overflow: "hidden" as const },
  sectionAlt: { background: "#091729", padding: "80px 0", position: "relative" as const },
  container:  { maxWidth: "1200px", width: "100%", margin: "0 auto", padding: "0 5%", position: "relative" as const, zIndex: 1 },
  badge:      { display: "inline-block", background: "rgba(255,98,0,0.15)", border: "1px solid rgba(255,98,0,0.35)", borderRadius: "20px", padding: "4px 16px", fontSize: "12px", fontWeight: 700, color: "#FF8534", letterSpacing: "0.5px", marginBottom: "16px" },
  h2:         { fontFamily: "Rajdhani, sans-serif", fontSize: "clamp(28px,4vw,46px)", fontWeight: 700, lineHeight: 1.15, color: "#fff", marginBottom: "16px" },
  gradText:   { background: "linear-gradient(135deg,#FF6200,#FFB800)", WebkitBackgroundClip: "text" as const, WebkitTextFillColor: "transparent" as const, backgroundClip: "text" as const },
  card:       { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px", padding: "24px", transition: "transform 0.25s, border-color 0.25s" },
  ctaOrange:  { display: "inline-flex", alignItems: "center", gap: "8px", padding: "16px 36px", borderRadius: "50px", background: "linear-gradient(135deg,#FF6200,#FF4500)", color: "#fff", fontFamily: "Nunito, sans-serif", fontSize: "16px", fontWeight: 800, textDecoration: "none", boxShadow: "0 6px 24px rgba(255,98,0,0.4)", transition: "box-shadow 0.2s, transform 0.2s" },
  ctaGhost:   { display: "inline-flex", alignItems: "center", gap: "8px", padding: "16px 36px", borderRadius: "50px", border: "2px solid rgba(255,255,255,0.25)", color: "#fff", fontFamily: "Nunito, sans-serif", fontSize: "16px", fontWeight: 800, textDecoration: "none", transition: "border-color 0.2s, background 0.2s" },
} as const;

// ── Glow decoration ───────────────────────────────────────────────────────────
function Glow({ top, left, color = "#FF6200", size = 600 }: { top?: string; left?: string; color?: string; size?: number }) {
  return (
    <div aria-hidden="true" style={{ position: "absolute", top: top ?? "50%", left: left ?? "50%", transform: "translate(-50%,-50%)", width: size, height: size, borderRadius: "50%", background: `radial-gradient(circle,${color}0D 0%,transparent 65%)`, pointerEvents: "none" }} />
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 1 — HERO
// ══════════════════════════════════════════════════════════════════════════════
function HeroSection({ data }: { data: CourseData }) {
  const p = data.pricing;
  return (
    <section style={{ ...S.section, paddingTop: "100px", paddingBottom: "100px", background: "linear-gradient(180deg,#091729 0%,#0B1E3D 100%)" }}>
      <Glow top="40%" left="70%" size={700} />
      <Glow top="60%" left="20%" color="#FFB800" size={400} />
      <div style={S.container}>
        <div style={{ maxWidth: "820px" }}>

          {/* Badge row */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
            <span style={S.badge}>{data.emoji} {data.badge}</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,98,0,0.1)", border: "1px solid rgba(255,98,0,0.25)", borderRadius: "20px", padding: "4px 14px", fontSize: "12px", fontWeight: 700, color: "#FF8534" }}>
              📅 Upcoming PSC exams are near. Start preparation now.
            </span>
          </div>

          {/* Title */}
          <h1 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "clamp(36px,6vw,70px)", fontWeight: 700, lineHeight: 1.1, color: "#fff", marginBottom: "16px" }}>
            <span style={S.gradText}>{data.title}</span>
            <br />
            <span style={{ color: "rgba(255,255,255,0.9)" }}> Preparation</span>
          </h1>

          {/* Subtitle */}
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginBottom: "20px", maxWidth: "660px" }}>
            {data.subtitle}
          </p>

          {/* Categories */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "24px" }}>
            {data.pools.map(pool => (
              <span key={pool} style={{ background: "rgba(255,98,0,0.12)", border: "1px solid rgba(255,98,0,0.3)", borderRadius: "20px", padding: "5px 14px", fontSize: "13px", fontWeight: 700, color: "#FF8534" }}>
                {pool}
              </span>
            ))}
          </div>

          {/* 4 hero highlight bullets */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "32px", maxWidth: "580px" }} className="hero-bullets">
            {data.highlights.slice(0, 4).map(h => (
              <div key={h} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <span aria-hidden="true" style={{ color: "#FF6200", fontWeight: 800, flexShrink: 0, marginTop: "2px" }}>✓</span>
                <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.8)", lineHeight: 1.45 }}>{h}</span>
              </div>
            ))}
          </div>

          {/* Price teaser */}
          <div style={{ display: "inline-flex", alignItems: "baseline", gap: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", padding: "14px 22px", marginBottom: "32px" }}>
            <span style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "36px", fontWeight: 700, ...S.gradText }}>{fmt(p.monthly)}</span>
            <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "15px" }}>/month</span>
            <span style={{ fontSize: "13px", color: "#32C864", fontWeight: 700, marginLeft: "8px" }}>
              or {fmt(p.yearly)}/yr — save {fmt(p.yearlySavings)}
            </span>
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "36px" }}>
            <a href={p.checkoutUrl} target="_blank" rel="noopener noreferrer" style={S.ctaOrange} onMouseEnter={onOrangeEnter} onMouseLeave={onOrangeLeave}>
              🚀 Enroll Now
            </a>
            <a href={EXTERNAL_URLS.demo} target="_blank" rel="noopener noreferrer" style={S.ctaGhost} onMouseEnter={onGhostEnter} onMouseLeave={onGhostLeave}>
              Try Demo Lesson
            </a>
          </div>

          {/* Wincentre trust row */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "50px", padding: "8px 16px" }}>
              <span aria-hidden="true" style={{ fontSize: "16px" }}>🏛️</span>
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>Powered by <strong style={{ color: "#fff" }}>Wincentre</strong></span>
            </div>
            <div style={{ display: "flex", gap: "4px" }} aria-label="4.8 star rating">
              {[1,2,3,4,5].map(i => <span key={i} aria-hidden="true" style={{ color: "#FFB800", fontSize: "14px" }}>★</span>)}
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginLeft: "4px" }}>4.8 · 445+ Reviews</span>
            </div>
            <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>1,000+ Govt. Jobs · 15+ Years</span>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginTop: "60px", maxWidth: "800px" }} className="stats-grid">
          {data.stats.map(s => (
            <div key={s.label} style={{ textAlign: "center", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "20px 12px" }}>
              <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "32px", fontWeight: 700, ...S.gradText }}>{s.value}</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginTop: "4px" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 2 — HIGHLIGHTS STRIP
// ══════════════════════════════════════════════════════════════════════════════
function HighlightsSection({ data }: { data: CourseData }) {
  return (
    <section style={{ background: "linear-gradient(135deg,#1A0800,#120500)", padding: "56px 0", borderTop: "1px solid rgba(255,98,0,0.2)", borderBottom: "1px solid rgba(255,98,0,0.2)" }}>
      <div style={S.container}>
        <div style={{ textAlign: "center", marginBottom: "12px" }}>
          <span style={{ fontSize: "11px", color: "#FF8534", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase" }}>What&apos;s Included</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px", maxWidth: "920px", margin: "0 auto" }} className="highlights-grid">
          {data.highlights.map(h => (
            <div key={h} style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "12px 16px", background: "rgba(255,98,0,0.06)", border: "1px solid rgba(255,98,0,0.1)", borderRadius: "12px" }}>
              <span aria-hidden="true" style={{ color: "#FF6200", fontWeight: 800, fontSize: "16px", flexShrink: 0, marginTop: "1px" }}>✓</span>
              <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>{h}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 3 — PROBLEM → SOLUTION
// ══════════════════════════════════════════════════════════════════════════════
function ProblemSolutionSection({ data }: { data: CourseData }) {
  return (
    <section style={S.section}>
      <Glow top="50%" left="50%" size={800} />
      <div style={S.container}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <span style={S.badge}>The Problem We Solve</span>
          <h2 style={S.h2}>
            Why Most Students{" "}
            <span style={S.gradText}>Never Make the Rank List</span>
          </h2>
          <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.6)", maxWidth: "560px", margin: "0 auto", lineHeight: 1.65 }}>
            Sound familiar? These are the four reasons 90% of aspirants fail — and exactly what CivilEzy fixes.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "start" }} className="ps-grid">
          {/* Problems */}
          <div>
            <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "20px", fontWeight: 700, color: "#FF6464", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span aria-hidden="true">⚠️</span> The Problems
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {data.problems.map(p => (
                <div key={p.title} style={{ ...S.card, borderColor: "rgba(255,70,70,0.15)" }} onMouseEnter={onCardEnter} onMouseLeave={onCardLeave}>
                  <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                    <span aria-hidden="true" style={{ fontSize: "24px", flexShrink: 0 }}>{p.icon}</span>
                    <div>
                      <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "17px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>{p.title}</div>
                      <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.52)", lineHeight: 1.55 }}>{p.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Solutions */}
          <div>
            <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "20px", fontWeight: 700, color: "#32C864", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span aria-hidden="true">✅</span> How CivilEzy Fixes It
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {data.solutions.map(s => (
                <div key={s.title} style={{ ...S.card, borderColor: "rgba(50,200,100,0.15)" }} onMouseEnter={onCardEnter} onMouseLeave={onCardLeave}>
                  <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                    <span aria-hidden="true" style={{ fontSize: "24px", flexShrink: 0 }}>{s.icon}</span>
                    <div>
                      <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "17px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>{s.title}</div>
                      <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.52)", lineHeight: 1.55 }}>{s.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 4 — SYSTEM FLOW  (Study → Revise → Practice)
// ══════════════════════════════════════════════════════════════════════════════
const FLOW_STEPS = [
  { icon: "📘", label: "Study",    desc: "Structured lessons" },
  { icon: "🔁", label: "Revise",   desc: "Built-in revision mode" },
  { icon: "⚡", label: "Practice", desc: "Graded quizzes" },
];

function SystemFlowSection() {
  return (
    <section style={{ background: "#060F1E", padding: "64px 0", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <div style={S.container}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <span style={S.badge}>The CivilEzy System</span>
          <h2 style={{ ...S.h2, marginTop: "8px", marginBottom: "8px" }}>
            One Proven Path to{" "}
            <span style={S.gradText}>Rank & Selection</span>
          </h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)", maxWidth: "440px", margin: "0 auto" }}>
            Stop random study. Follow the same 3-step system that helped 1,000+ candidates get government jobs.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "stretch", justifyContent: "center", flexWrap: "wrap", gap: "0", maxWidth: "700px", margin: "0 auto" }} className="flow-row">
          {FLOW_STEPS.map((step, i) => (
            <div key={step.label} style={{ display: "flex", alignItems: "center", gap: "0" }}>
              {/* Step card */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", padding: "24px 20px", textAlign: "center", minWidth: "160px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px" }}>
                <div style={{ width: "60px", height: "60px", borderRadius: "14px", background: i === 2 ? "linear-gradient(135deg,#FF6200,#FFB800)" : "rgba(255,98,0,0.12)", border: i === 2 ? "none" : "1px solid rgba(255,98,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px" }}>
                  {step.icon}
                </div>
                <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "18px", fontWeight: 700, color: i === 2 ? "#FF8534" : "#fff" }}>{step.label}</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.42)", lineHeight: 1.4 }}>{step.desc}</div>
              </div>
              {/* Arrow */}
              {i < FLOW_STEPS.length - 1 && (
                <div aria-hidden="true" style={{ color: "#FF6200", fontSize: "22px", fontWeight: 700, padding: "0 6px", flexShrink: 0 }}>→</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 5 — COURSE STRUCTURE (subjects + deliverables)
// ══════════════════════════════════════════════════════════════════════════════
function SubjectsSection({ data }: { data: CourseData }) {
  return (
    <section style={S.sectionAlt}>
      <div style={S.container}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span style={S.badge}>Course Structure</span>
          <h2 style={S.h2}>
            Complete{" "}
            <span style={S.gradText}>Subject Coverage</span>
          </h2>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.52)", maxWidth: "520px", margin: "0 auto", lineHeight: 1.6 }}>
            Every topic that appears in Kerala PSC Civil Engineering exams — mapped, structured, and explained.
          </p>
        </div>

        {/* Subject grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px", maxWidth: "900px", margin: "0 auto 48px" }} className="subjects-grid">
          {data.subjects.map((subj, i) => (
            <div key={subj} style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "14px 16px" }}>
              <span style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "13px", fontWeight: 700, color: "#FF6200", flexShrink: 0, minWidth: "24px" }} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.85)", lineHeight: 1.4 }}>{subj}</span>
            </div>
          ))}
        </div>

        {/* What this course delivers */}
        <div style={{ maxWidth: "860px", margin: "0 auto", background: "rgba(255,98,0,0.05)", border: "1px solid rgba(255,98,0,0.18)", borderRadius: "20px", padding: "32px 36px" }}>
          <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
            <span aria-hidden="true">🎯</span> What This Course Delivers
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }} className="deliverables-grid">
            {data.deliverables.map(d => (
              <div key={d} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <span aria-hidden="true" style={{ color: "#32C864", fontWeight: 800, fontSize: "16px", flexShrink: 0, marginTop: "1px" }}>✓</span>
                <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>{d}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <a href={data.pricing.checkoutUrl} target="_blank" rel="noopener noreferrer" style={{ ...S.ctaOrange, fontSize: "15px", padding: "13px 30px" }} onMouseEnter={onOrangeEnter} onMouseLeave={onOrangeLeave}>
              🚀 Start Preparation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 6 — STUDY SYSTEM
// ══════════════════════════════════════════════════════════════════════════════
function StudySystemSection({ data }: { data: CourseData }) {
  return (
    <section style={S.section}>
      <Glow top="30%" left="80%" size={500} />
      <div style={S.container}>
        <div style={{ textAlign: "center", marginBottom: "52px" }}>
          <span style={S.badge}>Study System</span>
          <h2 style={S.h2}>
            Everything You Need{" "}
            <span style={S.gradText}>to Rank</span>
          </h2>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.52)", maxWidth: "520px", margin: "0 auto", lineHeight: 1.6 }}>
            Six powerful tools working together — study smarter, retain more, score higher.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "20px" }} className="features-grid">
          {data.features.map(f => (
            <div key={f.title} style={{ ...S.card, display: "flex", gap: "16px", alignItems: "flex-start" }} onMouseEnter={onCardEnter} onMouseLeave={onCardLeave}>
              <div aria-hidden="true" style={{ width: 46, height: 46, borderRadius: "12px", background: "rgba(255,98,0,0.12)", border: "1px solid rgba(255,98,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>
                {f.icon}
              </div>
              <div>
                <h3 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "17px", fontWeight: 700, color: "#fff", marginBottom: "5px" }}>{f.title}</h3>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.52)", lineHeight: 1.55, margin: 0 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 7 — QUIZ SYSTEM
// ══════════════════════════════════════════════════════════════════════════════
function PerformanceSection({ data }: { data: CourseData }) {
  return (
    <section style={{ ...S.sectionAlt, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={S.container}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" }} className="perf-grid">
          <div>
            <span style={S.badge}>Quiz System</span>
            <h2 style={{ ...S.h2, marginTop: "8px" }}>
              Graded Quizzes.{" "}
              <span style={S.gradText}>Live Leaderboard.</span>
            </h2>
            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: "32px" }}>
              Every lesson ends with a graded quiz. Attempt it unlimited times until you master the topic. See your rank on the live leaderboard.
            </p>
            <a href={data.pricing.checkoutUrl} target="_blank" rel="noopener noreferrer" style={S.ctaOrange} onMouseEnter={onOrangeEnter} onMouseLeave={onOrangeLeave}>
              🚀 Start Preparation
            </a>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {data.performance.map(p => (
              <div key={p.title} style={{ display: "flex", gap: "16px", alignItems: "flex-start", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "18px 20px" }}>
                <div aria-hidden="true" style={{ width: 42, height: 42, borderRadius: "10px", background: "rgba(255,98,0,0.1)", border: "1px solid rgba(255,98,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>
                  {p.icon}
                </div>
                <div>
                  <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "16px", fontWeight: 700, color: "#fff", marginBottom: "2px" }}>{p.title}</div>
                  <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.48)", lineHeight: 1.5 }}>{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 8 — LIVE CLASSES (ITI only)
// ══════════════════════════════════════════════════════════════════════════════
function LiveClassesSection({ liveClasses, checkoutUrl }: { liveClasses: NonNullable<CourseData["liveClasses"]>; checkoutUrl: string }) {
  return (
    <section style={{ background: "linear-gradient(135deg,#120800,#1A0E00)", padding: "80px 0", borderTop: "1px solid rgba(255,98,0,0.2)", borderBottom: "1px solid rgba(255,98,0,0.2)" }}>
      <div style={S.container}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" }} className="live-grid">
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,98,0,0.12)", border: "1px solid rgba(255,98,0,0.3)", borderRadius: "20px", padding: "5px 16px", fontSize: "12px", fontWeight: 700, color: "#FF8534", marginBottom: "20px" }}>
              <span aria-hidden="true" style={{ width: 7, height: 7, borderRadius: "50%", background: "#FF6200", animation: "pulseDot 2s infinite", display: "inline-block" }} />
              LIVE CLASSES INCLUDED
            </div>
            <h2 style={{ ...S.h2, marginTop: 0 }}>
              Learn Live.{" "}
              <span style={S.gradText}>Ask. Clarify. Rank.</span>
            </h2>
            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: "20px" }}>
              Weekly live sessions with expert instructors. Ask your doubts in real time. Recordings available for every session.
            </p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "10px 16px", marginBottom: "24px" }}>
              <span aria-hidden="true" style={{ fontSize: "20px" }}>📅</span>
              <span style={{ fontSize: "14px", fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>{liveClasses.schedule}</span>
            </div>
            <div>
              <a href={checkoutUrl} target="_blank" rel="noopener noreferrer" style={{ ...S.ctaOrange, fontSize: "15px", padding: "13px 28px" }} onMouseEnter={onOrangeEnter} onMouseLeave={onOrangeLeave}>
                🚀 Join Live Classes
              </a>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {liveClasses.topics.map((t, i) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: "14px", background: "rgba(255,98,0,0.06)", border: "1px solid rgba(255,98,0,0.15)", borderRadius: "12px", padding: "14px 18px" }}>
                <span style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "20px", fontWeight: 700, color: "#FF6200", flexShrink: 0 }} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.85)", fontWeight: 600, lineHeight: 1.4 }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 9 — WINCENTRE TRUST
// ══════════════════════════════════════════════════════════════════════════════
const WINCENTRE_STATS = [
  { value: "15+",    label: "Years of PSC Coaching" },
  { value: "4.8⭐", label: "Average Rating"         },
  { value: "445+",  label: "Verified Reviews"        },
  { value: "1,000+",label: "Govt. Jobs Secured"      },
];

function WincentreTrustSection() {
  return (
    <section style={{ background: "linear-gradient(135deg,#0A1628,#0D1E3A)", padding: "72px 0", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={S.container}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" }} className="wincentre-grid">
          <div>
            <span style={{ ...S.badge, background: "rgba(255,184,0,0.12)", borderColor: "rgba(255,184,0,0.3)", color: "#FFB800" }}>
              🏛️ Powered by Wincentre
            </span>
            <h2 style={{ ...S.h2, marginTop: "8px" }}>
              Kerala&apos;s Most Trusted{" "}
              <span style={S.gradText}>Civil PSC Coaching</span>
            </h2>
            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: "28px" }}>
              CivilEzy is the digital platform of Wincentre Kerala — Kerala&apos;s pioneer in Civil PSC coaching. The same proven methodology, now available online for every Kerala aspirant.
            </p>
            <Link
              href="/civil-psc-coaching-kerala"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,184,0,0.1)", border: "1px solid rgba(255,184,0,0.3)", color: "#FFB800", borderRadius: "50px", padding: "11px 24px", fontSize: "14px", fontWeight: 700, fontFamily: "Nunito, sans-serif", textDecoration: "none" }}
            >
              Learn About Wincentre →
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {WINCENTRE_STATS.map(s => (
              <div key={s.label} style={{ textAlign: "center", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px 16px" }}>
                <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "36px", fontWeight: 700, ...S.gradText }}>{s.value}</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginTop: "4px", lineHeight: 1.4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 10 — TESTIMONIALS
// ══════════════════════════════════════════════════════════════════════════════
function TestimonialsSection({ data }: { data: CourseData }) {
  return (
    <section style={S.section}>
      <Glow top="40%" left="30%" color="#FFB800" size={500} />
      <div style={S.container}>
        <div style={{ textAlign: "center", marginBottom: "52px" }}>
          <span style={S.badge}>What Real Government Servants from Civilezy Speak</span>
          <h2 style={S.h2}>
            Real Students.{" "}
            <span style={S.gradText}>Real Government Jobs.</span>
          </h2>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.52)", maxWidth: "480px", margin: "0 auto", lineHeight: 1.6 }}>
            2,000+ students have secured rank list positions through CivilEzy. Here are a few of their stories.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px" }} className="testimonials-grid">
          {data.testimonials.map(t => (
            <div key={t.name} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "18px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", gap: "3px" }} aria-label="5 stars">
                {[...Array(5)].map((_, i) => <span key={i} aria-hidden="true" style={{ color: "#FFB800", fontSize: "13px" }}>★</span>)}
              </div>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: 1.65, margin: 0, flex: 1, fontStyle: "italic" }}>
                &ldquo;{t.text}&rdquo;
              </p>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "12px" }}>
                <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "15px", fontWeight: 700, color: "#fff" }}>{t.name}</div>
                <div style={{ fontSize: "11px", color: "#FF8534", fontWeight: 600, marginTop: "2px" }}>{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 11 — BONUS
// ══════════════════════════════════════════════════════════════════════════════
function BonusSection({ data }: { data: CourseData }) {
  return (
    <section style={{ ...S.sectionAlt, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={S.container}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span style={{ ...S.badge, background: "rgba(255,184,0,0.12)", borderColor: "rgba(255,184,0,0.3)", color: "#FFB800" }}>
            🎁 Bonus Included
          </span>
          <h2 style={S.h2}>
            You Also Get{" "}
            <span style={S.gradText}>These for Free</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px" }} className="bonus-grid">
          {data.bonus.map(b => (
            <div key={b.title} style={{ background: "rgba(255,184,0,0.05)", border: "1px solid rgba(255,184,0,0.15)", borderRadius: "14px", padding: "18px", textAlign: "center" }}>
              <span aria-hidden="true" style={{ fontSize: "30px", display: "block", marginBottom: "10px" }}>{b.icon}</span>
              <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "15px", fontWeight: 700, color: "#fff", marginBottom: "6px" }}>{b.title}</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.52)", lineHeight: 1.5 }}>{b.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 12 — PRICING
// ══════════════════════════════════════════════════════════════════════════════
function PricingSection({ data }: { data: CourseData }) {
  const p   = data.pricing;
  const pct = savePct(p.yearlyOrig, p.yearly);
  const quarterlyAmt = Math.ceil(p.yearly / 4);

  return (
    <section id="pricing" style={S.section}>
      <Glow top="50%" left="50%" size={700} />
      <div style={S.container}>
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <span style={S.badge}>Pricing</span>
        </div>
        {/* Urgency banner */}
        <div style={{ maxWidth: "600px", margin: "0 auto 40px", textAlign: "center", background: "rgba(255,98,0,0.08)", border: "1px solid rgba(255,98,0,0.2)", borderRadius: "12px", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "16px" }} aria-hidden="true">📅</span>
          <span style={{ fontSize: "14px", fontWeight: 700, color: "#FF8534" }}>Upcoming PSC exams are near.</span>
          <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)" }}>Start preparation now.</span>
        </div>

        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h2 style={{ ...S.h2, marginBottom: "8px" }}>
            Simple Pricing.{" "}
            <span style={S.gradText}>Maximum Value.</span>
          </h2>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.52)", maxWidth: "460px", margin: "0 auto" }}>
            Both plans unlock everything — full access, all categories, all features.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: "24px", maxWidth: "880px", margin: "0 auto 40px" }} className="pricing-cards-grid">
          {/* Monthly */}
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px", padding: "36px" }}>
            <h3 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "22px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>Monthly Plan</h3>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "24px" }}>Flexible · Cancel anytime</p>
            <div style={{ marginBottom: "6px" }}>
              <span style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "52px", fontWeight: 700, ...S.gradText }}>{fmt(p.monthly)}</span>
              <span style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)" }}> /month</span>
            </div>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginBottom: "28px" }}>
              ≈ {fmt(Math.round(p.monthly / 30))} per day
            </p>
            <a href={p.checkoutUrl} target="_blank" rel="noopener noreferrer"
              style={{ display: "block", padding: "14px", borderRadius: "50px", textAlign: "center", border: "2px solid rgba(255,255,255,0.2)", color: "#fff", fontFamily: "Nunito, sans-serif", fontSize: "15px", fontWeight: 800, textDecoration: "none", transition: "border-color 0.2s, background 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#FF6200"; e.currentTarget.style.background = "rgba(255,98,0,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.background = "transparent"; }}
            >
              🚀 Start Preparation
            </a>
            <p style={{ textAlign: "center", fontSize: "11px", color: "rgba(255,255,255,0.25)", marginTop: "10px" }}>Cancel anytime · No commitment</p>
          </div>

          {/* Annual */}
          <div style={{ background: "linear-gradient(135deg,#1A0800,#2A1000)", border: "2px solid #FF6200", borderRadius: "24px", padding: "36px", position: "relative", boxShadow: "0 0 40px rgba(255,98,0,0.18)" }}>
            <div aria-hidden="true" style={{ position: "absolute", top: "-15px", left: "50%", transform: "translateX(-50%)", background: "linear-gradient(90deg,#FF6200,#FF8534)", color: "#fff", fontSize: "12px", fontWeight: 800, padding: "5px 22px", borderRadius: "20px", whiteSpace: "nowrap", boxShadow: "0 4px 14px rgba(255,98,0,0.45)" }}>
              🔥 BEST VALUE — Save {pct}%
            </div>
            <h3 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "24px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>Annual Plan</h3>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "24px" }}>Full year </p>
            <div style={{ marginBottom: "6px" }}>
              <span style={{ fontSize: "18px", color: "rgba(255,255,255,0.3)", textDecoration: "line-through", marginRight: "8px" }}>{fmt(p.yearlyOrig)}</span>
              <span style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "52px", fontWeight: 700, ...S.gradText }}>{fmt(p.yearly)}</span>
              <span style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)" }}> /year</span>
            </div>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginBottom: "12px" }}>≈ {fmt(Math.round(p.yearly / 12))} / month billed annually</p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(50,200,100,0.1)", border: "1px solid rgba(50,200,100,0.3)", borderRadius: "20px", padding: "4px 14px", fontSize: "12px", fontWeight: 700, color: "#32C864", marginBottom: "12px" }}>
              🎉 You save {fmt(p.yearlySavings)}
            </div>
            <div style={{ background: "rgba(255,98,0,0.08)", border: "1px solid rgba(255,98,0,0.2)", borderRadius: "10px", padding: "10px 14px", marginBottom: "24px", display: "flex", gap: "10px", alignItems: "center" }}>
              <span aria-hidden="true" style={{ fontSize: "18px" }}>💳</span>
              <div>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#FF8534", marginBottom: "2px" }}></div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)" }}>Pay {fmt(quarterlyAmt)} every quarter · Zero interest</div>
              </div>
            </div>
            <a href={p.checkoutUrl} target="_blank" rel="noopener noreferrer"
              style={{ display: "block", padding: "16px", borderRadius: "50px", textAlign: "center", background: "linear-gradient(135deg,#FF6200,#FF4500)", color: "#fff", fontFamily: "Nunito, sans-serif", fontSize: "16px", fontWeight: 800, textDecoration: "none", boxShadow: "0 6px 25px rgba(255,98,0,0.4)", transition: "box-shadow 0.2s, transform 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 10px 35px rgba(255,98,0,0.6)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 6px 25px rgba(255,98,0,0.4)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              🚀 Enroll Now — Best Value
            </a>
            <p style={{ textAlign: "center", fontSize: "11px", color: "rgba(255,255,255,0.25)", marginTop: "10px" }}>Cancel anytime · Support 7 days a week</p>
          </div>
        </div>

        {/* Trust signals */}
        <div style={{ display: "flex", justifyContent: "center", gap: "24px", flexWrap: "wrap" }}>
          {["✔ Secure Payment", "✔ Cancel Anytime", "✔ Demo Course Access"].map(t => (
            <span key={t} style={{ fontSize: "13px", color: "rgba(255,255,255,0.38)", display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ color: "#32C864", fontWeight: 800 }} aria-hidden="true">{t[0]}</span>
              {t.slice(1)}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 13 — FAQ
// ══════════════════════════════════════════════════════════════════════════════
function FAQSection({ data }: { data: CourseData }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section style={{ ...S.sectionAlt, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={S.container}>
        <div style={{ textAlign: "center", marginBottom: "52px" }}>
          <span style={S.badge}>FAQ</span>
          <h2 style={S.h2}>
            Common{" "}
            <span style={S.gradText}>Questions Answered</span>
          </h2>
        </div>

        <div style={{ maxWidth: "720px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "12px" }}>
          {data.faq.map((item, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${open === i ? "rgba(255,98,0,0.4)" : "rgba(255,255,255,0.08)"}`, borderRadius: "14px", overflow: "hidden", transition: "border-color 0.2s" }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 22px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", gap: "12px" }}
              >
                <span style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "17px", fontWeight: 700, color: "#fff", lineHeight: 1.4 }}>{item.q}</span>
                <span aria-hidden="true" style={{ color: "#FF6200", fontSize: "22px", flexShrink: 0, transition: "transform 0.25s", transform: open === i ? "rotate(45deg)" : "rotate(0deg)", display: "inline-block" }}>+</span>
              </button>
              {open === i && (
                <div style={{ padding: "0 22px 20px", fontSize: "14px", color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 14 — FINAL CTA
// ══════════════════════════════════════════════════════════════════════════════
function FinalCTASection({ data }: { data: CourseData }) {
  return (
    <section style={{ background: "linear-gradient(135deg,#1A0800 0%,#0B1E3D 50%,#091729 100%)", padding: "100px 0", borderTop: "1px solid rgba(255,98,0,0.2)", position: "relative", overflow: "hidden" }}>
      <Glow top="50%" left="50%" size={900} />
      <div style={{ ...S.container, textAlign: "center" }}>
        {/* Wincentre chip */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,184,0,0.1)", border: "1px solid rgba(255,184,0,0.25)", borderRadius: "50px", padding: "6px 18px", fontSize: "13px", fontWeight: 700, color: "#FFB800", marginBottom: "24px" }}>
          <span aria-hidden="true">🏛️</span> Powered by Wincentre Kerala · 4.8⭐ · 1,000+ Govt. Jobs
        </div>

        <h2 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "clamp(32px,5vw,60px)", fontWeight: 700, lineHeight: 1.1, color: "#fff", marginBottom: "16px" }}>
          Structured Preparation{" "}
          <span style={S.gradText}>Leads to Selection.</span>
        </h2>
        <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.62)", maxWidth: "520px", margin: "0 auto 16px", lineHeight: 1.7 }}>
          Stop random study. Start smart preparation.
        </p>
        <p style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "22px", fontWeight: 700, color: "#FF8534", marginBottom: "40px" }}>
          {fmt(data.pricing.monthly)}/month or {fmt(data.pricing.yearly)}/year
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap", marginBottom: "20px" }}>
          <a href={data.pricing.checkoutUrl} target="_blank" rel="noopener noreferrer" style={{ ...S.ctaOrange, padding: "18px 48px", fontSize: "18px" }} onMouseEnter={onOrangeEnter} onMouseLeave={onOrangeLeave}>
            🚀 Enroll Now
          </a>
          <a href={EXTERNAL_URLS.demo} target="_blank" rel="noopener noreferrer" style={{ ...S.ctaGhost, padding: "18px 48px", fontSize: "18px" }} onMouseEnter={onGhostEnter} onMouseLeave={onGhostLeave}>
            Try Demo Lesson
          </a>
        </div>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.28)" }}>
          No commitment · Cancel anytime · Demo course access
        </p>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 15 — EXPLORE MORE (internal links)
// ══════════════════════════════════════════════════════════════════════════════
const EXPLORE_LINKS = [
  { href: "/civil-psc-coaching-kerala", emoji: "🏛️", label: "About CivilEzy",   desc: "Powered by Wincentre Kerala · 4.8⭐",   external: false },
  { href: "/pricing",                   emoji: "📚", label: "All Courses",      desc: "ITI · Diploma · B.Tech · Surveyor",      external: false },
  { href: EXTERNAL_URLS.demo,           emoji: "🚀", label: "Start Demo Course", desc: "Experience our learning system with a demo course", external: true  },
] as const;

function ExploreMoreSection() {
  return (
    <section style={{ background: "#060F1E", padding: "60px 0", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={S.container}>
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase" }}>Explore More</span>
          <h2 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "clamp(22px,3vw,32px)", fontWeight: 700, color: "#fff", marginTop: "8px", marginBottom: 0 }}>
            Everything CivilEzy Offers
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px", maxWidth: "700px", margin: "0 auto" }} className="explore-grid">
          {EXPLORE_LINKS.map(link => (
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "10px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "24px 16px", textDecoration: "none", transition: "border-color 0.2s, background 0.2s, transform 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,98,0,0.35)"; e.currentTarget.style.background = "rgba(255,98,0,0.05)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <span aria-hidden="true" style={{ fontSize: "32px" }}>{link.emoji}</span>
                <span style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "16px", fontWeight: 700, color: "#fff" }}>{link.label}</span>
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.42)", lineHeight: 1.4 }}>{link.desc}</span>
              </a>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "10px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "24px 16px", textDecoration: "none", transition: "border-color 0.2s, background 0.2s, transform 0.2s" }}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.borderColor = "rgba(255,98,0,0.35)"; e.currentTarget.style.background = "rgba(255,98,0,0.05)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <span aria-hidden="true" style={{ fontSize: "32px" }}>{link.emoji}</span>
                <span style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "16px", fontWeight: 700, color: "#fff" }}>{link.label}</span>
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.42)", lineHeight: 1.4 }}>{link.desc}</span>
              </Link>
            )
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MOBILE STICKY CTA
// ══════════════════════════════════════════════════════════════════════════════
function MobileStickyCTA({ data }: { data: CourseData }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div
        role="region"
        aria-label={`Enroll in ${data.title}`}
        className="course-sticky-cta"
        style={{
          position:             "fixed",
          bottom:               0,
          left:                 0,
          right:                0,
          zIndex:               900,
          transform:            visible ? "translateY(0)" : "translateY(110%)",
          opacity:              visible ? 1 : 0,
          transition:           "transform 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease",
          background:           "rgba(6,12,28,0.96)",
          backdropFilter:       "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderTop:            "1px solid rgba(255,98,0,0.3)",
          boxShadow:            "0 -4px 30px rgba(0,0,0,0.5)",
          padding:              "12px 20px",
          display:              "none",
        }}
      >
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "15px", fontWeight: 700, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {data.title}
            </div>
            <div style={{ fontSize: "12px", color: "#FF8534", fontWeight: 700 }}>
              Starting {fmt(data.pricing.monthly)}/month
            </div>
          </div>
          <a
            href={data.pricing.checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "linear-gradient(135deg,#FF6200,#FF4500)", color: "#fff", padding: "11px 22px", borderRadius: "50px", fontFamily: "Nunito, sans-serif", fontSize: "14px", fontWeight: 800, textDecoration: "none", whiteSpace: "nowrap", boxShadow: "0 4px 16px rgba(255,98,0,0.45)", flexShrink: 0 }}
          >
            🚀 Start Preparation
          </a>
        </div>
      </div>

    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════════════════════════════════
export default function CoursePage({ data, courseKey }: { data: CourseData; courseKey?: string }) {
  void courseKey;
  return (
    <>
      <HeroSection data={data} />
      <HighlightsSection data={data} />
      <ProblemSolutionSection data={data} />
      <SystemFlowSection />
      <SubjectsSection data={data} />
      <StudySystemSection data={data} />
      <PerformanceSection data={data} />
      {data.liveClasses && <LiveClassesSection liveClasses={data.liveClasses} checkoutUrl={data.pricing.checkoutUrl} />}
      <WincentreTrustSection />
      <TestimonialsSection data={data} />
      <BonusSection data={data} />
      <PricingSection data={data} />
      <FAQSection data={data} />
      <FinalCTASection data={data} />
      <ExploreMoreSection />
      <MobileStickyCTA data={data} />
    </>
  );
}

"use client";

import { useState } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────
type CourseKey = "iti" | "diploma" | "btech" | "surveyor";

interface CourseData {
  label:        string;
  shortLabel:   string;
  emoji:        string;
  tagline:      string;
  keyword:      string;           // SEO
  monthly:      number;
  annual:       number;
  annualOrig:   number;
  enrollMonthly: string;
  enrollAnnual:  string;
  monthlyFeatures: string[];
  annualBonus:     string[];
  pools:           string[];
}

// ─── Course data ────────────────────────────────────────────────────────────
const COURSES: Record<CourseKey, CourseData> = {
  iti: {
    label:       "ITI Civil",
    shortLabel:  "ITI",
    emoji:       "🔧",
    tagline:     "Kerala PSC Civil Engineering ITI level preparation",
    keyword:     "ITI Civil PSC course Kerala",
    monthly:     299,
    annual:      2499,
    annualOrig:  3588,
    enrollMonthly: "https://lms.civilezy.com/enroll/iti-monthly",
    enrollAnnual:  "https://lms.civilezy.com/enroll/iti-annual",
    monthlyFeatures: [
      "Full ITI Civil syllabus access",
      "3,200+ PSC-level questions",
      "25 pool-based mock tests",
      "Malayalam audio lessons 🎧",
      "Short video lessons (40–50 min) 🎥",
      "Game Arena access 🎮",
      "Daily quiz + streak system",
      "Performance analytics dashboard",
    ],
    annualBonus: [
      "Everything in Monthly",
      "10 bonus mock tests (35 total)",
      "Priority doubt support",
      "Exam alert notifications",
      "Downloadable study notes PDF",
    ],
    pools: ["KWA-ITI", "PWD-ITI", "LSGD-ITI", "IRD-ITI"],
  },
  diploma: {
    label:       "Diploma Civil",
    shortLabel:  "Diploma",
    emoji:       "📐",
    tagline:     "Diploma Civil PSC preparation — Overseer, Technical Assistant",
    keyword:     "Diploma Civil PSC preparation Kerala",
    monthly:     449,
    annual:      3999,
    annualOrig:  5388,
    enrollMonthly: "https://lms.civilezy.com/enroll/diploma-monthly",
    enrollAnnual:  "https://lms.civilezy.com/enroll/diploma-annual",
    monthlyFeatures: [
      "Full Diploma Civil syllabus access",
      "5,800+ PSC-level questions",
      "40 pool-based mock tests",
      "Malayalam + English bilingual lessons",
      "Short video lessons (40–50 min) 🎥",
      "Game Arena — Expert mode 🎮",
      "Department-specific papers (KWA, PWD)",
      "Smart weak-area detection",
    ],
    annualBonus: [
      "Everything in Monthly",
      "20 bonus department mock tests",
      "Priority doubt support + WhatsApp",
      "KWA/PWD specific paper bundles",
      "Rank prediction after each test",
    ],
    pools: ["DIP-G1", "KWA-DIP", "PWD-DIP", "KSEB-DIP"],
  },
  btech: {
    label:       "BTech / AE",
    shortLabel:  "BTech/AE",
    emoji:       "🏗️",
    tagline:     "PSC AE coaching Kerala — BTech Civil Assistant Engineer",
    keyword:     "PSC AE coaching Kerala BTech Civil",
    monthly:     599,
    annual:      5499,
    annualOrig:  7188,
    enrollMonthly: "https://lms.civilezy.com/enroll/btech-monthly",
    enrollAnnual:  "https://lms.civilezy.com/enroll/btech-annual",
    monthlyFeatures: [
      "Full BTech Civil AE syllabus",
      "8,200+ advanced PSC questions",
      "60 full mock tests (AE-level)",
      "IS code reference library",
      "Short video lessons (40–50 min) 🎥",
      "Game Arena — Legend mode 🎮",
      "KWA AE + PWD AE specific papers",
      "Rank prediction + merit list analysis",
    ],
    annualBonus: [
      "Everything in Monthly",
      "30 bonus AE-level mock tests",
      "1-on-1 monthly doubt sessions",
      "Expert notes with IS code mapping",
      "Interview prep materials",
    ],
    pools: ["AE-KWA", "AE-PWD", "AE-LSGD", "AE-KSEB"],
  },
  surveyor: {
    label:       "Surveyor",
    shortLabel:  "Surveyor",
    emoji:       "📏",
    tagline:     "Kerala PSC Surveyor Civil Engineering preparation",
    keyword:     "Kerala PSC Surveyor Civil preparation",
    monthly:     349,
    annual:      2999,
    annualOrig:  4188,
    enrollMonthly: "https://lms.civilezy.com/enroll/surveyor-monthly",
    enrollAnnual:  "https://lms.civilezy.com/enroll/surveyor-annual",
    monthlyFeatures: [
      "Full Surveyor syllabus access",
      "2,800+ surveying-focused questions",
      "20 pool-based mock tests",
      "Malayalam audio lessons 🎧",
      "Short video lessons (40–50 min) 🎥",
      "Game Arena access 🎮",
      "Topography & levelling modules",
      "Performance tracking dashboard",
    ],
    annualBonus: [
      "Everything in Monthly",
      "15 bonus mock tests (35 total)",
      "Priority doubt support",
      "Downloadable survey tables PDF",
      "Exam alert notifications",
    ],
    pools: ["SURV-PWD", "SURV-LSGD", "SURV-KWA", "SURV-IRD"],
  },
};

const COURSE_KEYS: CourseKey[] = ["iti", "diploma", "btech", "surveyor"];

const WHAT_YOU_GET = [
  { icon: "📘", title: "Smart Lessons",          desc: "Pool-mapped syllabus. Structured, no wasted time." },
  { icon: "🎧", title: "Malayalam Audio",         desc: "Learn complex topics in Malayalam, on the go."    },
  { icon: "⚡", title: "Smart Quiz System",       desc: "Topic tests, instant feedback, XP + streaks."     },
  { icon: "🎥", title: "Short Video Lessons",     desc: "40–50 min focused videos. Zero filler."            },
  { icon: "🎮", title: "Game Arena",              desc: "Compete, earn XP, climb the leaderboard."          },
  { icon: "📊", title: "Performance Tracking",    desc: "Weak areas, rank trajectory, daily insights."      },
] as const;

// ─── Helpers ───────────────────────────────────────────────────────────────
function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}
function savings(c: CourseData) {
  return fmt(c.annualOrig - c.annual);
}
function savingsPct(c: CourseData) {
  return Math.round(((c.annualOrig - c.annual) / c.annualOrig) * 100);
}

// ─── Main component ────────────────────────────────────────────────────────
export default function PricingSection() {
  const [active, setActive] = useState<CourseKey>("diploma");
  const course = COURSES[active];

  return (
    <section
      id="pricing"
      aria-label="Kerala PSC Civil Engineering course pricing"
      style={{ background: "#0B1E3D", padding: "80px 0", position: "relative", overflow: "hidden" }}
    >
      {/* Background glow */}
      <div style={{
        position: "absolute", top: "40%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: "800px", height: "800px", borderRadius: "50%",
        background: "radial-gradient(circle,rgba(255,98,0,0.05) 0%,transparent 65%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "1200px", width: "100%", margin: "0 auto", padding: "0 5%", position: "relative", zIndex: 1 }}>

        {/* ── Section header ────────────────────────────────────────── */}
        <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 52px" }}>
          <div style={{ display:"inline-block", background:"rgba(255,98,0,0.15)", border:"1px solid rgba(255,98,0,0.3)", borderRadius:"20px", padding:"4px 16px", fontSize:"12px", fontWeight:700, color:"#FF8534", letterSpacing:"0.5px", marginBottom:"16px" }}>
            PRICING
          </div>
          <h2 style={{ fontFamily:"Rajdhani, sans-serif", fontSize:"clamp(28px,4vw,44px)", fontWeight:700, lineHeight:1.2, marginBottom:"16px", color:"#fff" }}>
            Course-Based Pricing.{" "}
            <span style={{ background:"linear-gradient(135deg,#FF6200,#FFB800)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
              Pay Only For Your Pool.
            </span>
          </h2>
          <p style={{ fontSize:"17px", color:"rgba(255,255,255,0.85)", lineHeight:1.7, margin:0 }}>
            Join thousands of Kerala PSC Civil Engineering aspirants preparing the smart way.
            Choose your exam pool and unlock everything you need.
          </p>
        </div>

        {/* ── Course selector tabs ──────────────────────────────────── */}
        <div style={{ display:"flex", justifyContent:"center", marginBottom:"48px" }}>
          <div style={{
            display:"inline-flex",
            background:"rgba(255,255,255,0.05)",
            border:"1px solid rgba(255,255,255,0.1)",
            borderRadius:"50px",
            padding:"5px",
            gap:"4px",
          }}>
            {COURSE_KEYS.map(key => {
              const c = COURSES[key];
              const isActive = active === key;
              return (
                <button
                  key={key}
                  onClick={() => setActive(key)}
                  style={{
                    display:"inline-flex", alignItems:"center", gap:"6px",
                    padding:"10px 20px", borderRadius:"50px", border:"none",
                    fontFamily:"Nunito, sans-serif", fontSize:"14px", fontWeight:700,
                    cursor:"pointer", transition:"all 0.25s",
                    background: isActive ? "linear-gradient(135deg,#FF6200,#FF8534)" : "transparent",
                    color: isActive ? "white" : "rgba(255,255,255,0.55)",
                    boxShadow: isActive ? "0 4px 16px rgba(255,98,0,0.35)" : "none",
                    whiteSpace:"nowrap",
                  }}
                >
                  <span>{c.emoji}</span>
                  <span>{c.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Selected course label ─────────────────────────────────── */}
        <div style={{ textAlign:"center", marginBottom:"36px" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:"10px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"14px", padding:"10px 20px" }}>
            <span style={{ fontSize:"22px" }}>{course.emoji}</span>
            <div style={{ textAlign:"left" }}>
              <div style={{ fontFamily:"Rajdhani, sans-serif", fontSize:"18px", fontWeight:700 }}>{course.label} PSC Preparation</div>
              <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.45)" }}>{course.tagline}</div>
            </div>
            <div style={{ marginLeft:"12px", display:"flex", gap:"6px", flexWrap:"wrap" }}>
              {course.pools.map(p => (
                <span key={p} style={{ background:"rgba(255,98,0,0.12)", border:"1px solid rgba(255,98,0,0.25)", borderRadius:"20px", padding:"2px 10px", fontSize:"11px", fontWeight:700, color:"#FF8534" }}>{p}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Pricing cards ─────────────────────────────────────────── */}
        <div style={{
          display:"grid",
          gridTemplateColumns:"1fr 1.1fr",
          gap:"28px",
          maxWidth:"900px",
          margin:"0 auto 36px",
          alignItems:"start",
        }}
          className="pricing-cards-grid"
        >
          {/* ── MONTHLY ─────────────────────────────────────────── */}
          <MonthlyCard course={course} />

          {/* ── ANNUAL ──────────────────────────────────────────── */}
          <AnnualCard course={course} />
        </div>

        {/* ── Payment trust row ─────────────────────────────────────── */}
        <div style={{ display:"flex", justifyContent:"center", gap:"32px", flexWrap:"wrap", marginBottom:"64px" }}>
          {[
            "✔ Monthly plan auto-debited",
            "✔ Annual plan — 3-month installments available",
            "✔ Secure payment via EzyCourse LMS",
            "✔ Cancel anytime",
          ].map(t => (
            <div key={t} style={{ display:"flex", alignItems:"center", gap:"6px", fontSize:"13px", color:"rgba(255,255,255,0.5)" }}>
              <span style={{ color:"#32C864", fontWeight:800 }}>{t[0]}</span>
              {t.slice(1)}
            </div>
          ))}
        </div>

        {/* ── What you get grid ─────────────────────────────────────── */}
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.08)", paddingTop:"60px" }}>
          <div style={{ textAlign:"center", marginBottom:"40px" }}>
            <div style={{ display:"inline-block", background:"rgba(255,98,0,0.12)", border:"1px solid rgba(255,98,0,0.25)", borderRadius:"20px", padding:"4px 16px", fontSize:"12px", fontWeight:700, color:"#FF8534", letterSpacing:"0.5px", marginBottom:"12px" }}>
              INCLUDED IN ALL PLANS
            </div>
            <h3 style={{ fontFamily:"Rajdhani, sans-serif", fontSize:"clamp(22px,3vw,34px)", fontWeight:700, color:"#fff" }}>
              Everything You Need to Rank
            </h3>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"20px", maxWidth:"1000px", margin:"0 auto" }}
            className="features-grid"
          >
            {WHAT_YOU_GET.map((f, i) => (
              <div
                key={f.title}
                style={{
                  background:"rgba(255,255,255,0.04)",
                  border:"1px solid rgba(255,98,0,0.15)",
                  borderRadius:"16px",
                  padding:"20px",
                  display:"flex",
                  alignItems:"flex-start",
                  gap:"14px",
                  transition:"transform 0.25s, border-color 0.25s, box-shadow 0.25s",
                  animationDelay:`${i*60}ms`,
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.transform   = "translateY(-4px)";
                  el.style.borderColor = "rgba(255,98,0,0.4)";
                  el.style.boxShadow   = "0 8px 24px rgba(255,98,0,0.1)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.transform   = "translateY(0)";
                  el.style.borderColor = "rgba(255,98,0,0.15)";
                  el.style.boxShadow   = "none";
                }}
              >
                <div style={{ width:"42px", height:"42px", borderRadius:"12px", background:"rgba(255,98,0,0.12)", border:"1px solid rgba(255,98,0,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px", flexShrink:0 }}>
                  {f.icon}
                </div>
                <div>
                  <div style={{ fontFamily:"Rajdhani, sans-serif", fontSize:"17px", fontWeight:700, marginBottom:"4px" }}>{f.title}</div>
                  <div style={{ fontSize:"13px", color:"rgba(255,255,255,0.55)", lineHeight:1.5 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 640px) {
          .pricing-cards-grid { grid-template-columns: 1fr !important; }
          .features-grid      { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 900px) {
          .features-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
    </section>
  );
}

// ─── Monthly Card ──────────────────────────────────────────────────────────
function MonthlyCard({ course }: { course: CourseData }) {
  return (
    <div
      style={{
        background:"rgba(255,255,255,0.04)",
        border:"1px solid rgba(255,255,255,0.1)",
        borderRadius:"24px",
        padding:"32px",
        position:"relative",
        transition:"transform 0.3s, box-shadow 0.3s",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "translateY(-6px)";
        el.style.boxShadow = "0 16px 40px rgba(0,0,0,0.3)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "none";
      }}
    >
      <div style={{ fontFamily:"Rajdhani, sans-serif", fontSize:"22px", fontWeight:700, marginBottom:"4px" }}>Monthly Access</div>
      <div style={{ fontSize:"13px", color:"rgba(255,255,255,0.45)", marginBottom:"20px" }}>
        Flexible monthly subscription with auto-debit
      </div>

      <div style={{ marginBottom:"20px" }}>
        <span style={{ fontFamily:"Rajdhani, sans-serif", fontSize:"52px", fontWeight:700, background:"linear-gradient(135deg,#FF6200,#FFB800)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
          {fmt(course.monthly)}
        </span>
        <span style={{ fontSize:"15px", color:"rgba(255,255,255,0.45)" }}> / month</span>
      </div>

      <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.35)", marginBottom:"24px" }}>
        ≈ {fmt(Math.round(course.monthly / 30))} per day
      </div>

      <ul style={{ listStyle:"none", padding:0, display:"flex", flexDirection:"column", gap:"11px", marginBottom:"28px" }}>
        {course.monthlyFeatures.map((f, i) => (
          <li key={i} style={{ display:"flex", alignItems:"flex-start", gap:"10px", fontSize:"14px" }}>
            <span style={{ color:"#32C864", fontWeight:800, flexShrink:0, marginTop:"1px" }}>✓</span>
            <span style={{ color:"rgba(255,255,255,0.85)" }}>{f}</span>
          </li>
        ))}
      </ul>

      <a
        href={course.enrollMonthly}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display:"block", width:"100%", padding:"14px", borderRadius:"50px",
          textAlign:"center", background:"transparent",
          border:"2px solid rgba(255,255,255,0.2)", color:"white",
          fontFamily:"Nunito, sans-serif", fontSize:"16px", fontWeight:800,
          cursor:"pointer", transition:"border-color 0.2s, background 0.2s",
          textDecoration:"none",
        }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor="#FF6200"; el.style.background="rgba(255,98,0,0.1)"; }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor="rgba(255,255,255,0.2)"; el.style.background="transparent"; }}
      >
        Start Monthly Plan →
      </a>

      <p style={{ textAlign:"center", fontSize:"12px", color:"rgba(255,255,255,0.3)", marginTop:"12px" }}>
        Auto-renewed monthly · Cancel anytime
      </p>
    </div>
  );
}

// ─── Annual Card ───────────────────────────────────────────────────────────
function AnnualCard({ course }: { course: CourseData }) {
  const pct = savingsPct(course);
  const saved = savings(course);
  const quarterly = Math.ceil(course.annual / 4);

  return (
    <div
      style={{
        background:"linear-gradient(135deg,#1A0800,#2A1000)",
        border:"2px solid #FF6200",
        borderRadius:"24px",
        padding:"36px 32px",
        position:"relative",
        boxShadow:"0 0 40px rgba(255,98,0,0.18), 0 8px 40px rgba(0,0,0,0.4)",
        transition:"transform 0.3s, box-shadow 0.3s",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "translateY(-8px)";
        el.style.boxShadow = "0 0 60px rgba(255,98,0,0.32), 0 20px 60px rgba(0,0,0,0.5)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "0 0 40px rgba(255,98,0,0.18), 0 8px 40px rgba(0,0,0,0.4)";
      }}
    >
      {/* Best Value badge */}
      <div style={{
        position:"absolute", top:"-15px", left:"50%", transform:"translateX(-50%)",
        background:"linear-gradient(90deg,#FF6200,#FF8534)", color:"white",
        fontSize:"12px", fontWeight:800, padding:"5px 22px", borderRadius:"20px",
        whiteSpace:"nowrap", boxShadow:"0 4px 14px rgba(255,98,0,0.45)",
      }}>
        🔥 BEST VALUE — Save {pct}%
      </div>

      <div style={{ fontFamily:"Rajdhani, sans-serif", fontSize:"24px", fontWeight:700, marginBottom:"4px" }}>Annual Plan</div>
      <div style={{ fontSize:"13px", color:"rgba(255,255,255,0.45)", marginBottom:"20px" }}>
        Save more with yearly access + installment option
      </div>

      {/* Price */}
      <div style={{ marginBottom:"6px" }}>
        <span style={{ fontSize:"18px", color:"rgba(255,255,255,0.35)", textDecoration:"line-through", marginRight:"8px" }}>{fmt(course.annualOrig)}</span>
        <span style={{ fontFamily:"Rajdhani, sans-serif", fontSize:"52px", fontWeight:700, background:"linear-gradient(135deg,#FF6200,#FFB800)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
          {fmt(course.annual)}
        </span>
        <span style={{ fontSize:"15px", color:"rgba(255,255,255,0.45)" }}> / year</span>
      </div>

      {/* Savings pill */}
      <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginBottom:"20px" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:"6px", background:"rgba(50,200,100,0.12)", border:"1px solid rgba(50,200,100,0.3)", borderRadius:"20px", padding:"4px 14px", fontSize:"12px", fontWeight:700, color:"#32C864" }}>
          🎉 You save {saved}
        </div>
        <div style={{ display:"inline-flex", alignItems:"center", gap:"6px", background:"rgba(100,200,255,0.1)", border:"1px solid rgba(100,200,255,0.25)", borderRadius:"20px", padding:"4px 14px", fontSize:"12px", fontWeight:700, color:"#64C8FF" }}>
          ≈ {fmt(Math.round(course.annual / 12))} / month
        </div>
      </div>

      {/* Installment info */}
      <div style={{ background:"rgba(255,98,0,0.08)", border:"1px solid rgba(255,98,0,0.2)", borderRadius:"12px", padding:"12px 16px", marginBottom:"24px", display:"flex", alignItems:"center", gap:"10px" }}>
        <span style={{ fontSize:"20px", flexShrink:0 }}>💳</span>
        <div>
          <div style={{ fontSize:"13px", fontWeight:700, color:"#FF8534", marginBottom:"2px" }}>
            3-Month Installment Available
          </div>
          <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.5)" }}>
            Pay {fmt(quarterly)} every quarter · No interest · Easy on your wallet
          </div>
        </div>
      </div>

      {/* Annual features = monthly + bonus */}
      <ul style={{ listStyle:"none", padding:0, display:"flex", flexDirection:"column", gap:"11px", marginBottom:"28px" }}>
        {course.annualBonus.map((f, i) => (
          <li key={i} style={{ display:"flex", alignItems:"flex-start", gap:"10px", fontSize:"14px" }}>
            <span style={{ color: i === 0 ? "#FFB800" : "#32C864", fontWeight:800, flexShrink:0, marginTop:"1px" }}>
              {i === 0 ? "★" : "✓"}
            </span>
            <span style={{ color: i === 0 ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.9)", fontStyle: i === 0 ? "italic" : "normal" }}>
              {f}
            </span>
          </li>
        ))}
      </ul>

      <a
        href={course.enrollAnnual}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display:"block", width:"100%", padding:"16px", borderRadius:"50px",
          textAlign:"center", background:"linear-gradient(135deg,#FF6200,#FF4500)",
          color:"white", fontFamily:"Nunito, sans-serif", fontSize:"16px", fontWeight:800,
          cursor:"pointer", boxShadow:"0 6px 25px rgba(255,98,0,0.4)",
          transition:"box-shadow 0.2s, transform 0.2s", textDecoration:"none",
        }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.boxShadow="0 10px 35px rgba(255,98,0,0.6)"; el.style.transform="translateY(-2px)"; }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.boxShadow="0 6px 25px rgba(255,98,0,0.4)"; el.style.transform="translateY(0)"; }}
      >
        Choose Annual Plan — {fmt(course.annual)} →
      </a>

      <p style={{ textAlign:"center", fontSize:"12px", color:"rgba(255,255,255,0.35)", marginTop:"12px" }}>
        One-time annual payment · Or pay every 3 months
      </p>
    </div>
  );
}
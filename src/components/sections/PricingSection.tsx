"use client";

import { useState } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────
type CourseKey = "iti" | "diploma" | "btech" | "surveyor";

interface CourseData {
  label:          string;
  shortLabel:     string;
  emoji:          string;
  tagline:        string;
  keyword:        string;
  monthly:        number;
  annual:         number;
  annualOrig:     number;
  popular:        boolean;
  enrollMonthly:  string;
  enrollAnnual:   string;
  features:       string[];
  annualBonus:    string[];
  pools:          string[];
}

// ─── Checkout URL ───────────────────────────────────────────────────────────
const CHECKOUT = "https://www.civilezy.in/en/checkout/?product_id=4987&price_id=271682&product_type=membership";

// ─── Course data ────────────────────────────────────────────────────────────
const COURSES: Record<CourseKey, CourseData> = {
  iti: {
    label: "ITI Civil", shortLabel: "ITI", emoji: "🔧",
    tagline: "Kerala PSC Civil Engineering ITI level preparation",
    keyword: "ITI Civil PSC course Kerala",
    monthly: 1800, annual: 15000, annualOrig: 21600,
    popular: false,
    enrollMonthly: CHECKOUT, enrollAnnual: CHECKOUT,
    features: [
      "Full ITI Civil syllabus coverage",
      "PSC-level mock tests — pool-based",
      "Malayalam audio explanations 🎧",
      "Game Arena access 🎮",
      "Daily quiz + streak system",
      "Performance analytics dashboard",
    ],
    annualBonus: [
      "Everything in Monthly",
      "10 bonus mock tests",
      "Priority doubt support",
      "Exam alert notifications",
      "Downloadable study notes PDF",
    ],
    pools: ["KWA-ITI", "PWD-ITI", "LSGD-ITI", "IRD-ITI"],
  },
  diploma: {
    label: "Diploma Civil", shortLabel: "Diploma", emoji: "📐",
    tagline: "Diploma Civil PSC preparation — Overseer, Technical Assistant",
    keyword: "Diploma Civil PSC preparation Kerala",
    monthly: 2000, annual: 17000, annualOrig: 24000,
    popular: true,
    enrollMonthly: CHECKOUT, enrollAnnual: CHECKOUT,
    features: [
      "Full Diploma Civil syllabus coverage",
      "PSC-level mock tests — pool-based",
      "Malayalam audio explanations 🎧",
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
    label: "BTech / AE", shortLabel: "BTech/AE", emoji: "🏗️",
    tagline: "PSC AE coaching Kerala — BTech Civil Assistant Engineer",
    keyword: "PSC AE coaching Kerala BTech Civil",
    monthly: 2500, annual: 20000, annualOrig: 30000,
    popular: false,
    enrollMonthly: CHECKOUT, enrollAnnual: CHECKOUT,
    features: [
      "Full BTech Civil AE syllabus coverage",
      "PSC-level mock tests — AE level",
      "Malayalam audio explanations 🎧",
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
    label: "Surveyor", shortLabel: "Surveyor", emoji: "📏",
    tagline: "Kerala PSC Surveyor Civil Engineering preparation",
    keyword: "Kerala PSC Surveyor Civil preparation",
    monthly: 1800, annual: 15000, annualOrig: 21600,
    popular: false,
    enrollMonthly: CHECKOUT, enrollAnnual: CHECKOUT,
    features: [
      "Full Surveyor syllabus coverage",
      "PSC-level mock tests — pool-based",
      "Malayalam audio explanations 🎧",
      "Game Arena access 🎮",
      "Topography & levelling modules",
      "Performance tracking dashboard",
    ],
    annualBonus: [
      "Everything in Monthly",
      "15 bonus mock tests",
      "Priority doubt support",
      "Downloadable survey tables PDF",
      "Exam alert notifications",
    ],
    pools: ["SURV-PWD", "SURV-LSGD", "SURV-KWA", "SURV-IRD"],
  },
};

const COURSE_KEYS: CourseKey[] = ["iti", "diploma", "btech", "surveyor"];

const WHAT_YOU_GET = [
  { icon: "📘", title: "Smart Lessons",        desc: "Pool-mapped syllabus. Structured, no wasted time." },
  { icon: "🎧", title: "Malayalam Audio",       desc: "Learn complex topics in Malayalam, on the go."    },
  { icon: "⚡", title: "Smart Quiz System",     desc: "Topic tests, instant feedback, XP + streaks."     },
  { icon: "🎥", title: "Short Video Lessons",   desc: "40–50 min focused videos. Zero filler."           },
  { icon: "🎮", title: "Game Arena",            desc: "Compete, earn XP, climb the leaderboard."         },
  { icon: "📊", title: "Performance Tracking",  desc: "Weak areas, rank trajectory, daily insights."     },
] as const;

function fmt(n: number) { return "₹" + n.toLocaleString("en-IN"); }
function savingsPct(c: CourseData) { return Math.round(((c.annualOrig - c.annual) / c.annualOrig) * 100); }
function savedAmt(c: CourseData)   { return fmt(c.annualOrig - c.annual); }

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
      <div style={{ position:"absolute", top:"40%", left:"50%", transform:"translate(-50%,-50%)", width:"800px", height:"800px", borderRadius:"50%", background:"radial-gradient(circle,rgba(255,98,0,0.05) 0%,transparent 65%)", pointerEvents:"none" }} />

      <div style={{ maxWidth:"1200px", width:"100%", margin:"0 auto", padding:"0 5%", position:"relative", zIndex:1 }}>

        {/* ── Section header ── */}
        <div style={{ textAlign:"center", maxWidth:"700px", margin:"0 auto 52px" }}>
          <div style={{ display:"inline-block", background:"rgba(255,98,0,0.15)", border:"1px solid rgba(255,98,0,0.3)", borderRadius:"20px", padding:"4px 16px", fontSize:"12px", fontWeight:700, color:"#FF8534", letterSpacing:"0.5px", marginBottom:"16px" }}>
            LIMITED BATCH — ENROLL NOW
          </div>
          <h2 style={{ fontFamily:"Rajdhani, sans-serif", fontSize:"clamp(28px,4vw,44px)", fontWeight:700, lineHeight:1.2, marginBottom:"16px", color:"#fff" }}>
            Course-Based Pricing.{" "}
            <span style={{ background:"linear-gradient(135deg,#FF6200,#FFB800)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
              Pay Only For Your Pool.
            </span>
          </h2>
          <p style={{ fontSize:"17px", color:"rgba(255,255,255,0.85)", lineHeight:1.7, margin:"0 0 16px" }}>
            Join thousands of Kerala PSC Civil Engineering aspirants preparing the smart way.
            Choose your exam pool and unlock everything you need.
          </p>
          {/* Conversion boost */}
          <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"rgba(255,98,0,0.08)", border:"1px solid rgba(255,98,0,0.2)", borderRadius:"50px", padding:"8px 18px", fontSize:"13px", color:"#FF8534", fontWeight:700 }}>
            <span style={{ width:"7px", height:"7px", borderRadius:"50%", background:"#FF6200", animation:"pulseDot 2s infinite", flexShrink:0 }} />
            ⚡ Limited time offer — 50+ students joined this week
          </div>
        </div>

        {/* ── Course selector tabs ── */}
        <div style={{ display:"flex", justifyContent:"center", marginBottom:"48px" }}>
          <div style={{ display:"inline-flex", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"50px", padding:"5px", gap:"4px" }}>
            {COURSE_KEYS.map(key => {
              const c = COURSES[key];
              const isActive = active === key;
              return (
                <button key={key} onClick={() => setActive(key)}
                  style={{ position:"relative", display:"inline-flex", alignItems:"center", gap:"6px", padding:"10px 20px", borderRadius:"50px", border:"none", fontFamily:"Nunito, sans-serif", fontSize:"14px", fontWeight:700, cursor:"pointer", transition:"all 0.25s", background:isActive?"linear-gradient(135deg,#FF6200,#FF8534)":"transparent", color:isActive?"white":"rgba(255,255,255,0.55)", boxShadow:isActive?"0 4px 16px rgba(255,98,0,0.35)":"none", whiteSpace:"nowrap" }}>
                  <span>{c.emoji}</span>
                  <span>{c.shortLabel}</span>
                  {/* Popular dot on tab */}
                  {c.popular && !isActive && (
                    <span style={{ position:"absolute", top:"6px", right:"8px", width:"6px", height:"6px", borderRadius:"50%", background:"#FF6200", boxShadow:"0 0 6px rgba(255,98,0,0.8)" }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Selected course label ── */}
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

        {/* ── Pricing cards ── */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1.1fr", gap:"28px", maxWidth:"900px", margin:"0 auto 36px", alignItems:"start" }} className="pricing-cards-grid">
          <MonthlyCard course={course} />
          <AnnualCard  course={course} />
        </div>

        {/* ── Payment trust row ── */}
        <div style={{ display:"flex", justifyContent:"center", gap:"32px", flexWrap:"wrap", marginBottom:"28px" }}>
          {["✔ Monthly plan auto-debited","✔ Annual plan — 3-month installments available","✔ Secure payment via EzyCourse LMS","✔ Cancel anytime"].map(t => (
            <div key={t} style={{ display:"flex", alignItems:"center", gap:"6px", fontSize:"13px", color:"rgba(255,255,255,0.5)" }}>
              <span style={{ color:"#32C864", fontWeight:800 }}>{t[0]}</span>{t.slice(1)}
            </div>
          ))}
        </div>

        {/* ── Guarantee strip ── */}
        <div style={{ maxWidth:"580px", margin:"0 auto 52px", display:"flex", alignItems:"center", justifyContent:"center", gap:"14px", background:"rgba(50,200,100,0.06)", border:"1px solid rgba(50,200,100,0.2)", borderRadius:"14px", padding:"14px 24px", flexWrap:"wrap" }}>
          <span style={{ fontSize:"24px", flexShrink:0 }}>🛡️</span>
          <div style={{ textAlign:"left" }}>
            <div style={{ fontSize:"14px", fontWeight:700, color:"#32C864", marginBottom:"2px" }}>7-Day Full Refund Guarantee</div>
            <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.5)" }}>Not satisfied? Email us within 7 days. Full refund, no questions asked.</div>
          </div>
        </div>

        {/* ── What you get grid ── */}
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.08)", paddingTop:"60px" }}>
          <div style={{ textAlign:"center", marginBottom:"40px" }}>
            <div style={{ display:"inline-block", background:"rgba(255,98,0,0.12)", border:"1px solid rgba(255,98,0,0.25)", borderRadius:"20px", padding:"4px 16px", fontSize:"12px", fontWeight:700, color:"#FF8534", letterSpacing:"0.5px", marginBottom:"12px" }}>
              INCLUDED IN ALL PLANS
            </div>
            <h3 style={{ fontFamily:"Rajdhani, sans-serif", fontSize:"clamp(22px,3vw,34px)", fontWeight:700, color:"#fff" }}>
              Everything You Need to Rank
            </h3>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"20px", maxWidth:"1000px", margin:"0 auto" }} className="features-grid">
            {WHAT_YOU_GET.map((f) => (
              <div key={f.title}
                style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,98,0,0.15)", borderRadius:"16px", padding:"20px", display:"flex", alignItems:"flex-start", gap:"14px", transition:"transform 0.25s, border-color 0.25s, box-shadow 0.25s" }}
                onMouseEnter={e => { const el=e.currentTarget as HTMLDivElement; el.style.transform="translateY(-4px)"; el.style.borderColor="rgba(255,98,0,0.4)"; el.style.boxShadow="0 8px 24px rgba(255,98,0,0.1)"; }}
                onMouseLeave={e => { const el=e.currentTarget as HTMLDivElement; el.style.transform="translateY(0)"; el.style.borderColor="rgba(255,98,0,0.15)"; el.style.boxShadow="none"; }}
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
      style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"24px", padding:"32px", position:"relative", transition:"transform 0.3s, box-shadow 0.3s" }}
      onMouseEnter={e => { const el=e.currentTarget as HTMLDivElement; el.style.transform="translateY(-6px)"; el.style.boxShadow="0 16px 40px rgba(0,0,0,0.3)"; }}
      onMouseLeave={e => { const el=e.currentTarget as HTMLDivElement; el.style.transform="translateY(0)"; el.style.boxShadow="none"; }}
    >
      <div style={{ fontFamily:"Rajdhani, sans-serif", fontSize:"22px", fontWeight:700, marginBottom:"4px" }}>Monthly Access</div>
      <div style={{ fontSize:"13px", color:"rgba(255,255,255,0.45)", marginBottom:"20px" }}>Flexible monthly subscription with auto-debit</div>

      {/* Monthly price — large */}
      <div style={{ marginBottom:"6px" }}>
        <span style={{ fontFamily:"Rajdhani, sans-serif", fontSize:"52px", fontWeight:700, background:"linear-gradient(135deg,#FF6200,#FFB800)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
          {fmt(course.monthly)}
        </span>
        <span style={{ fontSize:"15px", color:"rgba(255,255,255,0.45)" }}> / month</span>
      </div>
      {/* Yearly equivalent — small below */}
      <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.35)", marginBottom:"24px" }}>
        ≈ {fmt(Math.round(course.monthly / 30))} per day &nbsp;·&nbsp; Yearly: {fmt(course.annual)}
      </div>

      <ul style={{ listStyle:"none", padding:0, display:"flex", flexDirection:"column", gap:"11px", marginBottom:"28px" }}>
        {course.features.map((f, i) => (
          <li key={i} style={{ display:"flex", alignItems:"flex-start", gap:"10px", fontSize:"14px" }}>
            <span style={{ color:"#32C864", fontWeight:800, flexShrink:0, marginTop:"1px" }}>✓</span>
            <span style={{ color:"rgba(255,255,255,0.85)" }}>{f}</span>
          </li>
        ))}
      </ul>

      <a href={course.enrollMonthly} target="_blank" rel="noopener noreferrer"
        style={{ display:"block", width:"100%", padding:"14px", borderRadius:"50px", textAlign:"center", background:"transparent", border:"2px solid rgba(255,255,255,0.2)", color:"white", fontFamily:"Nunito, sans-serif", fontSize:"16px", fontWeight:800, cursor:"pointer", transition:"border-color 0.2s, background 0.2s", textDecoration:"none" }}
        onMouseEnter={e => { const el=e.currentTarget as HTMLAnchorElement; el.style.borderColor="#FF6200"; el.style.background="rgba(255,98,0,0.1)"; }}
        onMouseLeave={e => { const el=e.currentTarget as HTMLAnchorElement; el.style.borderColor="rgba(255,255,255,0.2)"; el.style.background="transparent"; }}
      >
        🚀 Start Preparation
      </a>
      <p style={{ textAlign:"center", fontSize:"12px", color:"rgba(255,255,255,0.3)", marginTop:"12px" }}>Auto-renewed monthly · Cancel anytime</p>
    </div>
  );
}

// ─── Annual Card ───────────────────────────────────────────────────────────
function AnnualCard({ course }: { course: CourseData }) {
  const pct       = savingsPct(course);
  const saved     = savedAmt(course);
  const quarterly = Math.ceil(course.annual / 4);

  return (
    <div
      style={{ background:"linear-gradient(135deg,#1A0800,#2A1000)", border:"2px solid #FF6200", borderRadius:"24px", padding:"36px 32px", position:"relative", boxShadow:"0 0 40px rgba(255,98,0,0.18), 0 8px 40px rgba(0,0,0,0.4)", transition:"transform 0.3s, box-shadow 0.3s" }}
      onMouseEnter={e => { const el=e.currentTarget as HTMLDivElement; el.style.transform="translateY(-8px)"; el.style.boxShadow="0 0 60px rgba(255,98,0,0.32), 0 20px 60px rgba(0,0,0,0.5)"; }}
      onMouseLeave={e => { const el=e.currentTarget as HTMLDivElement; el.style.transform="translateY(0)"; el.style.boxShadow="0 0 40px rgba(255,98,0,0.18), 0 8px 40px rgba(0,0,0,0.4)"; }}
    >
      {/* Most Popular badge */}
      <div style={{ position:"absolute", top:"-15px", left:"50%", transform:"translateX(-50%)", background:"linear-gradient(90deg,#FF6200,#FF8534)", color:"white", fontSize:"12px", fontWeight:800, padding:"5px 22px", borderRadius:"20px", whiteSpace:"nowrap", boxShadow:"0 4px 14px rgba(255,98,0,0.45)", letterSpacing:"0.5px" }}>
        🔥 MOST POPULAR — Save {pct}%
      </div>

      <div style={{ fontFamily:"Rajdhani, sans-serif", fontSize:"24px", fontWeight:700, marginBottom:"4px" }}>Annual Plan</div>
      <div style={{ fontSize:"13px", color:"rgba(255,255,255,0.45)", marginBottom:"20px" }}>Best value · Yearly access + installment option</div>

      {/* Annual price — large */}
      <div style={{ marginBottom:"6px" }}>
        <span style={{ fontSize:"18px", color:"rgba(255,255,255,0.35)", textDecoration:"line-through", marginRight:"8px" }}>{fmt(course.annualOrig)}</span>
        <span style={{ fontFamily:"Rajdhani, sans-serif", fontSize:"52px", fontWeight:700, background:"linear-gradient(135deg,#FF6200,#FFB800)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
          {fmt(course.annual)}
        </span>
        <span style={{ fontSize:"15px", color:"rgba(255,255,255,0.45)" }}> / year</span>
      </div>
      {/* Monthly equivalent — small below */}
      <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.35)", marginBottom:"16px" }}>
        ≈ {fmt(Math.round(course.annual / 12))} / month billed annually
      </div>

      {/* Savings pills */}
      <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginBottom:"16px" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:"6px", background:"rgba(50,200,100,0.12)", border:"1px solid rgba(50,200,100,0.3)", borderRadius:"20px", padding:"4px 14px", fontSize:"12px", fontWeight:700, color:"#32C864" }}>
          🎉 You save {saved}
        </div>
      </div>

      {/* Installment info */}
      <div style={{ background:"rgba(255,98,0,0.08)", border:"1px solid rgba(255,98,0,0.2)", borderRadius:"12px", padding:"12px 16px", marginBottom:"24px", display:"flex", alignItems:"center", gap:"10px" }}>
        <span style={{ fontSize:"20px", flexShrink:0 }}>💳</span>
        <div>
          <div style={{ fontSize:"13px", fontWeight:700, color:"#FF8534", marginBottom:"2px" }}>Yearly plan available in 3-month installments</div>
          <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.5)" }}>Pay {fmt(quarterly)} every quarter · No interest · Easy on your wallet</div>
        </div>
      </div>

      <ul style={{ listStyle:"none", padding:0, display:"flex", flexDirection:"column", gap:"11px", marginBottom:"28px" }}>
        {course.annualBonus.map((f, i) => (
          <li key={i} style={{ display:"flex", alignItems:"flex-start", gap:"10px", fontSize:"14px" }}>
            <span style={{ color:i===0?"#FFB800":"#32C864", fontWeight:800, flexShrink:0, marginTop:"1px" }}>{i===0?"★":"✓"}</span>
            <span style={{ color:i===0?"rgba(255,255,255,0.6)":"rgba(255,255,255,0.9)", fontStyle:i===0?"italic":"normal" }}>{f}</span>
          </li>
        ))}
      </ul>

      <a href={course.enrollAnnual} target="_blank" rel="noopener noreferrer"
        style={{ display:"block", width:"100%", padding:"16px", borderRadius:"50px", textAlign:"center", background:"linear-gradient(135deg,#FF6200,#FF4500)", color:"white", fontFamily:"Nunito, sans-serif", fontSize:"16px", fontWeight:800, cursor:"pointer", boxShadow:"0 6px 25px rgba(255,98,0,0.4)", transition:"box-shadow 0.2s, transform 0.2s", textDecoration:"none" }}
        onMouseEnter={e => { const el=e.currentTarget as HTMLAnchorElement; el.style.boxShadow="0 10px 35px rgba(255,98,0,0.6)"; el.style.transform="translateY(-2px)"; }}
        onMouseLeave={e => { const el=e.currentTarget as HTMLAnchorElement; el.style.boxShadow="0 6px 25px rgba(255,98,0,0.4)"; el.style.transform="translateY(0)"; }}
      >
        🚀 Start Preparation
      </a>
      <p style={{ textAlign:"center", fontSize:"12px", color:"rgba(255,255,255,0.35)", marginTop:"12px" }}>🛡️ 7-day refund guarantee · Cancel anytime</p>
    </div>
  );
}
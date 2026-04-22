import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "Assistant Engineer PSC Coaching Kerala | AE Civil Preparation — CivilEzy" },
  description:
    "Best Assistant Engineer PSC coaching in Kerala for PWD, KWA, Irrigation, LSGD & PCB. Structured AE-level preparation with 70,000+ questions, 1,500+ mock tests, and Malayalam audio. Start free.",
  keywords: [
    "assistant engineer psc coaching kerala",
    "ae civil psc preparation kerala",
    "pwd ae coaching kerala",
    "irrigation ae psc kerala",
    "lsgd ae coaching",
    "kwa ae civil coaching",
    "pcb ae psc preparation",
    "assistant engineer psc syllabus kerala",
    "ae psc mock test kerala",
    "btech civil psc coaching kerala",
    "civil ae coaching wincentre",
  ],
  alternates: { canonical: "https://civilezy.in/assistant-engineer-psc-coaching" },
  openGraph: {
    title:       "Assistant Engineer PSC Coaching Kerala | CivilEzy",
    description: "AE-level PSC coaching for PWD, KWA, Irrigation, LSGD & PCB. 70,000+ questions, 1,500+ mock tests. Powered by Wincentre (4.8⭐).",
    url:         "https://civilezy.in/assistant-engineer-psc-coaching",
    siteName:    "CivilEzy",
    type:        "website",
    locale:      "en_IN",
    images:      [{ url: "https://civilezy.in/civilezy_logo_orange.png", width: 1200, height: 630, alt: "Assistant Engineer PSC Coaching Kerala CivilEzy" }],
  },
  robots: { index: true, follow: true },
};

const DEPARTMENTS = [
  { name: "PWD",        full: "Public Works Department",     icon: "🏗️" },
  { name: "KWA",        full: "Kerala Water Authority",      icon: "💧" },
  { name: "Irrigation", full: "Irrigation Department",       icon: "🌊" },
  { name: "LSGD",       full: "Local Self Govt Department",  icon: "🏛️" },
  { name: "PCB",        full: "Pollution Control Board",     icon: "🌿" },
];

const WHY = [
  { icon: "🏆", title: "1,000+ AE Selections", desc: "Wincentre has guided over 1,000 students to government jobs, including AE-level posts." },
  { icon: "📊", title: "Rank Booster Lessons", desc: "High-value topics covered in-depth. Designed to push you from rank 1000 to rank 100." },
  { icon: "🎙️", title: "Malayalam-First Learning", desc: "All concepts explained in Malayalam — the way it was meant to be understood." },
  { icon: "📝", title: "70,000+ Practice Questions", desc: "The largest question bank for Kerala PSC AE Civil. Chapter-wise, topic-wise, and full mock tests." },
  { icon: "⭐", title: "4.8★ Rated by 445+ Students", desc: "Wincentre's track record speaks: consistently ranked as Kerala's best civil PSC coaching." },
  { icon: "🎮", title: "Game Arena — Free Practice", desc: "Start practising immediately — no enrollment needed. Live leaderboard, real exam questions." },
];

export default function AECoachingPage() {
  return (
    <main style={{ background: "var(--navy)", color: "#fff", minHeight: "100vh", paddingBottom: "80px" }}>

      {/* Hero */}
      <div style={{ background: "linear-gradient(160deg, #040C18 0%, #0B1E3D 100%)", padding: "90px 5% 64px", textAlign: "center" }}>
        <div style={{ maxWidth: "740px", margin: "0 auto" }}>
          <span style={{ display: "inline-block", background: "rgba(50,200,100,0.1)", border: "1px solid rgba(50,200,100,0.25)", borderRadius: "100px", padding: "4px 16px", fontSize: "12px", fontWeight: 700, color: "#32C864", marginBottom: "18px" }}>
            PWD · KWA · Irrigation · LSGD · PCB
          </span>
          <h1 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 700, lineHeight: 1.15, marginBottom: "18px" }}>
            Assistant Engineer PSC Coaching{" "}
            <span style={{ color: "#FF6200" }}>Kerala</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "1.05rem", lineHeight: 1.74, marginBottom: "32px" }}>
            Complete AE-level preparation for B.Tech Civil graduates targeting Kerala PSC posts. Rank Booster lessons, 1,500+ mock tests, Malayalam audio — one platform for all departments.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/courses/btech" style={{ background: "linear-gradient(135deg, #FF6200, #FF8534)", color: "#fff", padding: "14px 34px", borderRadius: "10px", fontWeight: 700, fontSize: "1rem", textDecoration: "none", fontFamily: "Rajdhani, sans-serif", display: "inline-block" }}>
              Start AE Preparation →
            </Link>
            <Link href="/game-arena" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", padding: "14px 34px", borderRadius: "10px", fontWeight: 600, fontSize: "1rem", textDecoration: "none", display: "inline-block" }}>
              Free Mock Test
            </Link>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "64px 5% 0" }}>

        {/* Departments */}
        <div style={{ marginBottom: "56px" }}>
          <h2 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1.6rem", fontWeight: 700, color: "#fff", textAlign: "center", marginBottom: "24px" }}>
            Departments Covered
          </h2>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
            {DEPARTMENTS.map((d) => (
              <div key={d.name} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", padding: "18px 24px", textAlign: "center", minWidth: "160px" }}>
                <div style={{ fontSize: "1.8rem", marginBottom: "8px" }}>{d.icon}</div>
                <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "#FF8534" }}>{d.name}</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", marginTop: "3px" }}>{d.full}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Why CivilEzy */}
        <div style={{ marginBottom: "56px" }}>
          <h2 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1.6rem", fontWeight: 700, color: "#fff", textAlign: "center", marginBottom: "28px" }}>
            Why CivilEzy for AE Preparation?
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
            {WHY.map((w) => (
              <div key={w.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "22px 18px", display: "flex", gap: "14px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "1.5rem", flexShrink: 0 }}>{w.icon}</span>
                <div>
                  <h3 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1rem", fontWeight: 700, color: "#fff", marginBottom: "6px" }}>{w.title}</h3>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: 0 }}>{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Internal links */}
        <div style={{ background: "rgba(255,98,0,0.06)", border: "1px solid rgba(255,98,0,0.2)", borderRadius: "18px", padding: "36px 32px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1.5rem", fontWeight: 700, color: "#fff", marginBottom: "24px" }}>
            Ready to Rank?
          </h2>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/courses/btech" style={{ background: "linear-gradient(135deg, #FF6200, #FF8534)", color: "#fff", padding: "13px 28px", borderRadius: "10px", fontWeight: 700, fontSize: "14px", textDecoration: "none", fontFamily: "Rajdhani, sans-serif", display: "inline-block" }}>View AE Course →</Link>
            <Link href="/courses" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", padding: "13px 28px", borderRadius: "10px", fontWeight: 600, fontSize: "14px", textDecoration: "none", display: "inline-block" }}>All Courses</Link>
            <Link href="/pricing" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", padding: "13px 28px", borderRadius: "10px", fontWeight: 600, fontSize: "14px", textDecoration: "none", display: "inline-block" }}>See Pricing</Link>
            <Link href="/game-arena" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", padding: "13px 28px", borderRadius: "10px", fontWeight: 600, fontSize: "14px", textDecoration: "none", display: "inline-block" }}>Free Practice</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

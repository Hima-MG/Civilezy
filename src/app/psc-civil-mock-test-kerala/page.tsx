import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "PSC Civil Engineering Mock Test Kerala | Free Online Practice — CivilEzy" },
  description:
    "Free Kerala PSC Civil Engineering mock tests online. ITI, Diploma, B.Tech/AE & Surveyor questions. Timed rounds, instant feedback, live leaderboard. 150,000+ questions. Start free — no signup needed.",
  keywords: [
    "psc civil engineering mock test kerala",
    "free civil psc mock test online",
    "kerala psc civil engineering practice test",
    "civil engineering psc questions kerala",
    "iti civil psc mock test",
    "diploma civil psc test kerala",
    "ae civil psc practice questions",
    "kerala psc civil previous year questions",
    "civil engineering psc leaderboard kerala",
    "civilezy game arena",
    "psc civil mcq kerala free",
  ],
  alternates: { canonical: "https://civilezy.in/psc-civil-mock-test-kerala" },
  openGraph: {
    title:       "PSC Civil Engineering Mock Test Kerala — Free | CivilEzy",
    description: "Free Kerala PSC Civil Engineering mock tests. 150,000+ questions, timed rounds, live leaderboard. ITI, Diploma, AE & Surveyor.",
    url:         "https://civilezy.in/psc-civil-mock-test-kerala",
    siteName:    "CivilEzy",
    type:        "website",
    locale:      "en_IN",
    images:      [{ url: "https://civilezy.in/civilezy_logo_orange.png", width: 1200, height: 630, alt: "PSC Civil Engineering Mock Test Kerala CivilEzy" }],
  },
  robots: { index: true, follow: true },
};

const STATS = [
  { value: "150,000+", label: "Practice Questions" },
  { value: "4,700+",   label: "Mock Tests"          },
  { value: "5,200+",   label: "Active Learners"     },
  { value: "Free",     label: "Game Arena"          },
];

const CATEGORIES = [
  { label: "ITI Civil",     topics: ["Building Materials", "Construction Technology", "RCC & Steel", "Surveying", "Estimation"], icon: "🔧", color: "#FF8534" },
  { label: "Diploma Civil", topics: ["Structural Analysis", "Geotechnical Engg", "Environmental Engg", "Transportation", "Irrigation"], icon: "📐", color: "#4C9BF0" },
  { label: "B.Tech / AE",   topics: ["Strength of Materials", "RCC Design", "Fluid Mechanics", "Hydrology", "Construction Mgmt"], icon: "🏗️", color: "#32C864" },
  { label: "Surveyor",      topics: ["Chain Survey", "Theodolite Survey", "Total Station", "GPS & Remote Sensing", "Land Acts"], icon: "📏", color: "#A855F7" },
];

const HOW = [
  { step: "1", title: "Open Game Arena", desc: "No signup needed. Free for all Kerala PSC Civil aspirants.", icon: "🎮" },
  { step: "2", title: "Pick Your Level", desc: "Choose ITI, Diploma, B.Tech/AE or Surveyor category.", icon: "🎯" },
  { step: "3", title: "Answer & Score", desc: "Timed rounds, instant correct/wrong feedback on every question.", icon: "⚡" },
  { step: "4", title: "Climb the Leaderboard", desc: "See your rank among thousands of Kerala PSC aspirants.", icon: "🏆" },
];

export default function MockTestPage() {
  return (
    <main style={{ background: "var(--navy)", color: "#fff", minHeight: "100vh", paddingBottom: "80px" }}>

      {/* Hero */}
      <div style={{ background: "linear-gradient(160deg, #040C18 0%, #0B1E3D 100%)", padding: "90px 5% 64px", textAlign: "center" }}>
        <div style={{ maxWidth: "740px", margin: "0 auto" }}>
          <span style={{ display: "inline-block", background: "rgba(76,155,240,0.12)", border: "1px solid rgba(76,155,240,0.25)", borderRadius: "100px", padding: "4px 16px", fontSize: "12px", fontWeight: 700, color: "#4C9BF0", marginBottom: "18px" }}>
            Free · No Signup · Live Leaderboard
          </span>
          <h1 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 700, lineHeight: 1.15, marginBottom: "18px" }}>
            Kerala PSC Civil Engineering{" "}
            <span style={{ color: "#FF6200" }}>Mock Test</span>{" "}
            — Free Online
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "1.05rem", lineHeight: 1.74, marginBottom: "32px" }}>
            Practice 150,000+ Kerala PSC Civil Engineering questions in CivilEzy&apos;s Game Arena. ITI, Diploma, B.Tech/AE and Surveyor categories. Timed, scored, with instant feedback.
          </p>
          <Link href="/game-arena" style={{ background: "linear-gradient(135deg, #FF6200, #FF8534)", color: "#fff", padding: "16px 40px", borderRadius: "10px", fontWeight: 700, fontSize: "1.1rem", textDecoration: "none", fontFamily: "Rajdhani, sans-serif", display: "inline-block", boxShadow: "0 8px 28px rgba(255,98,0,0.4)" }}>
            🎮 Start Free Mock Test →
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "64px 5% 0" }}>

        {/* Stats */}
        <div style={{ display: "flex", gap: "24px", justifyContent: "center", flexWrap: "wrap", marginBottom: "64px" }}>
          {STATS.map((s) => (
            <div key={s.label} style={{ textAlign: "center", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "20px 32px" }}>
              <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "2rem", fontWeight: 700, color: "#FF8534" }}>{s.value}</div>
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginTop: "4px" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div style={{ marginBottom: "56px" }}>
          <h2 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1.6rem", fontWeight: 700, color: "#fff", textAlign: "center", marginBottom: "28px" }}>
            How to Use the Free Mock Test
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
            {HOW.map((h) => (
              <div key={h.step} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "22px 18px", textAlign: "center" }}>
                <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "2.5rem", fontWeight: 700, color: "rgba(255,98,0,0.3)", marginBottom: "6px" }}>{h.step}</div>
                <div style={{ fontSize: "1.5rem", marginBottom: "10px" }}>{h.icon}</div>
                <h3 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1rem", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>{h.title}</h3>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.65, margin: 0 }}>{h.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div style={{ marginBottom: "56px" }}>
          <h2 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1.6rem", fontWeight: 700, color: "#fff", textAlign: "center", marginBottom: "28px" }}>
            Mock Test Categories
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
            {CATEGORIES.map((c) => (
              <div key={c.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "22px 18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                  <span style={{ fontSize: "1.4rem" }}>{c.icon}</span>
                  <span style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1.05rem", fontWeight: 700, color: c.color }}>{c.label}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {c.topics.map((t) => (
                    <div key={t} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>
                      <span style={{ color: c.color, fontSize: "10px" }}>●</span>{t}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: "linear-gradient(135deg, rgba(255,98,0,0.1), rgba(255,98,0,0.05))", border: "1px solid rgba(255,98,0,0.2)", borderRadius: "18px", padding: "48px 32px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 700, color: "#fff", marginBottom: "14px" }}>
            Want Full Course Access?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.62)", fontSize: "15px", lineHeight: 1.72, maxWidth: "520px", margin: "0 auto 28px" }}>
            Game Arena is free. For structured preparation with live classes, audio lessons, and 1,500+ mock tests — enroll in your course.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/courses" style={{ background: "linear-gradient(135deg, #FF6200, #FF8534)", color: "#fff", padding: "13px 28px", borderRadius: "10px", fontWeight: 700, fontSize: "14px", textDecoration: "none", fontFamily: "Rajdhani, sans-serif", display: "inline-block" }}>View All Courses →</Link>
            <Link href="/pricing" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", padding: "13px 28px", borderRadius: "10px", fontWeight: 600, fontSize: "14px", textDecoration: "none", display: "inline-block" }}>See Pricing</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

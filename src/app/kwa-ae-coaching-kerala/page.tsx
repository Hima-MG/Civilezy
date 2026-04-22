import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "KWA AE Coaching Kerala | Assistant Engineer PSC Preparation — CivilEzy" },
  description:
    "Best KWA Assistant Engineer coaching in Kerala. Complete syllabus, PYQ analysis, AE-level mock tests, and Malayalam audio lessons. Powered by Wincentre (4.8⭐, 1000+ selections). Start free.",
  keywords: [
    "kwa ae coaching kerala",
    "kwa assistant engineer preparation",
    "kerala water authority ae coaching",
    "kwa ae syllabus 2025",
    "kwa ae mock test",
    "assistant engineer psc coaching kerala",
    "kwa ae previous year questions",
    "civil ae coaching thrissur",
    "kwa ae btech civil",
    "civilezy kwa ae",
  ],
  alternates: { canonical: "https://civilezy.in/kwa-ae-coaching-kerala" },
  openGraph: {
    title:       "KWA AE Coaching Kerala | CivilEzy",
    description: "Best KWA AE coaching in Kerala. AE-level mock tests, PYQ analysis, Malayalam audio. Powered by Wincentre (4.8⭐).",
    url:         "https://civilezy.in/kwa-ae-coaching-kerala",
    siteName:    "CivilEzy",
    type:        "website",
    locale:      "en_IN",
    images:      [{ url: "https://civilezy.in/civilezy_logo_orange.png", width: 1200, height: 630, alt: "KWA AE Coaching Kerala CivilEzy" }],
  },
  robots: { index: true, follow: true },
};

const schema = {
  "@context": "https://schema.org",
  "@type":    "EducationalOrganization",
  name:       "CivilEzy — KWA AE Coaching Kerala",
  url:        "https://civilezy.in/kwa-ae-coaching-kerala",
  description:"Best KWA Assistant Engineer coaching in Kerala powered by Wincentre.",
  areaServed: "Kerala",
  teaches:    "KWA Assistant Engineer PSC Examination",
};

const FEATURES = [
  { icon: "📚", title: "Full KWA AE Syllabus", desc: "Covers all B.Tech Civil subjects tested in KWA AE — Structural Analysis, Fluid Mechanics, Geotechnical, Irrigation, and more." },
  { icon: "📝", title: "1,500+ AE-Level Mock Tests", desc: "Exam-pattern questions built for KWA AE difficulty. Chapter-wise and full-length tests with instant feedback." },
  { icon: "🎙️", title: "Malayalam Audio Lessons", desc: "Understand complex concepts in your language. Listen during commute, breaks, or before sleep." },
  { icon: "📊", title: "KWA PYQ Analysis", desc: "Decoded previous-year KWA AE papers. Know exactly what came, what recurs, and what to prioritize." },
  { icon: "🏆", title: "Rank Booster Lessons", desc: "High-weightage topics drilled to mastery. Designed specifically for AE-level rank improvement." },
  { icon: "🎮", title: "Game Arena Practice", desc: "Free timed MCQ practice with live leaderboard. Benchmark yourself against Kerala PSC aspirants." },
];

const TOPICS = [
  "Engineering Mechanics", "Strength of Materials", "Structural Analysis",
  "RCC & Steel Structures", "Geotechnical Engineering", "Fluid Mechanics",
  "Hydrology & Irrigation", "Environmental Engineering", "Surveying",
  "Transportation Engineering", "Construction Management", "Quantity Surveying",
];

export default function KWAAECoachingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <main style={{ background: "var(--navy)", color: "#fff", minHeight: "100vh", paddingBottom: "80px" }}>

        {/* Hero */}
        <div style={{ background: "linear-gradient(160deg, #040C18 0%, #0B1E3D 100%)", padding: "90px 5% 64px", textAlign: "center" }}>
          <div style={{ maxWidth: "720px", margin: "0 auto" }}>
            <span style={{ display: "inline-block", background: "rgba(255,98,0,0.12)", border: "1px solid rgba(255,98,0,0.25)", borderRadius: "100px", padding: "4px 16px", fontSize: "12px", fontWeight: 700, color: "#FF8534", marginBottom: "18px" }}>
              Kerala Water Authority · Assistant Engineer
            </span>
            <h1 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 700, lineHeight: 1.15, marginBottom: "18px" }}>
              KWA AE Coaching Kerala —{" "}
              <span style={{ color: "#FF6200" }}>Rank-Focused Preparation</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "1.05rem", lineHeight: 1.74, marginBottom: "32px" }}>
              CivilEzy&apos;s B.Tech/AE course is Kerala&apos;s most complete KWA AE preparation. 70,000+ questions, 1,500+ mock tests, Malayalam audio, and Rank Booster lessons — all in one platform.
            </p>
            <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/courses/btech" style={{ background: "linear-gradient(135deg, #FF6200, #FF8534)", color: "#fff", padding: "14px 34px", borderRadius: "10px", fontWeight: 700, fontSize: "1rem", textDecoration: "none", fontFamily: "Rajdhani, sans-serif", display: "inline-block" }}>
                View AE Course →
              </Link>
              <Link href="/game-arena" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", padding: "14px 34px", borderRadius: "10px", fontWeight: 600, fontSize: "1rem", textDecoration: "none", display: "inline-block" }}>
                Try Free Mock Test
              </Link>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "64px 5% 0" }}>

          {/* Features */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", marginBottom: "64px" }}>
            {FEATURES.map((f) => (
              <div key={f.title} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px 20px" }}>
                <div style={{ fontSize: "1.6rem", marginBottom: "12px" }}>{f.icon}</div>
                <h2 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>{f.title}</h2>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.58)", lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Subjects covered */}
          <div style={{ background: "rgba(255,98,0,0.06)", border: "1px solid rgba(255,98,0,0.2)", borderRadius: "18px", padding: "36px 32px", marginBottom: "48px" }}>
            <h2 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1.5rem", fontWeight: 700, color: "#fff", marginBottom: "20px", textAlign: "center" }}>
              KWA AE Syllabus — Subjects Covered
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
              {TOPICS.map((t) => (
                <span key={t} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "100px", padding: "6px 16px", fontSize: "13px", color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>{t}</span>
              ))}
            </div>
          </div>

          {/* Internal link CTAs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
            {[
              { href: "/courses/btech", label: "B.Tech / AE Course", desc: "Full AE-level prep", color: "#32C864" },
              { href: "/courses",       label: "All Courses",        desc: "Compare all levels",  color: "#FF8534" },
              { href: "/game-arena",    label: "Game Arena",         desc: "Free mock test",      color: "#4C9BF0" },
              { href: "/pricing",       label: "Pricing",            desc: "From ₹2,500/mo",      color: "#A855F7" },
            ].map((item) => (
              <Link key={item.href} href={item.href} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "20px", textDecoration: "none", display: "block" }}>
                <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1rem", fontWeight: 700, color: item.color, marginBottom: "4px" }}>{item.label} →</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)" }}>{item.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

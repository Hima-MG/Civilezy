import type { Metadata } from "next";
import Link from "next/link";
import { COURSES } from "@/data/courseData";

export const metadata: Metadata = {
  title: { absolute: "Kerala PSC Civil Engineering Courses | Civilezy" },
  description:
    "All Kerala PSC Civil Engineering preparation courses — ITI, Diploma, B.Tech/AE and Surveyor. Malayalam audio lessons, live classes, mock tests and Game Arena. Powered by Wincentre (4.8⭐, 1000+ selections).",
  keywords: [
    "kerala psc civil engineering course",
    "civil psc coaching kerala",
    "iti civil psc course",
    "diploma civil psc kerala",
    "ae civil psc preparation",
    "surveyor psc kerala",
    "psc civil engineering mock test",
    "wincentre civil coaching",
    "civil engineering psc malayalam",
  ],
  alternates: { canonical: "https://civilezy.in/courses" },
  openGraph: {
    title: "Kerala PSC Civil Engineering Courses | Civilezy",
    description:
      "ITI, Diploma, B.Tech/AE and Surveyor — all Kerala PSC Civil Engineering courses in one place. Malayalam-first, exam-focused, powered by Wincentre.",
    url: "https://civilezy.in/courses",
    siteName: "CivilEzy",
    type: "website",
    locale: "en_IN",
    images: [{ url: "https://civilezy.in/civilezy_logo_orange.png", width: 1200, height: 630, alt: "Civilezy Courses" }],
  },
  robots: { index: true, follow: true },
};

const COURSE_LIST = [
  {
    key:       "iti",
    emoji:     "🔧",
    title:     "Civil PSC — ITI",
    badge:     "ITI Level",
    pools:     ["KWA", "PWD", "LSGD", "Irrigation"],
    desc:      "Full-syllabus preparation for Overseer Gr II, Draughtsman, and all ITI-grade Kerala PSC posts. LIVE classes Mon–Fri.",
    price:     "₹1,800/mo",
    color:     "#FF8534",
    bg:        "rgba(255,133,52,0.08)",
    border:    "rgba(255,133,52,0.2)",
  },
  {
    key:       "diploma",
    emoji:     "📐",
    title:     "Civil PSC — Diploma",
    badge:     "Diploma Level",
    pools:     ["PWD", "Irrigation", "LSGD", "KWA", "Harbour"],
    desc:      "Structured preparation for Overseer Gr I, Site Engineer and all Diploma-grade posts across Kerala departments.",
    price:     "₹2,000/mo",
    color:     "#4C9BF0",
    bg:        "rgba(76,155,240,0.08)",
    border:    "rgba(76,155,240,0.2)",
  },
  {
    key:       "btech",
    emoji:     "🏗️",
    title:     "Civil PSC — B.Tech / AE",
    badge:     "AE Level",
    pools:     ["PWD", "Irrigation", "LSGD", "KWA", "PCB"],
    desc:      "AE-level preparation for B.Tech Civil graduates. Rank Booster lessons, 1,500+ mock tests, advanced concept clarity.",
    price:     "₹2,500/mo",
    color:     "#32C864",
    bg:        "rgba(50,200,100,0.08)",
    border:    "rgba(50,200,100,0.2)",
  },
  {
    key:       "surveyor",
    emoji:     "📏",
    title:     "Civil PSC — Surveyor",
    badge:     "Surveyor Level",
    pools:     ["KWA", "Survey & Land Records", "Tech Education", "Groundwater"],
    desc:      "Kerala's only dedicated Surveyor PSC course. GPS, Total Station, Land Acts, AutoCAD and complete field survey topics.",
    price:     "₹1,800/mo",
    color:     "#A855F7",
    bg:        "rgba(168,85,247,0.08)",
    border:    "rgba(168,85,247,0.2)",
  },
] as const;

const schema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Kerala PSC Civil Engineering Courses",
  url: "https://civilezy.in/courses",
  numberOfItems: 4,
  itemListElement: COURSE_LIST.map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: `https://civilezy.in/courses/${c.key}`,
    name: c.title,
  })),
};

export default function CoursesPage() {
  const stats = [
    { value: "5,200+",  label: "Active Students"  },
    { value: "1,000+",  label: "Govt Selections"  },
    { value: "4.8★",    label: "Average Rating"   },
    { value: "150,000+",label: "Practice Questions"},
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <main style={{ background: "var(--navy)", color: "#fff", minHeight: "100vh", paddingBottom: "80px" }}>

        {/* ─── Hero ─────────────────────────────────────────── */}
        <div style={{ background: "linear-gradient(160deg, #040C18 0%, #0B1E3D 100%)", padding: "90px 5% 64px", textAlign: "center" }}>
          <div style={{ maxWidth: "720px", margin: "0 auto" }}>
            <span style={{ display: "inline-block", background: "rgba(255,98,0,0.12)", border: "1px solid rgba(255,98,0,0.25)", borderRadius: "100px", padding: "4px 16px", fontSize: "12px", fontWeight: 700, color: "#FF8534", marginBottom: "20px", letterSpacing: "0.4px" }}>
              Powered by Wincentre · 4.8⭐ · 445+ Reviews
            </span>
            <h1 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 700, lineHeight: 1.15, marginBottom: "18px" }}>
              All Kerala PSC{" "}
              <span style={{ color: "#FF6200" }}>Civil Engineering</span>{" "}
              Courses
            </h1>
            <p style={{ color: "rgba(255,255,255,0.62)", fontSize: "1.05rem", lineHeight: 1.74, marginBottom: "36px" }}>
              ITI · Diploma · B.Tech/AE · Surveyor — one platform, four structured paths. Malayalam-first, exam-focused, results-proven.
            </p>

            {/* Stats row */}
            <div style={{ display: "flex", gap: "32px", justifyContent: "center", flexWrap: "wrap" }}>
              {stats.map((s) => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1.6rem", fontWeight: 700, color: "#FF8534" }}>{s.value}</div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", marginTop: "2px" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Course Cards ───────────────────────────────────── */}
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "64px 5% 0" }}>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(480px, 1fr))", gap: "24px" }} className="courses-grid">
            {COURSE_LIST.map((course) => (
              <Link
                key={course.key}
                href={`/courses/${course.key}`}
                className="course-card-link"
                style={{
                  display:        "flex",
                  flexDirection:  "column",
                  background:     course.bg,
                  border:         `1px solid ${course.border}`,
                  borderRadius:   "20px",
                  padding:        "32px 28px",
                  textDecoration: "none",
                  transition:     "border-color 0.2s, transform 0.2s",
                }}
              >
                {/* Header */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "20px" }}>
                  <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: `rgba(255,255,255,0.06)`, border: `1px solid ${course.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem", flexShrink: 0 }}>
                    {course.emoji}
                  </div>
                  <div>
                    <span style={{ display: "inline-block", background: `rgba(255,255,255,0.07)`, border: `1px solid ${course.border}`, borderRadius: "100px", padding: "3px 12px", fontSize: "11px", fontWeight: 700, color: course.color, marginBottom: "6px" }}>
                      {course.badge}
                    </span>
                    <h2 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1.4rem", fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1.2 }}>
                      {course.title}
                    </h2>
                  </div>
                </div>

                {/* Description */}
                <p style={{ fontSize: "0.92rem", color: "rgba(255,255,255,0.62)", lineHeight: 1.72, marginBottom: "20px", flex: 1 }}>
                  {course.desc}
                </p>

                {/* Pools */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "24px" }}>
                  {course.pools.map((p) => (
                    <span key={p} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "100px", padding: "3px 11px", fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
                      {p}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${course.border}`, paddingTop: "18px" }}>
                  <span style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1.1rem", fontWeight: 700, color: course.color }}>
                    {course.price}
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: course.color, display: "flex", alignItems: "center", gap: "5px" }}>
                    View Course →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* ─── Bottom CTA ──────────────────────────────────── */}
          <div style={{ marginTop: "64px", background: "linear-gradient(135deg, rgba(255,98,0,0.1), rgba(255,98,0,0.05))", border: "1px solid rgba(255,98,0,0.2)", borderRadius: "20px", padding: "48px 40px", textAlign: "center" }}>
            <div style={{ fontSize: "2.2rem", marginBottom: "14px" }}>🎮</div>
            <h2 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 700, marginBottom: "14px" }}>
              Try Before You Enroll
            </h2>
            <p style={{ color: "rgba(255,255,255,0.62)", fontSize: "1rem", lineHeight: 1.72, maxWidth: "520px", margin: "0 auto 28px" }}>
              Practise real Kerala PSC civil engineering questions in our free Game Arena — timed, scored, with a live leaderboard.
            </p>
            <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/game-arena" style={{ display: "inline-block", background: "linear-gradient(135deg, #FF6200, #FF8534)", color: "#fff", padding: "14px 34px", borderRadius: "10px", fontWeight: 700, fontSize: "1rem", textDecoration: "none", fontFamily: "Rajdhani, sans-serif" }}>
                Enter Game Arena →
              </Link>
              <Link href="/pricing" style={{ display: "inline-block", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", padding: "14px 34px", borderRadius: "10px", fontWeight: 600, fontSize: "1rem", textDecoration: "none" }}>
                See Pricing
              </Link>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .courses-grid { }
        .course-card-link:hover { border-color: rgba(255,255,255,0.25) !important; transform: translateY(-3px); }
        @media (max-width: 640px) {
          .courses-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}

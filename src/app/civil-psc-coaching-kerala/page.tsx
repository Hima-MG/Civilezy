import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { testimonials } from "@/data/testimonials";

export const metadata: Metadata = {
  title: { absolute: "Best Civil Engineering PSC Coaching in Kerala | Civilezy" },
  description:
    "Practice Kerala PSC civil engineering questions, track your rank, and improve accuracy with Civilezy powered by Wincentre (4.8⭐, 445+ reviews).",
  keywords: [
    "best civil psc coaching kerala",
    "kerala psc civil engineering coaching",
    "civil psc mock test kerala",
    "psc civil questions kerala",
    "best civil engineering psc coaching kerala",
    "civil engineering psc preparation kerala",
    "wincentre psc coaching thrissur",
    "kerala psc civil AE coaching online",
    "PSC civil engineering mock test",
    "KWA AE preparation kerala",
    "PWD overseer coaching kerala",
  ],
  alternates: {
    canonical: "https://civilezy.in/civil-psc-coaching-kerala",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://civilezy.in/civil-psc-coaching-kerala",
    siteName: "CivilEzy",
    title: "Best Civil Engineering PSC Coaching in Kerala | Civilezy",
    description:
      "Practice Kerala PSC civil engineering questions, track your rank, and improve accuracy with Civilezy powered by Wincentre (4.8⭐, 445+ reviews).",
    images: [{ url: "https://civilezy.in/civilezy_logo_orange.png", width: 1200, height: 630, alt: "Civilezy – Best Civil PSC Coaching Kerala" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Civil Engineering PSC Coaching in Kerala | Civilezy",
    description:
      "Practice Kerala PSC civil engineering questions, track your rank, and improve accuracy with Civilezy powered by Wincentre (4.8⭐, 445+ reviews).",
    images: ["https://civilezy.in/civilezy_logo_orange.png"],
  },
};

const schemaOrg = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["LocalBusiness", "EducationalOrganization"],
      "@id": "https://civilezy.in/#organization",
      name: "CivilEzy by Wincentre",
      alternateName: "Wincentre PSC Coaching",
      url: "https://civilezy.in",
      logo: "https://civilezy.in/civilezy_logo_orange.png",
      image: "https://civilezy.in/civilezy_logo_orange.png",
      description:
        "Kerala's best Civil Engineering PSC coaching platform powered by Wincentre, Thrissur. Rated 4.8 stars with 445+ reviews. 1000+ government job selections.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Thrissur",
        addressRegion: "Kerala",
        addressCountry: "IN",
      },
      telephone: "+919074557825",
      email: "support@civilezy.in",
      sameAs: [
        "https://www.youtube.com/@CivilEzy-youtube",
        "https://www.instagram.com/civilezy_by_wincentre",
        "https://www.facebook.com",
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        reviewCount: "445",
        bestRating: "5",
        worstRating: "1",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Kerala PSC Civil Engineering Courses",
        itemListElement: [
          { "@type": "Course", name: "Civil PSC – ITI Category", provider: { "@type": "Organization", name: "CivilEzy" } },
          { "@type": "Course", name: "Civil PSC – Diploma Category", provider: { "@type": "Organization", name: "CivilEzy" } },
          { "@type": "Course", name: "Civil PSC – B.Tech / AE Category", provider: { "@type": "Organization", name: "CivilEzy" } },
          { "@type": "Course", name: "Civil PSC – Surveyor", provider: { "@type": "Organization", name: "CivilEzy" } },
        ],
      },
      priceRange: "₹₹",
    },
    {
      "@type": "WebPage",
      "@id": "https://civilezy.in/civil-psc-coaching-kerala",
      url: "https://civilezy.in/civil-psc-coaching-kerala",
      name: "Best Civil Engineering PSC Coaching in Kerala | CivilEzy",
      isPartOf: { "@id": "https://civilezy.in/#organization" },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://civilezy.in" },
          { "@type": "ListItem", position: 2, name: "Civil PSC Coaching Kerala", item: "https://civilezy.in/civil-psc-coaching-kerala" },
        ],
      },
    },
  ],
};

const WHY_ITEMS = [
  {
    icon: "🎯",
    title: "Category-Based Mock Tests",
    desc: "Practice exactly like the real exam – ITI, Diploma, B.Tech & Surveyor question sets tailored for each Kerala PSC category.",
  },
  {
    icon: "🏆",
    title: "Live Leaderboard & Ranking",
    desc: "Compete with aspirants across Kerala. Weekly and monthly rankings to keep you sharp, accountable, and motivated.",
  },
  {
    icon: "🎮",
    title: "Game Arena",
    desc: "Kerala's first PSC Game Arena – gamified MCQ battles that make civil engineering practice addictive, not boring.",
  },
  {
    icon: "🔊",
    title: "Malayalam Audio Lessons",
    desc: "Understand complex civil engineering concepts in your mother tongue. No language barrier, maximum clarity.",
  },
  {
    icon: "📱",
    title: "App + Web Platform",
    desc: "Study anytime, anywhere on Android, iOS, or browser. Your progress syncs seamlessly across all devices.",
  },
  {
    icon: "👨‍🏫",
    title: "Expert Faculty – Santhosh Sir",
    desc: "Powered by Wincentre's Santhosh Sir – the man behind 1000+ government job selections in Kerala civil engineering.",
  },
];

const STATS = [
  { value: "1000+", label: "Govt. Jobs Secured" },
  { value: "4.8⭐", label: "Average Rating" },
  { value: "445+", label: "Student Reviews" },
  { value: "15+", label: "Years of Experience" },
];

const FEATURED = testimonials.filter((t) => t.text.length > 150).slice(0, 3);

const LEADERBOARD_PREVIEW = [
  { rank: "🥇", name: "Arjun K.", score: "9,840 XP", dept: "B.Tech" },
  { rank: "🥈", name: "Priya M.", score: "8,720 XP", dept: "Diploma" },
  { rank: "🥉", name: "Rahul S.", score: "7,960 XP", dept: "ITI" },
  { rank: "4", name: "Sneha T.", score: "7,450 XP", dept: "Surveyor" },
  { rank: "5", name: "Ajay V.", score: "6,900 XP", dept: "B.Tech" },
];

const COURSE_CARDS = [
  {
    key:     "iti",
    href:    "/courses/iti",
    emoji:   "🔧",
    title:   "Civil PSC – ITI",
    desc:    "For Overseer / Draughtsman Gr 2 & 3, Tradesman, Tracer, Work Superintendent across KWA, PWD, LSGD & Irrigation.",
    pools:   ["KWA", "PWD", "LSGD", "Irrigation"],
    price:   1800,
    popular: false,
  },
  {
    key:     "diploma",
    href:    "/courses/diploma",
    emoji:   "📐",
    title:   "Civil PSC – Diploma",
    desc:    "For Overseer Gr 1/2/3, Junior Instructor, Site Engineer across PWD, Irrigation, LSGD, KWA, Harbour & KSEB.",
    pools:   ["PWD", "Irrigation", "LSGD", "KWA", "Harbour"],
    price:   2000,
    popular: true,
  },
  {
    key:     "btech",
    href:    "/courses/btech",
    emoji:   "🎓",
    title:   "Civil PSC – B.Tech",
    desc:    "For B.Tech Civil graduates targeting Assistant Engineer (AE) posts in PWD, Irrigation, LSGD, KWA & PCB.",
    pools:   ["PWD", "Irrigation", "LSGD", "KWA", "PCB"],
    price:   2500,
    popular: false,
  },
  {
    key:     "surveyor",
    href:    "/courses/surveyor",
    emoji:   "📏",
    title:   "Surveyor Course",
    desc:    "For ITI Surveyor license holders targeting Surveyor Gr II & related posts in KWA, Survey & Land Records, and Groundwater Dept.",
    pools:   ["KWA", "Survey & Land Records", "Groundwater"],
    price:   1800,
    popular: false,
  },
] as const;

const BLOG_POSTS = [
  {
    href: "/blog/how-to-crack-kerala-psc-civil-engineering",
    title: "How to Crack Kerala PSC Civil Engineering Exam",
    desc: "Complete roadmap from syllabus to rank – what to study, how to study, and what to avoid.",
    tag: "Strategy",
  },
  {
    href: "/blog/top-100-psc-civil-questions-kerala",
    title: "Top 100 PSC Civil Engineering Questions (with Answers)",
    desc: "Most repeated and high-weightage MCQs from past Kerala PSC civil engineering exams.",
    tag: "Practice",
  },
  {
    href: "/blog/best-books-civil-psc-kerala",
    title: "Best Books for Civil PSC Kerala (All Categories)",
    desc: "Curated booklist for ITI, Diploma, B.Tech & Surveyor PSC civil engineering preparation.",
    tag: "Resources",
  },
];

export default function CivilPSCCoachingKeralaPage() {
  return (
    <>
      <Script
        id="schema-civil-psc"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />

      <main style={{ background: "var(--navy)", color: "#fff", minHeight: "100vh" }}>

        {/* ─── HERO ──────────────────────────────────────────────────────────── */}
        <section
          aria-label="Hero – Best Civil Engineering PSC Coaching Kerala"
          style={{
            padding: "80px 5% 70px",
            background: "linear-gradient(160deg, #040C18 0%, #0B1E3D 55%, #0F2750 100%)",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(ellipse at 50% -10%, rgba(255,98,0,0.14) 0%, transparent 65%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ maxWidth: "860px", margin: "0 auto", position: "relative" }}>
            {/* Rating badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,98,0,0.12)", border: "1px solid rgba(255,98,0,0.3)", borderRadius: "100px", padding: "6px 18px", marginBottom: "28px" }}>
              <span aria-hidden="true">⭐</span>
              <span style={{ fontSize: "14px", fontWeight: 600, color: "#FF8534" }}>
                Powered by Wincentre – 4.8⭐ · 445+ Reviews · Thrissur, Kerala
              </span>
            </div>

            <h1 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "clamp(2rem, 5.5vw, 3.8rem)", fontWeight: 700, lineHeight: 1.12, marginBottom: "22px", color: "#fff" }}>
              Best Civil Engineering PSC{" "}
              <span style={{ color: "#FF6200" }}>Coaching in Kerala</span>
            </h1>

            <p style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", color: "rgba(255,255,255,0.72)", lineHeight: 1.75, marginBottom: "40px", maxWidth: "680px", margin: "0 auto 40px" }}>
              Kerala&apos;s #1 platform for Civil Engineering PSC preparation. Smart mock tests, Game Arena, live leaderboards, and expert content built by Wincentre – all in one place.
            </p>

            {/* Stats */}
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "40px", marginBottom: "44px" }}>
              {STATS.map((s) => (
                <div key={s.label}>
                  <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "2.2rem", fontWeight: 700, color: "#FF6200", lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", marginTop: "5px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/game-arena"
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "linear-gradient(135deg, #FF6200, #FF8534)", color: "#fff", padding: "16px 38px", borderRadius: "12px", fontWeight: 700, fontSize: "1.05rem", textDecoration: "none", fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.3px", boxShadow: "0 8px 28px rgba(255,98,0,0.4)" }}
              >
                🎮 Start Practice
              </Link>
              <Link
                href="/pricing"
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.18)", color: "#fff", padding: "16px 38px", borderRadius: "12px", fontWeight: 600, fontSize: "1.05rem", textDecoration: "none" }}
              >
                Explore Courses →
              </Link>
            </div>
          </div>
        </section>

        {/* ─── TRUST SECTION ─────────────────────────────────────────────────── */}
        <section
          aria-label="Trust signals – Powered by Wincentre"
          style={{ background: "linear-gradient(135deg,#1A0800,#120500)", borderTop: "1px solid rgba(255,98,0,0.2)", borderBottom: "1px solid rgba(255,98,0,0.2)", padding: "40px 5%" }}
        >
          <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: "48px" }}>
            {/* Powered by Wincentre */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "linear-gradient(135deg,#FF6200,#FF4500)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }} aria-hidden="true">🏛️</div>
              <div>
                <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "16px", fontWeight: 700, color: "#fff" }}>Powered by Wincentre</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginTop: "2px" }}>Kerala's pioneer in Civil PSC coaching — Thrissur</div>
              </div>
            </div>

            <div style={{ width: "1px", height: "44px", background: "rgba(255,255,255,0.1)" }} aria-hidden="true" className="trust-divider" />

            {/* Rating */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "36px", fontWeight: 700, background: "linear-gradient(135deg,#FF6200,#FFB800)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", lineHeight: 1 }}>4.8</div>
                <div style={{ display: "flex", gap: "2px", justifyContent: "center", marginTop: "4px" }} aria-label="4.8 out of 5 stars">
                  {[1,2,3,4,5].map(s => <span key={s} aria-hidden="true" style={{ color: "#FFB800", fontSize: "14px" }}>★</span>)}
                </div>
              </div>
              <div>
                <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "16px", fontWeight: 700, color: "#fff" }}>Rated 4.8 / 5</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginTop: "2px" }}>445+ verified student reviews</div>
              </div>
            </div>

            <div style={{ width: "1px", height: "44px", background: "rgba(255,255,255,0.1)" }} aria-hidden="true" className="trust-divider" />

            {/* Track record */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(50,200,100,0.12)", border: "1px solid rgba(50,200,100,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }} aria-hidden="true">🏆</div>
              <div>
                <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "16px", fontWeight: 700, color: "#fff" }}>1000+ Govt. Jobs</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginTop: "2px" }}>Students placed across Kerala departments</div>
              </div>
            </div>

            <div style={{ width: "1px", height: "44px", background: "rgba(255,255,255,0.1)" }} aria-hidden="true" className="trust-divider" />

            {/* Experience */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(100,200,255,0.1)", border: "1px solid rgba(100,200,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }} aria-hidden="true">📅</div>
              <div>
                <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "16px", fontWeight: 700, color: "#fff" }}>15+ Years</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginTop: "2px" }}>Proven track record in PSC coaching</div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── COURSES SECTION ────────────────────────────────────────────────── */}
        <section aria-labelledby="courses-heading" style={{ padding: "84px 5%", background: "#091729" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "52px" }}>
              <div style={{ display: "inline-block", background: "rgba(255,98,0,0.12)", border: "1px solid rgba(255,98,0,0.3)", borderRadius: "100px", padding: "5px 18px", fontSize: "13px", fontWeight: 700, color: "#FF8534", marginBottom: "16px" }}>
                All Courses
              </div>
              <h2 id="courses-heading" style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.9rem)", fontWeight: 700, color: "#fff" }}>
                Choose Your <span style={{ background: "linear-gradient(135deg,#FF6200,#FFB800)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>PSC Category</span>
              </h2>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "1rem", marginTop: "14px", maxWidth: "520px", margin: "14px auto 0" }}>
                Every Kerala PSC Civil Engineering category covered — structured, syllabus-mapped, and exam-ready.
              </p>
            </div>

            <div className="courses-grid">
              {COURSE_CARDS.map((c) => (
                <Link
                  key={c.key}
                  href={c.href}
                  style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${c.popular ? "rgba(255,98,0,0.4)" : "rgba(255,255,255,0.08)"}`, borderRadius: "20px", padding: "32px 26px", textDecoration: "none", display: "flex", flexDirection: "column", gap: "0", position: "relative", transition: "border-color 0.2s, transform 0.2s", boxShadow: c.popular ? "0 0 30px rgba(255,98,0,0.1)" : "none" }}
                >
                  {c.popular && (
                    <div style={{ position: "absolute", top: "-13px", left: "50%", transform: "translateX(-50%)", background: "linear-gradient(90deg,#FF6200,#FF8534)", color: "#fff", fontSize: "11px", fontWeight: 800, padding: "4px 18px", borderRadius: "100px", whiteSpace: "nowrap", boxShadow: "0 4px 12px rgba(255,98,0,0.4)" }} aria-hidden="true">
                      ⭐ MOST POPULAR
                    </div>
                  )}
                  <div style={{ fontSize: "2.6rem", marginBottom: "16px" }}>{c.emoji}</div>
                  <h3 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1.3rem", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>{c.title}</h3>
                  <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.65, marginBottom: "18px", flex: 1 }}>{c.desc}</p>
                  {/* Pools */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
                    {c.pools.map(p => (
                      <span key={p} style={{ background: "rgba(255,98,0,0.1)", border: "1px solid rgba(255,98,0,0.22)", borderRadius: "100px", padding: "3px 10px", fontSize: "11px", fontWeight: 700, color: "#FF8534" }}>{p}</span>
                    ))}
                  </div>
                  {/* Price */}
                  <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "18px" }}>
                    <span style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1.6rem", fontWeight: 700, background: "linear-gradient(135deg,#FF6200,#FFB800)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>₹{c.price.toLocaleString("en-IN")}</span>
                    <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>/month</span>
                  </div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#FF8534", fontSize: "14px", fontWeight: 700 }}>
                    Know More <span aria-hidden="true">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── WHY CIVILEZY ──────────────────────────────────────────────────── */}
        <section aria-labelledby="why-heading" style={{ padding: "84px 5%" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "56px" }}>
              <h2 id="why-heading" style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.9rem)", fontWeight: 700, color: "#fff" }}>
                Why CivilEzy is <span style={{ color: "#FF6200" }}>Different</span>
              </h2>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "1.05rem", marginTop: "14px", maxWidth: "580px", margin: "14px auto 0" }}>
                Not just another coaching platform. CivilEzy is engineered specifically for Kerala PSC Civil Engineering aspirants.
              </p>
            </div>

            <div className="why-grid">
              {WHY_ITEMS.map((item) => (
                <div
                  key={item.title}
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px", padding: "30px 26px" }}
                >
                  <div style={{ fontSize: "2.6rem", marginBottom: "16px" }}>{item.icon}</div>
                  <h3 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>{item.title}</h3>
                  <p style={{ fontSize: "0.93rem", color: "rgba(255,255,255,0.58)", lineHeight: 1.75 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── GAME ARENA + LEADERBOARD ──────────────────────────────────────── */}
        <section
          aria-labelledby="arena-heading"
          style={{ background: "linear-gradient(135deg, #0F2750, #162E5C)", padding: "84px 5%" }}
        >
          <div style={{ maxWidth: "1100px", margin: "0 auto" }} className="arena-grid">
            {/* Left – copy */}
            <div>
              <div style={{ display: "inline-block", background: "rgba(255,98,0,0.14)", border: "1px solid rgba(255,98,0,0.3)", borderRadius: "100px", padding: "5px 16px", fontSize: "13px", fontWeight: 600, color: "#FF8534", marginBottom: "20px" }}>
                🎮 Practice Game Arena
              </div>
              <h2 id="arena-heading" style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "clamp(1.8rem, 3.8vw, 2.7rem)", fontWeight: 700, color: "#fff", lineHeight: 1.18, marginBottom: "18px" }}>
                Kerala&apos;s First PSC{" "}
                <span style={{ color: "#FF6200" }}>Practice Game Arena</span>
              </h2>
              <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.62)", lineHeight: 1.82, marginBottom: "28px" }}>
                Turn your PSC preparation into an exciting challenge. Answer civil engineering MCQs, earn XP points, climb the leaderboard, and compete with aspirants across Kerala – all for free.
              </p>
              <ul style={{ listStyle: "none", padding: 0, marginBottom: "34px", display: "flex", flexDirection: "column", gap: "13px" }}>
                {[
                  "Timed MCQ sessions – real exam simulation",
                  "XP points and rank progression system",
                  "Category-wise: ITI, Diploma, B.Tech, Surveyor",
                  "Weekly leaderboard reset – always competitive",
                ].map((f) => (
                  <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "0.95rem", color: "rgba(255,255,255,0.75)" }}>
                    <span style={{ color: "#FF6200", fontWeight: 700, marginTop: "2px" }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/game-arena"
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "linear-gradient(135deg, #FF6200, #FF8534)", color: "#fff", padding: "14px 34px", borderRadius: "10px", fontWeight: 700, fontSize: "1rem", textDecoration: "none", fontFamily: "Rajdhani, sans-serif", boxShadow: "0 6px 22px rgba(255,98,0,0.4)" }}
              >
                🚀 Enter Game Arena
              </Link>
            </div>

            {/* Right – leaderboard card */}
            <div style={{ background: "rgba(11,30,61,0.85)", border: "1px solid rgba(255,98,0,0.18)", borderRadius: "22px", padding: "30px", boxShadow: "0 24px 64px rgba(0,0,0,0.45)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <span aria-hidden="true" style={{ fontSize: "1.4rem" }}>🏆</span>
                <h3 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "#fff", margin: 0 }}>Live Leaderboard</h3>
                <span style={{ marginLeft: "auto", fontSize: "11px", color: "#FF8534", background: "rgba(255,98,0,0.1)", padding: "3px 10px", borderRadius: "100px", border: "1px solid rgba(255,98,0,0.25)", fontWeight: 700 }}>WEEKLY</span>
              </div>
              {LEADERBOARD_PREVIEW.map((entry, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: "13px", padding: "11px 0", borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
                >
                  <span style={{ fontSize: i < 3 ? "1.25rem" : "0.85rem", minWidth: "26px", textAlign: "center", fontWeight: 700, color: i >= 3 ? "rgba(255,255,255,0.4)" : undefined }}>{entry.rank}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#fff" }}>{entry.name}</div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>{entry.dept}</div>
                  </div>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#FF6200" }}>{entry.score}</span>
                </div>
              ))}
              <div style={{ marginTop: "18px", textAlign: "center" }}>
                <Link href="/game-arena" style={{ fontSize: "13px", color: "#FF8534", textDecoration: "none", fontWeight: 700 }}>
                  View full leaderboard →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── TESTIMONIALS ──────────────────────────────────────────────────── */}
        <section aria-labelledby="testimonials-heading" style={{ padding: "84px 5%" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "56px" }}>
              <h2 id="testimonials-heading" style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.9rem)", fontWeight: 700, color: "#fff" }}>
                Students Who{" "}
                <span style={{ color: "#FF6200" }}>Cracked the PSC</span>
              </h2>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "1rem", marginTop: "14px" }}>
                Real government job holders. Real results. Powered by Wincentre – 4.8⭐, 445+ reviews.
              </p>
            </div>

            <div className="testi-grid">
              {FEATURED.map((t) => (
                <div
                  key={t.name}
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px", padding: "30px 26px", display: "flex", flexDirection: "column" }}
                >
                  <div style={{ display: "flex", gap: "3px", marginBottom: "18px" }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} aria-hidden="true" style={{ color: "#FFB800", fontSize: "1.1rem" }}>★</span>
                    ))}
                  </div>
                  <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.68)", lineHeight: 1.78, flex: 1, display: "-webkit-box", WebkitLineClamp: 6, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                    <div style={{ fontWeight: 700, color: "#fff", fontSize: "0.95rem" }}>{t.name}</div>
                    <div style={{ fontSize: "13px", color: "#FF8534", marginTop: "4px" }}>{t.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── YOUTUBE + SOCIAL ──────────────────────────────────────────────── */}
        <section
          aria-labelledby="yt-heading"
          style={{ padding: "80px 5%", background: "linear-gradient(160deg, #0F2750 0%, #040C18 100%)" }}
        >
          <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
            <h2 id="yt-heading" style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "clamp(1.7rem, 3.8vw, 2.5rem)", fontWeight: 700, color: "#fff", marginBottom: "14px" }}>
              Watch Free <span style={{ color: "#FF6200" }}>PSC Civil Lessons</span>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.58)", marginBottom: "36px", fontSize: "1rem", maxWidth: "600px", margin: "0 auto 36px" }}>
              Subscribe to our YouTube channel for free civil engineering PSC tutorials, exam analysis, and proven preparation strategies.
            </p>
            <div style={{ borderRadius: "18px", overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.55)", marginBottom: "28px", aspectRatio: "16/9" }}>
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed?listType=user_uploads&list=CivilEzy-youtube&rel=0"
                title="CivilEzy – Free Kerala PSC Civil Engineering Lessons"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                style={{ border: "none", display: "block", width: "100%", height: "100%" }}
              />
            </div>

            {/* Social buttons */}
            <div style={{ display: "flex", justifyContent: "center", gap: "14px", flexWrap: "wrap" }}>
              <a
                href="https://www.youtube.com/@CivilEzy-youtube"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="CivilEzy YouTube channel"
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#FF0000", color: "#fff", padding: "12px 26px", borderRadius: "10px", fontWeight: 700, fontSize: "0.93rem", textDecoration: "none" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                Subscribe on YouTube
              </a>
              <a
                href="https://www.instagram.com/civilezy_by_wincentre"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="CivilEzy Instagram"
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)", color: "#fff", padding: "12px 26px", borderRadius: "10px", fontWeight: 700, fontSize: "0.93rem", textDecoration: "none" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                Follow on Instagram
              </a>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="CivilEzy Facebook"
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#1877F2", color: "#fff", padding: "12px 26px", borderRadius: "10px", fontWeight: 700, fontSize: "0.93rem", textDecoration: "none" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
              </a>
            </div>
          </div>
        </section>

        {/* ─── BLOG RESOURCES ────────────────────────────────────────────────── */}
        <section aria-labelledby="blog-heading" style={{ padding: "84px 5%" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "52px" }}>
              <h2 id="blog-heading" style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.9rem)", fontWeight: 700, color: "#fff" }}>
                Free <span style={{ color: "#FF6200" }}>Study Resources</span>
              </h2>
              <p style={{ color: "rgba(255,255,255,0.55)", marginTop: "14px" }}>
                Expert guides written for Kerala PSC Civil Engineering aspirants
              </p>
            </div>

            <div className="blog-grid">
              {BLOG_POSTS.map((post) => (
                <Link
                  key={post.href}
                  href={post.href}
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px", padding: "30px 26px", textDecoration: "none", display: "block", transition: "border-color 0.2s" }}
                >
                  <span style={{ display: "inline-block", background: "rgba(255,98,0,0.12)", border: "1px solid rgba(255,98,0,0.25)", borderRadius: "100px", padding: "4px 14px", fontSize: "12px", fontWeight: 600, color: "#FF8534", marginBottom: "16px" }}>
                    {post.tag}
                  </span>
                  <h3 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1.15rem", fontWeight: 700, color: "#fff", marginBottom: "10px", lineHeight: 1.32 }}>{post.title}</h3>
                  <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.58)", lineHeight: 1.68 }}>{post.desc}</p>
                  <div style={{ marginTop: "18px", fontSize: "13px", color: "#FF8534", fontWeight: 700 }}>Read article →</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FINAL CTA ─────────────────────────────────────────────────────── */}
        <section
          aria-labelledby="cta-heading"
          style={{ padding: "84px 5%", background: "linear-gradient(135deg, #FF6200 0%, #CC3D00 100%)", textAlign: "center" }}
        >
          <div style={{ maxWidth: "680px", margin: "0 auto" }}>
            <h2 id="cta-heading" style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "clamp(2rem, 4.5vw, 3.1rem)", fontWeight: 700, color: "#fff", lineHeight: 1.18, marginBottom: "18px" }}>
              Ready to Crack Your PSC Civil Exam?
            </h2>
            <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.88)", marginBottom: "38px", lineHeight: 1.72 }}>
              Join thousands of Kerala civil engineering aspirants already practicing on CivilEzy. Start for free with Game Arena today.
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/game-arena"
                style={{ background: "#fff", color: "#FF6200", padding: "17px 42px", borderRadius: "12px", fontWeight: 800, fontSize: "1.1rem", textDecoration: "none", fontFamily: "Rajdhani, sans-serif", boxShadow: "0 8px 28px rgba(0,0,0,0.25)" }}
              >
                🎮 Practice Now – Free
              </Link>
              <Link
                href="/pricing"
                style={{ background: "rgba(0,0,0,0.18)", color: "#fff", border: "2px solid rgba(255,255,255,0.45)", padding: "17px 42px", borderRadius: "12px", fontWeight: 700, fontSize: "1.1rem", textDecoration: "none", fontFamily: "Rajdhani, sans-serif" }}
              >
                View Course Plans
              </Link>
            </div>
          </div>
        </section>
      </main>

      <style>{`
        .why-grid     { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .arena-grid   { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
        .testi-grid   { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .blog-grid    { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .courses-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        @media (max-width: 1024px) {
          .why-grid     { grid-template-columns: repeat(2, 1fr); }
          .testi-grid   { grid-template-columns: repeat(2, 1fr); }
          .blog-grid    { grid-template-columns: repeat(2, 1fr); }
          .courses-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .arena-grid   { grid-template-columns: 1fr; gap: 40px; }
          .trust-divider { display: none; }
        }
        @media (max-width: 600px) {
          .why-grid     { grid-template-columns: 1fr; }
          .testi-grid   { grid-template-columns: 1fr; }
          .blog-grid    { grid-template-columns: 1fr; }
          .courses-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 400px) {
          .courses-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}

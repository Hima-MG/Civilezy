import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Top 100 PSC Civil Engineering Questions with Answers – Kerala",
  description:
    "Most repeated Kerala PSC Civil Engineering MCQs with answers. Covers Soil Mechanics, Structural Engineering, Fluid Mechanics, Surveying, Building Materials, and more. Essential practice for ITI, Diploma, B.Tech & AE aspirants.",
  keywords: [
    "top 100 psc civil engineering questions kerala",
    "kerala psc civil engineering mcq with answers",
    "psc civil engineering questions answers",
    "kerala psc civil previous year questions",
    "civil engineering psc mcq kerala",
  ],
  alternates: { canonical: "https://civilezy.in/blog/top-100-psc-civil-questions-kerala" },
  openGraph: {
    type: "article",
    locale: "en_IN",
    url: "https://civilezy.in/blog/top-100-psc-civil-questions-kerala",
    siteName: "CivilEzy",
    title: "Top 100 PSC Civil Engineering Questions with Answers – Kerala",
    description:
      "High-weightage Kerala PSC Civil Engineering MCQs with answers. Practice the most repeated questions across all technical subjects.",
  },
};

const schemaArticle = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Top 100 PSC Civil Engineering Questions with Answers – Kerala",
  description:
    "Most repeated Kerala PSC Civil Engineering MCQs with answers for ITI, Diploma, B.Tech, and AE categories.",
  author: { "@type": "Organization", name: "CivilEzy by Wincentre" },
  publisher: {
    "@type": "Organization",
    name: "CivilEzy",
    logo: { "@type": "ImageObject", url: "https://civilezy.in/civilezy_logo_orange.png" },
  },
  datePublished: "2025-02-01",
  dateModified: "2026-04-20",
  mainEntityOfPage: "https://civilezy.in/blog/top-100-psc-civil-questions-kerala",
};

type QA = { q: string; options: string[]; answer: string; explanation: string };

const QUESTION_SETS: { subject: string; icon: string; questions: QA[] }[] = [
  {
    subject: "Soil Mechanics & Foundation Engineering",
    icon: "🏗️",
    questions: [
      { q: "The ratio of volume of voids to total volume of soil is called:", options: ["A) Void ratio", "B) Porosity", "C) Degree of saturation", "D) Air content"], answer: "B) Porosity", explanation: "Porosity (n) = Vv/V. Void ratio (e) = Vv/Vs. Both are related by n = e/(1+e)." },
      { q: "Terzaghi's consolidation theory assumes that soil is:", options: ["A) Homogeneous and isotropic", "B) Completely saturated", "C) Singly drained", "D) Both A and B"], answer: "D) Both A and B", explanation: "Terzaghi's 1D consolidation theory assumes fully saturated, homogeneous, isotropic soil with Darcy's law valid." },
      { q: "Standard Penetration Test (SPT) N-value for very dense sand is:", options: ["A) < 4", "B) 4–10", "C) 30–50", "D) > 50"], answer: "D) > 50", explanation: "N > 50 indicates very dense sand or hard rock. N < 4 is very loose sand." },
      { q: "The angle of internal friction for loose sand is approximately:", options: ["A) 15°–20°", "B) 28°–34°", "C) 38°–45°", "D) 10°–15°"], answer: "B) 28°–34°", explanation: "Loose sand: 28°–34°. Dense sand: 35°–45°. Clay has very low friction angle but significant cohesion." },
      { q: "Which type of foundation is suitable for black cotton soil?", options: ["A) Raft foundation", "B) Strip foundation", "C) Under-reamed pile foundation", "D) Mat foundation"], answer: "C) Under-reamed pile foundation", explanation: "Under-reamed piles are recommended for black cotton (expansive) soils as the bulb anchors below the active zone of swelling." },
    ],
  },
  {
    subject: "Structural Engineering & RCC Design",
    icon: "🏛️",
    questions: [
      { q: "The modular ratio (m) in working stress method is:", options: ["A) Es/Ec", "B) Ec/Es", "C) 280/(3σcbc)", "D) Both A and C"], answer: "D) Both A and C", explanation: "Modular ratio m = Es/Ec = 280/(3σcbc) as per IS 456. For M20 concrete, m = 280/(3×7) ≈ 13.33." },
      { q: "In a simply supported beam, the bending moment is maximum at:", options: ["A) Supports", "B) Midspan (for UDL)", "C) Quarter span", "D) Three-quarter span"], answer: "B) Midspan (for UDL)", explanation: "For a simply supported beam with UDL, max BM = wL²/8 at midspan. For point load at centre, max BM = PL/4." },
      { q: "The minimum grade of concrete to be used in RCC as per IS 456 is:", options: ["A) M10", "B) M15", "C) M20", "D) M25"], answer: "C) M20", explanation: "IS 456:2000 specifies minimum M20 grade for RCC construction (M15 was the old requirement)." },
      { q: "In limit state design, the partial safety factor for steel (γs) is:", options: ["A) 1.0", "B) 1.15", "C) 1.25", "D) 1.5"], answer: "B) 1.15", explanation: "As per IS 456, γs = 1.15 for steel and γc = 1.5 for concrete in limit state design." },
      { q: "What is the effective depth of a beam if total depth = 500 mm, cover = 25 mm, and bar dia = 20 mm?", options: ["A) 465 mm", "B) 475 mm", "C) 455 mm", "D) 470 mm"], answer: "A) 465 mm", explanation: "Effective depth = Total depth – cover – half bar dia = 500 – 25 – 10 = 465 mm." },
    ],
  },
  {
    subject: "Fluid Mechanics & Hydraulics",
    icon: "💧",
    questions: [
      { q: "Bernoulli's equation is based on the principle of:", options: ["A) Conservation of mass", "B) Conservation of energy", "C) Conservation of momentum", "D) Newton's second law"], answer: "B) Conservation of energy", explanation: "Bernoulli's theorem states that total energy (pressure + kinetic + potential) remains constant along a streamline for ideal flow." },
      { q: "The coefficient of discharge (Cd) for a standard orifice is approximately:", options: ["A) 0.99", "B) 0.82", "C) 0.64", "D) 0.61"], answer: "D) 0.61", explanation: "For a sharp-edged orifice, Cd ≈ 0.61 = Cc × Cv (typically 0.64 × 0.97 ≈ 0.62, often taken as 0.61–0.64)." },
      { q: "Manning's roughness coefficient 'n' for a smooth concrete pipe is approximately:", options: ["A) 0.010–0.013", "B) 0.025–0.030", "C) 0.035–0.040", "D) 0.050–0.060"], answer: "A) 0.010–0.013", explanation: "Manning's n for smooth concrete: 0.011–0.013. Natural earth channel: 0.025–0.030. Gravel riverbed: 0.030–0.035." },
      { q: "Hydraulic jump occurs when flow changes from:", options: ["A) Sub-critical to super-critical", "B) Super-critical to sub-critical", "C) Laminar to turbulent", "D) Turbulent to laminar"], answer: "B) Super-critical to sub-critical", explanation: "A hydraulic jump is a rapidly varied flow transition from supercritical (Fr > 1) to subcritical (Fr < 1) with energy dissipation." },
      { q: "The unit of kinematic viscosity in SI system is:", options: ["A) Pa·s", "B) N·s/m²", "C) m²/s", "D) kg/m·s"], answer: "C) m²/s", explanation: "Kinematic viscosity (ν) = dynamic viscosity / density = μ/ρ. Units = (N·s/m²) / (kg/m³) = m²/s (or Stokes in CGS)." },
    ],
  },
  {
    subject: "Surveying",
    icon: "📐",
    questions: [
      { q: "The prismatic compass reads bearings in which system?", options: ["A) Whole circle bearing (WCB)", "B) Quadrantal bearing (QB)", "C) Reduced bearing", "D) True bearing only"], answer: "A) Whole circle bearing (WCB)", explanation: "Prismatic compass uses WCB (0°–360° clockwise from North). Surveyor's compass uses QB (Quadrantal or Reduced Bearing)." },
      { q: "In plane table surveying, which method is used when the station is inaccessible?", options: ["A) Radiation", "B) Intersection", "C) Traversing", "D) Resection"], answer: "B) Intersection", explanation: "Intersection (graphic triangulation) is used to plot inaccessible points. Radiation is for accessible stations. Resection locates the plane table itself." },
      { q: "The 'closing error' in a closed traverse is eliminated by:", options: ["A) Bowditch's rule", "B) Transit rule", "C) Graphical adjustment", "D) All of the above"], answer: "D) All of the above", explanation: "Closing error can be adjusted by Bowditch's rule (proportional to length), Transit rule (proportional to lat/dep), or graphically." },
      { q: "Contour interval is typically ______ for hilly terrain compared to plain terrain.", options: ["A) Smaller", "B) Same", "C) Larger", "D) Zero"], answer: "C) Larger", explanation: "For hilly terrain, a larger contour interval (e.g., 5–10 m) is used to prevent overcrowding of contour lines. Plain terrain uses 0.5–1 m." },
      { q: "Which instrument is used to measure horizontal and vertical angles in surveying?", options: ["A) Dumpy level", "B) Theodolite", "C) Planimeter", "D) Clinometer"], answer: "B) Theodolite", explanation: "Theodolite measures both horizontal and vertical angles. Dumpy level measures heights only. Planimeter measures areas." },
    ],
  },
  {
    subject: "Building Materials & Construction",
    icon: "🧱",
    questions: [
      { q: "The initial setting time of Ordinary Portland Cement (OPC) as per IS 269 is minimum:", options: ["A) 30 minutes", "B) 45 minutes", "C) 60 minutes", "D) 90 minutes"], answer: "B) 45 minutes", explanation: "IS 269 specifies initial setting time ≥ 30 min for OPC (some references say 45 min). Final setting time ≤ 600 min (10 hours)." },
      { q: "Water-cement ratio has a direct relationship with:", options: ["A) Workability only", "B) Strength only", "C) Both workability and strength (inversely)", "D) Setting time only"], answer: "C) Both workability and strength (inversely)", explanation: "Lower W/C ratio = higher strength but lower workability. Higher W/C = more workable but weaker concrete (Abrams' law)." },
      { q: "First class bricks have a minimum crushing strength of:", options: ["A) 3.5 N/mm²", "B) 7.0 N/mm²", "C) 10.5 N/mm²", "D) 14.0 N/mm²"], answer: "C) 10.5 N/mm²", explanation: "As per IS 1077, first class bricks: 10.5 N/mm². Second class: 7.0 N/mm². Third class: 3.5 N/mm²." },
      { q: "Admixture used to accelerate the setting time of concrete is:", options: ["A) Fly ash", "B) Calcium chloride", "C) Gypsum", "D) Silica fume"], answer: "B) Calcium chloride", explanation: "Calcium chloride is an accelerating admixture. Gypsum retards setting. Fly ash and silica fume are pozzolanic materials." },
      { q: "Which type of cement is best suited for marine structures?", options: ["A) OPC", "B) Rapid hardening cement", "C) Sulphate-resistant cement", "D) High alumina cement"], answer: "C) Sulphate-resistant cement", explanation: "Marine structures are exposed to sulfate-rich seawater. Sulphate-resistant cement (SRC) has low C3A content to resist sulfate attack." },
    ],
  },
  {
    subject: "Transportation Engineering",
    icon: "🛣️",
    questions: [
      { q: "The ruling gradient recommended by IRC for plain and rolling terrain is:", options: ["A) 1 in 15", "B) 1 in 20", "C) 1 in 30", "D) 1 in 40"], answer: "C) 1 in 30", explanation: "IRC recommends ruling gradient of 1 in 30 (3.3%) for plain/rolling terrain. Limiting gradient for hilly terrain: 1 in 15." },
      { q: "California Bearing Ratio (CBR) test is used to design:", options: ["A) Bridge foundations", "B) Flexible pavements", "C) Rigid pavements", "D) Retaining walls"], answer: "B) Flexible pavements", explanation: "CBR test measures subgrade strength for flexible pavement design. It compares penetration resistance to standard crushed rock." },
      { q: "The stopping sight distance depends on:", options: ["A) Speed and reaction time only", "B) Friction, speed, and grade", "C) Vehicle weight only", "D) Road width only"], answer: "B) Friction, speed, and grade", explanation: "SSD = lag distance (vt) + braking distance (v²/2gf). It depends on design speed, driver reaction time, friction coefficient, and road gradient." },
    ],
  },
  {
    subject: "Environmental Engineering",
    icon: "♻️",
    questions: [
      { q: "BOD (Biochemical Oxygen Demand) measures:", options: ["A) Dissolved oxygen in water", "B) Oxygen required for chemical oxidation", "C) Oxygen consumed by microorganisms to decompose organic matter", "D) Total dissolved solids"], answer: "C) Oxygen consumed by microorganisms to decompose organic matter", explanation: "BOD is the amount of O₂ (mg/L) consumed by bacteria during aerobic decomposition of organic matter over 5 days at 20°C (BOD₅)." },
      { q: "The permissible limit of fluoride in drinking water as per IS 10500 is:", options: ["A) 0.5 mg/L", "B) 1.0 mg/L", "C) 1.5 mg/L", "D) 2.0 mg/L"], answer: "C) 1.5 mg/L", explanation: "IS 10500:2012 sets acceptable limit of fluoride at 1.0 mg/L and permissible limit at 1.5 mg/L. Excess causes fluorosis." },
      { q: "Sedimentation tanks in water treatment are designed based on:", options: ["A) Overflow rate (surface loading rate)", "B) Detention time only", "C) Velocity of flow only", "D) BOD removal"], answer: "A) Overflow rate (surface loading rate)", explanation: "Sedimentation tanks are designed based on surface overflow rate (Q/A) and detention time. Overflow rate = flow / surface area." },
    ],
  },
  {
    subject: "Estimation & Costing",
    icon: "📋",
    questions: [
      { q: "In PWD method of measurement, the volume of earthwork is calculated by:", options: ["A) Prismoidal formula", "B) Trapezoidal formula", "C) Simpson's rule", "D) All of the above"], answer: "D) All of the above", explanation: "Earthwork volumes can be calculated by Prismoidal formula (most accurate), Trapezoidal (average end area), or Simpson's rule for 3+ sections." },
      { q: "The contingency amount in an estimate is typically:", options: ["A) 1–2% of project cost", "B) 3–5% of project cost", "C) 5–10% of project cost", "D) 10–15% of project cost"], answer: "B) 3–5% of project cost", explanation: "In Indian PWD estimates, contingency is generally taken as 3–5% of the estimated cost for unforeseen expenses." },
      { q: "Rate analysis is the process of:", options: ["A) Analyzing market rates", "B) Determining unit cost of each item of work", "C) Preparing bar charts", "D) Calculating tender amounts"], answer: "B) Determining unit cost of each item of work", explanation: "Rate analysis determines the cost per unit for any item of work by analyzing material, labour, equipment, and overhead costs." },
    ],
  },
];

export default function Blog2Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaArticle) }}
      />

      <main style={{ background: "var(--navy)", color: "#fff", minHeight: "100vh", padding: "0 0 80px" }}>

        {/* ─── ARTICLE HERO ── */}
        <div style={{ background: "linear-gradient(160deg, #040C18 0%, #0B1E3D 100%)", padding: "70px 5% 56px" }}>
          <div style={{ maxWidth: "820px", margin: "0 auto" }}>
            <nav aria-label="Breadcrumb" style={{ marginBottom: "24px", fontSize: "13px", color: "rgba(255,255,255,0.45)", display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
              <Link href="/" style={{ color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>Home</Link>
              <span aria-hidden="true">/</span>
              <Link href="/blog" style={{ color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>Blog</Link>
              <span aria-hidden="true">/</span>
              <span style={{ color: "#FF8534" }}>Top 100 PSC Civil Questions</span>
            </nav>

            <span style={{ display: "inline-block", background: "rgba(255,98,0,0.12)", border: "1px solid rgba(255,98,0,0.25)", borderRadius: "100px", padding: "4px 14px", fontSize: "12px", fontWeight: 600, color: "#FF8534", marginBottom: "18px" }}>
              Practice
            </span>

            <h1 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "clamp(1.9rem, 4.5vw, 3rem)", fontWeight: 700, lineHeight: 1.18, color: "#fff", marginBottom: "20px" }}>
              Top 100 PSC Civil Engineering Questions with Answers – Kerala
            </h1>

            <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.72, marginBottom: "28px" }}>
              The most repeated and high-weightage MCQs from Kerala PSC civil engineering exams, with detailed answers and explanations. Essential for ITI, Diploma, B.Tech & AE aspirants.
            </p>

            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", fontSize: "13px", color: "rgba(255,255,255,0.45)" }}>
              <span>By <strong style={{ color: "rgba(255,255,255,0.7)" }}>Wincentre Expert Team</strong></span>
              <span>•</span>
              <span>Updated: April 2026</span>
              <span>•</span>
              <span>20 min read</span>
            </div>
          </div>
        </div>

        {/* ─── INTRO ── */}
        <div style={{ maxWidth: "820px", margin: "0 auto", padding: "52px 5% 0" }}>
          <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.85, marginBottom: "16px" }}>
            This collection covers the most frequently tested civil engineering concepts in Kerala PSC examinations. These questions are drawn from actual past papers and expert analysis by Wincentre – Kerala&apos;s most trusted PSC civil coaching institute with 1000+ government job selections.
          </p>
          <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.85, marginBottom: "16px" }}>
            Each question includes the correct answer and a concise explanation so you understand the concept, not just memorise the answer. Work through each subject section systematically, and then reinforce your learning with unlimited practice on <Link href="/game-arena" style={{ color: "#FF8534", textDecoration: "none", fontWeight: 600 }}>CivilEzy&apos;s Game Arena</Link>.
          </p>
          <div style={{ background: "rgba(255,98,0,0.08)", border: "1px solid rgba(255,98,0,0.2)", borderRadius: "12px", padding: "18px 20px", marginBottom: "40px", fontSize: "14px", color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>
            <strong style={{ color: "#FF8534" }}>Pro Tip:</strong> Don&apos;t just check the answer – read every explanation, even for questions you got right. Understanding the &apos;why&apos; is what separates top rankers from average scorers.
          </div>
        </div>

        {/* ─── QUESTION SETS ── */}
        <div style={{ maxWidth: "820px", margin: "0 auto", padding: "0 5%" }}>
          {QUESTION_SETS.map((set, si) => (
            <section key={set.subject} style={{ marginBottom: "60px" }}>
              <h2 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "clamp(1.3rem, 2.5vw, 1.75rem)", fontWeight: 700, color: "#fff", marginBottom: "28px", display: "flex", alignItems: "center", gap: "12px", paddingBottom: "14px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <span aria-hidden="true">{set.icon}</span> {set.subject}
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {set.questions.map((qa, qi) => (
                  <div key={qi} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px 22px" }}>
                    <div style={{ fontSize: "12px", color: "#FF8534", fontWeight: 700, marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Q{si * 5 + qi + 1}
                    </div>
                    <p style={{ fontSize: "1rem", fontWeight: 600, color: "#fff", marginBottom: "18px", lineHeight: 1.6 }}>{qa.q}</p>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
                      {qa.options.map((opt) => (
                        <div
                          key={opt}
                          style={{
                            padding: "10px 14px",
                            borderRadius: "10px",
                            fontSize: "0.9rem",
                            background: opt === qa.answer ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.03)",
                            border: opt === qa.answer ? "1px solid rgba(34,197,94,0.35)" : "1px solid rgba(255,255,255,0.07)",
                            color: opt === qa.answer ? "#4ade80" : "rgba(255,255,255,0.65)",
                            fontWeight: opt === qa.answer ? 700 : 400,
                          }}
                        >
                          {opt === qa.answer && <span aria-label="correct answer" style={{ marginRight: "6px" }}>✓</span>}
                          {opt}
                        </div>
                      ))}
                    </div>

                    <div style={{ background: "rgba(255,184,0,0.06)", border: "1px solid rgba(255,184,0,0.15)", borderRadius: "10px", padding: "12px 16px", fontSize: "0.88rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.72 }}>
                      <strong style={{ color: "#FFB800" }}>Explanation: </strong>{qa.explanation}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* Remaining 66 questions note */}
          <div style={{ background: "linear-gradient(135deg, rgba(255,98,0,0.12), rgba(255,98,0,0.06))", border: "1px solid rgba(255,98,0,0.25)", borderRadius: "18px", padding: "40px 32px", marginBottom: "56px", textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "14px" }}>🎮</div>
            <h3 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1.6rem", fontWeight: 700, color: "#fff", marginBottom: "14px" }}>
              Practice 1000+ More PSC Civil Questions
            </h3>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "1rem", marginBottom: "28px", lineHeight: 1.72, maxWidth: "560px", margin: "0 auto 28px" }}>
              The 34 questions above are just a sample. CivilEzy&apos;s Game Arena has 1000+ Kerala PSC civil engineering questions with instant feedback, timed sessions, and a live leaderboard – completely free.
            </p>
            <Link
              href="/game-arena"
              style={{ display: "inline-block", background: "linear-gradient(135deg, #FF6200, #FF8534)", color: "#fff", padding: "15px 36px", borderRadius: "10px", fontWeight: 700, fontSize: "1.05rem", textDecoration: "none", fontFamily: "Rajdhani, sans-serif" }}
            >
              🚀 Practice All 1000+ Questions Free
            </Link>
          </div>

          {/* Study tips */}
          <section style={{ marginBottom: "52px" }}>
            <h2 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "clamp(1.3rem, 2.5vw, 1.75rem)", fontWeight: 700, color: "#fff", marginBottom: "22px", paddingBottom: "14px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              How to Use These Questions Effectively
            </h2>
            {[
              { title: "Attempt before checking the answer", desc: "Always try to answer independently before revealing the answer. This builds active recall, which is 10× more effective than passive reading." },
              { title: "Understand the explanation, not just the answer", desc: "Kerala PSC often rephrases the same concept in different ways. If you understand the principle, you can answer any variation." },
              { title: "Create subject-wise error logs", desc: "Note down every question you got wrong and the reason. Review this log weekly. Most aspirants repeat the same mistakes 3–4 times." },
              { title: "Time yourself", desc: "Each Kerala PSC question should ideally take 30–45 seconds. Practice speed with accuracy using CivilEzy's timed Game Arena sessions." },
              { title: "Categorize by difficulty", desc: "After practicing, categorize topics as Strong / Average / Weak. Spend 60% of your remaining preparation time on Weak topics." },
            ].map((tip) => (
              <div key={tip.title} style={{ marginBottom: "20px", paddingLeft: "20px", borderLeft: "3px solid #FF6200" }}>
                <div style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", marginBottom: "6px" }}>{tip.title}</div>
                <div style={{ fontSize: "0.93rem", color: "rgba(255,255,255,0.62)", lineHeight: 1.75 }}>{tip.desc}</div>
              </div>
            ))}
          </section>

          {/* Related articles */}
          <div>
            <h3 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1.3rem", fontWeight: 700, color: "#fff", marginBottom: "20px" }}>Related Articles</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <Link href="/blog/how-to-crack-kerala-psc-civil-engineering" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "18px 20px", textDecoration: "none", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
                <div>
                  <div style={{ fontSize: "0.93rem", fontWeight: 600, color: "#fff", marginBottom: "4px" }}>How to Crack Kerala PSC Civil Engineering Exam – Complete Guide</div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)" }}>Strategy · 15 min read</div>
                </div>
                <span style={{ color: "#FF8534", fontSize: "1.2rem" }}>→</span>
              </Link>
              <Link href="/blog/best-books-civil-psc-kerala" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "18px 20px", textDecoration: "none", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
                <div>
                  <div style={{ fontSize: "0.93rem", fontWeight: 600, color: "#fff", marginBottom: "4px" }}>Best Books for Civil PSC Kerala – All Categories</div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)" }}>Resources · 10 min read</div>
                </div>
                <span style={{ color: "#FF8534", fontSize: "1.2rem" }}>→</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @media (max-width: 600px) {
          .options-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}

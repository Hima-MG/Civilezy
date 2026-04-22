import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Best Books for Civil PSC Kerala – All Categories (2025 Updated)",
  description:
    "Complete booklist for Kerala PSC Civil Engineering preparation. Best books for ITI, Diploma, B.Tech, and Surveyor categories. Subject-wise recommendations from Wincentre experts with tips on how to use each book effectively.",
  keywords: [
    "best books civil psc kerala",
    "kerala psc civil engineering books",
    "psc civil engineering preparation books",
    "kerala psc iti civil books",
    "kerala psc diploma civil books",
    "kerala psc ae civil books",
    "civil engineering psc reference books kerala",
  ],
  alternates: { canonical: "https://civilezy.in/blog/best-books-civil-psc-kerala" },
  openGraph: {
    type: "article",
    locale: "en_IN",
    url: "https://civilezy.in/blog/best-books-civil-psc-kerala",
    siteName: "CivilEzy",
    title: "Best Books for Civil PSC Kerala – All Categories (2025 Updated)",
    description:
      "Subject-wise booklist for Kerala PSC Civil Engineering. Expert recommendations for ITI, Diploma, B.Tech & Surveyor categories from Wincentre.",
  },
};

const schemaArticle = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Best Books for Civil PSC Kerala – All Categories (2025 Updated)",
  description:
    "Complete booklist for Kerala PSC Civil Engineering preparation across ITI, Diploma, B.Tech, and Surveyor categories.",
  author: { "@type": "Organization", name: "CivilEzy by Wincentre" },
  publisher: {
    "@type": "Organization",
    name: "CivilEzy",
    logo: { "@type": "ImageObject", url: "https://civilezy.in/civilezy_logo_orange.png" },
  },
  datePublished: "2025-03-01",
  dateModified: "2026-04-20",
  mainEntityOfPage: "https://civilezy.in/blog/best-books-civil-psc-kerala",
};

const SUBJECT_BOOKS = [
  {
    subject: "Soil Mechanics & Foundation Engineering",
    icon: "🏗️",
    books: [
      { title: "Soil Mechanics and Foundation Engineering", author: "Dr. K.R. Arora", why: "The most comprehensive and widely used reference for Kerala PSC Soil Mechanics questions. Covers all IS codes, Terzaghi's theory, bearing capacity, and consolidation with solved examples." },
      { title: "Basic and Applied Soil Mechanics", author: "Gopal Ranjan & A.S.R. Rao", why: "Excellent for B.Tech/AE level preparation. Clear explanations of advanced topics like deep foundations, pile design, and slope stability." },
      { title: "Principles of Geotechnical Engineering", author: "Braja M. Das", why: "International textbook with excellent numerical examples. Useful for AE-level aspirants who want deep conceptual clarity." },
    ],
    pscTip: "Focus on: void ratio, porosity, Darcy's law, Terzaghi's consolidation, bearing capacity formulas (Terzaghi & IS 6403), SPT N-values, and types of foundations. These account for 8–12 marks in the paper.",
  },
  {
    subject: "Structural Engineering & RCC Design",
    icon: "🏛️",
    books: [
      { title: "Design of Reinforced Concrete Structures", author: "N. Krishna Raju", why: "The standard textbook for IS 456 based RCC design. Covers WSM and LSM methods, beams, columns, slabs, and footings with design examples." },
      { title: "Reinforced Concrete Design", author: "S.U. Pillai & D. Menon", why: "Modern treatment of Limit State Design as per IS 456:2000. Excellent for understanding the design philosophy and code provisions tested in PSC exams." },
      { title: "Strength of Materials", author: "R.K. Bansal", why: "Best for SFD, BMD, shear stress, bending stress, deflection, and elastic theories – all frequently tested in Kerala PSC structural papers." },
    ],
    pscTip: "Must-know: Bending moment & shear force diagrams for standard loading, modular ratio, effective depth calculation, minimum steel percentages, IS 456 code clauses, and column design (short vs. long). 10–14 marks.",
  },
  {
    subject: "Fluid Mechanics & Hydraulics",
    icon: "💧",
    books: [
      { title: "Fluid Mechanics and Hydraulic Machines", author: "Dr. R.K. Bansal", why: "The go-to reference for Kerala PSC fluid mechanics. Covers Bernoulli's theorem, pipe flow, orifices, weirs, hydraulic machines, and open channel flow comprehensively." },
      { title: "Fluid Mechanics", author: "Frank M. White", why: "For AE aspirants who need stronger theoretical foundations. International standard but very clear explanations." },
      { title: "Open Channel Flow", author: "M.H. Chaudhry", why: "Specific to open channel hydraulics – important for Kerala PSC given Kerala's focus on water resources engineering." },
    ],
    pscTip: "Key topics: Bernoulli's equation applications, continuity equation, Darcy-Weisbach formula, Manning's equation, hydraulic jump, types of flow (laminar/turbulent), notches & weirs. 8–12 marks.",
  },
  {
    subject: "Surveying",
    icon: "📐",
    books: [
      { title: "Surveying (Vol. 1, 2, 3)", author: "B.C. Punmia", why: "The definitive surveying reference for Kerala PSC. Comprehensive coverage of chain surveying, compass, plane table, levelling, theodolite, EDM, and remote sensing." },
      { title: "Surveying and Levelling", author: "N.N. Basak", why: "More compact and exam-focused than Punmia. Good for quick revision of key concepts, formulae, and definitions." },
      { title: "Elementary Surveying", author: "La Putt", why: "International reference popular among Surveyor category aspirants. Practical focus on field surveying operations." },
    ],
    pscTip: "High-scoring area for Surveyor category. Focus on: Prismatic vs. Surveyor's compass, closing error adjustment (Bowditch rule), plane table methods, contour properties, levelling (RL calculation), and EDM basics. 8–12 marks.",
  },
  {
    subject: "Building Materials & Construction Technology",
    icon: "🧱",
    books: [
      { title: "Building Construction", author: "B.C. Punmia, A.K. Jain & A.K. Jain", why: "The most widely used reference for Kerala PSC building construction questions. Covers bricks, cement, concrete, timber, stones, and finishing works with IS code references." },
      { title: "Engineering Materials", author: "R.K. Rajput", why: "Focused specifically on material properties – ideal for understanding IS code values for cement, concrete, and metals that appear frequently in PSC exams." },
      { title: "IS Codes Compilation (BIS Publications)", author: "Bureau of Indian Standards", why: "IS 456, IS 269, IS 383, IS 1077, IS 2386 are frequently referenced in PSC questions. Download from BIS website or use a PSC-specific IS code handbook." },
    ],
    pscTip: "Mostly factual questions from IS codes. Memorize: OPC setting times, concrete grades & their uses, first/second/third class brick strengths, W/C ratio effects, types of cement and their applications. 8–10 marks.",
  },
  {
    subject: "Transportation Engineering",
    icon: "🛣️",
    books: [
      { title: "Highway Engineering", author: "S.K. Khanna & C.E.G. Justo", why: "Standard reference for IRC codes, road design, pavement materials, and traffic engineering. Comprehensive and exam-aligned." },
      { title: "Traffic Engineering and Transport Planning", author: "L.R. Kadiyali", why: "Essential for traffic studies, capacity analysis, and road safety questions that appear in higher-level PSC papers." },
    ],
    pscTip: "Focus on IRC recommendations for gradients, sight distance types (SSD/ISD/OSD), CBR test, pavement design basics, road materials (WBM, bituminous macadam). 6–8 marks.",
  },
  {
    subject: "Environmental Engineering",
    icon: "♻️",
    books: [
      { title: "Environmental Engineering (Vol. 1 & 2)", author: "B.C. Punmia & Ashok Jain", why: "The standard PSC reference for water supply, sewage treatment, and solid waste management. IS code-aligned and comprehensive." },
      { title: "Introduction to Environmental Engineering", author: "Davis & Cornwell", why: "International reference with excellent conceptual explanations for BOD/COD, treatment processes, and environmental standards." },
    ],
    pscTip: "Important: IS 10500 drinking water standards (fluoride, turbidity, TDS limits), BOD/COD concepts, sedimentation tank design, types of sewage treatment, solid waste management. 6–8 marks.",
  },
  {
    subject: "Estimation, Costing & Valuation",
    icon: "📋",
    books: [
      { title: "Estimating, Costing and Valuation", author: "B.N. Datta", why: "The most used reference for Kerala PSC estimation questions. Covers PWD schedule of rates, rate analysis, types of estimates, and valuation concepts." },
      { title: "Estimating and Costing in Civil Engineering", author: "B.C. Punmia", why: "Alternative reference with comprehensive worked examples for earthwork volumes, building estimates, and contract documents." },
    ],
    pscTip: "Key areas: Types of estimates (approximate, detailed, revised), rate analysis methodology, PWD schedule of rates (Kerala), earthwork volume calculation (prismoidal formula), types of contracts. 6–8 marks.",
  },
  {
    subject: "General Knowledge & Kerala PSC",
    icon: "📚",
    books: [
      { title: "Kerala PSC GK Manual (Latest Edition)", author: "Various Kerala PSC publishers", why: "Specific to Kerala PSC – covers Kerala history, geography, rivers, dams, government departments, and recent events. Essential for GK section." },
      { title: "Lucent's General Knowledge", author: "Lucent Publications", why: "Comprehensive GK reference for Indian history, geography, science, and current affairs. Good supplement to the Kerala-specific manual." },
      { title: "The Hindu / Mathrubhumi (Daily)", author: "Current Affairs", why: "Reading one quality newspaper for 20–30 minutes daily is the best way to stay updated on current affairs for the PSC GK section." },
    ],
    pscTip: "10–15 marks from GK. Focus on Kerala current affairs (last 6 months), Kerala river systems, dams, Kerala Water Authority, PWD & LSGD history, and PSC notifications related to civil departments.",
  },
];

const CATEGORY_GUIDES = [
  {
    category: "ITI (Overseer Grade III)",
    level: "Foundation Level",
    color: "#10b981",
    desc: "Focus on practical civil engineering basics: building materials, simple surveying, basic structural concepts, and estimation. Avoid overly theoretical books – stick to ITI-level curriculum books and PSC-specific guides.",
    topBooks: ["Building Construction – B.C. Punmia", "Surveying (Vol. 1) – B.C. Punmia", "Kerala PSC GK Manual", "Estimating & Costing – B.N. Datta"],
  },
  {
    category: "Diploma (Overseer Grade I & II, Draftsman)",
    level: "Intermediate Level",
    color: "#3b82f6",
    desc: "Requires deeper understanding than ITI. Include Soil Mechanics basics, RCC design fundamentals, and all core subjects. Balance between theoretical understanding and practical application.",
    topBooks: ["Soil Mechanics – K.R. Arora", "RCC Design – N. Krishna Raju", "Fluid Mechanics – R.K. Bansal", "Highway Engineering – Khanna & Justo"],
  },
  {
    category: "B.Tech / AE (Assistant Engineer)",
    level: "Advanced Level",
    color: "#8b5cf6",
    desc: "Highest difficulty level. Deep technical knowledge required across all subjects. Include advanced structural analysis, geotechnical engineering, hydraulics, and environmental engineering at degree level.",
    topBooks: ["Strength of Materials – R.K. Bansal", "Basic & Applied Soil Mechanics – Ranjan & Rao", "Environmental Engineering – Punmia", "Traffic Engineering – Kadiyali"],
  },
  {
    category: "Surveyor",
    level: "Specialized",
    color: "#f59e0b",
    desc: "Heavy focus on surveying subjects. Invest extra time in Surveying Vol. 1–3 by Punmia. Also cover basic civil subjects as they appear in the technical paper.",
    topBooks: ["Surveying (Vol. 1, 2, 3) – B.C. Punmia", "Surveying & Levelling – N.N. Basak", "Elementary Surveying – La Putt", "Kerala PSC GK Manual"],
  },
];

export default function Blog3Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaArticle) }}
      />

      <main style={{ background: "var(--navy)", color: "#fff", minHeight: "100vh", padding: "0 0 80px" }}>

        {/* ─── OLDER ARTICLES BANNER ── */}
        <div style={{ background: "rgba(255,184,0,0.08)", borderBottom: "1px solid rgba(255,184,0,0.2)", padding: "12px 5%", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", flexWrap: "wrap", textAlign: "center" }}>
          <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.65)" }}>
            You are viewing an older article.
          </span>
          <Link href="/blog" style={{ fontSize: "13px", fontWeight: 700, color: "#FFB800", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}>
            Visit our updated blog for the latest content →
          </Link>
        </div>

        {/* ─── ARTICLE HERO ── */}
        <div style={{ background: "linear-gradient(160deg, #040C18 0%, #0B1E3D 100%)", padding: "70px 5% 56px" }}>
          <div style={{ maxWidth: "820px", margin: "0 auto" }}>
            <nav aria-label="Breadcrumb" style={{ marginBottom: "24px", fontSize: "13px", color: "rgba(255,255,255,0.45)", display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
              <Link href="/" style={{ color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>Home</Link>
              <span aria-hidden="true">/</span>
              <Link href="/blog" style={{ color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>Blog</Link>
              <span aria-hidden="true">/</span>
              <span style={{ color: "#FF8534" }}>Best Books Civil PSC Kerala</span>
            </nav>

            <span style={{ display: "inline-block", background: "rgba(255,98,0,0.12)", border: "1px solid rgba(255,98,0,0.25)", borderRadius: "100px", padding: "4px 14px", fontSize: "12px", fontWeight: 600, color: "#FF8534", marginBottom: "18px" }}>
              Resources
            </span>

            <h1 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "clamp(1.9rem, 4.5vw, 3rem)", fontWeight: 700, lineHeight: 1.18, color: "#fff", marginBottom: "20px" }}>
              Best Books for Civil PSC Kerala – All Categories (2025 Updated)
            </h1>

            <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.72, marginBottom: "28px" }}>
              A subject-wise booklist for Kerala PSC Civil Engineering preparation. Expert recommendations from Wincentre&apos;s faculty for ITI, Diploma, B.Tech & AE, and Surveyor categories – with what to focus on in each book.
            </p>

            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", fontSize: "13px", color: "rgba(255,255,255,0.45)" }}>
              <span>By <strong style={{ color: "rgba(255,255,255,0.7)" }}>Wincentre Expert Team</strong></span>
              <span>•</span>
              <span>Updated: April 2026</span>
              <span>•</span>
              <span>10 min read</span>
            </div>
          </div>
        </div>

        {/* ─── INTRO ── */}
        <div style={{ maxWidth: "820px", margin: "0 auto", padding: "52px 5% 0" }}>
          <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.85, marginBottom: "16px" }}>
            Choosing the right books for Kerala PSC Civil Engineering preparation is one of the most important decisions you&apos;ll make. The wrong books waste months of preparation time on content that never appears in the exam. The right books, used correctly, give you an unfair advantage.
          </p>
          <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.85, marginBottom: "16px" }}>
            This guide is compiled by the expert faculty at Wincentre – Kerala&apos;s most trusted civil engineering PSC coaching institute with 1000+ government job selections since inception. Every book recommended here has been validated through years of PSC result analysis and student feedback.
          </p>
          <div style={{ background: "rgba(255,98,0,0.08)", border: "1px solid rgba(255,98,0,0.2)", borderRadius: "12px", padding: "18px 20px", marginBottom: "40px", fontSize: "14px", color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>
            <strong style={{ color: "#FF8534" }}>Important:</strong> Books are theory references. To actually score well in Kerala PSC exams, you must combine book study with structured MCQ practice. Use <Link href="/game-arena" style={{ color: "#FF8534", textDecoration: "none", fontWeight: 600 }}>CivilEzy&apos;s Game Arena</Link> for regular mock test practice alongside your book study.
          </div>
        </div>

        {/* ─── CATEGORY GUIDES ── */}
        <div style={{ maxWidth: "820px", margin: "0 auto", padding: "0 5% 52px" }}>
          <h2 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "clamp(1.4rem, 2.8vw, 1.9rem)", fontWeight: 700, color: "#fff", marginBottom: "24px", paddingBottom: "14px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            Books by PSC Category
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "16px" }}>
            {CATEGORY_GUIDES.map((cat) => (
              <div key={cat.category} style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${cat.color}30`, borderRadius: "16px", padding: "24px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: cat.color, flexShrink: 0, display: "inline-block" }} />
                  <h3 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1rem", fontWeight: 700, color: "#fff", margin: 0 }}>{cat.category}</h3>
                </div>
                <div style={{ fontSize: "11px", color: cat.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" }}>{cat.level}</div>
                <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: "16px" }}>{cat.desc}</p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
                  {cat.topBooks.map((b) => (
                    <li key={b} style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                      <span style={{ color: cat.color, marginTop: "2px", flexShrink: 0 }}>✓</span> {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ─── SUBJECT-WISE BOOKS ── */}
        <div style={{ maxWidth: "820px", margin: "0 auto", padding: "0 5%" }}>
          <h2 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "clamp(1.4rem, 2.8vw, 1.9rem)", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
            Subject-Wise Book Recommendations
          </h2>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.95rem", marginBottom: "36px" }}>
            With PSC-focused tips on what to study in each book
          </p>

          {SUBJECT_BOOKS.map((sub) => (
            <section key={sub.subject} style={{ marginBottom: "52px" }}>
              <h3 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "clamp(1.2rem, 2.2vw, 1.55rem)", fontWeight: 700, color: "#fff", marginBottom: "20px", display: "flex", alignItems: "center", gap: "12px", paddingBottom: "14px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <span aria-hidden="true">{sub.icon}</span> {sub.subject}
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "20px" }}>
                {sub.books.map((book, i) => (
                  <div key={book.title} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "22px 20px", display: "flex", gap: "18px", alignItems: "flex-start" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: "rgba(255,98,0,0.15)", border: "1px solid rgba(255,98,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "Rajdhani, sans-serif", fontWeight: 700, color: "#FF6200", fontSize: "1rem" }}>
                      {i + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>{book.title}</div>
                      <div style={{ fontSize: "13px", color: "#FF8534", marginBottom: "10px" }}>by {book.author}</div>
                      <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.62)", lineHeight: 1.72 }}>{book.why}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: "rgba(255,184,0,0.06)", border: "1px solid rgba(255,184,0,0.15)", borderRadius: "12px", padding: "14px 18px", fontSize: "0.88rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.72 }}>
                <strong style={{ color: "#FFB800" }}>PSC Focus: </strong>{sub.pscTip}
              </div>
            </section>
          ))}

          {/* How to use books effectively */}
          <section style={{ marginBottom: "52px" }}>
            <h2 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "clamp(1.3rem, 2.5vw, 1.75rem)", fontWeight: 700, color: "#fff", marginBottom: "24px", paddingBottom: "14px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              How to Use Reference Books Effectively for PSC
            </h2>
            {[
              { title: "Don't read cover-to-cover", desc: "Kerala PSC tests specific concepts, not entire textbook chapters. Use the PSC focus tips above to identify which sections matter and read selectively." },
              { title: "Make topic-wise short notes", desc: "As you read, prepare a one-page summary per topic. These notes are what you'll revise in the final weeks – the books won't be open again by then." },
              { title: "Extract IS code values separately", desc: "Create a dedicated IS code reference card: concrete grades, OPC setting times, brick strengths, water quality standards. These numbers appear directly in PSC questions." },
              { title: "Solve numericals from each chapter", desc: "Kerala PSC has 3–5 numerical problems in most papers. After reading a chapter, solve all example problems without looking at the solution. This builds problem-solving speed." },
              { title: "Books → Notes → MCQ Practice → Weak area revision", desc: "This is the four-step cycle. After covering a subject with books and notes, immediately switch to MCQ practice on CivilEzy Game Arena to test retention." },
              { title: "Limit yourself to 2–3 books per subject", desc: "The biggest mistake aspirants make is buying every book available. Two good books studied thoroughly beat ten books read superficially. Depth over breadth." },
            ].map((tip) => (
              <div key={tip.title} style={{ marginBottom: "22px", paddingLeft: "20px", borderLeft: "3px solid #FF6200" }}>
                <div style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", marginBottom: "6px" }}>{tip.title}</div>
                <div style={{ fontSize: "0.93rem", color: "rgba(255,255,255,0.62)", lineHeight: 1.75 }}>{tip.desc}</div>
              </div>
            ))}
          </section>

          {/* The CivilEzy advantage */}
          <section style={{ marginBottom: "52px" }}>
            <h2 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "clamp(1.3rem, 2.5vw, 1.75rem)", fontWeight: 700, color: "#fff", marginBottom: "22px", paddingBottom: "14px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              Beyond Books: The CivilEzy + Wincentre Advantage
            </h2>
            <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.85, marginBottom: "16px" }}>
              Books give you knowledge. But the Kerala PSC exam tests speed, accuracy, and strategic MCQ-solving under time pressure. That&apos;s where CivilEzy becomes essential.
            </p>
            <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.85, marginBottom: "16px" }}>
              CivilEzy&apos;s platform offers Smart Lessons that complement your book study – Malayalam audio explanations of complex concepts, short video lessons (40–50 min per subject), and a question bank of 1000+ PSC-aligned MCQs with instant feedback. This combination of structured book study + CivilEzy practice is the exact methodology used by Wincentre students who consistently top the Kerala PSC civil engineering rank lists.
            </p>
            <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.85, marginBottom: "32px" }}>
              The Game Arena adds a competitive dimension – you can see exactly how your MCQ performance compares to other aspirants across Kerala, giving you a realistic benchmark for where you stand before the actual exam.
            </p>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <Link href="/game-arena" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "linear-gradient(135deg, #FF6200, #FF8534)", color: "#fff", padding: "14px 30px", borderRadius: "10px", fontWeight: 700, fontSize: "0.97rem", textDecoration: "none", fontFamily: "Rajdhani, sans-serif" }}>
                🎮 Practice on Game Arena – Free
              </Link>
              <Link href="/pricing" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", padding: "14px 30px", borderRadius: "10px", fontWeight: 600, fontSize: "0.97rem", textDecoration: "none" }}>
                View Course Plans →
              </Link>
            </div>
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
              <Link href="/blog/top-100-psc-civil-questions-kerala" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "18px 20px", textDecoration: "none", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
                <div>
                  <div style={{ fontSize: "0.93rem", fontWeight: 600, color: "#fff", marginBottom: "4px" }}>Top 100 PSC Civil Engineering Questions (with Answers)</div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)" }}>Practice · 20 min read</div>
                </div>
                <span style={{ color: "#FF8534", fontSize: "1.2rem" }}>→</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @media (max-width: 640px) {
          .cat-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}

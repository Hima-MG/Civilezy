// ─── Hero PSC Challenge Teaser — Static Question Data ────────────────────────
// These questions are intentionally hardcoded (not fetched from Firestore)
// so they are server-rendered, crawlable, and available instantly on page load.
// Each domain targets high-value Kerala PSC search terms.

export type HeroDomain = "iti" | "diploma" | "btech" | "surveyor";

export interface HeroQuestion {
  question: string;
  options: [string, string, string, string];
  /** Index of the correct option (0–3) */
  correct: 0 | 1 | 2 | 3;
}

export interface HeroDomainConfig {
  id: HeroDomain;
  label: string;
  icon: string;
  /** SEO-rich subtitle shown near quiz */
  seoSubtitle: string;
  questions: [HeroQuestion, HeroQuestion, HeroQuestion, HeroQuestion, HeroQuestion];
}

export const HERO_DOMAINS: HeroDomainConfig[] = [
  {
    id: "iti",
    label: "ITI",
    icon: "🔧",
    seoSubtitle: "Try CiviiEzy Civil Engineering Questions for ITI Overseer candidates",
    questions: [
       {
      question:     "Q. For a Group B educational building up to 24 m height, maximum travel distance to a fire exit per NBC 2016 is:",
      options:      ["A. 15 m", "B. 22.5 m", "C. 30 m", "D. 45 m"],
      correct: 1,
    },
    {
      question:     "Q. A 20 mm rivet joins two plates each 10 mm thick and transmits a load of 30000 N. Bearing stress on the rivet shank is:",
      options:      ["A. 100 N/mm²", "B. 125 N/mm²", "C. 150 N/mm²", "D. 200 N/mm²"],
      correct: 2,
    },
    {
      question:     "Q. In the three-point problem, the 'triangle of error' vanishes when:",
      options:      ["A. Station is on great circle", "B. Table is correctly oriented", "C. All angles are equal", "D. Three points are collinear"],
      correct: 1,
    },
    {
      question:     "Q. Permissible tolerance on length of standard modular brick as per IS 1077 is about:",
      options:      ["A. ±1 mm", "B. ±3 mm per brick", "C. ±20 mm per 20 bricks", "D. ±50 mm"],
      correct: 2,
    },
    {
      question:     "Q. An isometric view shows an L-shaped block. The minimum number of orthographic views required to describe it fully is:",
      options:      ["A. 1 view", "B. 2 views", "C. 3 views", "D. 6 views"],
      correct: 2,
    },
    ],
  },
  {
    id: "diploma",
    label: "Diploma",
    icon: "📐",
    seoSubtitle: "Try CiviiEzy Civil Engineering Questions for Diploma / First Grade Overseer exam",
    questions: [
       {
      question:     "Q. Strength of figure in triangulation depends primarily on:",
      options:      ["A. Number of triangles only", "B. Distribution and size of angles", "C. Only base length", "D. Only the instrument used"],
      correct: 1,
    },
    {
      question:     "Q. For an I-section in plastic analysis, the typical shape factor is approximately:",
      options:      ["A. 1.05", "B. 1.14", "C. 1.50", "D. 1.70"],
      correct: 1,
    },
    {
      question:     "Q. A summit vertical curve connects a +3% and a −2% grade. The algebraic difference of grades N equals:",
      options:      ["A. 1%", "B. 5%", "C. −1%", "D. 6%"],
      correct: 1,
    },
    {
      question:     "Q. Cube strength at 3 days for OPC concrete is approximately what percent of 28-day strength?",
      options:      ["A. 40%", "B. 20%", "C. 65%", "D. 90%"],
      correct: 0,
    },
    {
      question:     "Q. If sand bulks 20% and site measures 1.2 m³, actual dry volume is:",
      options:      ["A. 0.80 m³", "B. 1.00 m³", "C. 1.20 m³", "D. 1.44 m³"],
      correct: 1,
    },
    ],
  },
  {
    id: "btech",
    label: "B.Tech",
    icon: "🎓",
    seoSubtitle: "Try CiviiEzy Civil Engineering Questions for B.Tech / AE level exam",
    questions: [
       {
      question:     "Q. A Pelton wheel jet has V = 42 m/s, bucket velocity u = 20 m/s and deflection 180°. Work done per unit mass (assuming smooth buckets) is:",
      options:      ["A. 440 J/kg", "B. 880 J/kg", "C. 1760 J/kg", "D. 2000 J/kg"],
      correct: 1,
    },
    {
      question:     "Q. The primary functions of railway track ballast do NOT include:",
      options:      ["A. Distributing wheel loads uniformly to the formation", "B. Holding the sleepers laterally and longitudinally", "C. Providing drainage under the sleepers", "D. Transmitting traction from rail to sleeper"],
      correct: 3,
    },
    {
      question:     "Q. A plate load test on sand with a 300 mm square plate gives Sp = 5 mm at working pressure. The expected settlement of a 1500 mm square footing at the same pressure (Terzaghi) is approximately:",
      options:      ["A. about 10 mm", "B. about 12 mm", "C. about 14 mm", "D. about 18 mm"],
      correct: 2,
    },
    {
      question:     "Q. A singly reinforced M20+Fe415 beam with b = 300 mm, d = 500 mm has Ast = 1200 mm². The depth of neutral axis xu is:",
      options:      ["A. 150 mm", "B. 200 mm", "C. 240 mm", "D. 300 mm"],
      correct: 1,
    },
    {
      question:     "Q. Given a 2×2 stiffness matrix [K] = [[4, 2], [2, 3]] (in consistent units), the determinant used to invert it is:",
      options:      ["A. 5", "B. 6", "C. 8", "D. 12"],
      correct: 2,
    },
    ],
  },
  {
    id: "surveyor",
    label: "Surveyor",
    icon: "🗺️",
    seoSubtitle: "Try CiviiEzy Civil Engineering Questions for Surveyor Grade exam",
    questions: [
       {
      question:     "Q. Principle of least squares for adjustment of redundant observations requires:",
      options:      ["A. Σv = 0", "B. Σv² = maximum", "C. Σv² = minimum", "D. Σv³ = 0"],
      correct: 2,
    },
    {
      question:     "Q. Tangent length of a simple circular curve with R = 300 m and deflection Δ = 60° is:",
      options:      ["A. 150.0 m", "B. 173.2 m", "C. 200.0 m", "D. 259.8 m"],
      correct: 1,
    },
    {
      question:     "Q. The two-point problem in plane tabling is used to:",
      options:      ["A. Locate table from 3 points", "B. Orient table using 2 known points", "C. Fix area of triangle", "D. Compute traverse closing"],
      correct: 1,
    },
    {
      question:     "Q. The Double Meridian Distance (DMD) method computes traverse area using:",
      options:      ["A. Latitudes and departures", "B. Only departures", "C. Only latitudes", "D. Only bearings"],
      correct: 0,
    },
    {
      question:     "Q. In trigonometric levelling to an inaccessible point, base not in line, using single plane method needs:",
      options:      ["A. One angle only", "B. Two horizontal angles + one vertical angle", "C. Three vertical angles", "D. Only distance measurement"],
      correct: 1,
    },
    ],
  },
];

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
        question: "The minimum reinforcement in a RCC slab as per IS 456 is:",
        options: ["0.10% of bD", "0.12% of bD for HYSD bars", "0.15% of bD", "0.20% of bD"],
        correct: 1,
      },
      {
        question: "Which cement is most suitable for marine construction works?",
        options: ["Ordinary Portland Cement", "Rapid Hardening Cement", "Portland Pozzolana Cement", "White Cement"],
        correct: 2,
      },
      {
        question: "The standard size of a modular brick as per IS 1077 is:",
        options: ["19 x 9 x 9 cm", "20 x 10 x 10 cm", "23 x 11 x 7.5 cm", "22.5 x 10.5 x 7.5 cm"],
        correct: 1,
      },
      {
        question: "In chain surveying, the term 'offset' refers to:",
        options: ["Distance along the chain line", "Lateral distance from the chain line", "Vertical distance from ground", "Bearing of the survey line"],
        correct: 1,
      },
      {
        question: "The slope of a staircase should generally not exceed:",
        options: ["30 degrees", "40 degrees", "50 degrees", "60 degrees"],
        correct: 1,
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
        question: "In a singly reinforced beam, the neutral axis depth factor depends on:",
        options: ["Steel percentage only", "Modular ratio and steel percentage", "Concrete grade only", "Load intensity"],
        correct: 1,
      },
      {
        question: "The most economical cross-section of a lined canal is:",
        options: ["Rectangular", "Trapezoidal", "Circular", "Triangular"],
        correct: 1,
      },
      {
        question: "Slump test of concrete measures its:",
        options: ["Strength", "Workability", "Durability", "Water-cement ratio"],
        correct: 1,
      },
      {
        question: "The bearing capacity of soil is determined by:",
        options: ["Sieve analysis", "Plate load test", "Hydrometer analysis", "Proctor test"],
        correct: 1,
      },
      {
        question: "In limit state method of design, the partial safety factor for dead load is:",
        options: ["1.0", "1.2", "1.5", "1.8"],
        correct: 2,
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
        question: "As per IS 1893, the seismic zone factor (Z) for Zone III in Kerala is:",
        options: ["0.10", "0.16", "0.24", "0.36"],
        correct: 1,
      },
      {
        question: "The critical depth in open channel flow occurs when the Froude number is:",
        options: ["Less than 1", "Equal to 1", "Greater than 1", "Equal to 0"],
        correct: 1,
      },
      {
        question: "In pre-stressed concrete, the loss of stress due to elastic shortening is:",
        options: ["Time-dependent loss", "Immediate loss", "Friction loss", "Relaxation loss"],
        correct: 1,
      },
      {
        question: "The BOD of treated sewage for safe disposal into a river should not exceed:",
        options: ["10 mg/L", "20 mg/L", "30 mg/L", "50 mg/L"],
        correct: 1,
      },
      {
        question: "The California Bearing Ratio (CBR) test is used to evaluate:",
        options: ["Compressive strength of concrete", "Subgrade strength of soil", "Tensile strength of steel", "Shear strength of rock"],
        correct: 1,
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
        question: "The instrument used for measuring horizontal and vertical angles is:",
        options: ["Dumpy level", "Theodolite", "Chain", "Prismatic compass"],
        correct: 1,
      },
      {
        question: "In levelling, the correction for curvature is:",
        options: ["Additive", "Subtractive", "Zero", "Depends on distance"],
        correct: 0,
      },
      {
        question: "The principle of plane table surveying is based on:",
        options: ["Triangulation", "Traversing", "Parallelism", "Graphical solution of intersection"],
        correct: 3,
      },
      {
        question: "A contour line that closes upon itself indicates:",
        options: ["A valley", "A hill or depression", "A flat terrain", "A ridge"],
        correct: 1,
      },
      {
        question: "The sensitivity of a level tube depends on:",
        options: ["Length of the tube", "Radius of curvature", "Diameter of the tube", "Liquid used"],
        correct: 1,
      },
    ],
  },
];

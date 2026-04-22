export interface BlogSection {
  heading?: string;
  body?: string[];
  list?: string[];
  isCTA?: boolean;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  keywords: string[];
  date: string;
  readTime: string;
  category: string;
  content: BlogSection[];
}

export const BLOGS: BlogPost[] = [
  // ─── 1 ──────────────────────────────────────────────────────────────────────
  {
    slug: "how-to-crack-kerala-psc-civil-engineering",
    title: "How to Crack Kerala PSC Civil Engineering Exam 2025 | Complete Guide",
    description:
      "Step-by-step guide to crack Kerala PSC Civil Engineering exam in 2025. Learn the right study strategy, syllabus plan, mock test tips, and resources for ITI, Diploma and B.Tech levels.",
    excerpt:
      "A complete roadmap to crack Kerala PSC Civil Engineering — from syllabus planning to mock tests. Works for ITI, Diploma, and B.Tech aspirants.",
    keywords: [
      "how to crack kerala psc civil engineering",
      "kerala psc civil preparation 2025",
      "psc civil study plan",
      "kerala psc civil exam tips",
      "civil engineering psc coaching kerala",
      "psc civil engineering study guide",
    ],
    date: "April 10, 2025",
    readTime: "8 min read",
    category: "Preparation Strategy",
    content: [
      {
        body: [
          "Kerala PSC Civil Engineering exams are among the most competitive in the state. Whether you are preparing for the ITI Overseer grade, Diploma level Overseer, or B.Tech Assistant Engineer (AE) posts, a structured approach is the key to success. This guide breaks down everything you need to crack Kerala PSC Civil Engineering in 2025.",
        ],
      },
      {
        heading: "1. Know Your Exam Category",
        body: ["Kerala PSC Civil Engineering recruitment happens across multiple qualification levels. Identify your eligibility category first:"],
        list: [
          "ITI Level — Overseer Gr. 2 & 3, Draughtsman, Tradesman across KWA, PWD, LSGD and Irrigation.",
          "Diploma Level — Overseer Gr. 1/2/3, Junior Instructor, Site Engineer across PWD, Irrigation, LSGD, KWA, Harbour and KSEB.",
          "B.Tech Level — Assistant Engineer (AE) posts across PWD, Irrigation, LSGD, KWA and PCB.",
          "Surveyor Level — Surveyor posts in KWA, Survey & Land Records, Technical Education and Groundwater departments.",
        ],
      },
      {
        heading: "2. Understand the Exam Pattern",
        body: [
          "Most Kerala PSC Civil Engineering exams consist of 100 objective-type (MCQ) questions for 100 marks, with a duration of 1 hour 15 minutes. Negative marking of 1/3 mark applies for each wrong answer. The exam tests both technical civil engineering knowledge and basic General Knowledge / Current Affairs.",
        ],
      },
      {
        heading: "3. Study the Syllabus Pool-wise",
        body: [
          "Kerala PSC publishes pool-based notifications. The syllabus varies slightly between pools (KWA, PWD, LSGD, Irrigation). Common subjects across all pools include:",
        ],
        list: [
          "Soil Mechanics & Foundation Engineering",
          "Structural Analysis and Design (RCC, Steel)",
          "Fluid Mechanics and Hydraulics",
          "Transportation Engineering (Roads, Railways)",
          "Surveying (Chain, Compass, Theodolite, Total Station)",
          "Construction Materials and Technology",
          "Environmental Engineering (Water Supply, Sanitation)",
          "Estimating, Costing and Specifications",
        ],
      },
      {
        heading: "4. Build a 3-Month Study Plan",
        body: ["A structured 3-month plan is ideal for most aspirants. Here is a proven roadmap:"],
        list: [
          "Month 1 — Foundation: Cover all core subjects at basic level. Focus on formulas, definitions and standard values.",
          "Month 2 — Practice: Solve previous year questions chapter-wise. Attempt topic-wise mock tests daily.",
          "Month 3 — Revision + Mock Tests: Full-length mock tests every alternate day. Revise weak areas in between.",
        ],
      },
      { isCTA: true },
      {
        heading: "5. Solve Previous Year Question Papers",
        body: [
          "Previous year PSC Civil Engineering papers are the single most valuable resource. Kerala PSC repeats question patterns frequently. Solving at least 10 years of previous papers gives you a clear picture of high-weightage topics and recurring question types.",
        ],
      },
      {
        heading: "6. Take Regular Mock Tests",
        body: [
          "Mock tests serve two purposes: they simulate exam pressure and reveal your weak spots. Aim for at least 3 full-length mock tests per week in the final month. Analyze each test carefully — track which topics cost you marks and focus revision there.",
        ],
      },
      {
        heading: "7. Manage Time During the Exam",
        body: [
          "With 100 questions in 75 minutes, you have about 45 seconds per question. Strategy: attempt easy questions first, mark uncertain ones, skip what you do not know. Never guess randomly — negative marking applies.",
        ],
      },
      {
        heading: "Final Tip",
        body: [
          "Consistency matters more than intensity. 2–3 focused hours daily over 3 months beats cramming a week before the exam. Join a structured platform that gives you pool-mapped content, live classes, and regular mock tests to stay on track.",
        ],
      },
    ],
  },

  // ─── 2 ──────────────────────────────────────────────────────────────────────
  {
    slug: "top-100-psc-civil-questions",
    title: "Top 100 Kerala PSC Civil Engineering Questions with Answers | 2025",
    description:
      "Practice the most important 100 Kerala PSC Civil Engineering questions with answers. Covers Soil Mechanics, Structures, Hydraulics, Surveying and more — for ITI, Diploma and B.Tech levels.",
    excerpt:
      "100 must-practice questions for Kerala PSC Civil Engineering. Covers all major subjects with answers — ideal for ITI, Diploma and AE aspirants.",
    keywords: [
      "kerala psc civil engineering questions",
      "psc civil questions and answers",
      "top psc civil questions kerala",
      "psc civil mock questions 2025",
      "civil engineering psc questions answers",
    ],
    date: "April 5, 2025",
    readTime: "12 min read",
    category: "Question Bank",
    content: [
      {
        body: [
          "Based on analysis of the last 10 years of Kerala PSC Civil Engineering papers, we have compiled the most important questions across all major subjects. Practice these to build your exam readiness across ITI, Diploma and B.Tech levels.",
        ],
      },
      {
        heading: "Soil Mechanics & Foundation Engineering",
        list: [
          "The angle of internal friction of a soil is zero for — (a) Sand (b) Saturated clay (c) Gravel (d) Silt — Ans: (b) Saturated clay",
          "Standard Penetration Test (SPT) hammer weight is — (a) 55 kg (b) 63.5 kg (c) 70 kg (d) 50 kg — Ans: (b) 63.5 kg",
          "Coefficient of permeability of clay is typically — (a) 10⁻¹ cm/s (b) 10⁻⁴ cm/s (c) 10⁻⁷ cm/s (d) 10⁻² cm/s — Ans: (c) 10⁻⁷ cm/s",
          "Compaction of soil is done to increase — (a) Permeability (b) Porosity (c) Density (d) Void ratio — Ans: (c) Density",
          "A soil with liquid limit 40% and plastic limit 20% has plasticity index of — (a) 60 (b) 20 (c) 40 (d) 80 — Ans: (b) 20",
          "Quick sand condition occurs when upward seepage pressure equals — (a) Unit weight of water (b) Submerged unit weight of soil (c) Effective stress (d) Total stress — Ans: (b) Submerged unit weight of soil",
          "Optimum moisture content is the water content at which soil attains — (a) Maximum void ratio (b) Maximum dry density (c) Zero air voids (d) Maximum permeability — Ans: (b) Maximum dry density",
        ],
      },
      {
        heading: "Structural Engineering (RCC & Steel)",
        list: [
          "Characteristic strength of M20 concrete is — (a) 15 N/mm² (b) 20 N/mm² (c) 25 N/mm² (d) 30 N/mm² — Ans: (b) 20 N/mm²",
          "In a simply supported beam, maximum bending moment occurs at — (a) Support (b) Midspan (c) Quarter span (d) Three-quarter span — Ans: (b) Midspan",
          "Minimum clear cover for RCC slab as per IS 456 is — (a) 15 mm (b) 20 mm (c) 25 mm (d) 30 mm — Ans: (a) 15 mm",
          "Development length for Fe415 steel in M20 concrete (tension) is — (a) 40d (b) 47d (c) 35d (d) 50d — Ans: (b) 47d",
          "Modular ratio for M20 concrete as per IS 456 is — (a) 13.33 (b) 10 (c) 15 (d) 11 — Ans: (a) 13.33",
          "The slenderness ratio of a column is the ratio of — (a) Length to width (b) Effective length to least radius of gyration (c) Height to cross-section area (d) Load to area — Ans: (b) Effective length to least radius of gyration",
          "Water-cement ratio in concrete primarily affects — (a) Workability only (b) Strength and durability (c) Setting time only (d) Volume change — Ans: (b) Strength and durability",
        ],
      },
      { isCTA: true },
      {
        heading: "Hydraulics & Fluid Mechanics",
        list: [
          "Bernoulli's equation applies to — (a) Compressible viscous flow (b) Incompressible inviscid steady flow (c) Turbulent flow only (d) Compressible flow only — Ans: (b) Incompressible inviscid steady flow",
          "Manning's roughness coefficient 'n' for smooth concrete pipe is approximately — (a) 0.012 (b) 0.025 (c) 0.015 (d) 0.010 — Ans: (a) 0.012",
          "Pressure at 10 m depth in water is — (a) 98.1 kPa (b) 100 kPa (c) 9.81 kPa (d) 10 kPa — Ans: (a) 98.1 kPa",
          "Hydraulic gradient line (HGL) in pipe flow is — (a) Above energy line (b) Below energy line (c) Same as energy line (d) Parallel to pipe — Ans: (b) Below energy line",
          "The velocity of flow in a pipe is measured by a — (a) Pitot tube (b) Venturimeter (c) Orifice plate (d) All of the above — Ans: (d) All of the above",
          "Critical depth in open channel flow occurs when Froude number equals — (a) 0 (b) 0.5 (c) 1 (d) 2 — Ans: (c) 1",
          "Darcy-Weisbach friction factor for laminar flow in pipes depends on — (a) Roughness only (b) Reynolds number only (c) Both roughness and Reynolds number (d) Velocity only — Ans: (b) Reynolds number only",
        ],
      },
      {
        heading: "Surveying",
        list: [
          "Error eliminated by double centering in a theodolite is — (a) Index error (b) Eccentricity (c) Collimation error (d) Line of sight — Ans: (c) Collimation error",
          "Magnetic bearing 48°30' with declination 3°30'E gives true bearing — (a) 45°00' (b) 52°00' (c) 48°00' (d) 51°30' — Ans: (b) 52°00'",
          "Prismatic compass gives — (a) Whole circle bearing (b) Quadrantal bearing (c) Reduced bearing (d) Both a and b — Ans: (a) Whole circle bearing",
          "Contour interval is the — (a) Horizontal distance between contours (b) Vertical distance between contours (c) Slope of terrain (d) None — Ans: (b) Vertical distance between contours",
          "Cross-staff in chain surveying is used to — (a) Measure chain length (b) Set out right angles (c) Determine bearing (d) Mark stations — Ans: (b) Set out right angles",
          "The ratio of map distance to ground distance is called — (a) Contour gradient (b) Representative fraction (c) Bearing ratio (d) Index — Ans: (b) Representative fraction",
        ],
      },
      {
        heading: "Transportation Engineering",
        list: [
          "Ruling gradient on NH in plain terrain as per IRC is — (a) 1 in 30 (b) 1 in 20 (c) 1 in 33.3 (d) 1 in 15 — Ans: (a) 1 in 30",
          "CBR test is used to evaluate — (a) Soil shear strength (b) Pavement subgrade strength (c) Compressibility (d) Permeability — Ans: (b) Pavement subgrade strength",
          "Minimum radius of horizontal curve for NH in plain terrain is — (a) 90 m (b) 200 m (c) 360 m (d) 230 m — Ans: (c) 360 m",
          "Transition curves are used to — (a) Connect straight and curved sections (b) Reduce speed (c) Improve sight distance (d) Drain roads — Ans: (a) Connect straight and curved sections",
          "Water bound macadam roads use — (a) Bitumen (b) Cement (c) Water and screenings (d) Tar — Ans: (c) Water and screenings",
        ],
      },
      {
        heading: "Environmental Engineering",
        list: [
          "Removal of dissolved gases from water is called — (a) Coagulation (b) Aeration (c) Sedimentation (d) Filtration — Ans: (b) Aeration",
          "BOD of treated sewage effluent should not exceed — (a) 10 mg/L (b) 20 mg/L (c) 30 mg/L (d) 50 mg/L — Ans: (c) 30 mg/L",
          "Chlorination is done to achieve — (a) Taste improvement (b) Color removal (c) Disinfection (d) Softening — Ans: (c) Disinfection",
          "Per capita water demand for domestic use in India is approximately — (a) 85 lpcd (b) 135 lpcd (c) 200 lpcd (d) 50 lpcd — Ans: (b) 135 lpcd",
          "The self-purification of a river is mainly due to — (a) Dilution (b) Oxidation (c) Sedimentation (d) All of the above — Ans: (d) All of the above",
        ],
      },
      {
        body: [
          "These questions represent the core pattern of Kerala PSC Civil Engineering papers. For full-length mock tests with 100 questions, detailed explanations, and performance analytics, practice on the CivilEzy platform — Kerala's only Civil PSC-specific preparation tool.",
        ],
      },
    ],
  },

  // ─── 3 ──────────────────────────────────────────────────────────────────────
  {
    slug: "best-books-for-psc-civil-kerala",
    title: "Best Books for Kerala PSC Civil Engineering Preparation 2025",
    description:
      "Complete booklist for Kerala PSC Civil Engineering preparation in 2025. Recommended books for ITI Overseer, Diploma Overseer and B.Tech AE levels — with subject-wise recommendations.",
    excerpt:
      "The definitive booklist for Kerala PSC Civil Engineering. Subject-wise recommendations for ITI, Diploma and B.Tech AE aspirants — avoid buying the wrong books.",
    keywords: [
      "best books for kerala psc civil engineering",
      "psc civil books 2025",
      "kerala psc civil preparation books",
      "civil engineering psc reference books",
      "diploma psc civil books kerala",
    ],
    date: "March 28, 2025",
    readTime: "6 min read",
    category: "Resources",
    content: [
      {
        body: [
          "Choosing the right books is critical for Kerala PSC Civil Engineering preparation. The biggest mistake aspirants make is studying from general engineering textbooks that cover far more than what PSC tests. This guide lists the most relevant books for each qualification level.",
        ],
      },
      {
        heading: "For All Levels — Must-Have",
        list: [
          "Kerala PSC Civil Engineering: Previous Year Solved Papers — Most important resource regardless of level.",
          "IS Code Handbook for Civil Engineering — Standard values tested frequently in PSC exams.",
          "R.S. Aggarwal: Quantitative Aptitude — For General Aptitude sections.",
          "Kerala PSC GK and Current Affairs (Annual Edition) — For the General Knowledge component.",
        ],
      },
      {
        heading: "Books for ITI Level Preparation",
        body: ["At ITI level, questions focus on practical civil engineering concepts at trade level:"],
        list: [
          "ITI Civil Draughtsman / Overseer Trade Theory — NIMI publications",
          "Building Construction by B.C. Punmia — For construction materials and technology",
          "Surveying Volume 1 by B.C. Punmia — For basic surveying topics",
          "Kerala PWD Schedule of Rates — For estimating and costing questions",
          "Basic Civil Engineering by S.S. Bhavikatti — Clear fundamentals explanation",
        ],
      },
      {
        heading: "Books for Diploma Level Preparation",
        body: ["Diploma level covers intermediate civil engineering subjects at the right depth:"],
        list: [
          "Soil Mechanics and Foundation Engineering by K.R. Arora — Clear explanations with numericals",
          "Strength of Materials by R.K. Bansal — Standard structural reference",
          "Fluid Mechanics by R.K. Bansal — Comprehensive hydraulics coverage",
          "Surveying by B.C. Punmia (Vol 1 & 2) — All surveying topics tested in PSC",
          "Transportation Engineering by Khanna and Justo — Highway engineering topics",
          "Environmental Engineering by B.C. Punmia — Water supply and sanitation",
          "Estimating, Costing and Valuation by B.N. Datta — Practical estimation questions",
        ],
      },
      { isCTA: true },
      {
        heading: "Books for B.Tech AE Level Preparation",
        body: ["Assistant Engineer level questions go deeper into theory and design:"],
        list: [
          "Soil Mechanics and Foundation Engineering by K.R. Arora — Detailed theoretical coverage",
          "Theory of Structures by S.P. Gupta and G.S. Pandit — Structural analysis",
          "Design of RCC Structures by B.C. Punmia — IS 456-based design problems",
          "Design of Steel Structures by L.S. Negi — Steel structures",
          "Fluid Mechanics and Machinery by Modi and Seth — Advanced hydraulics",
          "Transportation Engineering by S.K. Khanna — Comprehensive road and traffic topics",
          "Environmental Engineering (Vol 1 & 2) by B.C. Punmia — In-depth coverage",
          "Surveying (Vol 1, 2 & 3) by B.C. Punmia — Full coverage for AE level",
        ],
      },
      {
        heading: "For Surveyor Posts",
        list: [
          "Surveying by B.C. Punmia (All volumes) — Primary reference",
          "Land Laws of Kerala — For Survey and Land Records posts",
          "Total Station and GPS Surveying by Yadav — Modern survey instruments",
          "Kerala Land Reforms Act — Essential for Land Records department posts",
        ],
      },
      {
        heading: "Quality Over Quantity",
        body: [
          "You do not need every book on this list. Pick one standard reference per subject and master it completely. Supplement with previous year PSC papers and topic-wise mock tests. PSC exams test standard concepts — not obscure theories. A well-practiced aspirant who has solved 1000+ PSC-specific questions will always outperform someone who has read 10 textbooks without practice.",
        ],
      },
    ],
  },

  // ─── 4 ──────────────────────────────────────────────────────────────────────
  {
    slug: "psc-civil-mock-test-free",
    title: "Free Kerala PSC Civil Engineering Mock Test | Practice Online 2025",
    description:
      "Practice free Kerala PSC Civil Engineering mock tests online. Topic-wise and full-length tests for KWA, PWD, LSGD and Irrigation departments. Improve accuracy and speed before your exam.",
    excerpt:
      "Why mock tests are the fastest path to cracking Kerala PSC Civil — and how to use them effectively. Free practice available on CivilEzy.",
    keywords: [
      "kerala psc civil mock test free",
      "psc civil mock test online",
      "civil engineering psc practice test",
      "free psc civil questions kerala",
      "psc civil online test 2025",
    ],
    date: "April 1, 2025",
    readTime: "5 min read",
    category: "Mock Tests",
    content: [
      {
        body: [
          "Mock tests are the single most effective tool for Kerala PSC Civil Engineering preparation. Yet most aspirants spend 80% of their time reading and only 20% practicing. The ratio should be reversed — especially in the final 4–6 weeks before the exam.",
        ],
      },
      {
        heading: "Why Mock Tests Matter for Kerala PSC",
        list: [
          "Exam simulation — PSC exams have strict time limits. Mock tests train your brain to work under pressure — something no textbook can do.",
          "Pattern recognition — PSC repeats question patterns across years. Regular mock tests help you spot these patterns faster.",
          "Negative marking awareness — Kerala PSC deducts 1/3 mark per wrong answer. Mock tests teach you when to attempt and when to skip.",
          "Weak area identification — After each test, you know exactly which subjects cost you marks so you can target revision efficiently.",
          "Confidence building — Walking into the exam having solved 50+ mock tests is a completely different experience from walking in unprepared.",
        ],
      },
      {
        heading: "Types of Mock Tests You Should Practice",
        list: [
          "Topic-wise tests — 20–30 questions per subject. Use these right after finishing a chapter to test retention immediately.",
          "Pool-specific tests — KWA, PWD, LSGD and Irrigation each have slightly different emphasis. Practice pool-specific tests for your target department.",
          "Full-length tests — 100 questions in 75 minutes. Simulate the real exam. Attempt at least 10–15 full-length tests before your exam.",
          "Speed tests — 50 questions in 30 minutes. Train your reading speed and quick decision-making.",
          "Previous year papers — Treat each past paper as a mock test: timed, no breaks, followed by a full analysis.",
        ],
      },
      { isCTA: true },
      {
        heading: "How to Analyze a Mock Test",
        body: ["Taking a test is only half the work. Analysis is where the real learning happens:"],
        list: [
          "Review every wrong answer — understand why (knowledge gap, calculation error, misreading the question).",
          "Review every skipped question — could you have attempted it? If yes, note the topic for revision.",
          "Review every correct answer — were you confident or did you guess? Correct guesses build false confidence.",
          "Note topics where you consistently lose marks — these become priority revision areas.",
          "Track your score trend — if you are not improving, your study strategy needs adjustment.",
        ],
      },
      {
        heading: "Mock Test Strategy by Time to Exam",
        list: [
          "6+ months away: 1 full-length test per week, 3–4 topic tests per week",
          "3–6 months away: 2 full-length tests per week, daily topic tests",
          "1–3 months away: 3–4 full-length tests per week, pool-specific tests",
          "Final month: Full-length test every alternate day, weak-area revision",
          "Final week: 1 light mock test for confidence, then revision only",
        ],
      },
      {
        heading: "Free Mock Tests on CivilEzy",
        body: [
          "CivilEzy offers Kerala-specific PSC Civil Engineering mock tests mapped to the exact pool syllabus. The platform provides topic-wise tests, full-length tests, detailed explanations, and performance analytics — so you know exactly where you stand and what to fix before exam day.",
        ],
      },
    ],
  },

  // ─── 5 ──────────────────────────────────────────────────────────────────────
  {
    slug: "psc-civil-syllabus-kerala",
    title: "Kerala PSC Civil Engineering Syllabus 2025 | ITI, Diploma & B.Tech",
    description:
      "Complete Kerala PSC Civil Engineering syllabus for ITI Overseer, Diploma Overseer and B.Tech Assistant Engineer levels. Pool-wise topic breakdown for KWA, PWD, LSGD and Irrigation departments.",
    excerpt:
      "The complete Kerala PSC Civil Engineering syllabus for 2025 — pool-wise and level-wise breakdown for ITI, Diploma and B.Tech aspirants.",
    keywords: [
      "kerala psc civil engineering syllabus 2025",
      "kerala psc civil syllabus",
      "psc civil syllabus iti diploma btech",
      "kerala psc civil engineering topics",
      "psc civil pool syllabus kerala",
    ],
    date: "March 20, 2025",
    readTime: "7 min read",
    category: "Syllabus",
    content: [
      {
        body: [
          "The Kerala PSC Civil Engineering syllabus varies based on your qualification level and the pool (department group) you are applying for. This guide provides a complete, consolidated syllabus breakdown for all levels — so you can plan your preparation without guessing what to study.",
        ],
      },
      {
        heading: "How Kerala PSC Civil Syllabus is Structured",
        body: [
          "Kerala PSC releases notifications pool-wise. A pool refers to a group of similar departments — for example, the PWD & Irrigation pool or the KWA pool. Each pool may have a slightly different emphasis, but the core civil engineering subjects are common across all pools.",
        ],
      },
      {
        heading: "Core Subjects — Common to All Levels",
        list: [
          "Soil Mechanics and Foundation Engineering",
          "Strength of Materials and Structural Analysis",
          "Concrete Technology and RCC Design",
          "Fluid Mechanics and Hydraulics",
          "Surveying (Chain, Compass, Theodolite, Levelling, Contouring)",
          "Transportation Engineering (Roads, Railways, Airports)",
          "Construction Materials and Technology",
          "Estimating, Costing and Valuation",
          "Environmental Engineering (Water Supply and Sanitation)",
          "Building Construction and Drawing",
        ],
      },
      {
        heading: "ITI Level Syllabus",
        body: ["For Overseer Gr. 2 & 3, Draughtsman, Tradesman posts — focus is on practical trade-level knowledge:"],
        list: [
          "Building materials: bricks, cement, aggregate, sand, timber, steel — types and properties",
          "Plain and reinforced concrete basics",
          "Basic structural elements: beams, columns, slabs, footings",
          "Chain surveying, ranging, offsets; compass surveying basics",
          "Levelling: types of levels, staff readings, booking",
          "Road construction: earthwork, WBM, bituminous roads",
          "Basic water supply: sources, purification, distribution",
          "Drainage and sanitation fundamentals",
          "Estimating and costing: area, volume, rate analysis",
          "Technical drawing: plan, elevation, section, AutoCAD basics",
        ],
      },
      { isCTA: true },
      {
        heading: "Diploma Level Syllabus",
        body: ["For Diploma Overseer posts — deeper theory and design concepts:"],
        list: [
          "Soil Mechanics: classification, index properties, compaction, consolidation, shear strength, bearing capacity",
          "Structural Analysis: beams, trusses, frames, influence lines",
          "RCC Design: IS 456, beams, slabs, columns, footings, retaining walls",
          "Hydraulics: Bernoulli's theorem, pipe flow, open channel flow, hydraulic structures",
          "Surveying: theodolite traversing, tacheometry, triangulation, contouring",
          "Highway Engineering: IRC standards, pavement design, traffic engineering",
          "Construction management: CPM, PERT, contract documents",
          "Water supply: pipe hydraulics, pumps, distribution systems",
          "Sewage treatment: BOD, COD, treatment processes",
          "Steel structures: beams, columns, connections",
        ],
      },
      {
        heading: "B.Tech AE Level Syllabus",
        body: ["For Assistant Engineer posts — advanced design and analysis:"],
        list: [
          "Advanced Soil Mechanics: settlement analysis, slope stability, earth pressure theories (Rankine, Coulomb)",
          "Advanced Structural Analysis: matrix methods, plastic analysis",
          "Advanced RCC and Prestressed Concrete: IS 1343, pre-tensioning, post-tensioning",
          "Advanced Hydraulics: hydraulic machines, pump selection, pipe network analysis",
          "Irrigation Engineering: canal design, head works, diversion structures",
          "Bridge Engineering: IRC loadings, components and analysis",
          "Remote Sensing and GIS basics",
          "Advanced Highway and Traffic Engineering",
          "Environmental Impact Assessment, water quality standards",
          "Project management, tendering, CPWD/PWD contract conditions",
        ],
      },
      {
        heading: "Surveyor Post Syllabus",
        body: ["Surveyor grade posts (KWA, Survey & Land Records, Technical Education, Groundwater) have a specialized syllabus:"],
        list: [
          "Fundamentals of surveying: chain, compass, plane table, levelling",
          "Theodolite and total station surveying",
          "GPS and satellite-based positioning systems",
          "Map projections and coordinate systems",
          "Remote sensing and photogrammetry",
          "Land records and land laws of Kerala",
          "Kerala Survey Act and rules",
          "Area and volume calculations, earthwork computations",
        ],
      },
      {
        heading: "General Knowledge Component",
        body: [
          "Most Kerala PSC Civil exams include 20–30 marks of General Knowledge — Kerala current affairs, India and world GK, Science basics, and Constitution. Do not ignore this section. It can be the difference between selection and the waitlist.",
        ],
      },
    ],
  },
];

export function getBlogBySlug(slug: string): BlogPost | undefined {
  return BLOGS.find((b) => b.slug === slug);
}

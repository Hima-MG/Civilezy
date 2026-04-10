export interface BlogPost {
  slug:        string;
  title:       string;
  description: string;
  date:        string;
  readTime:    string;
  category:    string;
  keywords:    string[];
  content:     BlogSection[];
}

export interface BlogSection {
  type:     "h2" | "h3" | "p" | "ul" | "cta-inline" | "tip";
  text?:    string;
  items?:   string[];
  linkText?: string;
  linkHref?: string;
}

export const BLOG_POSTS: BlogPost[] = [
  // ─── POST 1 ───────────────────────────────────────────────────────
  {
    slug:        "kerala-psc-civil-engineering-syllabus-2025",
    title:       "Kerala PSC Civil Engineering Syllabus 2025 — Complete Guide (ITI, Diploma & AE)",
    description: "Full breakdown of the Kerala PSC Civil Engineering syllabus for ITI, Diploma and Assistant Engineer (AE) levels. Topics, weightage, and smart preparation tips.",
    date:        "2026-04-01",
    readTime:    "8 min read",
    category:    "Syllabus Guide",
    keywords:    [
      "Kerala PSC Civil Engineering syllabus",
      "PSC AE syllabus 2025",
      "Diploma Civil PSC syllabus",
      "ITI Civil PSC topics",
      "Kerala PSC civil exam pattern",
    ],
    content: [
      {
        type: "p",
        text: "The Kerala PSC Civil Engineering exam is one of the most competitive technical exams in Kerala. Whether you are preparing for the ITI Grade, Diploma Overseer, or the coveted Assistant Engineer (AE) post, understanding the exact syllabus is the first step to a confident preparation.",
      },
      {
        type: "h2",
        text: "Understanding the Pool-Based System",
      },
      {
        type: "p",
        text: "Kerala PSC follows a strict pool-based recruitment system. Your rank is compared only within your qualification pool — ITI pool, Diploma pool, or Degree/AE pool. This means you do not compete with candidates from other qualification levels.",
      },
      {
        type: "ul",
        items: [
          "ITI Pool — Posts like KWA Helper, PWD Mazdoor, LSGD Workshop Attendant",
          "Diploma Pool — Posts like Overseer Grade II, Site Supervisor, Technical Assistant",
          "Degree/AE Pool — Posts like Assistant Engineer in KWA, PWD, LSGD, KSEB",
        ],
      },
      {
        type: "h2",
        text: "ITI Civil PSC Syllabus",
      },
      {
        type: "p",
        text: "The ITI level exam covers fundamental civil engineering concepts. Questions are based on the ITI Civil Trade syllabus and general engineering knowledge.",
      },
      {
        type: "h3",
        text: "Core Technical Topics",
      },
      {
        type: "ul",
        items: [
          "Building Materials — Bricks, cement, sand, aggregate, timber, steel",
          "Building Construction — Foundation types, masonry, flooring, plastering",
          "Basic Surveying — Chain survey, compass survey, levelling basics",
          "Concrete Technology — Mix design, workability, curing, IS 456 basics",
          "Roads and Highways — Road types, WBM, bituminous construction",
          "Water Supply — Sources, treatment basics, pipe materials",
          "Environmental Engineering — Sewage disposal, sanitation basics",
        ],
      },
      {
        type: "tip",
        text: "💡 Pro Tip: For ITI level, focus heavily on Building Materials and Concrete Technology. These two topics together account for over 35% of questions in recent PSC papers.",
      },
      {
        type: "h2",
        text: "Diploma Civil PSC Syllabus",
      },
      {
        type: "p",
        text: "Diploma level exams are significantly more technical. The PSC expects candidates to have a strong grasp of core engineering subjects taught at the polytechnic level.",
      },
      {
        type: "h3",
        text: "Structural Engineering Topics",
      },
      {
        type: "ul",
        items: [
          "RCC Design — Beams, slabs, columns as per IS 456",
          "Steel Structures — Riveted and welded joints, tension and compression members",
          "Structural Analysis — Bending moment diagrams, deflection, influence lines",
          "Soil Mechanics — Shear strength, consolidation, bearing capacity",
          "Foundation Engineering — Shallow and deep foundations, pile design",
        ],
      },
      {
        type: "h3",
        text: "Civil Engineering Services Topics",
      },
      {
        type: "ul",
        items: [
          "Fluid Mechanics — Bernoulli's equation, flow measurement, pipe flow",
          "Irrigation Engineering — Canal design, duty and delta, weirs",
          "Transportation Engineering — Highway design, CBR, bitumen grades",
          "Estimation and Costing — BOQ preparation, rate analysis",
          "Surveying and Levelling — Theodolite, total station, contour",
        ],
      },
      {
        type: "cta-inline",
        text: "Practice Diploma-level mock tests on CivilEzy's Game Arena — 5,800+ questions mapped to the exact PSC pool.",
        linkText: "Try Game Arena →",
        linkHref: "/game-arena",
      },
      {
        type: "h2",
        text: "AE / B.Tech PSC Syllabus",
      },
      {
        type: "p",
        text: "The Assistant Engineer exam is the most advanced level in Kerala PSC Civil Engineering. Questions test deep knowledge of IS codes, design principles, and project management.",
      },
      {
        type: "ul",
        items: [
          "Advanced Structural Analysis — Matrix methods, plastic analysis, influence lines",
          "RCC and Pre-stressed Concrete — Limit state design, prestress losses",
          "Geotechnical Engineering — Stability analysis, retaining walls, earth pressure",
          "Hydrology and Water Resources — Flood routing, runoff estimation, dam design",
          "Environmental Engineering — STP design, EIA, waste management",
          "Highway Engineering — Pavement design, IRC codes, traffic engineering",
          "Project Management — CPM, PERT, cost control",
          "IS Code Knowledge — IS 456, IS 800, IS 875, IS 1893",
        ],
      },
      {
        type: "h2",
        text: "Exam Pattern and Marks Distribution",
      },
      {
        type: "p",
        text: "Most Kerala PSC Civil Engineering exams follow a standard 100-question, 100-mark pattern. Questions are objective type (MCQ) with negative marking of one-third mark for wrong answers.",
      },
      {
        type: "ul",
        items: [
          "Total Questions: 100 (OMR-based)",
          "Total Marks: 100",
          "Duration: 75 minutes",
          "Negative Marking: -0.33 per wrong answer",
          "Medium: English (some papers bilingual)",
        ],
      },
      {
        type: "h2",
        text: "Smart Preparation Strategy",
      },
      {
        type: "p",
        text: "Knowing the syllabus is step one. A structured preparation plan is what separates rank holders from those who just attempt the exam. Here is a proven 90-day preparation framework used by CivilEzy students.",
      },
      {
        type: "ul",
        items: [
          "Days 1–30: Cover all core technical subjects topic by topic",
          "Days 31–60: Subject-wise topic tests — minimum 20 questions per topic",
          "Days 61–80: Full mock tests with timer (simulate real exam)",
          "Days 81–90: Revision of weak subjects, previous year papers analysis",
        ],
      },
      {
        type: "tip",
        text: "💡 CivilEzy tracks your weak subjects automatically after every quiz. Students who use the Smart Analytics dashboard score 43% higher on average within 30 days.",
      },
    ],
  },

  // ─── POST 2 ───────────────────────────────────────────────────────
  {
    slug:        "kwa-ae-2025-exam-preparation-guide",
    title:       "KWA AE 2025 Exam Preparation Guide — Strategy, Syllabus & Mock Tests",
    description: "Complete preparation guide for KWA Assistant Engineer (Civil) 2025. Syllabus, exam pattern, important topics, and the fastest preparation strategy.",
    date:        "2026-03-20",
    readTime:    "7 min read",
    category:    "Exam Guide",
    keywords:    [
      "KWA AE 2025",
      "KWA Assistant Engineer Kerala",
      "KWA AE syllabus",
      "Kerala Water Authority exam",
      "PSC AE preparation",
    ],
    content: [
      {
        type: "p",
        text: "The Kerala Water Authority (KWA) Assistant Engineer (Civil) notification for 2025 has been released with 47 vacancies. This is one of the most sought-after posts in Kerala PSC — a permanent government job with excellent pay scale and growth prospects.",
      },
      {
        type: "h2",
        text: "KWA AE 2025 — Key Details",
      },
      {
        type: "ul",
        items: [
          "Post: Assistant Engineer (Civil) — KWA",
          "Vacancies: 47",
          "Pay Scale: ₹42,500 – ₹87,000 (PB 5)",
          "Qualification: B.Tech / BE Civil Engineering",
          "Last Date: January 31, 2025",
          "Exam Date: Expected March–May 2025",
        ],
      },
      {
        type: "h2",
        text: "KWA AE Exam Pattern",
      },
      {
        type: "p",
        text: "The KWA AE exam follows the standard Kerala PSC degree-level technical paper format. Understanding the exact pattern helps you allocate preparation time wisely.",
      },
      {
        type: "ul",
        items: [
          "Total Questions: 100 MCQ",
          "Total Marks: 100",
          "Duration: 75 minutes",
          "Negative Marking: -0.33 per wrong answer",
          "Technical Questions: ~80% (civil engineering topics)",
          "General Questions: ~20% (GK, current affairs, aptitude)",
        ],
      },
      {
        type: "h2",
        text: "Important Topics for KWA AE",
      },
      {
        type: "p",
        text: "KWA AE papers historically focus heavily on water supply, hydraulics, environmental engineering, and structural topics. Based on analysis of previous KWA papers available on CivilEzy.",
      },
      {
        type: "h3",
        text: "High-Weightage Topics (40–50% of paper)",
      },
      {
        type: "ul",
        items: [
          "Water Supply Engineering — Source development, treatment, distribution design",
          "Fluid Mechanics and Hydraulics — Pipe flow, pump selection, Bernoulli applications",
          "Environmental Engineering — Water quality standards, sewage treatment",
          "Sanitary Engineering — Plumbing, drainage, IS codes",
        ],
      },
      {
        type: "h3",
        text: "Medium-Weightage Topics (30–40% of paper)",
      },
      {
        type: "ul",
        items: [
          "RCC Design — Beams, slabs, water retaining structures (IS 3370)",
          "Soil Mechanics and Foundation Engineering",
          "Surveying — Levelling, setting out, GPS basics",
          "Estimation and Project Management",
        ],
      },
      {
        type: "h3",
        text: "Low-Weightage Topics (10–20% of paper)",
      },
      {
        type: "ul",
        items: [
          "Transportation Engineering",
          "Steel Structures",
          "Irrigation Engineering",
          "General Aptitude and Current Affairs",
        ],
      },
      {
        type: "cta-inline",
        text: "CivilEzy has 95 KWA AE-specific mock tests built from previous paper analysis. Start with a free test now.",
        linkText: "Take KWA AE Mock Test →",
        linkHref: "/mock-tests",
      },
      {
        type: "h2",
        text: "90-Day KWA AE Preparation Plan",
      },
      {
        type: "h3",
        text: "Month 1: Foundation Building",
      },
      {
        type: "ul",
        items: [
          "Week 1–2: Water Supply and Environmental Engineering (highest weightage)",
          "Week 3: Fluid Mechanics and Hydraulics (30 questions minimum per topic)",
          "Week 4: RCC Design and Structural Analysis basics",
        ],
      },
      {
        type: "h3",
        text: "Month 2: Deep Practice",
      },
      {
        type: "ul",
        items: [
          "Week 5–6: Topic-wise tests for all high-weightage subjects",
          "Week 7: Full mock exam (first attempt — identify weak areas)",
          "Week 8: Focused revision on weak subjects from analytics",
        ],
      },
      {
        type: "h3",
        text: "Month 3: Exam Simulation",
      },
      {
        type: "ul",
        items: [
          "Week 9–10: Two full mock exams per week (timed, exam conditions)",
          "Week 11: Previous year KWA AE paper analysis",
          "Week 12: Final revision, IS code quick reference, confidence building",
        ],
      },
      {
        type: "tip",
        text: "💡 Previous KWA AE toppers on CivilEzy averaged 4.2 mock tests per week in the final month. Consistency > intensity.",
      },
      {
        type: "h2",
        text: "IS Codes Important for KWA AE",
      },
      {
        type: "ul",
        items: [
          "IS 456:2000 — Plain and Reinforced Concrete",
          "IS 3370 — Water Retaining Structures",
          "IS 10500 — Drinking Water Quality Standards",
          "IS 1893 — Seismic Design",
          "IS 875 — Structural Loading",
          "IS 800 — Steel Structures",
        ],
      },
    ],
  },

  // ─── POST 3 ───────────────────────────────────────────────────────
  {
    slug:        "how-to-crack-kerala-psc-civil-engineering-first-attempt",
    title:       "How to Crack Kerala PSC Civil Engineering in First Attempt (2025 Strategy)",
    description: "Proven strategy to crack Kerala PSC Civil Engineering exam in the first attempt. Study plan, important topics, mock test schedule and mindset tips from rank holders.",
    date:        "2026-03-10",
    readTime:    "9 min read",
    category:    "Strategy",
    keywords:    [
      "crack Kerala PSC Civil Engineering",
      "PSC Civil Engineering first attempt",
      "Kerala PSC civil preparation tips",
      "PSC exam strategy 2025",
      "ITI Diploma AE PSC tips",
    ],
    content: [
      {
        type: "p",
        text: "Every year, thousands of Civil Engineering candidates appear for Kerala PSC exams. But less than 2% secure a rank in the first attempt. The difference is not intelligence — it is strategy. In this guide, we break down the exact approach used by CivilEzy rank holders to crack the exam in their very first try.",
      },
      {
        type: "h2",
        text: "Why Most Candidates Fail in the First Attempt",
      },
      {
        type: "ul",
        items: [
          "Studying from generic GATE/SSC material instead of Kerala PSC-specific content",
          "No clarity on which pool they belong to (ITI vs Diploma vs AE)",
          "Attempting all topics equally instead of focusing on high-weightage areas",
          "Zero mock test practice before the actual exam",
          "Studying without a structured plan — random topic jumping",
        ],
      },
      {
        type: "h2",
        text: "Step 1 — Know Your Pool, Know Your Exam",
      },
      {
        type: "p",
        text: "The biggest mistake candidates make is not understanding the pool-based system. Your ITI qualification means you compete only with other ITI holders. Your Diploma means you compete with Diploma holders. Mixing up preparation material is the fastest way to fail.",
      },
      {
        type: "tip",
        text: "💡 Before opening any study material, confirm your exact pool and the posts available in that pool. CivilEzy maps every question to the exact pool — this is something no generic platform does.",
      },
      {
        type: "h2",
        text: "Step 2 — Get the Right Study Material",
      },
      {
        type: "p",
        text: "Kerala PSC Civil Engineering exams have a very specific style. Questions are often application-based, IS code-referenced, and occasionally have a Kerala-specific angle (KWA norms, PWD specifications). Generic content from national platforms misses all of this.",
      },
      {
        type: "ul",
        items: [
          "Use Kerala PSC previous year papers as the primary reference",
          "Study IS codes relevant to your pool — not all of them, the key ones",
          "Prefer bilingual resources if English is not your primary medium",
          "Video lessons of 40–50 minutes beat 3-hour lectures for retention",
        ],
      },
      {
        type: "h2",
        text: "Step 3 — The 60-20-20 Preparation Split",
      },
      {
        type: "p",
        text: "Rank holders consistently follow a 60-20-20 split in their preparation time. Adapting this split to your available daily hours makes the difference between confusion and clarity.",
      },
      {
        type: "ul",
        items: [
          "60% — Core technical topics (structured lesson by lesson, topic by topic)",
          "20% — Quiz practice and topic tests (minimum 20 questions per session)",
          "20% — Mock exams and revision (timed, exam conditions)",
        ],
      },
      {
        type: "cta-inline",
        text: "CivilEzy's Game Arena makes the 20% quiz practice addictive. XP, streaks, and daily challenges keep you consistent.",
        linkText: "Start Game Arena →",
        linkHref: "/game-arena",
      },
      {
        type: "h2",
        text: "Step 4 — Master Mock Tests (This is the Game Changer)",
      },
      {
        type: "p",
        text: "The single most impactful change you can make to your preparation is increasing mock test frequency. Not just attempting them — analysing every wrong answer.",
      },
      {
        type: "h3",
        text: "The Right Way to Use Mock Tests",
      },
      {
        type: "ul",
        items: [
          "Attempt the mock in real exam conditions — 75 minutes, no breaks",
          "After the test, spend equal time reviewing wrong answers",
          "Note every wrong answer's topic — this builds your weak area map",
          "Re-test the same topic with focused 20-question topic tests",
          "Repeat mock every 7–10 days to track score improvement",
        ],
      },
      {
        type: "tip",
        text: "💡 CivilEzy's analytics dashboard builds your weak area map automatically. Students who review analytics after every mock improve 43% faster than those who just attempt tests.",
      },
      {
        type: "h2",
        text: "Step 5 — The Streak System for Daily Consistency",
      },
      {
        type: "p",
        text: "The number one predictor of first-attempt success is daily study consistency. Not the number of hours per day — but the number of consecutive days you study without a break. Here is how top CivilEzy performers build unbreakable habits.",
      },
      {
        type: "ul",
        items: [
          "Set a non-negotiable daily minimum — even 10 questions counts as a streak day",
          "Use the CivilEzy streak tracker to visualise your consistency",
          "Never break a streak of 14+ days — the psychological momentum is priceless",
          "Study in the same place and time daily to build an automatic habit",
        ],
      },
      {
        type: "h2",
        text: "Week-by-Week 12-Week Plan for First Attempt",
      },
      {
        type: "ul",
        items: [
          "Week 1–3: Complete all high-weightage topics (lessons + 20Q topic tests)",
          "Week 4: First full mock test. Identify top 5 weak subjects.",
          "Week 5–7: Deep dive into weak subjects with focused topic tests",
          "Week 8: Second full mock test. Score should improve by 15–20%.",
          "Week 9–10: Daily 25Q practice sessions + one full mock per week",
          "Week 11: Previous year paper analysis. Note question patterns.",
          "Week 12: Final revision, IS code quick review, mental preparation",
        ],
      },
      {
        type: "h2",
        text: "What Rank Holders Say",
      },
      {
        type: "p",
        text: "Arjun Ravi, Rank 3 in KWA AE 2024: \"I used to study randomly from YouTube and Telegram groups. After switching to CivilEzy's structured pool-based content, everything became clear. The mock tests were so accurate that the real exam felt like a practice test.\"",
      },
      {
        type: "p",
        text: "Meera Krishnan, Rank 7 in PWD Overseer 2024: \"The streak feature on CivilEzy made me study every single day without fail. 21 days of consistency put me in the top 50 of the leaderboard. On exam day, I was calm because I had already seen every type of question.\"",
      },
      {
        type: "h2",
        text: "Final Checklist Before Exam Day",
      },
      {
        type: "ul",
        items: [
          "✓ Completed at least 8–10 full mock tests",
          "✓ Revised all IS codes relevant to your pool",
          "✓ Reviewed all wrong answers from last 3 mock tests",
          "✓ Know the exam hall location and reporting time",
          "✓ Sleep 8 hours the night before (no last-minute cramming)",
          "✓ Carry HB pencil, eraser, and admit card",
        ],
      },
    ],
  },
];

export function getBlogBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(p => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return BLOG_POSTS.map(p => p.slug);
}

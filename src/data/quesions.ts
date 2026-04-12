export type Domain     = "iti" | "diploma" | "btech";
export type Difficulty = "easy" | "medium" | "hard";

export interface Question {
  id:          string;
  domain:      Domain[];
  subject:     string;
  difficulty:  Difficulty;
  question:    string;
  options:     [string, string, string, string];
  correct:     0 | 1 | 2 | 3;
  explanation: string;
  xp:          number;
}

// ---------------------------------------------------------------------------
// SUBJECTS BY DOMAIN
// ---------------------------------------------------------------------------
export const SUBJECTS_BY_DOMAIN: Record<Domain, string[]> = {

  iti: [

    "Engineering Drawing & CAD",

    "Building Materials",

    "Building Construction",

    "Building Planning & Estimation",

    "Basic Surveying",

    "Advanced Surveying",

    "Hydraulics & Irrigation",

    "Mechanics & Mensuration",

    "Transportation Engineering",

    "Public Health & Sanitation",

    "RCC & Steel Structures",

    "Machine Drawing Elements",

    "Limits, Fit & Tolerance",

  ],

  diploma: [

    "Engineering Drawing & CAD",

    "Building Materials",

    "Construction Technology",

    "Building Planning & Byelaws",

    "Surveying",

    "Engineering Mechanics",

    "Structural Engineering",

    "Geotechnical & Foundation Engineering",

    "Water Resources & Hydraulics",

    "Environmental Engineering",

    "Transportation Engineering",

    "Estimation & Costing",

    "Machine Drawing Elements",

    "Limits, Fit & Tolerance",

  ],

  btech: [

    "Engineering Mechanics & Solid Mechanics",

    "Structural Analysis",

    "Structural Design",

    "Geotechnical Engineering",

    "Fluid Mechanics & Hydraulics",

    "Water Resources Engineering",

    "Environmental Engineering",

    "Surveying & Geomatics",

    "Estimation, Costing & Valuation",

    "Construction Engineering & Management",

    "Transportation Engineering",

    "Urban Planning",

    "Technical Mathematics",

  ],

};


// ---------------------------------------------------------------------------
// ADDON SUBJECTS — flat list per domain
// ---------------------------------------------------------------------------
export const ADDON_SUBJECTS: Record<Domain, string[]> = {
  iti: [
    "Advanced Engineering Mechanics",
    "Tunnel Engineering",
    "Building Planning Principles",
  ],
  diploma: [
    "Theory of Structures",
    "Geotechnical Engineering",
    "Foundation Engineering",
    "Advanced Environmental Engineering",
  ],
  btech: [
    "Air Pollution Control & Dispersion Modelling",
    "Noise & Industrial Pollution Control",
    "Solid & Hazardous Waste Management",
    "Environmental Law & Regulations",
    "Engineering Mathematics (AE PCB)",
    "Advanced Water Supply Engineering",
    "Advanced Wastewater Treatment & Reuse",
    "Urban & Regional Planning",
    "Basic Mechanical Engineering",
    "Basic Chemical Engineering",
    "Engineering Mathematics (Poly Lecturer)",
    "Basic Electrical Engineering",
    "Basic Electronics Engineering",
    "Construction Management (Advanced)",
    "Engineering Mathematics (Asst. Professor)",
    "Plastic Analysis & Matrix Methods",
    "Structural Dynamics",
    "GIS & Geoinformatics",
  ],
};

// ---------------------------------------------------------------------------
// ADDON SUBJECT GROUPS — for UI labelling by post name
// ---------------------------------------------------------------------------
export const ADDON_GROUPS: Partial<Record<Domain, { label: string; subjects: string[] }[]>> = {
  iti: [
    {
      label: "Junior Instructor / Training Instructor",
      subjects: [
        "Advanced Engineering Mechanics",
        "Tunnel Engineering",
        "Building Planning Principles",
      ],
    },
  ],
  diploma: [
    {
      label: "Overseer Civil / Site Engineer",
      subjects: [
        "Theory of Structures",
        "Geotechnical Engineering",
        "Foundation Engineering",
        "Advanced Environmental Engineering",
      ],
    },
  ],
  btech: [
    {
      label: "AE \u2013 Pollution Control Board",
      subjects: [
        "Air Pollution Control & Dispersion Modelling",
        "Noise & Industrial Pollution Control",
        "Solid & Hazardous Waste Management",
        "Environmental Law & Regulations",
        "Engineering Mathematics (AE PCB)",
      ],
    },
    {
      label: "AE \u2013 Kerala Water Authority",
      subjects: [
        "Advanced Water Supply Engineering",
        "Advanced Wastewater Treatment & Reuse",
        "Urban & Regional Planning",
        "Basic Mechanical Engineering",
        "Basic Chemical Engineering",
      ],
    },
    {
      label: "Lecturer Civil Engineering \u2013 Polytechnics",
      subjects: [
        "Engineering Mathematics (Poly Lecturer)",
        "Basic Electrical Engineering",
        "Basic Electronics Engineering",
        "Construction Management (Advanced)",
      ],
    },
    {
      label: "Assistant Professor Civil Engineering",
      subjects: [
        "Engineering Mathematics (Asst. Professor)",
        "Plastic Analysis & Matrix Methods",
        "Structural Dynamics",
        "GIS & Geoinformatics",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// DIFFICULTY COUNTS
// ---------------------------------------------------------------------------
export const DIFFICULTY_COUNTS: Record<Difficulty, number> = {
  easy:   25,
  medium: 50,
  hard:   25,
};

// ---------------------------------------------------------------------------
// QUESTIONS
// ---------------------------------------------------------------------------
export const QUESTIONS: Question[] = [
  // ─── Building Materials ──────────────────────────────────────────
  { id:"q01", domain:["iti","diploma"], subject:"Building Materials", difficulty:"easy",
    question:"The standard size of a modular brick in India is:",
    options:["190\u00d790\u00d790 mm","230\u00d7115\u00d775 mm","200\u00d7100\u00d7100 mm","220\u00d7110\u00d780 mm"],
    correct:0, xp:5,
    explanation:"Standard modular brick = 190\u00d790\u00d790 mm as per IS 1077. With mortar it becomes 200\u00d7100\u00d7100 mm." },

  { id:"q02", domain:["iti","diploma"], subject:"Building Materials", difficulty:"easy",
    question:"Which of the following is NOT a type of cement?",
    options:["Portland cement","Pozzolanic cement","Gypsum cement","High alumina cement"],
    correct:2, xp:5,
    explanation:"Gypsum is NOT a type of cement. It is added to clinker only to regulate setting time." },

  { id:"q03", domain:["iti","diploma"], subject:"Building Materials", difficulty:"medium",
    question:"The water-cement ratio most suitable for ordinary RCC work is:",
    options:["0.35\u20130.40","0.45\u20130.60","0.65\u20130.70","0.80\u20130.90"],
    correct:1, xp:10,
    explanation:"For ordinary RCC work, a w/c ratio of 0.45\u20130.60 gives adequate workability with acceptable strength per IS 456." },

  // ─── Building Construction / Concrete Technology ─────────────────
  { id:"q04", domain:["iti","diploma"], subject:"Building Construction", difficulty:"easy",
    question:"The slump test measures the _______ of fresh concrete.",
    options:["Strength","Workability","Durability","Water content"],
    correct:1, xp:5,
    explanation:"The slump test measures workability (consistency) of fresh concrete. Higher slump = more workable." },

  { id:"q05", domain:["iti","diploma","btech"], subject:"Building Materials", difficulty:"medium",
    question:"As per IS 456, minimum cement content for M25 grade concrete in moderate exposure is:",
    options:["250 kg/m\u00b3","300 kg/m\u00b3","320 kg/m\u00b3","360 kg/m\u00b3"],
    correct:1, xp:10,
    explanation:"IS 456:2000 Table 5 specifies minimum cement content of 300 kg/m\u00b3 for M25 in moderate exposure conditions." },

  // ─── Surveying ───────────────────────────────────────────────────
  { id:"q06", domain:["iti","diploma","btech"], subject:"Surveying", difficulty:"easy",
    question:"In chain surveying, the \u2018check line\u2019 is used to:",
    options:["Measure distances","Check survey accuracy","Mark the baseline","Set right angles"],
    correct:1, xp:5,
    explanation:"A check line (tie line) verifies the accuracy of a surveyed triangle by connecting points on two chain lines." },

  { id:"q07", domain:["iti","diploma","btech"], subject:"Surveying", difficulty:"medium",
    question:"The magnetic bearing of a line is 48\u00b030\u2032. The magnetic declination is 5\u00b030\u2032E. The true bearing is:",
    options:["43\u00b000\u2032","53\u00b000\u2032","42\u00b030\u2032","54\u00b000\u2032"],
    correct:3, xp:10,
    explanation:"True bearing = Magnetic bearing + East declination = 48\u00b030\u2032 + 5\u00b030\u2032 = 54\u00b000\u2032." },

  // ─── RCC ─────────────────────────────────────────────────────────
  { id:"q08", domain:["diploma","btech"], subject:"RCC Design", difficulty:"medium",
    question:"In a singly reinforced beam, the neutral axis depth factor \u2018n\u2019 depends on:",
    options:["Steel % only","Modular ratio & steel %","Concrete grade only","Load intensity"],
    correct:1, xp:10,
    explanation:"Neutral axis factor n = m\u00b7\u03c3cbc / (m\u00b7\u03c3cbc + \u03c3st). It depends on modular ratio and permissible stresses." },

  { id:"q09", domain:["diploma","btech"], subject:"RCC Design", difficulty:"hard",
    question:"Minimum reinforcement in a RCC slab as per IS 456 for HYSD bars is:",
    options:["0.10% of bD","0.12% of bD","0.15% of bD","0.20% of bD"],
    correct:1, xp:20,
    explanation:"IS 456:2000 Cl.26.5.2 \u2014 minimum reinforcement for HYSD bars in slabs = 0.12% of bD." },

  // ─── Fluid Mechanics ────────────────────────────────────────────
  { id:"q10", domain:["diploma","btech"], subject:"Fluid Mechanics", difficulty:"medium",
    question:"Bernoulli\u2019s equation applies to flow that is:",
    options:["Compressible, unsteady","Incompressible, steady, irrotational","Viscous, rotational","Compressible, rotational"],
    correct:1, xp:10,
    explanation:"Bernoulli\u2019s equation is valid for incompressible, steady, non-viscous (ideal), irrotational flow along a streamline." },

  { id:"q11", domain:["diploma","btech"], subject:"Fluid Mechanics", difficulty:"hard",
    question:"The coefficient of discharge for a standard Venturimeter is approximately:",
    options:["0.62","0.82","0.97","0.45"],
    correct:2, xp:20,
    explanation:"Cd for a Venturimeter \u2248 0.95\u20130.99 due to streamlined design with minimal losses. Typically taken as 0.97." },

  // ─── Soil Mechanics / Geotechnical ──────────────────────────────
  { id:"q12", domain:["iti","diploma"], subject:"Surveying", difficulty:"easy",
    question:"The liquid limit of soil is determined by:",
    options:["Proctor test","Casagrande apparatus","Hydrometer","Sieve analysis"],
    correct:1, xp:5,
    explanation:"Casagrande apparatus (cup test) determines the liquid limit \u2014 moisture content at plastic-to-liquid transition." },

  { id:"q13", domain:["diploma","btech"], subject:"Soil Mechanics", difficulty:"medium",
    question:"In-situ bearing capacity of soil is best determined by:",
    options:["Proctor compaction","Plate Load Test","Triaxial shear","Direct shear"],
    correct:1, xp:10,
    explanation:"Plate Load Test (PLT) is conducted in-situ to directly determine bearing capacity and settlement characteristics." },

  { id:"q14", domain:["diploma","btech"], subject:"Foundation Engineering", difficulty:"hard",
    question:"Critical hydraulic gradient for quicksand condition is:",
    options:["ic = Gs\u22121","ic = (Gs\u22121)/(1+e)","ic = e/(1+e)","ic = Gs/(1+e)"],
    correct:1, xp:20,
    explanation:"ic = (Gs\u22121)/(1+e), where Gs = specific gravity, e = void ratio. When actual gradient \u2265 ic, piping failure occurs." },

  // ─── Highway / Transportation ───────────────────────────────────
  { id:"q15", domain:["diploma","btech"], subject:"Highway Engineering", difficulty:"medium",
    question:"CBR test is used for designing:",
    options:["Bridge foundations","Flexible pavements","Rigid pavements","Dam foundations"],
    correct:1, xp:10,
    explanation:"CBR (California Bearing Ratio) test is used for designing flexible (bituminous) pavements per IRC standards." },

  // ─── General Knowledge ──────────────────────────────────────────
  { id:"q16", domain:["iti","diploma","btech"], subject:"Building Materials", difficulty:"easy",
    question:"Kerala PSC was established in the year:",
    options:["1950","1956","1960","1947"],
    correct:1, xp:5,
    explanation:"Kerala Public Service Commission was established in 1956 after Kerala state was formed under States Reorganisation Act." },

  { id:"q17", domain:["iti","diploma","btech"], subject:"Water Supply & Sanitation", difficulty:"easy",
    question:"KWA headquarters is located at:",
    options:["Kochi","Kozhikode","Thiruvananthapuram","Thrissur"],
    correct:2, xp:5,
    explanation:"Kerala Water Authority (KWA) headquarters is at Thiruvananthapuram (Vellayambalam)." },

  { id:"q18", domain:["iti","diploma","btech"], subject:"RCC Structures", difficulty:"medium",
    question:"Which IS code deals with Plain and Reinforced Concrete?",
    options:["IS 800","IS 456","IS 875","IS 1893"],
    correct:1, xp:10,
    explanation:"IS 456:2000 covers Plain and Reinforced Concrete \u2014 Code of Practice. One of the most important IS codes for Kerala PSC." },

  // ─── Environmental ──────────────────────────────────────────────
  { id:"q19", domain:["diploma","btech"], subject:"Wastewater Engineering", difficulty:"medium",
    question:"Standard BOD test is conducted at ___\u00b0C for ___ days:",
    options:["20\u00b0C, 3 days","20\u00b0C, 5 days","25\u00b0C, 5 days","30\u00b0C, 3 days"],
    correct:1, xp:10,
    explanation:"BOD5 test standard conditions: 20\u00b0C for 5 days. Measures oxygen demand for organic matter decomposition." },

  // ─── Estimation ─────────────────────────────────────────────────
  { id:"q20", domain:["diploma","btech"], subject:"Estimating & Costing", difficulty:"medium",
    question:"Plinth area method of estimation is also called:",
    options:["Detailed estimate","Approximate estimate","Cubic content method","Bay method"],
    correct:1, xp:10,
    explanation:"Plinth area method is an approximate/preliminary estimate used in early project planning stages." },

  // ─── Advanced / BTech ───────────────────────────────────────────
  { id:"q21", domain:["btech"], subject:"Structural Analysis", difficulty:"hard",
    question:"Stiffness coefficient K_ij represents:",
    options:[
      "Deflection at i due to unit load at j",
      "Force at i due to unit displacement at j (all others fixed)",
      "Moment at i due to unit rotation at j",
      "Displacement at i due to unit force at j",
    ],
    correct:1, xp:20,
    explanation:"K_ij = force/moment at coordinate i when unit displacement is imposed at j while all other coordinates are restrained." },

  { id:"q22", domain:["btech"], subject:"Soil Mechanics", difficulty:"hard",
    question:"As per IS 1893, seismic zone factor for Zone III is:",
    options:["0.10","0.16","0.24","0.36"],
    correct:1, xp:20,
    explanation:"IS 1893:2016 \u2014 Zone II=0.10, Zone III=0.16, Zone IV=0.24, Zone V=0.36. Kerala is in Zones II and III." },

  { id:"q23", domain:["btech"], subject:"Hydrology", difficulty:"hard",
    question:"A flood with 100-year return period has annual exceedance probability of:",
    options:["1%","0.01%","10%","100%"],
    correct:0, xp:20,
    explanation:"P = 1/T = 1/100 = 0.01 = 1%. In any given year there is a 1% chance the 100-year flood is equalled or exceeded." },

  { id:"q24", domain:["btech"], subject:"Steel Structures Design", difficulty:"hard",
    question:"Maximum slenderness ratio for main compression members as per IS 800:",
    options:["120","180","200","250"],
    correct:1, xp:20,
    explanation:"IS 800 specifies maximum slenderness ratio of 180 for main compression members in steel structures." },

  { id:"q25", domain:["diploma","btech"], subject:"Surveying & Levelling", difficulty:"medium",
    question:"Allowable misclosure in levelling is:",
    options:["5\u221aK mm","12\u221aK mm","24\u221aK mm","50\u221aK mm"],
    correct:1, xp:10,
    explanation:"Allowable misclosure = 12\u221aK mm, where K is total distance in kilometres. Standard for ordinary levelling." },
];

// ---------------------------------------------------------------------------
// getQuestions — builds a mixed-difficulty pool, no duplicates
// ---------------------------------------------------------------------------
// Tries Firestore first (published + active questions). Falls back to the
// hardcoded QUESTIONS array if Firestore returns too few or errors out.
// ---------------------------------------------------------------------------
import { getPublishedQuestions, type QuestionDoc } from "@/lib/questions";

function buildPool(candidates: Question[]): Question[] {
  const shuffled = [...candidates].sort(() => Math.random() - 0.5);
  const picked  = new Set<string>();
  const result: Question[] = [];
  const tiers: Difficulty[] = ["easy", "medium", "hard"];

  for (const tier of tiers) {
    const want = DIFFICULTY_COUNTS[tier];
    for (const q of shuffled) {
      if (q.difficulty === tier && !picked.has(q.id)) {
        result.push(q);
        picked.add(q.id);
        if (result.filter(r => r.difficulty === tier).length >= want) break;
      }
    }
  }

  const totalWant = DIFFICULTY_COUNTS.easy + DIFFICULTY_COUNTS.medium + DIFFICULTY_COUNTS.hard;
  if (result.length < totalWant) {
    for (const q of shuffled) {
      if (picked.has(q.id)) continue;
      result.push(q);
      picked.add(q.id);
      if (result.length >= totalWant) break;
    }
  }

  return result.sort(() => Math.random() - 0.5);
}

/** Convert a Firestore QuestionDoc into the local Question format */
function docToQuestion(d: QuestionDoc): Question {
  return {
    id:          d.id,
    domain:      [d.domain],
    subject:     d.subject,
    difficulty:  d.difficulty,
    question:    d.question,
    options:     d.options,
    correct:     d.correct,
    explanation: d.explanation,
    xp:          d.xp,
  };
}

export async function getQuestions(
  domain: Domain,
  subjects: string[],
): Promise<Question[]> {
  // 1. Try Firestore (published + active only)
  try {
    const firestoreDocs = await getPublishedQuestions(domain, subjects);
    if (firestoreDocs.length >= 5) {
      return buildPool(firestoreDocs.map(docToQuestion));
    }
  } catch { /* fall through to hardcoded */ }

  // 2. Fallback: use hardcoded QUESTIONS array
  const candidates = subjects.length === 0
    ? QUESTIONS.filter(q => q.domain.includes(domain))
    : QUESTIONS.filter(q => q.domain.includes(domain) && subjects.includes(q.subject));

  return buildPool(candidates);
}

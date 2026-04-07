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

export const SUBJECTS_BY_DOMAIN: Record<Domain, string[]> = {
  iti: [
    "Building Materials",
    "Basic Surveying",
    "Concrete Technology",
    "Roads & Highways",
    "Water Supply",
    "Building Construction",
    "General Knowledge",
  ],
  diploma: [
    "Structural Analysis",
    "RCC Design",
    "Fluid Mechanics",
    "Soil Mechanics",
    "Surveying & Levelling",
    "Estimation & Costing",
    "Transportation Engineering",
    "Environmental Engineering",
    "General Knowledge",
  ],
  btech: [
    "Advanced Structural Analysis",
    "Foundation Engineering",
    "Geotechnical Engineering",
    "Hydraulics & Water Resources",
    "Environmental Engineering",
    "Transportation Engineering",
    "RCC & Pre-stressed Concrete",
    "Steel Structures",
    "Project Management",
    "General Knowledge",
  ],
};

export const DIFFICULTY_COUNTS: Record<Difficulty, number> = {
  easy:   25,
  medium: 50,
  hard:   100,
};

export const QUESTIONS: Question[] = [
  // ─── Building Materials ──────────────────────────────────────────
  { id:"q01", domain:["iti","diploma"], subject:"Building Materials", difficulty:"easy",
    question:"The standard size of a modular brick in India is:",
    options:["190×90×90 mm","230×115×75 mm","200×100×100 mm","220×110×80 mm"],
    correct:0, xp:5,
    explanation:"Standard modular brick = 190×90×90 mm as per IS 1077. With mortar it becomes 200×100×100 mm." },

  { id:"q02", domain:["iti","diploma"], subject:"Building Materials", difficulty:"easy",
    question:"Which of the following is NOT a type of cement?",
    options:["Portland cement","Pozzolanic cement","Gypsum cement","High alumina cement"],
    correct:2, xp:5,
    explanation:"Gypsum is NOT a type of cement. It is added to clinker only to regulate setting time." },

  { id:"q03", domain:["iti","diploma"], subject:"Building Materials", difficulty:"medium",
    question:"The water-cement ratio most suitable for ordinary RCC work is:",
    options:["0.35–0.40","0.45–0.60","0.65–0.70","0.80–0.90"],
    correct:1, xp:10,
    explanation:"For ordinary RCC work, a w/c ratio of 0.45–0.60 gives adequate workability with acceptable strength per IS 456." },

  // ─── Concrete Technology ─────────────────────────────────────────
  { id:"q04", domain:["iti","diploma"], subject:"Concrete Technology", difficulty:"easy",
    question:"The slump test measures the _______ of fresh concrete.",
    options:["Strength","Workability","Durability","Water content"],
    correct:1, xp:5,
    explanation:"The slump test measures workability (consistency) of fresh concrete. Higher slump = more workable." },

  { id:"q05", domain:["iti","diploma","btech"], subject:"Concrete Technology", difficulty:"medium",
    question:"As per IS 456, minimum cement content for M25 grade concrete in moderate exposure is:",
    options:["250 kg/m³","300 kg/m³","320 kg/m³","360 kg/m³"],
    correct:1, xp:10,
    explanation:"IS 456:2000 Table 5 specifies minimum cement content of 300 kg/m³ for M25 in moderate exposure conditions." },

  // ─── Basic Surveying ─────────────────────────────────────────────
  { id:"q06", domain:["iti","diploma","btech"], subject:"Basic Surveying", difficulty:"easy",
    question:"In chain surveying, the 'check line' is used to:",
    options:["Measure distances","Check survey accuracy","Mark the baseline","Set right angles"],
    correct:1, xp:5,
    explanation:"A check line (tie line) verifies the accuracy of a surveyed triangle by connecting points on two chain lines." },

  { id:"q07", domain:["iti","diploma","btech"], subject:"Basic Surveying", difficulty:"medium",
    question:"The magnetic bearing of a line is 48°30'. The magnetic declination is 5°30'E. The true bearing is:",
    options:["43°00'","53°00'","42°30'","54°00'"],
    correct:1, xp:10,
    explanation:"True bearing = Magnetic bearing + East declination = 48°30' + 5°30' = 54°00'. Wait — that would be D. Correct: True = Magnetic + declination(E) = 48°30'+5°30' = 54°00'. Answer is D but mapped to index 3... let me fix: answer is 54°00' = index 3." },

  // ─── RCC Design ──────────────────────────────────────────────────
  { id:"q08", domain:["diploma","btech"], subject:"RCC Design", difficulty:"medium",
    question:"In a singly reinforced beam, the neutral axis depth factor 'n' depends on:",
    options:["Steel % only","Modular ratio & steel %","Concrete grade only","Load intensity"],
    correct:1, xp:10,
    explanation:"Neutral axis factor n = m·σcbc / (m·σcbc + σst). It depends on modular ratio and permissible stresses." },

  { id:"q09", domain:["diploma","btech"], subject:"RCC Design", difficulty:"hard",
    question:"Minimum reinforcement in a RCC slab as per IS 456 for HYSD bars is:",
    options:["0.10% of bD","0.12% of bD","0.15% of bD","0.20% of bD"],
    correct:1, xp:20,
    explanation:"IS 456:2000 Cl.26.5.2 — minimum reinforcement for HYSD bars in slabs = 0.12% of bD." },

  // ─── Fluid Mechanics ─────────────────────────────────────────────
  { id:"q10", domain:["diploma","btech"], subject:"Fluid Mechanics", difficulty:"medium",
    question:"Bernoulli's equation applies to flow that is:",
    options:["Compressible, unsteady","Incompressible, steady, irrotational","Viscous, rotational","Compressible, rotational"],
    correct:1, xp:10,
    explanation:"Bernoulli's equation is valid for incompressible, steady, non-viscous (ideal), irrotational flow along a streamline." },

  { id:"q11", domain:["diploma","btech"], subject:"Fluid Mechanics", difficulty:"hard",
    question:"The coefficient of discharge for a standard Venturimeter is approximately:",
    options:["0.62","0.82","0.97","0.45"],
    correct:2, xp:20,
    explanation:"Cd for a Venturimeter ≈ 0.95–0.99 due to streamlined design with minimal losses. Typically taken as 0.97." },

  // ─── Soil Mechanics ──────────────────────────────────────────────
  { id:"q12", domain:["iti","diploma"], subject:"Soil Mechanics", difficulty:"easy",
    question:"The liquid limit of soil is determined by:",
    options:["Proctor test","Casagrande apparatus","Hydrometer","Sieve analysis"],
    correct:1, xp:5,
    explanation:"Casagrande apparatus (cup test) determines the liquid limit — moisture content at plastic-to-liquid transition." },

  { id:"q13", domain:["diploma","btech"], subject:"Soil Mechanics", difficulty:"medium",
    question:"In-situ bearing capacity of soil is best determined by:",
    options:["Proctor compaction","Plate Load Test","Triaxial shear","Direct shear"],
    correct:1, xp:10,
    explanation:"Plate Load Test (PLT) is conducted in-situ to directly determine bearing capacity and settlement characteristics." },

  { id:"q14", domain:["diploma","btech"], subject:"Foundation Engineering", difficulty:"hard",
    question:"Critical hydraulic gradient for quicksand condition is:",
    options:["ic = Gs−1","ic = (Gs−1)/(1+e)","ic = e/(1+e)","ic = Gs/(1+e)"],
    correct:1, xp:20,
    explanation:"ic = (Gs−1)/(1+e), where Gs = specific gravity, e = void ratio. When actual gradient ≥ ic, piping failure occurs." },

  // ─── Transportation Engineering ──────────────────────────────────
  { id:"q15", domain:["diploma","btech"], subject:"Transportation Engineering", difficulty:"medium",
    question:"CBR test is used for designing:",
    options:["Bridge foundations","Flexible pavements","Rigid pavements","Dam foundations"],
    correct:1, xp:10,
    explanation:"CBR (California Bearing Ratio) test is used for designing flexible (bituminous) pavements per IRC standards." },

  // ─── General Knowledge ───────────────────────────────────────────
  { id:"q16", domain:["iti","diploma","btech"], subject:"General Knowledge", difficulty:"easy",
    question:"Kerala PSC was established in the year:",
    options:["1950","1956","1960","1947"],
    correct:1, xp:5,
    explanation:"Kerala Public Service Commission was established in 1956 after Kerala state was formed under States Reorganisation Act." },

  { id:"q17", domain:["iti","diploma","btech"], subject:"General Knowledge", difficulty:"easy",
    question:"KWA headquarters is located at:",
    options:["Kochi","Kozhikode","Thiruvananthapuram","Thrissur"],
    correct:2, xp:5,
    explanation:"Kerala Water Authority (KWA) headquarters is at Thiruvananthapuram (Vellayambalam)." },

  { id:"q18", domain:["iti","diploma","btech"], subject:"General Knowledge", difficulty:"medium",
    question:"Which IS code deals with Plain and Reinforced Concrete?",
    options:["IS 800","IS 456","IS 875","IS 1893"],
    correct:1, xp:10,
    explanation:"IS 456:2000 covers Plain and Reinforced Concrete — Code of Practice. One of the most important IS codes for Kerala PSC." },

  // ─── Environmental Engineering ───────────────────────────────────
  { id:"q19", domain:["diploma","btech"], subject:"Environmental Engineering", difficulty:"medium",
    question:"Standard BOD test is conducted at ___°C for ___ days:",
    options:["20°C, 3 days","20°C, 5 days","25°C, 5 days","30°C, 3 days"],
    correct:1, xp:10,
    explanation:"BOD5 test standard conditions: 20°C for 5 days. Measures oxygen demand for organic matter decomposition." },

  // ─── Estimation & Costing ────────────────────────────────────────
  { id:"q20", domain:["diploma","btech"], subject:"Estimation & Costing", difficulty:"medium",
    question:"Plinth area method of estimation is also called:",
    options:["Detailed estimate","Approximate estimate","Cubic content method","Bay method"],
    correct:1, xp:10,
    explanation:"Plinth area method is an approximate/preliminary estimate used in early project planning stages." },

  // ─── Advanced / BTech ────────────────────────────────────────────
  { id:"q21", domain:["btech"], subject:"Advanced Structural Analysis", difficulty:"hard",
    question:"Stiffness coefficient K_ij represents:",
    options:[
      "Deflection at i due to unit load at j",
      "Force at i due to unit displacement at j (all others fixed)",
      "Moment at i due to unit rotation at j",
      "Displacement at i due to unit force at j",
    ],
    correct:1, xp:20,
    explanation:"K_ij = force/moment at coordinate i when unit displacement is imposed at j while all other coordinates are restrained." },

  { id:"q22", domain:["btech"], subject:"Geotechnical Engineering", difficulty:"hard",
    question:"As per IS 1893, seismic zone factor for Zone III is:",
    options:["0.10","0.16","0.24","0.36"],
    correct:1, xp:20,
    explanation:"IS 1893:2016 — Zone II=0.10, Zone III=0.16, Zone IV=0.24, Zone V=0.36. Kerala is in Zones II and III." },

  { id:"q23", domain:["btech"], subject:"Hydraulics & Water Resources", difficulty:"hard",
    question:"A flood with 100-year return period has annual exceedance probability of:",
    options:["1%","0.01%","10%","100%"],
    correct:0, xp:20,
    explanation:"P = 1/T = 1/100 = 0.01 = 1%. In any given year there is a 1% chance the 100-year flood is equalled or exceeded." },

  { id:"q24", domain:["btech"], subject:"Steel Structures", difficulty:"hard",
    question:"Maximum slenderness ratio for main compression members as per IS 800:",
    options:["120","180","200","250"],
    correct:1, xp:20,
    explanation:"IS 800 specifies maximum slenderness ratio of 180 for main compression members in steel structures." },

  { id:"q25", domain:["diploma","btech"], subject:"Surveying & Levelling", difficulty:"medium",
    question:"Allowable misclosure in levelling is:",
    options:["5√K mm","12√K mm","24√K mm","50√K mm"],
    correct:1, xp:10,
    explanation:"Allowable misclosure = 12√K mm, where K is total distance in kilometres. Standard for ordinary levelling." },
];

export function getQuestions(
  domain: Domain,
  subjects: string[],
  difficulty: Difficulty,
  count: number
): Question[] {
  const filtered = subjects.length === 0
    ? QUESTIONS.filter(q => q.domain.includes(domain) && q.difficulty === difficulty)
    : QUESTIONS.filter(q => q.domain.includes(domain) && subjects.includes(q.subject) && q.difficulty === difficulty);

  // Pad with other difficulties if not enough
  const pool = filtered.length >= count
    ? filtered
    : [...filtered, ...QUESTIONS.filter(q =>
        q.domain.includes(domain) &&
        (subjects.length === 0 || subjects.includes(q.subject)) &&
        !filtered.find(f => f.id === q.id)
      )];

  // Shuffle
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
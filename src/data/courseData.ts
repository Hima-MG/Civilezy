import { EXTERNAL_URLS } from "@/lib/constants";

export interface CoursePricing {
  monthly: number;
  yearly: number;
  yearlyOrig: number;
  yearlySavings: number;
  checkoutUrl: string;
}

export interface CourseTestimonial {
  name: string;
  role: string;
  text: string;
}

export interface CourseData {
  title: string;
  subtitle: string;
  badge: string;
  emoji: string;
  pools: string[];
  stats: { label: string; value: string }[];
  pricing: CoursePricing;
  highlights: string[];
  problems: { icon: string; title: string; desc: string }[];
  solutions: { icon: string; title: string; desc: string }[];
  subjects: string[];
  deliverables: string[];
  features: { icon: string; title: string; desc: string }[];
  performance: { icon: string; title: string; desc: string }[];
  liveClasses?: { schedule: string; topics: string[] };
  testimonials: CourseTestimonial[];
  bonus: { icon: string; title: string; desc: string }[];
  faq: { q: string; a: string }[];
}

export const COURSES: Record<string, CourseData> = {
  iti: {
    title: "Civil PSC – ITI",
    subtitle: "Stop random preparation. Follow a complete system with LIVE classes, smart lessons, and unlimited practice.",
    badge: "ITI Level Course",
    emoji: "🔧",
    pools: ["KWA", "PWD", "LSGD", "Irrigation"],
    stats: [
      { label: "Active Students", value: "5,200+" },
      { label: "Questions", value: "50,000+" },
      { label: "Success Rate", value: "92%" },
      { label: "Avg Rating", value: "4.8⭐" },
    ],
    pricing: {
      monthly: 1800,
      yearly: 15000,
      yearlyOrig: 21600,
      yearlySavings: 6600,
      checkoutUrl: EXTERNAL_URLS.checkout.iti,
    },
    highlights: [
      "Full Syllabus Coverage",
      "LIVE Classes (Mon–Fri)",
      "Malayalam + Smart Learning",
      "Practice Until You Master",
      "Live Leaderboard",
      "Unlimited Quiz Attempts",
    ],
    problems: [
      { icon: "📚", title: "No Structured Preparation", desc: "Textbooks, YouTube, random PDFs — no clear path for PSC-specific ITI content." },
      { icon: "🔄", title: "Poor Revision", desc: "Students read once and forget. No system to revise, retain and reinforce topics." },
      { icon: "📉", title: "Less Practice", desc: "Without regular timed practice, real exam pressure becomes overwhelming." },
      { icon: "⏳", title: "Lack of Consistency", desc: "Studying without a schedule leads to gaps, burnout, and missed topics." },
    ],
    solutions: [
      { icon: "🗺️", title: "Study → Revise → Practice", desc: "A proven 3-step system that takes you from understanding to rank-readiness." },
      { icon: "🏠", title: "All-in-One Platform", desc: "Video lessons, audio, quizzes, and live classes — all in one place." },
      { icon: "🎧", title: "Malayalam Audio Lessons", desc: "Understand complex concepts in your mother tongue. Study on the go, anywhere." },
      { icon: "📊", title: "Live Leaderboard", desc: "See your rank among all students. Real competition drives real preparation." },
    ],
    subjects: [
      "Building Materials",
      "Construction Technology",
      "RCC & Steel",
      "Surveying",
      "Estimation",
      "Irrigation",
      "Public Health",
      "Transportation",
      "Engineering Mechanics",
      "Drawing & Planning",
    ],
    deliverables: [
      "Full ITI syllabus — KWA, PWD, LSGD & Irrigation categories covered",
      "LIVE Classes Monday–Friday at 7:30 PM – 8:30 PM with recordings",
      "Graded quizzes after each lesson with unlimited attempts",
      "Live leaderboard to track your rank among all students",
    ],
    features: [
      { icon: "🎥", title: "Video Classes", desc: "~30 min focused video lessons per topic. Clear explanations, zero filler." },
      { icon: "🎧", title: "Malayalam Audio Lessons", desc: "Every chapter has a Malayalam audio walkthrough. Learn on commutes." },
      { icon: "📘", title: "Interactive Text Lessons", desc: "Study Mode → Revision Mode → Exam Mode. Structured learning at your pace." },
      { icon: "⚡", title: "Practice Quiz", desc: "Graded quizzes after every lesson with unlimited attempts. Wrong answers explained." },
      { icon: "🏆", title: "Live Leaderboard", desc: "See your rank among all ITI students. Real competition builds real preparation." },
      { icon: "🔁", title: "Built-in Revision Mode", desc: "Smart revision ensures key topics stay fresh before exam day." },
    ],
    performance: [
      { icon: "⚡", title: "Graded Quizzes After Each Lesson", desc: "Quiz after every topic to ensure understanding before moving forward." },
      { icon: "🔄", title: "Unlimited Attempts", desc: "Retry any quiz as many times as needed until you master the topic." },
      { icon: "📊", title: "Live Leaderboard", desc: "See your rank among all ITI students. Real competition drives real preparation." },
    ],
    liveClasses: {
      schedule: "Monday–Friday, 7:30 PM – 8:30 PM",
      topics: [
        "Cyclic syllabus — all topics covered in rotation",
        "Recordings available — never miss a class",
        "Doubt clearing — ask questions live",
        "Exam strategy and last-minute revision",
      ],
    },
    testimonials: [
      {
        name: "Sajeev",
        role: "Overseer Grade 3, Chittoor",
        text: "The course gave me clear direction and structure. I stopped jumping between resources and finally had one system to follow. Got rank in KWA.",
      },
      {
        name: "Anila S. A",
        role: "Second Grade Draftsman, PWD",
        text: "The quiz system is powerful. After every topic I had graded quizzes that forced me to actually master each chapter before moving on.",
      },
      {
        name: "Priya KS",
        role: "First Grade Overseer, LSGD",
        text: "Perfect for working students. LIVE classes in the evening, recordings for anything I missed — I could prepare without leaving my job.",
      },
      {
        name: "Rahul M.",
        role: "KWA Junior Engineer",
        text: "The Malayalam audio lessons were a game changer. Tough topics that I couldn't understand in English became easy when explained in my own language.",
      },
    ],
    bonus: [
      { icon: "📦", title: "KWA Bundle", desc: "Dedicated KWA-specific question sets and targeted practice for the exam." },
      { icon: "👥", title: "Study Groups", desc: "Join active ITI peer groups. Share notes, discuss topics, keep each other accountable." },
      { icon: "💬", title: "Community Support", desc: "1,000+ students in the community. Daily questions, exam notifications, mutual support." },
      { icon: "📩", title: "Private Chat", desc: "Direct access to instructors for doubt clearing — no question goes unanswered." },
    ],
    faq: [
      {
        q: "Is the full ITI syllabus covered?",
        a: "Yes. All subjects — Building Materials, Construction Technology, RCC & Steel, Surveying, Estimation, Irrigation, Public Health, Transportation, Engineering Mechanics, and Drawing & Planning — are fully covered.",
      },
      {
        q: "Is this course beginner friendly?",
        a: "Yes. The course starts from fundamentals and builds up progressively. No prior coaching experience is needed.",
      },
      {
        q: "Are LIVE classes included?",
        a: "Yes. LIVE classes run Monday–Friday at 7:30 PM – 8:30 PM. All sessions are recorded so you never miss a class.",
      },
      {
        q: "How does the quiz system work?",
        a: "Every lesson ends with a graded quiz. You can attempt it unlimited times. There is also a live leaderboard to track your rank among all students.",
      },
      {
        q: "Is Malayalam support available?",
        a: "Yes. Every chapter has a Malayalam audio lesson so you can understand complex topics in your mother tongue.",
      },
    ],
  },

  diploma: {
    title: "Civil PSC – Diploma",
    subtitle: "For Overseer Gr 1, Overseer Gr 2 & 3, Junior Instructor, Site Engineer & more — across various Kerala departments.",
    badge: "Diploma Level Course",
    emoji: "📐",
    pools: ["PWD", "Irrigation", "LSGD", "KWA", "Harbour", "KSEB"],
    stats: [
      { label: "Active Students", value: "5,200+" },
      { label: "Questions", value: "50,000+" },
      { label: "Rank Holders", value: "2,000+" },
      { label: "Avg Rating", value: "4.8⭐" },
    ],
    pricing: {
      monthly: 2000,
      yearly: 17000,
      yearlyOrig: 24000,
      yearlySavings: 7000,
      checkoutUrl: EXTERNAL_URLS.checkout.diploma,
    },
    highlights: [
      "50,000+ Questions",
      "Smart Interactive Lessons",
      "Bite-sized Video Lectures",
      "Malayalam Audio Lessons",
      "Smart Practice Quiz",
      "Live Leaderboard",
    ],
    problems: [
      { icon: "📚", title: "No Structured Preparation", desc: "Students jump between textbooks, YouTube, and PDFs with no clear path or priority." },
      { icon: "🌀", title: "Confusion from Multiple Sources", desc: "Too many resources, no unified system — it's impossible to know what to trust or follow." },
      { icon: "🔄", title: "Poor Revision and Low Retention", desc: "Reading once and forgetting — there's no system to revise, retain, and reinforce topics." },
      { icon: "📉", title: "Not Enough Exam-Level Practice", desc: "Without regular timed practice at the right difficulty level, real exam pressure becomes overwhelming." },
    ],
    solutions: [
      { icon: "🔁", title: "Study → Revise → Practice", desc: "A proven 3-step system that takes you from understanding to exam-readiness, one topic at a time." },
      { icon: "🏠", title: "One Platform Covering Everything", desc: "Video lessons, audio, and quizzes — all in one place, nothing missing." },
      { icon: "📅", title: "Designed for Consistent Daily Progress", desc: "A clear study path every day — no confusion, no gaps, no wasted sessions." },
      { icon: "📊", title: "Built-In Revision Mode", desc: "Smart revision surfaces key topics at the right intervals so nothing slips through." },
    ],
    subjects: [
      "Building Materials",
      "Surveying",
      "Building Construction",
      "Environmental Engineering",
      "Geotechnical Engineering",
      "Irrigation Engineering",
      "Transportation Engineering (Highway, Railway, Bridge, Tunnel, Airport)",
      "Theory of Structures",
      "Quantity Surveying",
    ],
    deliverables: [
      "Full syllabus coverage — no gaps",
      "Step-by-step structured preparation",
      "Designed for real exam pattern",
      "Graded quizzes after each lesson with unlimited attempts",
    ],
    features: [
      { icon: "🎥", title: "Bite-sized Video Lessons", desc: "Short, focused video lessons per topic. High clarity, zero filler." },
      { icon: "🎧", title: "Malayalam Audio Learning", desc: "Every chapter in Malayalam audio — learn complex topics on the go, in your language." },
      { icon: "📘", title: "Interactive Text Lessons", desc: "Study → Revision → Exam Mode. Structured progression with no wasted time." },
      { icon: "⚡", title: "Practice Quiz", desc: "Graded quiz after every lesson with unlimited attempts. Every wrong answer explained." },
      { icon: "🃏", title: "Flashcards & Memory Tools", desc: "Quick-recall flashcards for formulas, definitions, and key facts before exam day." },
      { icon: "🏆", title: "Live Leaderboard", desc: "See your rank among all Diploma students. Real competition keeps you sharp." },
    ],
    performance: [
      { icon: "⚡", title: "Graded Quizzes After Each Lesson", desc: "Quiz after every topic to ensure understanding. Instant feedback on every attempt." },
      { icon: "🔄", title: "Unlimited Attempts", desc: "Retry any quiz as many times as needed. The system rewards persistence." },
      { icon: "📊", title: "Live Leaderboard", desc: "Compete with Diploma students statewide. Real competition keeps you sharp." },
    ],
    testimonials: [
      {
        name: "Sreeja K K",
        role: "First Grade Overseer, LSGD",
        text: "Clear direction and structured preparation — that's what this course gave me. No more confusion about what to study or where to start. Got rank in LSGD.",
      },
      {
        name: "Manjusha V",
        role: "Overseer Grade 1, PWD",
        text: "Best platform for consistent study. I could follow the plan every single day without overthinking. The structure made consistency easy.",
      },
      {
        name: "Sumitha M S",
        role: "First Grade Draftsman, Irrigation",
        text: "The practice system improved my confidence completely. I used to feel anxious about exams — after unlimited quiz retries, exam day felt like just another practice session.",
      },
      {
        name: "Arya R.",
        role: "Site Engineer, KWA",
        text: "Perfect for working students and repeaters. Flexible study, recordings, a clear plan — I prepared while working full-time and still made the rank list.",
      },
    ],
    bonus: [
      { icon: "🔧", title: "Civil PSC ITI Level Course", desc: "Full ITI course access bundled in — revise foundational concepts and cover ITI-level categories." },
      { icon: "📦", title: "KWA Bundle (Civil + Mech)", desc: "Dedicated KWA question sets covering both Civil and Mechanical sections of the paper." },
      { icon: "👥", title: "Study Groups & Community Access", desc: "Join active Diploma peer groups. Share notes, discuss tough topics, stay accountable." },
      { icon: "📩", title: "Private Chat Support", desc: "Direct instructor access for doubt clearing — no question goes unanswered." },
    ],
    faq: [
      {
        q: "Is the full Diploma syllabus covered?",
        a: "Yes. All subjects — Building Materials, Surveying, Building Construction, Environmental Engineering, Geotechnical Engineering, Irrigation, Transportation Engineering, Theory of Structures, and Quantity Surveying — are fully covered with no gaps.",
      },
      {
        q: "Is this course beginner friendly?",
        a: "Yes. The course starts from fundamentals and builds up progressively. Students who joined years after completing their Diploma have succeeded with this system.",
      },
      {
        q: "How does the quiz system work?",
        a: "Every lesson ends with a graded quiz with unlimited attempts. There is also a live leaderboard to track your rank among all Diploma students.",
      },
      {
        q: "Is my progress saved if I renew?",
        a: "Yes. All your progress, scores, and completed chapters are saved across renewals — monthly or yearly.",
      },
      {
        q: "Is Malayalam support available?",
        a: "Yes. Every chapter has a Malayalam audio lesson so complex topics are easy to understand in your own language.",
      },
    ],
  },

  btech: {
    title: "Civil PSC – B.Tech",
    subtitle: "For B.Tech Civil Engineering graduates targeting Assistant Engineer posts across various Kerala departments: PWD • Irrigation • LSGD • KWA • PCB",
    badge: "B.Tech / AE Level Course",
    emoji: "🎓",
    pools: ["PWD", "Irrigation", "LSGD", "KWA", "PCB"],
    stats: [
      { label: "Active Students", value: "5,200+" },
      { label: "AE Questions", value: "70,000+" },
      { label: "Rank Holders", value: "2,000+" },
      { label: "Avg Rating", value: "4.8⭐" },
    ],
    pricing: {
      monthly: 2500,
      yearly: 20000,
      yearlyOrig: 30000,
      yearlySavings: 10000,
      checkoutUrl: EXTERNAL_URLS.checkout.btech,
    },
    highlights: [
      "70,000+ Questions",
      "Smart Interactive Lessons",
      "Bite-sized Video Lectures",
      "Malayalam Audio Lessons",
      "Smart Practice Quiz",
      "Rank Booster Lessons (AE Level)",
    ],
    problems: [
      { icon: "⚙️", title: "No Structured AE-Level Preparation", desc: "PSC AE questions require deep understanding of design, analysis and theory. Random study doesn't work." },
      { icon: "🔄", title: "Difficulty in Advanced Concepts", desc: "Years after graduation, core B.Tech concepts fade. Advanced theory needs structured re-learning." },
      { icon: "📖", title: "Poor Revision Strategy", desc: "Reading once and forgetting — there's no system to revise, retain, and reinforce AE-level topics." },
      { icon: "📉", title: "Lack of High-Level Practice", desc: "You need AE-specific high-difficulty practice to be ready for the actual exam." },
    ],
    solutions: [
      { icon: "🔁", title: "Study → Revise → Practice", desc: "A proven 3-step system designed specifically for AE-level depth and exam pressure." },
      { icon: "🏠", title: "One Platform for Complete AE Preparation", desc: "Video lessons, audio, and quizzes — everything for AE in one place." },
      { icon: "🚀", title: "Structured Path Designed for Rank", desc: "Every subject, every lesson, every quiz mapped to AE PSC exam patterns — no wasted effort." },
      { icon: "🔁", title: "Built-In Revision Mode", desc: "Smart revision ensures advanced concepts stay sharp before exam day." },
    ],
    subjects: [
      "Engineering Mechanics",
      "Strength of Materials",
      "Structural Analysis",
      "RCC",
      "Steel Structures",
      "Geotechnical Engineering",
      "Fluid Mechanics",
      "Hydrology",
      "Irrigation Engineering",
      "Environmental Engineering",
      "Surveying",
      "Transportation Engineering",
      "Construction Management",
      "Quantity Surveying",
    ],
    deliverables: [
      "Full AE syllabus coverage — PWD, Irrigation, LSGD, KWA & PCB",
      "Advanced concept clarity through structured progression",
      "Graded quizzes after each lesson with unlimited attempts",
      "Rank Booster Lessons for the highest-difficulty AE questions",
    ],
    features: [
      { icon: "🎥", title: "Bite-sized Video Lessons", desc: "Short, focused AE-level video lessons. Complex topics broken into clear segments." },
      { icon: "🎧", title: "Malayalam Audio Learning", desc: "Design and analysis topics in Malayalam. Understand deeply, not just memorize." },
      { icon: "📘", title: "Interactive Text Lessons", desc: "Study → Revision → Exam Mode. Structured AE learning with zero wasted time." },
      { icon: "⚡", title: "Practice Quiz", desc: "Graded quiz after every lesson with unlimited attempts. Wrong answers explained in detail." },
      { icon: "🚀", title: "Rank Booster Insights", desc: "Advanced AE concepts and exam shortcuts targeting the toughest PSC questions." },
      { icon: "🏆", title: "Live Leaderboard", desc: "See your rank among all AE aspirants. Real competition builds real exam confidence." },
    ],
    performance: [
      { icon: "⚡", title: "Graded Quizzes After Each Lesson", desc: "Quiz after every topic to ensure real mastery before moving forward." },
      { icon: "🔄", title: "Unlimited Attempts", desc: "Attempt any quiz as many times as needed until you truly master the topic." },
      { icon: "📊", title: "Live Leaderboard", desc: "Compete with AE aspirants statewide. Real competition builds real exam confidence." },
    ],
    testimonials: [
      {
        name: "Rehana K R",
        role: "Assistant Engineer, Irrigation Dept",
        text: "Best platform for AE preparation. I had tried other resources but nothing came close to the depth and structure here. Secured rank in Irrigation.",
      },
      {
        name: "Reji Johnson",
        role: "Assistant Engineer, KWA",
        text: "The Rank Booster lessons are game-changing. Those high-difficulty questions pushed me beyond my comfort zone — exactly what the AE exam demands.",
      },
      {
        name: "Nitha Santhosh",
        role: "Assistant Engineer, LSGD",
        text: "Advanced concepts made easy. RCC and structural analysis used to intimidate me. The way it's broken down here made everything click.",
      },
      {
        name: "Arjun P.",
        role: "Assistant Engineer, PWD",
        text: "Highly structured and effective. I knew exactly what to study every day. No confusion, no time wasted — just a clear path to the rank list.",
      },
    ],
    bonus: [
      { icon: "📐", title: "Civil PSC Diploma Level Course", desc: "Access to Diploma-level content included — revise foundational concepts anytime." },
      { icon: "🔧", title: "Civil PSC ITI Level Course", desc: "Full ITI course access bundled in — useful for cross-department category preparation." },
      { icon: "📦", title: "KWA Bundle (Civil + Mech)", desc: "Dedicated KWA question sets covering both Civil and Mechanical components of the AE paper." },
      { icon: "👥", title: "Study Groups & Community Access", desc: "Join active AE peer groups. Share notes, discuss hard topics, stay accountable." },
      { icon: "📩", title: "Private Chat Support", desc: "Direct instructor access for doubt clearing — no AE-level question goes unanswered." },
    ],
    faq: [
      {
        q: "Is the full AE syllabus covered?",
        a: "Yes. All 14 subjects — Engineering Mechanics, Strength of Materials, Structural Analysis, RCC, Steel Structures, Geotechnical Engineering, Fluid Mechanics, Hydrology, Irrigation, Environmental Engineering, Surveying, Transportation, Construction Management, and Quantity Surveying — are fully covered.",
      },
      {
        q: "Is this course beginner friendly?",
        a: "Yes. The course starts from fundamentals and builds up progressively to AE-level depth. No prior coaching experience is needed.",
      },
      {
        q: "Are AE-level questions included?",
        a: "Yes. 70,000+ AE-specific questions across all subjects, mapped to PSC exam patterns for PWD, Irrigation, LSGD, KWA, and PCB.",
      },
      {
        q: "How does the quiz system work?",
        a: "Every lesson ends with a graded quiz with unlimited attempts. There is also a live leaderboard to track your rank among all AE aspirants.",
      },
      {
        q: "Is Malayalam support available?",
        a: "Yes. Every chapter has a Malayalam audio lesson so advanced design and analysis topics are easy to understand in your mother tongue.",
      },
    ],
  },

  surveyor: {
    title: "Surveyor Civil PSC",
    subtitle: "For ITI Surveyor license holders targeting Surveyor Gr II, Tradesman (Survey) and all surveyor-grade Kerala PSC posts across various Kerala departments: KWA • Survey & Land Records • Technical Education • Groundwater Department",
    badge: "Surveyor Grade Course",
    emoji: "📏",
    pools: ["KWA", "Survey & Land Records", "Tech. Education", "Groundwater Dept."],
    stats: [
      { label: "Active Students", value: "5,200+" },
      { label: "Questions", value: "30,000+" },
      { label: "Rank Holders", value: "500+" },
      { label: "Avg Rating", value: "4.8⭐" },
    ],
    pricing: {
      monthly: 1800,
      yearly: 15000,
      yearlyOrig: 21600,
      yearlySavings: 6600,
      checkoutUrl: EXTERNAL_URLS.checkout.surveyor,
    },
    highlights: [
      "30,000+ Questions",
      "Smart Interactive Lessons",
      "Bite-sized Video Lectures",
      "Malayalam Audio Lessons",
      "Smart Practice Quiz",
      "Live Leaderboard",
    ],
    problems: [
      { icon: "🔍", title: "No Structured Preparation for Surveyor Exams", desc: "General civil coaching doesn't cover the surveyor syllabus — chain survey, instruments, acts, and land records are left out." },
      { icon: "🌀", title: "Confusion from Multiple Materials", desc: "Too many scattered resources with no clear path — students waste time and still feel unprepared." },
      { icon: "🔄", title: "Poor Revision and Retention", desc: "Reading once isn't enough. Without a revision system, key topics fade before exam day." },
      { icon: "📉", title: "Lack of Exam-Level Practice", desc: "Surveyor-specific question banks barely exist. Students go into the exam without adequate practice." },
    ],
    solutions: [
      { icon: "🔁", title: "Study → Revise → Practice", desc: "A proven 3-step system that builds genuine mastery — from understanding surveyor concepts to scoring on exam day." },
      { icon: "🏠", title: "One Platform Covering Complete Preparation", desc: "Video lessons, audio, and quizzes — all in one place for surveyor exams." },
      { icon: "📅", title: "Structured Path for Consistent Progress", desc: "A clear daily study plan so you always know what to do next — no confusion, no wasted sessions." },
      { icon: "📊", title: "Built-In Revision Mode", desc: "Smart revision ensures key topics stay fresh so nothing slips through before exam day." },
    ],
    subjects: [
      "Chain Survey",
      "Compass Survey",
      "Plane Table Survey",
      "Levelling and Contouring",
      "Theodolite Survey",
      "Modern Survey Instruments",
      "AutoCAD",
      "Workshop Calculation and Science",
      "Building Materials and Construction",
    ],
    deliverables: [
      "Complete syllabus coverage — practical + theory integration",
      "Exam-oriented preparation mapped to PSC pattern",
      "Built-in revision mode ensures nothing is forgotten",
      "Graded quizzes after each lesson with unlimited attempts",
    ],
    features: [
      { icon: "🎥", title: "Bite-sized Video Lessons", desc: "Short, focused video lessons per surveyor topic. Visual explanations for instruments and methods." },
      { icon: "🎧", title: "Malayalam Audio Learning", desc: "Every chapter in Malayalam audio — instruments, acts, and survey methods made easy in your language." },
      { icon: "📘", title: "Interactive Text Lessons", desc: "Study → Revision → Exam Mode. Structured surveyor learning with zero wasted time." },
      { icon: "⚡", title: "Practice Quiz", desc: "Graded quiz after every lesson with unlimited attempts. Every wrong answer explained in detail." },
      { icon: "🏆", title: "Live Leaderboard", desc: "See your rank among all surveyor aspirants statewide. Real competition builds real confidence." },
      { icon: "🔁", title: "Built-in Revision Mode", desc: "Smart revision ensures key surveying concepts stay fresh before exam day." },
    ],
    performance: [
      { icon: "⚡", title: "Graded Quizzes After Each Lesson", desc: "Quiz after every topic to ensure real mastery before moving forward." },
      { icon: "🔄", title: "Unlimited Attempts", desc: "Retry any quiz as many times as needed until you truly master the topic." },
      { icon: "📊", title: "Live Leaderboard", desc: "Compete with surveyor aspirants statewide. Real competition builds real confidence." },
    ],
    testimonials: [
      {
        name: "Nivedya C",
        role: "Surveyor Grade 1, KWA",
        text: "Best structured course for surveyor exams. I had no idea where to start — this platform gave me a clear path and I followed it to get my rank.",
      },
      {
        name: "Sneha T S",
        role: "Surveyor Grade 1, KWA",
        text: "The practice system improved my accuracy completely. I used to feel anxious about timed tests — unlimited retries trained me to be consistent.",
      },
      {
        name: "Sheeja T A",
        role: "Senior Instructor (Surveyor), Govt. ITI",
        text: "Easy to revise with audio lessons. I studied during commutes using Malayalam audio — it made retention so much easier than reading notes.",
      },
      {
        name: "Rahul K.",
        role: "Tradesman (Survey), KWA",
        text: "Perfect for working candidates. Evening study, flexible pace, recordings — I prepared without leaving my job and still made the rank list.",
      },
    ],
    bonus: [
      { icon: "👥", title: "Study Groups & Community Access", desc: "Join active surveyor peer groups. Share notes, discuss tough topics, stay accountable together." },
      { icon: "📩", title: "Private Chat Support", desc: "Direct instructor access for doubt clearing — no surveyor question goes unanswered." },
      { icon: "📢", title: "News & Updates Channels", desc: "Stay updated on exam notifications, syllabus changes, and rank list announcements in real time." },
      { icon: "🔁", title: "Built-in Revision Mode", desc: "Smart revision integrated into the platform to help you retain key surveying concepts." },
    ],
    faq: [
      {
        q: "Is the full surveyor syllabus covered?",
        a: "Yes. All subjects — Chain Survey, Compass Survey, Plane Table Survey, Levelling, Theodolite, Modern Instruments, AutoCAD, Workshop Calculation, and Building Materials — are fully covered.",
      },
      {
        q: "Is this course beginner friendly?",
        a: "Yes. The course starts from fundamentals and builds progressively. Students who joined years after completing their ITI have succeeded with this structured system.",
      },
      {
        q: "How does the quiz system work?",
        a: "Every lesson ends with a graded quiz with unlimited attempts. There is also a live leaderboard to track your rank among all surveyor aspirants.",
      },
      {
        q: "Is my progress saved if I renew?",
        a: "Yes. All your progress, scores, and completed chapters are saved across renewals — monthly or yearly.",
      },
      {
        q: "Is Malayalam support available?",
        a: "Yes. Every chapter has a Malayalam audio lesson — surveying methods, instruments, and related topics explained in your own language.",
      },
    ],
  },
};

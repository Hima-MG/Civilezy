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
      { label: "Avg Rating", value: "4.9★" },
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
      "Live Leaderboard & Rank Tracking",
      "Performance Analytics Dashboard",
    ],
    problems: [
      { icon: "📚", title: "No Structured Preparation", desc: "Textbooks, YouTube, random PDFs — no clear path for PSC-specific ITI content." },
      { icon: "🔄", title: "Poor Revision", desc: "Students read once and forget. No system to revise, retain and reinforce topics." },
      { icon: "📉", title: "Less Practice", desc: "Without regular timed practice, real exam pressure becomes overwhelming." },
      { icon: "⏳", title: "Lack of Consistency", desc: "Studying without a schedule leads to gaps, burnout, and missed topics." },
    ],
    solutions: [
      { icon: "🗺️", title: "Learn → Revise → Practice → Improve", desc: "A proven 4-step cycle that takes you from understanding to rank-readiness." },
      { icon: "🏠", title: "All-in-One Platform", desc: "Video lessons, audio, quizzes, live classes, and analytics — all in one place." },
      { icon: "🎧", title: "Malayalam Audio Lessons", desc: "Understand complex concepts in your mother tongue. Study on the go, anywhere." },
      { icon: "📊", title: "Performance Dashboard", desc: "Identify weak subjects, track your rank trajectory, and get daily insights." },
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
      "Practice Exams",
    ],
    deliverables: [
      "Full ITI syllabus — KWA, PWD, LSGD & Irrigation pools covered",
      "LIVE Classes Mon–Fri at 7:30 PM with recordings",
      "Unlimited practice until mastery — unlimited retries",
      "Performance tracking with real-time rank analytics",
    ],
    features: [
      { icon: "🎥", title: "Video Classes", desc: "~30 min focused video lessons per topic. Clear explanations, zero filler." },
      { icon: "🎧", title: "Malayalam Audio Lessons", desc: "Every chapter has a Malayalam audio walkthrough. Learn on commutes." },
      { icon: "📘", title: "Interactive Text Lessons", desc: "Study Mode → Revision Mode → Exam Mode. Structured learning at your pace." },
      { icon: "⚡", title: "Practice Quiz", desc: "Unlimited attempts per quiz. Wrong answers explained. XP + streak rewards." },
      { icon: "🎮", title: "Game Arena Access", desc: "Compete in live quiz battles. Earn XP. Climb the weekly leaderboard." },
      { icon: "📊", title: "Analytics Dashboard", desc: "See your rank, weak areas, accuracy rate, and improvement over time." },
    ],
    performance: [
      { icon: "🏆", title: "Grade A to Unlock Next Chapter", desc: "Score Grade A in each chapter quiz before advancing. Ensures mastery, not just coverage." },
      { icon: "🔄", title: "Unlimited Retries", desc: "Attempt any quiz as many times as needed until you master the topic." },
      { icon: "📊", title: "Leaderboard System", desc: "See your rank among all ITI students. Real competition drives real preparation." },
      { icon: "📈", title: "Progress Over Time", desc: "Track your score curve week by week with detailed improvement graphs." },
    ],
    liveClasses: {
      schedule: "Mon–Fri, 7:30 PM – 9:00 PM IST",
      topics: [
        "Cyclic syllabus — all topics covered in rotation",
        "Recordings available — never miss a class",
        "Doubt clearing — ask questions live",
        "Previous year question walkthroughs",
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
        text: "The quiz system is powerful. After every topic I had to score Grade A before moving on. That forced me to actually master each chapter.",
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
      { icon: "📦", title: "KWA Bundle", desc: "Dedicated KWA-specific question sets, previous papers, and targeted mock tests." },
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
        a: "Yes. LIVE classes run Mon–Fri at 7:30 PM – 9:00 PM IST. All sessions are recorded so you never miss a class.",
      },
      {
        q: "Is my progress saved if I renew?",
        a: "Yes. All your progress, scores, and completed chapters are saved across renewals — monthly or yearly.",
      },
      {
        q: "Is Malayalam support available?",
        a: "Yes. Every chapter has a Malayalam audio lesson so you can understand complex topics in your mother tongue.",
      },
    ],
  },

  diploma: {
    title: "Civil PSC – Diploma",
    subtitle: "For Overseer Gr 1, Overseer Gr 2 & 3, Junior Instructor, Site Engineer & more — across Kerala departments.",
    badge: "Diploma Level Course",
    emoji: "📐",
    pools: ["PWD", "Irrigation", "LSGD", "KWA", "Harbour", "KSEB"],
    stats: [
      { label: "Active Students", value: "5,200+" },
      { label: "Questions", value: "50,000+" },
      { label: "Rank Holders", value: "2,000+" },
      { label: "Avg Rating", value: "4.9★" },
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
      "1,200+ Mock Tests",
      "Smart Interactive Lessons",
      "Bite-sized Video Lectures",
      "Malayalam Audio Lessons",
      "Smart Practice Quiz",
    ],
    problems: [
      { icon: "📚", title: "No Structured Preparation", desc: "Students jump between textbooks, YouTube, and PDFs with no clear path or priority." },
      { icon: "🌀", title: "Confusion from Multiple Sources", desc: "Too many resources, no unified system — it's impossible to know what to trust or follow." },
      { icon: "🔄", title: "Poor Revision and Low Retention", desc: "Reading once and forgetting — there's no system to revise, retain, and reinforce topics." },
      { icon: "📉", title: "Not Enough Exam-Level Practice", desc: "Without regular timed practice at the right difficulty level, real exam pressure becomes overwhelming." },
    ],
    solutions: [
      { icon: "🔁", title: "Learn → Revise → Practice → Test → Master", desc: "A 5-step cycle that takes you from understanding to exam-readiness, one topic at a time." },
      { icon: "🏠", title: "One Platform Covering Everything", desc: "Video lessons, audio, quizzes, mock tests, and analytics — all in one place, nothing missing." },
      { icon: "📅", title: "Designed for Consistent Daily Progress", desc: "A clear study path every day — no confusion, no gaps, no wasted sessions." },
      { icon: "📊", title: "Built-In Revision Prevents Forgetting", desc: "Smart revision surfaces key topics at the right intervals so nothing slips through." },
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
      "Practice Exams (Diploma Level)",
    ],
    deliverables: [
      "Full syllabus coverage — no gaps",
      "Step-by-step structured preparation",
      "Designed for real exam pattern",
      "Practice-driven learning improves exam accuracy",
    ],
    features: [
      { icon: "🎥", title: "Bite-sized Video Lessons", desc: "Short, focused video lessons per topic. High clarity, zero filler." },
      { icon: "🎧", title: "Malayalam Audio Learning", desc: "Every chapter in Malayalam audio — learn complex topics on the go, in your language." },
      { icon: "📘", title: "Interactive Text Lessons", desc: "Study → Revision → Exam Mode. Structured progression with no wasted time." },
      { icon: "⚡", title: "Practice Quiz", desc: "Quiz after every lesson with unlimited attempts. Every wrong answer explained." },
      { icon: "📝", title: "PYQs + Chapter-wise Tests", desc: "All Diploma PSC previous year questions organised by chapter and difficulty." },
      { icon: "🃏", title: "Flashcards & Memory Tools", desc: "Quick-recall flashcards for formulas, definitions, and key facts before exam day." },
    ],
    performance: [
      { icon: "🏆", title: "Grade A to Unlock Next Chapter", desc: "Score Grade A before advancing — ensures true mastery, not just coverage." },
      { icon: "🔄", title: "Unlimited Retries Until Mastery", desc: "Retry any quiz as many times as needed. The system rewards persistence." },
      { icon: "📊", title: "Leaderboard System", desc: "Compete with Diploma students statewide. Real competition keeps you sharp." },
      { icon: "📈", title: "Performance Tracking & Analytics", desc: "Track accuracy by subject, monitor rank movement, and fix weak areas with data." },
    ],
    liveClasses: {
      schedule: "Every Saturday 7:00 PM – 9:00 PM IST",
      topics: [
        "Previous Year Diploma PSC Question Analysis",
        "High-Weightage Topic Deep Dives",
        "Pool-Specific Strategy Sessions",
        "Doubt Clearing & Mock Test Walkthroughs",
      ],
    },
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
        text: "The practice system improved my confidence completely. I used to freeze in mock tests — after unlimited quiz retries, exam day felt like just another practice session.",
      },
      {
        name: "Arya R.",
        role: "Site Engineer, KWA",
        text: "Perfect for working students and repeaters. Evening classes, recordings, flexible study — I prepared while working full-time and still made the rank list.",
      },
    ],
    bonus: [
      { icon: "🔧", title: "Civil PSC ITI Level Course", desc: "Full ITI course access bundled in — revise foundational concepts and cover ITI-level pools." },
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
        q: "Is a practice system included?",
        a: "Yes. Every lesson has a practice quiz with unlimited attempts. You can retry until you score Grade A and unlock the next chapter.",
      },
      {
        q: "Are mock tests included?",
        a: "Yes. 1,200+ full-length Diploma-level mock tests simulating real PSC exam pattern are included in all plans.",
      },
      {
        q: "Is Malayalam support available?",
        a: "Yes. Every chapter has a Malayalam audio lesson so complex topics are easy to understand in your own language.",
      },
    ],
  },

  btech: {
    title: "Civil PSC – B.Tech",
    subtitle: "For B.Tech Civil Engineering graduates targeting Assistant Engineer posts across Kerala departments: PWD • Irrigation • LSGD • KWA • PCB",
    badge: "B.Tech / AE Level Course",
    emoji: "🎓",
    pools: ["PWD", "Irrigation", "LSGD", "KWA", "PCB"],
    stats: [
      { label: "Active Students", value: "5,200+" },
      { label: "AE Questions", value: "70,000+" },
      { label: "Mock Tests", value: "1,500+" },
      { label: "Avg Rating", value: "4.9★" },
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
      "1,500+ Mock Tests",
      "Smart Interactive Lessons",
      "Bite-sized Video Lectures",
      "Malayalam Audio Lessons",
      "Smart Practice Quiz",
      "Rank Booster Lessons (AE Level)",
      "AE Level Mock Tests",
    ],
    problems: [
      { icon: "⚙️", title: "No Structured AE-Level Preparation", desc: "PSC AE questions require deep understanding of design, analysis and theory. Random study doesn't work." },
      { icon: "🔄", title: "Difficulty in Advanced Concepts", desc: "Years after graduation, core B.Tech concepts fade. Advanced theory needs structured re-learning." },
      { icon: "📖", title: "Poor Revision Strategy", desc: "Reading once and forgetting — there's no system to revise, retain, and reinforce AE-level topics." },
      { icon: "📉", title: "Lack of High-Level Practice", desc: "Diploma-level question banks don't prepare you for AE exams. You need AE-specific high-difficulty practice." },
    ],
    solutions: [
      { icon: "🔁", title: "Learn → Revise → Practice → Test → Master", desc: "A proven 5-step cycle designed specifically for AE-level depth and exam pressure." },
      { icon: "🏠", title: "One Platform for Complete AE Preparation", desc: "Video lessons, audio, quizzes, mock tests, and analytics — everything for AE in one place." },
      { icon: "🚀", title: "Structured Path Designed for Rank", desc: "Every subject, every lesson, every test mapped to AE PSC pool patterns — no wasted effort." },
      { icon: "📊", title: "Performance Analytics", desc: "Track your rank trajectory, identify weak subjects, and course-correct before exam day." },
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
      "Practice Exams (AE Level)",
    ],
    deliverables: [
      "Full AE syllabus coverage — PWD, Irrigation, LSGD, KWA & PCB",
      "Advanced concept clarity through structured progression",
      "Exam-focused preparation with 1,500+ AE-level mock tests",
      "Rank Booster Lessons for the highest-difficulty AE questions",
    ],
    features: [
      { icon: "🎥", title: "Bite-sized Video Lessons", desc: "Short, focused AE-level video lessons. Complex topics broken into clear segments." },
      { icon: "🎧", title: "Malayalam Audio Learning", desc: "Design and analysis topics in Malayalam. Understand deeply, not just memorize." },
      { icon: "📘", title: "Interactive Text Lessons", desc: "Study → Revision → Exam Mode. Structured AE learning with zero wasted time." },
      { icon: "⚡", title: "Practice Quiz", desc: "Quiz after every lesson with unlimited attempts. Wrong answers explained in detail." },
      { icon: "📝", title: "PYQs + Chapter-wise Tests", desc: "All AE Civil PSC previous year questions organised by chapter and difficulty." },
      { icon: "🚀", title: "Rank Booster Insights", desc: "Advanced AE concepts and exam shortcuts targeting the toughest PSC questions." },
    ],
    performance: [
      { icon: "🏆", title: "Grade-Based Progression", desc: "Advance only after scoring a passing grade. Ensures real mastery before moving forward." },
      { icon: "🔄", title: "Unlimited Retries", desc: "Attempt any quiz or test as many times as needed until you truly master the topic." },
      { icon: "📊", title: "Leaderboard System", desc: "Compete with AE aspirants statewide. Real competition builds real exam confidence." },
      { icon: "📈", title: "Performance Analytics", desc: "Track accuracy by subject, monitor rank trajectory, and fix weak areas with data." },
    ],
    liveClasses: {
      schedule: "Every Saturday & Sunday 7:00 PM – 9:00 PM IST",
      topics: [
        "AE PYQ Deep Dive Analysis",
        "Structural Design Problem Solving",
        "High-Difficulty Topic Bootcamps",
        "AE Mock Test Walkthroughs & Strategy",
      ],
    },
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
      { icon: "🔧", title: "Civil PSC ITI Level Course", desc: "Full ITI course access bundled in — useful for cross-department pool preparation." },
      { icon: "📦", title: "KWA Bundle (Civil + Mech)", desc: "Dedicated KWA question sets covering both Civil and Mechanical components of the AE paper." },
      { icon: "👥", title: "Study Groups & Community Access", desc: "Join active AE peer groups. Share notes, discuss hard topics, stay accountable." },
      { icon: "📩", title: "Private Chat Support", desc: "Direct instructor access for doubt clearing — no AE-level question goes unanswered." },
    ],
    faq: [
      {
        q: "Is the full AE syllabus covered?",
        a: "Yes. All 14 subjects — Engineering Mechanics, SOM, Structural Analysis, RCC, Steel Structures, Geotechnical Engineering, Fluid Mechanics, Hydrology, Irrigation, Environmental Engineering, Surveying, Transportation, Construction Management, and Quantity Surveying — are fully covered.",
      },
      {
        q: "Is this course beginner friendly?",
        a: "Yes. The course starts from fundamentals and builds up progressively to AE-level depth. No prior coaching experience is needed.",
      },
      {
        q: "Are AE-level questions included?",
        a: "Yes. 70,000+ AE-specific questions across all subjects, mapped to PSC pool patterns for PWD, Irrigation, LSGD, KWA, and PCB.",
      },
      {
        q: "Are mock tests included?",
        a: "Yes. 1,500+ full-length AE-level mock tests with detailed analytics and difficulty levels matching actual PSC AE papers.",
      },
      {
        q: "Is Malayalam support available?",
        a: "Yes. Every chapter has a Malayalam audio lesson so advanced design and analysis topics are easy to understand in your mother tongue.",
      },
    ],
  },

  surveyor: {
    title: "Surveyor Civil PSC",
    subtitle: "For ITI Surveyor license holders targeting Surveyor Gr II, Tradesman (Survey) and all surveyor-grade Kerala PSC posts across departments: KWA • Survey & Land Records • Technical Education • Groundwater Department",
    badge: "Surveyor Grade Course",
    emoji: "📏",
    pools: ["KWA", "Survey & Land Records", "Tech. Education", "Groundwater Dept."],
    stats: [
      { label: "Active Students", value: "5,200+" },
      { label: "Questions", value: "30,000+" },
      { label: "Mock Tests", value: "1,000+" },
      { label: "Avg Rating", value: "4.9★" },
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
      "1,000+ Mock Tests",
      "Smart Interactive Lessons",
      "Bite-sized Video Lectures",
      "Malayalam Audio Lessons",
      "Smart Practice Quiz",
    ],
    problems: [
      { icon: "🔍", title: "No Structured Preparation for Surveyor Exams", desc: "General civil coaching doesn't cover the surveyor syllabus — chain survey, instruments, acts, and land records are left out." },
      { icon: "🌀", title: "Confusion from Multiple Materials", desc: "Too many scattered resources with no clear path — students waste time and still feel unprepared." },
      { icon: "🔄", title: "Poor Revision and Retention", desc: "Reading once isn't enough. Without a revision system, key topics fade before exam day." },
      { icon: "📉", title: "Lack of Exam-Level Practice", desc: "Surveyor-specific question banks barely exist. Students go into the exam without adequate practice." },
    ],
    solutions: [
      { icon: "🔁", title: "Learn → Revise → Practice → Test → Master", desc: "A 5-step cycle that builds genuine mastery — from understanding surveyor concepts to scoring on exam day." },
      { icon: "🏠", title: "One Platform Covering Complete Preparation", desc: "Video lessons, audio, quizzes, mock tests, and analytics — all in one place for surveyor exams." },
      { icon: "📅", title: "Structured Path for Consistent Progress", desc: "A clear daily study plan so you always know what to do next — no confusion, no wasted sessions." },
      { icon: "📊", title: "Revision System Ensures Retention", desc: "Built-in revision surfaces key topics at the right time so nothing slips through before exam day." },
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
      "Practice Exams (Surveyor Level)",
    ],
    deliverables: [
      "Complete syllabus coverage — practical + theory integration",
      "Exam-oriented preparation mapped to PSC pattern",
      "Built-in revision system ensures nothing is forgotten",
      "Practice-driven learning improves speed and accuracy",
    ],
    features: [
      { icon: "🎥", title: "Bite-sized Video Lessons", desc: "Short, focused video lessons per surveyor topic. Visual explanations for instruments and methods." },
      { icon: "🎧", title: "Malayalam Audio Learning", desc: "Every chapter in Malayalam audio — instruments, acts, and survey methods made easy in your language." },
      { icon: "📘", title: "Interactive Text Lessons", desc: "Study → Revision → Exam Mode. Structured surveyor learning with zero wasted time." },
      { icon: "⚡", title: "Practice Quiz", desc: "Quiz after every lesson with unlimited attempts. Every wrong answer explained in detail." },
      { icon: "📝", title: "PYQs + Chapter-wise Tests", desc: "All surveyor-grade Kerala PSC previous year questions organised by chapter and difficulty." },
      { icon: "🎮", title: "Game Arena Access", desc: "Compete in live quiz battles with surveyor aspirants statewide. Earn XP and rank points." },
    ],
    performance: [
      { icon: "🏆", title: "Grade-Based Progression", desc: "Advance only after scoring the required grade — ensures real mastery before moving forward." },
      { icon: "🔄", title: "Unlimited Retries", desc: "Retry any quiz or test as many times as needed until you truly master the topic." },
      { icon: "📊", title: "Leaderboard System", desc: "Compete with surveyor aspirants statewide. Real competition builds real confidence." },
      { icon: "📈", title: "Performance Analytics", desc: "Track accuracy by subject, monitor rank movement, and identify weak areas with data." },
    ],
    liveClasses: {
      schedule: "Every Sunday 6:00 PM – 8:00 PM IST",
      topics: [
        "Surveyor PSC PYQ Analysis",
        "Modern Surveying Instruments Deep Dive",
        "Land Acts & Revenue Laws Session",
        "Mock Test Walkthroughs & Strategy",
      ],
    },
    testimonials: [
      {
        name: "Nivedya C",
        role: "Surveyor Grade 1, KWA",
        text: "Best structured course for surveyor exams. I had no idea where to start — this platform gave me a clear path and I followed it to get my rank.",
      },
      {
        name: "Sneha T S",
        role: "Surveyor Grade 1, KWA",
        text: "The practice system improved my accuracy completely. I used to make silly mistakes in timed tests — unlimited retries trained me to be consistent.",
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
      { icon: "⚔️", title: "CIVIL WAR Access", desc: "Live competitive quiz battles exclusively for surveyor-level students. Test yourself under real pressure." },
      { icon: "📢", title: "News & Updates Channels", desc: "Stay updated on exam notifications, syllabus changes, and rank list announcements in real time." },
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
        q: "Are mock tests included?",
        a: "Yes. 1,000+ full-length surveyor-level mock tests simulating real PSC exam pattern are included in all plans.",
      },
      {
        q: "Is Malayalam support available?",
        a: "Yes. Every chapter has a Malayalam audio lesson — surveying methods, instruments, and related topics explained in your own language.",
      },
      {
        q: "Is an installment option available?",
        a: "Yes. The ₹15,000 annual plan can be paid as ₹3,750 every 3 months — 4 installments, zero interest, cancel anytime.",
      },
    ],
  },
};

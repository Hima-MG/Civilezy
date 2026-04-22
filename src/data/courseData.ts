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
    subtitle: "Kerala's #1 ITI Level Civil PSC Preparation Platform",
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
      "Pool-mapped syllabus — KWA, PWD, LSGD, Irrigation",
      "Malayalam Audio Lessons for every chapter",
      "Smart Quiz after each lesson with XP rewards",
      "Game Arena — compete with 5,000+ students",
      "Live Leaderboard & Rank Tracking",
      "Bite-sized Video Lessons — 40–50 min, zero filler",
    ],
    problems: [
      { icon: "📚", title: "Scattered Resources", desc: "Textbooks, YouTube, random PDFs — no structured path for PSC-specific ITI content." },
      { icon: "🌐", title: "Not in Malayalam", desc: "Complex civil engineering topics explained only in English — hard to grasp quickly." },
      { icon: "❓", title: "No Idea What to Study", desc: "PSC syllabus varies by pool (KWA, PWD, LSGD). No one maps it out clearly." },
      { icon: "📉", title: "Can't Track Progress", desc: "No way to know your weak areas or whether you're actually rank-ready." },
    ],
    solutions: [
      { icon: "🗺️", title: "Pool-Mapped Syllabus", desc: "Every lesson is mapped to your specific department pool — study only what matters." },
      { icon: "🎧", title: "Malayalam Audio Lessons", desc: "Understand complex concepts in your mother tongue. Study on the go, anywhere." },
      { icon: "⚡", title: "Smart Quiz System", desc: "Topic-level quizzes with instant feedback, XP rewards, and streak tracking." },
      { icon: "📊", title: "Performance Dashboard", desc: "Identify weak subjects, track your rank trajectory, and get daily insights." },
    ],
    subjects: [
      "Building Materials & Construction",
      "Surveying & Levelling",
      "Basic Structural Engineering",
      "Water Supply & Sanitation",
      "Road Engineering",
      "Building Drawing & Drafting",
      "Concrete Technology",
      "Irrigation Engineering",
      "Soil & Foundation Basics",
      "Estimating & Costing",
    ],
    features: [
      { icon: "📘", title: "Smart Interactive Lessons", desc: "Study Mode → Revision Mode → Exam Mode. Structured learning, no wasted time." },
      { icon: "🎧", title: "Malayalam Audio Lessons", desc: "Every chapter has a Malayalam audio walkthrough. Learn on commutes." },
      { icon: "🎥", title: "Short Video Lectures", desc: "40–50 minute focused videos per topic. Zero filler, maximum impact." },
      { icon: "⚡", title: "Graded Quiz System", desc: "Quiz after every lesson. Wrong answers explained. XP + streak rewards." },
      { icon: "🎮", title: "Game Arena Access", desc: "Compete in live quiz battles. Earn XP. Climb the weekly leaderboard." },
      { icon: "📊", title: "Analytics Dashboard", desc: "See your rank, weak areas, accuracy rate, and improvement over time." },
    ],
    performance: [
      { icon: "🏆", title: "Live Rank Tracker", desc: "Know your rank among all ITI students in real time." },
      { icon: "🎯", title: "Weak Area Heatmap", desc: "Visual breakdown of your accuracy by subject and topic." },
      { icon: "🔥", title: "Daily Streak System", desc: "Study every day and maintain your streak. Consistency = ranks." },
      { icon: "📈", title: "Progress Over Time", desc: "Watch your score curve rise week by week with detailed graphs." },
    ],
    liveClasses: {
      schedule: "Every Sunday 7:00 PM – 9:00 PM IST",
      topics: [
        "Previous Year Question Analysis",
        "High-Weightage Topic Deep Dives",
        "Doubt Clearing Sessions",
        "Mock Test Walkthroughs",
      ],
    },
    testimonials: [
      {
        name: "Sajeev",
        role: "Overseer Grade 3, Chittoor",
        text: "I had only the ITI qualification and never imagined I would get a government job. The structured coaching and consistent support made this dream come true.",
      },
      {
        name: "Anila S. A",
        role: "Second Grade Draftsman, PWD",
        text: "After studying polytechnic, I used to write all the PSC exams without missing a single one. The coaching helped me understand how to tackle questions without getting negative marks.",
      },
      {
        name: "Priya KS",
        role: "First Grade Overseer, LSGD",
        text: "I attended coaching after 15 years of completing my academics and scored a good rank. I thought a government job was not for a common woman — I proved myself wrong.",
      },
    ],
    bonus: [
      { icon: "📱", title: "WhatsApp Study Group", desc: "Join 1,000+ ITI students. Daily questions, exam notifications, peer support." },
      { icon: "📄", title: "Pool-Specific Study Plan PDF", desc: "Tailored 6-month study plan for your specific PSC pool (KWA / PWD / LSGD)." },
      { icon: "📝", title: "Previous Year Questions Bank", desc: "All ITI Civil PSC PYQs from the last 10 years — fully solved and explained." },
    ],
    faq: [
      {
        q: "Which departments does the ITI course cover?",
        a: "This course covers KWA, PWD, LSGD, and Irrigation department pools for ITI-level posts including Overseer Grade 2 & 3, Draughtsman, Tradesman, Tracer, and Work Superintendent.",
      },
      {
        q: "Is the content in Malayalam or English?",
        a: "Both! All lessons are in English with Malayalam audio alternatives so you can learn complex topics in your mother tongue.",
      },
      {
        q: "Can I access the platform on mobile?",
        a: "Yes. The platform works on Android, iOS, and any browser. We also have a dedicated app on Google Play and the App Store.",
      },
      {
        q: "What is the difference between Monthly and Annual plan?",
        a: "The monthly plan is ₹1,800/month (auto-renewing). The annual plan is ₹15,000/year (save ₹6,600 vs monthly) and is available in 3 quarterly installments.",
      },
      {
        q: "Is there a refund policy?",
        a: "Yes. We offer a refund as per our refund policy. Contact support@civilezy.in within 7 days of purchase for any issues.",
      },
      {
        q: "How many questions are in the question bank?",
        a: "50,000+ questions across all ITI topics, with new questions added every week.",
      },
    ],
  },

  diploma: {
    title: "Civil PSC – Diploma",
    subtitle: "Kerala's #1 Diploma Level Civil PSC Preparation Platform",
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
      "Covers 6 department pools — PWD, Irrigation, LSGD, KWA, Harbour, KSEB",
      "Malayalam Audio Lessons for every subject chapter",
      "50,000+ PSC-pattern questions across all pools",
      "Game Arena — compete with Kerala's best diploma students",
      "Rank Booster lessons for high-difficulty PSC topics",
      "Performance analytics with weak area identification",
    ],
    problems: [
      { icon: "🌀", title: "Too Many Pools to Cover", desc: "PWD, Irrigation, LSGD, KWA, Harbour, KSEB — each has different weightage. Overwhelming without guidance." },
      { icon: "📖", title: "Textbooks Are Too Theoretical", desc: "PSC asks application-level questions. Standard textbooks alone don't prepare you for that." },
      { icon: "⏳", title: "Wasting Time on Wrong Topics", desc: "Without a structured plan, students spend months on low-weightage topics and miss the important ones." },
      { icon: "😟", title: "No Performance Feedback", desc: "You don't know if you're on track until exam day — by then it's too late to course-correct." },
    ],
    solutions: [
      { icon: "🗺️", title: "6-Pool Mapped Syllabus", desc: "Each pool's exact weightage covered. Study smart, not hard — every topic has a purpose." },
      { icon: "🎯", title: "PSC-Pattern Questions", desc: "Every quiz and lesson uses PSC-exam style questions with negative marking simulation." },
      { icon: "📅", title: "Structured Study Roadmap", desc: "Day-by-day, topic-by-topic study plan. Never wonder what to study next." },
      { icon: "📊", title: "Real-Time Analytics", desc: "Know your weak subjects, track rank changes, and receive daily performance summaries." },
    ],
    subjects: [
      "Building Materials & Construction",
      "Surveying & Levelling",
      "Structural Engineering & Analysis",
      "Fluid Mechanics & Hydraulics",
      "Soil Mechanics & Foundation Engineering",
      "Water Supply & Environmental Engineering",
      "Transportation Engineering",
      "Concrete Technology & RCC Design",
      "Irrigation Engineering",
      "Estimating, Costing & Specifications",
      "Building Drawing & AutoCAD Basics",
      "Construction Management",
    ],
    features: [
      { icon: "📘", title: "Smart Interactive Lessons", desc: "Study Mode → Revision Mode → Exam Mode. Structured, progressive learning for every topic." },
      { icon: "🎧", title: "Malayalam Audio Lessons", desc: "Complex Diploma-level topics explained in Malayalam. Learn anywhere, anytime." },
      { icon: "🎥", title: "Short Video Lectures", desc: "Focused 40–50 min videos per topic. High-density, zero filler content." },
      { icon: "⚡", title: "Graded Quiz System", desc: "Test yourself after every lesson. Instant explanation for every wrong answer." },
      { icon: "🎮", title: "Game Arena Access", desc: "Live quiz battles with students statewide. Real competition, real motivation." },
      { icon: "🚀", title: "Rank Booster Lessons", desc: "Advanced questions and shortcuts for high-difficulty PSC topics unique to Diploma level." },
    ],
    performance: [
      { icon: "🏆", title: "Live Rank Tracker", desc: "Compare your score with all Diploma students. Know exactly where you stand." },
      { icon: "🎯", title: "Weak Topic Heatmap", desc: "Visual map of your accuracy by subject — fix weak spots before exam day." },
      { icon: "🔥", title: "Streak & XP System", desc: "Daily streaks and XP points keep you consistent. Consistency wins PSC exams." },
      { icon: "📈", title: "Monthly Progress Reports", desc: "Detailed reports showing score improvement, study hours, and rank movement." },
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
        text: "I joined seven years after completing my diploma. Even so, structured classes gave me confidence. I succeeded in getting the job with a good rank.",
      },
      {
        name: "Manjusha V",
        role: "Assistant Engineer, PWD",
        text: "Just after completing my diploma, I joined coaching. I received advice for almost 13 posts. The coaching helped me understand exactly how to tackle PSC MCQ questions.",
      },
      {
        name: "Sumitha M S",
        role: "First Grade Draftsman, Irrigation",
        text: "I completed my Diploma in 2000 and worked privately for years. After joining coaching, I became part of government service. It changed my entire life.",
      },
    ],
    bonus: [
      { icon: "📱", title: "WhatsApp Study Group", desc: "Join 2,000+ Diploma students. Daily PYQs, exam notifications, peer discussions." },
      { icon: "📄", title: "Pool-Specific Study Plan", desc: "Tailored roadmap for each of the 6 department pools. No wasted study time." },
      { icon: "📝", title: "PYQ Bank (10 Years)", desc: "All Diploma Civil PSC previous year questions, fully solved and categorized by topic." },
    ],
    faq: [
      {
        q: "Which pools are covered in the Diploma course?",
        a: "PWD, Irrigation, LSGD, KWA, Harbour Engineering, and KSEB — covering Overseer Grade 1/2/3, Junior Instructor, Site Engineer, and more.",
      },
      {
        q: "Is this different from the B.Tech course?",
        a: "Yes. The Diploma course focuses on Overseer-level posts. The B.Tech course covers Assistant Engineer (AE) level with deeper design and analysis content.",
      },
      {
        q: "Can I study for multiple pools with one subscription?",
        a: "Yes! All pools under the Diploma course are included in a single subscription. Study for multiple pools simultaneously.",
      },
      {
        q: "Are the video lectures downloadable?",
        a: "Videos can be streamed on the app. Download availability depends on your plan. Contact support@civilezy.in for details.",
      },
      {
        q: "How is the annual plan charged?",
        a: "The annual plan (₹17,000) can be paid fully or in 3 quarterly installments — no interest, easy on your wallet.",
      },
      {
        q: "Is there mock test access?",
        a: "Yes. Full-length mock tests simulating PSC exam pattern are included in all plans.",
      },
    ],
  },

  btech: {
    title: "Civil PSC – B.Tech",
    subtitle: "Kerala's #1 Assistant Engineer PSC Preparation Platform",
    badge: "B.Tech / AE Level Course",
    emoji: "🎓",
    pools: ["PWD", "Irrigation", "LSGD", "KWA", "PCB"],
    stats: [
      { label: "Active Students", value: "5,200+" },
      { label: "AE Questions", value: "50,000+" },
      { label: "Rank Holders", value: "2,000+" },
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
      "AE-level content for PWD, Irrigation, LSGD, KWA, PCB",
      "Rank Booster Lessons — advanced AE concepts & exam shortcuts",
      "AE-Level Mock Tests — ultra-high difficulty, exam-ready questions",
      "Malayalam Audio for complex design & analysis topics",
      "Complete structural design, geotechnical, hydrology coverage",
      "Rank trajectory analytics — know your position week by week",
    ],
    problems: [
      { icon: "⚙️", title: "AE Exam Is Brutally Tough", desc: "PSC AE questions require deep understanding of design, analysis and theory. Self-study alone isn't enough." },
      { icon: "🔄", title: "B.Tech Concepts Are Forgotten", desc: "Years pass after graduation. Core concepts fade. You need systematic revision, not re-reading textbooks." },
      { icon: "🧩", title: "No AE-Specific Resources", desc: "Most coaching centers teach Diploma-level. There's almost nothing truly AE-caliber for Kerala PSC." },
      { icon: "📉", title: "Rank Stagnation", desc: "Students write exams repeatedly without improving rank — weak topics are never identified and fixed." },
    ],
    solutions: [
      { icon: "🎓", title: "AE-Caliber Lessons", desc: "Lessons built specifically for B.Tech graduates targeting AE posts — design, analysis, advanced theory." },
      { icon: "🔁", title: "Rapid Revision Mode", desc: "Smart revision system re-surfaces forgotten concepts at the right time using spaced-repetition logic." },
      { icon: "🚀", title: "Rank Booster Program", desc: "High-difficulty lessons targeting the top 10% of AE questions. Built to push you into rank lists." },
      { icon: "📊", title: "Rank Trajectory Analytics", desc: "See exactly how your rank changes week-over-week. Data-driven, not guess-based preparation." },
    ],
    subjects: [
      "Structural Analysis & Indeterminate Structures",
      "RCC Design (IS 456)",
      "Steel Structure Design (IS 800)",
      "Geotechnical Engineering & Foundation Design",
      "Fluid Mechanics & Hydraulic Machines",
      "Open Channel Flow & Hydraulics",
      "Hydrology & Water Resources Engineering",
      "Environmental Engineering (Water & Wastewater)",
      "Highway Engineering & Pavement Design",
      "Surveying & Advanced Geomatics",
      "Construction Management & CPM/PERT",
      "Estimating, Costing & Valuation",
      "Building Materials & Quality Control",
      "Concrete Technology & Mix Design",
      "Irrigation Engineering & Canal Design",
    ],
    features: [
      { icon: "📘", title: "Smart Interactive Lessons", desc: "AE-specific Study → Revision → Exam Mode. Every concept structured for exam relevance." },
      { icon: "🎧", title: "Malayalam Audio Lessons", desc: "Design and analysis topics in Malayalam. Understand deeply, not just memorize." },
      { icon: "🎥", title: "Short Video Lectures", desc: "40–50 min AE-level focused videos. Complex topics broken down visually." },
      { icon: "🚀", title: "Rank Booster Lessons", desc: "Advanced AE concepts and question-solving techniques for the toughest PSC questions." },
      { icon: "🎯", title: "AE Mock Tests", desc: "Full-length, ultra-high difficulty mock tests simulating actual AE PSC paper pattern." },
      { icon: "🎮", title: "Game Arena Access", desc: "Compete against Kerala's sharpest B.Tech PSC aspirants. Rise through the leaderboard." },
    ],
    performance: [
      { icon: "🏆", title: "AE Rank Tracker", desc: "Live rank among B.Tech / AE aspirants statewide. Always know where you stand." },
      { icon: "🎯", title: "Subject Accuracy Heatmap", desc: "Identify your weakest design & theory subjects before they cost you rank points." },
      { icon: "🔥", title: "Streak & XP System", desc: "Maintain study streaks and earn XP. Daily discipline builds rank-list scores." },
      { icon: "📈", title: "Rank Trajectory Graph", desc: "Watch your rank improve week by week. Data-driven, not guess-based preparation." },
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
        text: "I secured a place in about ten different rank lists and entered service in four departments. The dedicated training, well-structured materials, and motivating environment made it possible.",
      },
      {
        name: "Reji Johnson",
        role: "Assistant Engineer, KWA",
        text: "Within the first 6 months of starting coaching, I made it to the 3rd Grade rank list of the Water Authority. Coaching was the big turning point in my life.",
      },
      {
        name: "Nitha Santhosh",
        role: "Assistant Engineer, LSGD",
        text: "After two years of structured coaching, I was listed in LSGD 1st Grade, PWD 2nd Grade, and several others. The study methods made all the difference.",
      },
    ],
    bonus: [
      { icon: "📱", title: "AE Students WhatsApp Group", desc: "Network with 500+ B.Tech PSC aspirants. Strategy sessions, AE notifications, peer learning." },
      { icon: "🚀", title: "Rank Booster PDF Pack", desc: "High-difficulty AE question collections with step-by-step solutions. Covers all major departments." },
      { icon: "📝", title: "AE PYQ Bank (10 Years)", desc: "All B.Tech / AE Civil PSC previous year questions from 2015–2025, sorted by topic and difficulty." },
    ],
    faq: [
      {
        q: "Is this course only for fresh B.Tech graduates?",
        a: "No. This course is for any B.Tech Civil graduate preparing for AE-level Kerala PSC posts, regardless of when they graduated.",
      },
      {
        q: "What posts can I apply for with this course?",
        a: "Assistant Engineer posts in PWD, Irrigation, LSGD, KWA, PCB, and other Kerala government departments.",
      },
      {
        q: "Are RCC and Steel Design covered in detail?",
        a: "Yes. IS 456-based RCC design and IS 800-based Steel design are covered with problem-solving at the actual PSC exam level.",
      },
      {
        q: "How is this different from the Diploma course?",
        a: "The B.Tech course includes Rank Booster Lessons and AE-level Mock Tests — ultra-high difficulty content designed specifically for Assistant Engineer exams.",
      },
      {
        q: "Can I access content offline?",
        a: "Audio lessons and notes can be downloaded on the app. Video streaming is online. Contact support for specific offline access queries.",
      },
      {
        q: "Is the annual plan available in installments?",
        a: "Yes. The ₹20,000 annual plan can be paid in 3 quarterly installments — zero interest.",
      },
    ],
  },

  surveyor: {
    title: "Surveyor Civil PSC",
    subtitle: "Kerala's Only Dedicated Surveyor PSC Preparation Platform",
    badge: "Surveyor Grade Course",
    emoji: "📏",
    pools: ["KWA", "Survey & Land Records", "Tech. Education", "Groundwater Dept."],
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
      checkoutUrl: EXTERNAL_URLS.checkout.surveyor,
    },
    highlights: [
      "Dedicated Surveyor syllabus — KWA, Survey & Land Records, Tech Education, Groundwater",
      "Malayalam Audio for all surveying topics and land acts",
      "Modern instruments: Total Station, GPS, GIS, Remote Sensing",
      "Land Records Acts and Revenue laws simplified",
      "10,000+ Surveyor-specific PSC-pattern questions",
      "Game Arena — compete with surveyor aspirants statewide",
    ],
    problems: [
      { icon: "🔍", title: "No Surveyor-Specific Resources", desc: "General civil coaching doesn't cover the surveyor syllabus depth — land records, acts, modern instruments." },
      { icon: "📜", title: "Acts & Laws Are Hard to Memorize", desc: "Kerala Land Survey Acts, Revenue Acts — dry, dense legal content that standard notes don't simplify." },
      { icon: "🛠️", title: "Modern Instruments Rarely Taught", desc: "Total Station, GPS, GIS, Remote Sensing — most coaching skips these but PSC consistently asks them." },
      { icon: "❌", title: "Barely Any Practice Questions", desc: "Surveyor-specific question banks barely exist. Students go into the exam unprepared." },
    ],
    solutions: [
      { icon: "🗺️", title: "Surveyor-Mapped Curriculum", desc: "Every topic from traditional chain surveying to modern GPS — mapped to each PSC pool's exact pattern." },
      { icon: "📜", title: "Acts Simplified in Malayalam", desc: "Land Survey Act, Registration Act, and Revenue laws — explained in simple Malayalam with memory aids." },
      { icon: "🛰️", title: "Modern Surveying Module", desc: "Total Station, GPS, DGPS, GIS, Remote Sensing — comprehensive coverage with PSC practice questions." },
      { icon: "⚡", title: "Surveyor Question Bank", desc: "10,000+ surveyor-specific PSC-pattern questions covering all pools and difficulty levels." },
    ],
    subjects: [
      "Plane Surveying & Chain Surveying",
      "Compass Surveying & Bearings",
      "Levelling & Contouring",
      "Theodolite Surveying",
      "Total Station Operation & Data Processing",
      "GPS, DGPS & Remote Sensing",
      "GIS Basics & Applications",
      "Tacheometric Surveying",
      "Triangulation & Trilateration",
      "Area & Volume Calculations",
      "Map Reading & Interpretation",
      "Kerala Land Survey Acts",
      "Revenue Laws & Land Records",
      "Registration Act Basics",
      "Field Astronomy",
    ],
    features: [
      { icon: "📘", title: "Smart Interactive Lessons", desc: "Survey theory in structured Study → Revision → Exam modes. Topic-by-topic mastery." },
      { icon: "🎧", title: "Malayalam Audio Lessons", desc: "Complex acts, instruments, and survey methods in Malayalam. Study anywhere." },
      { icon: "🎥", title: "Short Video Lectures", desc: "40–50 min videos on survey topics. Visual explanations for instrument operations." },
      { icon: "⚡", title: "Graded Quiz System", desc: "Quiz after every topic. Negative marking simulation. Instant explanations for wrong answers." },
      { icon: "🎮", title: "Game Arena Access", desc: "Compete in live quiz battles with surveyor aspirants. Earn XP and rank points." },
      { icon: "📜", title: "Acts & Laws Module", desc: "Dedicated module for Kerala Land Survey Acts, Revenue Acts, and Registration laws." },
    ],
    performance: [
      { icon: "🏆", title: "Surveyor Rank Tracker", desc: "Live rank among surveyor PSC aspirants. Know your exact position at all times." },
      { icon: "🎯", title: "Topic Accuracy Map", desc: "See exactly which surveying topics you're strong and weak in — then fix them." },
      { icon: "🔥", title: "Streak System", desc: "Daily study streaks with XP rewards. Consistent students top the rank list." },
      { icon: "📈", title: "Progress Graphs", desc: "Track your score improvement weekly. Data shows exactly where to focus next." },
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
        text: "The platform has helped numerous candidates secure top ranks and obtain government jobs. Both the content and the overall experience have been exceptional.",
      },
      {
        name: "Sneha T S",
        role: "Surveyor Grade 1, KWA",
        text: "I appeared in about 20 rank lists including a first rank, second rank, and fifth rank. I can proudly say that structured coaching completely changed my career.",
      },
      {
        name: "Sheeja T A",
        role: "Senior Instructor (Surveyor), Govt. ITI",
        text: "The ranks I obtained — Field Assistant 5th Rank, Training Instructor 6th Rank, Junior Instructor 2nd Rank — were truly beyond my own expectations.",
      },
    ],
    bonus: [
      { icon: "📱", title: "Surveyor Students WhatsApp Group", desc: "Connect with 500+ surveyor aspirants. Daily questions, exam alerts, and peer support." },
      { icon: "📄", title: "Acts & Laws Summary PDF", desc: "All Kerala Land Survey Acts, Revenue Laws, and Registration Acts — condensed into a smart reference PDF." },
      { icon: "📝", title: "Surveyor PYQ Bank", desc: "All surveyor-grade Kerala PSC previous year questions from the last 10 years — fully solved." },
    ],
    faq: [
      {
        q: "What qualification is needed for this course?",
        a: "This course is for candidates holding an ITI Surveyor license or equivalent surveyor qualification targeting Kerala PSC Surveyor grade posts.",
      },
      {
        q: "Which departments are covered?",
        a: "KWA (Kerala Water Authority), Survey & Land Records Department, Technical Education, and Groundwater Department.",
      },
      {
        q: "Are Land Records Acts included?",
        a: "Yes. Kerala Land Survey Act, Registration Act, and relevant Revenue laws are covered with simplified explanations and MCQs.",
      },
      {
        q: "Is GPS and Total Station content included?",
        a: "Yes. Modern surveying instruments including Total Station, GPS/DGPS, GIS basics, and Remote Sensing are fully covered.",
      },
      {
        q: "What is the pricing?",
        a: "Monthly plan is ₹1,800/month. Annual plan is ₹15,000/year (save ₹6,600 vs monthly). Annual plan available in 3 quarterly installments.",
      },
      {
        q: "Is there a free trial?",
        a: "Yes! Request a free trial at learn.civilezy.in/free-trial-request and explore the platform before committing.",
      },
    ],
  },
};

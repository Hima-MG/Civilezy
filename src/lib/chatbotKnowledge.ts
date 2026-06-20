/**
 * chatbotKnowledge.ts
 *
 * Static knowledge chunks for the CivilEzy AI knowledge base.
 * These represent all publicly available information on the website —
 * course details, pricing, features, platform info, and processes.
 *
 * These are seeded into the `knowledge_base` Firestore collection via
 * POST /api/admin/chatbot/sync?source=static
 *
 * Keep this file updated whenever website content changes.
 * DO NOT include speculative content or prices that may change frequently.
 */

export interface KnowledgeChunk {
  id?: string;
  source: "static" | "course" | "ebook" | "announcement" | "blog";
  title: string;
  content: string;
  keywords: string[];
  category: string;
  url?: string;
  sourceId?: string;
  syncedAt: string;
  status: "active";
}

const now = () => new Date().toISOString();

// ─────────────────────────────────────────────────────────────────────────────
// COURSES
// Source: PricingSection.tsx + course detail pages
// ─────────────────────────────────────────────────────────────────────────────

export const STATIC_KNOWLEDGE: Omit<KnowledgeChunk, "syncedAt">[] = [

  // ── ITI Civil Course ─────────────────────────────────────────────────────

  {
    source: "course",
    title: "Civil PSC ITI Course — Overview & Pricing",
    content: `CivilEzy offers the Civil PSC – ITI course for ITI Civil Engineering candidates preparing for Kerala PSC exams.

Who it's for: ITI-level candidates appearing for posts like Overseer / Draughtsman Grade 2 & 3, Tradesman, Tracer, Work Superintendent, and similar roles across various Kerala government departments.

Pricing:
• Monthly plan: ₹1,800 per month
• Annual plan: ₹15,000 per year (save ₹6,600 compared to monthly — that's 30% off)
• Original annual price: ₹21,600

PSC pools covered: KWA (Kerala Water Authority), PWD (Public Works Department), LSGD (Local Self Government Department), Irrigation Department.

How to purchase / enroll: Visit the CivilEzy pricing page at civilezy.in/pricing or go directly to the checkout page. You can also contact us on WhatsApp at 90723 45630 for help with enrollment.`,
    keywords: ["iti", "iti course", "iti civil", "iti pricing", "iti price", "iti plan", "overseer", "draughtsman", "tradesman", "tracer", "work superintendent", "kwa", "pwd", "lsgd", "irrigation", "iti monthly", "iti annual"],
    category: "Courses",
    url: "https://civilezy.in/courses/iti",
    status: "active",
  },

  {
    source: "course",
    title: "Civil PSC ITI Course — Features & Content",
    content: `The CivilEzy Civil PSC ITI course includes the following features:

• Smart Interactive Lessons — Study Mode, Revision Mode, and Exam Mode
• Bite-sized Video Lectures: focused, exam-oriented videos
• Malayalam Audio Lessons: complex topics explained in Malayalam for better understanding
• Graded Quiz after every lesson: instant feedback and XP points
• Game Arena access: compete with other students in real-time MCQ battles
• Live Leaderboard & Performance Analytics: track your rank and weak areas daily

The ITI course covers the full Kerala PSC syllabus for ITI-level Civil Engineering posts. Content is structured around the PSC pool-mapped syllabus with no wasted topics.`,
    keywords: ["iti features", "iti content", "iti syllabus", "iti lessons", "iti video", "iti quiz", "iti game arena", "what is included iti", "iti course content"],
    category: "Courses",
    url: "https://civilezy.in/courses/iti",
    status: "active",
  },

  // ── Diploma Civil Course ──────────────────────────────────────────────────

  {
    source: "course",
    title: "Civil PSC Diploma Course — Overview & Pricing",
    content: `CivilEzy's most popular course: Civil PSC – Diploma, for Diploma Civil Engineering holders preparing for Kerala PSC exams.

Who it's for: Diploma Civil Engineering candidates targeting posts like Overseer Grade 1, Overseer Grade 2 & 3, Junior Instructor, Site Engineer, and more across Kerala government departments.

Pricing:
• Monthly plan: ₹2,000 per month
• Annual plan: ₹17,000 per year (save ₹7,000 — 29% off)
• Original annual price: ₹24,000

PSC pools covered: PWD, Irrigation Department, LSGD, KWA, Harbour Engineering, KSEB.

This is the most popular CivilEzy course, recommended for Diploma-level candidates.

How to purchase: Visit civilezy.in/pricing or contact us on WhatsApp at 90723 45630.`,
    keywords: ["diploma", "diploma course", "diploma civil", "diploma price", "diploma pricing", "diploma plan", "diploma monthly", "diploma annual", "overseer grade 1", "overseer", "junior instructor", "site engineer", "kseb", "harbour", "diploma popular"],
    category: "Courses",
    url: "https://civilezy.in/courses/diploma",
    status: "active",
  },

  {
    source: "course",
    title: "Civil PSC Diploma Course — Features & Content",
    content: `The CivilEzy Civil PSC Diploma course includes:

• Smart Interactive Lessons — Study Mode, Revision Mode, and Exam Mode
• Bite-sized Video Lectures: focused, exam-oriented content
• Malayalam Audio Lessons: learn complex Civil Engineering topics in Malayalam
• Graded Quiz after every lesson: instant XP and performance tracking
• Game Arena access: compete with other students in PSC MCQ battles
• Live Leaderboard & Performance Analytics: identify weak areas and track rank

The Diploma course covers the full PSC syllabus for Diploma-level Civil Engineering posts including all major technical subjects like Surveying, Concrete Technology, Soil Mechanics, Irrigation Engineering, Highway Engineering, and Estimating & Costing.`,
    keywords: ["diploma features", "diploma content", "diploma syllabus", "diploma lessons", "diploma video", "diploma malayalam", "diploma quiz", "what is in diploma course", "diploma subjects"],
    category: "Courses",
    url: "https://civilezy.in/courses/diploma",
    status: "active",
  },

  // ── B.Tech / AE Course ────────────────────────────────────────────────────

  {
    source: "course",
    title: "Civil PSC B.Tech / AE Course — Overview & Pricing",
    content: `CivilEzy's Civil PSC – B.Tech course is for B.Tech Civil Engineering graduates targeting Assistant Engineer (AE) posts in Kerala government departments.

Who it's for: B.Tech Civil Engineering graduates preparing for AE posts in PWD, Irrigation, LSGD, KWA, PCB (Public Works Corporation of Kerala) and similar departments.

Pricing:
• Monthly plan: ₹2,500 per month
• Annual plan: ₹20,000 per year (save ₹10,000 — 33% off)
• Original annual price: ₹30,000

PSC pools covered: PWD, Irrigation Department, LSGD, KWA, PCB.

This is the premium course for AE-level preparation, featuring additional content like Rank Booster Lessons and AE-Level Mock Tests.

How to purchase: Visit civilezy.in/pricing or contact us on WhatsApp at 90723 45630.`,
    keywords: ["btech", "b.tech", "ae", "assistant engineer", "btech course", "ae course", "btech price", "btech pricing", "btech annual", "btech monthly", "kwa ae", "pwd ae", "lsgd ae", "pcb", "btech civil"],
    category: "Courses",
    url: "https://civilezy.in/courses/btech",
    status: "active",
  },

  {
    source: "course",
    title: "Civil PSC B.Tech / AE Course — Features & Content",
    content: `The CivilEzy Civil PSC B.Tech / AE course includes everything in other plans PLUS exclusive AE-level content:

• Smart Interactive Lessons — Study Mode, Revision Mode, and Exam Mode
• Bite-sized Video Lectures
• Malayalam Audio Lessons: all topics explained in Malayalam
• Graded Quiz after every lesson
• Game Arena access: competitive MCQ practice
• Live Leaderboard & Performance Analytics
• EXCLUSIVE: Rank Booster Lessons — Advanced AE-level concepts and insights beyond standard syllabus
• EXCLUSIVE: AE Level Mock Tests — Ultra-high difficulty exam-ready questions that match actual AE exam pattern

The B.Tech course covers the complete Kerala PSC AE syllabus including all core Civil Engineering subjects at graduate level: Structural Engineering, Geotechnical Engineering, Fluid Mechanics, Transportation Engineering, Environmental Engineering, Construction Management, and more.`,
    keywords: ["btech features", "ae features", "btech content", "ae content", "btech syllabus", "ae syllabus", "rank booster", "ae mock test", "btech lessons", "ae level", "ae exam", "what is btech course", "btech included"],
    category: "Courses",
    url: "https://civilezy.in/courses/btech",
    status: "active",
  },

  // ── Surveyor Course ───────────────────────────────────────────────────────

  {
    source: "course",
    title: "Surveyor Course — Overview & Pricing",
    content: `CivilEzy's Surveyor Course is designed for ITI Surveyor license holders preparing for Kerala PSC Surveyor exams.

Who it's for: ITI Surveyor license holders targeting Surveyor Grade II, Tradesman (Survey), and all Surveyor-grade Kerala PSC pools.

Pricing:
• Monthly plan: ₹1,800 per month
• Annual plan: ₹15,000 per year (save ₹6,600 — 30% off)
• Original annual price: ₹21,600

PSC pools covered: KWA, Survey & Land Records Department, Technical Education Department, Groundwater Department.

How to purchase: Visit civilezy.in/pricing or contact us on WhatsApp at 90723 45630.`,
    keywords: ["surveyor", "surveyor course", "surveyor price", "surveyor pricing", "surveyor plan", "surveyor annual", "surveyor monthly", "survey course", "land records", "groundwater", "survey grade 2", "tradesman survey"],
    category: "Courses",
    url: "https://civilezy.in/courses/surveyor",
    status: "active",
  },

  {
    source: "course",
    title: "Surveyor Course — Features & Content",
    content: `The CivilEzy Surveyor course includes:

• Smart Interactive Lessons — Study Mode, Revision Mode, and Exam Mode
• Bite-sized Video Lectures focused on Surveyor PSC syllabus
• Malayalam Audio Lessons for all topics
• Graded Quiz after every lesson
• Game Arena access
• Live Leaderboard & Performance Analytics

The Surveyor course covers the complete Kerala PSC syllabus for Surveyor posts including: Fundamentals of Surveying, Chain Surveying, Levelling, Theodolite Surveying, GPS & Modern Survey Techniques, Maps & Plans, and relevant Civil Engineering topics.`,
    keywords: ["surveyor features", "surveyor content", "surveyor syllabus", "what is in surveyor course", "surveyor lessons", "survey techniques"],
    category: "Courses",
    url: "https://civilezy.in/courses/surveyor",
    status: "active",
  },

  // ── ALL COURSES OVERVIEW ──────────────────────────────────────────────────

  {
    source: "static",
    title: "CivilEzy Courses — Complete Overview",
    content: `CivilEzy offers 4 courses for Kerala PSC Civil Engineering preparation:

1. Civil PSC – ITI (₹1,800/month or ₹15,000/year)
   For: ITI Civil candidates | Posts: Overseer, Draughtsman Gr 2&3, Tradesman, Tracer
   Departments: KWA, PWD, LSGD, Irrigation

2. Civil PSC – Diploma (₹2,000/month or ₹17,000/year) — MOST POPULAR
   For: Diploma Civil holders | Posts: Overseer Gr1, Overseer Gr 2&3, Junior Instructor, Site Engineer
   Departments: PWD, Irrigation, LSGD, KWA, Harbour, KSEB

3. Civil PSC – B.Tech / AE (₹2,500/month or ₹20,000/year)
   For: B.Tech Civil graduates | Posts: Assistant Engineer (AE)
   Departments: PWD, Irrigation, LSGD, KWA, PCB
   Extras: Rank Booster Lessons, AE Mock Tests

4. Surveyor Course (₹1,800/month or ₹15,000/year)
   For: ITI Surveyor license holders | Posts: Surveyor Gr II, Tradesman (Survey)
   Departments: KWA, Survey & Land Records, Technical Education, Groundwater Dept.

All courses include: Smart Lessons, Malayalam Audio, Video Lectures, Quizzes, Game Arena, Leaderboard.
Annual plans save 29–33% vs monthly.

To purchase, visit civilezy.in/pricing or WhatsApp 90723 45630.`,
    keywords: ["all courses", "courses available", "how many courses", "list of courses", "which courses", "course comparison", "courses civilezy", "iti diploma btech surveyor", "course options", "what courses", "how many", "course details", "pricing overview"],
    category: "Courses",
    url: "https://civilezy.in/pricing",
    status: "active",
  },

  // ── CHOOSING THE RIGHT COURSE ─────────────────────────────────────────────

  {
    source: "static",
    title: "Which CivilEzy Course Should I Choose?",
    content: `Choose your CivilEzy course based on your educational qualification:

• ITI Civil certificate → Choose Civil PSC – ITI course
• Diploma in Civil Engineering → Choose Civil PSC – Diploma course (most popular)
• B.Tech / BE in Civil Engineering → Choose Civil PSC – B.Tech / AE course
• ITI in Surveying (Surveyor license) → Choose the Surveyor course

Can't decide? Here are some tips:
- If you hold both ITI and Diploma, go for the Diploma course
- If you are a B.Tech graduate but appearing in Diploma-level pools, contact us — we can advise the best choice
- The Diploma course is our most popular and covers the widest range of PSC pools

Still unsure? Contact us on WhatsApp at 90723 45630 and our team will guide you personally.`,
    keywords: ["which course", "choose course", "right course", "which is better", "suitable for", "which plan", "recommend course", "best course", "course for me", "iti or diploma", "select course", "qualification", "which to choose"],
    category: "Courses",
    url: "https://civilezy.in/pricing",
    status: "active",
  },

  // ── HOW TO PURCHASE / ENROLL ──────────────────────────────────────────────

  {
    source: "static",
    title: "How to Purchase / Enroll in a CivilEzy Course",
    content: `To purchase and enroll in a CivilEzy course:

Step 1: Visit the pricing page at civilezy.in/pricing
Step 2: Select your course (ITI, Diploma, B.Tech, or Surveyor)
Step 3: Choose your plan — Monthly (₹1,800–₹2,500) or Annual (₹15,000–₹20,000)
Step 4: Click "Enroll Now" or "Start Monthly" to proceed to the secure checkout
Step 5: Complete the payment (UPI, Card, or Net Banking accepted)
Step 6: You'll receive your login credentials to access learn.civilezy.in

For assistance with enrollment, contact us on WhatsApp at 90723 45630.

Note: Annual plans save 29–33% and are the recommended option for serious exam preparation.`,
    keywords: ["how to purchase", "buy course", "enroll", "enrollment", "how to join", "join civilezy", "how to start", "purchase course", "buy membership", "how to buy", "signup", "register", "checkout", "payment"],
    category: "Courses",
    url: "https://civilezy.in/pricing",
    status: "active",
  },

  // ── PLATFORM FEATURES ─────────────────────────────────────────────────────

  {
    source: "static",
    title: "Game Arena — CivilEzy Competitive Learning",
    content: `Game Arena is CivilEzy's unique competitive learning feature.

What it is: A real-time MCQ battle system where students compete against each other in Kerala PSC Civil Engineering questions.

Key features:
• Real-time MCQ battles with other students
• Earn XP points for correct answers and speed
• Live Leaderboard: Daily, Weekly, and Monthly rankings
• Performance Analytics: track your weak areas and improvement
• Daily CivilWar: live sessions at 6:20 PM every day (Zoom)

Why it works: Game Arena makes studying engaging and competitive. You improve faster when you practice under time pressure against real opponents — just like the actual PSC exam environment.

Game Arena is included FREE with every CivilEzy membership (ITI, Diploma, B.Tech, Surveyor).

Access: Login to learn.civilezy.in → Game Arena section.`,
    keywords: ["game arena", "game", "arena", "competitive", "leaderboard", "battle", "mcq game", "ranking", "xp", "points", "civilwar", "live session", "zoom", "daily", "performance", "weekly leaderboard", "monthly leaderboard"],
    category: "General",
    url: "https://civilezy.in/game-arena",
    status: "active",
  },

  {
    source: "static",
    title: "Malayalam Audio Lessons — CivilEzy",
    content: `CivilEzy provides Malayalam audio explanations for ALL course content.

All video lessons and study materials come with Malayalam audio narration so that students can understand complex Civil Engineering concepts in their native language.

Benefits:
• Learn difficult topics (Structural Engineering, Soil Mechanics, etc.) in Malayalam
• Listen on the go — during commutes, travel, or breaks
• Perfect for students who prefer explanations in their mother tongue
• Covers the entire Kerala PSC Civil Engineering syllabus in Malayalam

Malayalam audio is available across all 4 courses: ITI, Diploma, B.Tech/AE, and Surveyor.`,
    keywords: ["malayalam", "malayalam audio", "malayalam lessons", "malayalam explanation", "audio lessons", "malayalam medium", "language", "native language", "listen", "audio"],
    category: "Courses",
    status: "active",
  },

  {
    source: "static",
    title: "Study Circle — CivilEzy Student Community",
    content: `Study Circle is CivilEzy's student community platform for Kerala PSC Civil Engineering aspirants.

What it offers:
• Discuss exam topics, doubts, and concepts with fellow students
• Share study strategies, tips, and notes
• Connect with top-ranked students and high performers
• Get peer support from a community of serious PSC aspirants
• Discussion threads organized by topic and course level
• Community updates and exam alerts

Study Circle is included with every CivilEzy membership. Access it through your course dashboard at learn.civilezy.in.`,
    keywords: ["study circle", "community", "discussion", "forum", "group study", "peer", "doubt", "students", "connect", "share", "tips"],
    category: "Study Circle",
    status: "active",
  },

  {
    source: "static",
    title: "CivilEzy Mobile App",
    content: `CivilEzy has official mobile apps for Android and iOS.

Android: Available on Google Play Store (4.8 stars rating)
iOS: Available on Apple App Store

Download links:
• Google Play Store: play.google.com/store/apps/details?id=com.civilezy.civilezy
• Apple App Store: apps.apple.com/us/app/civilezy/id6749293661

You can also access CivilEzy directly through any mobile browser without downloading the app — visit learn.civilezy.in and login to access all course content.

Features available on mobile: All video lessons, quizzes, Game Arena, leaderboard, Study Circle.`,
    keywords: ["mobile app", "app", "android", "ios", "play store", "app store", "download", "phone", "tablet", "mobile", "smartphone"],
    category: "Technical",
    url: "https://play.google.com/store/apps/details?id=com.civilezy.civilezy",
    status: "active",
  },

  // ── ABOUT CIVILEZY ────────────────────────────────────────────────────────

  {
    source: "static",
    title: "About CivilEzy and Wincentre",
    content: `CivilEzy is Kerala's #1 online platform for Kerala PSC Civil Engineering exam preparation.

Powered by Wincentre — a trusted PSC coaching institute based in Thrissur, Kerala, with 18+ years of legacy since 2008.

Key facts:
• 5,200+ students trained across Kerala
• 2,000+ job achievers in Government sector
• 4.8 star rating on Google Play Store
• 445+ verified student reviews
• 1,000+ Kerala PSC selections
• Specialization: ITI, Diploma, B.Tech/AE, and Surveyor level Civil Engineering

CivilEzy is Wincentre's digital platform, bringing the same quality coaching that produced over 1000 PSC selections to students everywhere in Kerala through online lessons, Game Arena, and smart technology.

Website: civilezy.in
Learn platform: learn.civilezy.in`,
    keywords: ["about", "civilezy", "wincentre", "who", "company", "institute", "thrissur", "coaching", "legacy", "history", "rating", "reviews", "selections", "5200 students", "2000 jobs"],
    category: "General",
    url: "https://civilezy.in",
    status: "active",
  },

  // ── CONTACT & SUPPORT ─────────────────────────────────────────────────────

  {
    source: "static",
    title: "CivilEzy Contact Information & Support",
    content: `How to contact CivilEzy:

WhatsApp Support: +91 90723 45630 (fastest — typically replies in minutes)

Website: civilezy.in
Learning Platform: learn.civilezy.in
Telegram Community: t.me/civilezy_psc

For specific tasks:
• Enrollment / Pricing questions → WhatsApp 90723 45630
• Renewal → https://www.civilezy.in/renew
• Technical issues (login, video, app) → Use "Report Issue" button on website
• E-Book purchases → https://www.civilezy.in/ebooks

Business hours: Our WhatsApp support is active throughout the day. Urgent issues are typically resolved within a few hours.`,
    keywords: ["contact", "support", "phone", "whatsapp", "email", "reach", "helpline", "telegram", "customer support", "how to reach", "contact number", "support number", "90723 45630"],
    category: "Support",
    url: "https://civilezy.in",
    status: "active",
  },

  {
    source: "static",
    title: "Kerala PSC Civil Engineering Exam Information",
    content: `Kerala PSC conducts Civil Engineering exams for various posts. CivilEzy prepares students for:

ITI Level posts:
• Overseer Grade 2 & 3 (various departments)
• Draughtsman Grade 2 & 3
• Tradesman, Tracer, Work Superintendent
• Departments: KWA, PWD, LSGD, Irrigation

Diploma Level posts:
• Overseer Grade 1, 2 & 3
• Junior Instructor
• Site Engineer
• Departments: PWD, Irrigation, LSGD, KWA, Harbour, KSEB

B.Tech / AE Level posts:
• Assistant Engineer (AE) — the flagship post
• Departments: PWD, Irrigation, LSGD, KWA, PCB

Surveyor Level posts:
• Surveyor Grade II
• Tradesman (Survey)
• Departments: KWA, Survey & Land Records, Technical Education, Groundwater Dept.

The Kerala PSC exam is conducted by the Kerala Public Service Commission. CivilEzy's content is specifically mapped to the PSC syllabus for each pool.`,
    keywords: ["kerala psc", "psc exam", "civil engineering exam", "psc civil", "assistant engineer", "overseer", "ae exam", "psc posts", "government job", "psc pool", "psc syllabus", "kpsc", "lsgd", "kwa", "pwd"],
    category: "Courses",
    url: "https://civilezy.in",
    status: "active",
  },

  {
    source: "static",
    title: "Renewal Plans — Available Durations",
    content: `CivilEzy membership renewal plans:

Available renewal durations:
• 1 Month renewal
• 3 Months renewal
• 6 Months renewal
• 12 Months renewal

All renewal plans are available at: https://www.civilezy.in/renew

To renew:
1. Find your Membership Code and Membership Name from Dashboard → Membership
2. Visit https://www.civilezy.in/renew and choose a plan
3. Complete payment through the secure checkout
4. Send payment screenshot + Membership Name + Membership Code to WhatsApp 90723 45630
5. Renewal activated within 24 hours

Tip: Choose 12-month renewal for the best value per month.`,
    keywords: ["renewal plans", "how long", "1 month", "3 months", "6 months", "12 months", "renewal duration", "renewal options", "annual renewal", "monthly renewal", "quarterly renewal"],
    category: "Membership",
    url: "https://www.civilezy.in/renew",
    status: "active",
  },

  {
    source: "static",
    title: "Membership Code — How to Find It",
    content: `Your Membership Code is required when renewing your CivilEzy membership.

How to find your Membership Code:
1. Login to your account at learn.civilezy.in
2. Go to Dashboard
3. Click on "Membership" section
4. You will see your Membership Code and Membership Name listed

When renewing, you must send:
• Your Membership Code
• Your Membership Name
• Payment Screenshot

Send these to CivilEzy WhatsApp Support at 90723 45630 after completing your payment on https://www.civilezy.in/renew`,
    keywords: ["membership code", "where is membership code", "find membership code", "membership name", "what is membership code", "how to find", "renewal code", "member code"],
    category: "Membership",
    url: "https://www.civilezy.in/renew",
    status: "active",
  },

  {
    source: "static",
    title: "Payment Methods Accepted by CivilEzy",
    content: `CivilEzy accepts the following payment methods:

• UPI: Google Pay, PhonePe, Paytm, BHIM UPI
• Debit Cards (Visa, Mastercard, RuPay)
• Credit Cards
• Net Banking / Bank Transfer / NEFT

For new enrollment: Payment is made directly through the secure checkout page at learn.civilezy.in/checkout

For renewal: Visit https://www.civilezy.in/renew, select your plan, and complete payment. Then send the payment screenshot to WhatsApp 90723 45630.

Payments are processed securely. After payment, your access is typically activated within 30 minutes for new enrollments and within 24 hours for renewals.`,
    keywords: ["payment", "pay", "upi", "gpay", "google pay", "phonepe", "paytm", "card", "debit card", "credit card", "net banking", "neft", "how to pay", "payment method", "payment options"],
    category: "Payments",
    status: "active",
  },

  {
    source: "static",
    title: "How to Access Your CivilEzy Course",
    content: `After enrolling in CivilEzy, here is how to access your course:

Step 1: Receive your login credentials via WhatsApp or email after enrollment is confirmed.
Step 2: Visit https://learn.civilezy.in (the learning platform)
Step 3: Login with your username and password
Step 4: Your course dashboard shows all your enrolled courses, videos, quizzes, and Game Arena

What you'll find in the dashboard:
• Video Lessons organized by chapter and topic
• Quizzes after each lesson
• Game Arena for competitive practice
• Leaderboard and performance stats
• Study Circle community
• Live session schedules

If you face any login issues, use the "Report Issue" button on civilezy.in or contact WhatsApp 90723 45630.`,
    keywords: ["access course", "how to access", "login", "learn.civilezy.in", "dashboard", "start learning", "how to use", "after purchase", "after enrollment", "credentials", "username password"],
    category: "Courses",
    url: "https://learn.civilezy.in",
    status: "active",
  },

  {
    source: "static",
    title: "Live Sessions — CivilWar and Overseer Revision",
    content: `CivilEzy conducts free live sessions for all students:

1. CivilEzy CivilWar (Daily at 6:20 PM — Zoom)
   Rapid-fire PSC Civil Engineering discussion, strategy, question battles, and exam-oriented learning.
   Platform: Zoom

2. Overseer Grade III Revision (Daily at 9:30 PM — YouTube Live)
   Live revision sessions focused on upcoming Overseer Grade III (LSGD) examinations.
   Platform: YouTube Live

Both sessions are available to all CivilEzy members. Check your dashboard for the latest session links or follow the CivilEzy Telegram channel: t.me/civilezy_psc`,
    keywords: ["live session", "live class", "civilwar", "zoom", "youtube live", "overseer revision", "daily session", "6:20 pm", "9:30 pm", "online class", "live lecture"],
    category: "Courses",
    url: "https://civilezy.in",
    status: "active",
  },

];

/**
 * Build knowledge chunks with syncedAt timestamp
 */
export function buildStaticChunks(): KnowledgeChunk[] {
  const syncedAt = now();
  return STATIC_KNOWLEDGE.map((chunk) => ({ ...chunk, syncedAt }));
}

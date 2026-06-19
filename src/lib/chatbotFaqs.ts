/**
 * chatbotFaqs.ts
 *
 * Verified seed FAQs for the CivilEzy AI chatbot.
 * These are seeded into Firestore (ai_faqs collection) only once,
 * when the collection is empty (fresh install).
 *
 * ⚠️  All content here is verified against the CivilEzy knowledge base rules.
 *     Do NOT add speculative content, invented prices, or unverified features.
 *
 * Critical flows (renewal, ebooks, technical issues, contact) are handled
 * by the intent detection layer in /api/chat/route.ts BEFORE FAQ search,
 * ensuring 100% accurate responses regardless of FAQ state.
 */

import type { AiFaq } from "@/types/chatbot";

const now = new Date().toISOString();

export const INITIAL_FAQS: Omit<AiFaq, "id">[] = [

  // ── RENEWAL ────────────────────────────────────────────────────────────────
  {
    question: "How do I renew my CivilEzy membership?",
    answer: `Here are the steps to renew your CivilEzy membership:

**Step 1 — Find Your Membership Details**
Login to your account → go to **Dashboard → Membership** → note your:
• Membership Code
• Membership Name

**Step 2 — Choose a Renewal Plan**
Visit 👉 **https://www.civilezy.in/renew**
Choose a plan: 1 Month, 3 Months, 6 Months, or 12 Months.

**Step 3 — Complete Payment**
Click the **Renew** button for your course and complete payment through the secure checkout page.

**Step 4 — Send Payment Confirmation**
Send the following to **CivilEzy WhatsApp Support (90723 45630)**:
• Payment Screenshot
• Membership Name
• Membership Code

✅ Renewals are activated within **24 hours**.`,
    category: "Membership",
    keywords: ["renew", "renewal", "extend", "expire", "expired", "reactivate", "membership renewal", "subscription"],
    status: "active",
    createdAt: now,
    updatedAt: now,
  },

  {
    question: "Where is the renewal page?",
    answer: `The CivilEzy renewal page is at:\n\n👉 **https://www.civilezy.in/renew**\n\nYou can choose from 1 Month, 3 Months, 6 Months, or 12 Month plans. Make sure to send your payment screenshot + Membership Name + Membership Code to WhatsApp 90723 45630 after payment.`,
    category: "Membership",
    keywords: ["renewal page", "renew link", "where to renew", "renew url", "civilezy.in/renew"],
    status: "active",
    createdAt: now,
    updatedAt: now,
  },

  // ── E-BOOKS ────────────────────────────────────────────────────────────────
  {
    question: "Where can I buy CivilEzy e-books?",
    answer: `📚 **CivilEzy E-Books**\n\nYou can browse and purchase all available CivilEzy e-books directly from:\n\n👉 **https://www.civilezy.in/ebooks**\n\nThe page shows all available titles with pricing and purchase links. No need to contact support — you can buy directly from the website.`,
    category: "EBooks",
    keywords: ["ebook", "e-book", "buy ebook", "purchase ebook", "study material", "quick revision", "book", "notes"],
    status: "active",
    createdAt: now,
    updatedAt: now,
  },

  {
    question: "What e-books are available on CivilEzy?",
    answer: `CivilEzy offers a range of Civil Engineering e-books for Kerala PSC preparation.\n\nTo see all available titles with current pricing:\n\n👉 **https://www.civilezy.in/ebooks**\n\nYou can browse and purchase directly from the website.`,
    category: "EBooks",
    keywords: ["what ebooks", "available ebooks", "which books", "list of books", "ebook list"],
    status: "active",
    createdAt: now,
    updatedAt: now,
  },

  // ── COURSES ────────────────────────────────────────────────────────────────
  {
    question: "What courses does CivilEzy offer?",
    answer: `CivilEzy offers Kerala PSC Civil Engineering preparation for four categories:\n\n• **ITI Civil** — for ITI-level candidates\n• **Diploma Civil** — for Diploma holders (Overseer, LD Clerk, Technical Assistant)\n• **B.Tech / AE** — for B.Tech graduates targeting AE, KWA, PWD posts\n• **Surveyor** — for Surveyor exam preparation\n\nAll courses include video lessons, Malayalam audio explanations, chapter-wise quizzes, mock tests, Game Arena, and Study Circle.\n\nFor the latest course details and pricing, visit **civilezy.in** or contact us on WhatsApp at 90723 45630.`,
    category: "Courses",
    keywords: ["courses", "what courses", "course available", "civil course", "iti", "diploma", "btech", "surveyor"],
    status: "active",
    createdAt: now,
    updatedAt: now,
  },

  {
    question: "Which course should I choose?",
    answer: `Choose based on your educational qualification:\n\n• **ITI Civil** → If you completed ITI in Civil Engineering\n• **Diploma Civil** → If you hold a Diploma in Civil Engineering\n• **B.Tech / AE** → If you are a B.Tech Civil Engineering graduate targeting AE/KWA/PWD posts\n• **Surveyor** → If you are preparing for the Surveyor exam\n\nNot sure which to pick? Contact us on **WhatsApp: 90723 45630** and our team will guide you to the right course.`,
    category: "Courses",
    keywords: ["which course", "choose course", "right course", "select course", "qualification", "suit me"],
    status: "active",
    createdAt: now,
    updatedAt: now,
  },

  {
    question: "How do I access my course after joining?",
    answer: `After joining CivilEzy:\n\n1. You will receive your login credentials via **WhatsApp or email**.\n2. Visit **learn.civilezy.in** to access your course dashboard.\n3. Log in with the credentials provided.\n4. All your course content, quizzes, and Game Arena will be available.\n\nIf you have login issues, please use the **Report Issue** button on the website or contact us on WhatsApp: 90723 45630.`,
    category: "Courses",
    keywords: ["access course", "how to access", "login credentials", "start course", "course dashboard", "learn.civilezy"],
    status: "active",
    createdAt: now,
    updatedAt: now,
  },

  // ── TECHNICAL ISSUES ───────────────────────────────────────────────────────
  {
    question: "I cannot login to my account",
    answer: `🛠️ **Login Issue**\n\nPlease use the **"Report Issue"** button available on the CivilEzy website.\n\nWhen reporting, include:\n• Description of the issue\n• Screenshot of the error (if available)\n\nFor urgent help, contact us on **WhatsApp: 90723 45630** — our team typically responds in minutes.`,
    category: "Technical",
    keywords: ["login", "can't login", "unable to login", "login problem", "password", "login issue", "account access"],
    status: "active",
    createdAt: now,
    updatedAt: now,
  },

  {
    question: "My video is not loading or playing",
    answer: `🛠️ **Video Issue**\n\nPlease use the **"Report Issue"** button on the CivilEzy website.\n\nWhen reporting, include:\n• Description of the issue\n• Screenshot or screen recording showing the problem\n\nThis helps our team resolve the issue faster. You can also contact us on **WhatsApp: 90723 45630**.`,
    category: "Technical",
    keywords: ["video not loading", "video problem", "video not playing", "video issue", "lesson not loading"],
    status: "active",
    createdAt: now,
    updatedAt: now,
  },

  {
    question: "My membership was not activated after payment",
    answer: `🛠️ **Membership Activation Issue**\n\nIf your membership hasn't been activated after payment:\n\n1. Please use the **"Report Issue"** button on the CivilEzy website.\n2. Include your **payment screenshot** and **transaction details** in the report.\n3. Alternatively, send the payment screenshot directly to **WhatsApp: 90723 45630**.\n\nOur team will activate your membership as soon as possible.`,
    category: "Technical",
    keywords: ["membership not activated", "not activated", "paid but not active", "payment done", "access not given"],
    status: "active",
    createdAt: now,
    updatedAt: now,
  },

  // ── CONTACT & SUPPORT ──────────────────────────────────────────────────────
  {
    question: "How do I contact CivilEzy support?",
    answer: `📞 **CivilEzy Support**\n\nYou can reach us through:\n\n• **WhatsApp:** 90723 45630 *(fastest — typically replies in minutes)*\n• **Report Issue button** on civilezy.in — for technical problems, login issues, or payment queries\n• **Renewal page:** https://www.civilezy.in/renew\n• **E-Books page:** https://www.civilezy.in/ebooks`,
    category: "Support",
    keywords: ["contact", "support", "help", "reach", "whatsapp", "phone", "helpline", "customer support"],
    status: "active",
    createdAt: now,
    updatedAt: now,
  },

  {
    question: "How do I report a technical issue?",
    answer: `Use the **"Report Issue"** button available on the CivilEzy website.\n\nWhen reporting, provide:\n• **Description** of the issue\n• **Screenshot** (if available)\n• **Screen recording** (if available — helps us see exactly what's happening)\n\nOur support team will review and resolve the issue as soon as possible.\n\nFor urgent help: **WhatsApp 90723 45630**`,
    category: "Support",
    keywords: ["report issue", "report problem", "how to report", "technical support", "raise ticket"],
    status: "active",
    createdAt: now,
    updatedAt: now,
  },

  // ── PLATFORM FEATURES ──────────────────────────────────────────────────────
  {
    question: "What is Game Arena?",
    answer: `🎮 **Game Arena** is CivilEzy's unique competitive learning feature where you:\n\n• Battle other students in real-time MCQ rounds\n• Earn points and climb the leaderboard\n• Practice Kerala PSC Civil Engineering questions in a game-like format\n• Track your performance with daily, weekly, and monthly rankings\n\nGame Arena makes exam preparation engaging and competitive — helping you identify weak areas while staying motivated.`,
    category: "General",
    keywords: ["game arena", "game", "arena", "competitive", "battle", "leaderboard", "ranking", "mcq game"],
    status: "active",
    createdAt: now,
    updatedAt: now,
  },

  {
    question: "Are the lessons available in Malayalam?",
    answer: `Yes! CivilEzy provides **Malayalam audio explanations** for all lessons.\n\nOur content is designed specifically for Kerala PSC aspirants, so complex Civil Engineering concepts are explained in Malayalam for better understanding alongside the video lessons.`,
    category: "Courses",
    keywords: ["malayalam", "language", "audio", "malayalam explanation", "medium", "malayalam lessons"],
    status: "active",
    createdAt: now,
    updatedAt: now,
  },

  {
    question: "What is Study Circle?",
    answer: `**Study Circle** is CivilEzy's student community platform where:\n\n• Students discuss exam topics and doubts\n• Share study strategies and tips\n• Get peer support from fellow Kerala PSC aspirants\n• Connect with toppers and high-performers\n\nStudy Circle is available as part of your CivilEzy membership.`,
    category: "Study Circle",
    keywords: ["study circle", "community", "discussion", "group", "doubt", "peer", "forum"],
    status: "active",
    createdAt: now,
    updatedAt: now,
  },

  {
    question: "Is CivilEzy mobile friendly?",
    answer: `Yes! CivilEzy works on any device.\n\nAccess your course at **learn.civilezy.in** from any smartphone browser — no app installation needed. Just open in Chrome or Safari on your phone and log in with your credentials.`,
    category: "Technical",
    keywords: ["mobile", "phone", "app", "android", "ios", "smartphone", "tablet", "device", "mobile friendly"],
    status: "active",
    createdAt: now,
    updatedAt: now,
  },

  {
    question: "About CivilEzy and Wincentre",
    answer: `**CivilEzy** is powered by **Wincentre**, Kerala's trusted PSC coaching institute based in Thrissur.\n\n• ⭐ 4.8 star rating with 445+ reviews\n• 1000+ PSC selections\n• Specialised in Kerala Civil Engineering PSC preparation\n\nCivilEzy is Wincentre's online platform, bringing the same quality coaching to students across Kerala.`,
    category: "General",
    keywords: ["about", "civilezy", "wincentre", "who", "company", "institute", "thrissur", "coaching"],
    status: "active",
    createdAt: now,
    updatedAt: now,
  },

  {
    question: "What payment methods are accepted?",
    answer: `CivilEzy accepts the following payment methods:\n\n• **UPI** (Google Pay, PhonePe, Paytm, BHIM)\n• **Debit / Credit Cards**\n• **Bank Transfer / NEFT**\n\nFor membership renewal, visit **https://www.civilezy.in/renew** and complete payment through the secure checkout page. After payment, send your screenshot + Membership Name + Membership Code to **WhatsApp: 90723 45630**.`,
    category: "Payments",
    keywords: ["payment", "pay", "upi", "gpay", "phonepe", "paytm", "card", "bank transfer", "how to pay"],
    status: "active",
    createdAt: now,
    updatedAt: now,
  },

];

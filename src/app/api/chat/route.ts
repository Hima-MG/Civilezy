import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { INITIAL_FAQS } from "@/lib/chatbotFaqs";
import type { AiFaq } from "@/types/chatbot";

// ─────────────────────────────────────────────────────────────────────────────
// SYSTEM PROMPT — strict, no hallucination, verified CivilEzy knowledge base
// ─────────────────────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are CivilEzy AI Assistant, the official support assistant for the CivilEzy online learning platform — Kerala's #1 platform for PSC Civil Engineering exam preparation, powered by Wincentre (Thrissur).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VERIFIED KNOWLEDGE BASE (use EXACTLY as written — do NOT paraphrase or add to these)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## RENEWAL
When a student asks about renewing, extending, or reactivating their membership:

Steps:
1. Login to your account → Dashboard → Membership → note your Membership Code and Membership Name.
2. Visit https://www.civilezy.in/renew and choose a plan: 1 Month, 3 Months, 6 Months, or 12 Months.
3. Click the Renew button for your course and complete payment through the secure checkout page.
4. Send the following to CivilEzy WhatsApp Support: Payment Screenshot, Membership Name, and Membership Code.
Renewals are activated within 24 hours.
Renewal page: https://www.civilezy.in/renew

## E-BOOKS
When a student asks about e-books, study materials, or quick revision books:

CivilEzy E-books can be purchased directly from: https://www.civilezy.in/ebooks
Students can browse all available E-books and purchase directly using the links on the website.

## TECHNICAL ISSUES
When a student reports login problems, payment issues, video not loading, audio not working, membership not activated, website bugs, app issues, or course access problems:

Please use the "Report Issue" button available on the CivilEzy website.
Provide: Description of the issue, Screenshot (if available), Screen recording (if available).
Our support team will review and resolve the issue as soon as possible.

## COURSES
CivilEzy offers Kerala PSC Civil Engineering preparation for four categories:
- ITI Civil — for ITI-level candidates
- Diploma Civil — for Diploma holders (Overseer, LD Clerk, Technical Assistant)
- B.Tech / AE — for B.Tech graduates targeting AE, KWA, PWD posts
- Surveyor — for Surveyor exam preparation
All courses include video lessons, Malayalam audio explanations, chapter-wise quizzes, mock tests, Game Arena, and Study Circle.
For the most up-to-date course content and pricing, always direct students to the CivilEzy website or WhatsApp support.

## CONTACT
WhatsApp Support: 90723 45630
Report Issue button: available on civilezy.in
Renewal page: https://www.civilezy.in/renew
E-Books page: https://www.civilezy.in/ebooks

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STRICT BEHAVIOUR RULES (follow these without exception)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. LANGUAGE: Detect the student's language and reply in the same language (English or Malayalam).
2. ACCURACY: Never invent course details, prices, dates, or features that you are not certain about.
3. COURSE DETAILS: Do not make up specific course content, syllabus breakdowns, or pricing. Say "For the latest course details, please visit civilezy.in or contact support."
4. CANNOT ANSWER: If you cannot confidently answer, say exactly: "I couldn't find a verified answer for that. Please use the Report Issue button on the website or contact CivilEzy Support for assistance."
5. TECHNICAL ISSUES: Always direct technical problems to the Report Issue button — never try to troubleshoot yourself.
6. RENEWAL: Always direct renewal to https://www.civilezy.in/renew — never give manual payment instructions beyond what is in the verified knowledge base.
7. EBOOKS: Always direct to https://www.civilezy.in/ebooks — never list or describe specific books you are not sure about.
8. TONE: Be friendly, professional, and concise. Use bullet points where helpful. Keep responses short unless detail is genuinely needed.
9. OFF-TOPIC: If a question is unrelated to CivilEzy, politely say: "I'm here to help with CivilEzy platform questions. For other topics, please search online."
10. NEVER mention competitor platforms.`;

// ─────────────────────────────────────────────────────────────────────────────
// INTENT DETECTION — enforces verified responses before FAQ / AI
// Returns a verified answer instantly for critical question types.
// This layer cannot hallucinate because responses are hardcoded from the rules.
// ─────────────────────────────────────────────────────────────────────────────

interface IntentMatch {
  response: string;
  source: "faq";
  confidence: 1.0;
}

function detectIntent(question: string): IntentMatch | null {
  const q = question.toLowerCase().trim();

  // ── RENEWAL ──────────────────────────────────────────────────────────────────
  const renewalKeywords = [
    "renew", "renewal", "renewing",
    "expired", "expire", "expiry", "membership expire",
    "extend", "extension",
    "reactivate", "reactivation",
    "subscription renew", "membership renew", "course renew",
    "renew membership", "renew course", "renew subscription",
    "how to renew", "membership payment", "renewal payment",
    "membership inactive", "account inactive",
  ];
  if (renewalKeywords.some((kw) => q.includes(kw))) {
    return {
      response: `Here are the steps to renew your CivilEzy membership:

**Step 1 — Find Your Membership Details**
Login to your account → go to **Dashboard → Membership** → note your:
• Membership Code
• Membership Name

**Step 2 — Choose a Renewal Plan**
Visit 👉 **https://www.civilezy.in/renew**
Choose a plan that fits your preparation:
• 1 Month
• 3 Months
• 6 Months
• 12 Months

**Step 3 — Complete Payment**
Click the **Renew** button for your course and complete payment through the secure checkout page.

**Step 4 — Send Payment Confirmation**
Send the following to **CivilEzy WhatsApp Support (90723 45630)**:
• Payment Screenshot
• Membership Name
• Membership Code

✅ Renewals are activated within **24 hours**.`,
      source: "faq",
      confidence: 1.0,
    };
  }

  // ── E-BOOKS ───────────────────────────────────────────────────────────────────
  const ebookKeywords = [
    "ebook", "e-book", "e book",
    "quick revision", "study material", "study materials",
    "buy book", "purchase book", "buy ebook", "purchase ebook",
    "pdf book", "revision book", "notes", "book available",
    "what books", "which books", "books for",
  ];
  if (ebookKeywords.some((kw) => q.includes(kw))) {
    return {
      response: `📚 **CivilEzy E-Books**

You can browse and purchase all available CivilEzy e-books directly from:

👉 **https://www.civilezy.in/ebooks**

The e-books page shows all available titles with pricing and purchase links. You can buy directly from the website — no need to contact support for purchases.`,
      source: "faq",
      confidence: 1.0,
    };
  }

  // ── TECHNICAL ISSUES ──────────────────────────────────────────────────────────
  const technicalKeywords = [
    "login problem", "login issue", "can't login", "cannot login",
    "not able to login", "unable to login", "login not working",
    "forgot password", "password reset",
    "video not loading", "video not playing", "video problem", "video issue",
    "audio not working", "audio problem", "audio issue", "sound not",
    "membership not activated", "membership not active", "access not given",
    "payment failed", "payment issue", "payment problem", "payment not",
    "website not working", "website bug", "website error", "site down",
    "app not working", "app issue", "app problem", "app error",
    "course not opening", "course access", "cannot access course",
    "not working", "not loading", "error in", "bug in",
    "screen recording", "report issue", "report problem",
  ];
  if (technicalKeywords.some((kw) => q.includes(kw))) {
    return {
      response: `🛠️ **Technical Issue?**

Please use the **"Report Issue"** button available on the CivilEzy website.

When reporting, please include:
• **Description** of the issue
• **Screenshot** (if available)
• **Screen recording** (if available — shows the exact problem)

Our support team will review and resolve your issue as soon as possible.

For urgent help, you can also contact us on **WhatsApp: 90723 45630**.`,
      source: "faq",
      confidence: 1.0,
    };
  }

  // ── CONTACT / SUPPORT ─────────────────────────────────────────────────────────
  const contactKeywords = [
    "contact", "how to contact", "reach support", "customer support",
    "support number", "phone number", "whatsapp number", "helpline",
    "reach you", "reach civilezy", "get help",
  ];
  if (contactKeywords.some((kw) => q.includes(kw))) {
    return {
      response: `📞 **CivilEzy Support**

You can reach us through:

• **WhatsApp:** 90723 45630 *(fastest response — typically replies in minutes)*
• **Report Issue button** on civilezy.in — for technical problems, login issues, or payment queries
• **Renewal:** https://www.civilezy.in/renew
• **E-Books:** https://www.civilezy.in/ebooks

Our team is available to help you!`,
      source: "faq",
      confidence: 1.0,
    };
  }

  return null; // No intent matched — proceed to FAQ search
}

// ─────────────────────────────────────────────────────────────────────────────
// FAQ SEARCH — keyword + partial match scoring against Firestore ai_faqs
// ─────────────────────────────────────────────────────────────────────────────
function scoreMatch(question: string, faq: AiFaq): number {
  const q = question.toLowerCase().trim();
  const faqQ = faq.question.toLowerCase();
  const keywords = faq.keywords.map((k) => k.toLowerCase());

  if (q === faqQ) return 1.0;
  if (faqQ.includes(q) || q.includes(faqQ)) return 0.88;

  const queryWords = q.split(/\s+/).filter((w) => w.length > 2);
  let hits = 0;
  for (const word of queryWords) {
    if (faqQ.includes(word)) hits += 2;
    if (keywords.some((k) => k.includes(word) || word.includes(k))) hits += 1.5;
  }

  return Math.min(hits / Math.max(queryWords.length * 2.5, 1), 0.82);
}

async function searchFaqs(
  db: FirebaseFirestore.Firestore,
  question: string
): Promise<{ faq: AiFaq; score: number } | null> {
  const snap = await db
    .collection("ai_faqs")
    .where("status", "==", "active")
    .get();

  const faqs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as AiFaq));

  let best: { faq: AiFaq; score: number } | null = null;
  for (const faq of faqs) {
    const score = scoreMatch(question, faq);
    if (!best || score > best.score) {
      best = { faq, score };
    }
  }

  return best && best.score >= 0.4 ? best : null;
}

// ─────────────────────────────────────────────────────────────────────────────
// SEED FAQs — runs once when ai_faqs collection is empty
// ─────────────────────────────────────────────────────────────────────────────
async function seedFaqsIfEmpty(db: FirebaseFirestore.Firestore) {
  const snap = await db.collection("ai_faqs").limit(1).get();
  if (!snap.empty) return;

  const batch = db.batch();
  for (const faq of INITIAL_FAQS) {
    const ref = db.collection("ai_faqs").doc();
    batch.set(ref, faq);
  }
  await batch.commit();
}

// ─────────────────────────────────────────────────────────────────────────────
// OPENAI FALLBACK — only called when intent detection + FAQ search both miss
// ─────────────────────────────────────────────────────────────────────────────
async function callOpenAI(
  question: string,
  context?: string
): Promise<{ content: string; confidence: number }> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return {
      content:
        "I couldn't find a verified answer for that. Please use the **Report Issue** button on the website or contact CivilEzy Support on WhatsApp at 90723 45630 for assistance.",
      confidence: 0.1,
    };
  }

  const messages: { role: string; content: string }[] = [
    { role: "system", content: SYSTEM_PROMPT },
  ];

  if (context) {
    messages.push({
      role: "system",
      content: `The following verified FAQ may be relevant — use it if applicable:\n${context}`,
    });
  }

  messages.push({ role: "user", content: question });

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        max_tokens: 500,
        temperature: 0.4, // lower temperature = more conservative, less hallucination
      }),
    });

    if (!res.ok) {
      throw new Error(`OpenAI API error: ${res.status}`);
    }

    const data = await res.json();
    const content: string = data.choices?.[0]?.message?.content?.trim() ?? "";

    if (!content) {
      throw new Error("Empty response from OpenAI");
    }

    // Detect uncertainty signals — mark as low confidence so it gets logged
    const uncertaintyPhrases = [
      "i'm not sure",
      "i don't know",
      "i cannot confirm",
      "i'm unable to",
      "not certain",
      "don't have information",
      "i couldn't find",
      "verified answer",
    ];
    const isUncertain = uncertaintyPhrases.some((p) =>
      content.toLowerCase().includes(p)
    );

    return { content, confidence: isUncertain ? 0.3 : 0.75 };
  } catch (err) {
    console.error("[chat/route] OpenAI error:", err);
    return {
      content:
        "I couldn't find a verified answer for that. Please use the **Report Issue** button on the website or contact CivilEzy Support on WhatsApp at 90723 45630 for assistance.",
      confidence: 0.1,
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ANALYTICS — fire-and-forget daily aggregate update
// ─────────────────────────────────────────────────────────────────────────────
async function updateAnalytics(
  db: FirebaseFirestore.Firestore,
  source: "faq" | "ai",
  confidence: number
) {
  try {
    const today = new Date().toISOString().split("T")[0];
    const ref = db.collection("chatbot_analytics").doc(today);
    const snap = await ref.get();
    const isLowConfidence = confidence < 0.5;

    if (snap.exists) {
      const d = snap.data()!;
      await ref.update({
        totalQuestions:       (d.totalQuestions       ?? 0) + 1,
        answeredQuestions:    isLowConfidence ? (d.answeredQuestions    ?? 0) : (d.answeredQuestions    ?? 0) + 1,
        unansweredQuestions:  isLowConfidence ? (d.unansweredQuestions  ?? 0) + 1 : (d.unansweredQuestions ?? 0),
        faqHits:              source === "faq" ? (d.faqHits             ?? 0) + 1 : (d.faqHits            ?? 0),
        aiGeneratedAnswers:   source === "ai"  ? (d.aiGeneratedAnswers  ?? 0) + 1 : (d.aiGeneratedAnswers ?? 0),
      });
    } else {
      await ref.set({
        date: today,
        totalQuestions:      1,
        answeredQuestions:   isLowConfidence ? 0 : 1,
        unansweredQuestions: isLowConfidence ? 1 : 0,
        faqHits:             source === "faq" ? 1 : 0,
        aiGeneratedAnswers:  source === "ai"  ? 1 : 0,
      });
    }
  } catch (err) {
    console.error("[chat/route] analytics update failed:", err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/chat
//
// Pipeline:
//   1. Intent detection  →  verified hardcoded response (fastest, no hallucination)
//   2. FAQ search        →  Firestore ai_faqs (admin-managed knowledge base)
//   3. OpenAI fallback   →  gpt-4o-mini with strict system prompt
//   4. Save to history + analytics
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const question: string = (body.question ?? "").trim();
    const sessionId: string = body.sessionId ?? "unknown";
    const userId: string = body.userId ?? "anonymous";

    if (!question) {
      return NextResponse.json({ error: "question is required" }, { status: 400 });
    }

    const db = getAdminDb();

    // Seed FAQs on first-ever request (fresh install)
    await seedFaqsIfEmpty(db);

    let response: string;
    let source: "faq" | "ai";
    let confidence: number;
    let faqId: string | undefined;

    // ── Layer 1: Intent detection (verified, instant, zero hallucination) ──────
    const intent = detectIntent(question);

    if (intent) {
      response   = intent.response;
      source     = "faq";
      confidence = 1.0;
    } else {
      // ── Layer 2: FAQ search (admin-managed knowledge base) ──────────────────
      const faqMatch = await searchFaqs(db, question);

      if (faqMatch && faqMatch.score >= 0.65) {
        response   = faqMatch.faq.answer;
        source     = "faq";
        confidence = faqMatch.score;
        faqId      = faqMatch.faq.id;
      } else {
        // ── Layer 3: OpenAI fallback (strict system prompt) ───────────────────
        const context = faqMatch
          ? `Q: ${faqMatch.faq.question}\nA: ${faqMatch.faq.answer}`
          : undefined;

        const aiResult = await callOpenAI(question, context);
        response   = aiResult.content;
        source     = "ai";
        confidence = aiResult.confidence;

        // Log low-confidence responses for admin review
        if (confidence < 0.5) {
          await db.collection("unanswered_queries").add({
            question,
            userId,
            timestamp:     new Date().toISOString(),
            status:        "pending",
            adminResponse: null,
          });
        }
      }
    }

    // ── Save to chat_history ──────────────────────────────────────────────────
    await db.collection("chat_history").add({
      userId,
      sessionId,
      question,
      response,
      source,
      confidence,
      timestamp: new Date().toISOString(),
    });

    // ── Update analytics (non-blocking) ──────────────────────────────────────
    updateAnalytics(db, source, confidence);

    return NextResponse.json({ response, source, confidence, faqId });

  } catch (err) {
    console.error("[chat/route] unhandled error:", err);
    return NextResponse.json(
      {
        response:
          "Something went wrong. Please try again or contact support on WhatsApp at 90723 45630.",
        source: "error",
        confidence: 0,
        error: String(err),
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { INITIAL_FAQS } from "@/lib/chatbotFaqs";
import type { AiFaq } from "@/types/chatbot";
import type { KnowledgeChunk } from "@/lib/chatbotKnowledge";

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
- ITI Civil: ₹1,800/month or ₹15,000/year — for ITI-level candidates
- Diploma Civil: ₹2,000/month or ₹17,000/year — for Diploma holders (MOST POPULAR)
- B.Tech / AE: ₹2,500/month or ₹20,000/year — for B.Tech graduates targeting AE posts
- Surveyor: ₹1,800/month or ₹15,000/year — for Surveyor exam preparation
All courses include: Smart Lessons, Video Lectures, Malayalam Audio, Quizzes, Game Arena, Leaderboard.
Annual plans save 29–33%.

## CONTACT
WhatsApp Support: 90723 45630
Report Issue button: on civilezy.in
Renewal page: https://www.civilezy.in/renew
E-Books page: https://www.civilezy.in/ebooks
Learning platform: https://learn.civilezy.in

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTEXT-BASED ANSWERING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

When RETRIEVED CONTEXT is provided below the student's question:
- Use that context as your PRIMARY source of information
- Synthesize the information into a clear, helpful answer
- Include specific details (prices, features, links) from the context
- Do NOT add information beyond what is in the context or the verified knowledge base above

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STRICT BEHAVIOUR RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. LANGUAGE: Detect the student's language and reply in the same language (English or Malayalam).
2. ACCURACY: Never invent course details, prices, dates, or features not in the context provided.
3. CANNOT ANSWER: If you cannot confidently answer, say: "I couldn't find that information. Please contact CivilEzy Support or use the Report Issue button."
4. TECHNICAL ISSUES: Always direct to the Report Issue button.
5. RENEWAL: Always direct to https://www.civilezy.in/renew
6. EBOOKS: Always direct to https://www.civilezy.in/ebooks
7. TONE: Be friendly, professional, and concise. Use bullet points where helpful.
8. OFF-TOPIC: For unrelated questions: "I'm here to help with CivilEzy platform questions."
9. NEVER mention competitor platforms.`;

// ─────────────────────────────────────────────────────────────────────────────
// MODULE-LEVEL KNOWLEDGE BASE CACHE (warms between serverless invocations)
// ─────────────────────────────────────────────────────────────────────────────
let kbCache: { chunks: KnowledgeChunk[]; at: number } | null = null;
const KB_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getKnowledgeBase(
  db: FirebaseFirestore.Firestore
): Promise<KnowledgeChunk[]> {
  const now = Date.now();
  if (kbCache && now - kbCache.at < KB_CACHE_TTL) {
    return kbCache.chunks;
  }
  try {
    const snap = await db
      .collection("knowledge_base")
      .where("status", "==", "active")
      .get();
    const chunks = snap.docs.map(
      (d) => ({ id: d.id, ...d.data() } as KnowledgeChunk)
    );
    kbCache = { chunks, at: now };
    return chunks;
  } catch {
    return kbCache?.chunks ?? [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// INTENT DETECTION — enforces verified responses before FAQ / KB / AI
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
    "renew", "renewal", "renewing", "expired", "expire", "expiry",
    "extend", "extension", "reactivate", "reactivation",
    "subscription renew", "membership renew", "course renew",
    "renew membership", "renew course", "renew subscription",
    "how to renew", "membership payment", "renewal payment",
    "membership inactive", "account inactive",
  ];
  if (renewalKeywords.some((kw) => q.includes(kw))) {
    return {
      response: `Here are the steps to renew your CivilEzy membership:

**Step 1 — Find Your Membership Details**
Login → **Dashboard → Membership** → note your:
• Membership Code
• Membership Name

**Step 2 — Choose a Renewal Plan**
Visit 👉 **https://www.civilezy.in/renew**
Plans available: 1 Month · 3 Months · 6 Months · 12 Months

**Step 3 — Complete Payment**
Click **Renew** for your course and complete payment through the secure checkout.

**Step 4 — Send Payment Confirmation**
Send to **CivilEzy WhatsApp (90723 45630)**:
• Payment Screenshot
• Membership Name
• Membership Code

✅ Activated within **24 hours**.`,
      source: "faq",
      confidence: 1.0,
    };
  }

  // ── E-BOOKS ───────────────────────────────────────────────────────────────────
  const ebookKeywords = [
    "ebook", "e-book", "e book", "quick revision", "study material",
    "buy book", "purchase book", "buy ebook", "purchase ebook",
    "pdf book", "revision book",
  ];
  if (ebookKeywords.some((kw) => q.includes(kw))) {
    return {
      response: `📚 **CivilEzy E-Books**

Browse and purchase all available e-books directly from:

👉 **https://www.civilezy.in/ebooks**

All titles, pricing, and purchase links are on the e-books page.`,
      source: "faq",
      confidence: 1.0,
    };
  }

  // ── TECHNICAL ISSUES ──────────────────────────────────────────────────────────
  const technicalKeywords = [
    "login problem", "login issue", "can't login", "cannot login",
    "not able to login", "unable to login", "login not working",
    "video not loading", "video not playing", "video problem",
    "audio not working", "audio problem", "sound not",
    "membership not activated", "membership not active", "access not given",
    "payment failed", "payment issue", "payment problem",
    "website not working", "website bug", "website error",
    "app not working", "app issue", "app problem",
    "course not opening", "cannot access course",
  ];
  if (technicalKeywords.some((kw) => q.includes(kw))) {
    return {
      response: `🛠️ **Technical Issue?**

Please use the **"Report Issue"** button on the CivilEzy website.

Include:
• **Description** of the issue
• **Screenshot** (if available)
• **Screen recording** (helps us diagnose faster)

For urgent help: **WhatsApp 90723 45630**`,
      source: "faq",
      confidence: 1.0,
    };
  }

  // ── CONTACT ───────────────────────────────────────────────────────────────────
  const contactKeywords = [
    "contact", "how to contact", "reach support", "support number",
    "phone number", "whatsapp number", "helpline", "reach civilezy",
  ];
  if (contactKeywords.some((kw) => q.includes(kw))) {
    return {
      response: `📞 **CivilEzy Support**

• **WhatsApp:** 90723 45630 *(fastest — replies in minutes)*
• **Report Issue:** on civilezy.in — for technical problems
• **Renewal:** https://www.civilezy.in/renew
• **E-Books:** https://www.civilezy.in/ebooks`,
      source: "faq",
      confidence: 1.0,
    };
  }

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// FAQ SEARCH
// ─────────────────────────────────────────────────────────────────────────────
function scoreFaq(question: string, faq: AiFaq): number {
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
    const score = scoreFaq(question, faq);
    if (!best || score > best.score) best = { faq, score };
  }
  return best && best.score >= 0.4 ? best : null;
}

// ─────────────────────────────────────────────────────────────────────────────
// KNOWLEDGE BASE SEARCH
// ─────────────────────────────────────────────────────────────────────────────
function scoreKnowledgeChunk(question: string, chunk: KnowledgeChunk): number {
  const q = question.toLowerCase().trim();
  const title = chunk.title.toLowerCase();
  // Only match against first 600 chars of content for speed
  const content = chunk.content.toLowerCase().slice(0, 600);
  const keywords = chunk.keywords.map((k) => k.toLowerCase());

  // Direct title match
  if (title === q || title.includes(q) || q.includes(title)) return 0.80;

  const queryWords = q.split(/\s+/).filter((w) => w.length > 2);
  let hits = 0;
  for (const word of queryWords) {
    if (title.includes(word)) hits += 3;
    if (keywords.some((k) => k.includes(word) || word.includes(k))) hits += 2;
    if (content.includes(word)) hits += 0.5;
  }
  return Math.min(hits / Math.max(queryWords.length * 3.5, 1), 0.74);
}

async function searchKnowledgeBase(
  db: FirebaseFirestore.Firestore,
  question: string
): Promise<{ chunk: KnowledgeChunk; score: number }[]> {
  const chunks = await getKnowledgeBase(db);
  if (chunks.length === 0) return [];

  const scored = chunks
    .map((chunk) => ({ chunk, score: scoreKnowledgeChunk(question, chunk) }))
    .filter(({ score }) => score >= 0.28)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4); // top 4 most relevant

  return scored;
}

// ─────────────────────────────────────────────────────────────────────────────
// SEED FAQs on first run
// ─────────────────────────────────────────────────────────────────────────────
async function seedFaqsIfEmpty(db: FirebaseFirestore.Firestore) {
  const snap = await db.collection("ai_faqs").limit(1).get();
  if (!snap.empty) return;
  const batch = db.batch();
  for (const faq of INITIAL_FAQS) {
    batch.set(db.collection("ai_faqs").doc(), faq);
  }
  await batch.commit();
}

// ─────────────────────────────────────────────────────────────────────────────
// OPENAI CALL — with combined context from FAQ + Knowledge Base
// ─────────────────────────────────────────────────────────────────────────────
async function callOpenAI(
  question: string,
  retrievedContext: string
): Promise<{ content: string; confidence: number }> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return {
      content:
        "I couldn't find that information. Please contact CivilEzy Support or use the Report Issue button on the website.",
      confidence: 0.1,
    };
  }

  const contextSection = retrievedContext
    ? `\n\n━━━━━━━━━━━━━━━━━━━━\nRETRIEVED CONTEXT (use this to answer the question):\n${retrievedContext}\n━━━━━━━━━━━━━━━━━━━━`
    : "";

  const userMessage = `${question}${contextSection}`;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        max_tokens: 550,
        temperature: 0.35,
      }),
    });

    if (!res.ok) throw new Error(`OpenAI ${res.status}`);

    const data = await res.json();
    const content: string = data.choices?.[0]?.message?.content?.trim() ?? "";
    if (!content) throw new Error("Empty OpenAI response");

    const uncertain = [
      "i couldn't find",
      "i'm not sure",
      "i don't know",
      "not certain",
      "don't have information",
    ].some((p) => content.toLowerCase().includes(p));

    // Higher confidence when we had context to work from
    const baseConfidence = retrievedContext ? 0.78 : 0.65;
    return { content, confidence: uncertain ? 0.3 : baseConfidence };
  } catch (err) {
    console.error("[chat/route] OpenAI error:", err);
    return {
      content:
        "I couldn't find that information. Please contact CivilEzy Support or use the Report Issue button.",
      confidence: 0.1,
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ANALYTICS
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
    const low = confidence < 0.5;

    if (snap.exists) {
      const d = snap.data()!;
      await ref.update({
        totalQuestions:      (d.totalQuestions      ?? 0) + 1,
        answeredQuestions:   low ? (d.answeredQuestions   ?? 0) : (d.answeredQuestions   ?? 0) + 1,
        unansweredQuestions: low ? (d.unansweredQuestions ?? 0) + 1 : (d.unansweredQuestions ?? 0),
        faqHits:             source === "faq" ? (d.faqHits            ?? 0) + 1 : (d.faqHits ?? 0),
        aiGeneratedAnswers:  source === "ai"  ? (d.aiGeneratedAnswers ?? 0) + 1 : (d.aiGeneratedAnswers ?? 0),
      });
    } else {
      await ref.set({
        date: today,
        totalQuestions:      1,
        answeredQuestions:   low ? 0 : 1,
        unansweredQuestions: low ? 1 : 0,
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
// Pipeline (in order):
//   1. Intent detection   → hardcoded verified response (instant, zero hallucination)
//   2. FAQ search         → ai_faqs Firestore collection
//   3. Knowledge Base     → knowledge_base Firestore collection (cached in-memory)
//   4. OpenAI             → with context assembled from steps 2+3
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
    await seedFaqsIfEmpty(db);

    let response: string;
    let source: "faq" | "ai";
    let confidence: number;
    let faqId: string | undefined;

    // ── Layer 1: Intent detection ─────────────────────────────────────────────
    const intent = detectIntent(question);
    if (intent) {
      response   = intent.response;
      source     = "faq";
      confidence = 1.0;
    } else {
      // ── Layer 2: FAQ search ───────────────────────────────────────────────────
      const faqMatch = await searchFaqs(db, question);

      if (faqMatch && faqMatch.score >= 0.65) {
        // High-confidence direct FAQ hit
        response   = faqMatch.faq.answer;
        source     = "faq";
        confidence = faqMatch.score;
        faqId      = faqMatch.faq.id;
      } else {
        // ── Layer 3: Knowledge base search ────────────────────────────────────
        const [kbResults] = await Promise.all([
          searchKnowledgeBase(db, question),
        ]);

        // Build combined context from KB hits + any partial FAQ match
        const contextParts: string[] = [];

        if (faqMatch && faqMatch.score >= 0.35) {
          contextParts.push(
            `[FAQ] Q: ${faqMatch.faq.question}\nA: ${faqMatch.faq.answer}`
          );
        }

        for (const { chunk, score } of kbResults) {
          if (score >= 0.28) {
            contextParts.push(`[${chunk.source.toUpperCase()}] ${chunk.title}:\n${chunk.content}`);
          }
        }

        const retrievedContext = contextParts.slice(0, 4).join("\n\n---\n\n");

        // ── Layer 4: OpenAI with context ─────────────────────────────────────
        const aiResult = await callOpenAI(question, retrievedContext);
        response   = aiResult.content;
        source     = "ai";
        confidence = aiResult.confidence;

        // Log truly uncertain responses for admin review
        if (confidence < 0.4) {
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

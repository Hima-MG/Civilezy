# CivilEzy Blog Creation Guide

Copy the prompt below, fill in your blog details, and paste it to Claude Code.
Claude will add the blog entry to `blogData.ts` — it auto-appears on `/blog` and `/blog/[slug]`.

---

## HOW TO ADD A NEW BLOG

**Step 1** — Fill in the "Blog Brief" section below.  
**Step 2** — Copy the full prompt and paste it to Claude Code.  
**Step 3** — Claude writes the blog entry into `blogData.ts`. Done.

---

## COPY THIS PROMPT ↓

```
Add a new blog post to the CivilEzy website.

File to edit: src/data/blogData.ts
Append a new entry to the BLOGS array (after the last entry, before the closing `]`).

--- BLOG BRIEF ---

TITLE: [Write the full SEO title here, e.g. "Kerala PSC Civil Engineering Salary 2025 | Pay Scale & Allowances"]

SLUG: [URL-friendly slug, e.g. "kerala-psc-civil-engineering-salary-2025"]

DESCRIPTION: [1–2 sentence meta description for Google, ~155 characters]

EXCERPT: [1 sentence shown on the blog listing card]

CATEGORY: [One of: Preparation Strategy | Question Bank | Resources | Mock Tests | Syllabus | Salary & Career | Department Guide | Exam Notification]

DATE: [e.g. "April 25, 2026"]

READ TIME: [e.g. "6 min read"]

KEYWORDS: [Comma-separated list of 5–7 SEO keyword phrases]

CONTENT OUTLINE:
[Describe each section as a numbered list. For each section write the heading and a short description of what it should cover. Put "--- CTA ---" where you want the inline call-to-action box to appear (ideally around the midpoint).

Example:
1. Intro paragraph — brief overview of the topic
2. Section heading — what this section covers
3. Section heading — bullet-list style information
--- CTA ---
4. Section heading — more content
5. Closing tip or summary paragraph]

--- END BRIEF ---

Rules to follow exactly:
- Match the TypeScript shape: { slug, title, description, excerpt, keywords[], date, readTime, category, content: BlogSection[] }
- Each BlogSection is one of: { body: string[] } | { heading: string, body?: string[], list?: string[] } | { isCTA: true }
- "--- CTA ---" in the outline becomes { isCTA: true }
- Keep body paragraphs factual, concise, written for Kerala PSC Civil Engineering aspirants
- Do NOT change any existing blog entries
- Do NOT change any other files
- After editing blogData.ts, confirm with the slug and section count
```

---

## EXAMPLE FILLED PROMPT

```
Add a new blog post to the CivilEzy website.

File to edit: src/data/blogData.ts
Append a new entry to the BLOGS array (after the last entry, before the closing `]`).

--- BLOG BRIEF ---

TITLE: Kerala PSC Civil Engineering Salary 2025 | Pay Scale, Allowances & Benefits

SLUG: kerala-psc-civil-engineering-salary-2025

DESCRIPTION: Complete guide to Kerala PSC Civil Engineering salary in 2025. Pay scale for ITI Overseer, Diploma Overseer and B.Tech Assistant Engineer posts across KWA, PWD, LSGD and Irrigation.

EXCERPT: Know exactly what you will earn after clearing Kerala PSC Civil — pay scale, DA, HRA and other allowances for all levels.

CATEGORY: Salary & Career

DATE: April 25, 2026

READ TIME: 5 min read

KEYWORDS: kerala psc civil engineering salary, psc civil overseer salary 2025, assistant engineer salary kerala psc, kwa psc salary, pwd civil engineer salary kerala, lsgd overseer salary

CONTENT OUTLINE:
1. Intro paragraph — overview of Kerala PSC civil salary structure
2. ITI Level Salary — Overseer Gr.2 & 3 pay scale and grade pay
3. Diploma Level Salary — Overseer Gr.1 pay scale and allowances
--- CTA ---
4. B.Tech AE Level Salary — Assistant Engineer pay scale across PWD, KWA, LSGD
5. Allowances and Perks — DA, HRA, TA, medical, pension
6. Salary Comparison by Department — KWA vs PWD vs LSGD vs Irrigation
7. Closing tip — career growth and promotion prospects

--- END BRIEF ---

Rules to follow exactly:
- Match the TypeScript shape: { slug, title, description, excerpt, keywords[], date, readTime, category, content: BlogSection[] }
- Each BlogSection is one of: { body: string[] } | { heading: string, body?: string[], list?: string[] } | { isCTA: true }
- "--- CTA ---" in the outline becomes { isCTA: true }
- Keep body paragraphs factual, concise, written for Kerala PSC Civil Engineering aspirants
- Do NOT change any existing blog entries
- Do NOT change any other files
- After editing blogData.ts, confirm with the slug and section count
```

---

## BLOG SECTION TYPES (reference)

| Type | When to use |
|---|---|
| `{ body: ["para 1", "para 2"] }` | Intro paragraph or closing paragraph |
| `{ heading: "Title", list: ["item 1", "item 2"] }` | Bullet-list section (most common) |
| `{ heading: "Title", body: ["..."], list: ["..."] }` | Section with intro text + bullets |
| `{ isCTA: true }` | Inline orange CTA box — place once, around the middle |

---

## CATEGORIES (use exactly one)

- `Preparation Strategy`
- `Question Bank`
- `Resources`
- `Mock Tests`
- `Syllabus`
- `Salary & Career`
- `Department Guide`
- `Exam Notification`

---

## AFTER ADDING A BLOG

The blog automatically appears on:
- `/blog` — listing page (newest first if you place it first in the array)
- `/blog/[slug]` — full article page with sidebar and related posts

To make a new blog appear as the **featured post** (top of `/blog`), add it as the **first entry** in the BLOGS array instead of appending at the end.

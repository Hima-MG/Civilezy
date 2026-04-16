"use client";

import { useState } from "react";
import { EXTERNAL_URLS } from "@/lib/constants";

const BLOG_URL = EXTERNAL_URLS.blog;

type Category = "All" | "PSC Live" | "Rank Blueprint" | "Exam Decoded" | "Smart Study" | "Civil Easy";

interface BlogPost {
  category: Exclude<Category, "All">;
  readTime: string;
  title: string;
  excerpt: string;
  date: string;
  slug: string;
}

const categories: Category[] = ["All", "PSC Live", "Rank Blueprint", "Exam Decoded", "Smart Study", "Civil Easy"];

const categoryMeta: Record<Exclude<Category, "All">, { color: string; bg: string; border: string; icon: string }> = {
  "PSC Live":       { color: "#FF8534", bg: "rgba(255,133,52,0.12)",  border: "rgba(255,133,52,0.3)",  icon: "\u{1F4E3}" },
  "Rank Blueprint": { color: "#FFB800", bg: "rgba(255,184,0,0.12)",   border: "rgba(255,184,0,0.3)",   icon: "\u{1F3AF}" },
  "Exam Decoded":   { color: "#64C8FF", bg: "rgba(100,200,255,0.10)", border: "rgba(100,200,255,0.25)", icon: "\u{1F50D}" },
  "Smart Study":    { color: "#32C864", bg: "rgba(50,200,100,0.10)",  border: "rgba(50,200,100,0.25)", icon: "\u{1F4A1}" },
  "Civil Easy":     { color: "#C864FF", bg: "rgba(200,100,255,0.10)", border: "rgba(200,100,255,0.25)", icon: "\u270F\uFE0F" },
};

const posts: BlogPost[] = [
  {
    category: "PSC Live",
    readTime: "3 min read",
    title: "KWA AE 2025 Notification Released \u2014 Key Dates, Eligibility & How to Apply",
    excerpt: "Kerala Water Authority has officially released the AE 2025 notification. Here\u2019s everything you need to know \u2014 vacancy count, eligibility, exam date, and how to start preparing today.",
    date: "1 April 2026",
    slug: "kwa-ae-2025-notification",
  },
  {
    category: "Rank Blueprint",
    readTime: "8 min read",
    title: "Kerala PSC Civil Engineering Syllabus 2025 \u2014 Complete Guide (ITI, Diploma & AE)",
    excerpt: "Full breakdown of the Kerala PSC Civil Engineering syllabus for ITI, Diploma and AE levels. Topics, weightage, and smart preparation tips to rank faster.",
    date: "28 March 2026",
    slug: "kerala-psc-civil-syllabus-2025",
  },
  {
    category: "Exam Decoded",
    readTime: "7 min read",
    title: "KWA AE 2024 Question Paper Analysis \u2014 What Came, What Didn\u2019t, What\u2019s Next",
    excerpt: "We decoded the KWA AE 2024 paper topic by topic. Find out which subjects had the highest weightage, surprise questions, and what you must focus on for 2025.",
    date: "20 March 2026",
    slug: "kwa-ae-2024-paper-analysis",
  },
  {
    category: "Civil Easy",
    readTime: "6 min read",
    title: "RCC Design Simplified \u2014 Understanding IS 456 Without the Jargon",
    excerpt: "RCC design feels impossible until someone explains it simply. This guide breaks down IS 456 concepts in plain language \u2014 the way Civilezy audio lessons do it.",
    date: "15 March 2026",
    slug: "rcc-design-simplified-is456",
  },
  {
    category: "Smart Study",
    readTime: "4 min read",
    title: "How to Use Civilezy Audio Lessons to Study on the Go \u2014 A Complete Guide",
    excerpt: "Working full-time and preparing for PSC? Here\u2019s exactly how to use Civilezy\u2019s Malayalam audio lessons during your commute, lunch break, or before bed \u2014 without making a single note.",
    date: "10 March 2026",
    slug: "audio-lessons-study-guide",
  },
  {
    category: "Rank Blueprint",
    readTime: "9 min read",
    title: "30-Day Kerala PSC Civil Engineering Study Plan \u2014 ITI & Diploma Level",
    excerpt: "A day-by-day study plan for ITI and Diploma Civil PSC aspirants. Prioritised subject order, daily targets, and mock test schedule \u2014 everything mapped to the Kerala PSC pool.",
    date: "5 March 2026",
    slug: "30-day-study-plan-iti-diploma",
  },
];

export default function BlogSection() {
  const [active, setActive] = useState<Category>("All");

  const filtered = active === "All" ? posts : posts.filter((p) => p.category === active);

  return (
    <section
      aria-labelledby="blog-heading"
      style={{ background: "#060D1A", padding: "80px 0" }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 5%" }}>

        {/* Heading */}
        <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 48px" }}>
          <div
            aria-hidden="true"
            style={{
              display: "inline-block",
              background: "rgba(255,98,0,0.15)",
              border: "1px solid rgba(255,98,0,0.3)",
              borderRadius: "20px",
              padding: "4px 16px",
              fontSize: "12px",
              fontWeight: 700,
              color: "#FF8534",
              letterSpacing: "0.5px",
              marginBottom: "16px",
            }}
          >
            BLOG & RESOURCES
          </div>

          <h2
            id="blog-heading"
            style={{
              fontFamily: "Rajdhani, sans-serif",
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: "12px",
              color: "#ffffff",
            }}
          >
            Kerala PSC Guides,{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #FF6200, #FFB800)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Decoded for You
            </span>
          </h2>

          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0 }}>
            Exam alerts, preparation strategies, paper reviews, and civil concepts — explained simply for Kerala PSC aspirants.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div
          role="tablist"
          aria-label="Blog categories"
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: "40px",
          }}
        >
          {categories.map((cat) => {
            const isActive = active === cat;
            const meta = cat !== "All" ? categoryMeta[cat] : null;
            return (
              <button
                key={cat}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(cat)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 18px",
                  borderRadius: "50px",
                  border: isActive
                    ? `1px solid ${meta?.border ?? "rgba(255,98,0,0.4)"}`
                    : "1px solid rgba(255,255,255,0.1)",
                  background: isActive
                    ? meta?.bg ?? "rgba(255,98,0,0.15)"
                    : "rgba(255,255,255,0.04)",
                  color: isActive
                    ? meta?.color ?? "#FF8534"
                    : "rgba(255,255,255,0.55)",
                  fontSize: "13px",
                  fontWeight: isActive ? 700 : 500,
                  fontFamily: "Nunito, sans-serif",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                }}
              >
                {cat !== "All" && <span style={{ fontSize: "13px" }}>{meta?.icon}</span>}
                {cat}
              </button>
            );
          })}
        </div>

        {/* Blog Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
            marginBottom: "48px",
          }}
          className="blog-grid"
        >
          {filtered.map((post, i) => {
            const meta = categoryMeta[post.category];
            return (
              <article
                key={post.slug}
                style={{
                  background: "#0B1929",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "16px",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  transition: "border-color 0.2s, transform 0.2s",
                  cursor: "pointer",
                  animation: `fadeUp 0.4s ease ${i * 60}ms both`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = meta.border;
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                {/* Top: category badge + read time */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      background: meta.bg,
                      border: `1px solid ${meta.border}`,
                      borderRadius: "20px",
                      padding: "3px 10px",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: meta.color,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {meta.icon} {post.category}
                  </span>
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>
                    {post.readTime}
                  </span>
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontFamily: "Rajdhani, sans-serif",
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#ffffff",
                    lineHeight: 1.35,
                    marginBottom: "10px",
                    flex: "0 0 auto",
                  }}
                >
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p
                  style={{
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.55)",
                    lineHeight: 1.75,
                    marginBottom: "20px",
                    flex: 1,
                  }}
                >
                  {post.excerpt}
                </p>

                {/* Footer: date + read link */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                    paddingTop: "14px",
                    marginTop: "auto",
                  }}
                >
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>
                    {post.date}
                  </span>
                  <a
                    href={BLOG_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      fontSize: "13px",
                      fontWeight: 700,
                      color: meta.color,
                      textDecoration: "none",
                      fontFamily: "Nunito, sans-serif",
                      transition: "gap 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.gap = "8px";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.gap = "5px";
                    }}
                  >
                    Read more →
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        {/* View All CTA */}
        <div style={{ textAlign: "center" }}>
          <a
            href={BLOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "transparent",
              color: "rgba(255,255,255,0.75)",
              border: "1px solid rgba(255,255,255,0.15)",
              padding: "12px 32px",
              borderRadius: "50px",
              fontFamily: "Nunito, sans-serif",
              fontSize: "15px",
              fontWeight: 700,
              textDecoration: "none",
              transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,98,0,0.4)";
              (e.currentTarget as HTMLElement).style.color = "#FF8534";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)";
              (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.75)";
            }}
          >
            View All Articles →
          </a>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 1024px) {
          .blog-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .blog-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

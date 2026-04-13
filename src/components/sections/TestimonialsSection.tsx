"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { testimonials } from "@/data/testimonials";

// ─── Data ───────────────────────────────────────────────────────────────────
// Show top 6 testimonials that have text content
const DISPLAY_TESTIMONIALS = testimonials
  .filter((t) => t.text && t.text.trim().length > 0)
  .slice(0, 6);

const AVATAR_STYLES = [
  { bg: "rgba(255,98,0,0.2)",    color: "#FF8534" },
  { bg: "rgba(255,184,0,0.2)",   color: "#FFB800" },
  { bg: "rgba(100,200,255,0.15)",color: "#64C8FF" },
  { bg: "rgba(50,200,100,0.15)", color: "#32C864" },
  { bg: "rgba(200,100,255,0.15)",color: "#C864FF" },
  { bg: "rgba(255,100,150,0.15)",color: "#FF6496" },
];

interface Stat {
  num:   string;
  label: string;
}

const STATS: Stat[] = [
  { num: "1,000+", label: "Government Job Placements" },
  { num: "5,200+", label: "Active Students" },
  // { num: "+43%",   label: "Avg Score Improvement / 30 Days" },
  { num: "4.9★",   label: "Average Student Rating" },
];

// ─── Testimonial Card ───────────────────────────────────────────────────────
function TestimonialCard({
  name,
  role,
  text,
  index,
  cardRef,
}: {
  name: string;
  role: string;
  text: string;
  index: number;
  cardRef: (el: HTMLLIElement | null) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [needsClamp, setNeedsClamp] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  const avatar = AVATAR_STYLES[index % AVATAR_STYLES.length];
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  // Check if text overflows 4 lines
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    // Compare scrollHeight vs clientHeight when clamped
    setNeedsClamp(el.scrollHeight > el.clientHeight + 2);
  }, [text]);

  return (
    <li
      ref={cardRef}
      className="pain-card-animate bg-white/5 border border-white/10 rounded-xl p-5 transition-all duration-300 hover:scale-[1.03] hover:border-[rgba(255,98,0,0.3)] hover:shadow-lg hover:shadow-orange-500/5 flex flex-col h-full"
    >
      {/* Top: Author info */}
      <div className="flex items-center gap-3 mb-3">
        <div
          aria-hidden="true"
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold shrink-0"
          style={{ background: avatar.bg, color: avatar.color }}
        >
          {initials}
        </div>
        <div className="min-w-0">
          <cite className="not-italic text-sm font-bold text-white block truncate">
            {name}
          </cite>
          <span className="text-xs text-white/50 block truncate">{role}</span>
        </div>
      </div>

      {/* Stars */}
      <div
        role="img"
        aria-label="5 out of 5 stars"
        className="text-yellow-400 text-sm mb-3 tracking-wide"
      >
        ★★★★★
      </div>

      {/* Quote text */}
      <blockquote className="flex-1 m-0 p-0 border-none">
        <p
          ref={textRef}
          className="text-sm text-white/80 leading-relaxed m-0"
          style={
            expanded
              ? undefined
              : {
                  display: "-webkit-box",
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }
          }
        >
          &ldquo;{text}&rdquo;
        </p>
      </blockquote>

      {/* Read More / Less toggle */}
      {(needsClamp || expanded) && (
        <button
          onClick={() => setExpanded((p) => !p)}
          className="mt-2 text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors self-start cursor-pointer bg-transparent border-none p-0"
        >
          {expanded ? "Read Less ↑" : "Read More ↓"}
        </button>
      )}
    </li>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function TestimonialsSection() {
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);

  const setCardRef = useCallback(
    (i: number) => (el: HTMLLIElement | null) => {
      cardRefs.current[i] = el;
    },
    []
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("in-view");
        }),
      { threshold: 0.1 }
    );
    cardRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <section
      aria-labelledby="testimonials-heading"
      style={{ background: "#060D1A", padding: "80px 5%" }}
    >
      {/* ── Conversion banner ── */}
      <div className="text-center mb-10">
        <span className="inline-block bg-gradient-to-r from-[#FF6200] to-[#FFB800] text-white text-sm sm:text-base font-bold px-6 py-2 rounded-full shadow-lg">
          🏆 5000+ students placed in Government jobs
        </span>
      </div>

      {/* ── Header ── */}
      <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 60px" }}>
        <div aria-hidden="true" style={styles.tag}>RANK HOLDERS SPEAK</div>
        <h2 id="testimonials-heading" style={styles.heading}>
          5000+ Students Got{" "}
          <span style={styles.highlight}>Government Jobs.</span>
        </h2>
        <p style={styles.sub}>
          These are real results from real students. Average score improvement: +43% after
          30 days of practice on CivilEzy.
        </p>
      </div>

      {/* ── Testimonial cards ── */}
      <ul
        role="list"
        aria-label="Student testimonials"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1200px] mx-auto list-none p-0"
      >
        {DISPLAY_TESTIMONIALS.map((t, i) => (
          <TestimonialCard
            key={t.name}
            name={t.name}
            role={t.role}
            text={t.text}
            index={i}
            cardRef={setCardRef(i)}
          />
        ))}
      </ul>

      {/* ── Stats bar ── */}
      <dl
        aria-label="Platform statistics"
        style={{
          maxWidth: "900px",
          margin: "50px auto 0",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
          gap: "20px",
          textAlign: "center",
        }}
      >
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <dt
              style={{
                fontFamily: "Rajdhani, sans-serif",
                fontSize: "42px",
                fontWeight: 700,
                background: "linear-gradient(135deg,#FF6200,#FFB800)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {stat.num}
            </dt>
            <dd className="text-sm text-white/55 m-0">{stat.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

// ─── Shared styles ───────────────────────────────────────────────────────────
const styles = {
  tag: {
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
  } as React.CSSProperties,
  heading: {
    fontFamily: "Rajdhani, sans-serif",
    fontSize: "clamp(28px,4vw,44px)",
    fontWeight: 700,
    lineHeight: 1.2,
    marginBottom: "16px",
    color: "#ffffff",
  } as React.CSSProperties,
  highlight: {
    background: "linear-gradient(135deg,#FF6200,#FFB800)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  } as React.CSSProperties,
  sub: {
    fontSize: "17px",
    color: "rgba(255,255,255,0.85)",
    lineHeight: 1.7,
    margin: 0,
  } as React.CSSProperties,
} as const;

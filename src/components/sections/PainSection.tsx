
// All imports at the top — React convention
import { useEffect, useRef, useCallback, forwardRef } from "react";

// ─── Data ───────────────────────────────────────────────────────────────────
const PAIN_CARDS = [
  {
    icon:  "😵",
    title: "Total Confusion",
    desc:  "Which topics to study? ITI pool vs Diploma pool? Nobody explains the PSC syllabus structure clearly in Malayalam.",
  },
  {
    icon:  "📚",
    title: "Scattered Resources",
    desc:  "Study material in 10 different Telegram groups. No structure, no sequence, no quality control. Total chaos.",
  },
  {
    icon:  "💸",
    title: "Wrong Platforms",
    desc:  "Expensive platforms charge ₹5000+ for generic content that has zero Kerala PSC relevance. Money wasted.",
  },
  {
    icon:  "⏰",
    title: "Exam is Coming",
    desc:  "PSC notification released. You know you should start. But you don't know where to begin. Every day wasted = rank lost.",
  },
] as const;

// ─── Stable hover handlers (module-level, never recreated) ───────────────────
const onCardEnter = (e: React.MouseEvent<HTMLDivElement>) => {
  const el = e.currentTarget as HTMLDivElement;
  el.style.borderColor = "rgba(255,50,50,0.5)";
  el.style.transform   = "translateY(-4px)";
};
const onCardLeave = (e: React.MouseEvent<HTMLDivElement>) => {
  const el = e.currentTarget as HTMLDivElement;
  el.style.borderColor = "rgba(255,50,50,0.2)";
  el.style.transform   = "translateY(0)";
};

// ─── Main Component ──────────────────────────────────────────────────────────
export default function PainSection() {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Stable ref setter — avoids new callback on every parent render
  const setCardRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => { cardsRef.current[i] = el; },
    []
  );

  // Scroll-triggered fade-up (logic unchanged)
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("in-view"); }),
      { threshold: 0.1 }
    );
    cardsRef.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      aria-labelledby="pain-heading"
      style={{ background:"#080F1E", padding:"80px 5%" }}
    >
      {/* ── Section header ── */}
      <div style={{ textAlign:"center", maxWidth:"700px", margin:"0 auto 60px" }}>
        {/* Decorative tag — aria-hidden since heading conveys the same meaning */}
        <div
          aria-hidden="true"
          style={{ display:"inline-block", background:"rgba(255,98,0,0.15)", border:"1px solid rgba(255,98,0,0.3)", borderRadius:"20px", padding:"4px 16px", fontSize:"12px", fontWeight:700, color:"#FF8534", letterSpacing:"0.5px", marginBottom:"16px" }}
        >
          THE PROBLEM
        </div>

        {/* Heading — lang="ml" on Malayalam spans for correct screen reader pronunciation */}
        <h2
          id="pain-heading"
          style={{ fontFamily:"Rajdhani, sans-serif", fontSize:"clamp(28px,4vw,44px)", fontWeight:700, lineHeight:1.2, marginBottom:"16px", color:"#ffffff" }}
        >
          <span lang="ml">ഇതാണോ</span>{" "}
          <span
            lang="ml"
            style={{ background:"linear-gradient(135deg,#FF6200,#FFB800)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}
          >
            നിങ്ങളുടെ
          </span>{" "}
          situation?
        </h2>

        <p style={{ fontSize:"17px", color:"rgba(255,255,255,0.85)", lineHeight:1.7, margin:0 }}>
          Most Kerala PSC Civil Engineering aspirants fail — not because
          they&apos;re not smart, but because they&apos;re lost.
        </p>
      </div>

      {/* ── Pain cards grid — role="list" restores list semantics ── */}
      <ul
        role="list"
        aria-label="Common challenges faced by Kerala PSC aspirants"
        style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:"20px", maxWidth:"1200px", margin:"0 auto", listStyle:"none", padding:0 }}
      >
        {PAIN_CARDS.map((card, i) => (
          <PainCard
            key={card.title}
            icon={card.icon}
            title={card.title}
            desc={card.desc}
            ref={setCardRef(i)}
          />
        ))}
      </ul>

      {/* ── Bottom CTA text ── */}
      <p
        aria-label="Civilezy solves all of these problems"
        style={{ textAlign:"center", padding:"30px", fontFamily:"Rajdhani, sans-serif", fontSize:"22px", fontWeight:700, color:"#FF6200" }}
      >
        {/* Arrow symbols are decorative */}
        <span aria-hidden="true">↓&nbsp;&nbsp;</span>
        Civilezy solves all of this
        <span aria-hidden="true">&nbsp;&nbsp;↓</span>
      </p>
    </section>
  );
}

// ─── PainCard sub-component ───────────────────────────────────────────────────
const PainCard = forwardRef<
  HTMLDivElement,
  { icon: string; title: string; desc: string }
>(function PainCard({ icon, title, desc }, ref) {
  return (
    <li>
      <div
        ref={ref}
        className="pain-card-animate"
        style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,50,50,0.2)", borderRadius:"16px", padding:"24px", position:"relative", overflow:"hidden", transition:"border-color 0.3s, transform 0.3s, opacity 0.5s ease" }}
        onMouseEnter={onCardEnter}
        onMouseLeave={onCardLeave}
      >
        {/* Emoji icon — decorative, aria-hidden */}
        <div aria-hidden="true" style={{ fontSize:"32px", marginBottom:"12px" }}>{icon}</div>

        {/* h3 — correct heading level under the section h2 */}
        <h3
          style={{ fontFamily:"Rajdhani, sans-serif", fontSize:"20px", fontWeight:700, color:"#FF6B6B", marginBottom:"8px" }}
        >
          {title}
        </h3>

        <p style={{ fontSize:"14px", color:"rgba(255,255,255,0.85)", lineHeight:1.6, margin:0 }}>
          {desc}
        </p>
      </div>
    </li>
  );
});
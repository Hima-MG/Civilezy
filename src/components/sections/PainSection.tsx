"use client";

// All imports at the top — React convention
import { useEffect, useRef, useCallback, forwardRef } from "react";

// ─── Data ───────────────────────────────────────────────────────────────────
const PAIN_CARDS = [
  {
    icon:  "⚠️",
    title: "No Roadmap",
    desc:  "ഏത് subject ആദ്യം പഠിക്കണം? ഏതൊക്കെ skip ചെയ്യാം? Material ഒരുപാടുണ്ട് — പക്ഷേ ഒരു daily study plan ഇല്ല. ആദ്യ ദിവസം തൊട്ട് എങ്ങനെ proceed ചെയ്യണം എന്ന് ആരും പറഞ്ഞുതരില്ല.",
  },
  {
    icon:  "⏳",
    title: "Too Hard, No Time",
    desc:  "Design, Analysis, Structural — ഇംഗ്ലീഷ് technical jargons കണ്ടാൽ തലകറങ്ങും. Notes എഴുതാൻ സമയവുമില്ല. ജോലിക്കിടയിൽ മണിക്കൂറുകൾ ഇരുന്ന് പഠിക്കാൻ ആർക്കാണ് കഴിയുക?",
  },
  {
    icon:  "💸",
    title: "Coaching is Too Expensive",
    desc:  "വലിയ coaching platforms ₹30,000–₹50,000 ഒറ്റത്തവണ വാങ്ങും — Kerala PSC-ന് യോജിക്കാത്ത generic content-ന്. എല്ലാവർക്കും ആ risk എടുക്കാൻ കഴിയില്ല.",
  },
  {
    icon:  "📉",
    title: "Learning Without Results",
    desc:  "വായിക്കും, വായിക്കും — പക്ഷേ exam day-ൽ blank ആകും. Regular practice tests ഇല്ല, progress track ചെയ്യുന്നില്ല. വെറും reading കൊണ്ട് മാത്രം rank list-ൽ ഇടം കിട്ടില്ല.",
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
      style={{ background:"#080F1E", padding:"80px 5% 20px" }}
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

      {/* ── Pain cards grid ── */}
      <ul
        role="list"
        aria-label="Common challenges faced by Kerala PSC aspirants"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto list-none p-0"
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
        aria-label="CivilEzy solves all of these problems"
        style={{ textAlign:"center", padding:"30px", fontFamily:"Rajdhani, sans-serif", fontSize:"22px", fontWeight:700, color:"#FF6200" }}
      >
        {/* Arrow symbols are decorative */}
        <span aria-hidden="true">↓&nbsp;&nbsp;</span>
        CivilEzy solves all of this
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
    <li className="h-full">
      <div
        ref={ref}
        className="pain-card-animate bg-white/[0.03] border border-red-500/20 rounded-xl p-5 min-h-[220px] h-full flex flex-col transition-all duration-300 hover:scale-[1.03] hover:border-red-500/50"
        onMouseEnter={onCardEnter}
        onMouseLeave={onCardLeave}
      >
        {/* Icon */}
        <div aria-hidden="true" className="w-10 h-10 flex items-center justify-center text-[28px] mb-3 shrink-0">{icon}</div>

        {/* Title */}
        <h3
          style={{ fontFamily:"Rajdhani, sans-serif" }}
          className="text-lg font-bold text-red-400 mb-2"
        >
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm leading-relaxed text-white/85 m-0 flex-1">
          {desc}
        </p>
      </div>
    </li>
  );
});

"use client";

import { useEffect, useRef } from "react";

const TESTIMONIALS = [
  {
    stars:      "★★★★★",
    text:       "I was completely lost about which pool to study for. Civilezy explained the entire DIP-G1 architecture in Malayalam. Cracked it in first attempt!",
    avatarText: "AR",
    avatarBg:   "rgba(255,98,0,0.2)",
    avatarColor:"#FF8534",
    name:       "Arjun Ravi",
    role:       "Diploma Civil, Thrissur",
    rank:       "🏆 Rank 3 — KWA AE 2024",
  },
  {
    stars:      "★★★★★",
    text:       "The streak system made me study every single day. After 21 days I was in the top 50 of the leaderboard. The mock tests are exactly like the real PSC paper.",
    avatarText: "MK",
    avatarBg:   "rgba(255,184,0,0.2)",
    avatarColor:"#FFB800",
    name:       "Meera Krishnan",
    role:       "ITI Civil, Ernakulam",
    rank:       "🏆 Rank 7 — PWD Overseer 2024",
  },
  {
    stars:      "★★★★★",
    text:       "Other platforms charged ₹7000 for content that didn't even mention Kerala PSC. Civilezy at ₹1999 gave me 95 mock tests. Best investment of my preparation.",
    avatarText: "SP",
    avatarBg:   "rgba(100,200,255,0.15)",
    avatarColor:"#64C8FF",
    name:       "Sreejith Pillai",
    role:       "B.Tech Civil, Kozhikode",
    rank:       "🏆 Rank 12 — LSGD AE 2024",
  },
  {
    stars:      "★★★★★",
    text:       "The weak subject detection showed me I was weak in Soil Mechanics. I focused on it for 2 weeks. Score went from 54% to 89% in that topic. Life changing platform.",
    avatarText: "AN",
    avatarBg:   "rgba(50,200,100,0.15)",
    avatarColor:"#32C864",
    name:       "Anjali Nair",
    role:       "Diploma Civil, Trivandrum",
    rank:       "🏆 Rank 4 — KSEB Technical 2024",
  },
] as const;

const STATS = [
  { num: "5,200+", label: "Active Students"           },
  { num: "98+",    label: "Government Job Placements"  },
  { num: "+43%",   label: "Avg Score Improvement / 30 Days" },
  { num: "4.9★",   label: "Average Student Rating"    },
] as const;

export default function TestimonialsSection() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("in-view");
        });
      },
      { threshold: 0.1 }
    );
    cardRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  return (
    <section style={{ background: "#060D1A", padding: "80px 5%" }}>
      {/* Header */}
      <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 60px" }}>
        <div style={styles.tag}>RANK HOLDERS SPEAK</div>
        <h2 style={styles.heading}>
          98+ Students Got{" "}
          <span style={styles.highlight}>Government Jobs.</span>
        </h2>
        <p style={styles.sub}>
          These are real results from real students. Average score improvement: +43% after
          30 days of practice on Civilezy.
        </p>
      </div>

      {/* Testimonial Cards */}
      <div
        style={{
          display:             "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap:                 "20px",
          maxWidth:            "1200px",
          margin:              "0 auto",
        }}
      >
        {TESTIMONIALS.map((t, i) => (
          <div
            key={t.name}
            ref={(el) => { cardRefs.current[i] = el; }}
            className="pain-card-animate"
            style={{
              background:   "rgba(255,255,255,0.04)",
              border:       "1px solid rgba(255,255,255,0.08)",
              borderRadius: "18px",
              padding:      "24px",
              transition:   "all 0.3s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "rgba(255,98,0,0.3)";
              el.style.transform   = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "rgba(255,255,255,0.08)";
              el.style.transform   = "translateY(0)";
            }}
          >
            {/* Stars */}
            <div style={{ color: "#FFB800", fontSize: "16px", marginBottom: "12px" }}>
              {t.stars}
            </div>

            {/* Quote */}
            <p
              style={{
                fontSize:     "14px",
                color:        "rgba(255,255,255,0.85)",
                lineHeight:   1.7,
                marginBottom: "16px",
                fontStyle:    "italic",
              }}
            >
              &ldquo;{t.text}&rdquo;
            </p>

            {/* Author */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width:          "44px",
                  height:         "44px",
                  borderRadius:   "50%",
                  background:     t.avatarBg,
                  color:          t.avatarColor,
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                  fontSize:       "16px",
                  fontWeight:     800,
                  flexShrink:     0,
                }}
              >
                {t.avatarText}
              </div>
              <div>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "#ffffff" }}>{t.name}</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)" }}>{t.role}</div>
                <div style={{ fontSize: "12px", color: "#FF8534", fontWeight: 700 }}>{t.rank}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats bar */}
      <div
        style={{
          maxWidth:            "900px",
          margin:              "50px auto 0",
          display:             "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap:                 "20px",
          textAlign:           "center",
        }}
      >
        {STATS.map((stat) => (
          <div
            key={stat.label}
            style={{
              background:   "rgba(255,255,255,0.04)",
              border:       "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px",
              padding:      "24px",
            }}
          >
            <div
              style={{
                fontFamily:           "Rajdhani, sans-serif",
                fontSize:             "42px",
                fontWeight:           700,
                background:           "linear-gradient(135deg, #FF6200, #FFB800)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor:  "transparent",
                backgroundClip:       "text",
              }}
            >
              {stat.num}
            </div>
            <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const styles = {
  tag: {
    display:       "inline-block",
    background:    "rgba(255,98,0,0.15)",
    border:        "1px solid rgba(255,98,0,0.3)",
    borderRadius:  "20px",
    padding:       "4px 16px",
    fontSize:      "12px",
    fontWeight:    700,
    color:         "#FF8534",
    letterSpacing: "0.5px",
    marginBottom:  "16px",
  } as React.CSSProperties,
  heading: {
    fontFamily:   "Rajdhani, sans-serif",
    fontSize:     "clamp(28px, 4vw, 44px)",
    fontWeight:   700,
    lineHeight:   1.2,
    marginBottom: "16px",
    color:        "#ffffff",
  } as React.CSSProperties,
  highlight: {
    background:           "linear-gradient(135deg, #FF6200, #FFB800)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor:  "transparent",
    backgroundClip:       "text",
  } as React.CSSProperties,
  sub: {
    fontSize:   "17px",
    color:      "rgba(255,255,255,0.85)",
    lineHeight: 1.7,
    margin:     0,
  } as React.CSSProperties,
} as const;
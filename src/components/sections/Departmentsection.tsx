"use client";

import { useEffect, useRef } from "react";

const DEPARTMENTS = [
  { icon: "💧", name: "KWA",        count: "1,840 Questions" },
  { icon: "🛣️", name: "PWD",        count: "2,200 Questions" },
  { icon: "🏘️", name: "LSGD",       count: "1,650 Questions" },
  { icon: "⚡", name: "KSEB",       count: "980 Questions"  },
  { icon: "🌾", name: "IRD",        count: "760 Questions"  },
  { icon: "🏫", name: "Education",  count: "540 Questions"  },
  { icon: "🏥", name: "Health Dept",count: "420 Questions"  },
  { icon: "🚂", name: "RailDev",    count: "380 Questions"  },
] as const;

export default function DepartmentSection() {
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
    <section id="blog" style={{ background: "#0B1E3D", padding: "80px 5%" }}>
      {/* Header */}
      <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 60px" }}>
        <div style={styles.tag}>DEPARTMENT PREP</div>
        <h2 style={styles.heading}>
          Hyper-Local.{" "}
          <span style={styles.highlight}>Department-Specific.</span>
        </h2>
        <p style={styles.sub}>
          Dedicated study material and mock tests for every major Kerala department
          that recruits Civil Engineers.
        </p>
      </div>

      {/* Dept grid */}
      <div
        style={{
          display:             "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap:                 "16px",
          maxWidth:            "1100px",
          margin:              "0 auto",
        }}
      >
        {DEPARTMENTS.map((dept, i) => (
          <div
            key={dept.name}
            ref={(el) => { cardRefs.current[i] = el; }}
            className="pain-card-animate"
            style={{
              background:   "rgba(255,255,255,0.04)",
              border:       "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px",
              padding:      "20px 16px",
              textAlign:    "center",
              transition:   "all 0.3s",
              cursor:       "pointer",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background   = "rgba(255,98,0,0.1)";
              el.style.borderColor  = "rgba(255,98,0,0.3)";
              el.style.transform    = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background  = "rgba(255,255,255,0.04)";
              el.style.borderColor = "rgba(255,255,255,0.08)";
              el.style.transform   = "translateY(0)";
            }}
          >
            <div style={{ fontSize: "32px", marginBottom: "10px" }}>{dept.icon}</div>
            <div
              style={{
                fontFamily:   "Rajdhani, sans-serif",
                fontSize:     "18px",
                fontWeight:   700,
                marginBottom: "4px",
                color:        "#ffffff",
              }}
            >
              {dept.name}
            </div>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)" }}>
              {dept.count}
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
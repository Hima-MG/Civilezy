"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { type EbookData } from "@/data/ebookData";
import { getWhatsAppUrl } from "@/lib/constants";

const MODULE_ICONS = ["📐", "📏", "🧱", "🏗️", "🏛️", "📊", "💧", "🌍", "🚗", "🌿"];

const FAQ_ITEMS = [
  {
    q: "What is this E-Book for?",
    a: "This Quick Revision E-Book is designed for candidates preparing for the Kerala PSC Overseer GR.1 and Instructor exam at Diploma Civil level. It covers all 10 key subjects in a concise, exam-focused format — perfect for fast, effective revision.",
  },
  {
    q: "Can I view the E-Book before purchasing?",
    a: "Yes! Click \"View Free Preview\" to access sample content and judge the quality before you buy. We believe in full transparency — try before you pay.",
  },
  {
    q: "What's included in the E-Book?",
    a: "You get concise revision notes for all 10 Diploma Civil Engineering modules mapped directly to the Kerala PSC syllabus, plus 20 model exam papers for timed practice.",
  },
  {
    q: "How long is the validity?",
    a: "The E-Book is valid until June 30, 2026 — aligned with the exam date. You'll have full uninterrupted access throughout your preparation period.",
  },
  {
    q: "How do I access after purchase?",
    a: "After purchase you'll receive access through the Civilezy learning platform (learn.civilezy.in). Log in with your credentials and find the E-Book in your dashboard instantly.",
  },
  {
    q: "Who should buy this E-Book?",
    a: "Ideal for candidates in the final weeks of preparation who need structured, quick revision. If you're short on time and want to cover all key topics efficiently, this E-Book is built for you.",
  },
];

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function EbookDetailPage({ ebook }: { ebook: EbookData }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const target = new Date(`${ebook.examDate}T00:00:00+05:30`).getTime();
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setTimeLeft({
        days:    Math.floor(diff / 86_400_000),
        hours:   Math.floor((diff % 86_400_000) / 3_600_000),
        minutes: Math.floor((diff % 3_600_000) / 60_000),
        seconds: Math.floor((diff % 60_000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [ebook.examDate]);

  const waUrl = getWhatsAppUrl(
    `Hi Civilezy! I'm interested in the ${ebook.title} for ${ebook.subtitle}. Please share more details.`
  );

  return (
    <>
      <main
        style={{
          background: "#040C18",
          minHeight: "100vh",
          paddingTop: "70px",
          paddingBottom: "80px",
        }}
      >
        {/* ── Breadcrumb ── */}
        <div
          style={{
            background: "rgba(11,30,61,0.8)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            padding: "12px 5%",
          }}
        >
          <nav
            aria-label="Breadcrumb"
            style={{
              maxWidth: "1100px",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: "Nunito, sans-serif",
              fontSize: "13px",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            <Link href="/" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Home</Link>
            <span>›</span>
            <Link href="/ebooks" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>E-Books</Link>
            <span>›</span>
            <span style={{ color: "rgba(255,255,255,0.7)" }}>{ebook.subtitle}</span>
          </nav>
        </div>

        {/* ── Premium Hero Banner ── */}
        <section
          style={{
            background: "linear-gradient(160deg, #020B17 0%, #071526 35%, #0C2040 70%, #091729 100%)",
            position: "relative",
            overflow: "hidden",
            borderBottom: "1px solid rgba(245,158,11,0.1)",
          }}
        >
          {/* Blueprint grid */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute", inset: 0,
              backgroundImage:
                "linear-gradient(rgba(245,158,11,0.025) 1px, transparent 1px)," +
                "linear-gradient(90deg, rgba(245,158,11,0.025) 1px, transparent 1px)",
              backgroundSize: "55px 55px",
              pointerEvents: "none",
            }}
          />
          {/* Ambient glow */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "10%", right: "25%",
              width: "600px", height: "600px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(245,158,11,0.055) 0%, transparent 65%)",
              pointerEvents: "none",
            }}
          />

          {/* Hero content */}
          <div className="dp-hero-wrap">

            {/* LEFT */}
            <div className="dp-hero-left">
              {/* Exam date pill */}
              {ebook.examDate && (
                <div
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.28)",
                    borderRadius: "8px", padding: "5px 14px",
                    fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px",
                    color: "#FCD34D", fontFamily: "Nunito, sans-serif", marginBottom: "18px",
                  }}
                >
                  📅 EXAM ON&nbsp;<strong>JUNE 30</strong>&nbsp;·&nbsp;{ebook.subtitle.toUpperCase()}
                </div>
              )}

              {/* NEW LAUNCH badge */}
              {ebook.isNew && (
                <div
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.28)",
                    borderRadius: "20px", padding: "4px 14px",
                    fontSize: "11px", fontWeight: 800, letterSpacing: "1px",
                    color: "#34D399", fontFamily: "Nunito, sans-serif", marginBottom: "24px",
                  }}
                >
                  <span className="dp-pulse" />
                  🚀 NEW LAUNCH
                </div>
              )}

              {/* Main heading */}
              <h1 className="dp-hero-title">
                {ebook.title.replace("E-Book", "")}
                <br />
                <span className="dp-hero-title-gold">E-Book</span>
              </h1>

              {/* Subtitle */}
              <div
                style={{
                  display: "inline-block",
                  borderLeft: "3px solid #F59E0B",
                  paddingLeft: "14px",
                  fontFamily: "Nunito, sans-serif",
                  fontSize: "clamp(14px, 1.8vw, 18px)",
                  fontWeight: 800,
                  color: "#ffffff",
                  marginBottom: "14px",
                  lineHeight: 1.4,
                }}
              >
                For {ebook.subtitle}
              </div>

              {/* Level */}
              <div
                style={{
                  fontFamily: "Nunito, sans-serif", fontSize: "13px",
                  color: "rgba(255,255,255,0.45)", marginBottom: "18px",
                  display: "flex", alignItems: "center", gap: "6px",
                }}
              >
                🎓 {ebook.level}
              </div>

              {/* Tagline */}
              <p
                style={{
                  fontFamily: "Nunito, sans-serif", fontSize: "14px",
                  color: "rgba(255,255,255,0.4)", fontStyle: "italic",
                  marginBottom: "24px",
                }}
              >
                &ldquo;{ebook.tagline}&rdquo;
              </p>

              {/* Feature pills */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "28px" }}>
                {ebook.features.map((f) => (
                  <span
                    key={f}
                    style={{
                      background: "rgba(245,158,11,0.08)",
                      border: "1px solid rgba(245,158,11,0.22)",
                      color: "#F59E0B",
                      fontFamily: "Nunito, sans-serif",
                      fontSize: "11px", fontWeight: 700,
                      padding: "5px 13px", borderRadius: "20px",
                    }}
                  >
                    ✓ {f}
                  </span>
                ))}
              </div>

              {/* Countdown */}
              <div
                style={{
                  display: "inline-flex", alignItems: "center", gap: "12px",
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.25)",
                  borderRadius: "12px", padding: "10px 18px",
                }}
              >
                <span
                  style={{
                    fontFamily: "Nunito, sans-serif", fontSize: "11px",
                    fontWeight: 800, color: "#F87171", letterSpacing: "0.5px",
                  }}
                >
                  ⏰ EXAM COUNTDOWN
                </span>
                {[
                  { val: timeLeft.days, label: "Days" },
                  { val: timeLeft.hours, label: "Hrs" },
                  { val: timeLeft.minutes, label: "Mins" },
                  { val: timeLeft.seconds, label: "Secs" },
                ].map(({ val, label }) => (
                  <div key={label} style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontFamily: "Rajdhani, sans-serif", fontSize: "20px",
                        fontWeight: 700, color: "#FCA5A5", lineHeight: 1,
                      }}
                    >
                      {String(val).padStart(2, "0")}
                    </div>
                    <div
                      style={{
                        fontSize: "9px", color: "rgba(252,165,165,0.6)",
                        fontFamily: "Nunito, sans-serif", fontWeight: 700,
                      }}
                    >
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — CEO Image */}
            <div className="dp-hero-right">
              <img
                src="/ceo-banner.png"
                alt="Civilezy founder"
                className="dp-ceo-img"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
            </div>

          </div>

          {/* CTA Bar */}
          <div className="dp-cta-bar">
            <a
              href={ebook.previewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="dp-btn-preview"
            >
              <span style={{ fontSize: "18px" }}>👁</span>
              <span>
                <span className="dp-btn-main">View Free Preview</span>
                <span className="dp-btn-sub">Try before you buy!</span>
              </span>
            </a>

            <div className="dp-cta-sep" />

            <div className="dp-cta-info">
              <span
                style={{
                  fontFamily: "Nunito, sans-serif", fontSize: "10px",
                  fontWeight: 700, color: "rgba(255,255,255,0.38)", letterSpacing: "0.8px",
                }}
              >
                FEE
              </span>
              <span
                style={{
                  fontFamily: "Rajdhani, sans-serif", fontSize: "26px",
                  fontWeight: 700, color: "#ffffff", lineHeight: 1,
                }}
              >
                {ebook.priceDisplay}{" "}
                <span
                  style={{
                    fontSize: "12px", fontFamily: "Nunito, sans-serif",
                    color: "rgba(255,255,255,0.38)",
                  }}
                >
                  ONLY
                </span>
              </span>
            </div>

            <div className="dp-cta-sep" />

            <div className="dp-cta-info">
              <span
                style={{
                  fontFamily: "Nunito, sans-serif", fontSize: "10px",
                  fontWeight: 700, color: "rgba(255,255,255,0.38)", letterSpacing: "0.8px",
                }}
              >
                VALIDITY UP TO
              </span>
              <span
                style={{
                  fontFamily: "Rajdhani, sans-serif", fontSize: "22px",
                  fontWeight: 700, color: "#ffffff", lineHeight: 1,
                  display: "flex", alignItems: "center", gap: "6px",
                }}
              >
                <span style={{ fontSize: "14px" }}>🛡</span> 30-06-2026
              </span>
            </div>

            <div className="dp-cta-sep" />

            <a
              href={ebook.purchaseLink}
              target="_blank"
              rel="noopener noreferrer"
              className="dp-btn-purchase"
            >
              <span style={{ fontSize: "18px" }}>🛒</span>
              <span>
                <span className="dp-btn-main">Purchase E-Book</span>
                <span className="dp-btn-sub">Get instant access now!</span>
              </span>
            </a>
          </div>

          {/* Trust row */}
          <div className="dp-trust-bar">
            <span className="dp-trust-item">🛡 Trusted by Civil Engineering PSC Aspirants</span>
            <span className="dp-trust-sep" />
            <span className="dp-trust-item">🏆 Designed for Fast Revision and Maximum Results</span>
            <span className="dp-trust-sep" />
            <span className="dp-trust-item">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#34D399", textDecoration: "none", fontWeight: 700 }}
              >
                💬 WhatsApp Support: 9072345630
              </a>
            </span>
          </div>
        </section>

        {/* ── Modules ── */}
        <section style={{ background: "#0B1E3D", padding: "70px 5%" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <SectionLabel text="WHAT'S INSIDE" />
            <h2 style={sectionH2}>
              {ebook.modules.length} Comprehensive{" "}
              <span style={gradientText}>Modules Covered</span>
            </h2>
            <p style={sectionSub}>
              Every module is distilled from the official Kerala PSC syllabus — focused, precise, and revision-ready.
            </p>
            <div className="modules-grid">
              {ebook.modules.map((mod, i) => (
                <div
                  key={mod}
                  className="module-card"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(245,158,11,0.15)",
                    borderRadius: "14px",
                    padding: "18px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    transition: "background 0.2s, border-color 0.2s",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "10px",
                      background: "rgba(245,158,11,0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px",
                      flexShrink: 0,
                    }}
                  >
                    {MODULE_ICONS[i]}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "rgba(245,158,11,0.6)",
                        fontFamily: "Nunito, sans-serif",
                        letterSpacing: "0.5px",
                        marginBottom: "2px",
                      }}
                    >
                      MODULE {i + 1}
                    </div>
                    <div
                      style={{
                        fontSize: "15px",
                        fontWeight: 700,
                        color: "#ffffff",
                        fontFamily: "Nunito, sans-serif",
                      }}
                    >
                      {mod}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features + Trust ── */}
        <section style={{ background: "#091729", padding: "70px 5%" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }} className="features-trust-grid">
            {/* Features */}
            <div>
              <SectionLabel text="KEY FEATURES" />
              <h2 style={{ ...sectionH2, marginBottom: "28px" }}>
                Why Choose This{" "}
                <span style={gradientText}>E-Book</span>
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {ebook.features.map((feat) => (
                  <div
                    key={feat}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      background: "rgba(245,158,11,0.06)",
                      border: "1px solid rgba(245,158,11,0.12)",
                      borderRadius: "12px",
                      padding: "14px 18px",
                    }}
                  >
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        background: "rgba(16,185,129,0.15)",
                        border: "1px solid rgba(16,185,129,0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        fontSize: "14px",
                      }}
                    >
                      ✓
                    </div>
                    <span
                      style={{
                        fontFamily: "Nunito, sans-serif",
                        fontSize: "15px",
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.85)",
                      }}
                    >
                      {feat}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust */}
            <div>
              <SectionLabel text="WHO IS THIS FOR" />
              <h2 style={{ ...sectionH2, marginBottom: "20px" }}>
                Built for{" "}
                <span style={gradientText}>PSC Aspirants</span>
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {[
                  {
                    icon: "🎯",
                    title: "Last-Minute Revision",
                    desc: "Structured notes that let you revise everything in minimum time without missing key topics.",
                  },
                  {
                    icon: "📋",
                    title: "100% Syllabus Aligned",
                    desc: "Every chapter maps to the official Kerala PSC Diploma Civil engineering exam syllabus.",
                  },
                  {
                    icon: "🏆",
                    title: "Exam-Oriented Format",
                    desc: "Content is formatted to match question patterns — no unnecessary theory, only what gets marks.",
                  },
                  {
                    icon: "📝",
                    title: "20 Model Exams Included",
                    desc: "Practice with 20 full-length model papers to build exam confidence and time management.",
                  },
                ].map(({ icon, title, desc }) => (
                  <div
                    key={title}
                    style={{
                      display: "flex",
                      gap: "14px",
                      padding: "16px",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: "12px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "22px",
                        flexShrink: 0,
                        marginTop: "2px",
                      }}
                    >
                      {icon}
                    </div>
                    <div>
                      <div
                        style={{
                          fontFamily: "Nunito, sans-serif",
                          fontSize: "15px",
                          fontWeight: 700,
                          color: "#ffffff",
                          marginBottom: "4px",
                        }}
                      >
                        {title}
                      </div>
                      <div
                        style={{
                          fontFamily: "Nunito, sans-serif",
                          fontSize: "13px",
                          color: "rgba(255,255,255,0.55)",
                          lineHeight: 1.6,
                        }}
                      >
                        {desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Trust Banner ── */}
        <section
          style={{
            background: "linear-gradient(135deg, #1A0F00, #2D1A00)",
            borderTop: "1px solid rgba(245,158,11,0.2)",
            borderBottom: "1px solid rgba(245,158,11,0.2)",
            padding: "48px 5%",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div
              style={{
                fontSize: "28px",
                marginBottom: "12px",
              }}
            >
              🏅
            </div>
            <h3
              style={{
                fontFamily: "Rajdhani, sans-serif",
                fontSize: "clamp(22px,3vw,32px)",
                fontWeight: 700,
                color: "#ffffff",
                marginBottom: "12px",
              }}
            >
              Trusted by Civil Engineering PSC Aspirants
            </h3>
            <p
              style={{
                fontFamily: "Nunito, sans-serif",
                fontSize: "15px",
                color: "rgba(255,255,255,0.65)",
                lineHeight: 1.7,
                marginBottom: "28px",
              }}
            >
              Civilezy is Kerala&apos;s dedicated Civil Engineering PSC coaching platform. Our content is
              crafted by experienced civil engineering educators who understand exactly what the PSC
              exam demands.
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: "24px",
              }}
            >
              {[
                { stat: "50,000+", label: "Questions in Platform" },
                { stat: "1,200+",  label: "Mock Tests Available" },
                { stat: "10",      label: "Modules Covered" },
                { stat: "20",      label: "Model Exams Included" },
              ].map(({ stat, label }) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontFamily: "Rajdhani, sans-serif",
                      fontSize: "30px",
                      fontWeight: 700,
                      color: "#F59E0B",
                    }}
                  >
                    {stat}
                  </div>
                  <div
                    style={{
                      fontFamily: "Nunito, sans-serif",
                      fontSize: "13px",
                      color: "rgba(255,255,255,0.5)",
                    }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section style={{ background: "#0B1E3D", padding: "70px 5%" }}>
          <div style={{ maxWidth: "760px", margin: "0 auto" }}>
            <SectionLabel text="FAQ" />
            <h2 style={{ ...sectionH2, marginBottom: "40px" }}>
              Frequently Asked{" "}
              <span style={gradientText}>Questions</span>
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {FAQ_ITEMS.map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: openFaq === i ? "rgba(245,158,11,0.08)" : "rgba(255,255,255,0.03)",
                    border: openFaq === i ? "1px solid rgba(245,158,11,0.3)" : "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "14px",
                    overflow: "hidden",
                    transition: "background 0.2s, border-color 0.2s",
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{
                      width: "100%",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                      padding: "18px 20px",
                      textAlign: "left",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Nunito, sans-serif",
                        fontSize: "15px",
                        fontWeight: 700,
                        color: openFaq === i ? "#F59E0B" : "rgba(255,255,255,0.85)",
                        lineHeight: 1.4,
                      }}
                    >
                      {item.q}
                    </span>
                    <svg
                      aria-hidden="true"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={openFaq === i ? "#F59E0B" : "rgba(255,255,255,0.4)"}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        transition: "transform 0.25s",
                        transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)",
                        flexShrink: 0,
                      }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  <div
                    style={{
                      maxHeight: openFaq === i ? "200px" : "0",
                      overflow: "hidden",
                      transition: "max-height 0.3s ease",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "Nunito, sans-serif",
                        fontSize: "14px",
                        color: "rgba(255,255,255,0.65)",
                        lineHeight: 1.7,
                        padding: "0 20px 18px",
                        margin: 0,
                      }}
                    >
                      {item.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section
          style={{
            background: "linear-gradient(135deg, #091729, #0D2347)",
            padding: "70px 5%",
            textAlign: "center",
            borderTop: "1px solid rgba(245,158,11,0.15)",
          }}
        >
          <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <h2
              style={{
                fontFamily: "Rajdhani, sans-serif",
                fontSize: "clamp(26px,4vw,40px)",
                fontWeight: 700,
                color: "#ffffff",
                marginBottom: "14px",
              }}
            >
              Start Smart Revision{" "}
              <span style={gradientText}>Today</span>
            </h2>
            <p
              style={{
                fontFamily: "Nunito, sans-serif",
                fontSize: "16px",
                color: "rgba(255,255,255,0.65)",
                lineHeight: 1.7,
                marginBottom: "32px",
              }}
            >
              The exam is on <strong style={{ color: "#F59E0B" }}>June 30</strong>. Don&apos;t leave revision to the last day —
              get your structured guide now and study with confidence.
            </p>
            <div
              style={{
                display: "flex",
                gap: "14px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <a
                href={ebook.previewLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "linear-gradient(135deg, #F59E0B, #D97706)",
                  color: "#1A0F00",
                  fontFamily: "Nunito, sans-serif",
                  fontSize: "16px",
                  fontWeight: 800,
                  padding: "15px 32px",
                  borderRadius: "50px",
                  textDecoration: "none",
                  boxShadow: "0 6px 24px rgba(245,158,11,0.4)",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
              >
                👁 View Free Preview
              </a>
              <a
                href={ebook.purchaseLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "linear-gradient(135deg, #FF6200, #FF8534)",
                  color: "#ffffff",
                  fontFamily: "Nunito, sans-serif",
                  fontSize: "15px",
                  fontWeight: 700,
                  padding: "15px 32px",
                  borderRadius: "50px",
                  textDecoration: "none",
                  boxShadow: "0 6px 24px rgba(255,98,0,0.35)",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
              >
                Purchase {ebook.priceDisplay} →
              </a>
            </div>
            <p
              style={{
                fontFamily: "Nunito, sans-serif",
                fontSize: "13px",
                color: "rgba(255,255,255,0.3)",
                marginTop: "20px",
              }}
            >
              Questions? &nbsp;
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#25D366", textDecoration: "none" }}
              >
                Chat with us on WhatsApp
              </a>
            </p>
          </div>
        </section>
      </main>

      {/* ── Sticky mobile CTA ── */}
      <div className="sticky-mobile-cta">
        <a
          href={ebook.previewLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: 1,
            textAlign: "center",
            background: "linear-gradient(135deg, #F59E0B, #D97706)",
            color: "#1A0F00",
            fontFamily: "Nunito, sans-serif",
            fontSize: "14px",
            fontWeight: 800,
            padding: "13px 8px",
            borderRadius: "50px",
            textDecoration: "none",
          }}
        >
          Free Preview
        </a>
        <a
          href={ebook.purchaseLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: 1,
            textAlign: "center",
            background: "linear-gradient(135deg, #FF6200, #FF8534)",
            color: "#ffffff",
            fontFamily: "Nunito, sans-serif",
            fontSize: "14px",
            fontWeight: 700,
            padding: "13px 8px",
            borderRadius: "50px",
            textDecoration: "none",
          }}
        >
          Buy {ebook.priceDisplay}
        </a>
      </div>

      <style>{`
        /* ── Premium Hero ── */
        @keyframes dpPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(0.7); }
        }
        .dp-pulse {
          display: inline-block;
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #34D399;
          animation: dpPulse 1.4s ease-in-out infinite;
          flex-shrink: 0;
        }
        .dp-hero-wrap {
          max-width: 1100px;
          margin: 0 auto;
          padding: 64px 5% 0;
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 40px;
          align-items: center;
        }
        .dp-hero-left { padding: 20px 0 56px; }
        .dp-hero-right {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-bottom: 0;
        }
        .dp-ceo-img {
          width: 100%;
          max-width: 420px;
          height: auto;
          display: block;
          object-fit: contain;
          object-position: bottom center;
        }
        .dp-hero-title {
          font-family: Rajdhani, sans-serif;
          font-size: clamp(40px, 5.5vw, 68px);
          font-weight: 700;
          color: #ffffff;
          line-height: 1.02;
          margin: 0 0 18px;
          text-transform: uppercase;
          letter-spacing: -0.5px;
        }
        .dp-hero-title-gold {
          background: linear-gradient(135deg, #F59E0B, #FCD34D);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        /* CTA Bar */
        .dp-cta-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          background: rgba(0,0,0,0.28);
          border-top: 1px solid rgba(245,158,11,0.1);
          padding: 20px 5%;
          position: relative;
          z-index: 1;
          flex-wrap: wrap;
        }
        .dp-cta-sep {
          width: 1px; height: 52px;
          background: rgba(255,255,255,0.1);
          flex-shrink: 0;
        }
        .dp-cta-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          padding: 0 16px;
        }
        .dp-btn-preview {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #ffffff;
          color: #0B1E3D;
          padding: 12px 24px;
          border-radius: 50px;
          text-decoration: none;
          transition: transform 0.22s, box-shadow 0.22s;
          box-shadow: 0 4px 20px rgba(255,255,255,0.12);
          white-space: nowrap;
        }
        .dp-btn-preview:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(255,255,255,0.22); }
        .dp-btn-purchase {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #F59E0B, #D97706);
          color: #1A0A00;
          padding: 12px 24px;
          border-radius: 50px;
          text-decoration: none;
          transition: transform 0.22s, box-shadow 0.22s;
          box-shadow: 0 4px 20px rgba(245,158,11,0.38);
          white-space: nowrap;
        }
        .dp-btn-purchase:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(245,158,11,0.55); }
        .dp-btn-main {
          display: block;
          font-family: Nunito, sans-serif;
          font-size: 14px;
          font-weight: 800;
        }
        .dp-btn-sub {
          display: block;
          font-family: Nunito, sans-serif;
          font-size: 11px;
          font-weight: 600;
          opacity: 0.72;
        }
        /* Trust bar */
        .dp-trust-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          padding: 14px 5%;
          border-top: 1px solid rgba(255,255,255,0.06);
          flex-wrap: wrap;
          position: relative;
          z-index: 1;
        }
        .dp-trust-item {
          font-family: Nunito, sans-serif;
          font-size: 11px;
          font-weight: 600;
          color: rgba(255,255,255,0.35);
          text-align: center;
        }
        .dp-trust-sep {
          width: 1px; height: 16px;
          background: rgba(255,255,255,0.1);
          flex-shrink: 0;
        }
        /* Responsive hero */
        @media (max-width: 920px) {
          .dp-hero-wrap {
            grid-template-columns: 1fr;
            padding: 48px 5% 0;
          }
          .dp-hero-right { display: none; }
          .dp-cta-sep { display: none; }
          .dp-cta-bar { gap: 20px; }
          .dp-cta-info { padding: 0 8px; }
          .dp-trust-sep { display: none; }
        }
        @media (max-width: 600px) {
          .dp-hero-title { font-size: 38px; }
          .dp-btn-preview, .dp-btn-purchase { padding: 11px 16px; }
        }
        /* ── Rest of page ── */
        .modules-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }
        .module-card:hover {
          background: rgba(245,158,11,0.08) !important;
          border-color: rgba(245,158,11,0.3) !important;
        }
        .features-trust-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: start;
        }
        .sticky-mobile-cta {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(9,23,41,0.97);
          backdrop-filter: blur(10px);
          border-top: 1px solid rgba(245,158,11,0.2);
          padding: 12px 16px;
          gap: 10px;
          z-index: 800;
        }
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 28px;
          }
          .hero-cover { position: static; }
          .modules-grid { grid-template-columns: 1fr; }
          .features-trust-grid { grid-template-columns: 1fr; gap: 40px; }
          .sticky-mobile-cta { display: flex !important; }
          main { padding-bottom: 80px !important; }
        }
        @media (max-width: 480px) {
          .modules-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}

// ─── Small helpers ────────────────────────────────────────────────────────────

function HeroCover({ ebook }: { ebook: EbookData }) {
  return (
    <div
      style={{
        background: "linear-gradient(145deg, #0B1E3D, #1A2F5A)",
        border: "2px solid rgba(245,158,11,0.4)",
        borderRadius: "18px",
        padding: "32px 24px",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(245,158,11,0.1)",
      }}
    >
      {/* Top gold bar */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: "5px",
          background: "linear-gradient(90deg, #F59E0B, #FCD34D, #F59E0B)",
        }}
      />
      {/* Glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-40px", right: "-40px",
          width: "160px", height: "160px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)",
        }}
      />

      <div
        style={{
          fontFamily: "Nunito, sans-serif",
          fontSize: "10px",
          fontWeight: 800,
          color: "#F59E0B",
          letterSpacing: "2px",
          marginBottom: "20px",
        }}
      >
        CIVILEZY
      </div>
      <div
        style={{
          fontFamily: "Rajdhani, sans-serif",
          fontSize: "26px",
          fontWeight: 700,
          color: "#ffffff",
          lineHeight: 1.15,
          marginBottom: "8px",
        }}
      >
        {ebook.title}
      </div>
      <div
        style={{
          fontFamily: "Nunito, sans-serif",
          fontSize: "14px",
          color: "#F59E0B",
          fontWeight: 700,
          marginBottom: "6px",
        }}
      >
        {ebook.subtitle}
      </div>
      <div
        style={{
          fontFamily: "Nunito, sans-serif",
          fontSize: "12px",
          color: "rgba(255,255,255,0.5)",
          marginBottom: "24px",
        }}
      >
        {ebook.level}
      </div>

      {/* Module lines */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "24px" }}>
        {ebook.modules.slice(0, 5).map((mod) => (
          <div
            key={mod}
            style={{
              height: "1px",
              background: "rgba(245,158,11,0.2)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: "-8px",
                fontSize: "10px",
                color: "rgba(255,255,255,0.35)",
                fontFamily: "Nunito, sans-serif",
                whiteSpace: "nowrap",
              }}
            >
              {mod}
            </div>
          </div>
        ))}
        <div
          style={{
            fontSize: "10px",
            color: "rgba(255,255,255,0.2)",
            fontFamily: "Nunito, sans-serif",
            marginTop: "8px",
          }}
        >
          + {ebook.modules.length - 5} more modules…
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid rgba(245,158,11,0.2)",
          paddingTop: "14px",
          fontFamily: "Nunito, sans-serif",
          fontSize: "11px",
          color: "rgba(255,255,255,0.35)",
          fontStyle: "italic",
        }}
      >
        &ldquo;{ebook.tagline}&rdquo;
      </div>
    </div>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <div
      style={{
        display: "inline-block",
        background: "rgba(245,158,11,0.12)",
        border: "1px solid rgba(245,158,11,0.25)",
        borderRadius: "20px",
        padding: "4px 16px",
        fontSize: "11px",
        fontWeight: 800,
        color: "#F59E0B",
        letterSpacing: "1px",
        marginBottom: "14px",
        fontFamily: "Nunito, sans-serif",
      }}
    >
      {text}
    </div>
  );
}

function WhatsAppIcon({ size = 20, color = "#25D366" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function badgeStyle(variant: "green" | "amber" | "blue"): React.CSSProperties {
  const map = {
    green: {
      background: "rgba(16,185,129,0.15)",
      border: "1px solid rgba(16,185,129,0.35)",
      color: "#34D399",
    },
    amber: {
      background: "rgba(245,158,11,0.15)",
      border: "1px solid rgba(245,158,11,0.35)",
      color: "#FCD34D",
    },
    blue: {
      background: "rgba(59,130,246,0.12)",
      border: "1px solid rgba(59,130,246,0.25)",
      color: "#93C5FD",
    },
  };
  return {
    ...map[variant],
    fontSize: "10px",
    fontWeight: 800,
    padding: "3px 12px",
    borderRadius: "20px",
    letterSpacing: "0.5px",
    fontFamily: "Nunito, sans-serif",
  };
}

const sectionH2: React.CSSProperties = {
  fontFamily: "Rajdhani, sans-serif",
  fontSize: "clamp(26px,3.5vw,40px)",
  fontWeight: 700,
  color: "#ffffff",
  lineHeight: 1.2,
  margin: "0 0 12px",
};

const gradientText: React.CSSProperties = {
  background: "linear-gradient(135deg, #F59E0B, #FCD34D)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

const sectionSub: React.CSSProperties = {
  fontFamily: "Nunito, sans-serif",
  fontSize: "16px",
  color: "rgba(255,255,255,0.65)",
  lineHeight: 1.7,
  marginBottom: "36px",
  maxWidth: "600px",
};

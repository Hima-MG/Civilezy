"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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

        {/* ── Premium Hero ── */}
        <section className="ph-section">
          {/* Background layers */}
          <div aria-hidden="true" className="ph-bg-grid" />
          <div aria-hidden="true" className="ph-bg-glow-1" />
          <div aria-hidden="true" className="ph-bg-glow-2" />

          {/* ── z:1 — Atmospheric stage glow behind character ── */}
          <div className="ph-char-glow" aria-hidden="true" />

          {/* ── z:1 — CEO: cinematic character, behind everything ── */}
          <Image
            src="/ceo-banner.png"
            alt="Civilezy Expert"
            width={900}
            height={900}
            priority
            className="ph-ceo-full"
          />

          {/* ── z:2 — Blend layers ── */}
          <div className="ph-ground-vignette" aria-hidden="true" />
          <div className="ph-img-fade" aria-hidden="true" />

          {/* ── z:5 — Floating UI overlays (above content) ── */}
          <div className="ph-ov-exam-badge" aria-hidden="true">
            <span className="ph-ov-eb-dot" />
            <span>KERALA PSC · JUNE 2026</span>
          </div>
          <div className="ph-ov-ebook-card" aria-hidden="true">
            <span className="ph-ov-ec-icon">📘</span>
            <div className="ph-ov-ec-body">
              <div className="ph-ov-ec-title">Quick Revision E-Book</div>
              <div className="ph-ov-ec-sub">10 Modules · 20 Model Exams</div>
            </div>
            <div className="ph-ov-ec-price">₹2,000</div>
          </div>
          <div className="ph-ov-vert-label" aria-hidden="true">CIVILEZY · 2026</div>

          <div className="ph-wrap">

            {/* ━━━ LEFT ━━━ */}
            <div className="ph-left">

              {/* Badges row */}
              <div className="ph-badges-row">
                {ebook.isNew && (
                  <span className="ph-badge-launch">
                    <span className="ph-dot" />
                    🚀 NEW LAUNCH
                  </span>
                )}
                {ebook.examBadge && (
                  <span className="ph-badge-exam">{ebook.examBadge}</span>
                )}
              </div>

              {/* Exam strip */}
              <div className="ph-exam-strip">
                📅 EXAM ON&nbsp;<strong>JUNE 30</strong>&nbsp;·&nbsp;{ebook.subtitle.toUpperCase()}
              </div>

              {/* Main heading */}
              <h1 className="ph-h1">
                <span className="ph-h1-white">QUICK REVISION</span>
                <span className="ph-h1-gold">E-BOOK</span>
              </h1>

              {/* Subtitle with accent bar */}
              <div className="ph-for-line">
                <div className="ph-for-bar" />
                <span>For <strong>{ebook.subtitle}</strong></span>
              </div>

              <p className="ph-level">🎓 {ebook.level}</p>
              <p className="ph-tagline">&ldquo;{ebook.tagline}&rdquo;</p>

              {/* Feature grid 2×2 */}
              <div className="ph-feat-grid">
                {[
                  { icon: "📘", label: "Syllabus Based" },
                  { icon: "⚡", label: "Save Time, Study Smart" },
                  { icon: "🎯", label: "Perfect for Fast Preparation" },
                  { icon: "📝", label: "20 Model Exams" },
                ].map(({ icon, label }) => (
                  <div key={label} className="ph-feat-card">
                    <span className="ph-feat-icon">{icon}</span>
                    <span className="ph-feat-label">{label}</span>
                  </div>
                ))}
              </div>

              {/* Countdown */}
              <div className="ph-countdown">
                <span className="ph-cd-label">⏰ EXAM COUNTDOWN</span>
                <div className="ph-cd-units">
                  {[
                    { val: timeLeft.days, unit: "Days" },
                    { val: timeLeft.hours, unit: "Hrs" },
                    { val: timeLeft.minutes, unit: "Mins" },
                    { val: timeLeft.seconds, unit: "Secs" },
                  ].map(({ val, unit }) => (
                    <div key={unit} className="ph-cd-block">
                      <span className="ph-cd-num">{String(val).padStart(2, "0")}</span>
                      <span className="ph-cd-unit">{unit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA buttons */}
              <div className="ph-cta-row">
                <a href={ebook.previewLink} target="_blank" rel="noopener noreferrer" className="ph-btn-preview">
                  <span>👁</span> View Free Preview
                </a>
                <a href={ebook.purchaseLink} target="_blank" rel="noopener noreferrer" className="ph-btn-buy">
                  <span>🛒</span> Purchase E-Book
                </a>
              </div>

              {/* Info row */}
              <div className="ph-info-row">
                <span className="ph-info-pill">💰 ₹2,000 Only</span>
                <span className="ph-info-dot" />
                <span className="ph-info-text">📆 Valid Upto 30-06-2026</span>
                <span className="ph-info-dot" />
                <a href={waUrl} target="_blank" rel="noopener noreferrer" className="ph-info-wa">
                  💬 WhatsApp: 9072345630
                </a>
              </div>

            </div>

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
        /* ━━━ HERO: ANIMATIONS ━━━ */
        @keyframes phDotPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.25; transform: scale(0.55); }
        }
        @keyframes phBookFloat {
          0%, 100% { transform: translateY(0) rotate(-7deg); }
          50% { transform: translateY(-14px) rotate(-7deg); }
        }
        @keyframes phBadgeFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-7px); }
        }

        /* ━━━ HERO: SECTION + BACKGROUNDS ━━━ */
        .ph-section {
          position: relative; overflow: hidden;
          background: linear-gradient(135deg, #020817 0%, #04152d 45%, #071a35 100%);
          border-bottom: 1px solid rgba(245,158,11,0.07);
        }
        .ph-bg-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(245,158,11,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,158,11,0.018) 1px, transparent 1px);
          background-size: 64px 64px;
        }
        /* Subtle warm glow only — no visible circles */
        .ph-bg-glow-1 {
          position: absolute; top: -20%; right: 2%;
          width: 900px; height: 900px; border-radius: 50%;
          background: radial-gradient(circle, rgba(245,158,11,0.032) 0%, transparent 58%);
          pointer-events: none;
        }
        /* Blue blob removed — was causing shade mismatch */
        .ph-bg-glow-2 { display: none; }

        /* ━━━ HERO: LAYOUT — unified cinematic canvas ━━━ */
        .ph-section { min-height: 92vh; }
        .ph-wrap {
          max-width: 1400px; margin: 0 auto;
          padding: 0 6%;
          position: relative; z-index: 3;
          display: flex; align-items: center;
          min-height: 92vh;
        }
        /* Content block — center-left, floats above the cinematic background */
        .ph-left {
          width: 52%; max-width: 660px; flex-shrink: 0;
          display: flex; flex-direction: column; justify-content: center;
          padding: 80px 40px 80px 0;
          position: relative; z-index: 4;
        }
        /* ━━━ HERO: CINEMATIC LAYER STACK ━━━ */
        /* All layers are direct children of ph-section — no containers */

        /* z:1 — Atmospheric warm glow fills right portion */
        .ph-char-glow {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 78% 52%,
            rgba(245,158,11,0.10) 0%,
            rgba(245,158,11,0.04) 38%,
            rgba(59,130,246,0.02) 60%,
            transparent 72%);
          pointer-events: none; z-index: 1;
        }

        /* z:1 — CEO: cinematic character, BEHIND content, emerges right */
        .ph-ceo-full {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          height: 110%;
          width: auto;
          max-width: none;
          display: block;
          z-index: 1;
        }

        /* z:2 — Ground vignette — section floor, anchors character feet */
        .ph-ground-vignette {
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 20%; z-index: 2; pointer-events: none;
          background: linear-gradient(to top, #020817 0%, rgba(2,8,23,0.5) 48%, transparent 100%);
        }

        /* z:2 — Left-to-right blend — content zone readable, CEO emerges on right */
        .ph-img-fade {
          position: absolute; inset: 0; z-index: 2; pointer-events: none;
          background: linear-gradient(
            to right,
            #020817 0%,
            rgba(2,8,23,0.94) 22%,
            rgba(2,8,23,0.72) 40%,
            rgba(2,8,23,0.30) 58%,
            rgba(2,8,23,0.06) 72%,
            transparent 82%
          );
        }

        /* ━━━ HERO: FLOATING UI OVERLAYS (z:5 — above content) ━━━ */
        /* Positioned relative to ph-section full-width hero */
        .ph-ov-exam-badge {
          position: absolute; top: 44px; right: 44px;
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(4,21,45,0.72); backdrop-filter: blur(14px);
          border: 1px solid rgba(245,158,11,0.28);
          border-radius: 30px; padding: 8px 18px;
          font-family: Nunito, sans-serif; font-size: 11px;
          font-weight: 800; letter-spacing: 0.9px;
          color: rgba(245,158,11,0.92); text-transform: uppercase;
          z-index: 5; white-space: nowrap;
          box-shadow: 0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(245,158,11,0.06);
        }
        .ph-ov-eb-dot {
          width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
          background: #F59E0B; animation: phDotPulse 1.5s ease-in-out infinite;
        }
        .ph-ov-ebook-card {
          position: absolute; bottom: 44px; right: 44px;
          display: flex; align-items: center; gap: 14px;
          background: rgba(4,21,45,0.76); backdrop-filter: blur(18px);
          border: 1px solid rgba(245,158,11,0.18);
          border-top: 1px solid rgba(245,158,11,0.36);
          border-radius: 20px; padding: 16px 20px;
          min-width: 270px; max-width: 340px;
          z-index: 5;
          box-shadow: 0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(245,158,11,0.05);
          animation: phBadgeFloat 4s ease-in-out infinite;
        }
        .ph-ov-ec-icon { font-size: 28px; flex-shrink: 0; line-height: 1; }
        .ph-ov-ec-body { flex: 1; min-width: 0; }
        .ph-ov-ec-title {
          font-family: Rajdhani, sans-serif; font-size: 14px;
          font-weight: 700; color: #ffffff; line-height: 1.2; margin-bottom: 3px;
        }
        .ph-ov-ec-sub {
          font-family: Nunito, sans-serif; font-size: 11px;
          color: rgba(255,255,255,0.42); font-weight: 600; white-space: nowrap;
        }
        .ph-ov-ec-price {
          font-family: Rajdhani, sans-serif; font-size: 22px;
          font-weight: 800; color: #F59E0B; white-space: nowrap; flex-shrink: 0;
        }
        .ph-ov-vert-label {
          position: absolute; right: 12px; top: 50%;
          transform: translateY(-50%) rotate(90deg);
          font-family: Rajdhani, sans-serif; font-size: 9px;
          font-weight: 700; color: rgba(245,158,11,0.18);
          letter-spacing: 4px; text-transform: uppercase;
          z-index: 5; white-space: nowrap;
        }

        /* ━━━ HERO: BADGES ━━━ */
        .ph-badges-row {
          display: flex; align-items: center; gap: 10px; margin-bottom: 18px; flex-wrap: wrap;
        }
        .ph-badge-launch {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(16,185,129,0.09); border: 1px solid rgba(16,185,129,0.24);
          border-radius: 30px; padding: 6px 16px;
          font-size: 11px; font-weight: 800; letter-spacing: 0.9px;
          color: #34D399; font-family: Nunito, sans-serif; text-transform: uppercase;
        }
        .ph-dot {
          width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
          background: #34D399; animation: phDotPulse 1.5s ease-in-out infinite;
        }
        .ph-badge-exam {
          display: inline-block;
          background: rgba(245,158,11,0.09); border: 1px solid rgba(245,158,11,0.22);
          border-radius: 30px; padding: 6px 14px;
          font-size: 11px; font-weight: 700; color: #FCD34D; font-family: Nunito, sans-serif;
        }
        .ph-exam-strip {
          display: inline-block; margin-bottom: 28px;
          font-family: Nunito, sans-serif; font-size: 12px;
          font-weight: 600; color: rgba(245,158,11,0.72); letter-spacing: 0.4px;
        }

        /* ━━━ HERO: HEADING ━━━ */
        .ph-h1 {
          display: flex; flex-direction: column;
          margin: 0 0 26px; line-height: 0.95;
        }
        .ph-h1-white {
          font-family: Rajdhani, sans-serif; display: block;
          font-size: clamp(46px, 5.8vw, 80px);
          font-weight: 800; color: #ffffff;
          text-transform: uppercase; letter-spacing: -2px;
        }
        .ph-h1-gold {
          font-family: Rajdhani, sans-serif; display: block;
          font-size: clamp(46px, 5.8vw, 80px);
          font-weight: 800; text-transform: uppercase; letter-spacing: -2px;
          background: linear-gradient(135deg, #F59E0B 0%, #FDE68A 50%, #F59E0B 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }

        /* ━━━ HERO: SUB-CONTENT ━━━ */
        .ph-for-line {
          display: flex; align-items: center; gap: 14px; margin-bottom: 8px;
          font-family: Nunito, sans-serif; font-size: clamp(15px, 1.8vw, 18px);
          font-weight: 700; color: rgba(255,255,255,0.9);
        }
        .ph-for-bar {
          width: 4px; height: 24px; border-radius: 4px; flex-shrink: 0;
          background: linear-gradient(180deg, #F59E0B, #FCD34D);
        }
        .ph-level {
          font-family: Nunito, sans-serif; font-size: 13px;
          color: rgba(255,255,255,0.35); margin: 0 0 8px; padding-left: 18px;
        }
        .ph-tagline {
          font-family: Nunito, sans-serif; font-size: 14px; font-style: italic;
          color: rgba(255,255,255,0.3); margin: 0 0 34px; padding-left: 18px;
        }

        /* ━━━ HERO: FEATURE CARDS ━━━ */
        .ph-feat-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 10px; margin-bottom: 28px;
        }
        .ph-feat-card {
          display: flex; align-items: center; gap: 12px;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(245,158,11,0.1);
          border-radius: 14px; padding: 14px 16px;
          transition: all 0.24s ease; cursor: default;
        }
        .ph-feat-card:hover {
          background: rgba(245,158,11,0.07);
          border-color: rgba(245,158,11,0.28);
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(245,158,11,0.1);
        }
        .ph-feat-icon { font-size: 20px; flex-shrink: 0; line-height: 1; }
        .ph-feat-label {
          font-family: Nunito, sans-serif; font-size: 13px;
          font-weight: 700; color: rgba(255,255,255,0.82); line-height: 1.3;
        }

        /* ━━━ HERO: COUNTDOWN ━━━ */
        .ph-countdown {
          display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
          background: rgba(239,68,68,0.06); border: 1px solid rgba(239,68,68,0.18);
          border-radius: 16px; padding: 12px 20px; margin-bottom: 34px;
          width: fit-content;
        }
        .ph-cd-label {
          font-family: Nunito, sans-serif; font-size: 11px;
          font-weight: 800; color: #F87171; letter-spacing: 0.5px; white-space: nowrap;
        }
        .ph-cd-units { display: flex; gap: 10px; }
        .ph-cd-block { text-align: center; min-width: 38px; }
        .ph-cd-num {
          display: block; font-family: Rajdhani, sans-serif;
          font-size: 24px; font-weight: 700; color: #FCA5A5; line-height: 1;
        }
        .ph-cd-unit {
          display: block; font-size: 9px; font-weight: 700;
          color: rgba(252,165,165,0.5); font-family: Nunito, sans-serif;
          text-transform: uppercase; letter-spacing: 0.3px;
        }

        /* ━━━ HERO: CTA BUTTONS ━━━ */
        .ph-cta-row { display: flex; gap: 14px; margin-bottom: 24px; flex-wrap: wrap; }
        .ph-btn-preview {
          display: inline-flex; align-items: center; gap: 9px;
          background: linear-gradient(135deg, #F59E0B 0%, #FCD34D 100%);
          color: #0D0700; font-family: Nunito, sans-serif;
          font-size: 15px; font-weight: 800; letter-spacing: 0.2px;
          padding: 15px 32px; border-radius: 50px; text-decoration: none;
          box-shadow: 0 6px 32px rgba(245,158,11,0.45);
          transition: transform 0.22s ease, box-shadow 0.22s ease; white-space: nowrap;
        }
        .ph-btn-preview:hover { transform: translateY(-3px); box-shadow: 0 16px 48px rgba(245,158,11,0.62); }
        .ph-btn-buy {
          display: inline-flex; align-items: center; gap: 9px;
          background: linear-gradient(135deg, #E8430A 0%, #FF7034 100%);
          color: #ffffff; font-family: Nunito, sans-serif;
          font-size: 15px; font-weight: 700;
          padding: 15px 32px; border-radius: 50px; text-decoration: none;
          box-shadow: 0 6px 32px rgba(232,67,10,0.38);
          transition: transform 0.22s ease, box-shadow 0.22s ease; white-space: nowrap;
        }
        .ph-btn-buy:hover { transform: translateY(-3px); box-shadow: 0 16px 48px rgba(232,67,10,0.56); }

        /* ━━━ HERO: INFO ROW ━━━ */
        .ph-info-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .ph-info-pill {
          display: inline-flex; align-items: center;
          background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.18);
          border-radius: 20px; padding: 4px 12px;
          font-family: Nunito, sans-serif; font-size: 12px;
          font-weight: 700; color: #FCD34D;
        }
        .ph-info-dot {
          width: 3px; height: 3px; border-radius: 50%;
          background: rgba(255,255,255,0.16); flex-shrink: 0;
        }
        .ph-info-text {
          font-family: Nunito, sans-serif; font-size: 12px;
          font-weight: 600; color: rgba(255,255,255,0.3);
        }
        .ph-info-wa {
          font-family: Nunito, sans-serif; font-size: 12px;
          font-weight: 700; color: #34D399; text-decoration: none; transition: color 0.2s;
        }
        .ph-info-wa:hover { color: #6EE7B7; }

        /* ━━━ HERO: RESPONSIVE ━━━ */
        @media (max-width: 1200px) {
          .ph-left { width: 54%; }
          .ph-ov-exam-badge { top: 28px; right: 28px; }
          .ph-ov-ebook-card { right: 28px; bottom: 28px; min-width: 220px; padding: 13px 16px; }
        }
        @media (max-width: 1024px) {
          .ph-left { width: 60%; }
          .ph-ov-exam-badge { top: 20px; right: 20px; font-size: 10px; padding: 7px 14px; }
          .ph-ov-ebook-card { right: 20px; bottom: 20px; min-width: 0; gap: 10px; padding: 12px 14px; }
          .ph-ov-ec-icon { font-size: 22px; }
          .ph-ov-ec-price { font-size: 18px; }
          .ph-ov-vert-label { display: none; }
        }
        @media (max-width: 860px) {
          /* SIDE-BY-SIDE: cinematic layout preserved — instructor stays right */
          .ph-section { min-height: 650px; }
          .ph-wrap { min-height: 650px; padding: 0 5%; }
          .ph-left { width: 58%; max-width: 100%; padding: 40px 16px 40px 0; }
          /* Instructor stays vertically centered on the right */
          .ph-ceo-full {
            top: 50%; right: 0;
            transform: translateY(-50%);
            height: 95%; width: auto;
          }
          /* Keep left-to-right fade — text readable, instructor visible */
          .ph-img-fade {
            background: linear-gradient(to right,
              #020817 0%, rgba(2,8,23,0.96) 22%,
              rgba(2,8,23,0.72) 42%, rgba(2,8,23,0.30) 60%,
              rgba(2,8,23,0.06) 74%, transparent 84%
            );
          }
          .ph-ov-exam-badge { display: none; }
          .ph-ov-vert-label { display: none; }
          /* Ebook card: compact, anchored bottom-right inside hero */
          .ph-ov-ebook-card {
            bottom: 16px; right: 16px; left: auto;
            min-width: 0; max-width: 200px;
            border-radius: 14px; padding: 10px 14px; animation: none;
          }
          .ph-ov-ec-title { font-size: 12px; }
          .ph-ov-ec-sub   { font-size: 10px; }
        }
        @media (max-width: 640px) {
          /* Keep cinematic side-by-side at phone width */
          .ph-section { min-height: 650px; }
          .ph-wrap { min-height: 650px; padding: 0 4%; }
          .ph-left { width: 62%; padding: 28px 8px 28px 16px; }
          .ph-h1-white, .ph-h1-gold { font-size: 38px; letter-spacing: -1px; }
          /* Hide non-essential to keep content compact */
          .ph-feat-grid { display: none !important; }
          .ph-tagline   { display: none !important; }
          .ph-countdown { display: none !important; }
          /* Full-width stacked CTAs */
          .ph-cta-row { flex-direction: column; gap: 10px; margin-bottom: 16px; }
          .ph-btn-preview, .ph-btn-buy { justify-content: center; width: 100%; padding: 13px 20px; }
          /* Tighter vertical spacing */
          .ph-badges-row { margin-bottom: 12px; }
          .ph-exam-strip { margin-bottom: 16px; }
          .ph-h1        { margin-bottom: 14px; }
          .ph-for-line  { margin-bottom: 6px; }
          .ph-level     { margin-bottom: 12px; font-size: 13px; }
          /* Instructor stays right, slightly reduced */
          .ph-ceo-full { height: 88%; right: -5px; }
          /* Ebook card: smaller but visible */
          .ph-ov-ebook-card {
            bottom: 10px; right: 8px; left: auto;
            max-width: 160px; border-radius: 12px;
            padding: 8px 10px; animation: none;
          }
          .ph-ov-ec-icon  { font-size: 18px; }
          .ph-ov-ec-price { font-size: 15px; }
        }
        @media (max-width: 414px) {
          .ph-h1-white, .ph-h1-gold { font-size: 32px; letter-spacing: -0.5px; }
          .ph-left { padding: 24px 6px 24px 14px; }
          /* Ebook card removed — too cramped at this width */
          .ph-ov-ebook-card { display: none; }
          .ph-ceo-full { right: -10px; height: 86%; }
        }
        @media (max-width: 375px) {
          .ph-h1-white, .ph-h1-gold { font-size: 28px; letter-spacing: -0.5px; }
          .ph-left { width: 63%; padding: 20px 6px 20px 12px; }
          .ph-ceo-full { height: 84%; right: -12px; }
          .ph-info-wa { display: none; }
        }
        @media (max-width: 320px) {
          .ph-h1-white, .ph-h1-gold { font-size: 24px; letter-spacing: 0; }
          .ph-left { width: 65%; padding: 18px 4px 18px 10px; }
          .ph-badges-row { display: none; }
          .ph-ceo-full { height: 80%; right: -14px; }
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

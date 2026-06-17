"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { HERO_DOMAINS } from "@/data/heroQuestions";
import { EXTERNAL_URLS } from "@/lib/constants";

// ─── Constants ───────────────────────────────────────────────────────────────
const LMS_FREE_TEST = EXTERNAL_URLS.demo;
const LMS_LOGIN = EXTERNAL_URLS.login;

const LIVE_SESSIONS = [
  {
    id:          "civilwar",
    icon:        "⚔️",
    title:       "CivilEzy CivilWar",
    badge:       "🔴 LIVE DAILY",
    time:        "Daily at 6:20 PM",
    description: "Rapid-fire PSC Civil Engineering discussion, strategy, question battles, and exam-oriented learning.",
    btnLabel:    "Join Zoom Session",
    link:        "https://us06web.zoom.us/j/84807826367?pwd=9DCTBwpz5f3jLCcP7HEMZTA8hDAuHe.1",
    accentColor: "#FF6200",
    accentBg:    "rgba(255,98,0,0.12)",
    accentBorder:"rgba(255,98,0,0.28)",
  },
  {
    id:          "overseer",
    icon:        "🔥",
    title:       "Overseer Grade III Revision",
    badge:       "🔴 LIVE DAILY",
    time:        "Daily at 9:30 PM",
    description: "Live revision sessions focused on upcoming Overseer Grade III (LSGD) examinations.",
    btnLabel:    "Watch YouTube Live",
    link:        "https://www.youtube.com/live/bUrgdfzYMeI?si=TFKAVC8bIIiLxSy4",
    accentColor: "#FF4444",
    accentBg:    "rgba(255,68,68,0.1)",
    accentBorder:"rgba(255,68,68,0.28)",
  },
] as const;

const TRUST_METRICS = [
  { icon: "🏛️", num: "18+",    label: "Years Legacy",     sub: "Backed by Wincentre Since 2008" },
  { icon: "👨‍🎓", num: "5,200+", label: "Students Trained", sub: "Across Kerala"                 },
  { icon: "⭐",  num: "4.8",   label: "Student Rating",   sub: "Google Play Store"              },
  { icon: "🎯", num: "2,000+", label: "Job Achievers",    sub: "In Govt. Sector"               },
];

// ─── Hero Videos ─────────────────────────────────────────────────────────────
const HERO_VIDEOS = [
  { id: "38tjn1OC1t0", title: "CivilEzy Overview"          },
  { id: "-xF_UOSZ-f4", title: "CivilEzy Student Experience" },
  { id: "mgDZhTjrVkU", title: "Course Walkthrough"          },
  { id: "aoCRr7ki3v4", title: "Success Stories"             },
  { id: "qIvQjVdvjWM", title: "CivilEzy Highlights"         },
] as const;

// ─── Stable CTA hover handlers ───────────────────────────────────────────────
const onPrimaryEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.transform = "translateY(-3px)";
  e.currentTarget.style.boxShadow = "0 12px 40px rgba(255,98,0,0.6)";
};
const onPrimaryLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.transform = "translateY(0)";
  e.currentTarget.style.boxShadow = "0 6px 30px rgba(255,98,0,0.5)";
};
const onSecondaryEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.borderColor = "#FF6200";
  e.currentTarget.style.background  = "rgba(255,98,0,0.1)";
};
const onSecondaryLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
  e.currentTarget.style.background  = "transparent";
};

// ─── Hero Component ──────────────────────────────────────────────────────────
export default function Hero() {
  return (
    <>
      <section
        aria-labelledby="hero-heading"
        style={{ minHeight: "100vh", padding: "40px 5% 60px", position: "relative", overflow: "hidden", display: "flex", alignItems: "center" }}
        className="hero-section-pad"
      >
        {/* Decorative backgrounds — clipped by section overflow:hidden */}
        <div aria-hidden="true" style={{ position:"absolute", inset:0, zIndex:0, background:"radial-gradient(ellipse at 70% 50%,rgba(255,98,0,0.12) 0%,transparent 60%),radial-gradient(ellipse at 20% 80%,rgba(255,184,0,0.06) 0%,transparent 50%),linear-gradient(180deg,#0B1E3D 0%,#0A1B35 100%)" }} />
        <div aria-hidden="true" style={{ position:"absolute", inset:0, opacity:0.04, backgroundImage:"linear-gradient(rgba(255,98,0,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,98,0,0.5) 1px,transparent 1px)", backgroundSize:"60px 60px" }} />

        <div className="hero-content-grid" style={{ position:"relative", zIndex:1, display:"grid", gap:"4rem", alignItems:"center", width:"100%", maxWidth:"1300px", margin:"0 auto" }}>

          {/* ═══ LEFT SIDE ═══ */}
          <div style={{ animation:"heroFadeUp 0.7s ease forwards" }}>
            {/* Live badge */}
            <div aria-hidden="true" style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"rgba(255,98,0,0.15)", border:"1px solid rgba(255,98,0,0.4)", borderRadius:"30px", padding:"6px 16px", marginBottom:"10px", fontSize:"13px", fontWeight:600, color:"#FF8534" }}>
              <span style={{ width:"8px", height:"8px", borderRadius:"50%", background:"#FF6200", flexShrink:0, animation:"pulseDot 2s infinite" }} />
              Kerala&apos;s #1 PSC Civil Platform
            </div>

            {/* Wincentre authority byline */}
            <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"22px" }}>
              <div style={{ width:"20px", height:"1px", background:"rgba(255,184,0,0.5)" }} />
              <p style={{ fontSize:"12px", fontWeight:600, color:"rgba(255,200,120,0.85)", letterSpacing:"0.6px", textTransform:"uppercase", margin:0 }}>
                Powered by Wincentre &nbsp;·&nbsp; Trusted Since 2008
              </p>
              <div style={{ width:"20px", height:"1px", background:"rgba(255,184,0,0.5)" }} />
            </div>

            {/* H1 */}
            <h1 id="hero-heading" style={{ fontFamily:"Rajdhani, sans-serif", lineHeight:1.1, marginBottom:"12px", fontWeight:700 }}>
              <span lang="ml" style={{ display:"block", fontSize:"clamp(28px,4vw,48px)", background:"linear-gradient(135deg,#FF6200,#FFB800)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                ആശയക്കുഴപ്പം മാറ്റൂ.
              </span>
              <span style={{ display:"block", color:"#ffffff", fontSize:"clamp(22px,3.5vw,40px)", marginTop:"4px" }}>
                Stop Guessing.<br />Start Ranking.
              </span>
            </h1>

            {/* Subtext */}
            <p style={{ fontSize:"17px", color:"rgba(255,255,255,0.85)", marginBottom:"28px", maxWidth:"480px", lineHeight:1.7 }}>
              The{" "}
              <strong style={{ color:"#FF8534", fontWeight:700 }}>only Kerala CIVIL ENGINEERING PSC platform</strong>{" "}
              with Category based content, Malayalam audio lessons, and a Game Arena that makes
              daily practice impossible to skip.
            </p>

            {/* Social proof */}
            <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"28px", flexWrap:"wrap" }}>
              <div
                style={{ display:"flex", alignItems:"center" }}
                role="img"
                aria-label="Profile pictures of students: Arjun Ravi, Meera Krishnan, Sreejith P., Anjali Nair"
              >
                {(["AR","MK","SP","AN"] as const).map((init, i) => (
                  <div key={init} aria-hidden="true" style={{ width:"32px", height:"32px", borderRadius:"50%", background:["rgba(255,98,0,0.3)","rgba(255,184,0,0.25)","rgba(100,200,255,0.2)","rgba(50,200,100,0.2)"][i], border:"2px solid #0B1E3D", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"10px", fontWeight:700, color:"#fff", marginLeft:i===0?0:"-10px", zIndex:4-i, position:"relative" }}>
                    {init}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize:"13px", fontWeight:700, color:"#fff", lineHeight:1.2 }}>5,200+ students preparing right now</div>
                <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.5)" }}>★★★★★ &nbsp;4.9 average rating</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="hero-ctas" style={{ display:"flex", gap:"14px", flexWrap:"wrap", marginBottom:"20px" }}>
              <a
                href={LMS_FREE_TEST}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Start Demo Course — opens in new tab"
                className="hero-cta-btn hero-cta-primary"
                style={{ background:"linear-gradient(135deg,#FF6200,#FF4500)", color:"white", border:"none", padding:"16px 32px", borderRadius:"50px", fontFamily:"Nunito, sans-serif", fontSize:"17px", fontWeight:800, cursor:"pointer", boxShadow:"0 6px 30px rgba(255,98,0,0.5)", transition:"transform 0.2s, box-shadow 0.2s", display:"inline-flex", alignItems:"center", gap:"8px", textDecoration:"none" }}
                onMouseEnter={onPrimaryEnter}
                onMouseLeave={onPrimaryLeave}
              >
                🚀 Start Demo Course
              </a>
              <a
                href={LIVE_SESSIONS[0].link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Join CivilWar Live Zoom session — opens in new tab"
                className="hero-cta-btn hero-cta-secondary"
                style={{ background:"transparent", color:"#ffffff", border:"2px solid rgba(255,255,255,0.3)", padding:"14px 28px", borderRadius:"50px", fontFamily:"Nunito, sans-serif", fontSize:"16px", fontWeight:600, cursor:"pointer", transition:"border-color 0.2s, background 0.2s", display:"inline-flex", alignItems:"center", gap:"8px", textDecoration:"none" }}
                onMouseEnter={onSecondaryEnter}
                onMouseLeave={onSecondaryLeave}
              >
                ⚔️ Join CivilWar Live
              </a>
            </div>

            {/* CTA microcopy */}
            <p style={{ fontSize:"12.5px", color:"rgba(255,255,255,0.58)", marginBottom:"24px", letterSpacing:"0.2px" }}>
              No registration &nbsp;·&nbsp; Free Demo &nbsp;·&nbsp; Real PSC Questions
            </p>

            {/* ── Live Learning Panel ── */}
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "16px",
                overflow: "hidden",
                marginBottom: "28px",
                backdropFilter: "blur(10px)",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 16px",
                  borderBottom: "1px solid rgba(255,255,255,0.07)",
                  background: "rgba(255,68,68,0.06)",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#FF4444",
                    flexShrink: 0,
                    animation: "pulseDot 2s infinite",
                  }}
                />
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 800,
                    color: "#FF8888",
                    letterSpacing: "0.8px",
                    textTransform: "uppercase" as const,
                    fontFamily: "Nunito, sans-serif",
                  }}
                >
                  🔴 LIVE TODAY
                </span>
              </div>

              {/* Session rows */}
              {LIVE_SESSIONS.map((session, idx) => (
                <div
                  key={session.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "14px 16px",
                    borderBottom: idx < LIVE_SESSIONS.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                  }}
                >
                  {/* Icon bubble */}
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "10px",
                      background: session.accentBg,
                      border: `1px solid ${session.accentBorder}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px",
                      flexShrink: 0,
                    }}
                  >
                    {session.icon}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "2px",
                        flexWrap: "wrap" as const,
                      }}
                    >
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "#fff",
                          fontFamily: "Nunito, sans-serif",
                          lineHeight: 1.3,
                        }}
                      >
                        {session.title}
                      </span>
                      <span
                        style={{
                          fontSize: "9px",
                          fontWeight: 800,
                          color: "#FF8888",
                          background: "rgba(255,68,68,0.15)",
                          border: "1px solid rgba(255,68,68,0.3)",
                          borderRadius: "20px",
                          padding: "2px 7px",
                          letterSpacing: "0.5px",
                          textTransform: "uppercase" as const,
                          fontFamily: "Nunito, sans-serif",
                          whiteSpace: "nowrap" as const,
                        }}
                      >
                        {session.badge}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: session.accentColor,
                        fontWeight: 600,
                        fontFamily: "Nunito, sans-serif",
                      }}
                    >
                      {session.time}
                    </div>
                  </div>

                  {/* Join button */}
                  <a
                    href={session.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flexShrink: 0,
                      background: session.accentBg,
                      border: `1px solid ${session.accentBorder}`,
                      borderRadius: "8px",
                      padding: "7px 13px",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: session.accentColor,
                      fontFamily: "Nunito, sans-serif",
                      textDecoration: "none",
                      whiteSpace: "nowrap" as const,
                      transition: "background 0.2s, border-color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = `${session.accentBg.replace("0.1", "0.22").replace("0.12", "0.22")}`;
                      e.currentTarget.style.borderColor = session.accentColor;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = session.accentBg;
                      e.currentTarget.style.borderColor = session.accentBorder;
                    }}
                  >
                    {session.btnLabel}
                  </a>
                </div>
              ))}
            </div>

            {/* Trust metrics row */}
            <div className="hero-trust-metrics" aria-label="Platform trust metrics" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"10px" }}>
              {TRUST_METRICS.map(({ icon, num, label, sub }) => (
                <div key={label} style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.09)", borderRadius:"12px", padding:"12px 8px", textAlign:"center" }}>
                  <div style={{ fontSize:"18px", lineHeight:1, marginBottom:"5px" }} aria-hidden="true">{icon}</div>
                  <div style={{ fontFamily:"Rajdhani, sans-serif", fontSize:"20px", fontWeight:700, background:"linear-gradient(135deg,#FF6200,#FFB800)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", lineHeight:1.1 }}>{num}</div>
                  <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.75)", marginTop:"3px", lineHeight:1.3, fontWeight:600 }}>{label}</div>
                  <div style={{ fontSize:"9px", color:"rgba(255,255,255,0.4)", marginTop:"2px", lineHeight:1.3 }}>{sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ═══ RIGHT SIDE — Premium Video Showcase ═══ */}
          <div style={{ position:"relative", animation:"heroFadeUp 0.7s 0.2s ease both" }}>
            <VideoShowcase />
          </div>
        </div>
      </section>

      <style>{`
        /* ── Hero CTA buttons — full width on very small screens ── */
        @media (max-width: 400px) {
          .hero-ctas { flex-direction: column !important; }
          .hero-cta-primary, .hero-cta-secondary {
            width: 100% !important;
            justify-content: center !important;
            font-size: 15px !important;
            padding: 14px 20px !important;
          }
        }
        /* ── Trust metrics — 2 col on small screens ── */
        @media (max-width: 520px) {
          .hero-trust-metrics {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        /* ── Video Showcase ── */
        .vs-thumb-strip::-webkit-scrollbar { display: none; }
        .vs-thumb-strip { -ms-overflow-style: none; scrollbar-width: none; }
        .vs-thumb-btn { transition: transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease; }
        .vs-thumb-btn:hover:not([aria-pressed="true"]) {
          transform: scale(1.06) !important;
          border-color: rgba(255,98,0,0.5) !important;
        }
        .vs-thumb-btn:focus-visible {
          outline: 2px solid #FF6200;
          outline-offset: 2px;
        }
        .vs-featured-fade-in  { animation: vsFadeIn  0.25s ease forwards; }
        .vs-featured-fade-out { animation: vsFadeOut 0.18s ease forwards; }
        @keyframes vsFadeIn  { from { opacity: 0; transform: scale(0.99); } to { opacity: 1; transform: scale(1); } }
        @keyframes vsFadeOut { from { opacity: 1; } to { opacity: 0; } }
        /* ── Mobile: thumbnails scroll horizontally ── */
        @media (max-width: 640px) {
          .vs-thumb-strip { gap: 8px !important; }
          .vs-thumb-btn   { min-width: 100px !important; width: 100px !important; }
        }
      `}</style>

      {/* ── SEO: Structured crawlable question content ──
          Hidden visually but present in HTML for search engine indexing.
          Uses semantic <article> markup with proper headings. */}
      <section aria-hidden="true" style={{ position:"absolute", width:"1px", height:"1px", overflow:"hidden", clip:"rect(0,0,0,0)", whiteSpace:"nowrap" }}>
        <h2>Kerala PSC Civil Engineering Sample Questions</h2>
        {HERO_DOMAINS.map(domain => (
          <article key={domain.id}>
            <h3>Kerala PSC {domain.label} Civil Engineering Questions</h3>
            <p>{domain.seoSubtitle}</p>
            <ol>
              {domain.questions.map((q, i) => (
                <li key={i}>
                  <p><strong>{q.question}</strong></p>
                  <ul>
                    {q.options.map((opt, j) => (
                      <li key={j}>{j === q.correct ? <strong>{opt} (Correct Answer)</strong> : opt}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </article>
        ))}
      </section>
    </>
  );
}

// ─── VideoShowcase ────────────────────────────────────────────────────────────
function VideoShowcase() {
  const [activeIdx, setActiveIdx]   = useState(0);
  const [fading,    setFading]      = useState(false);

  const selectVideo = useCallback((idx: number) => {
    if (idx === activeIdx) return;
    setFading(true);
    setTimeout(() => {
      setActiveIdx(idx);
      setFading(false);
    }, 180);
  }, [activeIdx]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") selectVideo(Math.min(activeIdx + 1, HERO_VIDEOS.length - 1));
    if (e.key === "ArrowLeft")  selectVideo(Math.max(activeIdx - 1, 0));
  };

  const active = HERO_VIDEOS[activeIdx];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"14px" }} onKeyDown={handleKeyDown}>

      {/* ── Meta row: badge + counter ── */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{
          display:"inline-flex", alignItems:"center", gap:"7px",
          background:"rgba(255,98,0,0.12)", border:"1px solid rgba(255,98,0,0.3)",
          borderRadius:"20px", padding:"5px 13px",
          fontSize:"11px", fontWeight:700, color:"#FF8534", letterSpacing:"0.3px",
        }}>
          <span aria-hidden="true" style={{ fontSize:"13px" }}>🎬</span>
          5 Featured Videos
        </div>
        <div style={{
          fontSize:"12px", fontWeight:700, color:"rgba(255,255,255,0.5)",
          fontFamily:"Rajdhani, sans-serif", letterSpacing:"1px",
        }}
          aria-live="polite" aria-atomic="true"
        >
          <span style={{ color:"#FF8534" }}>{activeIdx + 1}</span>
          <span style={{ color:"rgba(255,255,255,0.3)" }}> / {HERO_VIDEOS.length}</span>
        </div>
      </div>

      {/* ── Featured player ── */}
      <div
        role="region"
        aria-label={`Featured video: ${active.title}`}
        style={{
          borderRadius:"20px", overflow:"hidden",
          border:"1px solid rgba(255,98,0,0.28)",
          boxShadow:"0 24px 64px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,98,0,0.08)",
          background:"#080D1A",
          backdropFilter:"blur(20px)",
          position:"relative",
        }}
      >
        {/* 16:9 aspect-ratio wrapper */}
        <div style={{ position:"relative", paddingBottom:"56.25%", height:0 }}>
          <iframe
            key={active.id}
            src={`https://www.youtube.com/embed/${active.id}?rel=0&modestbranding=1`}
            title={active.title}
            className={fading ? "vs-featured-fade-out" : "vs-featured-fade-in"}
            style={{
              position:"absolute", top:0, left:0,
              width:"100%", height:"100%", border:"none",
            }}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />

          {/* Title overlay (bottom gradient) */}
          <div
            aria-hidden="true"
            style={{
              position:"absolute", bottom:0, left:0, right:0,
              background:"linear-gradient(to top, rgba(8,13,26,0.92) 0%, transparent 100%)",
              padding:"28px 16px 12px",
              pointerEvents:"none",
              transition:"opacity 0.2s",
              opacity: fading ? 0 : 1,
            }}
          >
            <span style={{
              fontSize:"13px", fontWeight:700, color:"#fff",
              fontFamily:"Nunito, sans-serif", letterSpacing:"0.2px",
            }}>
              {active.title}
            </span>
          </div>
        </div>
      </div>

      {/* ── Thumbnail strip ── */}
      <div
        role="listbox"
        aria-label="Video playlist"
        className="vs-thumb-strip"
        style={{
          display:"flex", gap:"10px",
          overflowX:"auto", scrollSnapType:"x mandatory",
          paddingBottom:"2px",
        }}
      >
        {HERO_VIDEOS.map((v, i) => {
          const isActive = i === activeIdx;
          return (
            <button
              key={v.id}
              role="option"
              aria-selected={isActive}
              aria-label={`Play ${v.title} (video ${i + 1} of ${HERO_VIDEOS.length})`}
              onClick={() => selectVideo(i)}
              className="vs-thumb-btn"
              style={{
                flexShrink:0,
                width:"calc(20% - 8px)",
                minWidth:"82px",
                scrollSnapAlign:"start",
                position:"relative",
                borderRadius:"10px",
                overflow:"hidden",
                border: isActive
                  ? "2px solid #FF6200"
                  : "2px solid rgba(255,255,255,0.09)",
                boxShadow: isActive
                  ? "0 0 0 3px rgba(255,98,0,0.22), 0 8px 24px rgba(0,0,0,0.5)"
                  : "0 4px 12px rgba(0,0,0,0.35)",
                transform: isActive ? "scale(1.06)" : "scale(1)",
                cursor:"pointer",
                padding:0,
                background:"#080D1A",
              }}
            >
              {/* YouTube thumbnail */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://img.youtube.com/vi/${v.id}/mqdefault.jpg`}
                alt={v.title}
                style={{ width:"100%", display:"block", aspectRatio:"16/9", objectFit:"cover" }}
                loading="lazy"
              />

              {/* Inactive overlay: darken slightly */}
              {!isActive && (
                <div aria-hidden="true" style={{
                  position:"absolute", inset:0,
                  background:"rgba(8,13,26,0.35)",
                  transition:"background 0.2s",
                }} />
              )}

              {/* Active overlay: orange tint + play icon */}
              {isActive && (
                <div aria-hidden="true" style={{
                  position:"absolute", inset:0,
                  background:"rgba(255,98,0,0.18)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}>
                  <div style={{
                    width:"22px", height:"22px", borderRadius:"50%",
                    background:"rgba(255,98,0,0.9)",
                    boxShadow:"0 2px 12px rgba(255,98,0,0.6)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:"9px", color:"#fff", paddingLeft:"2px",
                  }}>
                    ▶
                  </div>
                </div>
              )}

              {/* Number label */}
              <div aria-hidden="true" style={{
                position:"absolute", top:"5px", left:"6px",
                fontSize:"9px", fontWeight:800, color:"#fff",
                fontFamily:"Rajdhani, sans-serif",
                background:"rgba(0,0,0,0.55)",
                borderRadius:"4px", padding:"1px 5px",
                lineHeight:1.5, letterSpacing:"0.3px",
              }}>
                {i + 1}/{HERO_VIDEOS.length}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}


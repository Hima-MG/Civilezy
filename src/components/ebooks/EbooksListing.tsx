"use client";

import Image from "next/image";
import Link from "next/link";
import { EBOOKS, type EbookData } from "@/data/ebookData";

export default function EbooksListing() {
  return (
    <main style={{ background: "#040C18", minHeight: "100vh", paddingTop: "70px" }}>

      {/* ── Page Header ── */}
      <section
        style={{
          background: "linear-gradient(135deg, #091729 0%, #0B1E3D 50%, #0D2347 100%)",
          borderBottom: "1px solid rgba(245,158,11,0.2)",
          padding: "56px 5% 48px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: "rgba(245,158,11,0.12)",
            border: "1px solid rgba(245,158,11,0.3)",
            borderRadius: "20px",
            padding: "4px 18px",
            fontSize: "12px",
            fontWeight: 700,
            color: "#F59E0B",
            letterSpacing: "0.8px",
            marginBottom: "18px",
            fontFamily: "Nunito, sans-serif",
          }}
        >
          KERALA PSC CIVIL ENGINEERING
        </div>
        <h1
          style={{
            fontFamily: "Rajdhani, sans-serif",
            fontSize: "clamp(30px, 5vw, 52px)",
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.15,
            margin: "0 0 16px",
          }}
        >
          Quick Revision{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #F59E0B, #FCD34D)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            E-Books
          </span>
        </h1>
        <p
          style={{
            fontSize: "clamp(14px, 1.8vw, 17px)",
            color: "rgba(255,255,255,0.65)",
            maxWidth: "560px",
            margin: "0 auto",
            lineHeight: 1.7,
            fontFamily: "Nunito, sans-serif",
          }}
        >
          Concise, syllabus-based revision guides crafted for Kerala PSC Civil Engineering exams.
          Study smart, save time, score more.
        </p>
      </section>

      {/* ── Featured E-Book Banners ── */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "56px 5% 80px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
          {EBOOKS.map((ebook) => (
            <EbookFeaturedBanner key={ebook.slug} ebook={ebook} />
          ))}
          <ComingSoonCard />
        </div>
      </section>

      <style>{`
        /* ━━━ BANNER ANIMATIONS ━━━ */
        @keyframes ebDotPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.25; transform: scale(0.55); }
        }
        @keyframes ebFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        /* ━━━ FEATURED BANNER ━━━ */
        .eb-banner {
          position: relative; overflow: hidden;
          background: linear-gradient(135deg, #020817 0%, #04152d 48%, #071a35 100%);
          border: 1px solid rgba(245,158,11,0.18);
          border-top: 2px solid rgba(245,158,11,0.5);
          border-radius: 24px;
          min-height: 500px;
          cursor: pointer;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 8px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(245,158,11,0.05);
          display: block; text-decoration: none;
        }
        .eb-banner:hover {
          border-color: rgba(245,158,11,0.38);
          box-shadow: 0 20px 72px rgba(245,158,11,0.14), 0 8px 48px rgba(0,0,0,0.45);
        }
        .eb-banner:focus-visible {
          outline: 2px solid #F59E0B; outline-offset: 4px;
        }

        /* Background decorations */
        .eb-bg-grid {
          position: absolute; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(245,158,11,0.016) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,158,11,0.016) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .eb-bg-glow {
          position: absolute; inset: 0; pointer-events: none; z-index: 0;
          background: radial-gradient(ellipse at 78% 52%,
            rgba(245,158,11,0.11) 0%,
            rgba(245,158,11,0.045) 36%,
            rgba(59,130,246,0.02) 58%,
            transparent 70%);
        }

        /* CEO image */
        .eb-ceo-img {
          position: absolute;
          right: 0; top: 50%;
          transform: translateY(-50%);
          height: 115%; width: auto;
          max-width: none; display: block;
          z-index: 1; pointer-events: none;
        }

        /* Ground vignette — anchors character to banner floor */
        .eb-ground {
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 22%; z-index: 2; pointer-events: none;
          background: linear-gradient(to top, #020817 0%, rgba(2,8,23,0.5) 48%, transparent 100%);
        }

        /* Left-to-right fade — makes text readable while CEO stays visible */
        .eb-fade {
          position: absolute; inset: 0; z-index: 2; pointer-events: none;
          background: linear-gradient(
            to right,
            #020817 0%,
            rgba(2,8,23,0.96) 20%,
            rgba(2,8,23,0.78) 38%,
            rgba(2,8,23,0.36) 56%,
            rgba(2,8,23,0.08) 70%,
            transparent 82%
          );
        }

        /* Content area */
        .eb-content {
          position: relative; z-index: 3;
          padding: 52px 48px 52px 52px;
          max-width: 60%;
        }

        /* Badges */
        .eb-badges { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 18px; }
        .eb-badge-new {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(16,185,129,0.09); border: 1px solid rgba(16,185,129,0.24);
          border-radius: 30px; padding: 5px 14px;
          font-size: 10px; font-weight: 800; color: #34D399;
          font-family: Nunito, sans-serif; text-transform: uppercase; letter-spacing: 0.8px;
        }
        .eb-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #34D399; flex-shrink: 0;
          animation: ebDotPulse 1.5s ease-in-out infinite;
        }
        .eb-badge-exam {
          display: inline-block;
          background: rgba(245,158,11,0.09); border: 1px solid rgba(245,158,11,0.22);
          border-radius: 30px; padding: 5px 14px;
          font-size: 10px; font-weight: 700; color: #FCD34D;
          font-family: Nunito, sans-serif;
        }

        /* Exam strip */
        .eb-exam-strip {
          font-family: Nunito, sans-serif; font-size: 11px;
          font-weight: 700; color: rgba(245,158,11,0.7);
          letter-spacing: 0.5px; margin-bottom: 22px;
        }

        /* Big heading */
        .eb-heading { margin: 0 0 18px; line-height: 0.93; }
        .eb-heading-white {
          display: block; font-family: Rajdhani, sans-serif;
          font-size: clamp(44px, 5.5vw, 78px);
          font-weight: 800; color: #ffffff;
          text-transform: uppercase; letter-spacing: -2px;
        }
        .eb-heading-gold {
          display: block; font-family: Rajdhani, sans-serif;
          font-size: clamp(44px, 5.5vw, 78px);
          font-weight: 800; text-transform: uppercase; letter-spacing: -2px;
          background: linear-gradient(135deg, #F59E0B 0%, #FDE68A 50%, #F59E0B 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }

        /* Subtitle */
        .eb-subtitle {
          display: flex; align-items: center; gap: 12px;
          font-family: Nunito, sans-serif;
          font-size: clamp(14px, 1.6vw, 17px);
          font-weight: 700; color: rgba(255,255,255,0.85);
          margin: 0 0 26px;
        }
        .eb-subtitle-bar {
          width: 4px; height: 22px; border-radius: 4px; flex-shrink: 0;
          background: linear-gradient(180deg, #F59E0B, #FCD34D);
        }

        /* Highlights */
        .eb-highlights {
          list-style: none; margin: 0 0 22px; padding: 0;
          display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px;
        }
        .eb-highlight-item {
          font-family: Nunito, sans-serif; font-size: 13px;
          font-weight: 600; color: rgba(255,255,255,0.72);
          display: flex; align-items: center; gap: 9px;
        }
        .eb-check {
          width: 18px; height: 18px; border-radius: 50%; flex-shrink: 0;
          background: rgba(16,185,129,0.14); border: 1px solid rgba(16,185,129,0.28);
          display: flex; align-items: center; justify-content: center;
          font-size: 9px; color: #34D399; font-weight: 900;
        }

        /* Tagline */
        .eb-tagline {
          font-family: Nunito, sans-serif; font-size: 13px;
          font-style: italic; color: rgba(255,255,255,0.32);
          margin: 0 0 30px;
        }

        /* CTA row */
        .eb-cta-row { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 22px; }
        .eb-btn-know {
          display: inline-flex; align-items: center;
          background: linear-gradient(135deg, #F59E0B 0%, #FCD34D 100%);
          color: #0D0700; font-family: Nunito, sans-serif;
          font-size: 16px; font-weight: 800; letter-spacing: 0.2px;
          padding: 15px 38px; border-radius: 50px;
          text-decoration: none; white-space: nowrap;
          box-shadow: 0 6px 32px rgba(245,158,11,0.5);
          transition: transform 0.22s ease, box-shadow 0.22s ease;
        }
        .eb-btn-know:hover { transform: translateY(-3px); box-shadow: 0 14px 48px rgba(245,158,11,0.65); }
        .eb-btn-preview {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.055); border: 1px solid rgba(255,255,255,0.14);
          color: rgba(255,255,255,0.82); font-family: Nunito, sans-serif;
          font-size: 14px; font-weight: 700;
          padding: 15px 28px; border-radius: 50px;
          text-decoration: none; white-space: nowrap;
          transition: background 0.2s, border-color 0.2s;
        }
        .eb-btn-preview:hover { background: rgba(255,255,255,0.10); border-color: rgba(255,255,255,0.26); }

        /* Info row */
        .eb-info-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .eb-price {
          font-family: Rajdhani, sans-serif; font-size: 22px;
          font-weight: 800; color: #F59E0B;
        }
        .eb-info-sep {
          width: 3px; height: 3px; border-radius: 50%;
          background: rgba(255,255,255,0.18); flex-shrink: 0;
        }
        .eb-validity {
          font-family: Nunito, sans-serif; font-size: 12px;
          font-weight: 600; color: rgba(255,255,255,0.32);
        }

        /* ━━━ RESPONSIVE ━━━ */
        @media (max-width: 900px) {
          .eb-content { max-width: 68%; padding: 44px 40px 44px 44px; }
        }
        @media (max-width: 720px) {
          .eb-banner { min-height: 0; }
          .eb-content { max-width: 100%; padding: 40px 24px 320px; }
          .eb-ceo-img {
            top: auto; bottom: 0; right: 50%;
            transform: translateX(50%);
            height: 300px; width: auto;
          }
          .eb-fade {
            background: linear-gradient(to bottom,
              #020817 0%,
              rgba(2,8,23,0.88) 20%,
              rgba(2,8,23,0.32) 56%,
              transparent 100%
            );
          }
          .eb-ground { display: none; }
          .eb-highlights { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .eb-content { padding: 32px 20px 270px; }
          .eb-heading-white, .eb-heading-gold { font-size: 40px; letter-spacing: -1px; }
          .eb-ceo-img { height: 250px; }
          .eb-cta-row { flex-direction: column; }
          .eb-btn-know, .eb-btn-preview { justify-content: center; text-align: center; }
        }

        /* ━━━ COMING SOON CARD ━━━ */
        .eb-coming-soon {
          background: rgba(255,255,255,0.025);
          border: 1px dashed rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 52px 24px;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center; gap: 14px;
        }
      `}</style>
    </main>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   LARGE FEATURED BANNER COMPONENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function EbookFeaturedBanner({ ebook }: { ebook: EbookData }) {
  const highlights = [
    `${ebook.modules.length} Comprehensive Modules`,
    "20 Model Exams Included",
    "Diploma Civil Level",
    "Quick Revision Format",
    "Syllabus Based Content",
  ];

  return (
    <Link
      href={`/ebooks/${ebook.slug}`}
      className="eb-banner"
      aria-label={`${ebook.title} for ${ebook.subtitle} — Click to know more`}
    >
      {/* ── Background layers ── */}
      <div className="eb-bg-grid" aria-hidden="true" />
      <div className="eb-bg-glow" aria-hidden="true" />

      {/* ── CEO: cinematic character image ── */}
      <Image
        src="/ceo-banner.png"
        alt="Civilezy Expert"
        width={700}
        height={700}
        priority
        className="eb-ceo-img"
      />

      {/* ── Blend layers ── */}
      <div className="eb-ground" aria-hidden="true" />
      <div className="eb-fade" aria-hidden="true" />

      {/* ── Content ── */}
      <div className="eb-content">

        {/* Badges */}
        <div className="eb-badges">
          {ebook.isNew && (
            <span className="eb-badge-new">
              <span className="eb-dot" />
              🚀 NEW LAUNCH
            </span>
          )}
          {ebook.examBadge && (
            <span className="eb-badge-exam">{ebook.examBadge}</span>
          )}
        </div>

        {/* Exam strip */}
        <div className="eb-exam-strip">
          📅 EXAM ON&nbsp;<strong>JUNE 30</strong>&nbsp;·&nbsp;{ebook.subtitle.toUpperCase()}
        </div>

        {/* Main heading */}
        <h2 className="eb-heading">
          <span className="eb-heading-white">QUICK REVISION</span>
          <span className="eb-heading-gold">E-BOOK</span>
        </h2>

        {/* Subtitle */}
        <p className="eb-subtitle">
          <span className="eb-subtitle-bar" />
          For <strong style={{ color: "#fff" }}>&nbsp;{ebook.subtitle}</strong>
        </p>

        {/* Highlights grid */}
        <ul className="eb-highlights">
          {highlights.map((h) => (
            <li key={h} className="eb-highlight-item">
              <span className="eb-check">✓</span>
              {h}
            </li>
          ))}
        </ul>

        {/* Tagline */}
        <p className="eb-tagline">&ldquo;{ebook.tagline}&rdquo;</p>

        {/* CTAs — stopPropagation prevents double navigation */}
        <div
          className="eb-cta-row"
          onClick={(e) => e.preventDefault()}
        >
          <Link
            href={`/ebooks/${ebook.slug}`}
            className="eb-btn-know"
            onClick={(e) => e.stopPropagation()}
          >
            Know More →
          </Link>
          <a
            href={ebook.previewLink}
            target="_blank"
            rel="noopener noreferrer"
            className="eb-btn-preview"
            onClick={(e) => e.stopPropagation()}
          >
            👁 Free Preview
          </a>
        </div>

        {/* Price / validity */}
        <div className="eb-info-row">
          <span className="eb-price">💰 {ebook.priceDisplay}</span>
          <span className="eb-info-sep" />
          <span className="eb-validity">📆 {ebook.validity}</span>
        </div>

      </div>
    </Link>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   COMING SOON CARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ComingSoonCard() {
  return (
    <div className="eb-coming-soon">
      <div
        style={{
          width: "56px", height: "56px", borderRadius: "50%",
          background: "rgba(255,255,255,0.05)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "26px",
        }}
      >
        📖
      </div>
      <p
        style={{
          fontFamily: "Rajdhani, sans-serif",
          fontSize: "22px", fontWeight: 700,
          color: "rgba(255,255,255,0.3)", margin: 0,
        }}
      >
        More E-Books Coming Soon
      </p>
      <p
        style={{
          fontFamily: "Nunito, sans-serif",
          fontSize: "14px", color: "rgba(255,255,255,0.18)",
          margin: 0, maxWidth: "260px", lineHeight: 1.6,
        }}
      >
        ITI, B.Tech &amp; Surveyor level revision guides in the works
      </p>
    </div>
  );
}

"use client";

import { EBOOKS } from "@/data/ebookData";

const featured = EBOOKS[0];

const PREVIEW_LINK  = "https://learn.civilezy.in/student/courses/43387/watch?lesson_id=620443";
const PURCHASE_LINK = "https://learn.civilezy.in/checkout?product_id=6085&product_type=membership&price_id=285895";

const FEATURES = [
  "Syllabus Based",
  "Save Time, Study Smart",
  "Easy to Revise",
  "Perfect for Fast Preparation",
  "20 Model Exams",
];

export default function EbooksSection() {
  if (!featured) return null;

  return (
    <section
      style={{
        background: "linear-gradient(160deg, #020B17 0%, #071526 35%, #0C2040 70%, #091729 100%)",
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid rgba(245,158,11,0.1)",
        borderBottom: "1px solid rgba(245,158,11,0.1)",
      }}
    >
      {/* Blueprint grid overlay */}
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

      {/* ── HERO CONTENT ── */}
      <div className="ebh-wrap">

        {/* LEFT COLUMN */}
        <div className="ebh-left">

          {/* Exam date pill */}
          <div
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.28)",
              borderRadius: "8px", padding: "5px 14px",
              fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px",
              color: "#FCD34D", fontFamily: "Nunito, sans-serif", marginBottom: "18px",
            }}
          >
            📅 EXAM ON&nbsp;<strong>JUNE 30</strong>&nbsp;·&nbsp;OVERSEER GR.1 / INSTRUCTOR
          </div>

          {/* NEW LAUNCH badge */}
          <div
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.28)",
              borderRadius: "20px", padding: "4px 14px",
              fontSize: "11px", fontWeight: 800, letterSpacing: "1px",
              color: "#34D399", fontFamily: "Nunito, sans-serif", marginBottom: "24px",
            }}
          >
            <span className="ebh-pulse" />
            🚀 NEW LAUNCH
          </div>

          {/* Main heading */}
          <h2 className="ebh-title">
            Quick Revision
            <br />
            <span className="ebh-title-gold">E-Book</span>
          </h2>

          {/* Subtitle with left accent bar */}
          <div
            style={{
              display: "inline-block",
              borderLeft: "3px solid #F59E0B",
              paddingLeft: "14px",
              fontFamily: "Nunito, sans-serif",
              fontSize: "clamp(14px, 1.8vw, 18px)",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "0.3px",
              marginBottom: "14px",
              lineHeight: 1.4,
            }}
          >
            For Overseer GR.1 / Instructor
          </div>

          {/* Level */}
          <div
            style={{
              fontFamily: "Nunito, sans-serif", fontSize: "13px",
              color: "rgba(255,255,255,0.45)", marginBottom: "18px",
              display: "flex", alignItems: "center", gap: "6px",
            }}
          >
            🎓 Diploma Civil Level
          </div>

          {/* Tagline */}
          <p
            style={{
              fontFamily: "Nunito, sans-serif", fontSize: "14px",
              color: "rgba(255,255,255,0.4)", fontStyle: "italic",
              marginBottom: "28px",
            }}
          >
            &ldquo;Smart Revision Today, Success Tomorrow!&rdquo;
          </p>

          {/* Feature pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {FEATURES.map((f) => (
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
        </div>

        {/* RIGHT COLUMN */}
        <div className="ebh-right">
          {/* Glow beneath image */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute", bottom: 0, left: "50%",
              transform: "translateX(-50%)",
              width: "85%", height: "75%",
              background: "radial-gradient(ellipse, rgba(245,158,11,0.18) 0%, transparent 70%)",
              borderRadius: "50%",
            }}
          />

          {/* CEO image — place file at /public/ceo-banner.png */}
          <img
            src="/ceo-banner.png"
            alt="CivilEzy Founder"
            className="ebh-ceo-img"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />

          {/* Floating ebook mockup */}
          <div className="ebh-book">
            <div
              style={{
                position: "absolute", top: 0, left: 0, right: 0,
                height: "3px",
                background: "linear-gradient(90deg, #F59E0B, #FCD34D)",
              }}
            />
            <div
              style={{
                fontSize: "8px", fontWeight: 800, letterSpacing: "2px",
                color: "#F59E0B", fontFamily: "Nunito, sans-serif", marginBottom: "8px",
              }}
            >
              CIVILEZY
            </div>
            <div
              style={{
                fontFamily: "Rajdhani, sans-serif", fontSize: "15px",
                fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: "6px",
              }}
            >
              Quick Revision<br />E-Book
            </div>
            <div
              style={{
                fontFamily: "Nunito, sans-serif", fontSize: "10px",
                color: "rgba(255,255,255,0.5)", lineHeight: 1.4,
              }}
            >
              For Overseer GR.1<br />/ Instructor
            </div>
          </div>

          {/* SYLLABUS BASED circular badge */}
          <div className="ebh-syllabus-badge">
            <div
              style={{
                fontFamily: "Nunito, sans-serif", fontSize: "8px",
                fontWeight: 800, color: "#F59E0B", letterSpacing: "0.5px", lineHeight: 1.5,
                textAlign: "center",
              }}
            >
              SYLLABUS<br />BASED
            </div>
            <div style={{ color: "#34D399", fontSize: "13px", fontWeight: 700 }}>✓</div>
          </div>
        </div>
      </div>

      {/* ── CTA BAR ── */}
      <div className="ebh-cta-bar">
        <a
          href={PREVIEW_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="ebh-btn-preview"
        >
          <span style={{ fontSize: "18px" }}>👁</span>
          <span>
            <span className="ebh-btn-main-text">View Free Preview</span>
            <span className="ebh-btn-sub-text">Try before you buy!</span>
          </span>
        </a>

        <div className="ebh-cta-sep" />

        <div className="ebh-cta-info">
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
            ₹2000{" "}
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

        <div className="ebh-cta-sep" />

        <div className="ebh-cta-info">
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

        <div className="ebh-cta-sep" />

        <a
          href={PURCHASE_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="ebh-btn-purchase"
        >
          <span style={{ fontSize: "18px" }}>🛒</span>
          <span>
            <span className="ebh-btn-main-text">Purchase E-Book</span>
            <span className="ebh-btn-sub-text">Get instant access now!</span>
          </span>
        </a>
      </div>

      {/* ── TRUST BAR ── */}
      <div className="ebh-trust-bar">
        <span className="ebh-trust-item">🛡 Trusted by Civil Engineering PSC Aspirants</span>
        <span className="ebh-trust-sep" />
        <span className="ebh-trust-item">🏆 Designed for Fast Revision and Maximum Results</span>
        <span className="ebh-trust-sep" />
        <span className="ebh-trust-item">
          <a
            href="https://wa.me/919072345630"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#34D399", textDecoration: "none", fontWeight: 700 }}
          >
            💬 WhatsApp Support: 9072345630
          </a>
        </span>
      </div>

      <style>{`
        @keyframes ebhPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(0.7); }
        }
        @keyframes ebhFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .ebh-pulse {
          display: inline-block;
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #34D399;
          animation: ebhPulse 1.4s ease-in-out infinite;
          flex-shrink: 0;
        }

        /* Hero grid */
        .ebh-wrap {
          max-width: 1200px;
          margin: 0 auto;
          padding: 72px 5% 0;
          display: grid;
          grid-template-columns: 1fr 460px;
          gap: 40px;
          align-items: center;
          position: relative;
          z-index: 1;
        }
        .ebh-left {
          padding: 24px 0 60px;
        }
        .ebh-title {
          font-family: Rajdhani, sans-serif;
          font-size: clamp(42px, 5.5vw, 70px);
          font-weight: 700;
          color: #ffffff;
          line-height: 1.02;
          margin: 0 0 18px;
          text-transform: uppercase;
          letter-spacing: -0.5px;
        }
        .ebh-title-gold {
          background: linear-gradient(135deg, #F59E0B, #FCD34D);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Right column */
        .ebh-right {
          position: relative;
          height: 500px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }
        .ebh-ceo-img {
          height: 100%;
          width: auto;
          max-width: 100%;
          object-fit: contain;
          object-position: bottom;
          position: relative;
          z-index: 2;
          filter: drop-shadow(0 0 50px rgba(245,158,11,0.12));
        }

        /* Floating book mockup */
        .ebh-book {
          position: absolute;
          right: -10px;
          bottom: 80px;
          width: 130px;
          background: linear-gradient(145deg, #0B1E3D, #162F5A);
          border: 1px solid rgba(245,158,11,0.45);
          border-radius: 10px;
          padding: 16px 14px;
          overflow: hidden;
          z-index: 3;
          box-shadow: 0 20px 50px rgba(0,0,0,0.55), 0 0 0 1px rgba(245,158,11,0.08);
          animation: ebhFloat 3.2s ease-in-out infinite;
        }

        /* Syllabus badge */
        .ebh-syllabus-badge {
          position: absolute;
          top: 24px;
          right: 16px;
          width: 70px; height: 70px;
          border-radius: 50%;
          background: rgba(10,25,55,0.92);
          border: 2px dashed rgba(245,158,11,0.5);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 4;
          gap: 2px;
          backdrop-filter: blur(4px);
        }

        /* CTA bar */
        .ebh-cta-bar {
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
        .ebh-cta-sep {
          width: 1px;
          height: 52px;
          background: rgba(255,255,255,0.1);
          flex-shrink: 0;
        }
        .ebh-cta-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          padding: 0 16px;
        }
        .ebh-btn-preview {
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
        .ebh-btn-preview:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(255,255,255,0.22);
        }
        .ebh-btn-purchase {
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
        .ebh-btn-purchase:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(245,158,11,0.55);
        }
        .ebh-btn-main-text {
          display: block;
          font-family: Nunito, sans-serif;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.2px;
        }
        .ebh-btn-sub-text {
          display: block;
          font-family: Nunito, sans-serif;
          font-size: 11px;
          font-weight: 600;
          opacity: 0.72;
        }

        /* Trust bar */
        .ebh-trust-bar {
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
        .ebh-trust-item {
          font-family: Nunito, sans-serif;
          font-size: 11px;
          font-weight: 600;
          color: rgba(255,255,255,0.35);
          letter-spacing: 0.3px;
          text-align: center;
        }
        .ebh-trust-sep {
          width: 1px;
          height: 16px;
          background: rgba(255,255,255,0.1);
          flex-shrink: 0;
        }

        /* Responsive */
        @media (max-width: 920px) {
          .ebh-wrap {
            grid-template-columns: 1fr;
            padding: 56px 5% 0;
            gap: 0;
          }
          .ebh-right {
            height: 340px;
            order: -1;
          }
          .ebh-left {
            padding: 0 0 40px;
          }
          .ebh-book { right: 8px; bottom: 36px; width: 110px; }
          .ebh-cta-sep { display: none; }
          .ebh-cta-bar { gap: 20px; }
          .ebh-cta-info { padding: 0 8px; }
        }
        @media (max-width: 600px) {
          .ebh-right { height: 260px; }
          .ebh-title { font-size: 40px; }
          .ebh-book { width: 96px; right: 0; bottom: 28px; }
          .ebh-syllabus-badge { width: 58px; height: 58px; top: 8px; right: 4px; }
          .ebh-trust-sep { display: none; }
          .ebh-trust-bar { gap: 14px; }
          .ebh-cta-bar { gap: 16px; }
          .ebh-btn-preview, .ebh-btn-purchase { padding: 11px 18px; }
        }
      `}</style>
    </section>
  );
}

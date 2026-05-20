"use client";

import Link from "next/link";
import { EBOOKS } from "@/data/ebookData";

const featured = EBOOKS[0];

export default function EbooksSection() {
  if (!featured) return null;

  return (
    <section
      style={{
        background: "linear-gradient(135deg, #0D1F0A 0%, #091729 50%, #0B1E3D 100%)",
        borderTop: "1px solid rgba(245,158,11,0.15)",
        borderBottom: "1px solid rgba(245,158,11,0.15)",
        padding: "72px 5%",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Section header */}
        <div style={{ textAlign: "center", marginBottom: "44px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(245,158,11,0.12)",
              border: "1px solid rgba(245,158,11,0.3)",
              borderRadius: "20px",
              padding: "4px 16px",
              fontSize: "11px",
              fontWeight: 800,
              color: "#F59E0B",
              letterSpacing: "1px",
              marginBottom: "18px",
              fontFamily: "Nunito, sans-serif",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#34D399",
                animation: "pulse-dot 1.5s ease-in-out infinite",
              }}
            />
            NEW LAUNCH
          </div>
          <h2
            style={{
              fontFamily: "Rajdhani, sans-serif",
              fontSize: "clamp(28px,4vw,44px)",
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.15,
              margin: "0 0 14px",
            }}
          >
            Kerala PSC Quick Revision{" "}
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
          </h2>
          <p
            style={{
              fontFamily: "Nunito, sans-serif",
              fontSize: "clamp(14px,1.8vw,17px)",
              color: "rgba(255,255,255,0.65)",
              maxWidth: "580px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Concise, syllabus-aligned revision guides for Kerala PSC Civil Engineering exams.
            Free preview available — try before you buy.
          </p>
        </div>

        {/* Featured card */}
        <div className="ebook-feature-card">
          {/* Left: Cover */}
          <div className="ebook-cover-col">
            <div
              style={{
                background: "linear-gradient(145deg, #0B1E3D, #1A2F5A)",
                border: "2px solid rgba(245,158,11,0.35)",
                borderRadius: "16px",
                padding: "28px 22px",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
              }}
            >
              {/* Gold top bar */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: 0, left: 0, right: 0,
                  height: "4px",
                  background: "linear-gradient(90deg, #F59E0B, #FCD34D, #F59E0B)",
                }}
              />
              {/* Glow */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: "-30px", right: "-30px",
                  width: "120px", height: "120px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)",
                }}
              />
              <div
                style={{
                  fontSize: "9px",
                  fontWeight: 800,
                  color: "#F59E0B",
                  letterSpacing: "2px",
                  fontFamily: "Nunito, sans-serif",
                  marginBottom: "14px",
                }}
              >
                CIVILEZY E-BOOK
              </div>
              <div
                style={{
                  fontFamily: "Rajdhani, sans-serif",
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "#ffffff",
                  lineHeight: 1.2,
                  marginBottom: "6px",
                }}
              >
                {featured.title}
              </div>
              <div
                style={{
                  fontFamily: "Nunito, sans-serif",
                  fontSize: "13px",
                  color: "#F59E0B",
                  fontWeight: 700,
                  marginBottom: "20px",
                }}
              >
                For {featured.subtitle}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {featured.modules.slice(0, 6).map((mod) => (
                  <div
                    key={mod}
                    style={{
                      fontSize: "11px",
                      color: "rgba(255,255,255,0.45)",
                      fontFamily: "Nunito, sans-serif",
                      borderBottom: "1px solid rgba(245,158,11,0.12)",
                      paddingBottom: "6px",
                    }}
                  >
                    {mod}
                  </div>
                ))}
                <div
                  style={{
                    fontSize: "11px",
                    color: "rgba(245,158,11,0.5)",
                    fontFamily: "Nunito, sans-serif",
                    fontStyle: "italic",
                  }}
                >
                  + {featured.modules.length - 6} more modules…
                </div>
              </div>
            </div>
          </div>

          {/* Right: Info */}
          <div className="ebook-info-col">
            {/* Badges */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
              {featured.isNew && (
                <span
                  style={{
                    background: "rgba(16,185,129,0.15)",
                    border: "1px solid rgba(16,185,129,0.35)",
                    color: "#34D399",
                    fontSize: "10px",
                    fontWeight: 800,
                    padding: "3px 12px",
                    borderRadius: "20px",
                    fontFamily: "Nunito, sans-serif",
                  }}
                >
                  NEW
                </span>
              )}
              {featured.examBadge && (
                <span
                  style={{
                    background: "rgba(245,158,11,0.12)",
                    border: "1px solid rgba(245,158,11,0.3)",
                    color: "#FCD34D",
                    fontSize: "10px",
                    fontWeight: 700,
                    padding: "3px 12px",
                    borderRadius: "20px",
                    fontFamily: "Nunito, sans-serif",
                  }}
                >
                  {featured.examBadge}
                </span>
              )}
            </div>

            <h3
              style={{
                fontFamily: "Rajdhani, sans-serif",
                fontSize: "clamp(24px,3vw,36px)",
                fontWeight: 700,
                color: "#ffffff",
                lineHeight: 1.1,
                margin: "0 0 6px",
              }}
            >
              {featured.title}
            </h3>
            <p
              style={{
                fontFamily: "Nunito, sans-serif",
                fontSize: "16px",
                color: "#F59E0B",
                fontWeight: 700,
                margin: "0 0 6px",
              }}
            >
              For {featured.subtitle}
            </p>
            <p
              style={{
                fontFamily: "Nunito, sans-serif",
                fontSize: "13px",
                color: "rgba(255,255,255,0.45)",
                margin: "0 0 20px",
                fontStyle: "italic",
              }}
            >
              &ldquo;{featured.tagline}&rdquo;
            </p>

            {/* Feature list */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
                marginBottom: "24px",
              }}
            >
              {featured.features.map((feat) => (
                <div
                  key={feat}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontFamily: "Nunito, sans-serif",
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.75)",
                  }}
                >
                  <span
                    style={{
                      color: "#34D399",
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    ✓
                  </span>
                  {feat}
                </div>
              ))}
            </div>

            {/* Price + validity */}
            <div style={{ marginBottom: "22px" }}>
              <span
                style={{
                  fontFamily: "Rajdhani, sans-serif",
                  fontSize: "36px",
                  fontWeight: 700,
                  color: "#F59E0B",
                }}
              >
                {featured.priceDisplay}
              </span>
              <span
                style={{
                  fontFamily: "Nunito, sans-serif",
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.35)",
                  marginLeft: "10px",
                }}
              >
                {featured.validity}
              </span>
            </div>

            {/* CTAs */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              <a
                href={featured.previewLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "linear-gradient(135deg, #F59E0B, #D97706)",
                  color: "#1A0F00",
                  fontFamily: "Nunito, sans-serif",
                  fontSize: "14px",
                  fontWeight: 800,
                  padding: "12px 26px",
                  borderRadius: "50px",
                  textDecoration: "none",
                  boxShadow: "0 4px 18px rgba(245,158,11,0.35)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 28px rgba(245,158,11,0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 18px rgba(245,158,11,0.35)";
                }}
              >
                👁 View Free Preview
              </a>
              <a
                href={featured.purchaseLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "linear-gradient(135deg, #FF6200, #FF8534)",
                  color: "#ffffff",
                  fontFamily: "Nunito, sans-serif",
                  fontSize: "14px",
                  fontWeight: 700,
                  padding: "12px 26px",
                  borderRadius: "50px",
                  textDecoration: "none",
                  boxShadow: "0 4px 18px rgba(255,98,0,0.3)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 28px rgba(255,98,0,0.45)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 18px rgba(255,98,0,0.3)";
                }}
              >
                Purchase E-Book →
              </a>
              <Link
                href={`/ebooks/${featured.slug}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  border: "1px solid rgba(255,255,255,0.18)",
                  color: "rgba(255,255,255,0.65)",
                  fontFamily: "Nunito, sans-serif",
                  fontSize: "14px",
                  fontWeight: 600,
                  padding: "12px 22px",
                  borderRadius: "50px",
                  textDecoration: "none",
                  transition: "border-color 0.2s, color 0.2s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(245,158,11,0.4)";
                  e.currentTarget.style.color = "#F59E0B";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.65)";
                }}
              >
                View Full Details
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        .ebook-feature-card {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 48px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(245,158,11,0.18);
          border-radius: 24px;
          padding: 36px;
          align-items: center;
        }
        .ebook-cover-col {}
        .ebook-info-col {}
        @media (max-width: 820px) {
          .ebook-feature-card {
            grid-template-columns: 1fr;
            gap: 28px;
            padding: 24px;
          }
        }
      `}</style>
    </section>
  );
}

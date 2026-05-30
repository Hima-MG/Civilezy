"use client";

import { useState } from "react";
import Image from "next/image";
import { EXTERNAL_URLS } from "@/lib/constants";

// ─── Founder Photo ────────────────────────────────────────────────────────────
function FounderPhoto() {
  const [errored, setErrored] = useState(false);

  if (!errored) {
    return (
      <Image
        src="/mentor/SANTHOSH C B.jpeg"
        alt="Santhosh C B — Founder & CEO, Wincentre & CivilEzy"
        fill
        sizes="(max-width: 680px) 100vw, (max-width: 960px) 380px, 480px"
        style={{ objectFit: "cover", objectPosition: "center top" }}
        onError={() => setErrored(true)}
        priority
      />
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(ellipse at 40% 30%, rgba(255,98,0,0.18) 0%, rgba(11,30,61,0.85) 65%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          fontSize: "96px",
          fontWeight: 800,
          color: "rgba(255,255,255,0.1)",
          fontFamily: "Rajdhani, sans-serif",
          userSelect: "none",
          letterSpacing: "-4px",
        }}
      >
        SCB
      </span>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function FounderSection() {
  return (
    <section
      aria-labelledby="founder-heading"
      style={{
        padding: "100px 5%",
        background: "linear-gradient(180deg, #0B1E3D 0%, #091729 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glows */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          background:
            "radial-gradient(ellipse at 80% 20%, rgba(255,184,0,0.04) 0%, transparent 50%)," +
            "radial-gradient(ellipse at 15% 70%, rgba(255,98,0,0.07) 0%, transparent 45%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1100px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "480px 1fr",
          gap: "72px",
          alignItems: "center",
        }}
        className="founder-grid"
      >
        {/* ── LEFT: Photo ── */}
        <div className="founder-photo-col" style={{ position: "relative" }}>
          {/* Photo container */}
          <div
            className="founder-photo-wrap"
            style={{
              position: "relative",
              borderRadius: "24px",
              overflow: "hidden",
              aspectRatio: "4/5",
              background: "rgba(11,30,61,0.6)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow:
                "0 40px 100px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,98,0,0.08)",
            }}
          >
            <FounderPhoto />

            {/* Bottom gradient fade */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "35%",
                background:
                  "linear-gradient(to top, rgba(9,23,41,0.92) 0%, transparent 100%)",
                zIndex: 2,
              }}
            />

            {/* Name overlay pinned bottom */}
            <div
              style={{
                position: "absolute",
                bottom: "24px",
                left: "24px",
                right: "24px",
                zIndex: 3,
              }}
            >
              <div
                style={{
                  fontFamily: "Rajdhani, sans-serif",
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "#fff",
                  lineHeight: 1.1,
                  marginBottom: "4px",
                }}
              >
                Santhosh C B
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#FF8534",
                  fontWeight: 600,
                  fontFamily: "Nunito, sans-serif",
                  letterSpacing: "0.3px",
                }}
              >
                Founder &amp; CEO · Wincentre &amp; CivilEzy
              </div>
            </div>
          </div>

          {/* Decorative orange accent bar */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "32px",
              left: "-12px",
              width: "4px",
              height: "80px",
              background: "linear-gradient(180deg, #FF6200, transparent)",
              borderRadius: "4px",
            }}
          />
        </div>

        {/* ── RIGHT: Content ── */}
        <div
          className="founder-content-col"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0",
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255,98,0,0.1)",
              border: "1px solid rgba(255,98,0,0.28)",
              borderRadius: "30px",
              padding: "5px 16px",
              marginBottom: "20px",
              fontSize: "11px",
              fontWeight: 700,
              color: "#FF8534",
              letterSpacing: "0.7px",
              textTransform: "uppercase" as const,
              fontFamily: "Nunito, sans-serif",
              alignSelf: "flex-start",
            }}
          >
            <span
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: "#FF6200",
                flexShrink: 0,
              }}
            />
            Meet The Founder
          </div>

          {/* Heading */}
          <h2
            id="founder-heading"
            style={{
              fontFamily: "Rajdhani, sans-serif",
              fontSize: "clamp(32px,4.2vw,52px)",
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.08,
              marginBottom: "6px",
            }}
          >
            Santhosh C B
          </h2>

          {/* Role */}
          <p
            style={{
              fontSize: "15px",
              color: "#FF8534",
              fontWeight: 600,
              fontFamily: "Nunito, sans-serif",
              letterSpacing: "0.3px",
              marginBottom: "28px",
            }}
          >
            Founder &amp; CEO — Wincentre &amp; CivilEzy
          </p>

          {/* Divider */}
          <div
            style={{
              height: "1px",
              background:
                "linear-gradient(90deg, rgba(255,98,0,0.45), transparent)",
              marginBottom: "28px",
            }}
          />

          {/* Description */}
          <p
            style={{
              fontSize: "15px",
              color: "rgba(255,255,255,0.68)",
              lineHeight: 1.8,
              fontFamily: "Nunito, sans-serif",
              marginBottom: "20px",
            }}
          >
            Santhosh C B has been guiding Civil Engineering aspirants since 2008
            through his institution, Wincentre — Kerala&apos;s trusted name in
            PSC Civil Engineering coaching. Over the years he has mentored
            thousands of students across ITI, Diploma, B.Tech, and Surveyor
            levels, helping them clear competitive exams and secure government
            careers.
          </p>
          <p
            style={{
              fontSize: "15px",
              color: "rgba(255,255,255,0.68)",
              lineHeight: 1.8,
              fontFamily: "Nunito, sans-serif",
              marginBottom: "32px",
            }}
          >
            As a Civil Engineering educator and career mentor, he founded
            CivilEzy to bring the same classroom excellence into a digital
            platform — making quality coaching accessible to every aspirant
            across Kerala, regardless of location.
          </p>

          {/* Quote card */}
          <blockquote
            style={{
              margin: "0 0 36px",
              padding: "24px 28px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,98,0,0.2)",
              borderLeft: "3px solid #FF6200",
              borderRadius: "0 16px 16px 0",
              backdropFilter: "blur(10px)",
            }}
          >
            <p
              style={{
                fontSize: "15px",
                color: "rgba(255,255,255,0.82)",
                lineHeight: 1.75,
                fontFamily: "Nunito, sans-serif",
                fontStyle: "italic",
                margin: 0,
              }}
            >
              &ldquo;I&apos;ve seen how the right support changes a student&apos;s
              life. CivilEzy is my way of making that support available to every
              aspirant — digitally, affordably, and at their own pace.&rdquo;
            </p>
            <footer
              style={{
                marginTop: "12px",
                fontSize: "12px",
                fontWeight: 700,
                color: "#FF8534",
                fontFamily: "Nunito, sans-serif",
                letterSpacing: "0.4px",
              }}
            >
              — Santhosh C B, Founder
            </footer>
          </blockquote>

          {/* CTAs */}
          <div
            style={{
              display: "flex",
              gap: "14px",
              flexWrap: "wrap" as const,
            }}
            className="founder-cta-row"
          >
            {/* Read Full Story */}
            <a
              href={EXTERNAL_URLS.about}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "linear-gradient(135deg, #FF6200, #FF4500)",
                border: "none",
                borderRadius: "12px",
                padding: "13px 26px",
                fontSize: "14px",
                fontWeight: 700,
                color: "#fff",
                fontFamily: "Nunito, sans-serif",
                textDecoration: "none",
                letterSpacing: "0.2px",
                boxShadow: "0 6px 24px rgba(255,98,0,0.35)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 10px 32px rgba(255,98,0,0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 6px 24px rgba(255,98,0,0.35)";
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M1 7h12M7 1l6 6-6 6"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Read Full Story
            </a>

            {/* Watch Mentor Message */}
            <a
              href={EXTERNAL_URLS.see}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.14)",
                borderRadius: "12px",
                padding: "13px 22px",
                fontSize: "14px",
                fontWeight: 700,
                color: "#fff",
                fontFamily: "Nunito, sans-serif",
                textDecoration: "none",
                transition: "background 0.2s, border-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,98,0,0.1)";
                e.currentTarget.style.borderColor = "rgba(255,98,0,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
              }}
            >
              {/* Play icon */}
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#FF6200,#FF4500)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "0 3px 12px rgba(255,98,0,0.4)",
                }}
              >
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 14 14"
                  fill="white"
                  style={{ marginLeft: "2px" }}
                  aria-hidden="true"
                >
                  <polygon points="2,1 13,7 2,13" />
                </svg>
              </div>
              Watch Mentor Message
            </a>
          </div>
        </div>
      </div>

      <style>{`
        /* ── Tablet ── */
        @media (max-width: 960px) {
          .founder-grid {
            grid-template-columns: 340px 1fr !important;
            gap: 48px !important;
          }
        }

        /* ── Mobile ── */
        @media (max-width: 680px) {
          .founder-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .founder-photo-wrap {
            aspect-ratio: 3/4 !important;
            max-width: 320px;
            margin: 0 auto;
          }
          .founder-cta-row {
            flex-direction: column !important;
          }
          .founder-cta-row a {
            justify-content: center !important;
          }
        }
      `}</style>
    </section>
  );
}

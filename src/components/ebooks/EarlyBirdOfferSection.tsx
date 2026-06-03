"use client";

import { useState } from "react";
import type { Ebook } from "@/types/ebook";

interface Props {
  offerEbooks: Ebook[];
}

export default function EarlyBirdOfferSection({ offerEbooks }: Props) {
  if (offerEbooks.length === 0) return null;

  // Sort: featuredOffer first
  const sorted = [...offerEbooks].sort((a, b) =>
    (b.featuredOffer ? 1 : 0) - (a.featuredOffer ? 1 : 0)
  );

  return (
    <section style={{ marginBottom: "64px" }}>
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 24px rgba(255,98,0,0.3), 0 8px 40px rgba(0,0,0,0.4); }
          50% { box-shadow: 0 0 40px rgba(255,98,0,0.5), 0 8px 40px rgba(0,0,0,0.4); }
        }
        .offer-banner { animation: pulse-glow 3s ease-in-out infinite; }
        .offer-card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        @media (max-width: 600px) {
          .offer-card-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ── Banner ── */}
      <div
        className="offer-banner"
        style={{
          background: "linear-gradient(135deg, rgba(255,98,0,0.18) 0%, rgba(255,133,52,0.1) 50%, rgba(255,98,0,0.15) 100%)",
          border: "1px solid rgba(255,98,0,0.4)",
          borderRadius: "20px",
          padding: "32px 28px",
          marginBottom: "28px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Background decoration */}
        <div style={{
          position: "absolute", top: "-40px", right: "-40px",
          width: "200px", height: "200px",
          background: "radial-gradient(circle, rgba(255,98,0,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "-40px", left: "-40px",
          width: "180px", height: "180px",
          background: "radial-gradient(circle, rgba(255,133,52,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          background: "rgba(255,98,0,0.2)",
          border: "1px solid rgba(255,98,0,0.4)",
          borderRadius: "20px", padding: "5px 16px",
          marginBottom: "14px",
        }}>
          <span style={{ fontSize: "13px" }}>🔥</span>
          <span style={{
            fontSize: "11px", fontWeight: 700, color: "#FF8534",
            fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}>
            Limited Time
          </span>
        </div>

        <h2 style={{
          fontFamily: "Rajdhani, sans-serif",
          fontSize: "clamp(26px, 4vw, 40px)",
          fontWeight: 700, color: "#fff",
          margin: "0 0 10px", lineHeight: 1.1,
        }}>
          🔥 Early Bird Offer –{" "}
          <span style={{
            background: "linear-gradient(135deg, #FF6200, #FF8534)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            50% OFF
          </span>
        </h2>

        <p style={{
          fontSize: "16px",
          color: "rgba(255,255,255,0.7)",
          margin: "0 0 6px",
        }}>
          Get Kerala PSC Civil Engineering E-Books at half price.
        </p>
        <p style={{
          fontSize: "14px",
          color: "rgba(255,133,52,0.85)",
          margin: 0, fontWeight: 600,
        }}>
          Limited offer for the first 100 students.
        </p>

        {/* Trust badges */}
        <div style={{
          display: "flex", flexWrap: "wrap",
          justifyContent: "center", gap: "10px",
          marginTop: "20px",
        }}>
          {[
            { icon: "⚡", label: "Instant Access" },
            { icon: "📅", label: "1 Year Access" },
            { icon: "🎯", label: "Limited Offer" },
          ].map(({ icon, label }) => (
            <span key={label} style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "5px 14px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "20px",
              fontSize: "12px", fontWeight: 700,
              color: "rgba(255,255,255,0.7)",
              fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.04em",
            }}>
              {icon} {label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Offer cards grid ── */}
      <div className="offer-card-grid">
        {sorted.map((ebook) => (
          <OfferListCard key={ebook.id} ebook={ebook} />
        ))}
      </div>
    </section>
  );
}

// ── Individual offer card ─────────────────────────────────────────────────────

function OfferListCard({ ebook }: { ebook: Ebook }) {
  const [hovered, setHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const savings =
    ebook.originalPrice && ebook.offerPrice
      ? ebook.originalPrice - ebook.offerPrice
      : null;

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!ebook.couponCode) return;
    navigator.clipboard.writeText(ebook.couponCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        background: hovered
          ? "rgba(255,98,0,0.08)"
          : "rgba(255,255,255,0.03)",
        border: `1px solid ${hovered ? "rgba(255,98,0,0.4)" : ebook.featuredOffer ? "rgba(255,184,0,0.35)" : "rgba(255,255,255,0.1)"}`,
        borderRadius: "20px",
        padding: "24px",
        transition: "all 0.25s ease",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered
          ? "0 20px 60px rgba(255,98,0,0.2), 0 8px 24px rgba(0,0,0,0.4)"
          : ebook.featuredOffer
          ? "0 4px 24px rgba(255,184,0,0.1), 0 4px 16px rgba(0,0,0,0.3)"
          : "0 4px 16px rgba(0,0,0,0.2)",
        backdropFilter: "blur(12px)",
        overflow: "hidden",
        cursor: "default",
      }}
    >
      {/* Glassmorphism highlight */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
      }} />

      {/* BEST VALUE badge */}
      {ebook.featuredOffer && (
        <div style={{
          position: "absolute", top: "16px", right: "16px",
          background: "linear-gradient(135deg, #FFB800, #FF8534)",
          borderRadius: "8px", padding: "4px 10px",
          fontSize: "10px", fontWeight: 700,
          color: "#000",
          fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}>
          ⭐ Best Value
        </div>
      )}

      {/* Level / Label */}
      <div style={{
        display: "flex", gap: "8px", flexWrap: "wrap",
        marginBottom: "14px",
        paddingRight: ebook.featuredOffer ? "90px" : 0,
      }}>
        <span style={{
          fontSize: "11px", fontWeight: 700, padding: "4px 12px",
          borderRadius: "20px",
          background: "rgba(255,98,0,0.15)",
          border: "1px solid rgba(255,98,0,0.3)",
          color: "#FF8534",
          fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}>
          {ebook.level}
        </span>
        {ebook.offerLabel && (
          <span style={{
            fontSize: "11px", fontWeight: 700, padding: "4px 12px",
            borderRadius: "20px",
            background: "rgba(255,184,0,0.1)",
            border: "1px solid rgba(255,184,0,0.25)",
            color: "#FFB800",
            fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.06em",
          }}>
            {ebook.offerLabel}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: "Rajdhani, sans-serif",
        fontSize: "18px", fontWeight: 700, color: "#fff",
        margin: "0 0 16px", lineHeight: 1.25,
      }}>
        {ebook.title}
      </h3>

      {/* Pricing */}
      <div style={{
        display: "flex", alignItems: "baseline", gap: "12px",
        flexWrap: "wrap", marginBottom: "14px",
      }}>
        {ebook.originalPrice && (
          <span style={{
            fontSize: "16px",
            color: "rgba(255,255,255,0.35)",
            textDecoration: "line-through",
            fontFamily: "Rajdhani, sans-serif", fontWeight: 600,
          }}>
            ₹{ebook.originalPrice.toLocaleString("en-IN")}
          </span>
        )}
        {ebook.offerPrice && (
          <span style={{
            fontSize: "30px", fontWeight: 700,
            color: "#FF8534",
            fontFamily: "Rajdhani, sans-serif",
          }}>
            ₹{ebook.offerPrice.toLocaleString("en-IN")}
          </span>
        )}
      </div>

      {/* Save badge + feature badges */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
        {savings && savings > 0 && (
          <span style={{
            fontSize: "11px", fontWeight: 700, padding: "4px 10px",
            borderRadius: "20px",
            background: "rgba(34,197,94,0.15)",
            border: "1px solid rgba(34,197,94,0.3)",
            color: "#22c55e",
            fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.04em",
          }}>
            Save ₹{savings.toLocaleString("en-IN")}
          </span>
        )}
        <span style={{
          fontSize: "11px", fontWeight: 700, padding: "4px 10px",
          borderRadius: "20px",
          background: "rgba(59,130,246,0.12)",
          border: "1px solid rgba(59,130,246,0.25)",
          color: "#60a5fa",
          fontFamily: "Rajdhani, sans-serif",
        }}>
          📅 1 Year Access
        </span>
        <span style={{
          fontSize: "11px", fontWeight: 700, padding: "4px 10px",
          borderRadius: "20px",
          background: "rgba(168,85,247,0.12)",
          border: "1px solid rgba(168,85,247,0.25)",
          color: "#c084fc",
          fontFamily: "Rajdhani, sans-serif",
        }}>
          ⚡ Instant Access
        </span>
        <span style={{
          fontSize: "11px", fontWeight: 700, padding: "4px 10px",
          borderRadius: "20px",
          background: "rgba(255,98,0,0.12)",
          border: "1px solid rgba(255,98,0,0.25)",
          color: "#FF8534",
          fontFamily: "Rajdhani, sans-serif",
        }}>
          🎯 Limited Offer
        </span>
      </div>

      {/* Coupon code */}
      {ebook.couponCode && (
        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px dashed rgba(255,98,0,0.35)",
          borderRadius: "12px",
          padding: "10px 14px",
          marginBottom: "16px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: "8px",
        }}>
          <div>
            <div style={{
              fontSize: "10px", fontWeight: 700,
              color: "rgba(255,255,255,0.4)",
              fontFamily: "Rajdhani, sans-serif",
              letterSpacing: "0.08em", textTransform: "uppercase",
              marginBottom: "3px",
            }}>
              Coupon Code
            </div>
            <div style={{
              fontFamily: "monospace",
              fontSize: "16px", fontWeight: 700,
              color: "#FF8534", letterSpacing: "0.1em",
            }}>
              {ebook.couponCode}
            </div>
          </div>
          <button
            onClick={handleCopy}
            style={{
              padding: "7px 14px",
              background: copied
                ? "rgba(34,197,94,0.2)"
                : "rgba(255,98,0,0.15)",
              border: `1px solid ${copied ? "rgba(34,197,94,0.4)" : "rgba(255,98,0,0.3)"}`,
              borderRadius: "8px",
              color: copied ? "#22c55e" : "#FF8534",
              fontSize: "12px", fontWeight: 700,
              fontFamily: "Nunito, sans-serif",
              cursor: "pointer",
              transition: "all 0.2s",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            {copied ? "✓ Copied!" : "📋 Copy"}
          </button>
        </div>
      )}

      {/* Expiry */}
      {ebook.offerExpiry && (
        <div style={{
          fontSize: "11px",
          color: "rgba(255,255,255,0.35)",
          marginBottom: "14px",
          fontFamily: "Nunito, sans-serif",
        }}>
          ⏳ Offer valid till {ebook.offerExpiry}
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {ebook.purchaseUrl && (
          <a
            href={ebook.purchaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              gap: "6px", padding: "11px 16px",
              background: "linear-gradient(135deg, #FF6200, #FF8534)",
              borderRadius: "12px",
              color: "#fff", fontSize: "13px", fontWeight: 700,
              textDecoration: "none",
              fontFamily: "Nunito, sans-serif",
              boxShadow: "0 4px 16px rgba(255,98,0,0.35)",
              whiteSpace: "nowrap",
              minWidth: 0,
            }}
          >
            🛒 Claim Offer
          </a>
        )}
        {ebook.previewUrl && (
          <a
            href={ebook.previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              gap: "6px", padding: "11px 14px",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: "12px",
              color: "rgba(255,255,255,0.75)",
              fontSize: "13px", fontWeight: 700,
              textDecoration: "none",
              fontFamily: "Nunito, sans-serif",
              whiteSpace: "nowrap",
            }}
          >
            👁️ Preview
          </a>
        )}
      </div>
    </div>
  );
}

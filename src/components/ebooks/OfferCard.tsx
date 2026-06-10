"use client";

import { useState } from "react";
import Link from "next/link";

// ─── Hardcoded featured offer shown on every ebook detail page ────────────────
// Shows the Ultimate Bundle (best-value plan) as the highlighted promo.
// Users can see all 6 plans on the /ebooks page.
const PURCHASE_URL =
  "https://learn.civilezy.in/checkout?product_id=6224&product_type=membership&price_id=288694";

const OFFER = {
  originalPrice: 30_000,
  offerPrice:    15_000,
  couponCode:    "BTECHPLUS50",
  badge:         "EARLY BIRD OFFER",
  planTitle:     "B.Tech + Diploma + ITI + KWA Bundle",
  description:   "Covers all Kerala PSC Civil Engineering levels — ITI, Diploma, B.Tech & KWA AE",
};

const savings = OFFER.originalPrice - OFFER.offerPrice;

// ─── Subtle animated border hook ─────────────────────────────────────────────

function GlowBorder() {
  return (
    <>
      <style>{`
        @keyframes offer-glow {
          0%,100% { box-shadow: 0 0 0 1px rgba(255,98,0,0.35), 0 6px 28px rgba(255,98,0,0.15); }
          50%      { box-shadow: 0 0 0 1px rgba(255,98,0,0.6),  0 8px 36px rgba(255,98,0,0.3); }
        }
        .offer-card-glow { animation: offer-glow 3s ease-in-out infinite; }
      `}</style>
    </>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function OfferCard() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(OFFER.couponCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2_000);
    });
  };

  return (
    <>
      <GlowBorder />
      <div
        className="offer-card-glow"
        style={{
          position: "relative",
          background:
            "linear-gradient(135deg, rgba(255,98,0,0.13) 0%, rgba(255,133,52,0.08) 50%, rgba(255,98,0,0.1) 100%)",
          border: "1px solid rgba(255,98,0,0.35)",
          borderRadius: "18px",
          padding: "22px 24px",
          marginBottom: "20px",
          overflow: "hidden",
        }}
      >
        {/* Top sheen */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(255,133,52,0.45), transparent)",
        }} />

        {/* ── Header row ── */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap", gap: "8px",
          marginBottom: "14px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "18px" }}>🔥</span>
            <span style={{
              fontFamily: "Rajdhani, sans-serif",
              fontSize: "14px", fontWeight: 700, color: "#FF8534",
              letterSpacing: "0.1em", textTransform: "uppercase",
            }}>
              {OFFER.badge}
            </span>
          </div>
          {/* 50% OFF pill */}
          <span style={{
            fontSize: "11px", fontWeight: 800, padding: "4px 12px",
            borderRadius: "20px",
            background: "linear-gradient(135deg, #FF6200, #FF8534)",
            color: "#fff",
            fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.08em",
            boxShadow: "0 2px 10px rgba(255,98,0,0.4)",
          }}>
            50% OFF
          </span>
        </div>

        {/* Plan description */}
        <p style={{
          fontSize: "13px", color: "rgba(255,255,255,0.55)",
          margin: "0 0 16px", lineHeight: 1.6,
          fontFamily: "Nunito, sans-serif",
        }}>
          {OFFER.description}
        </p>

        {/* ── Pricing row ── */}
        <div style={{
          display: "flex", alignItems: "baseline",
          gap: "12px", flexWrap: "wrap",
          marginBottom: "14px",
        }}>
          <span style={{
            fontSize: "18px", fontWeight: 600,
            color: "rgba(255,255,255,0.35)",
            textDecoration: "line-through",
            fontFamily: "Rajdhani, sans-serif",
          }}>
            ₹{OFFER.originalPrice.toLocaleString("en-IN")}
          </span>
          <span style={{
            fontSize: "36px", fontWeight: 700, color: "#FF8534",
            fontFamily: "Rajdhani, sans-serif", lineHeight: 1,
          }}>
            ₹{OFFER.offerPrice.toLocaleString("en-IN")}
          </span>
          <span style={{
            fontSize: "13px", fontWeight: 700, padding: "4px 10px",
            borderRadius: "20px",
            background: "rgba(34,197,94,0.15)",
            border: "1px solid rgba(34,197,94,0.3)",
            color: "#22c55e",
            fontFamily: "Rajdhani, sans-serif",
          }}>
            💰 Save ₹{savings.toLocaleString("en-IN")}
          </span>
        </div>

        {/* ── Coupon row ── */}
        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px dashed rgba(255,98,0,0.45)",
          borderRadius: "12px",
          padding: "12px 16px",
          marginBottom: "16px",
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          gap: "12px", flexWrap: "wrap",
        }}>
          <div>
            <div style={{
              fontSize: "10px", fontWeight: 700,
              color: "rgba(255,255,255,0.4)",
              fontFamily: "Rajdhani, sans-serif",
              letterSpacing: "0.1em", textTransform: "uppercase",
              marginBottom: "4px",
            }}>
              Apply Coupon
            </div>
            <div style={{
              fontFamily: "monospace",
              fontSize: "20px", fontWeight: 700,
              color: "#FF8534", letterSpacing: "0.12em",
            }}>
              {OFFER.couponCode}
            </div>
          </div>
          <button
            onClick={handleCopy}
            style={{
              padding: "10px 20px",
              background: copied ? "rgba(34,197,94,0.2)" : "rgba(255,98,0,0.18)",
              border: `1px solid ${copied ? "rgba(34,197,94,0.4)" : "rgba(255,98,0,0.4)"}`,
              borderRadius: "10px",
              color: copied ? "#22c55e" : "#FF8534",
              fontSize: "13px", fontWeight: 700,
              fontFamily: "Nunito, sans-serif",
              cursor: "pointer",
              transition: "all 0.2s",
              flexShrink: 0, whiteSpace: "nowrap",
            }}
          >
            {copied ? "✓ Copied!" : "📋 Copy Coupon"}
          </button>
        </div>

        {/* ── CTA buttons ── */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {/* Claim Offer */}
          {PURCHASE_URL && (
            <a
              href={PURCHASE_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: "8px",
                padding: "13px",
                background: "linear-gradient(135deg, #FF6200, #FF8534)",
                borderRadius: "12px",
                color: "#fff", fontSize: "15px", fontWeight: 700,
                textDecoration: "none",
                fontFamily: "Nunito, sans-serif",
                boxShadow: "0 4px 20px rgba(255,98,0,0.4)",
                transition: "all 0.2s",
                minWidth: 0,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.02)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 28px rgba(255,98,0,0.55)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "none";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 20px rgba(255,98,0,0.4)";
              }}
            >
              🔥 Claim Early Bird Offer
            </a>
          )}

          {/* See All Plans */}
          <Link
            href="/ebooks"
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              gap: "6px",
              padding: "13px 18px",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "12px",
              color: "rgba(255,255,255,0.8)",
              fontSize: "13px", fontWeight: 700,
              textDecoration: "none",
              fontFamily: "Nunito, sans-serif",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.12)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.07)";
            }}
          >
            📚 View All Plans
          </Link>
        </div>
      </div>
    </>
  );
}

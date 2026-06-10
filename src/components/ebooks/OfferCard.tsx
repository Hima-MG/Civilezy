"use client";

import { useState } from "react";
import Link from "next/link";

// ─── Offer data ───────────────────────────────────────────────────────────────
// Shows the Ultimate Bundle as the hero offer on every ebook detail page.

const OFFER = {
  originalPrice: 30_000,
  offerPrice:    15_000,
  couponCode:    "BTECHPLUS50",
  title:         "Ultimate Bundle",
  subtitle:      "B.Tech + Diploma + ITI + KWA Draftsman Gr. II",
  purchaseUrl:
    "https://learn.civilezy.in/checkout?product_id=6224&product_type=membership&price_id=288694",
} as const;

const savings = OFFER.originalPrice - OFFER.offerPrice;

// ─── OfferCard ────────────────────────────────────────────────────────────────

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
      <style>{`
        @keyframes offer-border-glow {
          0%,100% { box-shadow: 0 0 0 1px rgba(255,98,0,0.28), 0 6px 28px rgba(255,98,0,0.1); }
          50%      { box-shadow: 0 0 0 1px rgba(255,98,0,0.5),  0 8px 36px rgba(255,98,0,0.22); }
        }
      `}</style>

      <div
        style={{
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(145deg, rgba(255,98,0,0.09) 0%, rgba(10,24,48,0.85) 100%)",
          border: "1px solid rgba(255,98,0,0.28)",
          borderRadius: "20px",
          padding: "24px",
          marginBottom: "20px",
          backdropFilter: "blur(16px)",
          animation: "offer-border-glow 3.5s ease-in-out infinite",
          fontFamily: "Nunito, sans-serif",
        }}
      >
        {/* Top sheen */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(255,133,52,0.5), transparent)",
          }}
        />

        {/* ── Header ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "4px",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ fontSize: "16px" }}>🔥</span>
            <span
              style={{
                fontFamily: "Rajdhani, sans-serif",
                fontSize: "13px",
                fontWeight: 700,
                color: "#FF8534",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Early Bird Offer
            </span>
          </div>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 800,
              padding: "3px 10px",
              borderRadius: "20px",
              background: "linear-gradient(135deg,rgba(255,98,0,0.2),rgba(255,133,52,0.15))",
              border: "1px solid rgba(255,98,0,0.3)",
              color: "#FF8534",
              fontFamily: "Rajdhani, sans-serif",
              letterSpacing: "0.08em",
            }}
          >
            50% OFF
          </span>
        </div>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "12px",
            color: "rgba(255,255,255,0.38)",
            margin: "0 0 18px",
            fontWeight: 500,
          }}
        >
          {OFFER.subtitle}
        </p>

        {/* ── Pricing ── */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "14px",
          }}
        >
          <span
            style={{
              fontSize: "16px",
              fontWeight: 600,
              color: "rgba(255,255,255,0.28)",
              textDecoration: "line-through",
              fontFamily: "Rajdhani, sans-serif",
            }}
          >
            ₹{OFFER.originalPrice.toLocaleString("en-IN")}
          </span>
          <span
            style={{
              fontSize: "36px",
              fontWeight: 700,
              color: "#FF8534",
              fontFamily: "Rajdhani, sans-serif",
              lineHeight: 1,
            }}
          >
            ₹{OFFER.offerPrice.toLocaleString("en-IN")}
          </span>
          <span
            style={{
              fontSize: "12px",
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: "20px",
              background: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.2)",
              color: "#4ade80",
            }}
          >
            Save ₹{savings.toLocaleString("en-IN")}
          </span>
        </div>

        {/* ── Coupon ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            flexWrap: "wrap",
            background: "rgba(255,98,0,0.055)",
            border: "1px dashed rgba(255,98,0,0.3)",
            borderRadius: "14px",
            padding: "13px 16px",
            marginBottom: "18px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "9px",
                fontWeight: 700,
                color: "rgba(255,255,255,0.3)",
                fontFamily: "Rajdhani, sans-serif",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "4px",
              }}
            >
              Coupon Code
            </div>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "20px",
                fontWeight: 700,
                color: "#FF8534",
                letterSpacing: "0.1em",
              }}
            >
              {OFFER.couponCode}
            </div>
          </div>
          <button
            onClick={handleCopy}
            style={{
              padding: "9px 18px",
              background: copied ? "rgba(34,197,94,0.15)" : "rgba(255,98,0,0.12)",
              border: `1px solid ${copied ? "rgba(34,197,94,0.3)" : "rgba(255,98,0,0.28)"}`,
              borderRadius: "10px",
              color: copied ? "#4ade80" : "#FF8534",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s",
              flexShrink: 0,
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {copied ? (
              <>
                <span>✓</span> Copied!
              </>
            ) : (
              <>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
                Copy Coupon
              </>
            )}
          </button>
        </div>

        {/* ── Divider ── */}
        <div
          style={{
            height: "1px",
            background: "rgba(255,255,255,0.05)",
            marginBottom: "18px",
          }}
        />

        {/* ── Buttons ── */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {/* Primary — Claim Offer */}
          <a
            href={OFFER.purchaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "7px",
              padding: "13px 16px",
              background: "linear-gradient(135deg, #FF6200, #FF8534)",
              borderRadius: "12px",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 700,
              textDecoration: "none",
              fontFamily: "Nunito, sans-serif",
              boxShadow: "0 4px 18px rgba(255,98,0,0.32)",
              transition: "filter 0.2s, box-shadow 0.2s",
              whiteSpace: "nowrap",
              minWidth: 0,
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.filter = "brightness(1.1)";
              el.style.boxShadow = "0 8px 26px rgba(255,98,0,0.5)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.filter = "none";
              el.style.boxShadow = "0 4px 18px rgba(255,98,0,0.32)";
            }}
          >
            🔥 Claim Offer
          </a>

          {/* Secondary — View All Plans */}
          <Link
            href="/ebooks"
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              padding: "13px 16px",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "12px",
              color: "rgba(255,255,255,0.55)",
              fontSize: "14px",
              fontWeight: 600,
              textDecoration: "none",
              fontFamily: "Nunito, sans-serif",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
              minWidth: 0,
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = "rgba(255,255,255,0.06)";
              el.style.borderColor = "rgba(255,255,255,0.2)";
              el.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = "transparent";
              el.style.borderColor = "rgba(255,255,255,0.12)";
              el.style.color = "rgba(255,255,255,0.55)";
            }}
          >
            View All Plans
          </Link>
        </div>
      </div>
    </>
  );
}

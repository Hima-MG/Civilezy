"use client";

import { useState } from "react";
import type { Ebook } from "@/types/ebook";

interface Props {
  ebook: Ebook;
}

export default function OfferCard({ ebook }: Props) {
  const [copied, setCopied] = useState(false);

  if (!ebook.offerEnabled || !ebook.offerPrice) return null;

  const savings =
    ebook.originalPrice && ebook.offerPrice
      ? ebook.originalPrice - ebook.offerPrice
      : null;

  const handleCopy = () => {
    if (!ebook.couponCode) return;
    navigator.clipboard.writeText(ebook.couponCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{
      position: "relative",
      background: "linear-gradient(135deg, rgba(255,98,0,0.12) 0%, rgba(255,133,52,0.07) 100%)",
      border: "1px solid rgba(255,98,0,0.35)",
      borderRadius: "18px",
      padding: "22px 24px",
      marginBottom: "20px",
      overflow: "hidden",
    }}>
      {/* Glassmorphism top highlight */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(255,133,52,0.4), transparent)",
      }} />

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: "8px",
        marginBottom: "16px",
      }}>
        <span style={{ fontSize: "16px" }}>🔥</span>
        <span style={{
          fontFamily: "Rajdhani, sans-serif",
          fontSize: "14px", fontWeight: 700,
          color: "#FF8534", letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}>
          Early Bird Offer
        </span>
        {ebook.offerLabel && (
          <span style={{
            marginLeft: "auto",
            fontSize: "11px", fontWeight: 700, padding: "3px 10px",
            borderRadius: "20px",
            background: "rgba(255,184,0,0.12)",
            border: "1px solid rgba(255,184,0,0.25)",
            color: "#FFB800",
            fontFamily: "Rajdhani, sans-serif",
          }}>
            {ebook.offerLabel}
          </span>
        )}
      </div>

      {/* Pricing row */}
      <div style={{
        display: "flex", alignItems: "baseline",
        gap: "12px", flexWrap: "wrap",
        marginBottom: "14px",
      }}>
        {ebook.originalPrice && (
          <span style={{
            fontSize: "18px", fontWeight: 600,
            color: "rgba(255,255,255,0.35)",
            textDecoration: "line-through",
            fontFamily: "Rajdhani, sans-serif",
          }}>
            ₹{ebook.originalPrice.toLocaleString("en-IN")}
          </span>
        )}
        <span style={{
          fontSize: "34px", fontWeight: 700,
          color: "#FF8534",
          fontFamily: "Rajdhani, sans-serif",
          lineHeight: 1,
        }}>
          ₹{ebook.offerPrice.toLocaleString("en-IN")}
        </span>
        {savings && savings > 0 && (
          <span style={{
            fontSize: "13px", fontWeight: 700, padding: "4px 10px",
            borderRadius: "20px",
            background: "rgba(34,197,94,0.15)",
            border: "1px solid rgba(34,197,94,0.3)",
            color: "#22c55e",
            fontFamily: "Rajdhani, sans-serif",
          }}>
            Save ₹{savings.toLocaleString("en-IN")}
          </span>
        )}
      </div>

      {/* Coupon section */}
      {ebook.couponCode && (
        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px dashed rgba(255,98,0,0.4)",
          borderRadius: "12px",
          padding: "12px 16px",
          marginBottom: "16px",
          display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: "12px",
          flexWrap: "wrap",
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
              {ebook.couponCode}
            </div>
          </div>
          <button
            onClick={handleCopy}
            style={{
              padding: "9px 18px",
              background: copied
                ? "rgba(34,197,94,0.2)"
                : "rgba(255,98,0,0.18)",
              border: `1px solid ${copied ? "rgba(34,197,94,0.4)" : "rgba(255,98,0,0.4)"}`,
              borderRadius: "10px",
              color: copied ? "#22c55e" : "#FF8534",
              fontSize: "13px", fontWeight: 700,
              fontFamily: "Nunito, sans-serif",
              cursor: "pointer",
              transition: "all 0.2s",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            {copied ? "✓ Copied!" : "📋 Copy Coupon"}
          </button>
        </div>
      )}

      {/* Expiry */}
      {ebook.offerExpiry && (
        <div style={{
          fontSize: "12px",
          color: "rgba(255,255,255,0.35)",
          marginBottom: "14px",
          fontFamily: "Nunito, sans-serif",
        }}>
          ⏳ Offer valid till {ebook.offerExpiry}
        </div>
      )}

      {/* CTA button */}
      {ebook.purchaseUrl && (
        <a
          href={ebook.purchaseUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "8px",
            width: "100%", boxSizing: "border-box",
            padding: "13px",
            background: "linear-gradient(135deg, #FF6200, #FF8534)",
            borderRadius: "12px",
            color: "#fff", fontSize: "15px", fontWeight: 700,
            textDecoration: "none",
            fontFamily: "Nunito, sans-serif",
            boxShadow: "0 4px 20px rgba(255,98,0,0.4)",
          }}
        >
          🔥 Claim Early Bird Offer
        </a>
      )}
    </div>
  );
}

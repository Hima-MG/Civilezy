"use client";

import { useState, useEffect } from "react";
import { getActiveCampaign } from "@/lib/campaigns";
import type { Campaign } from "@/types/campaign";
import type { Timestamp } from "firebase/firestore";

// ── Countdown hook ────────────────────────────────────────────────────────────

interface TimeLeft { days: number; hours: number; minutes: number; seconds: number }

function useCountdown(expiryDate?: Timestamp | null): TimeLeft | null {
  const [t, setT] = useState<TimeLeft | null>(null);

  useEffect(() => {
    if (!expiryDate) return;
    const ms =
      typeof expiryDate.toMillis === "function" ? expiryDate.toMillis() : null;
    if (!ms) return;

    const calc = () => {
      const diff = ms - Date.now();
      if (diff <= 0) {
        setT({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setT({
        days:    Math.floor(diff / 86_400_000),
        hours:   Math.floor((diff % 86_400_000) / 3_600_000),
        minutes: Math.floor((diff % 3_600_000)  / 60_000),
        seconds: Math.floor((diff % 60_000)     / 1_000),
      });
    };
    calc();
    const id = setInterval(calc, 1_000);
    return () => clearInterval(id);
  }, [expiryDate]);

  return t;
}

// ── Inner card (rendered once campaign is loaded) ─────────────────────────────

function CampaignOfferCard({ campaign }: { campaign: Campaign }) {
  const [copied, setCopied] = useState(false);

  // Pick the featured plan, fallback to first plan
  const plan =
    campaign.plans?.find((p) => p.featured) ?? campaign.plans?.[0] ?? null;

  const timeLeft = useCountdown(campaign.expiryDate);
  const savings  = plan ? plan.originalPrice - plan.offerPrice : 0;

  const handleCopy = () => {
    if (!plan?.couponCode) return;
    navigator.clipboard.writeText(plan.couponCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2_000);
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
      {/* Glassmorphism sheen */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(255,133,52,0.4), transparent)",
      }} />

      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
        <span style={{ fontSize: "16px" }}>🔥</span>
        <span style={{
          fontFamily: "Rajdhani, sans-serif",
          fontSize: "14px", fontWeight: 700, color: "#FF8534",
          letterSpacing: "0.1em", textTransform: "uppercase",
        }}>
          {campaign.badge ?? "Early Bird Offer"}
        </span>
        {plan?.badge && (
          <span style={{
            marginLeft: "auto",
            fontSize: "11px", fontWeight: 700, padding: "3px 10px",
            borderRadius: "20px",
            background: "rgba(255,184,0,0.12)", border: "1px solid rgba(255,184,0,0.25)",
            color: "#FFB800", fontFamily: "Rajdhani, sans-serif",
          }}>
            {plan.badge}
          </span>
        )}
      </div>

      {/* Campaign subtitle */}
      {campaign.subtitle && (
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", margin: "0 0 14px", lineHeight: 1.6 }}>
          {campaign.subtitle}
        </p>
      )}

      {/* Pricing row */}
      {plan && (
        <div style={{
          display: "flex", alignItems: "baseline",
          gap: "12px", flexWrap: "wrap", marginBottom: "14px",
        }}>
          {plan.originalPrice > 0 && (
            <span style={{
              fontSize: "18px", fontWeight: 600,
              color: "rgba(255,255,255,0.35)", textDecoration: "line-through",
              fontFamily: "Rajdhani, sans-serif",
            }}>
              ₹{plan.originalPrice.toLocaleString("en-IN")}
            </span>
          )}
          <span style={{
            fontSize: "34px", fontWeight: 700, color: "#FF8534",
            fontFamily: "Rajdhani, sans-serif", lineHeight: 1,
          }}>
            ₹{plan.offerPrice.toLocaleString("en-IN")}
          </span>
          {savings > 0 && (
            <span style={{
              fontSize: "13px", fontWeight: 700, padding: "4px 10px",
              borderRadius: "20px",
              background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)",
              color: "#22c55e", fontFamily: "Rajdhani, sans-serif",
            }}>
              Save ₹{savings.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      )}

      {/* Coupon */}
      {plan?.couponCode && (
        <div style={{
          background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,98,0,0.4)",
          borderRadius: "12px", padding: "12px 16px", marginBottom: "16px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: "12px", flexWrap: "wrap",
        }}>
          <div>
            <div style={{
              fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.4)",
              fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.1em",
              textTransform: "uppercase", marginBottom: "4px",
            }}>
              Apply Coupon
            </div>
            <div style={{
              fontFamily: "monospace", fontSize: "20px", fontWeight: 700,
              color: "#FF8534", letterSpacing: "0.12em",
            }}>
              {plan.couponCode}
            </div>
          </div>
          <button
            onClick={handleCopy}
            style={{
              padding: "9px 18px",
              background: copied ? "rgba(34,197,94,0.2)" : "rgba(255,98,0,0.18)",
              border: `1px solid ${copied ? "rgba(34,197,94,0.4)" : "rgba(255,98,0,0.4)"}`,
              borderRadius: "10px",
              color: copied ? "#22c55e" : "#FF8534",
              fontSize: "13px", fontWeight: 700,
              fontFamily: "Nunito, sans-serif",
              cursor: "pointer", transition: "all 0.2s",
              flexShrink: 0, whiteSpace: "nowrap",
            }}
          >
            {copied ? "✓ Copied!" : "📋 Copy Coupon"}
          </button>
        </div>
      )}

      {/* Countdown */}
      {campaign.expiryDate && timeLeft && (
        <div style={{ marginBottom: "16px" }}>
          <p style={{
            fontSize: "11px", color: "rgba(255,255,255,0.4)",
            fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
            margin: "0 0 8px", fontFamily: "Rajdhani, sans-serif",
          }}>
            Offer Ends In
          </p>
          <div style={{ display: "flex", gap: "8px" }}>
            {[
              { v: timeLeft.days,    l: "Days" },
              { v: timeLeft.hours,   l: "Hours" },
              { v: timeLeft.minutes, l: "Mins" },
            ].map(({ v, l }) => (
              <div key={l} style={{
                background: "rgba(255,98,0,0.12)", border: "1px solid rgba(255,98,0,0.25)",
                borderRadius: "10px", padding: "10px 14px", textAlign: "center", minWidth: "56px",
              }}>
                <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "24px", fontWeight: 700, color: "#FF6200", lineHeight: 1 }}>
                  {String(v).padStart(2, "0")}
                </div>
                <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.35)", fontWeight: 700, letterSpacing: "0.06em", marginTop: "3px" }}>
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      {plan?.purchaseUrl && (
        <a
          href={plan.purchaseUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "8px", width: "100%", boxSizing: "border-box", padding: "13px",
            background: "linear-gradient(135deg, #FF6200, #FF8534)",
            borderRadius: "12px", color: "#fff", fontSize: "15px", fontWeight: 700,
            textDecoration: "none", fontFamily: "Nunito, sans-serif",
            boxShadow: "0 4px 20px rgba(255,98,0,0.4)",
          }}
        >
          🔥 Claim Early Bird Offer
        </a>
      )}
    </div>
  );
}

// ── Public export: self-fetching OfferCard ─────────────────────────────────────

export default function OfferCard() {
  const [campaign, setCampaign] = useState<Campaign | null | undefined>(undefined);

  useEffect(() => {
    getActiveCampaign()
      .then(setCampaign)
      .catch(() => setCampaign(null));
  }, []);

  // Still loading → render nothing (no layout shift)
  if (campaign === undefined) return null;

  // No active campaign → render nothing
  if (!campaign) return null;

  return <CampaignOfferCard campaign={campaign} />;
}

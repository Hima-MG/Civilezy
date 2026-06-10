"use client";

import { useState, useEffect } from "react";
import { getActiveCampaign } from "@/lib/campaigns";
import type { Campaign, CampaignPlan } from "@/types/campaign";
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
      if (diff <= 0) { setT({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setT({
        days: Math.floor(diff / 86_400_000),
        hours: Math.floor((diff % 86_400_000) / 3_600_000),
        minutes: Math.floor((diff % 3_600_000) / 60_000),
        seconds: Math.floor((diff % 60_000) / 1_000),
      });
    };
    calc();
    const id = setInterval(calc, 1_000);
    return () => clearInterval(id);
  }, [expiryDate]);

  return t;
}

// ── Copy-coupon helper ────────────────────────────────────────────────────────

function CopyCouponBtn({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () =>
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2_000);
    });

  return (
    <button
      onClick={copy}
      style={{
        padding: "7px 14px",
        background: copied ? "rgba(34,197,94,0.2)" : "rgba(255,98,0,0.15)",
        border: `1px solid ${copied ? "rgba(34,197,94,0.4)" : "rgba(255,98,0,0.3)"}`,
        borderRadius: "8px",
        color: copied ? "#22c55e" : "#FF8534",
        fontSize: "12px", fontWeight: 700,
        fontFamily: "Nunito, sans-serif",
        cursor: "pointer", transition: "all 0.2s",
        flexShrink: 0, whiteSpace: "nowrap",
      }}
    >
      {copied ? "✓ Copied!" : "📋 Copy"}
    </button>
  );
}

// ── Plan card ─────────────────────────────────────────────────────────────────

function PlanCard({ plan }: { plan: CampaignPlan }) {
  const [hovered, setHovered] = useState(false);
  const savings = plan.originalPrice - plan.offerPrice;
  const isFeatured = plan.featured === true;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        background: hovered
          ? isFeatured ? "rgba(255,184,0,0.08)" : "rgba(255,98,0,0.08)"
          : "rgba(255,255,255,0.03)",
        border: isFeatured
          ? `1px solid ${hovered ? "rgba(255,184,0,0.6)" : "rgba(255,184,0,0.35)"}`
          : `1px solid ${hovered ? "rgba(255,98,0,0.4)" : "rgba(255,255,255,0.1)"}`,
        borderRadius: "20px",
        padding: "24px",
        transition: "all 0.25s ease",
        transform: hovered ? "translateY(-6px) scale(1.01)" : "none",
        boxShadow: hovered
          ? isFeatured
            ? "0 24px 60px rgba(255,184,0,0.2), 0 8px 24px rgba(0,0,0,0.5)"
            : "0 20px 60px rgba(255,98,0,0.2), 0 8px 24px rgba(0,0,0,0.4)"
          : isFeatured
          ? "0 4px 24px rgba(255,184,0,0.12), 0 4px 16px rgba(0,0,0,0.3)"
          : "0 4px 16px rgba(0,0,0,0.2)",
        backdropFilter: "blur(12px)",
        overflow: "hidden",
        cursor: "default",
      }}
    >
      {/* Glassmorphism top sheen */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: isFeatured
          ? "linear-gradient(90deg, transparent, rgba(255,184,0,0.4), transparent)"
          : "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
      }} />

      {/* BEST VALUE crown */}
      {isFeatured && (
        <>
          <style>{`
            @keyframes golden-glow {
              0%,100% { box-shadow: 0 0 0 2px rgba(255,184,0,0.2); }
              50% { box-shadow: 0 0 20px 4px rgba(255,184,0,0.35); }
            }
          `}</style>
          <div style={{
            position: "absolute", top: "14px", right: "14px",
            background: "linear-gradient(135deg, #FFB800, #FF8534)",
            borderRadius: "8px", padding: "4px 10px",
            fontSize: "10px", fontWeight: 800, color: "#000",
            fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.08em",
            textTransform: "uppercase",
            animation: "golden-glow 2.5s ease-in-out infinite",
          }}>
            ⭐ BEST VALUE
          </div>
        </>
      )}

      {/* Plan badge */}
      <div style={{ marginBottom: "14px", paddingRight: isFeatured ? "96px" : 0 }}>
        {plan.badge && (
          <span style={{
            fontSize: "11px", fontWeight: 700, padding: "4px 12px",
            borderRadius: "20px",
            background: isFeatured ? "rgba(255,184,0,0.12)" : "rgba(255,98,0,0.12)",
            border: `1px solid ${isFeatured ? "rgba(255,184,0,0.3)" : "rgba(255,98,0,0.25)"}`,
            color: isFeatured ? "#FFB800" : "#FF8534",
            fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}>
            {plan.badge}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: "Rajdhani, sans-serif",
        fontSize: "19px", fontWeight: 700, color: "#fff",
        margin: "0 0 16px", lineHeight: 1.25,
      }}>
        {plan.title}
      </h3>

      {/* Pricing */}
      <div style={{ display: "flex", alignItems: "baseline", gap: "10px", flexWrap: "wrap", marginBottom: "12px" }}>
        {plan.originalPrice > 0 && (
          <span style={{
            fontSize: "16px", color: "rgba(255,255,255,0.35)",
            textDecoration: "line-through",
            fontFamily: "Rajdhani, sans-serif", fontWeight: 600,
          }}>
            ₹{plan.originalPrice.toLocaleString("en-IN")}
          </span>
        )}
        <span style={{
          fontSize: "32px", fontWeight: 700,
          color: isFeatured ? "#FFB800" : "#FF8534",
          fontFamily: "Rajdhani, sans-serif",
        }}>
          ₹{plan.offerPrice.toLocaleString("en-IN")}
        </span>
      </div>

      {/* Badges row */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
        {savings > 0 && (
          <span style={{
            fontSize: "11px", fontWeight: 700, padding: "4px 10px",
            borderRadius: "20px",
            background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)",
            color: "#22c55e", fontFamily: "Rajdhani, sans-serif",
          }}>
            Save ₹{savings.toLocaleString("en-IN")}
          </span>
        )}
        <span style={{
          fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "20px",
          background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)",
          color: "#60a5fa", fontFamily: "Rajdhani, sans-serif",
        }}>
          📅 1 Year Access
        </span>
        <span style={{
          fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "20px",
          background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.25)",
          color: "#c084fc", fontFamily: "Rajdhani, sans-serif",
        }}>
          ⚡ Instant Access
        </span>
        <span style={{
          fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "20px",
          background: "rgba(255,98,0,0.12)", border: "1px solid rgba(255,98,0,0.25)",
          color: "#FF8534", fontFamily: "Rajdhani, sans-serif",
        }}>
          🎯 Limited Offer
        </span>
      </div>

      {/* Coupon */}
      {plan.couponCode && (
        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px dashed rgba(255,98,0,0.35)",
          borderRadius: "12px", padding: "10px 14px", marginBottom: "16px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px",
        }}>
          <div>
            <div style={{
              fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.4)",
              fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.08em",
              textTransform: "uppercase", marginBottom: "3px",
            }}>
              Coupon Code
            </div>
            <div style={{
              fontFamily: "monospace", fontSize: "16px", fontWeight: 700,
              color: "#FF8534", letterSpacing: "0.1em",
            }}>
              {plan.couponCode}
            </div>
          </div>
          <CopyCouponBtn code={plan.couponCode} />
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {plan.purchaseUrl && (
          <a
            href={plan.purchaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              gap: "6px", padding: "11px 16px",
              background: isFeatured
                ? "linear-gradient(135deg, #FFB800, #FF8534)"
                : "linear-gradient(135deg, #FF6200, #FF8534)",
              borderRadius: "12px", color: "#fff",
              fontSize: "13px", fontWeight: 700,
              textDecoration: "none", fontFamily: "Nunito, sans-serif",
              boxShadow: isFeatured
                ? "0 4px 16px rgba(255,184,0,0.35)"
                : "0 4px 16px rgba(255,98,0,0.35)",
              whiteSpace: "nowrap", minWidth: 0,
            }}
          >
            🛒 Claim Offer
          </a>
        )}
        {plan.showPreview && plan.previewUrl && (
          <a
            href={plan.previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              gap: "6px", padding: "11px 14px",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: "12px", color: "rgba(255,255,255,0.75)",
              fontSize: "13px", fontWeight: 700,
              textDecoration: "none", fontFamily: "Nunito, sans-serif",
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

// ── Countdown display ─────────────────────────────────────────────────────────

function CampaignCountdown({ expiryDate }: { expiryDate?: Timestamp | null }) {
  const t = useCountdown(expiryDate);
  if (!t) return null;

  return (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
      {[
        { v: t.days, l: "Days" },
        { v: t.hours, l: "Hours" },
        { v: t.minutes, l: "Mins" },
        { v: t.seconds, l: "Secs" },
      ].map(({ v, l }) => (
        <div key={l} style={{
          background: "rgba(255,98,0,0.12)", border: "1px solid rgba(255,98,0,0.25)",
          borderRadius: "10px", padding: "10px 14px", textAlign: "center", minWidth: "60px",
        }}>
          <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "26px", fontWeight: 700, color: "#FF6200", lineHeight: 1 }}>
            {String(v).padStart(2, "0")}
          </div>
          <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.35)", fontWeight: 700, letterSpacing: "0.06em", marginTop: "3px" }}>
            {l}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Skeleton loader ───────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <section style={{ marginBottom: "64px" }}>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .skeleton-pulse {
          background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%);
          background-size: 800px 100%;
          animation: shimmer 1.6s infinite;
        }
      `}</style>
      {/* Banner skeleton */}
      <div className="skeleton-pulse" style={{ borderRadius: "20px", height: "180px", marginBottom: "28px" }} />
      {/* Card skeletons */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "20px",
      }}>
        {[1, 2, 3].map((n) => (
          <div key={n} className="skeleton-pulse" style={{ borderRadius: "20px", height: "320px" }} />
        ))}
      </div>
    </section>
  );
}

// ── Main EarlyBirdCampaign component ─────────────────────────────────────────

export default function EarlyBirdCampaign() {
  const [campaign, setCampaign] = useState<Campaign | null | undefined>(undefined);

  useEffect(() => {
    getActiveCampaign()
      .then(setCampaign)
      .catch(() => setCampaign(null));
  }, []);

  // Loading state
  if (campaign === undefined) return <Skeleton />;

  // No active campaign → render nothing (no empty containers)
  if (!campaign) return null;

  // Sort plans: featured first (for mobile pin), then by order field
  const sortedPlans = [...(campaign.plans ?? [])].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return (a.order ?? 0) - (b.order ?? 0);
  });

  return (
    <section style={{ marginBottom: "64px" }}>
      <style>{`
        @keyframes pulse-glow {
          0%,100% { box-shadow: 0 0 24px rgba(255,98,0,0.3), 0 8px 40px rgba(0,0,0,0.4); }
          50%      { box-shadow: 0 0 48px rgba(255,98,0,0.5), 0 8px 40px rgba(0,0,0,0.4); }
        }
        @keyframes glow-orb {
          0%,100% { opacity: 0.5; transform: scale(1); }
          50%      { opacity: 0.8; transform: scale(1.15); }
        }
        .campaign-banner { animation: pulse-glow 3s ease-in-out infinite; }
        .campaign-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media (max-width: 900px) {
          .campaign-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .campaign-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ── Hero Banner ── */}
      <div
        className="campaign-banner"
        style={{
          position: "relative", overflow: "hidden",
          background: "linear-gradient(135deg, rgba(255,98,0,0.18) 0%, rgba(255,133,52,0.1) 50%, rgba(255,98,0,0.15) 100%)",
          border: "1px solid rgba(255,98,0,0.4)",
          borderRadius: "20px", padding: "40px 28px",
          marginBottom: "28px", textAlign: "center",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Animated background orbs */}
        <div style={{
          position: "absolute", top: "-60px", right: "-60px",
          width: "240px", height: "240px",
          background: "radial-gradient(circle, rgba(255,98,0,0.18) 0%, transparent 70%)",
          animation: "glow-orb 4s ease-in-out infinite",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "-60px", left: "-60px",
          width: "220px", height: "220px",
          background: "radial-gradient(circle, rgba(255,133,52,0.12) 0%, transparent 70%)",
          animation: "glow-orb 4s ease-in-out infinite 2s",
          pointerEvents: "none",
        }} />

        {/* Badge pill */}
        {campaign.badge && (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(255,98,0,0.2)", border: "1px solid rgba(255,98,0,0.4)",
            borderRadius: "20px", padding: "5px 16px", marginBottom: "16px",
          }}>
            <span style={{ fontSize: "13px" }}>🔥</span>
            <span style={{
              fontSize: "11px", fontWeight: 700, color: "#FF8534",
              fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}>
              {campaign.badge}
            </span>
          </div>
        )}

        {/* Title */}
        <h2 style={{
          fontFamily: "Rajdhani, sans-serif",
          fontSize: "clamp(26px, 4vw, 42px)",
          fontWeight: 700, color: "#fff",
          margin: "0 0 12px", lineHeight: 1.1,
        }}>
          {campaign.title.includes("OFF") ? (
            <>
              {campaign.title.split(/(\d+%?\s*OFF)/i)[0]}
              <span style={{
                background: "linear-gradient(135deg, #FF6200, #FF8534)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                {campaign.title.match(/\d+%?\s*OFF/i)?.[0] ?? ""}
              </span>
              {campaign.title.split(/\d+%?\s*OFF/i)[1] ?? ""}
            </>
          ) : campaign.title}
        </h2>

        {/* Subtitle */}
        {campaign.subtitle && (
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.7)", margin: "0 0 6px" }}>
            {campaign.subtitle}
          </p>
        )}

        {/* Description */}
        {campaign.description && (
          <p style={{ fontSize: "14px", color: "rgba(255,133,52,0.9)", margin: "0 0 20px", fontWeight: 600 }}>
            {campaign.description}
          </p>
        )}

        {/* Countdown */}
        {campaign.expiryDate && (
          <div style={{ marginTop: "12px", marginBottom: "20px" }}>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 10px", fontFamily: "Rajdhani, sans-serif" }}>
              Offer Ends In
            </p>
            <CampaignCountdown expiryDate={campaign.expiryDate} />
          </div>
        )}

        {/* Trust badges */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px", marginTop: "20px" }}>
          {[
            { icon: "⚡", label: "Instant Access" },
            { icon: "📅", label: "1 Year Access" },
            { icon: "🎯", label: "Limited Offer" },
          ].map(({ icon, label }) => (
            <span key={label} style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "5px 14px",
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "20px", fontSize: "12px", fontWeight: 700,
              color: "rgba(255,255,255,0.7)",
              fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.04em",
            }}>
              {icon} {label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Plan grid ── */}
      <div className="campaign-grid">
        {sortedPlans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </section>
  );
}

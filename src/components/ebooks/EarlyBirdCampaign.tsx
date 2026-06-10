"use client";

import { useState, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Plan {
  id: string;
  title: string;
  subtitle: string;
  originalPrice: number;
  offerPrice: number;
  couponCode: string;
  purchaseUrl: string;
  previewUrl?: string;
  features: string[];
  featured?: boolean;
}

// ─── Plan data ────────────────────────────────────────────────────────────────
// All plans have exactly 5 features so every card stays the same height.

const PLANS: Plan[] = [
  {
    id: "iti",
    title: "Overseer Gr. III",
    subtitle: "ITI Level · Kerala PSC",
    originalPrice: 15_000,
    offerPrice: 7_500,
    couponCode: "ITI50",
    purchaseUrl:
      "https://learn.civilezy.in/checkout?product_id=6219&product_type=membership&price_id=288688",
    previewUrl:
      "https://learn.civilezy.in/student/courses/43997/watch?lesson_id=630942",
    features: [
      "1 Year Validity",
      "Exam-Focused Notes",
      "Smart Revision Sections",
      "Practice Questions",
      "Free Preview Available",
    ],
  },
  {
    id: "diploma",
    title: "Overseer Gr. I / Instructor",
    subtitle: "Diploma Level · Kerala PSC",
    originalPrice: 18_000,
    offerPrice: 9_000,
    couponCode: "DIPLOMA50",
    purchaseUrl:
      "https://learn.civilezy.in/checkout?product_id=6220&product_type=membership&price_id=288689",
    previewUrl:
      "https://learn.civilezy.in/student/courses/43387/watch/?lesson_id=620443",
    features: [
      "1 Year Validity",
      "Exam-Focused Notes",
      "Smart Revision Sections",
      "Practice Questions",
      "Free Preview Available",
    ],
  },
  {
    id: "btech",
    title: "Assistant Engineer",
    subtitle: "B.Tech Level · AE Irrigation",
    originalPrice: 20_000,
    offerPrice: 10_000,
    couponCode: "BTECH50",
    purchaseUrl:
      "https://learn.civilezy.in/checkout?product_id=6221&product_type=membership&price_id=288691",
    previewUrl:
      "https://learn.civilezy.in/student/courses/43778/watch?lesson_id=628162",
    features: [
      "1 Year Validity",
      "Exam-Focused Notes",
      "Smart Revision Sections",
      "Practice Questions",
      "Free Preview Available",
    ],
  },
  {
    id: "itikwa",
    title: "ITI + KWA Bundle",
    subtitle: "ITI · KWA Draftsman Gr. II",
    originalPrice: 20_000,
    offerPrice: 10_000,
    couponCode: "ITIPLUS50",
    purchaseUrl:
      "https://learn.civilezy.in/checkout?product_id=6222&product_type=membership&price_id=288692",
    previewUrl:
      "https://learn.civilezy.in/student/courses/44238/watch?lesson_id=633676",
    features: [
      "1 Year Validity",
      "2 Exam Levels Covered",
      "Smart Revision Sections",
      "Practice Questions",
      "Free Preview Available",
    ],
  },
  {
    id: "diplomakwa",
    title: "Diploma + ITI + KWA",
    subtitle: "3 Exams · Best Combo",
    originalPrice: 24_000,
    offerPrice: 12_000,
    couponCode: "DIPLOMAPLUS50",
    purchaseUrl:
      "https://learn.civilezy.in/checkout?product_id=6223&product_type=membership&price_id=288693",
    features: [
      "1 Year Validity",
      "3 Exam Levels Covered",
      "Smart Revision Sections",
      "Practice Questions",
      "Bundle Savings Included",
    ],
  },
  {
    id: "ultimate",
    title: "Ultimate Bundle",
    subtitle: "B.Tech · Diploma · ITI · KWA",
    originalPrice: 30_000,
    offerPrice: 15_000,
    couponCode: "BTECHPLUS50",
    purchaseUrl:
      "https://learn.civilezy.in/checkout?product_id=6224&product_type=membership&price_id=288694",
    features: [
      "1 Year Validity",
      "All 4 Exam Levels",
      "Smart Revision Sections",
      "Practice Questions",
      "Maximum Savings — ₹15,000",
    ],
    featured: true,
  },
];

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ visible }: { visible: boolean }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "32px",
        left: "50%",
        transform: `translateX(-50%) translateY(${visible ? "0" : "12px"})`,
        opacity: visible ? 1 : 0,
        transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        zIndex: 9999,
        pointerEvents: "none",
        background: "rgba(10,20,40,0.96)",
        border: "1px solid rgba(34,197,94,0.35)",
        borderRadius: "12px",
        padding: "11px 20px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        backdropFilter: "blur(20px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: "18px",
          height: "18px",
          background: "rgba(34,197,94,0.15)",
          border: "1px solid rgba(34,197,94,0.35)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "10px",
          color: "#4ade80",
          flexShrink: 0,
        }}
      >
        ✓
      </span>
      <span
        style={{
          fontSize: "14px",
          fontWeight: 600,
          color: "rgba(255,255,255,0.9)",
          fontFamily: "Nunito, sans-serif",
        }}
      >
        Coupon copied to clipboard
      </span>
    </div>
  );
}

// ─── Plan card ────────────────────────────────────────────────────────────────
// Uses flex-column + flex:1 spacer so buttons always pin to the bottom.
// The top ribbon area is identical height for every card — featured gets color,
// others get a transparent filler — so every card in a grid row is the same height.

function PlanCard({
  plan,
  onCopy,
}: {
  plan: Plan;
  onCopy: (code: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const savings = plan.originalPrice - plan.offerPrice;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        // Equal-height via grid stretch
        display: "flex",
        flexDirection: "column",
        height: "100%",
        // Visual shell
        borderRadius: "20px",
        overflow: "hidden",
        border: plan.featured
          ? `1px solid ${hovered ? "rgba(255,184,0,0.65)" : "rgba(255,184,0,0.38)"}`
          : `1px solid ${hovered ? "rgba(255,98,0,0.35)" : "rgba(255,255,255,0.08)"}`,
        background: plan.featured
          ? "linear-gradient(160deg, rgba(255,184,0,0.07) 0%, rgba(11,26,54,0.85) 100%)"
          : "rgba(10,24,48,0.7)",
        backdropFilter: "blur(20px)",
        boxShadow: plan.featured
          ? hovered
            ? "0 0 0 1px rgba(255,184,0,0.3), 0 24px 60px rgba(255,184,0,0.18), 0 4px 20px rgba(0,0,0,0.5)"
            : "0 0 0 1px rgba(255,184,0,0.15), 0 8px 40px rgba(255,184,0,0.1), 0 4px 16px rgba(0,0,0,0.4)"
          : hovered
          ? "0 0 0 1px rgba(255,98,0,0.2), 0 24px 60px rgba(255,98,0,0.12), 0 4px 20px rgba(0,0,0,0.4)"
          : "0 4px 20px rgba(0,0,0,0.3)",
        transition:
          "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
        transform: hovered ? "translateY(-6px)" : "none",
        position: "relative",
      }}
    >
      {/* ── Ribbon row — identical height for ALL cards ── */}
      <div
        style={{
          height: "38px",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: plan.featured
            ? "linear-gradient(90deg, rgba(255,184,0,0.18), rgba(255,133,52,0.12), rgba(255,184,0,0.18))"
            : "rgba(255,255,255,0.02)",
          borderBottom: `1px solid ${plan.featured ? "rgba(255,184,0,0.2)" : "rgba(255,255,255,0.05)"}`,
        }}
      >
        {plan.featured ? (
          <span
            style={{
              fontSize: "11px",
              fontWeight: 800,
              color: "#FFB800",
              fontFamily: "Rajdhani, sans-serif",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            ⭐ BEST VALUE &nbsp;·&nbsp; MOST POPULAR
          </span>
        ) : (
          /* invisible placeholder keeps ribbon height identical */
          <span style={{ visibility: "hidden", fontSize: "11px" }}>·</span>
        )}
      </div>

      {/* ── Card body ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "28px",
        }}
      >
        {/* Badge row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "18px",
            flexWrap: "wrap",
            gap: "6px",
          }}
        >
          <span
            style={{
              fontSize: "10px",
              fontWeight: 700,
              padding: "3px 10px",
              borderRadius: "20px",
              background: "rgba(59,130,246,0.1)",
              border: "1px solid rgba(59,130,246,0.18)",
              color: "#93c5fd",
              fontFamily: "Rajdhani, sans-serif",
              letterSpacing: "0.07em",
              textTransform: "uppercase",
            }}
          >
            1 YEAR ACCESS
          </span>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 800,
              padding: "3px 10px",
              borderRadius: "20px",
              background: plan.featured
                ? "rgba(255,184,0,0.15)"
                : "rgba(255,98,0,0.12)",
              border: plan.featured
                ? "1px solid rgba(255,184,0,0.3)"
                : "1px solid rgba(255,98,0,0.25)",
              color: plan.featured ? "#FFB800" : "#FF8534",
              fontFamily: "Rajdhani, sans-serif",
              letterSpacing: "0.07em",
            }}
          >
            50% OFF
          </span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontFamily: "Rajdhani, sans-serif",
            fontSize: "20px",
            fontWeight: 700,
            color: "#fff",
            margin: "0 0 5px",
            lineHeight: 1.25,
          }}
        >
          {plan.title}
        </h3>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "13px",
            color: "rgba(255,255,255,0.4)",
            margin: "0 0 20px",
            fontFamily: "Nunito, sans-serif",
            fontWeight: 500,
          }}
        >
          {plan.subtitle}
        </p>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background: "rgba(255,255,255,0.06)",
            marginBottom: "20px",
          }}
        />

        {/* Pricing block */}
        <div style={{ marginBottom: "18px" }}>
          {/* Strikethrough original */}
          <div
            style={{
              fontSize: "14px",
              color: "rgba(255,255,255,0.28)",
              textDecoration: "line-through",
              fontFamily: "Rajdhani, sans-serif",
              fontWeight: 600,
              marginBottom: "4px",
              letterSpacing: "0.02em",
            }}
          >
            ₹{plan.originalPrice.toLocaleString("en-IN")}
          </div>
          {/* Offer price — visual focus */}
          <div
            style={{
              fontFamily: "Rajdhani, sans-serif",
              fontSize: "42px",
              fontWeight: 700,
              color: plan.featured ? "#FFB800" : "#FF8534",
              lineHeight: 1,
              marginBottom: "12px",
              letterSpacing: "-0.01em",
            }}
          >
            ₹{plan.offerPrice.toLocaleString("en-IN")}
          </div>
          {/* Savings */}
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "12px",
              fontWeight: 700,
              padding: "4px 11px",
              borderRadius: "20px",
              background: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.2)",
              color: "#4ade80",
              fontFamily: "Nunito, sans-serif",
            }}
          >
            Save ₹{savings.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Coupon box */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "10px",
            background: "rgba(255,98,0,0.055)",
            border: "1px dashed rgba(255,98,0,0.28)",
            borderRadius: "12px",
            padding: "11px 14px",
            marginBottom: "20px",
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
                marginBottom: "3px",
              }}
            >
              Coupon
            </div>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "16px",
                fontWeight: 700,
                color: plan.featured ? "#FFB800" : "#FF8534",
                letterSpacing: "0.08em",
              }}
            >
              {plan.couponCode}
            </div>
          </div>
          <button
            onClick={() => onCopy(plan.couponCode)}
            style={{
              padding: "7px 14px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              color: "rgba(255,255,255,0.6)",
              fontSize: "12px",
              fontWeight: 600,
              fontFamily: "Nunito, sans-serif",
              cursor: "pointer",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.background = "rgba(255,98,0,0.12)";
              el.style.borderColor = "rgba(255,98,0,0.3)";
              el.style.color = "#FF8534";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.background = "rgba(255,255,255,0.05)";
              el.style.borderColor = "rgba(255,255,255,0.1)";
              el.style.color = "rgba(255,255,255,0.6)";
            }}
          >
            <svg
              width="12"
              height="12"
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
            Copy
          </button>
        </div>

        {/* Features list */}
        <div style={{ marginBottom: "20px" }}>
          {plan.features.map((feat, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "7px 0",
                borderBottom:
                  i < plan.features.length - 1
                    ? "1px solid rgba(255,255,255,0.04)"
                    : "none",
              }}
            >
              <span
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  background: "rgba(34,197,94,0.1)",
                  border: "1px solid rgba(34,197,94,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: "9px",
                  color: "#4ade80",
                }}
              >
                ✓
              </span>
              <span
                style={{
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.65)",
                  fontFamily: "Nunito, sans-serif",
                  fontWeight: 500,
                  lineHeight: 1.4,
                }}
              >
                {feat}
              </span>
            </div>
          ))}
        </div>

        {/* ── Flex spacer — pushes everything below to card bottom ── */}
        <div style={{ flex: 1 }} />

        {/* Limited offer tag */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 700,
              padding: "3px 12px",
              borderRadius: "20px",
              background: "rgba(255,98,0,0.08)",
              border: "1px solid rgba(255,98,0,0.15)",
              color: "rgba(255,133,52,0.6)",
              fontFamily: "Rajdhani, sans-serif",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            🎯 LIMITED OFFER
          </span>
        </div>

        {/* Buttons — always at bottom */}
        <div style={{ display: "flex", gap: "10px" }}>
          {/* Primary: Claim Offer */}
          <a
            href={plan.purchaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "13px 14px",
              background: plan.featured
                ? "linear-gradient(135deg, #FFB800, #FF8534)"
                : "linear-gradient(135deg, #FF6200, #FF8534)",
              borderRadius: "12px",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 700,
              textDecoration: "none",
              fontFamily: "Nunito, sans-serif",
              boxShadow: plan.featured
                ? "0 4px 18px rgba(255,184,0,0.28)"
                : "0 4px 16px rgba(255,98,0,0.28)",
              transition: "filter 0.2s, box-shadow 0.2s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.filter = "brightness(1.1)";
              el.style.boxShadow = plan.featured
                ? "0 8px 28px rgba(255,184,0,0.45)"
                : "0 8px 24px rgba(255,98,0,0.45)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.filter = "none";
              el.style.boxShadow = plan.featured
                ? "0 4px 18px rgba(255,184,0,0.28)"
                : "0 4px 16px rgba(255,98,0,0.28)";
            }}
          >
            Claim Offer
          </a>

          {/* Secondary: Preview (only if URL exists) */}
          {plan.previewUrl && (
            <a
              href={plan.previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "13px 14px",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "12px",
                color: "rgba(255,255,255,0.6)",
                fontSize: "14px",
                fontWeight: 600,
                textDecoration: "none",
                fontFamily: "Nunito, sans-serif",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = "rgba(255,255,255,0.07)";
                el.style.borderColor = "rgba(255,255,255,0.22)";
                el.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = "transparent";
                el.style.borderColor = "rgba(255,255,255,0.12)";
                el.style.color = "rgba(255,255,255,0.6)";
              }}
            >
              Preview
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function EarlyBirdCampaign() {
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const plansRef = useRef<HTMLDivElement>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
      setToastVisible(true);
      toastTimer.current = setTimeout(() => setToastVisible(false), 2_500);
    });
  };

  const scrollToPlans = () => {
    plansRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <style>{`
        @keyframes float-blob {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(24px,-24px) scale(1.06); }
          66%      { transform: translate(-18px,18px) scale(0.94); }
        }
        .eb-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          align-items: stretch;
        }
        @media (max-width: 960px) {
          .eb-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .eb-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <Toast visible={toastVisible} />

      {/* ── Section ── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: [
            "linear-gradient(rgba(59,130,246,0.022) 1px, transparent 1px)",
            "linear-gradient(90deg, rgba(59,130,246,0.022) 1px, transparent 1px)",
            "linear-gradient(160deg, #07111F 0%, #0F2748 55%, #071420 100%)",
          ].join(", "),
          backgroundSize: "48px 48px, 48px 48px, auto",
          padding: "80px 24px",
          marginBottom: "64px",
          borderRadius: "24px",
          fontFamily: "Nunito, sans-serif",
        }}
      >
        {/* Ambient glows */}
        <div
          style={{
            position: "absolute",
            top: "-220px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "900px",
            height: "440px",
            background:
              "radial-gradient(ellipse, rgba(255,98,0,0.07) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-120px",
            right: "-80px",
            width: "500px",
            height: "500px",
            background:
              "radial-gradient(circle, rgba(59,130,246,0.055) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />

        {/* ── Content ── */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {/* ── Hero banner ── */}
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              background: "rgba(255,255,255,0.022)",
              border: "1px solid rgba(255,255,255,0.075)",
              borderRadius: "24px",
              padding: "clamp(40px,6vw,68px) clamp(24px,5vw,60px)",
              marginBottom: "56px",
              textAlign: "center",
              backdropFilter: "blur(24px)",
            }}
          >
            {/* Floating blobs */}
            <div
              style={{
                position: "absolute",
                top: "-80px",
                right: "-80px",
                width: "360px",
                height: "360px",
                background:
                  "radial-gradient(circle, rgba(255,98,0,0.2) 0%, transparent 65%)",
                filter: "blur(70px)",
                animation: "float-blob 9s ease-in-out infinite",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "-70px",
                left: "-50px",
                width: "320px",
                height: "320px",
                background:
                  "radial-gradient(circle, rgba(59,130,246,0.16) 0%, transparent 65%)",
                filter: "blur(70px)",
                animation: "float-blob 12s ease-in-out infinite 3.5s",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "45%",
                width: "220px",
                height: "220px",
                background:
                  "radial-gradient(circle, rgba(255,184,0,0.07) 0%, transparent 65%)",
                filter: "blur(50px)",
                transform: "translate(-50%,-50%)",
                pointerEvents: "none",
              }}
            />

            {/* Hero content */}
            <div style={{ position: "relative", zIndex: 1 }}>
              {/* Badge */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(255,98,0,0.12)",
                  border: "1px solid rgba(255,98,0,0.25)",
                  borderRadius: "20px",
                  padding: "6px 18px",
                  marginBottom: "20px",
                }}
              >
                <span>🔥</span>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#FF8534",
                    fontFamily: "Rajdhani, sans-serif",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  Early Bird Offer
                </span>
              </div>

              {/* Headline */}
              <h2
                style={{
                  fontFamily: "Rajdhani, sans-serif",
                  fontSize: "clamp(34px,5vw,52px)",
                  fontWeight: 800,
                  color: "#fff",
                  margin: "0 0 12px",
                  lineHeight: 1.1,
                  letterSpacing: "-0.01em",
                }}
              >
                Save Up To{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #FF6200, #FF8534)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  50%
                </span>
              </h2>

              {/* Sub-headline */}
              <p
                style={{
                  fontSize: "18px",
                  color: "rgba(255,255,255,0.6)",
                  margin: "0 0 6px",
                  fontWeight: 500,
                }}
              >
                1 Year Premium Access to CivilEzy E-Books
              </p>
              <p
                style={{
                  fontSize: "15px",
                  color: "rgba(255,255,255,0.38)",
                  margin: "0 0 32px",
                }}
              >
                For Kerala PSC Civil Engineering Aspirants
              </p>

              {/* Feature pills */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: "10px",
                  marginBottom: "32px",
                }}
              >
                {[
                  { icon: "📅", label: "1 Year Access" },
                  { icon: "⚡", label: "Instant Access" },
                  { icon: "🏷️", label: "50% OFF" },
                ].map(({ icon, label }) => (
                  <span
                    key={label}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "7px",
                      padding: "8px 18px",
                      background: "rgba(255,255,255,0.045)",
                      border: "1px solid rgba(255,255,255,0.09)",
                      borderRadius: "20px",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.65)",
                    }}
                  >
                    {icon} {label}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <button
                onClick={scrollToPlans}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "14px 36px",
                  background: "linear-gradient(135deg, #FF6200, #FF8534)",
                  border: "none",
                  borderRadius: "14px",
                  color: "#fff",
                  fontSize: "16px",
                  fontWeight: 700,
                  fontFamily: "Nunito, sans-serif",
                  cursor: "pointer",
                  boxShadow: "0 4px 20px rgba(255,98,0,0.35)",
                  transition: "filter 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.filter = "brightness(1.1)";
                  el.style.boxShadow = "0 8px 28px rgba(255,98,0,0.52)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.filter = "none";
                  el.style.boxShadow = "0 4px 20px rgba(255,98,0,0.35)";
                }}
              >
                Explore Plans
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* ── Plans grid ── */}
          <div ref={plansRef} className="eb-grid">
            {PLANS.map((plan) => (
              <PlanCard key={plan.id} plan={plan} onCopy={handleCopy} />
            ))}
          </div>

          {/* ── Reassurance strip ── */}
          <div
            style={{
              marginTop: "40px",
              padding: "18px 24px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: "16px",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              gap: "28px",
            }}
          >
            {[
              { icon: "🔒", text: "Secure Checkout" },
              { icon: "⚡", text: "Instant Access" },
              { icon: "📅", text: "1 Year Validity" },
              { icon: "📲", text: "WhatsApp: 9072345630" },
              { icon: "🎯", text: "Kerala PSC Focused" },
            ].map(({ icon, text }) => (
              <div
                key={text}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.35)",
                  fontFamily: "Nunito, sans-serif",
                  fontWeight: 500,
                }}
              >
                <span>{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

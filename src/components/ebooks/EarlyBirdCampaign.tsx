"use client";

import { useState, useEffect, useRef } from "react";

// ─── Plan definitions ─────────────────────────────────────────────────────────

interface Plan {
  id: string;
  title: string;
  originalPrice: number;
  offerPrice: number;
  couponCode: string;
  purchaseUrl: string;
  previewUrl?: string;
  featured?: boolean;
}

const PLANS: Plan[] = [
  {
    id: "iti",
    title: "Overseer Gr. III (ITI Level)",
    originalPrice: 15_000,
    offerPrice: 7_500,
    couponCode: "ITI50",
    purchaseUrl: "https://learn.civilezy.in/checkout?product_id=6219&product_type=membership&price_id=288688",
    previewUrl:  "https://learn.civilezy.in/student/courses/43997/watch?lesson_id=630942",
  },
  {
    id: "diploma",
    title: "Overseer Gr. I / Instructor (Diploma Level)",
    originalPrice: 18_000,
    offerPrice: 9_000,
    couponCode: "DIPLOMA50",
    purchaseUrl: "https://learn.civilezy.in/checkout?product_id=6220&product_type=membership&price_id=288689",
    previewUrl:  "https://learn.civilezy.in/student/courses/43387/watch/?lesson_id=620443",
  },
  {
    id: "btech",
    title: "Assistant Engineer – Irrigation (B.Tech Level)",
    originalPrice: 20_000,
    offerPrice: 10_000,
    couponCode: "BTECH50",
    purchaseUrl: "https://learn.civilezy.in/checkout?product_id=6221&product_type=membership&price_id=288691",
    previewUrl:  "https://learn.civilezy.in/student/courses/43778/watch?lesson_id=628162",
  },
  {
    id: "itikwa",
    title: "ITI + KWA Draftsman Gr. II Bundle",
    originalPrice: 20_000,
    offerPrice: 10_000,
    couponCode: "ITIPLUS50",
    purchaseUrl: "https://learn.civilezy.in/checkout?product_id=6222&product_type=membership&price_id=288692",
    previewUrl:  "https://learn.civilezy.in/student/courses/44238/watch?lesson_id=633676",
  },
  {
    id: "diplomakwa",
    title: "Diploma + ITI + KWA Draftsman Gr. II Bundle",
    originalPrice: 24_000,
    offerPrice: 12_000,
    couponCode: "DIPLOMAPLUS50",
    purchaseUrl: "https://learn.civilezy.in/checkout?product_id=6223&product_type=membership&price_id=288693",
  },
  {
    id: "ultimate",
    title: "B.Tech + Diploma + ITI + KWA Draftsman Gr. II Bundle",
    originalPrice: 30_000,
    offerPrice: 15_000,
    couponCode: "BTECHPLUS50",
    purchaseUrl: "https://learn.civilezy.in/checkout?product_id=6224&product_type=membership&price_id=288694",
    featured: true,
  },
];

// ─── Toast component ──────────────────────────────────────────────────────────

function Toast({ visible }: { visible: boolean }) {
  return (
    <div style={{
      position: "fixed", bottom: "28px", left: "50%",
      transform: `translateX(-50%) translateY(${visible ? "0" : "20px"})`,
      opacity: visible ? 1 : 0,
      transition: "all 0.3s ease",
      zIndex: 9999,
      pointerEvents: "none",
      background: "linear-gradient(135deg, rgba(34,197,94,0.95), rgba(22,163,74,0.95))",
      border: "1px solid rgba(34,197,94,0.5)",
      borderRadius: "12px",
      padding: "12px 24px",
      display: "flex", alignItems: "center", gap: "10px",
      backdropFilter: "blur(12px)",
      boxShadow: "0 8px 32px rgba(34,197,94,0.3), 0 4px 16px rgba(0,0,0,0.4)",
      whiteSpace: "nowrap",
    }}>
      <span style={{ fontSize: "18px" }}>✓</span>
      <span style={{ fontSize: "14px", fontWeight: 700, color: "#fff", fontFamily: "Nunito, sans-serif" }}>
        Coupon copied successfully!
      </span>
    </div>
  );
}

// ─── Plan card ────────────────────────────────────────────────────────────────

function PlanCard({
  plan,
  onCopy,
}: {
  plan: Plan;
  onCopy: (code: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const savings = plan.originalPrice - plan.offerPrice;
  const discountPct = Math.round((savings / plan.originalPrice) * 100);

  const featuredGlow = plan.featured
    ? hovered
      ? "0 0 40px rgba(255,184,0,0.45), 0 20px 60px rgba(0,0,0,0.6)"
      : "0 0 24px rgba(255,184,0,0.3), 0 8px 40px rgba(0,0,0,0.5)"
    : hovered
    ? "0 20px 60px rgba(255,98,0,0.25), 0 8px 32px rgba(0,0,0,0.5)"
    : "0 4px 24px rgba(0,0,0,0.3)";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        background: plan.featured
          ? "linear-gradient(145deg, rgba(255,184,0,0.1) 0%, rgba(255,133,52,0.07) 50%, rgba(255,184,0,0.06) 100%)"
          : hovered
          ? "rgba(255,98,0,0.07)"
          : "rgba(255,255,255,0.03)",
        border: plan.featured
          ? `1px solid ${hovered ? "rgba(255,184,0,0.7)" : "rgba(255,184,0,0.45)"}`
          : `1px solid ${hovered ? "rgba(255,98,0,0.5)" : "rgba(255,255,255,0.1)"}`,
        borderRadius: "20px",
        padding: plan.featured ? "28px 24px" : "24px",
        transition: "all 0.28s cubic-bezier(0.34,1.56,0.64,1)",
        transform: hovered
          ? plan.featured
            ? "translateY(-8px) scale(1.015)"
            : "translateY(-6px)"
          : "none",
        boxShadow: featuredGlow,
        backdropFilter: "blur(16px)",
        overflow: "hidden",
        /* Mobile pinning: featured card appears first */
        order: plan.featured ? -1 : 0,
        flexShrink: 0,
      }}
    >
      {/* Top sheen */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: plan.featured
          ? "linear-gradient(90deg, transparent, rgba(255,184,0,0.6), transparent)"
          : "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
      }} />

      {/* ── Featured crown badges ── */}
      {plan.featured && (
        <>
          <style>{`
            @keyframes golden-pulse {
              0%,100% { box-shadow: 0 0 0 0 rgba(255,184,0,0); }
              50%      { box-shadow: 0 0 16px 4px rgba(255,184,0,0.35); }
            }
            @keyframes badge-pulse {
              0%,100% { transform: scale(1); }
              50%      { transform: scale(1.06); }
            }
          `}</style>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "5px",
              background: "linear-gradient(135deg, #FFB800, #FF8534)",
              color: "#000", fontSize: "11px", fontWeight: 800,
              padding: "5px 12px", borderRadius: "20px",
              fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.08em",
              textTransform: "uppercase",
              animation: "golden-pulse 2.5s ease-in-out infinite",
            }}>
              ⭐ BEST VALUE
            </span>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "5px",
              background: "rgba(255,184,0,0.12)", border: "1px solid rgba(255,184,0,0.3)",
              color: "#FFB800", fontSize: "11px", fontWeight: 700,
              padding: "5px 12px", borderRadius: "20px",
              fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.06em",
            }}>
              🏆 MOST POPULAR
            </span>
          </div>
        </>
      )}

      {/* 50% OFF badge — top right corner */}
      <div style={{
        position: "absolute", top: plan.featured ? "24px" : "18px", right: "18px",
        background: "linear-gradient(135deg, #FF6200, #FF8534)",
        color: "#fff", fontSize: "10px", fontWeight: 800,
        padding: "4px 10px", borderRadius: "20px",
        fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.08em",
        boxShadow: "0 4px 12px rgba(255,98,0,0.4)",
        animation: "badge-pulse 2.5s ease-in-out infinite",
      }}>
        {discountPct}% OFF
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: "Rajdhani, sans-serif",
        fontSize: plan.featured ? "22px" : "19px",
        fontWeight: 700, color: "#fff",
        margin: "0 0 16px",
        lineHeight: 1.25,
        paddingRight: "68px",
      }}>
        {plan.title}
      </h3>

      {/* Pricing */}
      <div style={{
        display: "flex", alignItems: "baseline",
        gap: "10px", flexWrap: "wrap", marginBottom: "14px",
      }}>
        <span style={{
          fontSize: "16px", color: "rgba(255,255,255,0.35)",
          textDecoration: "line-through",
          fontFamily: "Rajdhani, sans-serif", fontWeight: 600,
        }}>
          ₹{plan.originalPrice.toLocaleString("en-IN")}
        </span>
        <span style={{
          fontSize: plan.featured ? "36px" : "32px",
          fontWeight: 700,
          color: plan.featured ? "#FFB800" : "#FF8534",
          fontFamily: "Rajdhani, sans-serif",
          lineHeight: 1,
        }}>
          ₹{plan.offerPrice.toLocaleString("en-IN")}
        </span>
      </div>

      {/* Savings + Feature badges */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
        <span style={{
          fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "20px",
          background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)",
          color: "#22c55e", fontFamily: "Rajdhani, sans-serif",
        }}>
          💰 Save ₹{savings.toLocaleString("en-IN")}
        </span>
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

      {/* Coupon code box */}
      <div style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px dashed rgba(255,98,0,0.4)",
        borderRadius: "12px",
        padding: "10px 14px",
        marginBottom: "16px",
        display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: "10px",
        flexWrap: "wrap",
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
            fontFamily: "monospace", fontSize: "17px", fontWeight: 700,
            color: plan.featured ? "#FFB800" : "#FF8534",
            letterSpacing: "0.1em",
          }}>
            {plan.couponCode}
          </div>
        </div>
        <button
          onClick={() => onCopy(plan.couponCode)}
          style={{
            padding: "8px 16px",
            background: "rgba(255,98,0,0.15)",
            border: "1px solid rgba(255,98,0,0.35)",
            borderRadius: "9px",
            color: "#FF8534",
            fontSize: "12px", fontWeight: 700,
            fontFamily: "Nunito, sans-serif",
            cursor: "pointer",
            transition: "all 0.2s",
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,98,0,0.25)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 12px rgba(255,98,0,0.3)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,98,0,0.15)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
          }}
        >
          📋 Copy
        </button>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {/* Purchase */}
        {plan.purchaseUrl && (
          <a
            href={plan.purchaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              gap: "6px",
              padding: plan.featured ? "13px 18px" : "11px 16px",
              background: plan.featured
                ? "linear-gradient(135deg, #FFB800, #FF8534)"
                : "linear-gradient(135deg, #FF6200, #FF8534)",
              borderRadius: "12px",
              color: "#fff",
              fontSize: plan.featured ? "14px" : "13px",
              fontWeight: 700,
              textDecoration: "none",
              fontFamily: "Nunito, sans-serif",
              boxShadow: plan.featured
                ? "0 4px 20px rgba(255,184,0,0.4)"
                : "0 4px 16px rgba(255,98,0,0.35)",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
              minWidth: 0,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.03)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = plan.featured
                ? "0 8px 28px rgba(255,184,0,0.55)"
                : "0 8px 24px rgba(255,98,0,0.5)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = "none";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = plan.featured
                ? "0 4px 20px rgba(255,184,0,0.4)"
                : "0 4px 16px rgba(255,98,0,0.35)";
            }}
          >
            🛒 Claim Offer
          </a>
        )}

        {/* Preview */}
        {plan.previewUrl && (
          <a
            href={plan.previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              gap: "6px",
              padding: "11px 14px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "12px",
              color: "rgba(255,255,255,0.75)",
              fontSize: "13px", fontWeight: 700,
              textDecoration: "none",
              fontFamily: "Nunito, sans-serif",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.1)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.3)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.06)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.15)";
            }}
          >
            👁️ Preview
          </a>
        )}
      </div>
    </div>
  );
}

// ─── Scroll-triggered fade-in hook ───────────────────────────────────────────

function useFadeIn() {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.08 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

// ─── Main EarlyBirdCampaign component ────────────────────────────────────────

export default function EarlyBirdCampaign() {
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { ref: sectionRef, visible: sectionVisible } = useFadeIn();

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      setToastVisible(true);
      toastTimerRef.current = setTimeout(() => setToastVisible(false), 2_500);
    });
  };

  return (
    <>
      {/* Global styles for this section */}
      <style>{`
        @keyframes banner-gradient {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes glow-orb {
          0%,100% { opacity: 0.4; transform: scale(1); }
          50%      { opacity: 0.75; transform: scale(1.2); }
        }
        @keyframes badge-pulse {
          0%,100% { transform: scale(1); }
          50%      { transform: scale(1.06); }
        }
        @keyframes golden-pulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(255,184,0,0); }
          50%      { box-shadow: 0 0 16px 4px rgba(255,184,0,0.35); }
        }
        @keyframes section-fadein {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .eb-section-visible {
          animation: section-fadein 0.6s ease-out both;
        }
        .eb-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media (max-width: 900px) {
          .eb-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .eb-grid {
            grid-template-columns: 1fr;
            display: flex;
            flex-direction: column;
          }
        }
      `}</style>

      <Toast visible={toastVisible} />

      <section
        ref={sectionRef as React.RefObject<HTMLElement>}
        className={sectionVisible ? "eb-section-visible" : ""}
        style={{ marginBottom: "72px", opacity: sectionVisible ? undefined : 0 }}
      >

        {/* ── Promotional Banner ── */}
        <div style={{
          position: "relative",
          background: "linear-gradient(270deg, #FF6200, #FF8534, #FF4500, #FF8534, #FF6200)",
          backgroundSize: "300% 300%",
          animation: "banner-gradient 6s ease infinite",
          borderRadius: "20px",
          padding: "36px 28px",
          marginBottom: "28px",
          overflow: "hidden",
          boxShadow: "0 8px 48px rgba(255,98,0,0.4), 0 4px 16px rgba(0,0,0,0.4)",
        }}>
          {/* Animated background orbs */}
          <div style={{
            position: "absolute", top: "-80px", right: "-80px",
            width: "300px", height: "300px",
            background: "radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 65%)",
            animation: "glow-orb 4s ease-in-out infinite",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", bottom: "-60px", left: "-60px",
            width: "240px", height: "240px",
            background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 65%)",
            animation: "glow-orb 4s ease-in-out infinite 2s",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", top: "50%", left: "30%",
            width: "180px", height: "180px",
            background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 65%)",
            transform: "translateY(-50%)",
            animation: "glow-orb 5s ease-in-out infinite 1s",
            pointerEvents: "none",
          }} />

          {/* Content */}
          <div style={{ position: "relative", textAlign: "center" }}>
            {/* Top badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "rgba(0,0,0,0.2)",
              borderRadius: "20px", padding: "5px 16px",
              marginBottom: "14px",
              border: "1px solid rgba(255,255,255,0.2)",
            }}>
              <span style={{ fontSize: "14px" }}>🔥</span>
              <span style={{
                fontSize: "12px", fontWeight: 800, color: "#fff",
                fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}>
                Early Bird Offer
              </span>
            </div>

            {/* Main headline */}
            <h2 style={{
              fontFamily: "Rajdhani, sans-serif",
              fontSize: "clamp(28px, 5vw, 48px)",
              fontWeight: 700, color: "#fff",
              margin: "0 0 8px", lineHeight: 1.1,
              textShadow: "0 2px 12px rgba(0,0,0,0.3)",
            }}>
              🔥 Early Bird Offer –{" "}
              <span style={{ color: "#fff", textShadow: "0 0 20px rgba(255,255,255,0.6)" }}>
                50% OFF
              </span>
            </h2>

            {/* Sub headline */}
            <p style={{
              fontSize: "clamp(14px, 2.5vw, 17px)",
              color: "rgba(255,255,255,0.92)",
              margin: "0 0 6px",
              fontFamily: "Nunito, sans-serif",
            }}>
              Get Kerala PSC Civil Engineering E-Books at half price.
            </p>
            <p style={{
              fontSize: "clamp(13px, 2vw, 15px)",
              color: "rgba(255,255,255,0.8)",
              margin: "0 0 24px",
              fontFamily: "Nunito, sans-serif", fontWeight: 600,
            }}>
              Limited offer for the first 100 students.
            </p>

            {/* Feature pills */}
            <div style={{
              display: "flex", flexWrap: "wrap",
              justifyContent: "center", gap: "10px", marginBottom: "20px",
            }}>
              {[
                { icon: "📚", label: "1 Year Access" },
                { icon: "⚡", label: "Instant Access" },
                { icon: "🎁", label: "Limited Time Offer" },
              ].map(({ icon, label }) => (
                <span key={label} style={{
                  display: "inline-flex", alignItems: "center", gap: "7px",
                  padding: "7px 16px",
                  background: "rgba(0,0,0,0.2)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  borderRadius: "20px",
                  fontSize: "13px", fontWeight: 700,
                  color: "#fff",
                  fontFamily: "Nunito, sans-serif",
                  backdropFilter: "blur(8px)",
                }}>
                  {icon} {label}
                </span>
              ))}
            </div>

            {/* WhatsApp support */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "rgba(0,0,0,0.25)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "12px", padding: "8px 18px",
              backdropFilter: "blur(8px)",
            }}>
              <span style={{ fontSize: "16px" }}>📲</span>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#fff", fontFamily: "Nunito, sans-serif" }}>
                WhatsApp Support:{" "}
                <a
                  href="https://wa.me/919072345630"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#fff", textDecoration: "none", letterSpacing: "0.03em" }}
                >
                  9072345630
                </a>
              </span>
            </div>
          </div>
        </div>

        {/* ── Plan cards grid ── */}
        <div className="eb-grid">
          {PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} onCopy={handleCopy} />
          ))}
        </div>

        {/* ── Bottom reassurance strip ── */}
        <div style={{
          marginTop: "28px",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "14px",
          padding: "16px 24px",
          display: "flex", flexWrap: "wrap",
          alignItems: "center", justifyContent: "center",
          gap: "20px",
        }}>
          {[
            { icon: "🔒", text: "Secure Payment" },
            { icon: "📲", text: "Instant Delivery" },
            { icon: "📅", text: "1 Year Validity" },
            { icon: "🎯", text: "Kerala PSC Focused" },
            { icon: "✅", text: "Syllabus Based" },
          ].map(({ icon, text }) => (
            <div key={text} style={{
              display: "flex", alignItems: "center", gap: "7px",
              fontSize: "13px", color: "rgba(255,255,255,0.55)",
              fontFamily: "Nunito, sans-serif", fontWeight: 600,
            }}>
              <span>{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

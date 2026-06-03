"use client";

import { useState } from "react";

// ── Static plan data ──────────────────────────────────────────────────────────

interface Plan {
  id: string;
  title: string;
  original: number;
  offer: number;
  coupon: string;
  previewUrl?: string;
  purchaseUrl: string;
  bestValue?: boolean;
}

const PLANS: Plan[] = [
  {
    id: "iti",
    title: "ITI Level E-Book",
    original: 15000,
    offer: 7500,
    coupon: "ITI50",
    previewUrl: "https://learn.civilezy.in/student/courses/43997/watch?lesson_id=630942",
    purchaseUrl: "https://learn.civilezy.in/checkout?product_id=6219&product_type=membership&price_id=288688",
  },
  {
    id: "diploma",
    title: "Diploma Level E-Book",
    original: 18000,
    offer: 9000,
    coupon: "DIPLOMA50",
    previewUrl: "https://learn.civilezy.in/student/courses/43387/watch/?lesson_id=620443",
    purchaseUrl: "https://learn.civilezy.in/checkout?product_id=6220&product_type=membership&price_id=288689",
  },
  {
    id: "btech",
    title: "B.Tech Level E-Book",
    original: 20000,
    offer: 10000,
    coupon: "BTECH50",
    previewUrl: "https://learn.civilezy.in/student/courses/43778/watch?lesson_id=628162",
    purchaseUrl: "https://learn.civilezy.in/checkout?product_id=6221&product_type=membership&price_id=288691",
  },
  {
    id: "iti-kwa",
    title: "ITI + KWA Bundle",
    original: 20000,
    offer: 10000,
    coupon: "ITIPLUS50",
    purchaseUrl: "https://learn.civilezy.in/checkout?product_id=6222&product_type=membership&price_id=288692",
  },
  {
    id: "diploma-bundle",
    title: "Diploma + ITI + KWA Bundle",
    original: 24000,
    offer: 12000,
    coupon: "DIPLOMAPLUS50",
    purchaseUrl: "https://learn.civilezy.in/checkout?product_id=6223&product_type=membership&price_id=288693",
  },
  {
    id: "ultimate",
    title: "Ultimate Bundle",
    original: 30000,
    offer: 15000,
    coupon: "BTECHPLUS50",
    purchaseUrl: "https://learn.civilezy.in/checkout?product_id=6224&product_type=membership&price_id=288694",
    bestValue: true,
  },
];

const HERO_BADGES = [
  "✔ Topic-wise Learning",
  "✔ Exam-Oriented Notes",
  "✔ Smart Revision",
  "✔ Practice Questions",
  "✔ Structured Study Plan",
  "✔ Free Preview Available",
];

// ── Root component ────────────────────────────────────────────────────────────

export default function PSCMembershipPlans() {
  return (
    <section style={{ marginBottom: "64px" }}>
      <style>{`
        @keyframes psc-glow {
          0%,100% { box-shadow: 0 0 28px rgba(255,98,0,0.25), 0 8px 40px rgba(0,0,0,0.45); }
          50%      { box-shadow: 0 0 48px rgba(255,98,0,0.45), 0 8px 40px rgba(0,0,0,0.45); }
        }
        .psc-hero-banner { animation: psc-glow 3.5s ease-in-out infinite; }
        .psc-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media (max-width: 960px) {
          .psc-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .psc-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <HeroBanner />
      <PromoStrip />

      <div className="psc-grid">
        {PLANS.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </section>
  );
}

// ── Hero banner ───────────────────────────────────────────────────────────────

function HeroBanner() {
  return (
    <div
      className="psc-hero-banner"
      style={{
        position: "relative",
        background:
          "linear-gradient(135deg, rgba(255,98,0,0.16) 0%, rgba(11,30,61,0.9) 50%, rgba(255,98,0,0.12) 100%)",
        border: "1px solid rgba(255,98,0,0.35)",
        borderRadius: "24px",
        padding: "40px 36px",
        marginBottom: "20px",
        overflow: "hidden",
        backdropFilter: "blur(16px)",
      }}
    >
      {/* Background orbs */}
      <div style={{
        position: "absolute", top: "-60px", right: "-60px",
        width: "280px", height: "280px",
        background: "radial-gradient(circle, rgba(255,98,0,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-50px", left: "-50px",
        width: "220px", height: "220px",
        background: "radial-gradient(circle, rgba(255,133,52,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Pill badge */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: "8px",
        background: "rgba(255,98,0,0.18)",
        border: "1px solid rgba(255,98,0,0.4)",
        borderRadius: "20px", padding: "5px 16px",
        marginBottom: "16px",
      }}>
        <span style={{ fontSize: "13px" }}>📚</span>
        <span style={{
          fontSize: "11px", fontWeight: 700, color: "#FF8534",
          fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}>
          1 Year Access Plans
        </span>
      </div>

      <h2 style={{
        fontFamily: "Rajdhani, sans-serif",
        fontSize: "clamp(24px, 3.5vw, 38px)",
        fontWeight: 700, color: "#fff",
        margin: "0 0 12px", lineHeight: 1.15,
      }}>
        📚 CivilEzy PSC E-Books –{" "}
        <span style={{
          background: "linear-gradient(135deg, #FF6200, #FF8534)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          1 Year Access Plans
        </span>
      </h2>

      <p style={{
        fontSize: "15px",
        color: "rgba(255,255,255,0.65)",
        margin: "0 0 24px",
        maxWidth: "600px",
        lineHeight: 1.6,
      }}>
        Prepare smarter with structured, exam-focused E-Books designed specifically
        for Kerala PSC Civil Engineering exams.
      </p>

      {/* Feature badges */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: "8px",
        marginBottom: "28px",
      }}>
        {HERO_BADGES.map((badge) => (
          <span key={badge} style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "6px 14px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "20px",
            fontSize: "12px", fontWeight: 700,
            color: "rgba(255,255,255,0.75)",
            fontFamily: "Nunito, sans-serif",
          }}>
            {badge}
          </span>
        ))}
      </div>

      {/* CTA buttons */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <a
          href="#psc-plans"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("psc-plans")?.scrollIntoView({ behavior: "smooth" });
          }}
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "13px 28px",
            background: "linear-gradient(135deg, #FF6200, #FF8534)",
            borderRadius: "12px",
            color: "#fff", fontSize: "14px", fontWeight: 700,
            textDecoration: "none",
            fontFamily: "Nunito, sans-serif",
            boxShadow: "0 4px 20px rgba(255,98,0,0.4)",
            cursor: "pointer",
          }}
        >
          📋 View Plans
        </a>
        <a
          href="https://learn.civilezy.in"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "13px 28px",
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.16)",
            borderRadius: "12px",
            color: "rgba(255,255,255,0.85)",
            fontSize: "14px", fontWeight: 700,
            textDecoration: "none",
            fontFamily: "Nunito, sans-serif",
          }}
        >
          🚀 Start Preparation
        </a>
      </div>
    </div>
  );
}

// ── Promotional strip ─────────────────────────────────────────────────────────

function PromoStrip() {
  return (
    <div
      id="psc-plans"
      style={{
        background: "linear-gradient(90deg, rgba(255,98,0,0.2) 0%, rgba(255,133,52,0.12) 50%, rgba(255,98,0,0.2) 100%)",
        border: "1px solid rgba(255,98,0,0.3)",
        borderRadius: "16px",
        padding: "16px 24px",
        marginBottom: "24px",
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        <span style={{ fontSize: "18px" }}>🔥</span>
        <span style={{
          fontFamily: "Rajdhani, sans-serif",
          fontSize: "16px", fontWeight: 700, color: "#FF8534",
          letterSpacing: "0.05em",
        }}>
          EARLY BIRD OFFER
        </span>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {[
            "50% Discount for First 100 Students",
            "1 Year Access Included",
            "Instant Access After Purchase",
          ].map((label) => (
            <span key={label} style={{
              fontSize: "11px", fontWeight: 700, padding: "3px 10px",
              borderRadius: "20px",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.14)",
              color: "rgba(255,255,255,0.75)",
              fontFamily: "Nunito, sans-serif",
            }}>
              {label}
            </span>
          ))}
        </div>
      </div>

      <a
        href="https://wa.me/919072345630"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          padding: "9px 18px",
          background: "rgba(37,211,102,0.15)",
          border: "1px solid rgba(37,211,102,0.35)",
          borderRadius: "12px",
          color: "#25D366",
          fontSize: "13px", fontWeight: 700,
          textDecoration: "none",
          fontFamily: "Nunito, sans-serif",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        WhatsApp: 9072345630
      </a>
    </div>
  );
}

// ── Plan card ─────────────────────────────────────────────────────────────────

function PlanCard({ plan }: { plan: Plan }) {
  const [hovered, setHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const savings = plan.original - plan.offer;
  const discountPct = Math.round((savings / plan.original) * 100);

  const handleCopy = () => {
    navigator.clipboard.writeText(plan.coupon).then(() => {
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
        background: plan.bestValue
          ? hovered
            ? "rgba(255,184,0,0.1)"
            : "rgba(255,184,0,0.06)"
          : hovered
          ? "rgba(255,98,0,0.08)"
          : "rgba(255,255,255,0.03)",
        border: plan.bestValue
          ? `1px solid ${hovered ? "rgba(255,184,0,0.6)" : "rgba(255,184,0,0.35)"}`
          : `1px solid ${hovered ? "rgba(255,98,0,0.45)" : "rgba(255,255,255,0.1)"}`,
        borderRadius: "20px",
        padding: "24px",
        transition: "all 0.25s ease",
        transform: hovered ? "translateY(-5px)" : "none",
        boxShadow: hovered
          ? plan.bestValue
            ? "0 20px 60px rgba(255,184,0,0.2), 0 8px 24px rgba(0,0,0,0.5)"
            : "0 20px 60px rgba(255,98,0,0.18), 0 8px 24px rgba(0,0,0,0.45)"
          : plan.bestValue
          ? "0 4px 24px rgba(255,184,0,0.12), 0 4px 16px rgba(0,0,0,0.3)"
          : "0 4px 16px rgba(0,0,0,0.25)",
        backdropFilter: "blur(12px)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top highlight line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: plan.bestValue
          ? "linear-gradient(90deg, transparent, rgba(255,184,0,0.5), transparent)"
          : "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
      }} />

      {/* Best Value badge */}
      {plan.bestValue && (
        <div style={{
          position: "absolute", top: "14px", right: "14px",
          background: "linear-gradient(135deg, #FFB800, #FF8534)",
          borderRadius: "8px", padding: "4px 10px",
          fontSize: "10px", fontWeight: 700,
          color: "#000",
          fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.08em",
          textTransform: "uppercase",
          zIndex: 1,
        }}>
          ⭐ BEST VALUE
        </div>
      )}

      {/* Title */}
      <h3 style={{
        fontFamily: "Rajdhani, sans-serif",
        fontSize: "18px", fontWeight: 700, color: "#fff",
        margin: "0 0 16px",
        lineHeight: 1.25,
        paddingRight: plan.bestValue ? "100px" : 0,
      }}>
        {plan.title}
      </h3>

      {/* Pricing */}
      <div style={{
        display: "flex", alignItems: "baseline",
        gap: "10px", flexWrap: "wrap",
        marginBottom: "14px",
      }}>
        <span style={{
          fontSize: "15px", fontWeight: 600,
          color: "rgba(255,255,255,0.35)",
          textDecoration: "line-through",
          fontFamily: "Rajdhani, sans-serif",
        }}>
          ₹{plan.original.toLocaleString("en-IN")}
        </span>
        <span style={{
          fontSize: "32px", fontWeight: 700,
          color: plan.bestValue ? "#FFB800" : "#FF8534",
          fontFamily: "Rajdhani, sans-serif",
          lineHeight: 1,
        }}>
          ₹{plan.offer.toLocaleString("en-IN")}
        </span>
      </div>

      {/* Badges row */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: "6px",
        marginBottom: "16px",
      }}>
        <span style={{
          fontSize: "11px", fontWeight: 700, padding: "4px 10px",
          borderRadius: "20px",
          background: "rgba(34,197,94,0.15)",
          border: "1px solid rgba(34,197,94,0.3)",
          color: "#22c55e",
          fontFamily: "Rajdhani, sans-serif",
        }}>
          🔥 Save ₹{savings.toLocaleString("en-IN")}
        </span>
        <span style={{
          fontSize: "11px", fontWeight: 700, padding: "4px 10px",
          borderRadius: "20px",
          background: "rgba(255,98,0,0.12)",
          border: "1px solid rgba(255,98,0,0.25)",
          color: "#FF8534",
          fontFamily: "Rajdhani, sans-serif",
        }}>
          {discountPct}% OFF
        </span>
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
      </div>

      {/* Coupon code */}
      <div style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px dashed rgba(255,98,0,0.4)",
        borderRadius: "12px",
        padding: "10px 14px",
        marginBottom: "16px",
        display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: "8px",
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
            fontSize: "15px", fontWeight: 700,
            color: "#FF8534", letterSpacing: "0.1em",
          }}>
            {plan.coupon}
          </div>
        </div>
        <button
          onClick={handleCopy}
          style={{
            padding: "7px 12px",
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
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {copied ? "✓ Copied!" : "📋 Copy"}
        </button>
      </div>

      {/* Best value save strip */}
      {plan.bestValue && (
        <div style={{
          background: "linear-gradient(90deg, rgba(255,184,0,0.15), rgba(255,133,52,0.1))",
          border: "1px solid rgba(255,184,0,0.25)",
          borderRadius: "10px",
          padding: "8px 14px",
          marginBottom: "16px",
          textAlign: "center",
          fontSize: "12px", fontWeight: 700,
          color: "#FFB800",
          fontFamily: "Rajdhani, sans-serif",
          letterSpacing: "0.04em",
        }}>
          🔥 SAVE ₹15,000 — BEST BUNDLE DEAL
        </div>
      )}

      {/* Action buttons — pushed to bottom */}
      <div style={{ marginTop: "auto", display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <a
          href={plan.purchaseUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: 1,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            gap: "6px", padding: "11px 14px",
            background: plan.bestValue
              ? "linear-gradient(135deg, #FFB800, #FF8534)"
              : "linear-gradient(135deg, #FF6200, #FF8534)",
            borderRadius: "12px",
            color: plan.bestValue ? "#000" : "#fff",
            fontSize: "13px", fontWeight: 700,
            textDecoration: "none",
            fontFamily: "Nunito, sans-serif",
            boxShadow: plan.bestValue
              ? "0 4px 18px rgba(255,184,0,0.35)"
              : "0 4px 16px rgba(255,98,0,0.35)",
            whiteSpace: "nowrap",
            minWidth: 0,
          }}
        >
          🛒 Purchase
        </a>
        {plan.previewUrl && (
          <a
            href={plan.previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              gap: "5px", padding: "11px 14px",
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

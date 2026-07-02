"use client";

import type { NewRenewalPlan } from "@/lib/renewal";

// Premium membership card for a current-generation course. Pure display —
// selecting a duration and opening Razorpay happen in RenewalDurationDialog.

export default function RenewalCard({
  plan,
  onRenew,
}: {
  plan: NewRenewalPlan;
  onRenew: (plan: NewRenewalPlan) => void;
}) {
  return (
    <div
      className="flex h-full flex-col"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        borderRadius: "18px",
        padding: "26px 24px",
        transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,133,52,0.45)";
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 32px rgba(255,98,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--card-border)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Code badge */}
      <span
        style={{
          alignSelf: "flex-start",
          padding: "3px 10px",
          borderRadius: "6px",
          background: "rgba(255,98,0,0.13)",
          border: "1px solid rgba(255,98,0,0.28)",
          color: "#FF8534",
          fontSize: "0.72rem",
          fontWeight: 700,
          fontFamily: "monospace",
          letterSpacing: "0.04em",
          marginBottom: "16px",
        }}
      >
        {plan.code}
      </span>

      <h3
        style={{
          color: "#fff",
          fontFamily: "var(--font-rajdhani), Rajdhani, sans-serif",
          fontSize: "1.2rem",
          fontWeight: 700,
          lineHeight: 1.3,
          marginBottom: "10px",
        }}
      >
        {plan.name}
      </h3>

      <p
        style={{
          color: "rgba(255,255,255,0.55)",
          fontSize: "0.85rem",
          lineHeight: 1.65,
          marginBottom: "24px",
        }}
      >
        {plan.description}
      </p>

      <button
        type="button"
        onClick={() => onRenew(plan)}
        aria-label={`Renew membership — ${plan.name}`}
        className="mt-auto w-full"
        style={{
          padding: "12px 20px",
          borderRadius: "10px",
          background: "linear-gradient(135deg, #FF8534, #FF6200)",
          color: "#fff",
          fontWeight: 700,
          fontSize: "0.88rem",
          border: "none",
          cursor: "pointer",
          fontFamily: "var(--font-rajdhani), Rajdhani, sans-serif",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          boxShadow: "0 4px 16px rgba(255,98,0,0.28)",
          transition: "opacity 0.15s, transform 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = "0.88";
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = "1";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        Renew Membership
      </button>
    </div>
  );
}

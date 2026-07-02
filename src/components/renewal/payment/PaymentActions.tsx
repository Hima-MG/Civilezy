"use client";

import {
  buildRenewalPortalUrl,
  type NewRenewalPlan,
  type RenewalDurationOption,
} from "@/lib/renewal";
import PaymentStep from "./PaymentStep";

// The three guided steps of the checkout assistant. Step 1 opens the
// EXISTING Razorpay payment page in a new tab (unchanged link, unchanged
// flow); step 3 hands the student off to the Renewal Portal with prefill
// params generated from the central configuration — never from the URL.

export default function PaymentActions({
  plan,
  option,
}: {
  plan: NewRenewalPlan;
  option: RenewalDurationOption;
}) {
  const portalUrl = buildRenewalPortalUrl(plan, option);

  return (
    <ol className="flex flex-col gap-7" style={{ margin: 0, padding: 0 }}>
      {/* STEP 1 — Pay Now */}
      <PaymentStep number="01" title="Pay Now">
        <a
          href={option.renewLink}
          target="_blank"
          rel="noopener noreferrer"
          className="renewal-focus block w-full text-center"
          style={{
            padding: "15px 20px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #FF8534, #FF6200)",
            color: "#fff",
            fontWeight: 700,
            fontSize: "1rem",
            textDecoration: "none",
            fontFamily: "var(--font-rajdhani), Rajdhani, sans-serif",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            boxShadow: "0 6px 20px rgba(255,98,0,0.35)",
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
          Pay Now →
        </a>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.78rem", marginTop: "8px" }}>
          Opens the secure Razorpay payment page in a new tab.
        </p>
      </PaymentStep>

      {/* STEP 2 — Complete the payment */}
      <PaymentStep number="02" title="Complete the Payment">
        <ul
          className="flex flex-col gap-1.5"
          style={{
            margin: 0,
            padding: 0,
            listStyle: "none",
            color: "rgba(255,255,255,0.6)",
            fontSize: "0.85rem",
            lineHeight: 1.6,
          }}
        >
          <li>• Your payment opens in a new tab.</li>
          <li>• Complete the payment there.</li>
          <li>• Close the payment tab.</li>
          <li>• Return here and continue below.</li>
        </ul>
      </PaymentStep>

      {/* STEP 3 — Continue Renewal */}
      <PaymentStep number="03" title="Continue Renewal">
        <a
          href={portalUrl}
          className="renewal-focus block w-full text-center"
          style={{
            padding: "15px 20px",
            borderRadius: "12px",
            background: "transparent",
            border: "1px solid rgba(255,133,52,0.55)",
            color: "#FF8534",
            fontWeight: 700,
            fontSize: "1rem",
            textDecoration: "none",
            fontFamily: "var(--font-rajdhani), Rajdhani, sans-serif",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            transition: "background 0.15s, transform 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,133,52,0.10)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Continue Renewal →
        </a>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.78rem", marginTop: "8px" }}>
          After paying, submit your renewal request on the CivilEzy Renewal Portal — your
          course details will be filled in for you.
        </p>
      </PaymentStep>
    </ol>
  );
}

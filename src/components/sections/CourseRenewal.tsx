"use client";

import { useState } from "react";
import { ENABLED_NEW_PLANS, type NewRenewalPlan } from "@/lib/renewal";
import SectionHeader from "@/components/renewal/SectionHeader";
import RenewalCard from "@/components/renewal/RenewalCard";
import RenewalDurationDialog from "@/components/renewal/RenewalDurationDialog";
import LegacyPlansAccordion from "@/components/renewal/LegacyPlansAccordion";
import RenewalSupportCard from "@/components/renewal/RenewalSupportCard";

// ─── Data ──────────────────────────────────────────────────────────────────
// All plan data (courses, prices, Razorpay links) lives in @/lib/renewal —
// the single source of truth. Do not hardcode plans in this component.

const RENEWAL_STEPS = [
  {
    num:   "01",
    icon:  "🔍",
    title: "Find Your Membership",
    body:  "Login → Dashboard → Membership. Note your Membership Code and Course Name.",
  },
  {
    num:   "02",
    icon:  "📋",
    title: "Choose Your Renewal",
    body:  "Select your course below and pick a renewal duration.",
  },
  {
    num:   "03",
    icon:  "💳",
    title: "Complete Payment",
    body:  "Pay securely using the payment page.",
  },
  {
    num:   "04",
    icon:  "✅",
    title: "Submit Renewal",
    body:  "Click Continue Renewal and upload your payment details on the Renewal Portal. Done.",
  },
];

const FAQS = [
  {
    q: "Can an expired course or membership be renewed?",
    a: "No. Renewal is only available for active, non-expired memberships. If your membership has expired, you will need to purchase a fresh subscription from the pricing page.",
  },
  {
    q: "How long does renewal activation take?",
    a: "Renewal activation typically takes up to 24 hours after we receive your payment confirmation. You will be notified once your membership is updated.",
  },
  {
    q: "Will my study progress and quiz scores be saved after renewal?",
    a: "Yes. All your course progress, quiz scores, and performance data are saved to your account and will remain intact after renewal.",
  },
  {
    q: "How do I check my membership expiry date?",
    a: "Login → Dashboard → Membership → Click on your membership. You will see the Membership Name, Code, and the number of Remaining Days on your plan.",
  },
];

// ─── Sub-components ────────────────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        borderRadius: "12px",
        border: open ? "1px solid rgba(255,133,52,0.35)" : "1px solid rgba(255,255,255,0.09)",
        background: open ? "rgba(255,133,52,0.06)" : "rgba(255,255,255,0.03)",
        overflow: "hidden",
        transition: "border 0.2s, background 0.2s",
        marginBottom: "12px",
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          padding: "18px 22px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          gap: "16px",
        }}
      >
        <span
          style={{
            color: open ? "#FF8534" : "rgba(255,255,255,0.88)",
            fontSize: "0.95rem",
            fontWeight: 600,
            fontFamily: "var(--font-rajdhani), Rajdhani, sans-serif",
            transition: "color 0.2s",
          }}
        >
          {q}
        </span>
        <span
          aria-hidden="true"
          style={{
            fontSize: "1.1rem",
            color: "#FF8534",
            transform: open ? "rotate(45deg)" : "rotate(0)",
            transition: "transform 0.22s",
            flexShrink: 0,
          }}
        >
          ＋
        </span>
      </button>
      {open && (
        <div
          style={{
            padding: "0 22px 18px",
            color: "rgba(255,255,255,0.62)",
            fontSize: "0.88rem",
            lineHeight: 1.7,
            borderTop: "1px solid rgba(255,133,52,0.15)",
            paddingTop: "14px",
          }}
        >
          {a}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function CourseRenewal() {
  const [dialogPlan, setDialogPlan] = useState<NewRenewalPlan | null>(null);

  // ── shared section wrapper style
  const sectionBase: React.CSSProperties = {
    padding: "80px 0",
  };

  const container: React.CSSProperties = {
    maxWidth: "1160px",
    margin: "0 auto",
    padding: "0 20px",
  };

  const divider: React.CSSProperties = {
    height: "1px",
    background: "linear-gradient(90deg, transparent, rgba(255,133,52,0.2), transparent)",
    margin: "0",
  };

  return (
    <div style={{ background: "var(--navy)", minHeight: "100vh" }}>

      {/* ════════════════════════════════════════
          1. HERO
      ════════════════════════════════════════ */}
      <section
        style={{
          ...sectionBase,
          padding: "96px 0 88px",
          background: "linear-gradient(180deg, #0d2347 0%, var(--navy) 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative glow */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            height: "300px",
            background: "radial-gradient(ellipse, rgba(255,98,0,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ ...container, textAlign: "center", position: "relative" }}>
          {/* Badge */}
          <span
            style={{
              display: "inline-block",
              padding: "6px 20px",
              borderRadius: "100px",
              background: "rgba(255,133,52,0.15)",
              border: "1px solid rgba(255,133,52,0.35)",
              color: "#FF8534",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: "24px",
            }}
          >
            🔄 Membership Renewal
          </span>

          {/* Heading */}
          <h1
            style={{
              fontFamily: "var(--font-rajdhani), Rajdhani, sans-serif",
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              fontWeight: 800,
              lineHeight: 1.15,
              color: "#fff",
              marginBottom: "20px",
            }}
          >
            Renew Your{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #FF8534, #FF6200)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              CivilEzy Membership
            </span>
          </h1>

          <p
            style={{
              fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
              color: "rgba(255,255,255,0.60)",
              maxWidth: "520px",
              margin: "0 auto 16px",
              lineHeight: 1.7,
            }}
          >
            Renew in a few simple steps. Your progress stays saved.
          </p>

          <p
            style={{
              fontSize: "0.8rem",
              color: "rgba(255,255,255,0.4)",
              margin: "0 auto 36px",
            }}
          >
            Active memberships only · Activation within 24 hours · Website only
          </p>

          {/* CTA row */}
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="#renewal-steps"
              style={{
                padding: "13px 30px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #FF8534, #FF6200)",
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.95rem",
                textDecoration: "none",
                fontFamily: "var(--font-rajdhani), Rajdhani, sans-serif",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                boxShadow: "0 4px 20px rgba(255,98,0,0.35)",
                transition: "opacity 0.15s, transform 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.opacity = "0.88";
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
              }}
            >
              How to Renew →
            </a>
            <a
              href="#new-courses"
              style={{
                padding: "13px 30px",
                borderRadius: "10px",
                background: "transparent",
                color: "rgba(255,255,255,0.82)",
                fontWeight: 600,
                fontSize: "0.95rem",
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.18)",
                fontFamily: "var(--font-rajdhani), Rajdhani, sans-serif",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                transition: "border-color 0.15s, color 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,133,52,0.5)";
                (e.currentTarget as HTMLAnchorElement).style.color = "#FF8534";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.18)";
                (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.82)";
              }}
            >
              View Plans
            </a>
          </div>
        </div>
      </section>

      <div style={divider} />

      {/* ════════════════════════════════════════
          2. HOW TO RENEW
      ════════════════════════════════════════ */}
      <section style={sectionBase} id="renewal-steps">
        <div style={container}>
          <SectionHeader
            label="Step by Step"
            title="How to Renew"
            sub="Complete your renewal in just a few simple steps."
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "20px",
            }}
          >
            {RENEWAL_STEPS.map((step) => (
              <div
                key={step.num}
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--card-border)",
                  borderRadius: "16px",
                  padding: "28px 24px",
                  position: "relative",
                  overflow: "hidden",
                  transition: "border-color 0.2s, transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,133,52,0.4)";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "var(--card-border)";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                }}
              >
                {/* Background number */}
                <span
                  style={{
                    position: "absolute",
                    top: "-10px",
                    right: "14px",
                    fontSize: "5rem",
                    fontWeight: 900,
                    color: "rgba(255,133,52,0.06)",
                    fontFamily: "var(--font-rajdhani), Rajdhani, sans-serif",
                    lineHeight: 1,
                    userSelect: "none",
                  }}
                >
                  {step.num}
                </span>

                <div
                  style={{
                    width: "46px",
                    height: "46px",
                    borderRadius: "12px",
                    background: "rgba(255,133,52,0.12)",
                    border: "1px solid rgba(255,133,52,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.4rem",
                    marginBottom: "16px",
                  }}
                >
                  {step.icon}
                </div>

                <p
                  style={{
                    color: "#FF8534",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                  }}
                >
                  Step {step.num}
                </p>
                <h3
                  style={{
                    color: "#fff",
                    fontFamily: "var(--font-rajdhani), Rajdhani, sans-serif",
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    marginBottom: "10px",
                  }}
                >
                  {step.title}
                </h3>
                <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.84rem", lineHeight: 1.65 }}>
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={divider} />

      {/* ════════════════════════════════════════
          3. NEW MEMBERSHIP PLANS (cards + duration dialog)
      ════════════════════════════════════════ */}
      <section style={{ ...sectionBase, background: "rgba(255,255,255,0.015)" }} id="new-courses">
        <div style={container}>
          <SectionHeader
            label="From 01 April 2026"
            title="New Membership Plans"
            sub="Memberships purchased from 1 April 2026 onwards."
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {ENABLED_NEW_PLANS.map((plan) => (
              <RenewalCard key={plan.id} plan={plan} onRenew={setDialogPlan} />
            ))}
          </div>
        </div>
      </section>

      <div style={divider} />

      {/* ════════════════════════════════════════
          4. OLDER MEMBERSHIP PLANS (collapsed by default)
      ════════════════════════════════════════ */}
      <section style={sectionBase} id="old-courses">
        <div style={container}>
          <SectionHeader
            label="Up to 31 March 2026"
            title="Older Membership Plans"
            sub="Memberships purchased before 1 April 2026."
          />
          <LegacyPlansAccordion />
        </div>
      </section>

      <div style={divider} />

      {/* ════════════════════════════════════════
          5. SUPPORT SECTION
      ════════════════════════════════════════ */}
      <section style={{ ...sectionBase, background: "rgba(255,255,255,0.015)" }} id="support">
        <div style={{ ...container, textAlign: "center" }}>
          <RenewalSupportCard />
        </div>
      </section>

      <div style={divider} />

      {/* ════════════════════════════════════════
          6. FAQ
      ════════════════════════════════════════ */}
      <section style={sectionBase} id="faq">
        <div style={{ ...container, maxWidth: "760px" }}>
          <SectionHeader
            label="FAQ"
            title="Frequently Asked Questions"
            sub="Quick answers to the most common renewal questions."
          />

          {FAQS.map((faq) => (
            <FaqItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </section>

      {/* Duration-selection dialog (modal / mobile bottom sheet) */}
      <RenewalDurationDialog
        plan={dialogPlan}
        onClose={() => setDialogPlan(null)}
      />

    </div>
  );
}

"use client";

import { Fragment, useState } from "react";
import { WHATSAPP_DISPLAY, getWhatsAppUrl } from "@/lib/constants";
import { ENABLED_NEW_PLANS, type NewRenewalPlan } from "@/lib/renewal";
import SectionHeader from "@/components/renewal/SectionHeader";
import RenewalCard from "@/components/renewal/RenewalCard";
import RenewalDurationDialog from "@/components/renewal/RenewalDurationDialog";
import LegacyPlansAccordion from "@/components/renewal/LegacyPlansAccordion";
import RenewalSupportCard, {
  RENEWAL_WHATSAPP_MESSAGE,
} from "@/components/renewal/RenewalSupportCard";

// ─── Data ──────────────────────────────────────────────────────────────────
// All plan data (courses, prices, Razorpay links) lives in @/lib/renewal —
// the single source of truth. Do not hardcode plans in this component.

const CONDITIONS = [
  {
    icon: "✅",
    color: "#22c55e",
    bg:    "rgba(34,197,94,0.10)",
    border:"rgba(34,197,94,0.28)",
    title: "Active Membership Required",
    body:  "Renewal is allowed only for currently active memberships. You must have an ongoing, valid subscription to renew.",
  },
  {
    icon: "🚫",
    color: "#ef4444",
    bg:    "rgba(239,68,68,0.10)",
    border:"rgba(239,68,68,0.28)",
    title: "Expired Memberships Cannot Be Renewed",
    body:  "If your membership has already expired, renewal is not possible. You will need to purchase a new subscription.",
  },
  {
    icon: "⏰",
    color: "#FF8534",
    bg:    "rgba(255,133,52,0.10)",
    border:"rgba(255,133,52,0.30)",
    title: "Renew Before 2 Days of Expiry",
    body:  "To ensure uninterrupted access, renew your membership at least 2 days before the expiry date.",
  },
  {
    icon: "🕐",
    color: "#a78bfa",
    bg:    "rgba(167,139,250,0.10)",
    border:"rgba(167,139,250,0.28)",
    title: "Activation Takes Up to 24 Hours",
    body:  "After completing payment, membership renewal activation may take up to 24 hours. Please be patient.",
  },
  {
    icon: "📞",
    color: "#38bdf8",
    bg:    "rgba(56,189,248,0.10)",
    border:"rgba(56,189,248,0.28)",
    title: "Support During Office Hours Only",
    body:  "Renewal support is available only during office hours: 10 AM – 5 PM (Mon – Sat). Queries outside these hours will be addressed the next business day.",
  },
  {
    icon: "💻",
    color: "#f59e0b",
    bg:    "rgba(245,158,11,0.10)",
    border:"rgba(245,158,11,0.28)",
    title: "Renewal via Website Only — Not Available on App",
    body:  "Course renewal must be completed through the CivilEzy website (civilezy.in). Renewal is not available through the CivilEzy mobile app.",
  },
];

const RENEWAL_STEPS = [
  {
    num:   "01",
    icon:  "🔍",
    title: "Find Your Membership Details",
    body:  "Login to your account → Go to Dashboard → Click on Membership → Select your membership to find your Membership Code and Name.",
  },
  {
    num:   "02",
    icon:  "📋",
    title: "Select a Renewal Plan",
    body:  "Choose your course below, tap Renew Membership, and pick the duration (1 / 3 / 6 / 12 months) that fits your preparation timeline.",
  },
  {
    num:   "03",
    icon:  "💳",
    title: "Complete Payment",
    body:  "Click the Renew button for your course and complete the payment securely through the checkout page.",
  },
  {
    num:   "04",
    icon:  "📲",
    title: "Send Confirmation on WhatsApp",
    body:  "After payment, send your screenshot + details to our WhatsApp number. Your renewal will be activated within 24 hours.",
  },
];

const FAQS = [
  {
    q: "Can an expired course or membership be renewed?",
    a: "No. Renewal is only available for active, non-expired memberships. If your membership has expired, you will need to purchase a fresh subscription from the pricing page.",
  },
  {
    q: "How long does renewal activation take?",
    a: "Renewal activation typically takes up to 24 hours after we receive your payment confirmation on WhatsApp. You will be notified once your membership is updated.",
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

  const waUrl = getWhatsAppUrl(RENEWAL_WHATSAPP_MESSAGE);

  // ── shared section wrapper style
  const sectionBase: React.CSSProperties = {
    padding: "72px 0",
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
          padding: "90px 0 80px",
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
              maxWidth: "580px",
              margin: "0 auto 36px",
              lineHeight: 1.7,
            }}
          >
            Keep your Kerala PSC Civil Engineering preparation on track. Renew your active membership in just a few simple steps and never lose your progress.
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
          2. IMPORTANT CONDITIONS
      ════════════════════════════════════════ */}
      <section style={sectionBase} id="conditions">
        <div style={container}>
          <SectionHeader
            label="Please Read First"
            title="Important Renewal Conditions"
            sub="Before proceeding with renewal, make sure you understand these conditions."
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "16px",
            }}
          >
            {CONDITIONS.map((c) => (
              <div
                key={c.title}
                style={{
                  background: c.bg,
                  border: `1px solid ${c.border}`,
                  borderRadius: "14px",
                  padding: "20px 22px",
                  display: "flex",
                  gap: "14px",
                  alignItems: "flex-start",
                  transition: "transform 0.18s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.transform = "translateY(0)")
                }
              >
                <span style={{ fontSize: "1.5rem", flexShrink: 0, marginTop: "2px" }}>{c.icon}</span>
                <div>
                  <p
                    style={{
                      color: c.color,
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      fontFamily: "var(--font-rajdhani), Rajdhani, sans-serif",
                      letterSpacing: "0.03em",
                      marginBottom: "6px",
                    }}
                  >
                    {c.title}
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.62)", fontSize: "0.84rem", lineHeight: 1.6 }}>
                    {c.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={divider} />

      {/* ════════════════════════════════════════
          3. HOW TO CHECK MEMBERSHIP DETAILS
      ════════════════════════════════════════ */}
      <section style={{ ...sectionBase, background: "rgba(255,255,255,0.015)" }} id="membership-details">
        <div style={container}>
          <SectionHeader
            label="Dashboard Guide"
            title="How to Check Your Membership Details"
            sub="Follow these steps to find your Membership Code, Name, and Remaining Days."
          />

          {/* Breadcrumb path */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              flexWrap: "wrap",
              marginBottom: "40px",
            }}
          >
            {[
              { label: "Login", href: "https://learn.civilezy.in/en/signup" },
              { label: "Dashboard", href: null },
              { label: "Membership", href: null },
              { label: "Select Membership", href: null },
            ].map((step, i, arr) => (
              <Fragment key={step.label}>
                {step.href ? (
                  <a
                    href={step.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: "8px 20px",
                      borderRadius: "8px",
                      background: "rgba(255,133,52,0.18)",
                      border: "1px solid rgba(255,133,52,0.45)",
                      color: "#FF8534",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      fontFamily: "var(--font-rajdhani), Rajdhani, sans-serif",
                      letterSpacing: "0.05em",
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      transition: "background 0.15s, box-shadow 0.15s",
                      boxShadow: "0 2px 12px rgba(255,133,52,0.18)",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,133,52,0.28)";
                      (e.currentTarget as HTMLAnchorElement).style.boxShadow  = "0 4px 18px rgba(255,133,52,0.35)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,133,52,0.18)";
                      (e.currentTarget as HTMLAnchorElement).style.boxShadow  = "0 2px 12px rgba(255,133,52,0.18)";
                    }}
                  >
                    {step.label}
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                ) : (
                  <span
                    style={{
                      padding: "8px 20px",
                      borderRadius: "8px",
                      background: "rgba(255,133,52,0.12)",
                      border: "1px solid rgba(255,133,52,0.28)",
                      color: "#FF8534",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      fontFamily: "var(--font-rajdhani), Rajdhani, sans-serif",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {step.label}
                  </span>
                )}
                {i < arr.length - 1 && (
                  <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "1.1rem" }}>→</span>
                )}
              </Fragment>
            ))}
          </div>

          {/* Info cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            {[
              { icon: "🏷️", label: "Membership Code", desc: "Unique identifier for your membership plan" },
              { icon: "📘", label: "Membership Name", desc: "The name of your enrolled course / plan" },
              { icon: "📅", label: "Remaining Days",  desc: "Number of days left before your membership expires" },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--card-border)",
                  borderRadius: "14px",
                  padding: "22px 20px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "10px" }}>{item.icon}</div>
                <p
                  style={{
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    fontFamily: "var(--font-rajdhani), Rajdhani, sans-serif",
                    marginBottom: "6px",
                  }}
                >
                  {item.label}
                </p>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", lineHeight: 1.5 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={divider} />

      {/* ════════════════════════════════════════
          4. RENEWAL PROCESS STEPS
      ════════════════════════════════════════ */}
      <section style={sectionBase} id="renewal-steps">
        <div style={container}>
          <SectionHeader
            label="Step by Step"
            title="Renewal Process"
            sub="Complete your renewal in 4 simple steps."
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

          {/* WhatsApp details box */}
          <div
            style={{
              marginTop: "36px",
              background: "rgba(37,211,102,0.07)",
              border: "1px solid rgba(37,211,102,0.25)",
              borderRadius: "16px",
              padding: "28px 32px",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "2rem", flexShrink: 0 }}>📲</span>
              <div style={{ flex: 1, minWidth: "240px" }}>
                <p
                  style={{
                    color: "#4ade80",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    fontFamily: "var(--font-rajdhani), Rajdhani, sans-serif",
                    letterSpacing: "0.03em",
                    marginBottom: "10px",
                  }}
                >
                  After Payment — Send These Details on WhatsApp {WHATSAPP_DISPLAY}
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: "8px",
                  }}
                >
                  {[
                    "📸 Payment Screenshot",
                    "🔢 Reference / Transaction ID",
                    "📧 Registered Email",
                    "👤 Your Full Name",
                    "🏷️ Course Code",
                    "📘 Course Name",
                  ].map((item) => (
                    <div
                      key={item}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        color: "rgba(255,255,255,0.72)",
                        fontSize: "0.84rem",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        background: "rgba(255,255,255,0.04)",
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    marginTop: "18px",
                    padding: "11px 26px",
                    borderRadius: "10px",
                    background: "#25d366",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.88rem",
                    textDecoration: "none",
                    fontFamily: "var(--font-rajdhani), Rajdhani, sans-serif",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    boxShadow: "0 4px 16px rgba(37,211,102,0.3)",
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
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Open WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div style={divider} />

      {/* ════════════════════════════════════════
          5. CURRENT MEMBERSHIP PLANS (cards + duration dialog)
      ════════════════════════════════════════ */}
      <section style={{ ...sectionBase, background: "rgba(255,255,255,0.015)" }} id="new-courses">
        <div style={container}>
          <SectionHeader
            label="From 01 April 2026"
            title="Current Membership Plans"
            sub="Pick your course, choose a renewal duration, and pay securely — all in a couple of clicks."
          />

          {/* Notice banner */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background: "rgba(255,133,52,0.08)",
              border: "1px solid rgba(255,133,52,0.25)",
              borderRadius: "10px",
              padding: "14px 20px",
              marginBottom: "28px",
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontSize: "1.1rem" }}>🆕</span>
            <p style={{ color: "rgba(255,255,255,0.72)", fontSize: "0.84rem", margin: 0 }}>
              These are courses launched from <strong style={{ color: "#FF8534" }}>01 April 2026</strong> onwards. If you enrolled after this date, renew using the cards below.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {ENABLED_NEW_PLANS.map((plan) => (
              <RenewalCard key={plan.id} plan={plan} onRenew={setDialogPlan} />
            ))}
          </div>
        </div>
      </section>

      <div style={divider} />

      {/* ════════════════════════════════════════
          6. LEGACY PLANS (collapsed by default)
      ════════════════════════════════════════ */}
      <section style={sectionBase} id="old-courses">
        <div style={container}>
          <LegacyPlansAccordion />
        </div>
      </section>

      <div style={divider} />

      {/* ════════════════════════════════════════
          7. SUPPORT SECTION
      ════════════════════════════════════════ */}
      <section style={{ ...sectionBase, background: "rgba(255,255,255,0.015)" }} id="support">
        <div style={{ ...container, textAlign: "center" }}>
          <RenewalSupportCard />
        </div>
      </section>

      <div style={divider} />

      {/* ════════════════════════════════════════
          8. FAQ
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

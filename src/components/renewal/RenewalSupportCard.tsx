"use client";

import { WHATSAPP_DISPLAY, getWhatsAppUrl } from "@/lib/constants";

// The renewal WhatsApp support card — extracted unchanged from section 7 of
// CourseRenewal so the /renew/payment page can reuse it without duplicating
// support copy or the contact URL.

export const RENEWAL_WHATSAPP_MESSAGE =
  "Hi CivilEzy, I want to renew my membership.\n\nPayment Screenshot: [attach]\nReference ID:\nRegistered Email:\nName:\nCourse Code:\nCourse Name:";

export default function RenewalSupportCard() {
  const waUrl = getWhatsAppUrl(RENEWAL_WHATSAPP_MESSAGE);

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        background:
          "linear-gradient(135deg, rgba(255,133,52,0.10) 0%, rgba(255,98,0,0.06) 100%)",
        border: "1px solid rgba(255,133,52,0.28)",
        borderRadius: "20px",
        padding: "48px 36px",
      }}
    >
      <div style={{ fontSize: "2.8rem", marginBottom: "16px" }}>🤝</div>
      <h2
        style={{
          fontFamily: "var(--font-rajdhani), Rajdhani, sans-serif",
          fontSize: "clamp(1.4rem, 3vw, 1.9rem)",
          fontWeight: 700,
          color: "#fff",
          marginBottom: "12px",
        }}
      >
        Need Help with Renewal?
      </h2>
      <p
        style={{
          color: "rgba(255,255,255,0.58)",
          fontSize: "0.9rem",
          lineHeight: 1.7,
          marginBottom: "10px",
        }}
      >
        Our support team is available{" "}
        <strong style={{ color: "rgba(255,255,255,0.8)" }}>
          Monday – Saturday, 10 AM – 5 PM
        </strong>
        . Reach us on WhatsApp for the fastest response.
      </p>
      <p
        style={{
          color: "rgba(255,255,255,0.4)",
          fontSize: "0.78rem",
          marginBottom: "28px",
        }}
      >
        Queries outside office hours will be addressed the next business day.
      </p>

      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
          padding: "14px 32px",
          borderRadius: "12px",
          background: "#25d366",
          color: "#fff",
          fontWeight: 700,
          fontSize: "1rem",
          textDecoration: "none",
          fontFamily: "var(--font-rajdhani), Rajdhani, sans-serif",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          boxShadow: "0 6px 24px rgba(37,211,102,0.35)",
          transition: "opacity 0.15s, transform 0.15s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.opacity = "0.88";
          (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-3px)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
          (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        Chat on WhatsApp
      </a>

      <p
        style={{
          marginTop: "20px",
          color: "rgba(255,255,255,0.35)",
          fontSize: "0.8rem",
        }}
      >
        {WHATSAPP_DISPLAY}
      </p>
    </div>
  );
}

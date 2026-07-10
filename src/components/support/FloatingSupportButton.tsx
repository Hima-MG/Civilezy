"use client";

import { usePathname } from "next/navigation";
import { useSupportModal } from "@/contexts/SupportContext";

export default function FloatingSupportButton() {
  const { openModal } = useSupportModal();
  const pathname = usePathname();

  // Hide on admin and support pages, and on the renewal flow where the
  // floating button overlaps the payment dialog / CTA.
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/support") ||
    pathname.startsWith("/renew")
  )
    return null;

  return (
    <>
      {/*
       * FAB SYSTEM — RIGHT SIDE, SECONDARY BUTTON
       * ──────────────────────────────────────────
       * Stacks ABOVE the ChatWidget FAB (bottom: 24px, h: 56px).
       * Desktop (≥ 768px) : bottom: 96px,  right: 24px   — FAB top is at 96+44=140px
       * Tablet  (640-767)  : bottom: 96px,  right: 20px
       * Mobile  (< 640px)  : bottom: 148px, right: 16px  — above ChatWidget mobile pos (78px+h:52px+gap:8px)
       *
       * z-index: 960 — below ChatWidget panel (965) so panel covers it when chat opens.
       * When chat is closed, the button is fully visible above the ChatWidget FAB.
       */}
      <button
        onClick={openModal}
        id="floating-report-issue-btn"
        aria-label="Report Technical Issue"
        title="Report Technical Issue"
        style={{
          position: "fixed",
          bottom: "96px",
          right: "24px",
          zIndex: 960,
          paddingLeft: "14px",
          paddingRight: "14px",
          height: "44px",
          borderRadius: "50px",
          background: "rgba(11,30,61,0.92)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255,133,52,0.35)",
          color: "#FF8534",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "7px",
          fontSize: "13px",
          fontWeight: 700,
          fontFamily: "Nunito, sans-serif",
          boxShadow: "0 4px 20px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,133,52,0.15)",
          transition: "transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease, background 0.2s ease, border-color 0.2s ease",
          whiteSpace: "nowrap",
          touchAction: "manipulation",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.06) translateY(-2px)";
          e.currentTarget.style.background = "rgba(255,98,0,0.15)";
          e.currentTarget.style.borderColor = "rgba(255,133,52,0.6)";
          e.currentTarget.style.boxShadow = "0 8px 28px rgba(255,102,0,0.35), 0 0 0 1px rgba(255,133,52,0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1) translateY(0)";
          e.currentTarget.style.background = "rgba(11,30,61,0.92)";
          e.currentTarget.style.borderColor = "rgba(255,133,52,0.35)";
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,133,52,0.15)";
        }}
      >
        <span style={{ fontSize: "16px", lineHeight: 1 }}>🛠️</span>
        <span>Report Issue</span>
      </button>

      <style>{`
        /* Tablet (640px – 767px) */
        @media (min-width: 640px) and (max-width: 767px) {
          #floating-report-issue-btn {
            bottom: 96px !important;
            right: 20px !important;
          }
        }

        /* Mobile (under 640px): above ChatWidget FAB (78px) + FAB height (52px) + gap (8px) = 138px */
        @media (max-width: 639px) {
          #floating-report-issue-btn {
            bottom: 148px !important;
            right: 16px !important;
            font-size: 12px !important;
            padding-left: 12px !important;
            padding-right: 12px !important;
            height: 40px !important;
          }
        }
      `}</style>
    </>
  );
}

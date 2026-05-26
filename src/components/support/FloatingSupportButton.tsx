"use client";

import { usePathname } from "next/navigation";
import { useSupportModal } from "@/contexts/SupportContext";

export default function FloatingSupportButton() {
  const { openModal } = useSupportModal();
  const pathname = usePathname();

  // Hide on admin pages and support pages
  if (pathname.startsWith("/admin") || pathname.startsWith("/support")) return null;

  return (
    <>
      <button
        onClick={openModal}
        id="floating-report-issue-btn"
        aria-label="Report Technical Issue"
        title="Report Technical Issue"
        style={{
          position: "fixed",
          bottom: "106px",
          right: "20px",
          zIndex: 997, // Below WhatsApp (950) + floating supports (top layers), but above page content
          paddingLeft: "16px",
          paddingRight: "16px",
          height: "48px",
          borderRadius: "50px",
          background: "linear-gradient(135deg, #FF8534, #FF6A00)",
          border: "none",
          color: "#ffffff",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          fontSize: "14px",
          fontWeight: 600,
          fontFamily: "Nunito, sans-serif",
          boxShadow: "0 6px 24px rgba(255, 102, 0, 0.42), 0 0 0 1px rgba(255, 133, 52, 0.2)",
          transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease, scale 0.25s ease",
          whiteSpace: "nowrap",
          touchAction: "manipulation",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.08)";
          e.currentTarget.style.boxShadow = "0 10px 36px rgba(255, 102, 0, 0.58), 0 0 0 1px rgba(255, 133, 52, 0.35)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 6px 24px rgba(255, 102, 0, 0.42), 0 0 0 1px rgba(255, 133, 52, 0.2)";
        }}
      >
        <span style={{ fontSize: "18px", lineHeight: 1 }}>🛠️</span>
        <span>Report Issue</span>
      </button>

      <style>{`
        @media (max-width: 640px) {
          /* Shift up on mobile so it sits above the shifted WhatsApp button */
          #floating-report-issue-btn {
            bottom: 158px !important;
            right: 16px !important;
            font-size: 13px;
            padding-left: 14px;
            padding-right: 14px;
            height: 44px;
          }
        }
      `}</style>
    </>
  );
}

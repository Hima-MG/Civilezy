"use client";

import { usePathname } from "next/navigation";
import { useSupportModal } from "@/contexts/SupportContext";

export default function FloatingSupportButton() {
  const { openModal } = useSupportModal();
  const pathname = usePathname();

  // Hide on admin pages and support pages
  if (pathname.startsWith("/admin") || pathname.startsWith("/support")) return null;

  return (
    <button
      onClick={openModal}
      id="floating-support-btn"
      aria-label="Report Technical Issue"
      title="Report Technical Issue"
      style={{
        position: "fixed",
        bottom: "90px",
        right: "20px",
        zIndex: 998,
        width: "52px",
        height: "52px",
        borderRadius: "50%",
        background: "linear-gradient(135deg,#1e3a5f,#0f2744)",
        border: "2px solid rgba(255,133,52,0.5)",
        color: "#fff",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "22px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,133,52,0.2)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.12)";
        e.currentTarget.style.boxShadow = "0 8px 28px rgba(255,98,0,0.4)";
        e.currentTarget.style.borderColor = "rgba(255,133,52,0.9)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,133,52,0.2)";
        e.currentTarget.style.borderColor = "rgba(255,133,52,0.5)";
      }}
    >
      🛠️
    </button>
  );
}

"use client";

import { useState } from "react";
import RenewalTable from "@/components/RenewalTable";
import { LEGACY_RENEWAL_COURSES } from "@/lib/renewal";

// Collapsible wrapper around the untouched legacy renewal table. The table,
// its data, and every Razorpay link are exactly what shipped before — this
// component only controls visibility.

const CONTENT_ID = "legacy-plans-content";

export default function LegacyPlansAccordion() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {/* Toggle — the section header above already explains who these plans are for */}
      <div className="mx-auto max-w-2xl text-center">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={CONTENT_ID}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 28px",
            borderRadius: "10px",
            background: "transparent",
            border: "1px solid rgba(255,133,52,0.45)",
            color: "#FF8534",
            fontWeight: 700,
            fontSize: "0.88rem",
            cursor: "pointer",
            fontFamily: "var(--font-rajdhani), Rajdhani, sans-serif",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            transition: "background 0.15s, border-color 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,133,52,0.10)";
            e.currentTarget.style.borderColor = "rgba(255,133,52,0.7)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "rgba(255,133,52,0.45)";
          }}
        >
          {open ? "Hide Legacy Renewal Plans" : "View Legacy Renewal Plans"}
          <span
            aria-hidden="true"
            style={{
              display: "inline-block",
              transform: open ? "rotate(180deg)" : "rotate(0)",
              transition: "transform 0.25s",
            }}
          >
            ▾
          </span>
        </button>
      </div>

      {/* Smooth-expanding content (grid-rows trick handles unknown height) */}
      <div
        id={CONTENT_ID}
        style={{
          display: "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "grid-template-rows 0.4s ease",
        }}
      >
        <div
          style={{
            overflow: "hidden",
            minHeight: 0,
            // visibility keeps collapsed links out of the tab order
            visibility: open ? "visible" : "hidden",
            transition: "visibility 0.4s",
          }}
        >
          <div style={{ paddingTop: "36px" }}>
            <RenewalTable courses={LEGACY_RENEWAL_COURSES} />
          </div>
        </div>
      </div>
    </div>
  );
}

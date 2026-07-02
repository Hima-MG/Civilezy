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
      {/* Prompt card */}
      <div
        className="mx-auto max-w-2xl text-center"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--card-border)",
          borderRadius: "18px",
          padding: "34px 28px",
        }}
      >
        <p
          style={{
            color: "#fff",
            fontFamily: "var(--font-rajdhani), Rajdhani, sans-serif",
            fontSize: "1.25rem",
            fontWeight: 700,
            marginBottom: "8px",
          }}
        >
          Need to renew an older membership?
        </p>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.88rem", marginBottom: "22px" }}>
          Courses launched up to <strong style={{ color: "#38bdf8" }}>31 March 2026</strong> use
          the legacy renewal plans below.
        </p>
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
            {/* Notice banner — unchanged from the previous layout */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                background: "rgba(56,189,248,0.07)",
                border: "1px solid rgba(56,189,248,0.22)",
                borderRadius: "10px",
                padding: "14px 20px",
                marginBottom: "28px",
                flexWrap: "wrap",
              }}
            >
              <span style={{ fontSize: "1.1rem" }}>📁</span>
              <p style={{ color: "rgba(255,255,255,0.72)", fontSize: "0.84rem", margin: 0 }}>
                These are courses launched{" "}
                <strong style={{ color: "#38bdf8" }}>up to 31 March 2026</strong>. If your
                membership started before this date, use the plans in this table.
              </p>
            </div>

            <RenewalTable courses={LEGACY_RENEWAL_COURSES} />
          </div>
        </div>
      </div>
    </div>
  );
}

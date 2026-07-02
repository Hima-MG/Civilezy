"use client";

import type { RenewalCourse } from "@/lib/renewal";

// Re-exported for backward compatibility — the type now lives in
// @/lib/renewal, which is the single source of truth for renewal shapes.
export type { RenewalCourse } from "@/lib/renewal";

interface RenewalTableProps {
  courses: RenewalCourse[];
}

// ── helpers ──────────────────────────────────────────────────────────────────

function tierStyle(tier?: string): { color: string; bg: string; border: string } {
  switch (tier) {
    case "Diamond":   return { color: "#67e8f9", bg: "rgba(103,232,249,0.12)", border: "rgba(103,232,249,0.30)" };
    case "Gold":      return { color: "#fbbf24", bg: "rgba(251,191,36,0.12)",  border: "rgba(251,191,36,0.30)"  };
    case "Silver":    return { color: "#94a3b8", bg: "rgba(148,163,184,0.12)", border: "rgba(148,163,184,0.30)" };
    case "Live Batch":return { color: "#c084fc", bg: "rgba(192,132,252,0.12)", border: "rgba(192,132,252,0.30)" };
    case "Grade II":  return { color: "#4ade80", bg: "rgba(74,222,128,0.12)",  border: "rgba(74,222,128,0.30)"  };
    case "Level Crs": return { color: "#FF8534", bg: "rgba(255,133,52,0.12)",  border: "rgba(255,133,52,0.30)"  };
    default:          return { color: "#FF8534", bg: "rgba(255,133,52,0.10)",  border: "rgba(255,133,52,0.25)"  };
  }
}

function validityStyle(validity?: string): { color: string; bg: string } {
  if (!validity) return { color: "rgba(255,255,255,0.4)", bg: "transparent" };
  if (validity.includes("12")) return { color: "#FF8534", bg: "rgba(255,133,52,0.12)" };
  if (validity.includes("6"))  return { color: "#38bdf8", bg: "rgba(56,189,248,0.10)" };
  if (validity.includes("3"))  return { color: "#4ade80", bg: "rgba(74,222,128,0.10)" };
  return { color: "rgba(255,255,255,0.55)", bg: "rgba(255,255,255,0.06)" };
}

// ── component ─────────────────────────────────────────────────────────────────

export default function RenewalTable({ courses }: RenewalTableProps) {
  const hasTier     = courses.some(c => c.tier);
  const hasValidity = courses.some(c => c.validity);
  const hasAmount   = courses.some(c => c.amount);

  return (
    <div style={{ overflowX: "auto", borderRadius: "14px", border: "1px solid rgba(255,133,52,0.22)" }}>
      <table style={{ width: "100%", minWidth: "480px", borderCollapse: "collapse" }}>

        {/* ── Header ── */}
        <thead>
          <tr style={{
            background: "linear-gradient(90deg, rgba(255,98,0,0.18) 0%, rgba(255,133,52,0.10) 100%)",
            borderBottom: "2px solid rgba(255,133,52,0.30)",
          }}>
            {/* always-visible cols */}
            {["#", "Code", "Membership Name"].map((col, i) => (
              <th key={col} style={thStyle(i === 0 ? "center" : "left")}>{col}</th>
            ))}
            {hasTier     && <th style={thStyle("center")}>Tier</th>}
            {hasValidity && <th style={thStyle("center")}>Validity</th>}
            {hasAmount   && <th style={thStyle("center")}>Amount</th>}
            <th style={thStyle("center")}>Renew</th>
          </tr>
        </thead>

        {/* ── Body ── */}
        <tbody>
          {courses.map((course, idx) => {
            const ts  = tierStyle(course.tier);
            const vs  = validityStyle(course.validity);
            const odd = idx % 2 === 0;

            return (
              <tr
                key={course.code}
                style={{
                  background: odd ? "rgba(255,255,255,0.022)" : "rgba(255,255,255,0.048)",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,133,52,0.07)")}
                onMouseLeave={e => (e.currentTarget.style.background = odd ? "rgba(255,255,255,0.022)" : "rgba(255,255,255,0.048)")}
              >
                {/* # */}
                <td style={{ padding: "12px 14px", textAlign: "center", color: "rgba(255,255,255,0.28)", fontSize: "0.78rem", fontWeight: 600, whiteSpace: "nowrap" }}>
                  {idx + 1}
                </td>

                {/* Code */}
                <td style={{ padding: "12px 14px", whiteSpace: "nowrap" }}>
                  <span style={{
                    display: "inline-block",
                    padding: "2px 9px",
                    borderRadius: "5px",
                    background: "rgba(255,98,0,0.13)",
                    border: "1px solid rgba(255,98,0,0.28)",
                    color: "#FF8534",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    fontFamily: "monospace",
                    letterSpacing: "0.04em",
                  }}>
                    {course.code}
                  </span>
                </td>

                {/* Name */}
                <td style={{ padding: "12px 14px", color: "rgba(255,255,255,0.85)", fontSize: "0.85rem", fontWeight: 500, minWidth: "200px" }}>
                  {course.name}
                </td>

                {/* Tier */}
                {hasTier && (
                  <td style={{ padding: "12px 14px", textAlign: "center" }}>
                    {course.tier ? (
                      <span style={{
                        display: "inline-block",
                        padding: "3px 11px",
                        borderRadius: "20px",
                        background: ts.bg,
                        border: `1px solid ${ts.border}`,
                        color: ts.color,
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        letterSpacing: "0.04em",
                        whiteSpace: "nowrap",
                      }}>
                        {course.tier}
                      </span>
                    ) : <span style={{ color: "rgba(255,255,255,0.2)" }}>—</span>}
                  </td>
                )}

                {/* Validity */}
                {hasValidity && (
                  <td style={{ padding: "12px 14px", textAlign: "center" }}>
                    {course.validity ? (
                      <span style={{
                        display: "inline-block",
                        padding: "3px 11px",
                        borderRadius: "6px",
                        background: vs.bg,
                        color: vs.color,
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}>
                        {course.validity}
                      </span>
                    ) : <span style={{ color: "rgba(255,255,255,0.2)" }}>—</span>}
                  </td>
                )}

                {/* Amount */}
                {hasAmount && (
                  <td style={{ padding: "12px 14px", textAlign: "center", color: "rgba(255,255,255,0.88)", fontSize: "0.9rem", fontWeight: 700, whiteSpace: "nowrap" }}>
                    {course.amount ?? <span style={{ color: "rgba(255,255,255,0.25)" }}>—</span>}
                  </td>
                )}

                {/* Renew */}
                <td style={{ padding: "10px 14px", textAlign: "center" }}>
                  <a
                    href={course.renewLink || "#"}
                    target={course.renewLink && course.renewLink !== "#" ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-block",
                      padding: "6px 16px",
                      borderRadius: "7px",
                      background: course.renewLink && course.renewLink !== "#"
                        ? "linear-gradient(135deg,#FF8534,#FF6200)"
                        : "rgba(255,255,255,0.07)",
                      color: course.renewLink && course.renewLink !== "#" ? "#fff" : "rgba(255,255,255,0.28)",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                      textDecoration: "none",
                      border: course.renewLink && course.renewLink !== "#" ? "none" : "1px solid rgba(255,255,255,0.10)",
                      cursor: course.renewLink && course.renewLink !== "#" ? "pointer" : "default",
                      transition: "opacity 0.14s, transform 0.14s",
                      whiteSpace: "nowrap",
                      fontFamily: "var(--font-rajdhani), Rajdhani, sans-serif",
                      textTransform: "uppercase",
                    }}
                    onMouseEnter={e => {
                      if (course.renewLink && course.renewLink !== "#") {
                        (e.currentTarget as HTMLAnchorElement).style.opacity = "0.85";
                        (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)";
                      }
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
                      (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                    }}
                  >
                    {course.renewLink && course.renewLink !== "#" ? "Renew →" : "Soon"}
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── shared th style helper ────────────────────────────────────────────────────
function thStyle(align: "left" | "center" | "right" = "left"): React.CSSProperties {
  return {
    padding: "13px 14px",
    textAlign: align,
    fontSize: "0.72rem",
    fontWeight: 700,
    color: "#FF8534",
    fontFamily: "var(--font-rajdhani), Rajdhani, sans-serif",
    letterSpacing: "0.09em",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  };
}

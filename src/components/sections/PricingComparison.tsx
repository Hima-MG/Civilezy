import Link from "next/link";

const COURSES = [
  {
    key:    "iti",
    label:  "ITI",
    emoji:  "🔧",
    color:  "#FF8534",
    border: "rgba(255,133,52,0.35)",
    bg:     "rgba(255,133,52,0.06)",
    price:  "₹1,800/mo",
    yearly: "₹15,000/yr",
    level:  "ITI / Trade Certificate",
    questions: "50,000+",
    mocks:  "1,000+",
    live:   true,
    audio:  true,
    subjects: ["Building Materials", "RCC & Steel", "Surveying", "Estimation", "Irrigation", "Public Health", "Transportation", "Mechanics"],
  },
  {
    key:    "diploma",
    label:  "Diploma",
    emoji:  "📐",
    color:  "#4C9BF0",
    border: "rgba(76,155,240,0.35)",
    bg:     "rgba(76,155,240,0.06)",
    price:  "₹2,000/mo",
    yearly: "₹17,000/yr",
    level:  "Diploma in Civil Engineering",
    questions: "50,000+",
    mocks:  "1,200+",
    live:   false,
    audio:  true,
    subjects: ["Building Construction", "Geotechnical Engg", "Structural Analysis", "Surveying", "Environmental Engg", "Transportation", "Irrigation", "Quantity Surveying"],
    popular: true,
  },
  {
    key:    "btech",
    label:  "B.Tech / AE",
    emoji:  "🏗️",
    color:  "#32C864",
    border: "rgba(50,200,100,0.35)",
    bg:     "rgba(50,200,100,0.06)",
    price:  "₹2,500/mo",
    yearly: "₹22,000/yr",
    level:  "B.Tech Civil Engineering",
    questions: "70,000+",
    mocks:  "1,500+",
    live:   false,
    audio:  true,
    subjects: ["Strength of Materials", "Structural Analysis", "RCC & Steel Design", "Fluid Mechanics", "Geotechnical Engg", "Transportation", "Construction Mgmt", "Quantity Surveying"],
  },
  {
    key:    "surveyor",
    label:  "Surveyor",
    emoji:  "📏",
    color:  "#A855F7",
    border: "rgba(168,85,247,0.35)",
    bg:     "rgba(168,85,247,0.06)",
    price:  "₹1,800/mo",
    yearly: "₹10,000/yr (3 months)",
    level:  "ITI Surveyor License",
    questions: "30,000+",
    mocks:  "1,000+",
    live:   false,
    audio:  true,
    subjects: ["Chain & Compass Survey", "Plane Table Survey", "Levelling & Contouring", "Theodolite Survey", "Total Station & GPS", "AutoCAD", "Land Acts", "Workshop Calc & Science"],
  },
] as const;

const ROWS = [
  { key: "level",     label: "Qualification" },
  { key: "questions", label: "Practice Questions" },
  { key: "mocks",     label: "Mock Tests" },
  { key: "audio",     label: "Malayalam Audio" },
  { key: "live",      label: "LIVE Classes" },
  { key: "price",     label: "Monthly Price" },
  { key: "yearly",    label: "Annual Price" },
] as const;

function Cell({ value }: { value: string | boolean }) {
  if (typeof value === "boolean") {
    return value
      ? <span style={{ color: "#32C864", fontSize: "18px" }}>✓</span>
      : <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "18px" }}>—</span>;
  }
  return <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>{value}</span>;
}

export default function PricingComparison() {
  return (
    <section aria-labelledby="comparison-heading" style={{ background: "#040C18", padding: "80px 0" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 5%" }}>

        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{ display: "inline-block", background: "rgba(255,98,0,0.12)", border: "1px solid rgba(255,98,0,0.25)", borderRadius: "100px", padding: "4px 16px", fontSize: "12px", fontWeight: 700, color: "#FF8534", letterSpacing: "0.5px", marginBottom: "14px" }}>
            COMPARE PLANS
          </div>
          <h2 id="comparison-heading" style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>
            Which Course Is Right for You?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "15px", margin: 0 }}>
            Pick based on your qualification. All plans include Game Arena access and Malayalam audio lessons.
          </p>
        </div>

        {/* Desktop table */}
        <div className="comparison-table-wrap" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 0" }}>
            <thead>
              <tr>
                <th style={{ padding: "12px 16px", textAlign: "left", color: "rgba(255,255,255,0.4)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.5px", whiteSpace: "nowrap", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  FEATURE
                </th>
                {COURSES.map((c) => (
                  <th
                    key={c.key}
                    style={{
                      padding:     "16px 12px",
                      textAlign:   "center",
                      borderBottom:"1px solid rgba(255,255,255,0.06)",
                      minWidth:    "140px",
                      position:    "relative",
                    }}
                  >
                    {"popular" in c && c.popular && (
                      <div style={{ position: "absolute", top: "-1px", left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, #FF6200, #FF8534)", borderRadius: "0 0 8px 8px", padding: "2px 12px", fontSize: "10px", fontWeight: 700, color: "#fff", whiteSpace: "nowrap", letterSpacing: "0.4px" }}>
                        MOST POPULAR
                      </div>
                    )}
                    <div style={{ fontSize: "1.4rem", marginBottom: "6px" }}>{c.emoji}</div>
                    <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "16px", fontWeight: 700, color: c.color }}>{c.label}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, ri) => (
                <tr key={row.key} style={{ background: ri % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                  <td style={{ padding: "14px 16px", fontSize: "13px", color: "rgba(255,255,255,0.55)", fontWeight: 500, whiteSpace: "nowrap", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    {row.label}
                  </td>
                  {COURSES.map((c) => (
                    <td key={c.key} style={{ padding: "14px 12px", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <Cell value={c[row.key as keyof typeof c] as string | boolean} />
                    </td>
                  ))}
                </tr>
              ))}

              {/* Subjects row */}
              <tr style={{ background: "rgba(255,255,255,0.02)" }}>
                <td style={{ padding: "14px 16px", fontSize: "13px", color: "rgba(255,255,255,0.55)", fontWeight: 500, verticalAlign: "top", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  Key Subjects
                </td>
                {COURSES.map((c) => (
                  <td key={c.key} style={{ padding: "14px 12px", textAlign: "center", verticalAlign: "top", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "center" }}>
                      {c.subjects.slice(0, 4).map((s) => (
                        <span key={s} style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.04)", borderRadius: "4px", padding: "2px 7px", whiteSpace: "nowrap" }}>{s}</span>
                      ))}
                      {c.subjects.length > 4 && (
                        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>+{c.subjects.length - 4} more</span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>

              {/* CTA row */}
              <tr>
                <td style={{ padding: "20px 16px" }} />
                {COURSES.map((c) => (
                  <td key={c.key} style={{ padding: "20px 12px", textAlign: "center" }}>
                    <Link
                      href={`/courses/${c.key}`}
                      style={{
                        display:        "inline-block",
                        background:     `linear-gradient(135deg, ${c.color}, ${c.color}cc)`,
                        color:          "#fff",
                        padding:        "10px 20px",
                        borderRadius:   "8px",
                        fontWeight:     700,
                        fontSize:       "13px",
                        textDecoration: "none",
                        fontFamily:     "Nunito, sans-serif",
                        whiteSpace:     "nowrap",
                      }}
                    >
                      View Course →
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Bottom note */}
        <p style={{ textAlign: "center", marginTop: "24px", fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>
          All plans include 48-hour free demo · No credit card required · Cancel anytime
        </p>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .comparison-table-wrap table { font-size: 12px; }
          .comparison-table-wrap th, .comparison-table-wrap td { min-width: 110px !important; padding: 10px 8px !important; }
        }
      `}</style>
    </section>
  );
}

// Shared section heading for the renewal page — extracted unchanged from the
// former SectionHeading sub-component of CourseRenewal.

export default function SectionHeader({
  label,
  title,
  sub,
}: {
  label: string;
  title: string;
  sub?: string;
}) {
  return (
    <div style={{ textAlign: "center", marginBottom: "40px" }}>
      <span
        style={{
          display: "inline-block",
          padding: "5px 18px",
          borderRadius: "100px",
          background: "rgba(255,133,52,0.12)",
          border: "1px solid rgba(255,133,52,0.3)",
          color: "#FF8534",
          fontSize: "0.72rem",
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: "16px",
        }}
      >
        {label}
      </span>
      <h2
        style={{
          fontFamily: "var(--font-rajdhani), Rajdhani, sans-serif",
          fontSize: "clamp(1.6rem, 3vw, 2.3rem)",
          fontWeight: 700,
          color: "#fff",
          lineHeight: 1.2,
          marginBottom: sub ? "12px" : 0,
        }}
      >
        {title}
      </h2>
      {sub && (
        <p
          style={{
            color: "rgba(255,255,255,0.55)",
            fontSize: "0.95rem",
            maxWidth: "560px",
            margin: "0 auto",
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

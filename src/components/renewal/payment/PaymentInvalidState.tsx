import Link from "next/link";

// Shown when ?courseId= / ?duration= don't resolve to a configured plan.

export default function PaymentInvalidState() {
  return (
    <div className="text-center" style={{ padding: "16px 0" }}>
      <div style={{ fontSize: "2.6rem", marginBottom: "14px" }} aria-hidden="true">
        ⚠️
      </div>
      <h1
        style={{
          color: "#fff",
          fontFamily: "var(--font-rajdhani), Rajdhani, sans-serif",
          fontSize: "1.4rem",
          fontWeight: 700,
          marginBottom: "8px",
        }}
      >
        Invalid renewal request.
      </h1>
      <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.9rem", marginBottom: "26px" }}>
        Please return to the renewal page and select your course again.
      </p>
      <Link
        href="/renew#new-courses"
        className="renewal-focus inline-block"
        style={{
          padding: "13px 28px",
          borderRadius: "10px",
          background: "linear-gradient(135deg, #FF8534, #FF6200)",
          color: "#fff",
          fontWeight: 700,
          fontSize: "0.9rem",
          textDecoration: "none",
          fontFamily: "var(--font-rajdhani), Rajdhani, sans-serif",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          boxShadow: "0 4px 16px rgba(255,98,0,0.3)",
        }}
      >
        Back to Renewal Plans
      </Link>
    </div>
  );
}

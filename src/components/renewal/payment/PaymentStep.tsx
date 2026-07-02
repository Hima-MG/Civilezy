import type { ReactNode } from "react";

// Numbered step shell used by PaymentActions — orange step badge inline with
// the heading, content full-width below (keeps buttons large on mobile).

export default function PaymentStep({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <li style={{ listStyle: "none" }}>
      <div className="flex items-center gap-3" style={{ marginBottom: "12px" }}>
        <span
          aria-hidden="true"
          className="shrink-0"
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "10px",
            background: "rgba(255,133,52,0.12)",
            border: "1px solid rgba(255,133,52,0.3)",
            color: "#FF8534",
            fontWeight: 700,
            fontSize: "0.8rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-rajdhani), Rajdhani, sans-serif",
          }}
        >
          {number}
        </span>
        <h2
          style={{
            color: "#fff",
            fontFamily: "var(--font-rajdhani), Rajdhani, sans-serif",
            fontSize: "1.05rem",
            fontWeight: 700,
            margin: 0,
          }}
        >
          {title}
        </h2>
      </div>
      {children}
    </li>
  );
}

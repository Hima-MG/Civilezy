import type { PaymentDetails } from "@/lib/renewal";

// Order summary shown at the top of the /renew/payment card. Pure display —
// every value comes from the central renewal configuration (works for both
// new and legacy plans via the normalised PaymentDetails shape).

function SummaryRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem" }}>{label}</dt>
      <dd
        className="text-right"
        style={{
          color: strong ? "#FF8534" : "#fff",
          fontSize: strong ? "1rem" : "0.9rem",
          fontWeight: 700,
          margin: 0,
        }}
      >
        {value}
      </dd>
    </div>
  );
}

export default function PaymentSummary({ details }: { details: PaymentDetails }) {
  return (
    <div>
      <h1
        style={{
          fontFamily: "var(--font-rajdhani), Rajdhani, sans-serif",
          fontSize: "clamp(1.4rem, 3vw, 1.8rem)",
          fontWeight: 700,
          color: "#fff",
          marginBottom: "4px",
        }}
      >
        Complete Your Renewal
      </h1>
      <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.85rem", marginBottom: "24px" }}>
        {details.description}
      </p>

      <dl className="flex flex-col gap-3" style={{ margin: 0 }}>
        <SummaryRow label="Course" value={details.courseName} />
        <SummaryRow label="Duration" value={details.duration} />
        <SummaryRow
          label="Price"
          value={details.amount ?? "Shown on the secure payment page"}
          strong
        />
      </dl>

      {/* Divider */}
      <div
        aria-hidden="true"
        style={{
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, rgba(255,133,52,0.35), transparent)",
          margin: "24px 0",
        }}
      />
    </div>
  );
}

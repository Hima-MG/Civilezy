"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { resolvePaymentDetails } from "@/lib/renewal";
import RenewalSupportCard from "@/components/renewal/RenewalSupportCard";
import PaymentSummary from "./PaymentSummary";
import PaymentActions from "./PaymentActions";
import PaymentInvalidState from "./PaymentInvalidState";

// Client shell of /renew/payment. Reads ONLY short identifiers from the URL
// (courseId + duration for new plans, planCode for legacy plans) and
// resolves everything else (name, price, links) from lib/renewal — long
// values never travel through the query string.

export default function PaymentPageContent() {
  const searchParams = useSearchParams();
  const details = resolvePaymentDetails({
    courseId: searchParams.get("courseId"),
    duration: searchParams.get("duration"),
    planCode: searchParams.get("planCode"),
  });

  return (
    <main
      style={{
        background: "linear-gradient(180deg, #0d2347 0%, var(--navy) 100%)",
        minHeight: "100vh",
        padding: "96px 16px 72px",
      }}
    >
      <div className="mx-auto w-full" style={{ maxWidth: "560px" }}>
        {/* Back link */}
        <Link
          href="/renew#new-courses"
          className="renewal-focus inline-flex items-center gap-2"
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: "0.85rem",
            fontWeight: 600,
            textDecoration: "none",
            marginBottom: "18px",
            padding: "4px 2px",
          }}
        >
          ← Back to Renewal Plans
        </Link>

        {/* Premium card */}
        <div
          style={{
            background: "var(--card-bg)",
            border: "1px solid rgba(255,133,52,0.22)",
            borderRadius: "20px",
            padding: "clamp(24px, 5vw, 40px)",
            boxShadow: "0 16px 48px rgba(0,0,0,0.35)",
          }}
        >
          {details ? (
            <>
              <PaymentSummary details={details} />
              <PaymentActions details={details} />
            </>
          ) : (
            <PaymentInvalidState />
          )}
        </div>

        {/* Shared WhatsApp support card */}
        <div className="text-center" style={{ marginTop: "40px" }}>
          <RenewalSupportCard />
        </div>
      </div>
    </main>
  );
}

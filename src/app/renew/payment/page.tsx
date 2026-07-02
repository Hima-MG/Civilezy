import { Suspense } from "react";
import type { Metadata } from "next";
import PaymentPageContent from "@/components/renewal/payment/PaymentPageContent";

// Checkout assistant between plan selection and the Renewal Portal. Not a
// payment gateway — it opens the existing Razorpay page and then hands the
// student off to the portal. Kept out of search results: it's parameter-
// driven and has no standalone value.

export const metadata: Metadata = {
  title: { absolute: "Complete Your Renewal Payment | CivilEzy" },
  robots: { index: false, follow: false },
};

export default function RenewPaymentPage() {
  return (
    <Suspense fallback={null}>
      <PaymentPageContent />
    </Suspense>
  );
}

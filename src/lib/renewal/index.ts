// ─── Renewal configuration — public entry point ──────────────────────────────
// Import everything renewal-related from "@/lib/renewal". Components must not
// define their own plan data, Razorpay links, or duration/course lists.

export * from "./types";
export * from "./lookup";
export { NEW_PLANS } from "./new-plans";
export { LEGACY_PLANS } from "./legacy-plans";

import { NEW_PLANS } from "./new-plans";
import { LEGACY_PLANS } from "./legacy-plans";
import { buildLegacyPaymentPageUrl } from "./lookup";
import type { NewRenewalPlan, RenewalCourse } from "./types";

/** New plans as rendered — enabled only, in display order. */
export const ENABLED_NEW_PLANS: NewRenewalPlan[] = [...NEW_PLANS]
  .filter((plan) => plan.enabled)
  .sort((a, b) => a.displayOrder - b.displayOrder);

/**
 * Legacy table rows — same data and order as LEGACY_PLANS, but the Renew
 * button routes through the payment guidance page (?planCode=…). The
 * original Razorpay link stays untouched in LEGACY_PLANS and is what that
 * page's "Pay Now" opens.
 */
export const LEGACY_RENEWAL_COURSES: RenewalCourse[] = LEGACY_PLANS.map(
  (plan) => ({
    code: plan.code,
    name: plan.name,
    tier: plan.tier,
    validity: plan.validity,
    amount: plan.amount,
    renewLink: buildLegacyPaymentPageUrl(plan),
  }),
);

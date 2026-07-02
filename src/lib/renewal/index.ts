// ─── Renewal configuration — public entry point ──────────────────────────────
// Import everything renewal-related from "@/lib/renewal". Components must not
// define their own plan data, Razorpay links, or duration/course lists.

export * from "./types";
export { NEW_PLANS } from "./new-plans";
export { LEGACY_PLANS } from "./legacy-plans";

import { NEW_PLANS } from "./new-plans";
import { LEGACY_PLANS } from "./legacy-plans";
import type { NewRenewalPlan, RenewalCourse } from "./types";

/** New plans as rendered — enabled only, in display order. */
export const ENABLED_NEW_PLANS: NewRenewalPlan[] = [...NEW_PLANS]
  .filter((plan) => plan.enabled)
  .sort((a, b) => a.displayOrder - b.displayOrder);

/** Legacy table rows — LEGACY_PLANS already match the row shape and order. */
export const LEGACY_RENEWAL_COURSES: RenewalCourse[] = LEGACY_PLANS.map(
  ({ code, name, tier, validity, amount, renewLink }) => ({
    code,
    name,
    tier,
    validity,
    amount,
    renewLink,
  }),
);

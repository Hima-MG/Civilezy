import { EXTERNAL_URLS } from "@/lib/constants";
import { NEW_PLANS } from "./new-plans";
import { LEGACY_PLANS } from "./legacy-plans";
import {
  NEW_PLAN_DURATIONS,
  type LegacyPlan,
  type NewPlanDuration,
  type NewRenewalPlan,
  type RenewalDuration,
  type RenewalDurationOption,
  type RenewalPrice,
} from "./types";

// ─── Lookup helpers for the /renew/payment guidance page ────────────────────
// The payment page receives only short identifiers in the URL:
//   • new plans:    ?courseId=<plan.id>&duration=<slug>
//   • legacy plans: ?planCode=<plan.code>
// and resolves everything else (name, price, Razorpay link, portal hand-off
// URL) from the central configuration. Nothing is duplicated and nothing
// sensitive travels through the query string.

/** URL slug for a duration, e.g. "1 Year" → "1-year". */
export function durationToSlug(duration: NewPlanDuration): string {
  return duration.toLowerCase().replace(/\s+/g, "-");
}

/** Reverse of durationToSlug. Returns undefined for unknown slugs. */
export function durationFromSlug(slug: string): NewPlanDuration | undefined {
  return NEW_PLAN_DURATIONS.find((d) => durationToSlug(d) === slug);
}

/** Find an enabled new plan by its short id (e.g. "iti"). */
export function getNewPlanById(id: string): NewRenewalPlan | undefined {
  return NEW_PLANS.find((plan) => plan.enabled && plan.id === id);
}

/** Find a legacy plan by its membership code (unique within LEGACY_PLANS). */
export function getLegacyPlanByCode(code: string): LegacyPlan | undefined {
  return LEGACY_PLANS.find((plan) => plan.code === code);
}

/**
 * Legacy validity label → the duration label the Renewal Portal's prefill
 * parser expects ("1 M" → "1 Month", …, "12 M" → "1 Year").
 */
export const VALIDITY_TO_PORTAL_DURATION: Record<
  RenewalDuration,
  NewPlanDuration
> = {
  "1 M": "1 Month",
  "3 M": "3 Months",
  "6 M": "6 Months",
  "12 M": "1 Year",
};

/** Internal payment-page URL for a new plan + duration. */
export function buildPaymentPageUrl(
  plan: NewRenewalPlan,
  option: RenewalDurationOption,
): string {
  const params = new URLSearchParams({
    courseId: plan.id,
    duration: durationToSlug(option.duration),
  });
  return `/renew/payment?${params.toString()}`;
}

/** Internal payment-page URL for a legacy plan (code only). */
export function buildLegacyPaymentPageUrl(plan: LegacyPlan): string {
  const params = new URLSearchParams({ planCode: plan.code });
  return `/renew/payment?${params.toString()}`;
}

/**
 * Everything the payment guidance page renders, normalised across new and
 * legacy plans so the same PaymentSummary / PaymentActions components serve
 * both flows.
 */
export type PaymentDetails = {
  courseName: string;
  description: string;
  /** Portal-compatible duration label. */
  duration: NewPlanDuration;
  /** Display price; absent → "shown on the payment page". */
  amount?: RenewalPrice;
  /** Existing payment link opened by "Pay Now" (unchanged URLs). */
  renewLink: string;
  /** Renewal Portal hand-off URL with prefill params. */
  portalUrl: string;
};

/**
 * Renewal Portal hand-off URL. Prefills course + duration (and amount when
 * a display price is configured) — the portal validates all three and
 * silently drops anything invalid, so this is purely a UX prefill.
 */
function buildPortalUrl(
  course: string,
  duration: NewPlanDuration,
  amount?: RenewalPrice,
): string {
  const params = new URLSearchParams({ course, duration });

  if (amount) {
    // Config prices are display strings like "₹1,800" — the portal expects
    // a plain positive number.
    const numeric = Number(amount.replace(/[^0-9.]/g, ""));
    if (Number.isFinite(numeric) && numeric > 0) {
      params.set("amount", String(numeric));
    }
  }

  return `${EXTERNAL_URLS.renewalPortal}/?${params.toString()}`;
}

/**
 * Resolve the payment page's query params to renderable details. Legacy
 * (?planCode=) takes precedence; otherwise ?courseId= + ?duration= resolve a
 * new plan. Returns undefined when nothing valid matches so the page can
 * show its error state.
 */
export function resolvePaymentDetails(params: {
  courseId: string | null;
  duration: string | null;
  planCode: string | null;
}): PaymentDetails | undefined {
  // ── Legacy plan ──
  if (params.planCode) {
    const plan = getLegacyPlanByCode(params.planCode);
    if (!plan) return undefined;

    const duration = VALIDITY_TO_PORTAL_DURATION[plan.validity];
    return {
      courseName: plan.name,
      description: `Legacy membership renewal — Code ${plan.code} · ${plan.tier} plan.`,
      duration,
      amount: plan.amount,
      renewLink: plan.renewLink,
      portalUrl: buildPortalUrl(plan.name, duration, plan.amount),
    };
  }

  // ── New plan ──
  if (!params.courseId || !params.duration) return undefined;

  const plan = getNewPlanById(params.courseId);
  const duration = durationFromSlug(params.duration);
  if (!plan || !duration) return undefined;

  const option = plan.durationOptions.find((o) => o.duration === duration);
  if (!option) return undefined;

  return {
    courseName: plan.name,
    description: plan.description,
    duration: option.duration,
    amount: option.amount,
    renewLink: option.renewLink,
    portalUrl: buildPortalUrl(plan.name, option.duration, option.amount),
  };
}

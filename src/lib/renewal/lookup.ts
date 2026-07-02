import { EXTERNAL_URLS } from "@/lib/constants";
import { NEW_PLANS } from "./new-plans";
import {
  NEW_PLAN_DURATIONS,
  type NewPlanDuration,
  type NewRenewalPlan,
  type RenewalDurationOption,
} from "./types";

// ─── Lookup helpers for the /renew/payment guidance page ────────────────────
// The payment page receives only ?courseId=<plan.id>&duration=<slug> and
// resolves everything else (name, description, price, Razorpay link, portal
// hand-off URL) from the central configuration. Nothing is duplicated and
// nothing sensitive travels through the URL.

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

export type ResolvedRenewalSelection = {
  plan: NewRenewalPlan;
  option: RenewalDurationOption;
};

/**
 * Resolve the ?courseId= and ?duration= query params to a plan + duration
 * option. Returns undefined when either param is missing/invalid so the
 * page can show its error state.
 */
export function resolveRenewalSelection(
  courseId: string | null,
  durationSlug: string | null,
): ResolvedRenewalSelection | undefined {
  if (!courseId || !durationSlug) return undefined;

  const plan = getNewPlanById(courseId);
  const duration = durationFromSlug(durationSlug);
  if (!plan || !duration) return undefined;

  const option = plan.durationOptions.find((o) => o.duration === duration);
  if (!option) return undefined;

  return { plan, option };
}

/** Internal payment-page URL for a plan + duration (short params only). */
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

/**
 * Renewal Portal hand-off URL. Prefills course + duration (and amount when
 * a display price is configured) — the portal validates all three and
 * silently drops anything invalid, so this is purely a UX prefill.
 */
export function buildRenewalPortalUrl(
  plan: NewRenewalPlan,
  option: RenewalDurationOption,
): string {
  const params = new URLSearchParams({
    course: plan.name,
    duration: option.duration,
  });

  if (option.amount) {
    // Config prices are display strings like "₹1,800" — the portal expects
    // a plain positive number.
    const numeric = Number(option.amount.replace(/[^0-9.]/g, ""));
    if (Number.isFinite(numeric) && numeric > 0) {
      params.set("amount", String(numeric));
    }
  }

  return `${EXTERNAL_URLS.renewalPortal}/?${params.toString()}`;
}

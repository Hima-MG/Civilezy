// ─── Renewal domain types ────────────────────────────────────────────────────
// Single source of truth for every renewal-related shape. No renewal string
// literals should live outside lib/renewal — plans, tiers, durations and
// Razorpay links are all defined here or in new-plans.ts / legacy-plans.ts.

/** Which plan table a course belongs to. */
export type RenewalCategory = "new" | "legacy";

/**
 * Validity label as displayed in the renewal tables.
 * (Phase 2 will map these onto the renewal portal's duration enum.)
 */
export type RenewalDuration = "1 M" | "3 M" | "6 M" | "12 M";

/** Plan tier badge shown in the legacy table. */
export type RenewalTier =
  | "Diamond"
  | "Gold"
  | "Silver"
  | "Live Batch"
  | "Grade II"
  | "Level Crs";

/**
 * Display-only price string, e.g. "₹25,000". The authoritative amount is
 * configured on the Razorpay payment page — this value is never charged.
 */
export type RenewalPrice = string;

/** Duration choices offered in the renewal dialog for new plans. */
export const NEW_PLAN_DURATIONS = [
  "1 Month",
  "3 Months",
  "6 Months",
  "1 Year",
] as const;

export type NewPlanDuration = (typeof NEW_PLAN_DURATIONS)[number];

/** One selectable duration inside the renewal dialog. */
export interface RenewalDurationOption {
  duration: NewPlanDuration;
  /**
   * Display price. Absent until per-duration Razorpay pages exist — the
   * dialog then tells the student the price is shown on the payment page.
   * Never invent a value here; it must mirror the Razorpay dashboard.
   */
  amount?: RenewalPrice;
  /** Razorpay payment page opened by "Proceed to Payment". */
  renewLink: string;
}

/**
 * Row shape consumed by <RenewalTable />. Optional columns (tier / validity /
 * amount) are auto-hidden by the table when absent for every row.
 */
export interface RenewalCourse {
  code: string;
  name: string;
  tier?: string;
  validity?: string;
  amount?: string;
  renewLink: string;
}

/**
 * A current-generation plan (courses launched from 01 April 2026).
 * Richer than what the UI renders today — description / durations / amount
 * exist for the Phase 2 migration and are not displayed yet.
 */
export interface NewRenewalPlan {
  /** Short stable identifier, e.g. "iti". */
  id: string;
  /** Membership code shown in the table, e.g. "1039". */
  code: string;
  /** Course name shown in the table. */
  name: string;
  /** Short course description rendered on the renewal card. */
  description: string;
  /**
   * Duration choices shown in the renewal dialog. Until Phase 3 creates a
   * dedicated Razorpay page per duration, every option points at the
   * course's single existing payment page and omits the display amount.
   */
  durationOptions: RenewalDurationOption[];
  /** Razorpay payment-page URL. Must never be changed without a dashboard change. */
  renewLink: string;
  /** Ascending sort order within the new-courses table. */
  displayOrder: number;
  /** Disabled plans are excluded from the table. */
  enabled: boolean;
}

/**
 * A legacy plan (courses launched up to 31 March 2026). Field-for-field copy
 * of the table row — array order in legacy-plans.ts is the display order.
 */
export interface LegacyPlan {
  code: string;
  name: string;
  tier: RenewalTier;
  validity: RenewalDuration;
  amount: RenewalPrice;
  renewLink: string;
}

export type RenewalPlan = NewRenewalPlan | LegacyPlan;

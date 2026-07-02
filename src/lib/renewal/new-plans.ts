import {
  NEW_PLAN_DURATIONS,
  type NewRenewalPlan,
  type RenewalDurationOption,
} from "./types";

// ─── New courses — renewal plans (launched from 01 April 2026) ──────────────
// Single source of truth. Razorpay links here must stay in sync with the
// payment pages configured in the Razorpay dashboard — do not edit one
// without the other.
//
// Duration options: every duration currently opens the course's single
// existing Razorpay page, and amounts are deliberately omitted — the price
// is shown on the payment page itself. Phase 3 will point each duration at
// its own Razorpay page and add verified display amounts.

function standardDurations(renewLink: string): RenewalDurationOption[] {
  return NEW_PLAN_DURATIONS.map((duration) => ({ duration, renewLink }));
}

const ITI_LINK = "https://rzp.io/rzp/civil-psc-iti-level";
const DIPLOMA_LINK = "https://rzp.io/rzp/civil-psc-diploma-level";
const BTECH_LINK = "https://rzp.io/rzp/civil-psc-btech-level";
const SURVEYOR_LINK = "https://rzp.io/rzp/civil-psc-surveyor-level";

export const NEW_PLANS: NewRenewalPlan[] = [
  {
    id: "iti",
    code: "1039",
    name: "Civil PSC – ITI",
    description: "Kerala PSC Civil Engineering course renewal — ITI level.",
    durationOptions: standardDurations(ITI_LINK),
    renewLink: ITI_LINK,
    displayOrder: 1,
    enabled: true,
  },
  {
    id: "diploma",
    code: "1040",
    name: "Civil PSC – Diploma",
    description: "Kerala PSC Civil Engineering course renewal — Diploma level.",
    durationOptions: standardDurations(DIPLOMA_LINK),
    renewLink: DIPLOMA_LINK,
    displayOrder: 2,
    enabled: true,
  },
  {
    id: "btech",
    code: "1041",
    name: "Civil PSC – B.Tech / AE",
    description: "Kerala PSC Civil Engineering course renewal — B.Tech / AE level.",
    durationOptions: standardDurations(BTECH_LINK),
    renewLink: BTECH_LINK,
    displayOrder: 3,
    enabled: true,
  },
  {
    id: "surveyor",
    code: "1042",
    name: "Civil PSC – Surveyor",
    description: "Kerala PSC Civil Engineering course renewal — Surveyor level.",
    durationOptions: standardDurations(SURVEYOR_LINK),
    renewLink: SURVEYOR_LINK,
    displayOrder: 4,
    enabled: true,
  },
];

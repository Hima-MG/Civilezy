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

function buildDurations(
  oneMonthLink: string,
  oneYearLink: string,
): RenewalDurationOption[] {
  return [
    {
      duration: "1 Month",
      renewLink: oneMonthLink,
    },
    {
      duration: "1 Year",
      renewLink: oneYearLink,
    },
  ];
}

const ITI_LINK = "https://rzp.io/rzp/civil-psc-iti-level";
const DIPLOMA_LINK = "https://rzp.io/rzp/civil-psc-diploma-level";
const BTECH_LINK = "https://rzp.io/rzp/civil-psc-btech-level";
const SURVEYOR_LINK = "https://rzp.io/rzp/civil-psc-surveyor-level";

const ITI_ONE_YEAR_LINK =
  "https://learn.civilezy.in/en/checkout/?product_id=4987&price_id=271682&product_type=membership";

const DIPLOMA_ONE_YEAR_LINK =
  "https://learn.civilezy.in/en/checkout/?product_id=5041&price_id=271680&product_type=membership";

const BTECH_ONE_YEAR_LINK =
  "https://learn.civilezy.in/en/checkout/?product_id=5042&price_id=271509&product_type=membership";

const SURVEYOR_ONE_YEAR_LINK =
  "https://learn.civilezy.in/en/checkout/?product_id=4733&price_id=271684&product_type=membership";

export const NEW_PLANS: NewRenewalPlan[] = [
  {
    id: "iti",
    code: "1041",
    name: "Civil PSC – ITI",
    description: "Kerala PSC Civil Engineering course renewal — ITI level.",
   durationOptions: buildDurations(
  ITI_LINK,
  ITI_ONE_YEAR_LINK,
),
    renewLink: ITI_LINK,
    displayOrder: 1,
    enabled: true,
  },
  {
    id: "diploma",
    code: "1040",
    name: "Civil PSC – Diploma",
    description: "Kerala PSC Civil Engineering course renewal — Diploma level.",
durationOptions: buildDurations(
  DIPLOMA_LINK,
  DIPLOMA_ONE_YEAR_LINK,
),    renewLink: DIPLOMA_LINK,
    displayOrder: 2,
    enabled: true,
  },
  {
    id: "btech",
    code: "1039",
    name: "Civil PSC – B.Tech / AE",
    description: "Kerala PSC Civil Engineering course renewal — B.Tech / AE level.",
durationOptions: buildDurations(
  BTECH_LINK,
  BTECH_ONE_YEAR_LINK,
),    renewLink: BTECH_LINK,
    displayOrder: 3,
    enabled: true,
  },
  {
    id: "surveyor",
    code: "1042",
    name: "Civil PSC – Surveyor",
    description: "Kerala PSC Civil Engineering course renewal — Surveyor level.",
durationOptions: buildDurations(
  SURVEYOR_LINK,
  SURVEYOR_ONE_YEAR_LINK,
),    renewLink: SURVEYOR_LINK,
    displayOrder: 4,
    enabled: true,
  },
];

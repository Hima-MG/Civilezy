import type { LegacyPlan } from "./types";

// ─── Legacy courses — renewal plans (launched up to 31 March 2026) ──────────
// Field-for-field copy of the plans previously hardcoded in
// components/sections/CourseRenewal.tsx. Array order IS the display order.
// Every code, name, tier, validity, amount and Razorpay link must remain
// byte-identical to the Razorpay dashboard configuration.
//
// NOTE: codes 1039–1042 also exist in new-plans.ts and map to the SAME
// course levels there (1039 B.Tech, 1040 Diploma, 1041 ITI, 1042 Surveyor).
// The two tables stay independent — lookups never cross between them.

export const LEGACY_PLANS: LegacyPlan[] = [
  // ── B.Tech ──
  { code: "1001", name: "B.TECH — Diamond Plan (12 Month)", tier: "Diamond", validity: "12 M", amount: "₹25,000", renewLink: "https://rzp.io/rzp/btech-diamond-twelve-months" },
  { code: "1002", name: "B.TECH — Diamond Plan (6 Month)",  tier: "Diamond", validity: "6 M",  amount: "₹15,000", renewLink: "https://rzp.io/rzp/btech-diamond-six-months" },
  { code: "1003", name: "B.TECH — Diamond Plan (3 Month)",  tier: "Diamond", validity: "3 M",  amount: "₹7,800",  renewLink: "https://rzp.io/rzp/btech-diamond-three-months" },
  { code: "1004", name: "B.TECH — Diamond Plan (1 Month)",  tier: "Diamond", validity: "1 M",  amount: "₹3,000",  renewLink: "https://rzp.io/rzp/btech-diamond-one-months" },
  { code: "1005", name: "B.TECH — Gold Plan (12 Month)",    tier: "Gold",    validity: "12 M", amount: "₹18,000", renewLink: "https://rzp.io/rzp/btech-gold-twelve-months" },
  { code: "1006", name: "B.TECH — Gold Plan (6 Month)",     tier: "Gold",    validity: "6 M",  amount: "₹10,200", renewLink: "https://rzp.io/rzp/btech-gold-six-months" },
  { code: "1007", name: "B.TECH — Gold Plan (3 Month)",     tier: "Gold",    validity: "3 M",  amount: "₹5,400",  renewLink: "https://rzp.io/rzp/btech-gold-three-months" },
  { code: "1008", name: "B.TECH — Gold Plan (1 Month)",     tier: "Gold",    validity: "1 M",  amount: "₹2,000",  renewLink: "https://rzp.io/rzp/btech-gold-one-months" },
  { code: "1009", name: "B.TECH — Silver Plan (12 Month)",  tier: "Silver",  validity: "12 M", amount: "₹9,000",  renewLink: "https://rzp.io/rzp/btech-silver-twelve-months" },
  { code: "1010", name: "B.TECH — Silver Plan (6 Month)",   tier: "Silver",  validity: "6 M",  amount: "₹5,200",  renewLink: "https://rzp.io/rzp/btech-silver-six-months" },
  { code: "1011", name: "B.TECH — Silver Plan (3 Month)",   tier: "Silver",  validity: "3 M",  amount: "₹2,700",  renewLink: "https://rzp.io/rzp/btech-silver-three-months" },
  { code: "1012", name: "B.TECH — Silver Plan (1 Month)",   tier: "Silver",  validity: "1 M",  amount: "₹1,000",  renewLink: "https://rzp.io/rzp/btech-silver-one-month" },
  // ── Diploma ──
  { code: "1013", name: "DIPLOMA — Diamond Plan (12 Month)", tier: "Diamond", validity: "12 M", amount: "₹20,000", renewLink: "https://rzp.io/rzp/diploma-diamond-twelve-month" },
  { code: "1014", name: "DIPLOMA — Diamond Plan (6 Month)",  tier: "Diamond", validity: "6 M",  amount: "₹12,000", renewLink: "https://rzp.io/rzp/diploma-diamond-six-month" },
  { code: "1015", name: "DIPLOMA — Diamond Plan (3 Month)",  tier: "Diamond", validity: "3 M",  amount: "₹6,200",  renewLink: "https://rzp.io/rzp/diploma-diamond-three-month" },
  { code: "1016", name: "DIPLOMA — Diamond Plan (1 Month)",  tier: "Diamond", validity: "1 M",  amount: "₹2,400",  renewLink: "https://rzp.io/rzp/diploma-diamond-one-month" },
  { code: "1017", name: "DIPLOMA — Gold Plan (12 Month)",    tier: "Gold",    validity: "12 M", amount: "₹14,000", renewLink: "https://rzp.io/rzp/diploma-gold-twelve-month" },
  { code: "1018", name: "DIPLOMA — Gold Plan (6 Month)",     tier: "Gold",    validity: "6 M",  amount: "₹8,000",  renewLink: "https://rzp.io/rzp/diploma-gold-six-month" },
  { code: "1019", name: "DIPLOMA — Gold Plan (3 Month)",     tier: "Gold",    validity: "3 M",  amount: "₹4,200",  renewLink: "https://rzp.io/rzp/diploma-gold-three-month" },
  { code: "1020", name: "DIPLOMA — Gold Plan (1 Month)",     tier: "Gold",    validity: "1 M",  amount: "₹1,600",  renewLink: "https://rzp.io/rzp/diploma-gold-one-month" },
  { code: "1021", name: "DIPLOMA — Silver Plan (12 Month)",  tier: "Silver",  validity: "12 M", amount: "₹7,000",  renewLink: "https://rzp.io/rzp/diploma-silver-twelve-month" },
  { code: "1022", name: "DIPLOMA — Silver Plan (6 Month)",   tier: "Silver",  validity: "6 M",  amount: "₹4,000",  renewLink: "https://rzp.io/rzp/diploma-silver-six-month" },
  { code: "1023", name: "DIPLOMA — Silver Plan (3 Month)",   tier: "Silver",  validity: "3 M",  amount: "₹2,100",  renewLink: "https://rzp.io/rzp/diploma-silver-three-month" },
  { code: "1024", name: "DIPLOMA — Silver Plan (1 Month)",   tier: "Silver",  validity: "1 M",  amount: "₹800",    renewLink: "https://rzp.io/rzp/diploma-silver-one-month" },
  // ── ITI ──
  { code: "1025", name: "ITI — Diamond Plan (12 Month)", tier: "Diamond", validity: "12 M", amount: "₹15,500", renewLink: "https://rzp.io/rzp/iti-diamond-twelve-months" },
  { code: "1026", name: "ITI — Diamond Plan (6 Month)",  tier: "Diamond", validity: "6 M",  amount: "₹9,000",  renewLink: "https://rzp.io/rzp/iti-diamond-six-months" },
  { code: "1027", name: "ITI — Diamond Plan (3 Month)",  tier: "Diamond", validity: "3 M",  amount: "₹4,800",  renewLink: "https://rzp.io/rzp/iti-diamond-three-months" },
  { code: "1028", name: "ITI — Diamond Plan (1 Month)",  tier: "Diamond", validity: "1 M",  amount: "₹1,800",  renewLink: "https://rzp.io/rzp/iti-diamond-one-month" },
  { code: "1029", name: "ITI — Gold Plan (12 Month)",    tier: "Gold",    validity: "12 M", amount: "₹10,500", renewLink: "https://rzp.io/rzp/iti-gold-twelve-months" },
  { code: "1030", name: "ITI — Gold Plan (6 Month)",     tier: "Gold",    validity: "6 M",  amount: "₹6,000",  renewLink: "https://rzp.io/rzp/iti-gold-six-months" },
  { code: "1031", name: "ITI — Gold Plan (3 Month)",     tier: "Gold",    validity: "3 M",  amount: "₹3,200",  renewLink: "https://rzp.io/rzp/iti-gold-three-months" },
  { code: "1032", name: "ITI — Gold Plan (1 Month)",     tier: "Gold",    validity: "1 M",  amount: "₹1,200",  renewLink: "https://rzp.io/rzp/iti-gold-one-months" },
  { code: "1033", name: "ITI — Silver Plan (12 Month)",  tier: "Silver",  validity: "12 M", amount: "₹5,500",  renewLink: "https://rzp.io/rzp/iti-silver-twelve-months" },
  { code: "1034", name: "ITI — Silver Plan (6 Month)",   tier: "Silver",  validity: "6 M",  amount: "₹3,000",  renewLink: "https://rzp.io/rzp/iti-silver-six-months" },
  { code: "1035", name: "ITI — Silver Plan (3 Month)",   tier: "Silver",  validity: "3 M",  amount: "₹1,600",  renewLink: "https://rzp.io/rzp/iti-silver-three-months" },
  { code: "1036", name: "ITI — Silver Plan (1 Month)",   tier: "Silver",  validity: "1 M",  amount: "₹600",    renewLink: "https://rzp.io/rzp/iti-silver-one-month" },
  // ── Special ──
  { code: "1037", name: "Overseer Live (ITI Level) — Batch 1", tier: "Live Batch", validity: "1 M", amount: "₹1,000", renewLink: "https://rzp.io/rzp/live-overseer-iti" },
  { code: "1038", name: "KWA Grade II Course",                 tier: "Grade II",   validity: "1 M", amount: "₹1,000", renewLink: "https://rzp.io/rzp/kwa-gradeii" },
  { code: "1039", name: "Civil PSC — B.Tech Level Course",     tier: "Level Crs",  validity: "1 M", amount: "₹1,800", renewLink: "https://rzp.io/rzp/btech-level-course" },
  { code: "1040", name: "Civil PSC — Diploma Level Course",    tier: "Level Crs",  validity: "1 M", amount: "₹1,400", renewLink: "https://rzp.io/rzp/diploma-level-course" },
  { code: "1041", name: "Civil PSC — ITI Level Course",        tier: "Level Crs",  validity: "1 M", amount: "₹1,000", renewLink: "https://rzp.io/rzp/overseer-revised-course" },
  { code: "1042", name: "Civil PSC — Surveyor Level Course",   tier: "Level Crs",  validity: "1 M", amount: "₹1,000", renewLink: "https://rzp.io/rzp/surveyor-grade2" },
];

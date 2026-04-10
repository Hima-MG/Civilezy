// ─── External LMS (EzyCourse) URLs ──────────────────────────────────────────
// All links that leave civilezy.in point here. Never hardcode these in
// individual components — always import from this file.
export const EXTERNAL_URLS = {
  base:     "https://learn.civilezy.in",
  login:    "https://learn.civilezy.in/en/login",
  checkout: "https://learn.civilezy.in/en/checkout/?product_id=4987&price_id=271682&product_type=membership",
  about:    "https://learn.civilezy.in/en/about-v2",
  terms:    "https://learn.civilezy.in/en/terms-of-use-v2",
  privacy:  "https://learn.civilezy.in/en/privacy-policy-v2",
  freeTest: "https://learn.civilezy.in/en/free-test",
  contact:  "https://www.civilezy.in/en/contact-v2",
} as const;

// ─── Course pricing links (footer + levels section) ─────────────────────────
export const COURSE_LINKS: Record<string, string> = {
  iti:      "https://learn.civilezy.in/en/checkout/?product_id=4987&price_id=271682&product_type=membership",
  diploma:  "https://learn.civilezy.in/en/checkout/?product_id=4987&price_id=271682&product_type=membership",
  btech:    "https://learn.civilezy.in/en/checkout/?product_id=4987&price_id=271682&product_type=membership",
  kwa:      "https://learn.civilezy.in/en/checkout/?product_id=4987&price_id=271682&product_type=membership",
  pwd:      "https://learn.civilezy.in/en/checkout/?product_id=4987&price_id=271682&product_type=membership",
  surveyor: "https://learn.civilezy.in/en/checkout/?product_id=4987&price_id=271682&product_type=membership",
} as const;

// ─── Site metadata ───────────────────────────────────────────────────────────
export const SITE = {
  name:        "Civilezy",
  tagline:     "Kerala's #1 Civil Engineering PSC Platform",
  description: "Kerala's only PSC Civil Engineering platform with Smart Lessons, Malayalam Audio Lessons, Smart Quiz System, Short Video Lessons (40–50 min), and Game Arena. ITI / Diploma / AE prep.",
  url:         "https://civilezy.in",
  email:       "support@civilezy.in",
  phone:       "+91 98765 43210",
} as const;

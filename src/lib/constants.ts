// ─── External LMS (EzyCourse) URLs ──────────────────────────────────────────
// All links that leave civilezy.com point here. Never hardcode these in
// individual components — always import from this file.
export const EXTERNAL_URLS = {
  base:     "https://learn.civilezy.in",
  login:    "https://learn.civilezy.in/en/login",
  checkout: "https://learn.civilezy.in/en/checkout/?product_id=4987&price_id=271682&product_type=membership",
  about:    "https://learn.civilezy.in/en/about-v2",
  terms:    "https://learn.civilezy.in/en/terms-of-use-v2",
  privacy:  "https://learn.civilezy.in/en/privacy-policy-v2",
  freeTest: "https://learn.civilezy.in/en/free-test",
} as const;

// ─── Site metadata ───────────────────────────────────────────────────────────
export const SITE = {
  name:        "Civilezy",
  tagline:     "Kerala's #1 Civil Engineering PSC Platform",
  description: "Kerala's only PSC Civil Engineering platform with Smart Lessons, Malayalam Audio Lessons, Smart Quiz System, Short Video Lessons (40–50 min), and Game Arena. ITI / Diploma / AE prep.",
  url:         "https://civilezy.ezycourse.com",
  email:       "support@civilezy.com",
  phone:       "+91 98765 43210",
} as const;

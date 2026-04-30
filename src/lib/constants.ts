// ─── WhatsApp ────────────────────────────────────────────────────────────────
export const WHATSAPP_NUMBER = "919072345630";
export const WHATSAPP_DISPLAY = "+91 90723 45630";

export function getWhatsAppUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// ─── External LMS URLs ──────────────────────────────────────────────────────
// All links that leave civilezy.in point here. Never hardcode these in
// individual components — always import from this file.
export const EXTERNAL_URLS = {
  login:     "https://learn.civilezy.in/en/signup",
  signup:    "https://learn.civilezy.in/register",
  dashboard: "https://learn.civilezy.in/dashboard",
  demo:      "https://civilezy.ezycourse.com/checkout/?product_id=41923&product_type=course",
  blog:      "https://learn.civilezy.in/blog",
  about:     "https://learn.civilezy.in/about",
  contact:   "https://learn.civilezy.in/contact/",
  see:"https://youtu.be/38tjn1OC1t0?si=1jkR9Yc0m8__3Rpy",

  legal: {
    privacy: "https://learn.civilezy.in/privacy-policy",
    terms:   "https://learn.civilezy.in/en/terms-of-use-v2",
    refund:  "https://learn.civilezy.in/refund-policy",
  },

  checkout: {
    iti:      "https://learn.civilezy.in/en/checkout/?product_id=4987&price_id=271682&product_type=membership",
    diploma:  "https://learn.civilezy.in/en/checkout/?product_id=5041&price_id=271680&product_type=membership",
    btech:    "https://learn.civilezy.in/en/checkout/?product_id=5042&price_id=271509&product_type=membership",
    surveyor: "https://learn.civilezy.in/en/checkout/?product_id=4733&price_id=271684&product_type=membership",
  },

  social: {
    telegram:  "https://t.me/civilezy_psc",
    whatsapp:  `https://wa.me/${WHATSAPP_NUMBER}`,
  },

  apps: {
    playStore: "https://play.google.com/store/apps/details?id=com.civilezy.civilezy",
    appStore:  "https://apps.apple.com/us/app/civilezy/id6749293661",
  },
} as const;

// ─── Site metadata ───────────────────────────────────────────────────────────
export const SITE = {
  name:        "CivilEzy",
  tagline:     "Kerala's #1 Civil Engineering PSC Platform",
  description: "Kerala's only PSC Civil Engineering platform with Smart Lessons, Malayalam Audio Lessons, Smart Quiz System, Short Video Lessons (40–50 min), and Game Arena. ITI / Diploma / AE prep.",
  url:         "https://civilezy.in",
  email:       "support@civilezy.in",
  phone:       WHATSAPP_DISPLAY,
} as const;

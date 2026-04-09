"use client";

import Link from "next/link";
import { EXTERNAL_URLS } from "@/lib/constants";

// ─── URL Constants ──────────────────────────────────────────────────────────
// ⚠️  Replace with your real WhatsApp Business number before going live
//     Format: https://wa.me/<countrycode><number>
const WA_LINK = "https://wa.me/919876543210";

// ⚠️  Replace "#" hrefs with real social profile URLs before going live
const SOCIAL = [
  { label: "Chat on WhatsApp", emoji: "💬", href: WA_LINK },
  { label: "Watch on YouTube",  emoji: "▶",  href: "#"    },  // ⚠️ add real URL
  { label: "Follow on Instagram",emoji:"📷", href: "#"    },  // ⚠️ add real URL
  { label: "Join Telegram",      emoji: "✈", href: "#"    },  // ⚠️ add real URL
] as const;

// ─── Nav data ───────────────────────────────────────────────────────────────
// Internal paths use Next.js <Link>; external use <a>
const FOOTER_NAV: Record<string, { label: string; href: string; external?: boolean }[]> = {
  Courses: [
    { label:"ITI Civil PSC",     href:"/courses/iti"     },
    { label:"Diploma Civil PSC", href:"/courses/diploma" },
    { label:"AE / B.Tech PSC",   href:"/courses/ae"      },
    { label:"KWA AE Prep",       href:"/courses/kwa-ae"  },
    { label:"PWD Overseer",      href:"/courses/pwd"     },
  ],
  Resources: [
    { label:"Previous Year Questions", href:"/resources/pyq"           },
    { label:"Study Plans",             href:"/resources/study-plans"   },
    { label:"PSC Notifications",       href:"/resources/notifications" },
    { label:"Rank Holder Stories",     href:"/resources/stories"       },
    { label:"Free Mock Test",          href:"/mock-tests"              },
  ],
  Company: [
    { label:"About Us",         href:EXTERNAL_URLS.about,   external:true },
    { label:"Contact",          href:"/contact"                           },
    { label:"WhatsApp Support", href:WA_LINK,               external:true },
    { label:"Privacy Policy",   href:EXTERNAL_URLS.privacy, external:true },
    { label:"Refund Policy",    href:"/refund"                            },
  ],
};

// ─── Stable hover handlers ───────────────────────────────────────────────────
const onLinkEnter = (e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.color = "#FF8534"; };
const onLinkLeave = (e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.color = "rgba(255,255,255,0.55)"; };

const onSocialEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.background   = "rgba(255,98,0,0.2)";
  e.currentTarget.style.borderColor  = "rgba(255,98,0,0.4)";
};
const onSocialLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.background   = "rgba(255,255,255,0.05)";
  e.currentTarget.style.borderColor  = "rgba(255,255,255,0.1)";
};

const onFabEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.transform = "scale(1.1)";
  e.currentTarget.style.boxShadow = "0 10px 35px rgba(37,211,102,0.6)";
};
const onFabLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.transform = "scale(1)";
  e.currentTarget.style.boxShadow = "0 6px 25px rgba(37,211,102,0.5)";
};

// ─── Component ──────────────────────────────────────────────────────────────
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <>
      <footer
        aria-label="Site footer"
        style={{ background:"#040C18", borderTop:"1px solid rgba(255,255,255,0.06)", padding:"50px 5% 30px" }}
      >
        <div className="footer-layout">

          {/* ── Brand column ── */}
          <div style={{ maxWidth:"280px" }}>
            <Link
              href="/"
              aria-label="Civilezy home"
              style={{ display:"flex", alignItems:"center", gap:"10px", fontFamily:"Rajdhani, sans-serif", fontSize:"22px", fontWeight:700, textDecoration:"none", color:"#ffffff", marginBottom:"12px" }}
            >
              <span aria-hidden="true"
                style={{ width:"36px", height:"36px", borderRadius:"10px", background:"linear-gradient(135deg,#FF6200,#FFB347)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px", fontWeight:800, color:"white", boxShadow:"0 4px 15px rgba(255,98,0,0.4)", flexShrink:0 }}>
                C
              </span>
              Civil<span style={{ color:"#FF8534" }}>ezy</span>
            </Link>

            <p style={{ fontSize:"14px", color:"rgba(255,255,255,0.55)", lineHeight:1.7 }}>
              Kerala&apos;s only dedicated Civil Engineering PSC platform. Pool-based mock tests,
              Malayalam content, expert-built questions. From confused to confident rank holder.
            </p>

            <div style={{ marginTop:"16px", display:"flex", gap:"8px", flexWrap:"wrap" }} aria-label="Platform categories">
              {["Kerala PSC", "Civil Engineering", "ITI | Diploma | AE"].map(tag => (
                <span key={tag} style={{ background:"rgba(255,98,0,0.1)", border:"1px solid rgba(255,98,0,0.2)", borderRadius:"20px", padding:"4px 12px", fontSize:"12px", color:"#FF8534" }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* ── Link columns — each wrapped in <nav> for landmark navigation ── */}
          {Object.entries(FOOTER_NAV).map(([heading, links]) => (
            <nav key={heading} aria-label={`${heading} links`}>
              <h3 style={{ fontFamily:"Rajdhani, sans-serif", fontSize:"17px", fontWeight:700, marginBottom:"16px", color:"#ffffff" }}>
                {heading}
              </h3>
              <ul style={{ listStyle:"none", padding:0, margin:0, display:"flex", flexDirection:"column", gap:"10px" }}>
                {links.map(link => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color:"rgba(255,255,255,0.55)", textDecoration:"none", fontSize:"14px", transition:"color 0.2s" }}
                        onMouseEnter={onLinkEnter}
                        onMouseLeave={onLinkLeave}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        style={{ color:"rgba(255,255,255,0.55)", textDecoration:"none", fontSize:"14px", transition:"color 0.2s" }}
                        onMouseEnter={onLinkEnter}
                        onMouseLeave={onLinkLeave}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* ── Bottom bar ── */}
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:"24px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"12px", marginTop:"40px" }}>
          <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.55)" }}>
            © {year} Civilezy. All rights reserved. Made with ❤️ for Kerala PSC aspirants.
          </p>

          <div style={{ display:"flex", gap:"12px" }} role="list" aria-label="Social media links">
            {SOCIAL.map(s => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                target="_blank"
                rel="noopener noreferrer"
                role="listitem"
                style={{ width:"36px", height:"36px", borderRadius:"10px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"16px", cursor:"pointer", transition:"all 0.2s", textDecoration:"none" }}
                onMouseEnter={onSocialEnter}
                onMouseLeave={onSocialLeave}
              >
                <span aria-hidden="true">{s.emoji}</span>
              </a>
            ))}
          </div>
        </div>
      </footer>

      {/* ── WhatsApp FAB ──────────────────────────────────────────────────── */}
      {/* z-index: 800 — below StickyCTA (900) so they don't overlap on mobile  */}
      {/* On desktop it sits comfortably in the corner with room to spare       */}
      <a
        href={WA_LINK}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Civilezy support on WhatsApp"
        style={{ position:"fixed", bottom:"28px", right:"28px", zIndex:800, width:"56px", height:"56px", borderRadius:"50%", background:"#25D366", boxShadow:"0 6px 25px rgba(37,211,102,0.5)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"28px", transition:"transform 0.2s, box-shadow 0.2s", textDecoration:"none" }}
        onMouseEnter={onFabEnter}
        onMouseLeave={onFabLeave}
      >
        <span aria-hidden="true">💬</span>
      </a>

      {/* ── Responsive layout ── */}
      <style>{`
        .footer-layout {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
        }
        @media (max-width: 900px) {
          .footer-layout { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 600px) {
          .footer-layout { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
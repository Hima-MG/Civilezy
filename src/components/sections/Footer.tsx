"use client";

import Link from "next/link";
import Image from "next/image";
import { EXTERNAL_URLS } from "@/lib/constants";

// ─── URL Constants ──────────────────────────────────────────────────────────
const WA_LINK       = EXTERNAL_URLS.social.whatsapp;
const YT_LINK       = "https://www.youtube.com/@CivilEzy";
const IG_LINK       = "https://www.instagram.com/civilezy_by_wincentre";
const FB_LINK       = "https://www.facebook.com";

// ─── Nav data ───────────────────────────────────────────────────────────────
// All course / resource links point to the LMS (external).
// Internal paths use Next.js <Link>; external use <a>.
const FOOTER_NAV: Record<string, { label: string; href: string; external?: boolean }[]> = {
  Courses: [
    { label:"All Courses",        href:"/courses"          },
    { label:"Civil PSC — ITI",    href:"/courses/iti"      },
    { label:"Civil PSC — Diploma",href:"/courses/diploma"  },
    { label:"Civil PSC — B.Tech", href:"/courses/btech"    },
    { label:"Surveyor Course",    href:"/courses/surveyor" },
  ],
  Resources: [
    { label:"Game Arena",         href:"/game-arena"       },
    { label:"Blog & Guides",      href:"/blog"             },
    { label:"Pricing Plans",      href:"/pricing"          },
  ],
  Company: [
    { label:"About Us",         href:EXTERNAL_URLS.about,         external:true },
    { label:"Contact",          href:EXTERNAL_URLS.contact,       external:true },
    { label:"WhatsApp Support", href:WA_LINK,                     external:true },
    { label:"Privacy Policy",   href:EXTERNAL_URLS.legal.privacy, external:true },
    { label:"Terms of Use",     href:EXTERNAL_URLS.legal.terms,   external:true },
  ],
};

// ─── Stable hover handlers ───────────────────────────────────────────────────
const onLinkEnter = (e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.color = "#FF8534"; };
const onLinkLeave = (e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.color = "rgba(255,255,255,0.55)"; };

const onSocialEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.transform = "scale(1.1)";
  e.currentTarget.style.opacity   = "1";
};
const onSocialLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.transform = "scale(1)";
  e.currentTarget.style.opacity   = "0.75";
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
              aria-label="CivilEzy home"
              style={{ display:"flex", alignItems:"center", textDecoration:"none", marginBottom:"12px" }}
            >
              <Image
                src="/civilezy_logo_orange.png"
                alt="CivilEzy Logo"
                width={120}
                height={34}
                className="h-9 w-auto"
                style={{ objectFit:"contain" }}
              />
            </Link>

            <p style={{ fontSize:"14px", color:"rgba(255,255,255,0.55)", lineHeight:1.7 }}>
              Kerala&apos;s only dedicated Civil Engineering PSC platform. Course category-based mock tests,
              Malayalam cAudio Lessons,Smart interactive lessond, expert-built questions. From confused to confident rank holder.
            </p>

            <div style={{ marginTop:"16px", display:"flex", gap:"8px", flexWrap:"wrap" }} aria-label="Platform categories">
              {["Kerala PSC", "Civil Engineering", "ITI | Diploma | B.Tech"].map(tag => (
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
            © {year} CivilEzy. All rights reserved. Made with ❤️ for Kerala PSC aspirants.
          </p>

          <div style={{ display:"flex", gap:"10px" }} role="list" aria-label="Social media links">
            {/* WhatsApp */}
            <a href={WA_LINK} aria-label="Chat on WhatsApp" target="_blank" rel="noopener noreferrer" role="listitem"
              style={{ width:"36px", height:"36px", borderRadius:"10px", background:"rgba(37,211,102,0.15)", display:"flex", alignItems:"center", justifyContent:"center", textDecoration:"none", opacity:0.75, transition:"transform 0.2s, opacity 0.2s" }}
              onMouseEnter={onSocialEnter} onMouseLeave={onSocialLeave}
            >
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
            {/* YouTube */}
            <a href={YT_LINK} aria-label="CivilEzy YouTube channel" target="_blank" rel="noopener noreferrer" role="listitem"
              style={{ width:"36px", height:"36px", borderRadius:"10px", background:"rgba(255,0,0,0.15)", display:"flex", alignItems:"center", justifyContent:"center", textDecoration:"none", opacity:0.75, transition:"transform 0.2s, opacity 0.2s" }}
              onMouseEnter={onSocialEnter} onMouseLeave={onSocialLeave}
            >
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            {/* Instagram */}
            <a href={IG_LINK} aria-label="CivilEzy Instagram" target="_blank" rel="noopener noreferrer" role="listitem"
              style={{ width:"36px", height:"36px", borderRadius:"10px", background:"rgba(131,58,180,0.15)", display:"flex", alignItems:"center", justifyContent:"center", textDecoration:"none", opacity:0.75, transition:"transform 0.2s, opacity 0.2s" }}
              onMouseEnter={onSocialEnter} onMouseLeave={onSocialLeave}
            >
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="url(#ig-grad)"><defs><linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#fcb045"/><stop offset="50%" stopColor="#fd1d1d"/><stop offset="100%" stopColor="#833ab4"/></linearGradient></defs><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            {/* Facebook */}
            <a href={FB_LINK} aria-label="CivilEzy Facebook" target="_blank" rel="noopener noreferrer" role="listitem"
              style={{ width:"36px", height:"36px", borderRadius:"10px", background:"rgba(24,119,242,0.15)", display:"flex", alignItems:"center", justifyContent:"center", textDecoration:"none", opacity:0.75, transition:"transform 0.2s, opacity 0.2s" }}
              onMouseEnter={onSocialEnter} onMouseLeave={onSocialLeave}
            >
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
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
        aria-label="Chat with CivilEzy support on WhatsApp"
        style={{ position:"fixed", bottom:"28px", right:"28px", zIndex:800, width:"56px", height:"56px", borderRadius:"50%", background:"#25D366", boxShadow:"0 6px 25px rgba(37,211,102,0.5)", display:"flex", alignItems:"center", justifyContent:"center", transition:"transform 0.2s, box-shadow 0.2s", textDecoration:"none" }}
        onMouseEnter={onFabEnter}
        onMouseLeave={onFabLeave}
      >
        <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
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
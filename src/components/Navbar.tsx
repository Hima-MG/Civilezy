"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { EXTERNAL_URLS } from "@/lib/constants";

const URLS = {
  LMS_LOGIN:     EXTERNAL_URLS.login,
  LMS_ENROLL:    EXTERNAL_URLS.checkout,
} as const;

const NAV_LINKS = [
  { label: "Home",       href: "/"           },
  { label: "Game Arena", href: "/game-arena" },
  { label: "Courses",    href: "/pricing"    },
  { label: "Blog",       href: "https://learn.civilezy.in/blog" },
] as const;

export default function Navbar() {
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [scrolled,  setScrolled]  = useState(false);

  // Add shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change / resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 900) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      <nav
        style={{
          position:       "fixed",
          top:            0,
          left:           0,
          right:          0,
          zIndex:         1000,
          height:         "70px",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          padding:        "0 5%",
          background:     scrolled
            ? "rgba(11,30,61,0.98)"
            : "rgba(11,30,61,0.95)",
          backdropFilter:       "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom:   "1px solid rgba(255,98,0,0.2)",
          transition:     "background 0.3s",
          boxSizing:      "border-box",
        }}
      >
        {/* ── Logo ───────────────────────────────────────── */}
        <Link href="/" aria-label="CivilEzy home" style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}>
          <Image
            src="/civilezy_logo_orange.png"
            alt="CivilEzy Logo"
            width={140}
            height={40}
            priority
            className="h-10 w-auto"
            style={{ objectFit: "contain" }}
          />
        </Link>

        {/* ── Desktop nav links ──────────────────────────── */}
        <ul style={styles.navLinks} className="nav-desktop">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href} style={{ listStyle: "none" }}>
              <NavLink href={href}>{label}</NavLink>
            </li>
          ))}
        </ul>

        {/* ── Right side: Login + CTA + Hamburger ──────── */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <a
            href={URLS.LMS_LOGIN}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-login"
            style={styles.loginLink}
          >
            Login
          </a>

          {/* Hamburger — mobile only */}
          <button
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((v) => !v)}
            style={styles.hamburger}
            className="hamburger-btn"
          >
            <span style={hamburgerBar(menuOpen, 0)} />
            <span style={hamburgerBar(menuOpen, 1)} />
            <span style={hamburgerBar(menuOpen, 2)} />
          </button>
        </div>
      </nav>

      {/* ── Mobile dropdown menu ────────────────────────── */}
      <div
        style={{
          ...styles.mobileMenu,
          maxHeight: menuOpen ? "400px" : "0",
          opacity:   menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
        }}
        className="mobile-menu"
      >
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {NAV_LINKS.map(({ label, href }) => {
            const isExternal = href.startsWith("http");
            const Tag = isExternal ? "a" : Link;
            const extra = isExternal ? { target: "_blank" as const, rel: "noopener noreferrer" } : {};
            return (
              <li key={href} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <Tag
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  style={styles.mobileLink}
                  {...extra}
                >
                  {label}
                </Tag>
              </li>
            );
          })}
        </ul>

        <div style={{ display: "flex", gap: "12px", padding: "16px 0 4px" }}>
          <a
            href={URLS.LMS_LOGIN}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.mobileSecondaryBtn}
          >
            Login
          </a>
          <a
            href={URLS.LMS_ENROLL}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.mobilePrimaryBtn}
          >
            Enroll Now
          </a>
        </div>
      </div>

      {/* ── Responsive styles injected once ─────────────── */}
      <style>{`
        .nav-desktop { display: flex; }
        .nav-login   { display: block; }
        .hamburger-btn { display: none; }
        .mobile-menu   { display: none; }

        @media (max-width: 900px) {
          .nav-desktop   { display: none !important; }
          .nav-login     { display: none !important; }
          .hamburger-btn { display: flex !important; }
          .mobile-menu   { display: block !important; }
        }
      `}</style>
    </>
  );
}

/* ─── Inline NavLink with hover ────────────────────────────────────────── */
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const isExternal = href.startsWith("http");
  const Tag = isExternal ? "a" : Link;
  const extra = isExternal ? { target: "_blank" as const, rel: "noopener noreferrer" } : {};
  return (
    <Tag
      href={href}
      style={styles.navLinkBase}
      {...extra}
      onMouseEnter={(e: React.MouseEvent<HTMLElement>) =>
        (e.currentTarget.style.color = "#FF8534")
      }
      onMouseLeave={(e: React.MouseEvent<HTMLElement>) =>
        (e.currentTarget.style.color = "rgba(255,255,255,0.85)")
      }
    >
      {children}
    </Tag>
  );
}

/* ─── Hamburger bar transform helper ───────────────────────────────────── */
function hamburgerBar(open: boolean, index: number): React.CSSProperties {
  const base: React.CSSProperties = {
    display:      "block",
    width:        "24px",
    height:       "2px",
    background:   "white",
    borderRadius: "2px",
    transition:   "transform 0.3s, opacity 0.3s",
  };
  if (!open) return base;
  if (index === 0) return { ...base, transform: "rotate(45deg) translate(5px, 5px)" };
  if (index === 1) return { ...base, opacity: 0, transform: "scaleX(0)" };
  return { ...base, transform: "rotate(-45deg) translate(5px, -5px)" };
}

/* ─── Static styles object ─────────────────────────────────────────────── */
const styles = {
  navLinks: {
    display:    "flex",
    alignItems: "center",
    gap:        "2rem",
    margin:     0,
    padding:    0,
  } as React.CSSProperties,

  navLinkBase: {
    color:          "rgba(255,255,255,0.85)",
    textDecoration: "none",
    fontSize:       "15px",
    fontWeight:     500,
    transition:     "color 0.2s",
    whiteSpace:     "nowrap",
  } as React.CSSProperties,

  loginLink: {
    color:          "rgba(255,255,255,0.65)",
    textDecoration: "none",
    fontSize:       "14px",
    fontWeight:     600,
    transition:     "color 0.2s",
    whiteSpace:     "nowrap",
  } as React.CSSProperties,

  hamburger: {
    background:     "none",
    border:         "none",
    cursor:         "pointer",
    flexDirection:  "column",
    gap:            "5px",
    padding:        "4px",
  } as React.CSSProperties,

  mobileMenu: {
    position:       "fixed",
    top:            "70px",
    left:           0,
    right:          0,
    zIndex:         999,
    background:     "rgba(11,30,61,0.98)",
    backdropFilter: "blur(12px)",
    borderBottom:   "1px solid rgba(255,98,0,0.2)",
    padding:        "0 5%",
    overflow:       "hidden",
    transition:     "max-height 0.35s ease, opacity 0.3s ease",
  } as React.CSSProperties,

  mobileLink: {
    display:        "block",
    color:          "rgba(255,255,255,0.85)",
    textDecoration: "none",
    fontSize:       "16px",
    fontWeight:     500,
    padding:        "14px 0",
  } as React.CSSProperties,

  mobileSecondaryBtn: {
    flex:           1,
    textAlign:      "center",
    background:     "transparent",
    color:          "white",
    border:         "2px solid rgba(255,255,255,0.25)",
    padding:        "12px 0",
    borderRadius:   "50px",
    fontFamily:     "Nunito, sans-serif",
    fontSize:       "15px",
    fontWeight:     700,
    textDecoration: "none",
    display:        "block",
    transition:     "border-color 0.2s",
  } as React.CSSProperties,

  mobilePrimaryBtn: {
    flex:           1,
    textAlign:      "center",
    background:     "linear-gradient(135deg, #FF6200, #FF8534)",
    color:          "white",
    border:         "none",
    padding:        "12px 0",
    borderRadius:   "50px",
    fontFamily:     "Nunito, sans-serif",
    fontSize:       "15px",
    fontWeight:     700,
    textDecoration: "none",
    display:        "block",
    boxShadow:      "0 4px 20px rgba(255,98,0,0.4)",
  } as React.CSSProperties,
} as const;
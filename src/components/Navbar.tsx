"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { EXTERNAL_URLS } from "@/lib/constants";
import { useAnnouncementBar } from "@/contexts/AnnouncementContext";

const NAV_LINKS = [
  { label: "Home",       href: "/"           },
  { label: "Game Arena", href: "/game-arena" },
  { label: "Pricing",    href: "/pricing"    },
  { label: "Blog",       href: "/blog"       },
] as const;

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { barHeight } = useAnnouncementBar();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 900) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <>
      <nav
        style={{
          position:       "fixed",
          top:            barHeight,
          left:           0,
          right:          0,
          zIndex:         1000,
          height:         "70px",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          padding:        "0 5%",
          background:     scrolled ? "rgba(11,30,61,0.98)" : "rgba(11,30,61,0.95)",
          backdropFilter:       "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom:   "1px solid rgba(255,98,0,0.2)",
          transition:     "background 0.3s",
          boxSizing:      "border-box",
        }}
      >
        {/* ── Logo ─────────────────────────────── */}
        <Link href="/" aria-label="CivilEzy home" style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}>
          <Image
            src="/civilezy_logo_orange.png"
            alt="CivilEzy — Kerala PSC Civil Engineering Coaching"
            width={140}
            height={40}
            priority
            className="h-10 w-auto"
            style={{ objectFit: "contain" }}
          />
        </Link>

        {/* ── Desktop nav ───────────────────────── */}
        <ul style={{ display: "flex", alignItems: "center", gap: "2rem", margin: 0, padding: 0 }} className="nav-desktop">
          {NAV_LINKS.map(({ label, href }) => {
            const active = href === "/" ? pathname === "/" : pathname?.startsWith(href) ?? false;
            return (
              <li key={href} style={{ listStyle: "none" }}>
                <Link
                  href={href}
                  style={{
                    color:          active ? "#FF8534" : "rgba(255,255,255,0.85)",
                    textDecoration: "none",
                    fontSize:       "15px",
                    fontWeight:     active ? 700 : 500,
                    fontFamily:     "Nunito, sans-serif",
                    transition:     "color 0.2s",
                    whiteSpace:     "nowrap",
                    paddingBottom:  "3px",
                    borderBottom:   active ? "2px solid #FF8534" : "2px solid transparent",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#FF8534"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = active ? "#FF8534" : "rgba(255,255,255,0.85)"; }}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* ── Login + Hamburger ─────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <a
            href={EXTERNAL_URLS.login}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-login"
            style={{
              background:     "linear-gradient(135deg, #FF8534, #FF6A00)",
              color:          "white",
              textDecoration: "none",
              fontSize:       "14px",
              fontWeight:     700,
              padding:        "9px 24px",
              borderRadius:   "50px",
              boxShadow:      "0 4px 18px rgba(255,98,0,0.35)",
              transition:     "transform 0.25s ease, box-shadow 0.25s ease",
              whiteSpace:     "nowrap",
              display:        "inline-block",
              fontFamily:     "Nunito, sans-serif",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px) scale(1.04)";
              e.currentTarget.style.boxShadow = "0 8px 28px rgba(255,98,0,0.55)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 18px rgba(255,98,0,0.35)";
            }}
          >
            Login
          </a>

          <button
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="hamburger-btn"
            style={{ background: "none", border: "none", cursor: "pointer", flexDirection: "column", gap: "5px", padding: "4px" }}
          >
            <span style={bar(menuOpen, 0)} />
            <span style={bar(menuOpen, 1)} />
            <span style={bar(menuOpen, 2)} />
          </button>
        </div>
      </nav>

      {/* ── Mobile menu ───────────────────────────── */}
      <div
        className="mobile-menu"
        style={{
          position:      "fixed",
          top:           70 + barHeight,
          left:          0,
          right:         0,
          zIndex:        999,
          background:    "rgba(11,30,61,0.98)",
          backdropFilter:"blur(12px)",
          borderBottom:  "1px solid rgba(255,98,0,0.2)",
          padding:       "0 5%",
          overflow:      "hidden",
          maxHeight:     menuOpen ? "400px" : "0",
          opacity:       menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transition:    "max-height 0.35s ease, opacity 0.3s ease",
        }}
      >
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {NAV_LINKS.map(({ label, href }) => {
            const active = href === "/" ? pathname === "/" : pathname?.startsWith(href) ?? false;
            return (
              <li key={href} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <Link
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display:        "block",
                    color:          active ? "#FF8534" : "rgba(255,255,255,0.85)",
                    textDecoration: "none",
                    fontSize:       "16px",
                    fontWeight:     active ? 700 : 500,
                    padding:        "14px 0",
                    fontFamily:     "Nunito, sans-serif",
                  }}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div style={{ padding: "16px 0 20px" }}>
          <a
            href={EXTERNAL_URLS.login}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display:        "block",
              textAlign:      "center",
              background:     "linear-gradient(135deg, #FF8534, #FF6A00)",
              color:          "white",
              padding:        "13px 0",
              borderRadius:   "50px",
              fontFamily:     "Nunito, sans-serif",
              fontSize:       "15px",
              fontWeight:     700,
              textDecoration: "none",
              boxShadow:      "0 4px 18px rgba(255,98,0,0.35)",
            }}
          >
            Login
          </a>
        </div>
      </div>

      <style>{`
        .nav-desktop   { display: flex; }
        .nav-login     { display: block; }
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

function bar(open: boolean, i: number): React.CSSProperties {
  const base: React.CSSProperties = {
    display: "block", width: "24px", height: "2px",
    background: "white", borderRadius: "2px",
    transition: "transform 0.3s, opacity 0.3s",
  };
  if (!open) return base;
  if (i === 0) return { ...base, transform: "rotate(45deg) translate(5px, 5px)" };
  if (i === 1) return { ...base, opacity: 0, transform: "scaleX(0)" };
  return { ...base, transform: "rotate(-45deg) translate(5px, -5px)" };
}

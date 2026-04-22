"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { EXTERNAL_URLS } from "@/lib/constants";
import { useAnnouncementBar } from "@/contexts/AnnouncementContext";

const URLS = {
  LMS_LOGIN: EXTERNAL_URLS.login,
} as const;

const COURSE_ITEMS = [
  { label: "All Courses", href: "/courses" },
  { label: "ITI Civil",   href: "/courses/iti" },
  { label: "Diploma",     href: "/courses/diploma" },
  { label: "B.Tech / AE", href: "/courses/btech" },
  { label: "Surveyor",    href: "/courses/surveyor" },
] as const;

export default function Navbar() {
  const [menuOpen,      setMenuOpen]      = useState(false);
  const [coursesOpen,   setCoursesOpen]   = useState(false);
  const [mobileCoursesOpen, setMobileCoursesOpen] = useState(false);
  const [scrolled,      setScrolled]      = useState(false);
  const { barHeight } = useAnnouncementBar();
  const pathname      = usePathname();
  const dropdownRef   = useRef<HTMLLIElement>(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCoursesOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setCoursesOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  const isCoursesActive = pathname?.startsWith("/courses") || pathname === "/pricing";

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
            alt="CivilEzy Logo"
            width={140}
            height={40}
            priority
            className="h-10 w-auto"
            style={{ objectFit: "contain" }}
          />
        </Link>

        {/* ── Desktop nav ───────────────────────── */}
        <ul style={{ display: "flex", alignItems: "center", gap: "2rem", margin: 0, padding: 0 }} className="nav-desktop">

          <li style={{ listStyle: "none" }}>
            <NavLink href="/" active={pathname === "/"}>Home</NavLink>
          </li>

          <li style={{ listStyle: "none" }}>
            <NavLink href="/game-arena" active={pathname === "/game-arena"}>Game Arena</NavLink>
          </li>

          {/* Courses dropdown */}
          <li style={{ listStyle: "none", position: "relative" }} ref={dropdownRef}>
            <button
              onClick={() => setCoursesOpen((v) => !v)}
              onMouseEnter={() => setCoursesOpen(true)}
              style={{
                background:     "none",
                border:         "none",
                cursor:         "pointer",
                display:        "inline-flex",
                alignItems:     "center",
                gap:            "5px",
                color:          isCoursesActive ? "#FF8534" : "rgba(255,255,255,0.85)",
                fontSize:       "15px",
                fontWeight:     isCoursesActive ? 700 : 500,
                fontFamily:     "Nunito, sans-serif",
                padding:        0,
                transition:     "color 0.2s",
                whiteSpace:     "nowrap",
              }}
              onMouseLeave={() => {/* keep open; handled by onMouseLeave on container */}}
              aria-expanded={coursesOpen}
              aria-haspopup="true"
            >
              Courses
              <ChevronIcon open={coursesOpen} />
            </button>

            {/* Dropdown panel */}
            <div
              onMouseEnter={() => setCoursesOpen(true)}
              onMouseLeave={() => setCoursesOpen(false)}
              style={{
                position:     "absolute",
                top:          "calc(100% + 14px)",
                left:         "50%",
                transform:    "translateX(-50%)",
                background:   "rgba(8,22,50,0.98)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border:       "1px solid rgba(255,98,0,0.2)",
                borderRadius: "14px",
                padding:      "8px",
                minWidth:     "200px",
                boxShadow:    "0 20px 60px rgba(0,0,0,0.5)",
                opacity:      coursesOpen ? 1 : 0,
                marginTop:    coursesOpen ? "0px" : "-6px",
                pointerEvents: coursesOpen ? "auto" : "none",
                transition:   "opacity 0.2s ease, margin-top 0.2s ease",
                zIndex:       100,
              }}
            >
              {/* Arrow */}
              <div style={{
                position:   "absolute",
                top:        "-6px",
                left:       "50%",
                transform:  "translateX(-50%) rotate(45deg)",
                width:      "12px",
                height:     "12px",
                background: "rgba(8,22,50,0.98)",
                borderTop:  "1px solid rgba(255,98,0,0.2)",
                borderLeft: "1px solid rgba(255,98,0,0.2)",
              }} />

              {COURSE_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      display:        "flex",
                      alignItems:     "center",
                      gap:            "10px",
                      padding:        "10px 14px",
                      borderRadius:   "8px",
                      textDecoration: "none",
                      fontSize:       "14px",
                      fontWeight:     isActive ? 700 : 500,
                      color:          isActive ? "#FF8534" : "rgba(255,255,255,0.82)",
                      background:     isActive ? "rgba(255,98,0,0.1)" : "transparent",
                      transition:     "background 0.15s, color 0.15s",
                      whiteSpace:     "nowrap",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = "rgba(255,98,0,0.07)";
                        e.currentTarget.style.color = "#FF8534";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "rgba(255,255,255,0.82)";
                      }
                    }}
                  >
                    <span style={{
                      width:        "6px",
                      height:       "6px",
                      borderRadius: "50%",
                      background:   isActive ? "#FF8534" : "rgba(255,255,255,0.25)",
                      flexShrink:   0,
                      transition:   "background 0.15s",
                    }} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </li>

          <li style={{ listStyle: "none" }}>
            <NavLink href="/pricing" active={pathname === "/pricing"}>Pricing</NavLink>
          </li>

          <li style={{ listStyle: "none" }}>
            <NavLink href="/blog" active={pathname?.startsWith("/blog") ?? false}>Blog</NavLink>
          </li>

        </ul>

        {/* ── Right: Login + Hamburger ──────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <a
            href={URLS.LMS_LOGIN}
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

          {/* Hamburger — mobile only */}
          <button
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((v) => !v)}
            style={{
              background:    "none",
              border:        "none",
              cursor:        "pointer",
              flexDirection: "column",
              gap:           "5px",
              padding:       "4px",
            }}
            className="hamburger-btn"
          >
            <span style={hamburgerBar(menuOpen, 0)} />
            <span style={hamburgerBar(menuOpen, 1)} />
            <span style={hamburgerBar(menuOpen, 2)} />
          </button>
        </div>
      </nav>

      {/* ── Mobile menu ───────────────────────────── */}
      <div
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
          maxHeight:     menuOpen ? "600px" : "0",
          opacity:       menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transition:    "max-height 0.35s ease, opacity 0.3s ease",
        }}
        className="mobile-menu"
      >
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>

          {/* Home */}
          <MobileNavItem href="/" active={pathname === "/"} onClick={() => setMenuOpen(false)}>
            Home
          </MobileNavItem>

          {/* Game Arena */}
          <MobileNavItem href="/game-arena" active={pathname === "/game-arena"} onClick={() => setMenuOpen(false)}>
            Game Arena
          </MobileNavItem>

          {/* Courses accordion */}
          <li style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <button
              onClick={() => setMobileCoursesOpen((v) => !v)}
              style={{
                display:        "flex",
                alignItems:     "center",
                justifyContent: "space-between",
                width:          "100%",
                background:     "none",
                border:         "none",
                cursor:         "pointer",
                color:          isCoursesActive ? "#FF8534" : "rgba(255,255,255,0.85)",
                fontSize:       "16px",
                fontWeight:     isCoursesActive ? 700 : 500,
                fontFamily:     "Nunito, sans-serif",
                padding:        "14px 0",
              }}
            >
              Courses
              <ChevronIcon open={mobileCoursesOpen} />
            </button>

            {/* Sub-items */}
            <div style={{
              overflow:   "hidden",
              maxHeight:  mobileCoursesOpen ? "300px" : "0",
              transition: "max-height 0.3s ease",
            }}>
              {COURSE_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display:        "flex",
                      alignItems:     "center",
                      gap:            "10px",
                      padding:        "10px 0 10px 16px",
                      textDecoration: "none",
                      fontSize:       "15px",
                      fontWeight:     isActive ? 700 : 400,
                      color:          isActive ? "#FF8534" : "rgba(255,255,255,0.65)",
                    }}
                  >
                    <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: isActive ? "#FF8534" : "rgba(255,255,255,0.25)", flexShrink: 0 }} />
                    {item.label}
                  </Link>
                );
              })}
              <div style={{ height: "8px" }} />
            </div>
          </li>

          {/* Pricing */}
          <MobileNavItem href="/pricing" active={pathname === "/pricing"} onClick={() => setMenuOpen(false)}>
            Pricing
          </MobileNavItem>

          {/* Blog */}
          <MobileNavItem href="/blog" active={pathname?.startsWith("/blog") ?? false} onClick={() => setMenuOpen(false)}>
            Blog
          </MobileNavItem>

        </ul>

        <div style={{ padding: "16px 0 20px" }}>
          <a
            href={URLS.LMS_LOGIN}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display:        "block",
              textAlign:      "center",
              background:     "linear-gradient(135deg, #FF8534, #FF6A00)",
              color:          "white",
              border:         "none",
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

/* ─── Desktop NavLink ─────────────────────────────────────────────────── */
function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        color:          active ? "#FF8534" : "rgba(255,255,255,0.85)",
        textDecoration: "none",
        fontSize:       "15px",
        fontWeight:     active ? 700 : 500,
        transition:     "color 0.2s",
        whiteSpace:     "nowrap",
        fontFamily:     "Nunito, sans-serif",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.color = "#FF8534"; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = active ? "#FF8534" : "rgba(255,255,255,0.85)"; }}
    >
      {children}
    </Link>
  );
}

/* ─── Mobile NavItem ──────────────────────────────────────────────────── */
function MobileNavItem({ href, active, onClick, children }: { href: string; active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <li style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <Link
        href={href}
        onClick={onClick}
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
        {children}
      </Link>
    </li>
  );
}

/* ─── Chevron icon ────────────────────────────────────────────────────── */
function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }}
    >
      <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Hamburger bar helper ────────────────────────────────────────────── */
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

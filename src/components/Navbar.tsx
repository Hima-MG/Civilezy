"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { EXTERNAL_URLS } from "@/lib/constants";
import { useAnnouncementBar } from "@/contexts/AnnouncementContext";
import { useSupportModal } from "@/contexts/SupportContext";

const COURSE_ITEMS = [
  { label: "ITI Course",      href: "/courses/iti"      },
  { label: "Diploma Course",  href: "/courses/diploma"  },
  { label: "B.Tech Course",   href: "/courses/btech"    },
  { label: "Surveyor Course", href: "/courses/surveyor" },
] as const;

// Links rendered as plain anchors in desktop nav (no dropdown)
const PLAIN_LINKS = [
  { label: "Home",       href: "/"           },
  { label: "Game Arena", href: "/game-arena" },
  { label: "Pricing",    href: "/pricing"    },
  { label: "Blog",       href: "/blog"       },
] as const;

export default function Navbar() {
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [mobileCoursesOpen, setMobileCoursesOpen] = useState(false);
  const [scrolled,    setScrolled]    = useState(false);

  const { barHeight } = useAnnouncementBar();
  const { openModal } = useSupportModal();
  const pathname = usePathname();
  const router   = useRouter();

  const dropdownRef = useRef<HTMLLIElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!coursesOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCoursesOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [coursesOpen]);

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 900) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Close everything on route change
  useEffect(() => {
    setMenuOpen(false);
    setCoursesOpen(false);
    setMobileCoursesOpen(false);
  }, [pathname]);

  const isCoursesActive = pathname?.startsWith("/courses") ?? false;

  function navLinkStyle(active: boolean): React.CSSProperties {
    return {
      color:          active ? "#FF8534" : "rgba(255,255,255,0.85)",
      textDecoration: "none",
      fontSize:       "15px",
      fontWeight:     active ? 700 : 500,
      fontFamily:     "Nunito, sans-serif",
      transition:     "color 0.2s",
      whiteSpace:     "nowrap",
      paddingBottom:  "3px",
      borderBottom:   active ? "2px solid #FF8534" : "2px solid transparent",
    };
  }

  return (
    <>
      <nav
        style={{
          position:             "fixed",
          top:                  barHeight,
          left:                 0,
          right:                0,
          zIndex:               1000,
          height:               "70px",
          display:              "flex",
          alignItems:           "center",
          justifyContent:       "space-between",
          padding:              "0 5%",
          background:           scrolled ? "rgba(11,30,61,0.98)" : "rgba(11,30,61,0.95)",
          backdropFilter:       "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom:         "1px solid rgba(255,98,0,0.2)",
          transition:           "background 0.3s",
          boxSizing:            "border-box",
        }}
      >
        {/* ── Logo ── */}
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

        {/* ── Desktop nav ── */}
        <ul style={{ display: "flex", alignItems: "center", gap: "2rem", margin: 0, padding: 0 }} className="nav-desktop">

          {/* Home */}
          <li style={{ listStyle: "none" }}>
            <Link
              href="/"
              style={navLinkStyle(pathname === "/")}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#FF8534"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = pathname === "/" ? "#FF8534" : "rgba(255,255,255,0.85)"; }}
            >
              Home
            </Link>
          </li>

          {/* Game Arena */}
          <li style={{ listStyle: "none" }}>
            <Link
              href="/game-arena"
              style={navLinkStyle(pathname?.startsWith("/game-arena") ?? false)}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#FF8534"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = (pathname?.startsWith("/game-arena") ?? false) ? "#FF8534" : "rgba(255,255,255,0.85)"; }}
            >
              Game Arena
            </Link>
          </li>

          {/* Courses dropdown */}
          <li ref={dropdownRef} style={{ listStyle: "none", position: "relative" }}>
            <button
              onClick={() => setCoursesOpen((v) => !v)}
              aria-expanded={coursesOpen}
              aria-haspopup="true"
              style={{
                background:    "none",
                border:        "none",
                cursor:        "pointer",
                display:       "flex",
                alignItems:    "center",
                gap:           "5px",
                padding:       "3px 0",
                color:         isCoursesActive ? "#FF8534" : "rgba(255,255,255,0.85)",
                fontSize:      "15px",
                fontWeight:    isCoursesActive ? 700 : 500,
                fontFamily:    "Nunito, sans-serif",
                whiteSpace:    "nowrap",
                borderBottom:  isCoursesActive ? "2px solid #FF8534" : "2px solid transparent",
                transition:    "color 0.2s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#FF8534"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = isCoursesActive ? "#FF8534" : "rgba(255,255,255,0.85)"; }}
            >
              Courses
              <svg
                aria-hidden="true"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transition: "transform 0.2s", transform: coursesOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Dropdown panel */}
            <div
              role="menu"
              style={{
                position:             "absolute",
                top:                  "calc(100% + 14px)",
                left:                 "50%",
                transform:            coursesOpen ? "translateX(-50%) translateY(0) scale(1)" : "translateX(-50%) translateY(-8px) scale(0.96)",
                opacity:              coursesOpen ? 1 : 0,
                pointerEvents:        coursesOpen ? "all" : "none",
                transition:           "opacity 0.2s ease, transform 0.22s cubic-bezier(0.16,1,0.3,1)",
                background:           "rgba(10,20,45,0.98)",
                backdropFilter:       "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border:               "1px solid rgba(255,255,255,0.1)",
                borderRadius:         "16px",
                padding:              "8px",
                minWidth:             "200px",
                boxShadow:            "0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,98,0,0.08)",
              }}
            >
              {COURSE_ITEMS.map((item) => {
                const active = pathname === item.href;
                return (
                  <button
                    key={item.href}
                    role="menuitem"
                    onClick={() => {
                      setCoursesOpen(false);
                      router.push(item.href);
                    }}
                    style={{
                      display:       "flex",
                      alignItems:    "center",
                      gap:           "9px",
                      width:         "100%",
                      padding:       "10px 14px",
                      borderRadius:  "10px",
                      background:    active ? "rgba(255,98,0,0.12)" : "transparent",
                      border:        active ? "1px solid rgba(255,98,0,0.2)" : "1px solid transparent",
                      color:         active ? "#FF8534" : "rgba(255,255,255,0.8)",
                      fontSize:      "14px",
                      fontWeight:    active ? 700 : 500,
                      fontFamily:    "Nunito, sans-serif",
                      cursor:        "pointer",
                      textAlign:     "left",
                      transition:    "background 0.15s, color 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                        e.currentTarget.style.color = "#ffffff";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                      }
                    }}
                  >
                    <span aria-hidden="true" style={{ width: "6px", height: "6px", borderRadius: "50%", background: active ? "#FF8534" : "rgba(255,255,255,0.25)", flexShrink: 0, transition: "background 0.15s" }} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </li>

          {/* Pricing */}
          <li style={{ listStyle: "none" }}>
            <Link
              href="/pricing"
              style={navLinkStyle(pathname?.startsWith("/pricing") ?? false)}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#FF8534"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = (pathname?.startsWith("/pricing") ?? false) ? "#FF8534" : "rgba(255,255,255,0.85)"; }}
            >
              Pricing
            </Link>
          </li>

          {/* Blog */}
          <li style={{ listStyle: "none" }}>
            <Link
              href="/blog"
              style={navLinkStyle(pathname?.startsWith("/blog") ?? false)}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#FF8534"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = (pathname?.startsWith("/blog") ?? false) ? "#FF8534" : "rgba(255,255,255,0.85)"; }}
            >
              Blog
            </Link>
          </li>

          {/* E-Books */}
          <li style={{ listStyle: "none" }}>
            <Link
              href="/ebooks"
              style={{
                ...navLinkStyle(pathname?.startsWith("/ebooks") ?? false),
                ...(!(pathname?.startsWith("/ebooks") ?? false) && {
                  color: "#F59E0B",
                  borderBottom: "2px solid transparent",
                }),
                ...(pathname?.startsWith("/ebooks") && {
                  color: "#F59E0B",
                  borderBottom: "2px solid #F59E0B",
                }),
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#F59E0B"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = (pathname?.startsWith("/ebooks") ?? false) ? "#F59E0B" : "#F59E0B"; }}
            >
              E-Books ✨
            </Link>
          </li>

          {/* Renewal */}
          <li style={{ listStyle: "none" }}>
            <Link
              href="/renew"
              style={navLinkStyle(pathname?.startsWith("/renew") ?? false)}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#FF8534"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = (pathname?.startsWith("/renew") ?? false) ? "#FF8534" : "rgba(255,255,255,0.85)"; }}
            >
              Renewal
            </Link>
          </li>
        </ul>

        {/* ── Login + Hamburger ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Report Technical Issue — desktop only */}
          <button
            onClick={openModal}
            className="nav-support-btn"
            aria-label="Report Technical Issue"
            style={{
              background:     "rgba(255,255,255,0.06)",
              border:         "1px solid rgba(255,255,255,0.12)",
              borderRadius:   "50px",
              color:          "rgba(255,255,255,0.75)",
              fontSize:       "13px",
              fontWeight:     600,
              padding:        "8px 16px",
              cursor:         "pointer",
              whiteSpace:     "nowrap",
              display:        "flex",
              alignItems:     "center",
              gap:            "6px",
              fontFamily:     "Nunito, sans-serif",
              transition:     "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,133,52,0.12)";
              e.currentTarget.style.borderColor = "rgba(255,133,52,0.35)";
              e.currentTarget.style.color = "#FF8534";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
              e.currentTarget.style.color = "rgba(255,255,255,0.75)";
            }}
          >
            🛠️ Report Issue
          </button>

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
            aria-label={menuOpen ? "Close menu" : "Open menu"}
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

      {/* ── Mobile menu ── */}
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
          maxHeight:     menuOpen ? "620px" : "0",
          opacity:       menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transition:    "max-height 0.35s ease, opacity 0.3s ease",
        }}
      >
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {/* Home */}
          <li style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              style={{ display: "block", color: pathname === "/" ? "#FF8534" : "rgba(255,255,255,0.85)", textDecoration: "none", fontSize: "16px", fontWeight: pathname === "/" ? 700 : 500, padding: "14px 0", fontFamily: "Nunito, sans-serif" }}
            >
              Home
            </Link>
          </li>

          {/* Game Arena */}
          <li style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <Link
              href="/game-arena"
              onClick={() => setMenuOpen(false)}
              style={{ display: "block", color: (pathname?.startsWith("/game-arena") ?? false) ? "#FF8534" : "rgba(255,255,255,0.85)", textDecoration: "none", fontSize: "16px", fontWeight: (pathname?.startsWith("/game-arena") ?? false) ? 700 : 500, padding: "14px 0", fontFamily: "Nunito, sans-serif" }}
            >
              Game Arena
            </Link>
          </li>

          {/* Courses accordion */}
          <li style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <button
              onClick={() => setMobileCoursesOpen((v) => !v)}
              style={{
                display:     "flex",
                alignItems:  "center",
                justifyContent: "space-between",
                width:       "100%",
                background:  "none",
                border:      "none",
                cursor:      "pointer",
                color:       isCoursesActive ? "#FF8534" : "rgba(255,255,255,0.85)",
                fontSize:    "16px",
                fontWeight:  isCoursesActive ? 700 : 500,
                padding:     "14px 0",
                fontFamily:  "Nunito, sans-serif",
                textAlign:   "left",
              }}
            >
              Courses
              <svg
                aria-hidden="true"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transition: "transform 0.2s", transform: mobileCoursesOpen ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Mobile sub-items */}
            <div style={{
              overflow:   "hidden",
              maxHeight:  mobileCoursesOpen ? "220px" : "0",
              transition: "max-height 0.3s ease",
              paddingLeft: "12px",
            }}>
              {COURSE_ITEMS.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display:    "flex",
                      alignItems: "center",
                      gap:        "8px",
                      color:      active ? "#FF8534" : "rgba(255,255,255,0.7)",
                      textDecoration: "none",
                      fontSize:   "15px",
                      fontWeight: active ? 700 : 400,
                      padding:    "10px 0",
                      fontFamily: "Nunito, sans-serif",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                    }}
                  >
                    <span aria-hidden="true" style={{ width: "5px", height: "5px", borderRadius: "50%", background: active ? "#FF8534" : "rgba(255,255,255,0.25)", flexShrink: 0 }} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </li>

          {/* Pricing */}
          <li style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <Link
              href="/pricing"
              onClick={() => setMenuOpen(false)}
              style={{ display: "block", color: (pathname?.startsWith("/pricing") ?? false) ? "#FF8534" : "rgba(255,255,255,0.85)", textDecoration: "none", fontSize: "16px", fontWeight: (pathname?.startsWith("/pricing") ?? false) ? 700 : 500, padding: "14px 0", fontFamily: "Nunito, sans-serif" }}
            >
              Pricing
            </Link>
          </li>

          {/* Blog */}
          <li style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <Link
              href="/blog"
              onClick={() => setMenuOpen(false)}
              style={{ display: "block", color: (pathname?.startsWith("/blog") ?? false) ? "#FF8534" : "rgba(255,255,255,0.85)", textDecoration: "none", fontSize: "16px", fontWeight: (pathname?.startsWith("/blog") ?? false) ? 700 : 500, padding: "14px 0", fontFamily: "Nunito, sans-serif" }}
            >
              Blog
            </Link>
          </li>

          {/* E-Books */}
          <li style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <Link
              href="/ebooks"
              onClick={() => setMenuOpen(false)}
              style={{ display: "block", color: "#F59E0B", textDecoration: "none", fontSize: "16px", fontWeight: (pathname?.startsWith("/ebooks") ?? false) ? 700 : 500, padding: "14px 0", fontFamily: "Nunito, sans-serif" }}
            >
              E-Books ✨
            </Link>
          </li>

          {/* Renewal */}
          <li style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <Link
              href="/renew"
              onClick={() => setMenuOpen(false)}
              style={{ display: "block", color: (pathname?.startsWith("/renew") ?? false) ? "#FF8534" : "rgba(255,255,255,0.85)", textDecoration: "none", fontSize: "16px", fontWeight: (pathname?.startsWith("/renew") ?? false) ? 700 : 500, padding: "14px 0", fontFamily: "Nunito, sans-serif" }}
            >
              Renewal
            </Link>
          </li>

          {/* Report Technical Issue */}
          <li style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <button
              onClick={() => { setMenuOpen(false); openModal(); }}
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                background: "none", border: "none", cursor: "pointer",
                color: "rgba(255,133,52,0.9)", fontSize: "16px", fontWeight: 600,
                padding: "14px 0", width: "100%", textAlign: "left",
                fontFamily: "Nunito, sans-serif",
              }}
            >
              🛠️ Report Technical Issue
            </button>
          </li>
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
        .nav-desktop      { display: flex; }
        .nav-login        { display: block; }
        .nav-support-btn  { display: flex; }
        .hamburger-btn    { display: none; }
        .mobile-menu      { display: none; }

        @media (max-width: 900px) {
          .nav-desktop      { display: none !important; }
          .nav-login        { display: none !important; }
          .nav-support-btn  { display: none !important; }
          .hamburger-btn    { display: flex !important; }
          .mobile-menu      { display: block !important; }
        }
      `}</style>
    </>
  );
}

// Unused import guard
void (PLAIN_LINKS);

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

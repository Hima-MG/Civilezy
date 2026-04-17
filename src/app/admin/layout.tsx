"use client";

import { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ADMIN_KEY = "civilezy_admin_auth";
// Simple passphrase — only blocks accidental access; Firestore rules handle real security
const PASSPHRASE = "civilezy2026admin";

const NAV_ITEMS = [
  { href: "/admin/questions",     label: "Questions",     icon: "📚" },
  { href: "/admin/announcements", label: "Announcements", icon: "📣" },
] as const;

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem(ADMIN_KEY);
      if (stored === PASSPHRASE) setAuthed(true);
      setChecking(false);
    }
  }, []);

  const handleLogin = () => {
    if (input === PASSPHRASE) {
      sessionStorage.setItem(ADMIN_KEY, input);
      setAuthed(true);
      setError("");
    } else {
      setError("Invalid passphrase");
    }
  };

  if (checking) return null;

  if (!authed) {
    return (
      <div style={gate.wrapper}>
        <div style={gate.card}>
          <div style={{ fontSize: "28px", marginBottom: "8px" }}>🔒</div>
          <h1 style={gate.title}>Admin Access</h1>
          <p style={gate.sub}>Enter the admin passphrase to continue</p>
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleLogin(); }}
            placeholder="Passphrase"
            style={gate.input}
            autoFocus
          />
          {error && <p style={gate.error}>{error}</p>}
          <button onClick={handleLogin} style={gate.btn}>
            Unlock
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#060D1A" }}>
      {/* Hide the public Navbar, StickyCTA, and reset main padding on admin routes */}
      <style>{`
        nav[style*="position"] { display: none !important; }
        [role="region"][aria-label="Start your free Kerala PSC preparation"] { display: none !important; }
        main { padding-top: 0 !important; padding-bottom: 0 !important; }
      `}</style>
      {/* Admin header */}
      <header style={{
        background: "rgba(255,255,255,0.04)",
        borderBottom: "1px solid rgba(255,98,0,0.2)",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(12px)",
        minHeight: "56px",
        gap: "16px",
      }}>
        {/* Brand + nav */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px", flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
            <span style={{ fontSize: "18px" }}>⚙️</span>
            <span style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "17px", color: "#FF8534" }}>
              CivilEzy Admin
            </span>
          </div>
          {/* Section nav */}
          <nav style={{ display: "flex", gap: "4px" }}>
            {NAV_ITEMS.map(({ href, label, icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    fontSize: "13px",
                    fontWeight: 600,
                    padding: "5px 12px",
                    borderRadius: "8px",
                    textDecoration: "none",
                    color: active ? "#FF8534" : "rgba(255,255,255,0.55)",
                    background: active ? "rgba(255,98,0,0.15)" : "transparent",
                    border: `1px solid ${active ? "rgba(255,98,0,0.3)" : "transparent"}`,
                    transition: "all 0.2s",
                    fontFamily: "Nunito, sans-serif",
                  }}
                >
                  <span>{icon}</span>
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <button
          onClick={() => { sessionStorage.removeItem(ADMIN_KEY); setAuthed(false); }}
          style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "6px 14px", cursor: "pointer", flexShrink: 0 }}
        >
          Logout
        </button>
      </header>
      {children}
    </div>
  );
}

const gate = {
  wrapper: { minHeight: "100vh", background: "#060D1A", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" } as React.CSSProperties,
  card: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "40px 32px", maxWidth: "380px", width: "100%", textAlign: "center" } as React.CSSProperties,
  title: { fontFamily: "Rajdhani, sans-serif", fontSize: "24px", fontWeight: 700, color: "#fff", margin: "0 0 6px" } as React.CSSProperties,
  sub: { fontSize: "14px", color: "rgba(255,255,255,0.5)", margin: "0 0 24px" } as React.CSSProperties,
  input: { width: "100%", boxSizing: "border-box", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "12px", padding: "12px 16px", color: "#fff", fontSize: "14px", outline: "none", marginBottom: "12px" } as React.CSSProperties,
  error: { fontSize: "13px", color: "#f87171", margin: "0 0 12px" } as React.CSSProperties,
  btn: { width: "100%", background: "linear-gradient(135deg,#FF6200,#FF8534)", color: "#fff", border: "none", borderRadius: "12px", padding: "12px", fontSize: "15px", fontWeight: 700, cursor: "pointer" } as React.CSSProperties,
};

"use client";

import { useState, useEffect, type ReactNode } from "react";

const ADMIN_KEY = "civilezy_admin_auth";
// Simple passphrase — only blocks accidental access; Firestore rules handle real security
const PASSPHRASE = "civilezy2026admin";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);

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
        padding: "12px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(12px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "20px" }}>⚙️</span>
          <span style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "18px", color: "#FF8534" }}>
            CivilEzy Admin
          </span>
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", background: "rgba(255,98,0,0.15)", padding: "2px 10px", borderRadius: "20px", fontWeight: 600 }}>
            Question Manager
          </span>
        </div>
        <button
          onClick={() => { sessionStorage.removeItem(ADMIN_KEY); setAuthed(false); }}
          style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "6px 14px", cursor: "pointer" }}
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

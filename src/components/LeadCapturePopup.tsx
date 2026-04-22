"use client";

import { useState, useEffect, useCallback } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const DISMISS_KEY = "civilezy_lead_dismissed";
const DISMISS_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

export default function LeadCapturePopup() {
  const [open,      setOpen]      = useState(false);
  const [name,      setName]      = useState("");
  const [phone,     setPhone]     = useState("");
  const [course,    setCourse]    = useState("iti");
  const [status,    setStatus]    = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg,  setErrorMsg]  = useState("");

  useEffect(() => {
    try {
      const ts = localStorage.getItem(DISMISS_KEY);
      if (ts && Date.now() - parseInt(ts, 10) < DISMISS_TTL) return;
    } catch { /* private browsing */ }

    const timer = setTimeout(() => setOpen(true), 18000); // show after 18s
    return () => clearTimeout(timer);
  }, []);

  const dismiss = useCallback(() => {
    try { localStorage.setItem(DISMISS_KEY, Date.now().toString()); } catch { /* */ }
    setOpen(false);
  }, []);

  const submit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || phone.trim().length < 10) {
      setErrorMsg("Please enter a valid name and 10-digit phone number.");
      return;
    }
    setErrorMsg("");
    setStatus("submitting");
    try {
      await addDoc(collection(db, "syllabus_leads"), {
        name:      name.trim(),
        phone:     phone.trim(),
        course,
        source:    "syllabus_popup",
        page:      typeof window !== "undefined" ? window.location.pathname : "",
        createdAt: serverTimestamp(),
      });
      setStatus("success");
      try { localStorage.setItem(DISMISS_KEY, Date.now().toString()); } catch { /* */ }
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  }, [name, phone, course]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={dismiss}
        style={{
          position: "fixed", inset: 0, zIndex: 1200,
          background: "rgba(0,0,0,0.72)", backdropFilter: "blur(4px)",
        }}
        aria-hidden
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Download PSC Civil Syllabus PDF"
        style={{
          position:      "fixed",
          top:           "50%",
          left:          "50%",
          transform:     "translate(-50%, -50%)",
          zIndex:        1201,
          width:         "min(480px, 92vw)",
          background:    "linear-gradient(160deg, #0B1E3D 0%, #060D1A 100%)",
          border:        "1px solid rgba(255,98,0,0.3)",
          borderRadius:  "20px",
          padding:       "36px 32px",
          boxShadow:     "0 32px 80px rgba(0,0,0,0.7)",
        }}
      >
        {/* Close */}
        <button
          onClick={dismiss}
          aria-label="Close"
          style={{
            position: "absolute", top: "14px", right: "16px",
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "50%", color: "rgba(255,255,255,0.7)", cursor: "pointer",
            width: "28px", height: "28px", fontSize: "16px", lineHeight: 1,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          ×
        </button>

        {status === "success" ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🎉</div>
            <h2 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1.6rem", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>
              You&apos;re all set!
            </h2>
            <p style={{ color: "rgba(255,255,255,0.62)", fontSize: "14px", lineHeight: 1.7, marginBottom: "20px" }}>
              Our team will WhatsApp the syllabus PDF to <strong style={{ color: "#fff" }}>{phone}</strong> within 24 hours.
            </p>
            <button
              onClick={dismiss}
              style={{ background: "linear-gradient(135deg, #FF6200, #FF8534)", color: "#fff", border: "none", borderRadius: "10px", padding: "12px 32px", fontWeight: 700, fontSize: "15px", cursor: "pointer", fontFamily: "Nunito, sans-serif" }}
            >
              Start Practising Free →
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "56px", height: "56px", background: "rgba(255,98,0,0.12)", border: "1px solid rgba(255,98,0,0.25)", borderRadius: "14px", fontSize: "1.8rem", marginBottom: "14px" }}>
                📄
              </div>
              <h2 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1.5rem", fontWeight: 700, color: "#fff", marginBottom: "6px", lineHeight: 1.2 }}>
                Download PSC Civil Syllabus PDF
              </h2>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.65, margin: 0 }}>
                Get the complete, exam-mapped syllabus for your category — free on WhatsApp.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={submit} noValidate>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "16px" }}>
                {/* Name */}
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.55)", marginBottom: "6px", letterSpacing: "0.3px" }}>
                    YOUR NAME
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Arun Kumar"
                    required
                    style={{
                      width: "100%", boxSizing: "border-box",
                      background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: "10px", padding: "12px 14px", color: "#fff", fontSize: "14px",
                      fontFamily: "Nunito, sans-serif", outline: "none",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(255,98,0,0.5)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)")}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.55)", marginBottom: "6px", letterSpacing: "0.3px" }}>
                    WHATSAPP NUMBER
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="10-digit mobile number"
                    required
                    style={{
                      width: "100%", boxSizing: "border-box",
                      background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: "10px", padding: "12px 14px", color: "#fff", fontSize: "14px",
                      fontFamily: "Nunito, sans-serif", outline: "none",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(255,98,0,0.5)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)")}
                  />
                </div>

                {/* Course */}
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.55)", marginBottom: "6px", letterSpacing: "0.3px" }}>
                    YOUR LEVEL
                  </label>
                  <select
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    style={{
                      width: "100%", boxSizing: "border-box",
                      background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: "10px", padding: "12px 14px", color: "#fff", fontSize: "14px",
                      fontFamily: "Nunito, sans-serif", outline: "none", cursor: "pointer",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(255,98,0,0.5)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)")}
                  >
                    <option value="iti" style={{ background: "#0B1E3D" }}>ITI Civil</option>
                    <option value="diploma" style={{ background: "#0B1E3D" }}>Diploma Civil</option>
                    <option value="btech" style={{ background: "#0B1E3D" }}>B.Tech / AE</option>
                    <option value="surveyor" style={{ background: "#0B1E3D" }}>Surveyor</option>
                  </select>
                </div>
              </div>

              {errorMsg && (
                <p style={{ fontSize: "12px", color: "#FF6B6B", marginBottom: "12px", margin: "0 0 12px" }}>
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                style={{
                  width:          "100%",
                  background:     status === "submitting" ? "rgba(255,98,0,0.5)" : "linear-gradient(135deg, #FF6200, #FF8534)",
                  color:          "#fff",
                  border:         "none",
                  borderRadius:   "10px",
                  padding:        "13px 0",
                  fontWeight:     700,
                  fontSize:       "15px",
                  cursor:         status === "submitting" ? "not-allowed" : "pointer",
                  fontFamily:     "Nunito, sans-serif",
                  transition:     "opacity 0.2s",
                  letterSpacing:  "0.2px",
                }}
              >
                {status === "submitting" ? "Sending..." : "📲 Send to WhatsApp — Free"}
              </button>

              <p style={{ textAlign: "center", fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "12px", margin: "12px 0 0" }}>
                No spam. No calls. Syllabus PDF only.
              </p>
            </form>
          </>
        )}
      </div>
    </>
  );
}

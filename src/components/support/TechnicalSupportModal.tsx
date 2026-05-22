"use client";

import { useState, useEffect, useRef } from "react";
import { useSupportModal } from "@/contexts/SupportContext";
import { useAuth } from "@/contexts/AuthContext";
import { CATEGORIES, COURSE_OPTIONS, type TicketCategory } from "@/lib/tickets";
import { storage } from "@/lib/firebase";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormState {
  studentName: string;
  studentEmail: string;
  whatsappNumber: string;
  courseName: string;
  category: TicketCategory | "";
  description: string;
}

const EMPTY: FormState = {
  studentName: "",
  studentEmail: "",
  whatsappNumber: "",
  courseName: "",
  category: "",
  description: "",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function TechnicalSupportModal() {
  const { isOpen, closeModal } = useSupportModal();
  const { user, profile } = useAuth();

  const [form, setForm] = useState<FormState>({ ...EMPTY });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<string | null>(null); // ticketId on success
  const [uploadProgress, setUploadProgress] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Pre-fill if user is logged in
  useEffect(() => {
    if (user && profile) {
      setForm((f) => ({
        ...f,
        studentName: profile.displayName ?? f.studentName,
        studentEmail: user.email ?? f.studentEmail,
      }));
    }
  }, [user, profile]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setForm(
          user && profile
            ? { ...EMPTY, studentName: profile.displayName ?? "", studentEmail: user.email ?? "" }
            : { ...EMPTY }
        );
        setErrors({});
        setScreenshot(null);
        setScreenshotPreview(null);
        setSubmitted(null);
        setSubmitting(false);
      }, 300);
    }
  }, [isOpen, user, profile]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Screenshot must be under 5 MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }
    setScreenshot(file);
    setScreenshotPreview(URL.createObjectURL(file));
  }

  function validate(): boolean {
    const e: Partial<FormState> = {};
    if (!form.studentName.trim()) e.studentName = "Name is required";
    if (!form.studentEmail.trim()) {
      e.studentEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.studentEmail)) {
      e.studentEmail = "Enter a valid email address";
    }
    if (!form.whatsappNumber.trim()) {
      e.whatsappNumber = "WhatsApp number is required";
    } else if (!/^[6-9]\d{9}$/.test(form.whatsappNumber.replace(/\s/g, ""))) {
      e.whatsappNumber = "Enter a valid 10-digit Indian mobile number";
    }
    if (!form.courseName) e.courseName = "Select your course";
    if (!form.category) e.category = "Select an issue category" as never;
    if (!form.description.trim()) {
      e.description = "Description is required";
    } else if (form.description.trim().length < 20) {
      e.description = "Please describe the issue in at least 20 characters";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate() || submitting) return;

    setSubmitting(true);
    try {
      // 1. Upload screenshot to Firebase Storage (client-side, non-fatal)
      let screenshotUrl: string | null = null;
      if (screenshot) {
        try {
          setUploadProgress(true);
          const path = `support_screenshots/${Date.now()}_${screenshot.name}`;
          const sRef = storageRef(storage, path);
          await uploadBytes(sRef, screenshot);
          screenshotUrl = await getDownloadURL(sRef);
        } catch (uploadErr) {
          console.warn("Screenshot upload failed, continuing without it:", uploadErr);
        } finally {
          setUploadProgress(false);
        }
      }

      // 2. Create ticket via server-side API (uses Admin SDK — bypasses Firestore rules)
      const res = await fetch("/api/tickets/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: form.studentName.trim(),
          studentEmail: form.studentEmail.trim().toLowerCase(),
          whatsappNumber: form.whatsappNumber.trim().replace(/\s/g, ""),
          courseName: form.courseName,
          category: form.category as TicketCategory,
          description: form.description.trim(),
          screenshotUrl,
          studentUid: user?.uid ?? null,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? `HTTP ${res.status}`);
      }

      const { id, ticketId } = await res.json() as { id: string; ticketId: string };

      // 3. Fire-and-forget email notifications
      fetch("/api/send-ticket-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "new_ticket",
          ticket: {
            ticketId,
            id,
            studentName: form.studentName.trim(),
            studentEmail: form.studentEmail.trim().toLowerCase(),
            category: form.category,
            courseName: form.courseName,
            description: form.description.trim(),
          },
        }),
      }).catch(() => {});

      setSubmitted(ticketId);
    } catch (err) {
      console.error("[submit ticket]", err);
      alert("Failed to submit ticket. Please try again.");
    } finally {
      setSubmitting(false);
      setUploadProgress(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          background: "rgba(8,20,48,0.98)",
          border: "1px solid rgba(255,98,0,0.25)",
          borderRadius: "24px",
          width: "100%",
          maxWidth: "560px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,98,0,0.12)",
          position: "relative",
          margin: "auto",
        }}
      >
        {/* Header */}
        <div style={{
          padding: "24px 28px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "sticky", top: 0,
          background: "rgba(8,20,48,0.98)",
          backdropFilter: "blur(12px)",
          zIndex: 10,
          borderRadius: "24px 24px 0 0",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "12px",
              background: "linear-gradient(135deg,#FF6200,#FF8534)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "20px", flexShrink: 0,
            }}>🛠️</div>
            <div>
              <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "18px", color: "#fff" }}>
                Report Technical Issue
              </div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", marginTop: "2px" }}>
                Our team will respond shortly
              </div>
            </div>
          </div>
          <button
            onClick={closeModal}
            style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "10px", color: "rgba(255,255,255,0.6)", cursor: "pointer",
              width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "18px", flexShrink: 0, transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
            aria-label="Close"
          >×</button>
        </div>

        {submitted ? (
          /* ── Success Screen ── */
          <div style={{ padding: "40px 28px", textAlign: "center" }}>
            <div style={{
              width: "72px", height: "72px", borderRadius: "50%",
              background: "rgba(52,211,153,0.15)", border: "2px solid rgba(52,211,153,0.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "32px", margin: "0 auto 20px",
            }}>✅</div>
            <h2 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "22px", fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>
              Issue Submitted Successfully
            </h2>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)", margin: "0 0 24px", lineHeight: "1.6" }}>
              Your ticket has been created. Our technical team will review it shortly.
            </p>
            <div style={{
              background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.25)",
              borderRadius: "16px", padding: "20px", marginBottom: "28px",
            }}>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "6px" }}>
                Ticket ID
              </div>
              <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "28px", fontWeight: 700, color: "#60a5fa", letterSpacing: "1px" }}>
                {submitted}
              </div>
            </div>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: "1.6", marginBottom: "24px" }}>
              A confirmation email has been sent to your inbox. Keep this ticket ID for future reference.
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href={`/support`}
                style={{
                  padding: "10px 22px", borderRadius: "50px",
                  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "14px", fontWeight: 600,
                }}
              >
                My Tickets
              </a>
              <button
                onClick={closeModal}
                style={{
                  padding: "10px 22px", borderRadius: "50px",
                  background: "linear-gradient(135deg,#FF6200,#FF8534)",
                  border: "none", color: "#fff", fontSize: "14px", fontWeight: 700, cursor: "pointer",
                }}
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* ── Form ── */
          <form onSubmit={handleSubmit} noValidate style={{ padding: "24px 28px 28px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              {/* Name */}
              <Field label="Student Name" error={errors.studentName} style={{ gridColumn: "1" }}>
                <Input
                  type="text"
                  placeholder="Your full name"
                  value={form.studentName}
                  onChange={set("studentName")}
                  hasError={!!errors.studentName}
                />
              </Field>

              {/* Email */}
              <Field label="Email Address" error={errors.studentEmail} style={{ gridColumn: "2" }}>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={form.studentEmail}
                  onChange={set("studentEmail")}
                  hasError={!!errors.studentEmail}
                />
              </Field>

              {/* WhatsApp */}
              <Field label="WhatsApp Number" error={errors.whatsappNumber} style={{ gridColumn: "1" }}>
                <Input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={form.whatsappNumber}
                  onChange={set("whatsappNumber")}
                  hasError={!!errors.whatsappNumber}
                  maxLength={10}
                />
              </Field>

              {/* Course */}
              <Field label="Course Name" error={errors.courseName} style={{ gridColumn: "2" }}>
                <Select
                  value={form.courseName}
                  onChange={set("courseName")}
                  hasError={!!errors.courseName}
                >
                  <option value="">Select course</option>
                  {COURSE_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                </Select>
              </Field>

              {/* Category */}
              <Field label="Issue Category" error={errors.category as string} style={{ gridColumn: "1 / -1" }}>
                <Select
                  value={form.category}
                  onChange={set("category")}
                  hasError={!!errors.category}
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </Select>
              </Field>

              {/* Description */}
              <Field label="Issue Description" error={errors.description} style={{ gridColumn: "1 / -1" }}>
                <textarea
                  rows={4}
                  placeholder="Describe the issue in detail — what happened, when, any error messages..."
                  value={form.description}
                  onChange={set("description")}
                  style={{
                    width: "100%", boxSizing: "border-box",
                    background: "rgba(0,0,0,0.3)", border: `1px solid ${errors.description ? "rgba(248,113,113,0.6)" : "rgba(255,255,255,0.12)"}`,
                    borderRadius: "12px", padding: "12px 14px",
                    color: "#fff", fontSize: "14px", outline: "none",
                    fontFamily: "Nunito, sans-serif", lineHeight: "1.6", resize: "vertical",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = errors.description ? "rgba(248,113,113,0.8)" : "rgba(255,133,52,0.6)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = errors.description ? "rgba(248,113,113,0.6)" : "rgba(255,255,255,0.12)"; }}
                />
              </Field>

              {/* Screenshot upload */}
              <div style={{ gridColumn: "1 / -1" }}>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: "8px", fontFamily: "Nunito, sans-serif" }}>
                  Screenshot <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional, max 5 MB)</span>
                </div>
                {screenshotPreview ? (
                  <div style={{ position: "relative", display: "inline-block" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={screenshotPreview}
                      alt="Screenshot preview"
                      style={{ maxWidth: "100%", maxHeight: "160px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.12)", objectFit: "contain" }}
                    />
                    <button
                      type="button"
                      onClick={() => { setScreenshot(null); setScreenshotPreview(null); if (fileRef.current) fileRef.current.value = ""; }}
                      style={{
                        position: "absolute", top: "6px", right: "6px",
                        background: "rgba(0,0,0,0.7)", border: "none", borderRadius: "50%",
                        color: "#fff", width: "24px", height: "24px", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px",
                      }}
                    >×</button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    style={{
                      width: "100%", padding: "18px",
                      background: "rgba(255,255,255,0.03)", border: "2px dashed rgba(255,255,255,0.1)",
                      borderRadius: "12px", color: "rgba(255,255,255,0.45)", cursor: "pointer",
                      fontSize: "13px", fontFamily: "Nunito, sans-serif", transition: "all 0.2s",
                      display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,133,52,0.4)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.45)"; }}
                  >
                    <span style={{ fontSize: "24px" }}>📎</span>
                    <span>Click to upload screenshot</span>
                    <span style={{ fontSize: "11px", opacity: 0.7 }}>PNG, JPG, WEBP up to 5 MB</span>
                  </button>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFile}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              style={{
                width: "100%", marginTop: "20px",
                background: submitting ? "rgba(255,98,0,0.4)" : "linear-gradient(135deg,#FF6200,#FF8534)",
                border: "none", borderRadius: "14px", color: "#fff",
                fontSize: "15px", fontWeight: 700, padding: "14px",
                cursor: submitting ? "not-allowed" : "pointer",
                fontFamily: "Nunito, sans-serif",
                boxShadow: submitting ? "none" : "0 6px 20px rgba(255,98,0,0.4)",
                transition: "all 0.25s",
              }}
            >
              {uploadProgress ? "Uploading screenshot…" : submitting ? "Submitting…" : "Submit Ticket"}
            </button>
          </form>
        )}
      </div>

      <style>{`
        @media (max-width: 540px) {
          .support-grid { grid-template-columns: 1fr !important; }
          .support-grid > div { grid-column: 1 !important; }
        }
      `}</style>
    </div>
  );
}

// ─── Small helpers ────────────────────────────────────────────────────────────

function Field({
  label, error, children, style,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div style={style}>
      <label style={{
        display: "block", fontSize: "12px", color: "rgba(255,255,255,0.5)",
        textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: "8px",
        fontFamily: "Nunito, sans-serif",
      }}>
        {label}
      </label>
      {children}
      {error && (
        <div style={{ fontSize: "11px", color: "#f87171", marginTop: "5px" }}>{error}</div>
      )}
    </div>
  );
}

function Input({
  hasError, ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }) {
  return (
    <input
      {...props}
      style={{
        width: "100%", boxSizing: "border-box",
        background: "rgba(0,0,0,0.3)",
        border: `1px solid ${hasError ? "rgba(248,113,113,0.6)" : "rgba(255,255,255,0.12)"}`,
        borderRadius: "12px", padding: "11px 14px",
        color: "#fff", fontSize: "14px", outline: "none",
        fontFamily: "Nunito, sans-serif",
        transition: "border-color 0.2s",
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = hasError ? "rgba(248,113,113,0.8)" : "rgba(255,133,52,0.6)";
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = hasError ? "rgba(248,113,113,0.6)" : "rgba(255,255,255,0.12)";
        props.onBlur?.(e);
      }}
    />
  );
}

function Select({
  hasError, children, ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { hasError?: boolean }) {
  return (
    <select
      {...props}
      style={{
        width: "100%", boxSizing: "border-box",
        background: "rgba(0,0,0,0.5)",
        border: `1px solid ${hasError ? "rgba(248,113,113,0.6)" : "rgba(255,255,255,0.12)"}`,
        borderRadius: "12px", padding: "11px 14px",
        color: "#fff", fontSize: "14px", outline: "none",
        fontFamily: "Nunito, sans-serif",
        cursor: "pointer", transition: "border-color 0.2s",
        appearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='rgba(255,255,255,0.4)' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center",
        paddingRight: "36px",
      }}
      onFocus={(e) => { e.currentTarget.style.borderColor = hasError ? "rgba(248,113,113,0.8)" : "rgba(255,133,52,0.6)"; }}
      onBlur={(e) => { e.currentTarget.style.borderColor = hasError ? "rgba(248,113,113,0.6)" : "rgba(255,255,255,0.12)"; }}
    >
      {children}
    </select>
  );
}

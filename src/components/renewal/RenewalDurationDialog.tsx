"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  buildPaymentPageUrl,
  type NewRenewalPlan,
  type RenewalDurationOption,
} from "@/lib/renewal";

// Accessible duration-selection dialog. Renders as a centred modal on ≥sm
// screens and a bottom sheet on mobile (see .renewal-dialog-* in globals.css).
// "Continue" navigates to the /renew/payment checkout assistant with only
// courseId + duration in the URL — that page opens the Razorpay link
// already configured for the selected option.

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function RenewalDurationDialog({
  plan,
  onClose,
}: {
  plan: NewRenewalPlan | null;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<RenewalDurationOption | null>(null);

  // Reset the selection whenever a different plan opens the dialog.
  useEffect(() => {
    setSelected(null);
  }, [plan]);

  // Scroll lock + ESC + focus trap while open; restore focus on close.
  useEffect(() => {
    if (!plan) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    panelRef.current
      ?.querySelector<HTMLElement>("[data-autofocus]")
      ?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && (active === first || !panelRef.current.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [plan, onClose]);

  if (!plan) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Overlay */}
      <div
        className="renewal-dialog-overlay absolute inset-0"
        style={{ background: "rgba(4, 10, 24, 0.72)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Positioning layer: bottom sheet on mobile, centred on ≥sm */}
      <div className="pointer-events-none absolute inset-0 flex items-end sm:items-center sm:justify-center sm:p-6">
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="renewal-dialog-title"
          className="renewal-dialog-panel pointer-events-auto max-h-[88vh] w-full overflow-y-auto rounded-t-3xl sm:max-w-md sm:rounded-3xl"
          style={{
            background: "var(--navy2)",
            border: "1px solid rgba(255,133,52,0.25)",
            boxShadow: "0 -12px 48px rgba(0,0,0,0.45)",
            padding: "20px 22px 26px",
          }}
        >
          {/* Drag handle (visual only, mobile) */}
          <div
            aria-hidden="true"
            className="mx-auto mb-4 h-1 w-10 rounded-full sm:hidden"
            style={{ background: "rgba(255,255,255,0.18)" }}
          />

          {/* Header */}
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2
                id="renewal-dialog-title"
                style={{
                  color: "#fff",
                  fontFamily: "var(--font-rajdhani), Rajdhani, sans-serif",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  lineHeight: 1.25,
                }}
              >
                Choose Renewal Duration
              </h2>
              <p style={{ color: "#FF8534", fontSize: "0.82rem", fontWeight: 600, marginTop: "4px" }}>
                {plan.name}
              </p>
            </div>
            <button
              type="button"
              data-autofocus
              onClick={onClose}
              aria-label="Close dialog"
              className="shrink-0"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.7)",
                fontSize: "1rem",
                lineHeight: 1,
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>

          {/* Duration options */}
          <div role="radiogroup" aria-label="Renewal duration" className="flex flex-col gap-2.5">
            {plan.durationOptions.map((option) => {
              const isSelected = selected?.duration === option.duration;
              return (
                <label
                  key={option.duration}
                  className="flex cursor-pointer items-center justify-between gap-3"
                  style={{
                    padding: "13px 16px",
                    borderRadius: "12px",
                    border: isSelected
                      ? "1px solid rgba(255,133,52,0.65)"
                      : "1px solid rgba(255,255,255,0.10)",
                    background: isSelected
                      ? "rgba(255,133,52,0.10)"
                      : "rgba(255,255,255,0.03)",
                    transition: "border-color 0.15s, background 0.15s",
                  }}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="renewal-duration"
                      value={option.duration}
                      checked={isSelected}
                      onChange={() => setSelected(option)}
                      className="sr-only"
                    />
                    {/* Custom radio indicator */}
                    <span
                      aria-hidden="true"
                      style={{
                        width: "18px",
                        height: "18px",
                        borderRadius: "50%",
                        border: isSelected
                          ? "5px solid #FF6200"
                          : "2px solid rgba(255,255,255,0.3)",
                        background: isSelected ? "#fff" : "transparent",
                        transition: "border 0.15s",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        color: isSelected ? "#fff" : "rgba(255,255,255,0.8)",
                        fontSize: "0.92rem",
                        fontWeight: isSelected ? 700 : 500,
                      }}
                    >
                      {option.duration}
                    </span>
                  </span>
                  {option.amount && (
                    <span style={{ color: "#FF8534", fontSize: "0.9rem", fontWeight: 700 }}>
                      {option.amount}
                    </span>
                  )}
                </label>
              );
            })}
          </div>

          {/* Selection summary + proceed */}
          <div aria-live="polite" className="mt-5">
            {selected && (
              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: "12px",
                  background: "rgba(255,133,52,0.07)",
                  border: "1px solid rgba(255,133,52,0.22)",
                  marginBottom: "14px",
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8rem" }}>
                    Selected duration
                  </span>
                  <span style={{ color: "#fff", fontSize: "0.9rem", fontWeight: 700 }}>
                    {selected.duration}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8rem" }}>
                    Price
                  </span>
                  <span style={{ color: "#FF8534", fontSize: "0.9rem", fontWeight: 700 }}>
                    {selected.amount ?? "Shown on the secure payment page"}
                  </span>
                </div>
              </div>
            )}

            {selected ? (
              <Link
                href={buildPaymentPageUrl(plan, selected)}
                onClick={onClose}
                className="renewal-focus block w-full text-center"
                style={{
                  padding: "14px 20px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #FF8534, #FF6200)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  textDecoration: "none",
                  fontFamily: "var(--font-rajdhani), Rajdhani, sans-serif",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  boxShadow: "0 6px 20px rgba(255,98,0,0.35)",
                }}
              >
                Continue →
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="block w-full"
                style={{
                  padding: "14px 20px",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.35)",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  border: "1px solid rgba(255,255,255,0.10)",
                  fontFamily: "var(--font-rajdhani), Rajdhani, sans-serif",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  cursor: "not-allowed",
                }}
              >
                Select a duration to continue
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

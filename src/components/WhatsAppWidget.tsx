"use client";

import { useState, useEffect, useRef } from "react";
import { WHATSAPP_NUMBER, WHATSAPP_DISPLAY } from "@/lib/constants";

const WA_NUMBER = WHATSAPP_NUMBER;

const CHAT_OPTIONS = [
  {
    id: "course",
    label: "Course Details",
    desc: "Know what's inside the course",
    emoji: "📚",
    message: "Hi! I'd like to know more about Civilezy courses for Kerala PSC Civil Engineering preparation.",
  },
  {
    id: "pricing",
    label: "Pricing Help",
    desc: "Get the best plan for you",
    emoji: "💰",
    message: "Hi! I need help choosing the right pricing plan for Civilezy Kerala PSC preparation.",
  },
  // {
  //   id: "syllabus",
  //   label: "Download Syllabus",
  //   desc: "Get the full course syllabus",
  //   emoji: "📄",
  //   message: "Hi! I'd like to receive the Civilezy course syllabus for Kerala PSC Civil Engineering.",
  // },
  {
    id: "advisor",
    label: "Talk to Advisor",
    desc: "Chat with our expert team",
    emoji: "🎓",
    message: "Hi! I'd like to speak with a Civilezy advisor about Kerala PSC Civil Engineering preparation.",
  },
];

const WA_ICON = (
  <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="white">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const CLOSE_ICON = (
  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const CHEVRON_ICON = (
  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

function waUrl(message: string) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

// Stable hover handlers
const onOptionEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.background = "rgba(37,211,102,0.1)";
  e.currentTarget.style.borderColor = "rgba(37,211,102,0.35)";
  e.currentTarget.style.transform = "translateX(-3px)";
};
const onOptionLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
  e.currentTarget.style.transform = "translateX(0)";
};

export default function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  if (!mounted) return null;

  return (
    <>
      {/* pointer-events: none on root so the layout box doesn't block page clicks.
          Children that need interaction set pointer-events: auto explicitly. */}
      <div
        ref={containerRef}
        className="wa-widget-root"
        style={{
          position: "fixed",
          bottom: "28px",
          right: "28px",
          zIndex: 950,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "12px",
          pointerEvents: "none",
        }}
      >
        {/* ── Popup menu ── */}
        <div
          role="dialog"
          aria-label="WhatsApp chat options"
          aria-hidden={!open}
          style={{
            opacity: open ? 1 : 0,
            transform: open ? "translateY(0) scale(1)" : "translateY(12px) scale(0.94)",
            pointerEvents: open ? "auto" : "none",
            transition: "opacity 0.25s ease, transform 0.28s cubic-bezier(0.16,1,0.3,1)",
            background: "rgba(7,12,26,0.97)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "20px",
            padding: "16px",
            width: "290px",
            boxShadow: "0 24px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(37,211,102,0.08)",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px", paddingBottom: "13px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 14px rgba(37,211,102,0.4)" }}>
              {WA_ICON}
            </div>
            <div>
              <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "15px", color: "#ffffff", letterSpacing: "0.2px" }}>
                CivilEzy Support
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "2px" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#25D366", display: "inline-block", animation: "waPulse 2s infinite" }} />
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)" }}>Typically replies in minutes</span>
              </div>
            </div>
          </div>

          {/* Greeting bubble */}
          <div style={{ background: "rgba(37,211,102,0.08)", border: "1px solid rgba(37,211,102,0.15)", borderRadius: "12px 12px 12px 4px", padding: "10px 12px", marginBottom: "12px" }}>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", margin: 0, lineHeight: 1.5 }}>
              👋 Hi! How can we help you today?
            </p>
          </div>

          {/* Chat options */}
          <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
            {CHAT_OPTIONS.map((opt) => (
              <a
                key={opt.id}
                href={waUrl(opt.message)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`WhatsApp: ${opt.label}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "11px",
                  padding: "10px 12px",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  textDecoration: "none",
                  transition: "background 0.18s, border-color 0.18s, transform 0.18s",
                  cursor: "pointer",
                }}
                onMouseEnter={onOptionEnter}
                onMouseLeave={onOptionLeave}
              >
                <span style={{ fontSize: "18px", flexShrink: 0, lineHeight: 1 }}>{opt.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "13px", color: "#ffffff", lineHeight: 1.2 }}>
                    {opt.label}
                  </div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: "2px", lineHeight: 1.3 }}>
                    {opt.desc}
                  </div>
                </div>
                {CHEVRON_ICON}
              </a>
            ))}
          </div>

          {/* Footer */}
          <p style={{ marginTop: "13px", fontSize: "11px", color: "rgba(255,255,255,0.2)", textAlign: "center", lineHeight: 1.4 }}>
            Opens WhatsApp · {WHATSAPP_DISPLAY}
          </p>
        </div>

        {/* ── FAB button ── */}
        <button
          onClick={() => setOpen((p) => !p)}
          aria-label={open ? "Close WhatsApp chat menu" : "Chat with CivilEzy on WhatsApp"}
          aria-expanded={open}
          style={{
            width: "58px",
            height: "58px",
            borderRadius: "50%",
            background: open ? "#075E54" : "#25D366",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: open
              ? "0 6px 25px rgba(7,94,84,0.55)"
              : "0 6px 28px rgba(37,211,102,0.55)",
            transition: "background 0.2s, transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s",
            transform: open ? "rotate(0deg) scale(1.06)" : "rotate(0deg) scale(1)",
            position: "relative",
            pointerEvents: "auto",
            touchAction: "manipulation",
          }}
        >
          {/* Ping ring — only when closed */}
          {!open && (
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: "-4px",
                borderRadius: "50%",
                border: "2px solid rgba(37,211,102,0.45)",
                animation: "waPing 2.4s ease-out infinite",
              }}
            />
          )}
          <span style={{ transition: "opacity 0.15s, transform 0.2s", display: "flex" }}>
            {open ? CLOSE_ICON : WA_ICON}
          </span>
        </button>
      </div>

      <style>{`
        @keyframes waPing {
          0%   { transform: scale(1);    opacity: 0.7; }
          70%  { transform: scale(1.35); opacity: 0; }
          100% { transform: scale(1.35); opacity: 0; }
        }
        @keyframes waPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.4; transform: scale(0.8); }
        }
        @media (max-width: 640px) {
          /* Shift up on mobile so it doesn't overlap footer */
          .wa-widget-root { bottom: 20px !important; right: 20px !important; }
        }
      `}</style>
    </>
  );
}

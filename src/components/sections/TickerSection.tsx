"use client";
// Note: "use client" is required because of the inline <style> tag.
// Next.js Server Components do not support <style>{`...`}</style>.
// The component itself is still stateless and renders zero interactive JS.

// ─── Data ───────────────────────────────────────────────────────────────────
// ⚠️  "KWA AE 2025 Released!" is a live announcement — update or remove
//     once the notification window closes to keep the ticker accurate.
const TICKER_ITEMS = [
  "🏆 Arun S. — Rank 3 KWA AE 2024",
  "⭐ Meera K. — Rank 7 PWD Overseer",
  "🎯 Sreejith R. — Rank 12 Diploma Civil",
  "🔥 Anjali M. — 95% Mock Score",
  "📣 New PSC Notification — KWA AE 2025 Released!",
] as const;

export default function TickerSection() {
  return (
    <>
      {/*
        Outer div is the visible ticker strip.
        role="marquee" tells assistive tech this is a scrolling region.
        aria-label gives it a meaningful name for screen reader landmarks.
        aria-atomic="false" prevents the whole thing re-announcing on each tick.
      */}
      <div
        role="marquee"
        aria-label="Kerala PSC live updates and rank holder announcements"
        aria-atomic="false"
        style={{
          background: "linear-gradient(90deg, #FF6200, #CC4E00)",
          padding:    "10px 0",
          overflow:   "hidden",
        }}
      >
        {/*
          The visually scrolling track.
          It contains TICKER_ITEMS twice for a seamless loop.
          The second copy is aria-hidden — screen readers don't need duplicates.
        */}
        <div
          className="ticker-track"
          style={{
            display:   "flex",
            gap:       "60px",
            whiteSpace:"nowrap",
            animation: "tickerScroll 20s linear infinite",
          }}
        >
          {/* First set — readable by screen readers */}
          {TICKER_ITEMS.map(item => (
            <span
              key={item}
              style={{ display:"inline-flex", alignItems:"center", gap:"8px", fontSize:"13px", fontWeight:700, color:"white", flexShrink:0 }}
            >
              {item}
            </span>
          ))}

          {/* Duplicate set — purely for seamless visual loop, hidden from AT */}
          {TICKER_ITEMS.map(item => (
            <span
              key={`dup-${item}`}
              aria-hidden="true"
              style={{ display:"inline-flex", alignItems:"center", gap:"8px", fontSize:"13px", fontWeight:700, color:"white", flexShrink:0 }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes tickerScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* WCAG 2.2.2 — pause animation for users who prefer reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .ticker-track {
            animation: none !important;
            /* Show items without scrolling; overflow-x allows horizontal scroll if needed */
            overflow-x: auto;
          }
        }
      `}</style>
    </>
  );
}
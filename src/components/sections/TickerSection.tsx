"use client";

const TICKER_ITEMS = [
  "🏆 Arun S. — Rank 3 KWA AE 2024",
  "⭐ Meera K. — Rank 7 PWD Overseer",
  "🎯 Sreejith R. — Rank 12 Diploma Civil",
  "🔥 Anjali M. — 95% Mock Score",
  "📣 New PSC Notification — KWA AE 2025 Released!",
] as const;

// Duplicate for seamless loop
const ALL_ITEMS = [...TICKER_ITEMS, ...TICKER_ITEMS];

export default function TickerSection() {
  return (
    <>
      <div
        style={{
          background: "linear-gradient(90deg, #FF6200, #CC4E00)",
          padding:    "10px 0",
          overflow:   "hidden",
        }}
      >
        <div
          style={{
            display:   "flex",
            gap:       "60px",
            whiteSpace:"nowrap",
            animation: "tickerScroll 20s linear infinite",
          }}
        >
          {ALL_ITEMS.map((item, i) => (
            <span
              key={i}
              style={{
                display:    "inline-flex",
                alignItems: "center",
                gap:        "8px",
                fontSize:   "13px",
                fontWeight: 700,
                color:      "white",
                flexShrink: 0,
              }}
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
      `}</style>
    </>
  );
}
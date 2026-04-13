"use client";

type TickerItem = {
  line1: string;
  // line2: string;
};

const TICKER_ITEMS: TickerItem[] = [
  {
    line1: "🏆 Gajeesh K G — Rank 1 | Tradesman (Survey), Technical Education Department",
    // line2: "📚 ITI Surveyor Premium Course — CivilEzy",
  },
  {
    line1: "🏆 Adarsh S Das — Rank 1 | Tracer / Gr-3 Overseer, Public Works / Irrigation Department",
    // line2: "📚 B.Tech Bundle Course | PSC B.Tech Level Course | KWA Course — CivilEzy",
  },
  {
    line1: "🏆 Nivya T — Rank 1 | Tracer, Soil Survey & Soil Conservation Dept. (Malappuram)",
    // line2: "📚 Booster Live Plus Grade 1 Batch | Last Bus Overseer Batch — CivilEzy",
  },
  {
    line1: "🏆 Malavika M S — Rank 1 | Draftsman Grade II, Harbour Engineering Department",
    // line2: "📚 Electra — Online Bundle B.Tech — CivilEzy",
  },
  {
    line1: "🏆 Jilna P — Rank 1 | Work Superintendent, Soil Survey & Soil Conservation Dept. (Kannur)",
    // line2: "📚 ITI 63 Days Challenge Course — CivilEzy",
  },
  {
    line1: "🏆 Shilja Sureshkumar — Rank 1 | Work Superintendent, Soil Survey & Soil Conservation Dept. (Thrissur)",
    // line2: "📚 B.Tech Civil Premium | Booster Live – AE — CivilEzy",
  },
  {
    line1: "📣 New PSC Notification — I Grade Overseer / I Grade Draftsman (Civil) Released!",
    // line2: "🎯 Enroll now at CivilEzy and start your preparation today!",
  },
];

export default function TickerSection() {
  return (
    <>
      <div
        role="marquee"
        aria-label="Kerala PSC live updates and rank holder announcements"
        aria-atomic="false"
        style={{
          background: "linear-gradient(90deg, #FF6200, #CC4E00)",
          padding: "8px 0",
          overflow: "hidden",
        }}
      >
        <div
          className="ticker-track"
          style={{
            display: "flex",
            gap: "80px",
            whiteSpace: "nowrap",
            animation: "tickerScroll 30s linear infinite",
          }}
        >
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span
              key={i}
              aria-hidden={i >= TICKER_ITEMS.length ? "true" : undefined}
              style={{
                display: "inline-flex",
                flexDirection: "column",
                gap: "2px",
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: "13px", fontWeight: 700, color: "white" }}>
                {item.line1}
              </span>
              <span style={{ fontSize: "11px", fontWeight: 500, color: "#FFD9BC" }}>
                {/* {item.line2} */}
              </span>
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes tickerScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ticker-track {
            animation: none !important;
            overflow-x: auto;
          }
        }
      `}</style>
    </>
  );
}
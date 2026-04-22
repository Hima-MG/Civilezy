import Link from "next/link";

const EXPLORE_ITEMS = [
  {
    href:    "/game-arena",
    emoji:   "🎮",
    title:   "Game Arena",
    desc:    "Practise real Kerala PSC civil questions in timed rounds. Live leaderboard, instant feedback — free forever.",
    cta:     "Start Practising →",
    color:   "#FF8534",
    bg:      "rgba(255,133,52,0.08)",
    border:  "rgba(255,133,52,0.2)",
  },
  {
    href:    "/courses",
    emoji:   "📚",
    title:   "Courses",
    desc:    "Structured preparation for ITI, Diploma, B.Tech/AE and Surveyor — Malayalam audio, live classes, mock tests.",
    cta:     "Explore Courses →",
    color:   "#4C9BF0",
    bg:      "rgba(76,155,240,0.08)",
    border:  "rgba(76,155,240,0.2)",
  },
  {
    href:    "/pricing",
    emoji:   "💡",
    title:   "Pricing",
    desc:    "Flexible monthly and annual plans. Starting ₹1,800/month with a 48-hour free demo — no credit card needed.",
    cta:     "View Plans →",
    color:   "#32C864",
    bg:      "rgba(50,200,100,0.08)",
    border:  "rgba(50,200,100,0.2)",
  },
  {
    href:    "/blog",
    emoji:   "📝",
    title:   "Blog & Guides",
    desc:    "Exam alerts, preparation strategies, syllabus breakdowns, and paper analyses — written by Wincentre experts.",
    cta:     "Read Articles →",
    color:   "#A855F7",
    bg:      "rgba(168,85,247,0.08)",
    border:  "rgba(168,85,247,0.2)",
  },
] as const;

export default function ExploreCivilezy() {
  return (
    <section
      aria-labelledby="explore-heading"
      style={{ background: "#060D1A", padding: "80px 0" }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 5%" }}>

        {/* Heading */}
        <div style={{ textAlign: "center", maxWidth: "640px", margin: "0 auto 48px" }}>
          <div style={{ display: "inline-block", background: "rgba(255,98,0,0.12)", border: "1px solid rgba(255,98,0,0.25)", borderRadius: "100px", padding: "4px 16px", fontSize: "12px", fontWeight: 700, color: "#FF8534", letterSpacing: "0.5px", marginBottom: "16px" }}>
            EVERYTHING IN ONE PLACE
          </div>
          <h2
            id="explore-heading"
            style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 700, lineHeight: 1.2, marginBottom: "12px", color: "#ffffff" }}
          >
            Explore{" "}
            <span style={{ background: "linear-gradient(135deg, #FF6200, #FFB800)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Civilezy
            </span>
          </h2>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.58)", lineHeight: 1.7, margin: 0 }}>
            From free practice to full-course preparation — everything Kerala PSC Civil Engineering aspirants need.
          </p>
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }} className="explore-cards-grid">
          {EXPLORE_ITEMS.map((item) => (
            <div
              key={item.href}
              style={{ background: item.bg, border: `1px solid ${item.border}`, borderRadius: "18px", padding: "28px 22px", display: "flex", flexDirection: "column" }}
              className="explore-card"
            >
              {/* Icon */}
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: `1px solid ${item.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", marginBottom: "16px" }}>
                {item.emoji}
              </div>

              {/* Title */}
              <h3 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1.25rem", fontWeight: 700, color: "#ffffff", marginBottom: "10px" }}>
                {item.title}
              </h3>

              {/* Desc */}
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.58)", lineHeight: 1.72, marginBottom: "24px", flex: 1 }}>
                {item.desc}
              </p>

              {/* CTA */}
              <Link
                href={item.href}
                style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 700, color: item.color, textDecoration: "none", fontFamily: "Nunito, sans-serif" }}
              >
                {item.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .explore-card { transition: border-color 0.2s, transform 0.2s; }
        .explore-card:hover { transform: translateY(-4px); }
        @media (max-width: 900px) {
          .explore-cards-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .explore-cards-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

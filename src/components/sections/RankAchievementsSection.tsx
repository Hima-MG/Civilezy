"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { EXTERNAL_URLS } from "@/lib/constants";

// ─── Types ────────────────────────────────────────────────────────────────────
interface RankHolder {
  name: string;
  rank: number;
  exam: string;
  categoryNumber: string;
  image: string;
  /** initials shown when image is absent */
  initials: string;
  accentColor: string;
  bgColor: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const FEATURED: RankHolder = {
  name: "Abhijith O A",
  rank: 4,
  exam: "Tradesman (Civil)",
  categoryNumber: "Cat No. 276/2025",
  image: "/rank-holders/abhijith.jpeg",
  initials: "AA",
  accentColor: "#FF6200",
  bgColor: "rgba(255,98,0,0.25)",
};

const DOMAIN = "KWA Overseer Grade III";

const RANK_HOLDERS: RankHolder[] = [
  {
    name: "Roopa Krishnan",
    rank: 2,
    exam: DOMAIN,
    categoryNumber: "Cat No. 276/2025",
    image: "/rank-holders/ROOPA KRISHNAN.jpeg",
    initials: "RK",
    accentColor: "#FFB800",
    bgColor: "rgba(255,184,0,0.22)",
  },
  {
    name: "Gopika A V",
    rank: 8,
    exam: DOMAIN,
    categoryNumber: "Cat No. 276/2025",
    image: "/rank-holders/GOPIKA A V.jpeg",
    initials: "GA",
    accentColor: "#64C8FF",
    bgColor: "rgba(100,200,255,0.18)",
  },
  {
    name: "Chithra A P",
    rank: 12,
    exam: DOMAIN,
    categoryNumber: "Cat No. 276/2025",
    image: "/rank-holders/CHITHRA A P.jpeg",
    initials: "CA",
    accentColor: "#32C864",
    bgColor: "rgba(50,200,100,0.18)",
  },
  {
    name: "Sajeena Mol S",
    rank: 13,
    exam: DOMAIN,
    categoryNumber: "Cat No. 276/2025",
    image: "/rank-holders/SAJEENA MOL S.jpeg",
    initials: "SM",
    accentColor: "#C864FF",
    bgColor: "rgba(200,100,255,0.2)",
  },
  {
    name: "Shajitha A U",
    rank: 16,
    exam: DOMAIN,
    categoryNumber: "Cat No. 276/2025",
    image: "/rank-holders/SHAJITHA A U.jpeg",
    initials: "SA",
    accentColor: "#FF8534",
    bgColor: "rgba(255,98,0,0.22)",
  },
  {
    name: "Arun M A",
    rank: 17,
    exam: DOMAIN,
    categoryNumber: "Cat No. 276/2025",
    image: "/rank-holders/ARUN M A.jpeg",
    initials: "AM",
    accentColor: "#FFB800",
    bgColor: "rgba(255,184,0,0.22)",
  },
];

// ─── Photo with fallback ───────────────────────────────────────────────────────
function StudentPhoto({
  holder,
  fill = false,
  size,
}: {
  holder: RankHolder;
  fill?: boolean;
  size?: number;
}) {
  const [errored, setErrored] = useState(false);

  if (!errored) {
    return fill ? (
      <Image
        src={holder.image}
        alt={`${holder.name} — Rank ${holder.rank}`}
        fill
        sizes="(max-width: 640px) 160px, 200px"
        className="rank-photo"
        style={{ objectFit: "cover", objectPosition: "center top" }}
        onError={() => setErrored(true)}
      />
    ) : (
      <Image
        src={holder.image}
        alt={`${holder.name} — Rank ${holder.rank}`}
        width={size ?? 110}
        height={size ?? 110}
        style={{
          borderRadius: "50%",
          objectFit: "cover",
          objectPosition: "center top",
          border: `3px solid ${holder.accentColor}99`,
          boxShadow: `0 0 0 6px ${holder.accentColor}1A, 0 8px 32px rgba(0,0,0,0.4)`,
        }}
        onError={() => setErrored(true)}
      />
    );
  }

  // ── Fallback avatar ──
  if (fill) {
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: holder.bgColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: "36px",
            fontWeight: 800,
            color: "#fff",
            fontFamily: "Rajdhani, sans-serif",
            opacity: 0.85,
          }}
        >
          {holder.initials}
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        width: size ?? 110,
        height: size ?? 110,
        borderRadius: "50%",
        background: `radial-gradient(135deg,${holder.bgColor},rgba(0,0,0,0.2))`,
        border: `3px solid ${holder.accentColor}99`,
        boxShadow: `0 0 0 6px ${holder.accentColor}1A, 0 8px 32px rgba(0,0,0,0.4)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "32px",
        fontWeight: 800,
        color: "#fff",
        fontFamily: "Rajdhani, sans-serif",
        flexShrink: 0,
      }}
    >
      {holder.initials}
    </div>
  );
}

// ─── Featured Card ────────────────────────────────────────────────────────────
function FeaturedCard() {
  return (
    <div
      style={{
        position: "relative",
        borderRadius: "24px",
        overflow: "hidden",
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,98,0,0.35)",
        backdropFilter: "blur(16px)",
        boxShadow: "0 24px 64px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 30% 60%,rgba(255,98,0,0.18) 0%,transparent 65%)," +
            "radial-gradient(ellipse at 80% 20%,rgba(255,184,0,0.10) 0%,transparent 50%)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* Top badges */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 20px 0",
        }}
      >
        <div
          style={{
            background: "rgba(255,98,0,0.18)",
            border: "1px solid rgba(255,98,0,0.4)",
            borderRadius: "30px",
            padding: "5px 14px",
            fontSize: "11px",
            fontWeight: 700,
            color: "#FF8534",
            letterSpacing: "0.4px",
            fontFamily: "Nunito, sans-serif",
          }}
        >
          🏆 Featured Achievement
        </div>
        <div
          style={{
            background: "linear-gradient(135deg,#FF6200,#FFB800)",
            borderRadius: "50%",
            width: "48px",
            height: "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            boxShadow: "0 4px 20px rgba(255,98,0,0.55)",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: "9px", fontWeight: 700, color: "rgba(255,255,255,0.85)", lineHeight: 1, fontFamily: "Nunito, sans-serif" }}>RANK</span>
          <span style={{ fontSize: "20px", fontWeight: 900, color: "#fff", lineHeight: 1.1, fontFamily: "Rajdhani, sans-serif" }}>{FEATURED.rank}</span>
        </div>
      </div>

      {/* Photo — ~70% of card */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "3/4",
          zIndex: 1,
          marginTop: "16px",
          overflow: "hidden",
        }}
      >
        <StudentPhoto holder={FEATURED} fill />

        {/* Gradient fade at bottom */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "55%",
            background: "linear-gradient(to top,rgba(11,30,61,0.98) 0%,rgba(11,30,61,0.6) 55%,transparent 100%)",
            zIndex: 2,
          }}
        />

        {/* Name + rank overlay on photo */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "16px 18px",
            zIndex: 3,
          }}
        >
          <div
            style={{
              fontFamily: "Rajdhani, sans-serif",
              fontSize: "22px",
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.15,
              marginBottom: "4px",
            }}
          >
            {FEATURED.name}
          </div>
          <div
            style={{
              background: "linear-gradient(135deg,#FF6200,#FFB800)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontFamily: "Rajdhani, sans-serif",
              fontSize: "16px",
              fontWeight: 700,
            }}
          >
            Rank {FEATURED.rank}
          </div>
        </div>
      </div>

      {/* Exam details below photo */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "14px 18px 0",
        }}
      >
        <div
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "rgba(255,255,255,0.7)",
            fontFamily: "Nunito, sans-serif",
            marginBottom: "3px",
          }}
        >
          {FEATURED.exam}
        </div>
        <div
          style={{
            fontSize: "11px",
            color: "rgba(255,255,255,0.35)",
            fontFamily: "Nunito, sans-serif",
            letterSpacing: "0.3px",
          }}
        >
          {FEATURED.categoryNumber}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          borderTop: "1px solid rgba(255,255,255,0.07)",
          padding: "12px 18px",
          marginTop: "14px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span style={{ fontSize: "14px" }}>🎯</span>
        <span style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.4)", fontFamily: "Nunito, sans-serif" }}>
          Prepared with CivilEzy &amp; Wincentre
        </span>
      </div>
    </div>
  );
}

// ─── Achievement Card ─────────────────────────────────────────────────────────
function AchievementCard({ holder }: { holder: RankHolder }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="achievement-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        borderRadius: "16px",
        overflow: "hidden",
        background: "rgba(255,255,255,0.04)",
        border: hovered ? `1px solid ${holder.accentColor}55` : "1px solid rgba(255,255,255,0.09)",
        boxShadow: hovered ? `0 16px 40px rgba(0,0,0,0.4), 0 0 0 1px ${holder.accentColor}22` : "none",
        display: "flex",
        flexDirection: "column",
        minWidth: "155px",
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
        transition: "transform 0.25s, border-color 0.25s, box-shadow 0.25s",
        cursor: "default",
        flexShrink: 0,
      }}
    >
      {/* Photo area — 70% of card */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "3/4",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <StudentPhoto holder={holder} fill />

        {/* Bottom fade */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "50%",
            background: "linear-gradient(to top,rgba(10,27,53,0.97) 0%,rgba(10,27,53,0.5) 55%,transparent 100%)",
            zIndex: 2,
          }}
        />

        {/* Rank pill */}
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "linear-gradient(135deg,#FF6200,#FFB800)",
            borderRadius: "20px",
            padding: "3px 10px",
            fontSize: "11px",
            fontWeight: 800,
            color: "#fff",
            fontFamily: "Nunito, sans-serif",
            zIndex: 3,
            boxShadow: "0 2px 8px rgba(255,98,0,0.5)",
          }}
        >
          Rank {holder.rank}
        </div>

        {/* Name overlay */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "10px 12px",
            zIndex: 3,
          }}
        >
          <div
            style={{
              fontFamily: "Rajdhani, sans-serif",
              fontSize: "14px",
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.2,
            }}
          >
            {holder.name}
          </div>
        </div>
      </div>

      {/* Domain label */}
      <div
        style={{
          padding: "10px 12px 14px",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontSize: "10.5px",
            color: holder.accentColor,
            fontWeight: 600,
            fontFamily: "Nunito, sans-serif",
            lineHeight: 1.4,
          }}
        >
          {holder.exam}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function RankAchievementsSection() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({ left: dir === "right" ? 180 : -180, behavior: "smooth" });
  };

  return (
    <section
      aria-labelledby="rank-achievements-heading"
      style={{
        padding: "80px 5%",
        background: "linear-gradient(180deg,#0B1E3D 0%,#091729 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          background:
            "radial-gradient(ellipse at 80% 40%,rgba(255,98,0,0.08) 0%,transparent 55%)," +
            "radial-gradient(ellipse at 10% 80%,rgba(255,184,0,0.05) 0%,transparent 50%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto" }}>

        {/* ── Header ── */}
        <div style={{ textAlign: "center", marginBottom: "52px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255,98,0,0.12)",
              border: "1px solid rgba(255,98,0,0.3)",
              borderRadius: "30px",
              padding: "5px 16px",
              marginBottom: "16px",
              fontSize: "12px",
              fontWeight: 700,
              color: "#FF8534",
              letterSpacing: "0.6px",
              textTransform: "uppercase",
              fontFamily: "Nunito, sans-serif",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#FF6200",
                animation: "pulseDot 2s infinite",
                flexShrink: 0,
              }}
            />
            Recent Rank List
          </div>

          <h2
            id="rank-achievements-heading"
            style={{
              fontFamily: "Rajdhani, sans-serif",
              fontSize: "clamp(28px,4vw,44px)",
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.15,
              marginBottom: "12px",
            }}
          >
            Rank List{" "}
            <span
              style={{
                background: "linear-gradient(135deg,#FF6200,#FFB800)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Achievements
            </span>
          </h2>

          <p
            style={{
              fontSize: "15px",
              color: "rgba(255,255,255,0.52)",
              maxWidth: "480px",
              margin: "0 auto",
              lineHeight: 1.7,
              fontFamily: "Nunito, sans-serif",
            }}
          >
            CivilEzy students continue to secure top ranks across Kerala PSC notifications.
          </p>
        </div>

        {/* ── Desktop layout: featured left + cards grid right ── */}
        <div className="rank-desktop-layout">
          <div className="rank-featured-col">
            <FeaturedCard />
          </div>

          <div className="rank-cards-col">
            {/* Domain divider */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "16px",
              }}
            >
              <div style={{ height: "1px", flex: 1, background: "linear-gradient(90deg,rgba(255,98,0,0.5),transparent)" }} />
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#FF8534",
                  letterSpacing: "0.6px",
                  textTransform: "uppercase",
                  fontFamily: "Nunito, sans-serif",
                  whiteSpace: "nowrap",
                }}
              >
                {DOMAIN}
              </span>
              <div style={{ height: "1px", flex: 1, background: "linear-gradient(90deg,transparent,rgba(255,98,0,0.5))" }} />
            </div>

            <div className="rank-cards-grid">
              {RANK_HOLDERS.map((h) => (
                <AchievementCard key={h.name} holder={h} />
              ))}
            </div>
          </div>
        </div>

        {/* ── Mobile carousel ── */}
        <div className="rank-mobile-layout">
          <div style={{ marginBottom: "20px" }}>
            <FeaturedCard />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            <div style={{ height: "1px", flex: 1, background: "linear-gradient(90deg,rgba(255,98,0,0.5),transparent)" }} />
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#FF8534", letterSpacing: "0.6px", textTransform: "uppercase", fontFamily: "Nunito, sans-serif", whiteSpace: "nowrap" }}>
              {DOMAIN}
            </span>
            <div style={{ height: "1px", flex: 1, background: "linear-gradient(90deg,transparent,rgba(255,98,0,0.5))" }} />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginBottom: "10px" }}>
            {(["left", "right"] as const).map((dir) => (
              <button
                key={dir}
                onClick={() => scroll(dir)}
                aria-label={`Scroll ${dir}`}
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  background: "rgba(255,98,0,0.15)",
                  border: "1px solid rgba(255,98,0,0.35)",
                  color: "#FF8534",
                  fontSize: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                {dir === "left" ? "‹" : "›"}
              </button>
            ))}
          </div>

          <div
            ref={carouselRef}
            className="rank-carousel"
            style={{
              display: "flex",
              gap: "12px",
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              paddingBottom: "6px",
            }}
          >
            {RANK_HOLDERS.map((h) => (
              <div key={h.name} style={{ scrollSnapAlign: "start", flexShrink: 0, width: "155px" }}>
                <AchievementCard holder={h} />
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div style={{ marginTop: "60px", textAlign: "center" }}>
          <p
            style={{
              fontFamily: "Rajdhani, sans-serif",
              fontSize: "clamp(20px,2.5vw,28px)",
              fontWeight: 700,
              color: "#fff",
              marginBottom: "6px",
              lineHeight: 1.2,
            }}
          >
            Your Result Could Be Next.
          </p>
          <p
            style={{
              fontSize: "14px",
              color: "rgba(255,255,255,0.42)",
              marginBottom: "24px",
              fontFamily: "Nunito, sans-serif",
            }}
          >
            Join the rank holders who prepared smarter with CivilEzy.
          </p>
          <a
            href={EXTERNAL_URLS.demo}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "linear-gradient(135deg,#FF6200,#FF4500)",
              color: "#fff",
              padding: "15px 36px",
              borderRadius: "50px",
              fontFamily: "Nunito, sans-serif",
              fontSize: "16px",
              fontWeight: 800,
              textDecoration: "none",
              boxShadow: "0 6px 28px rgba(255,98,0,0.45)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 12px 36px rgba(255,98,0,0.55)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 6px 28px rgba(255,98,0,0.45)";
            }}
          >
            🚀 Start Demo Course
          </a>
          <p
            style={{
              marginTop: "12px",
              fontSize: "11.5px",
              color: "rgba(255,255,255,0.3)",
              fontFamily: "Nunito, sans-serif",
            }}
          >
            No registration required &nbsp;·&nbsp; Free access
          </p>
        </div>
      </div>

      <style>{`
        .rank-desktop-layout {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 28px;
          align-items: start;
        }
        .rank-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }
        .rank-mobile-layout { display: none; }

        @media (max-width: 900px) {
          .rank-desktop-layout { grid-template-columns: 220px 1fr; gap: 18px; }
          .rank-cards-grid     { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .rank-desktop-layout { display: none; }
          .rank-mobile-layout  { display: block; }
        }

        .rank-photo { transition: transform 0.4s ease; }
        .achievement-card:hover .rank-photo { transform: scale(1.04); }

        .rank-carousel { -ms-overflow-style: none; scrollbar-width: none; }
        .rank-carousel::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}

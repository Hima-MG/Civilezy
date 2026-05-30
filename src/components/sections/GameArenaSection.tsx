"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useMemo } from "react";
import { getLevel, getNextLevel } from "@/lib/leaderboard";
import { useAuth } from "@/contexts/AuthContext";
import LeaderboardTabs from "@/components/game/LeaderboardTabs";

// ─── Types ─────────────────────────────────────────────────────────────────
interface TierDef {
  icon:      string;
  name:      string;
  threshold: number;
}

// ─── Static data ───────────────────────────────────────────────────────────
const TIER_DEFS: TierDef[] = [
  { icon: "🌱", name: "Rookie",  threshold: 0      },
  { icon: "📖", name: "Scholar", threshold: 2000   },
  { icon: "⚡", name: "Expert",  threshold: 5000   },
  { icon: "🏅", name: "Master",  threshold: 10000  },
  { icon: "🔥", name: "Legend",  threshold: 50000  },
];

function getActiveTierIdx(totalScore: number): number {
  let idx = 0;
  for (let i = TIER_DEFS.length - 1; i >= 0; i--) {
    if (totalScore >= TIER_DEFS[i].threshold) { idx = i; break; }
  }
  return idx;
}

// ─── Hover handlers ────────────────────────────────────────────────────────
const onBtnEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.currentTarget.style.transform  = "translateY(-3px)";
  e.currentTarget.style.boxShadow  = "0 12px 40px rgba(255,98,0,0.6)";
};
const onBtnLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.currentTarget.style.transform  = "translateY(0)";
  e.currentTarget.style.boxShadow  = "0 6px 30px rgba(255,98,0,0.45)";
};

// ─── Component ─────────────────────────────────────────────────────────────
export default function GameArenaSection() {
  const router = useRouter();
  const { profile, user } = useAuth();

  const [mounted,     setMounted]     = useState(false);
  const [totalScore,  setTotalScore]  = useState(0);
  const [streak,      setStreak]      = useState(0);
  const [xpWidth,     setXpWidth]     = useState("0%");

  useEffect(() => {
    setMounted(true);
    if (profile) {
      setTotalScore(profile.totalScore ?? 0);
      setStreak(profile.streak ?? 0);
    }
  }, [profile]);

  const level         = useMemo(() => getLevel(totalScore),     [totalScore]);
  const nextLevel     = useMemo(() => getNextLevel(totalScore), [totalScore]);
  const activeTierIdx = useMemo(() => getActiveTierIdx(totalScore), [totalScore]);

  const xpPct = useMemo(() => {
    if (!nextLevel) return "100%";
    const base  = TIER_DEFS[activeTierIdx]?.threshold ?? 0;
    const range = nextLevel.threshold - base;
    const pct   = Math.min(((totalScore - base) / range) * 100, 100);
    return `${pct.toFixed(1)}%`;
  }, [totalScore, nextLevel, activeTierIdx]);

  useEffect(() => {
    if (!mounted) return;
    const t = setTimeout(() => setXpWidth(xpPct), 500);
    return () => clearTimeout(t);
  }, [mounted, xpPct]);

  const handleEnter = useCallback(() => router.push("/game-arena"), [router]);

  return (
    <section
      id="arena"
      aria-labelledby="arena-heading"
      style={{
        background: "linear-gradient(180deg, #080F1E 0%, #0B1E3D 100%)",
        padding: "88px 5%",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* ── Section header ── */}
        <div style={{ textAlign: "center", maxWidth: "640px", margin: "0 auto 52px" }}>
          <div
            aria-hidden="true"
            style={{
              display: "inline-block",
              background: "rgba(255,98,0,0.15)",
              border: "1px solid rgba(255,98,0,0.3)",
              borderRadius: "20px",
              padding: "4px 16px",
              fontSize: "12px",
              fontWeight: 700,
              color: "#FF8534",
              letterSpacing: "0.5px",
              marginBottom: "16px",
            }}
          >
            GAME ARENA
          </div>

          <h2
            id="arena-heading"
            style={{
              fontFamily: "Rajdhani, sans-serif",
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 700,
              lineHeight: 1.15,
              marginBottom: "14px",
              color: "#fff",
            }}
          >
            Study Like a{" "}
            <span
              style={{
                background: "linear-gradient(135deg,#FF6200,#FFB800)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Game.
            </span>{" "}
            Rank Like a Champion.
          </h2>

          <p
            style={{
              fontSize: "16px",
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.7,
              marginBottom: "28px",
            }}
          >
            Earn XP, build daily streaks, and compete on a live leaderboard —
            designed to make PSC preparation impossible to skip.
          </p>

          <button
            onClick={handleEnter}
            aria-label="Go to Game Arena"
            style={{
              background: "linear-gradient(135deg,#FF6200,#FF8534)",
              color: "white",
              border: "none",
              padding: "15px 36px",
              borderRadius: "50px",
              fontFamily: "Nunito, sans-serif",
              fontSize: "17px",
              fontWeight: 800,
              cursor: "pointer",
              boxShadow: "0 6px 30px rgba(255,98,0,0.45)",
              transition: "transform 0.2s, box-shadow 0.2s",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
            onMouseEnter={onBtnEnter}
            onMouseLeave={onBtnLeave}
          >
            🎮 Enter Game Arena
          </button>

          <p style={{ marginTop: "10px", fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>
            Free to play · Real PSC questions · No login required
          </p>
        </div>

        {/* ── Two-column grid ── */}
        <div
          id="arena-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "48px",
            alignItems: "start",
          }}
        >

          {/* ── LEFT: Journey ── */}
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "20px",
              padding: "28px",
            }}
          >
            {/* Label */}
            <p
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "0.8px",
                textTransform: "uppercase",
                marginBottom: "20px",
                fontFamily: "Nunito, sans-serif",
              }}
            >
              {mounted && profile ? `${profile.displayName}'s Journey` : "Your Journey"}
            </p>

            {/* ── Horizontal tier strip ── */}
            <div
              role="list"
              aria-label="XP tier progression"
              style={{
                display: "flex",
                gap: "6px",
                marginBottom: "24px",
              }}
            >
              {TIER_DEFS.map((t, i) => {
                const isActive  = i === activeTierIdx;
                const isReached = mounted && i <= activeTierIdx;
                const isLocked  = mounted && i > activeTierIdx;
                return (
                  <div
                    key={t.name}
                    role="listitem"
                    aria-label={`${t.name} tier${isActive ? " — your current level" : ""}`}
                    aria-current={isActive ? "true" : undefined}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "6px",
                      padding: "10px 4px",
                      borderRadius: "12px",
                      background: isActive
                        ? "rgba(255,98,0,0.14)"
                        : isReached
                        ? "rgba(255,255,255,0.04)"
                        : "transparent",
                      border: isActive
                        ? "1px solid rgba(255,98,0,0.38)"
                        : "1px solid rgba(255,255,255,0.05)",
                      opacity: isLocked ? 0.4 : 1,
                      transition: "background 0.2s",
                    }}
                  >
                    <span style={{ fontSize: "18px", lineHeight: 1 }} aria-hidden="true">
                      {t.icon}
                    </span>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        color: isActive ? "#FF8534" : isReached ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.3)",
                        fontFamily: "Nunito, sans-serif",
                        textAlign: "center",
                        lineHeight: 1.2,
                      }}
                    >
                      {t.name}
                    </span>
                    {isActive && (
                      <span
                        style={{
                          fontSize: "8px",
                          fontWeight: 800,
                          background: "#FF6200",
                          color: "#fff",
                          padding: "1px 5px",
                          borderRadius: "6px",
                          fontFamily: "Nunito, sans-serif",
                          letterSpacing: "0.3px",
                        }}
                      >
                        YOU
                      </span>
                    )}
                    {isReached && !isActive && (
                      <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)" }}>✓</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ── XP progress bar ── */}
            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#FF8534",
                    fontFamily: "Nunito, sans-serif",
                  }}
                >
                  ⚡ {mounted ? totalScore.toLocaleString() : "—"} XP
                </span>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", fontFamily: "Nunito, sans-serif" }}>
                  {mounted && nextLevel
                    ? `Next: ${level.icon} ${nextLevel.label} at ${nextLevel.threshold.toLocaleString()} XP`
                    : mounted ? "Max Level" : "—"}
                </span>
              </div>
              <div
                role="progressbar"
                aria-valuenow={mounted ? totalScore : 0}
                aria-valuemin={0}
                aria-valuemax={mounted && nextLevel ? nextLevel.threshold : totalScore}
                aria-label="XP progress bar"
                style={{
                  height: "8px",
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    background: "linear-gradient(90deg,#FF6200,#FFB800)",
                    borderRadius: "10px",
                    width: xpWidth,
                    transition: "width 1.5s ease",
                  }}
                />
              </div>
            </div>

            {/* ── Streak row ── */}
            <div
              role="region"
              aria-label={`${streak}-day study streak`}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "rgba(255,98,0,0.08)",
                border: "1px solid rgba(255,98,0,0.18)",
                borderRadius: "12px",
                padding: "12px 16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontFamily: "Nunito, sans-serif",
                }}
              >
                <span aria-hidden="true" style={{ fontSize: "18px" }}>🔥</span>
                <div>
                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: 800,
                      color: "#FF8534",
                      lineHeight: 1.1,
                    }}
                  >
                    {mounted && streak > 0 ? `${streak}-Day Streak` : "Start Your Streak"}
                  </div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>
                    {mounted && streak > 0 ? "Keep it going — practice daily" : "Play today to begin your chain"}
                  </div>
                </div>
              </div>
              <div
                style={{
                  fontFamily: "Rajdhani, sans-serif",
                  fontSize: "28px",
                  fontWeight: 700,
                  color: streak > 0 ? "#FF6200" : "rgba(255,255,255,0.2)",
                  lineHeight: 1,
                }}
                aria-hidden="true"
              >
                {mounted ? streak : "—"}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Leaderboard ── */}
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "20px",
              padding: "28px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "20px",
              }}
            >
              <span style={{ fontSize: "22px" }} aria-hidden="true">🏆</span>
              <h3
                style={{
                  fontFamily: "Rajdhani, sans-serif",
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#fff",
                  margin: 0,
                }}
              >
                CivilEzy Leaderboard
              </h3>
            </div>

            <LeaderboardTabs
              currentPlayerName={profile?.displayName ?? undefined}
              currentUserId={user?.uid ?? undefined}
            />
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 900px) {
          #arena-grid {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }
          #arena-grid > div:first-child { order: 2; }
          #arena-grid > div:last-child  { order: 1; }
        }
      ` }} />
    </section>
  );
}

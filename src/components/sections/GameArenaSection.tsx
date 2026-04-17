"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useMemo } from "react";
import { getLeaderboard, getLevel, getNextLevel, type LeaderboardEntry } from "@/lib/leaderboard";
import { fetchPeriodLeaderboard, msUntilReset, type LeaderboardPeriod, type PeriodLeaderboardEntry } from "@/lib/leaderboard";
import { useAuth } from "@/contexts/AuthContext";

// ─── Types ─────────────────────────────────────────────────────────────────
interface TierDef {
  icon:      string;
  name:      string;
  desc:      string;
  xp:        string;
  threshold: number; // min totalScore to reach this tier
}

// ─── Static data ───────────────────────────────────────────────────────────
const TIER_DEFS: TierDef[] = [
  { icon:"🌱", name:"Rookie",  desc:"0 – 1999 pts" ,       xp:"2000 pts",    threshold:0     },
  { icon:"📖", name:"Scholar", desc:"2000 – 4999 pts",       xp:"5,000 pts",  threshold:5000   },
  { icon:"⚡", name:"Expert",  desc:"5,000 – 9,999 pts",      xp:"10,000 pts",  threshold:10000  },
  { icon:"🏅", name:"Master",  desc:"10,000 – 49,999 pts",     xp:"50,000 pts", threshold:500000  },
  { icon:"🔥", name:"Legend",  desc:"∞+ pts",           xp:"∞",      threshold:10000000 },
];

const AVATAR_COLORS = [
  { bg:"rgba(255,184,0,0.2)",    c:"#FFB800" },
  { bg:"rgba(100,200,255,0.15)", c:"#64C8FF" },
  { bg:"rgba(255,98,0,0.15)",    c:"#FF8534" },
  { bg:"rgba(50,200,100,0.15)",  c:"#32C864" },
  { bg:"rgba(200,100,255,0.15)", c:"#C864FF" },
  { bg:"rgba(255,100,150,0.15)", c:"#FF6496" },
  { bg:"rgba(255,255,255,0.06)", c:"rgba(255,255,255,0.55)" },
];

const RANK_COLORS = ["#FFB800", "#C0C0C0", "#CD7F32"];
// const BADGES = ["🔥 Streak Champion","⚡ Speed King","🎯 Topic Master","🌟 30-Day Legend"] as const;

// ─── Stable hover handlers (module-level) ──────────────────────────────────
const onStatEnter  = (e: React.MouseEvent<HTMLElement>) => { (e.currentTarget as HTMLElement).style.transform="translateY(-3px)"; };
const onStatLeave  = (e: React.MouseEvent<HTMLElement>) => { (e.currentTarget as HTMLElement).style.transform="translateY(0)"; };
const onBtnEnter   = (e: React.MouseEvent<HTMLButtonElement>) => { (e.currentTarget as HTMLElement).style.transform="translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow="0 12px 40px rgba(255,98,0,0.6)"; };
const onBtnLeave   = (e: React.MouseEvent<HTMLButtonElement>) => { (e.currentTarget as HTMLElement).style.transform="translateY(0)";    (e.currentTarget as HTMLElement).style.boxShadow="0 6px 30px rgba(255,98,0,0.45)"; };
const onLbEnter    = (e: React.MouseEvent<HTMLElement>) => { (e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.03)"; };
const onLbLeave    = (e: React.MouseEvent<HTMLElement>) => { (e.currentTarget as HTMLElement).style.background=""; };

// ─── Helper: which tier index is active for a given totalScore ─────────────
function getActiveTierIdx(totalScore: number): number {
  let idx = 0;
  for (let i = TIER_DEFS.length - 1; i >= 0; i--) {
    if (totalScore >= TIER_DEFS[i].threshold) { idx = i; break; }
  }
  return idx;
}

// ─── Component ─────────────────────────────────────────────────────────────
export default function GameArenaSection() {
  const router = useRouter();
  const { profile } = useAuth();
  const [lbData, setLbData]       = useState<LeaderboardEntry[]>([]);
  const [lbLoading, setLbLoading] = useState(true);

  // Period leaderboard state
  const [lbTab, setLbTab] = useState<LeaderboardPeriod | "all">("daily");
  const [periodData, setPeriodData] = useState<PeriodLeaderboardEntry[]>([]);
  const [periodLoading, setPeriodLoading] = useState(false);
  const [countdown, setCountdown] = useState("");

  // Load all-time leaderboard on mount
  useEffect(() => {
    getLeaderboard()
      .then(setLbData)
      .catch(() => {})
      .finally(() => setLbLoading(false));
  }, []);

  // One-time fetch for period leaderboard (homepage doesn't need real-time)
  useEffect(() => {
    if (lbTab === "all") return;
    let cancelled = false;
    setPeriodLoading(true);
    fetchPeriodLeaderboard(lbTab, 20)
      .then((data) => { if (!cancelled) setPeriodData(data); })
      .catch(() =>    { if (!cancelled) setPeriodData([]); })
      .finally(() =>  { if (!cancelled) setPeriodLoading(false); });
    return () => { cancelled = true; };
  }, [lbTab]);

  // Countdown timer
  useEffect(() => {
    if (lbTab === "all") { setCountdown(""); return; }
    const tick = () => {
      const ms = msUntilReset(lbTab);
      if (ms <= 0) { setCountdown("Resetting..."); return; }
      const sec = Math.floor(ms / 1000);
      const d = Math.floor(sec / 86400), h = Math.floor((sec % 86400) / 3600), m = Math.floor((sec % 3600) / 60);
      setCountdown(d > 0 ? `${d}d ${h}h` : h > 0 ? `${h}h ${m}m` : `${m}m`);
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [lbTab]);

  // ── Derived player values (memoized) ──
  const totalScore   = profile?.totalScore ?? 0;
  const streak       = profile?.streak ?? 0;
  const activeTierIdx = useMemo(() => getActiveTierIdx(totalScore), [totalScore]);
  const level        = useMemo(() => getLevel(totalScore), [totalScore]);
  const nextLevel    = useMemo(() => getNextLevel(totalScore), [totalScore]);

  // ── Dynamic stat mini-cards ──
  const statMini = useMemo(() => [
    { icon:"🔥", value: streak > 0 ? `${streak}-Day` : "0",            label:"Current Streak", bg:"rgba(255,98,0,0.1)",    border:"rgba(255,98,0,0.25)"    },
    { icon:"🏆", value: `${level.icon} ${level.label}`,                 label:"Your Level",     bg:"rgba(255,184,0,0.1)",   border:"rgba(255,184,0,0.25)"   },
    { icon:"⭐", value: totalScore.toLocaleString(),                     label:"Total Score",    bg:"rgba(100,200,255,0.08)",border:"rgba(100,200,255,0.2)"  },
    { icon:"📈", value: nextLevel ? `${nextLevel.threshold.toLocaleString()} pts` : "Max!", label: nextLevel ? `Next: ${nextLevel.label}` : "Top Level", bg:"rgba(50,200,100,0.08)", border:"rgba(50,200,100,0.2)" },
  ], [streak, level, totalScore, nextLevel]);

  // ── Tier hover handlers (stable per-tier via useCallback) ──
  const makeTierEnter = useCallback((tierIdx: number) => (e: React.MouseEvent<HTMLElement>) => {
    const isActive = tierIdx === activeTierIdx;
    const isLocked = tierIdx > activeTierIdx + 1;
    if (isLocked) return;
    (e.currentTarget as HTMLElement).style.background  = isActive ? "rgba(255,98,0,0.18)" : "rgba(255,98,0,0.08)";
    (e.currentTarget as HTMLElement).style.borderColor = isActive ? "rgba(255,98,0,0.5)"  : "rgba(255,98,0,0.2)";
  }, [activeTierIdx]);

  const makeTierLeave = useCallback((tierIdx: number) => (e: React.MouseEvent<HTMLElement>) => {
    const isActive = tierIdx === activeTierIdx;
    const isLocked = tierIdx > activeTierIdx + 1;
    if (isLocked) return;
    (e.currentTarget as HTMLElement).style.background  = isActive ? "rgba(255,98,0,0.12)" : "rgba(255,255,255,0.04)";
    (e.currentTarget as HTMLElement).style.borderColor = isActive ? "rgba(255,98,0,0.35)" : "rgba(255,255,255,0.08)";
  }, [activeTierIdx]);

  return (
    <section
      id="arena"
      aria-labelledby="arena-heading"
      style={{ background:"linear-gradient(180deg,#080F1E 0%,#0B1E3D 100%)", padding:"80px 0" }}
    >
      <div style={{ maxWidth:"1200px", width:"100%", margin:"0 auto", padding:"0 5%" }}>

        {/* ── Section header ── */}
        <div style={{ textAlign:"center", maxWidth:"700px", margin:"0 auto 60px" }}>
          <div
            aria-hidden="true"
            style={{ display:"inline-block", background:"rgba(255,98,0,0.15)", border:"1px solid rgba(255,98,0,0.3)", borderRadius:"20px", padding:"4px 16px", fontSize:"12px", fontWeight:700, color:"#FF8534", letterSpacing:"0.5px", marginBottom:"16px" }}
          >
            GAME ARENA
          </div>

          <h2
            id="arena-heading"
            style={{ fontFamily:"Rajdhani, sans-serif", fontSize:"clamp(28px,4vw,44px)", fontWeight:700, lineHeight:1.2, marginBottom:"16px", color:"#fff" }}
          >
            Study Like a{" "}
            <span style={{ background:"linear-gradient(135deg,#FF6200,#FFB800)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
              Game. Rank Like a
            </span>{" "}
            Champion.
          </h2>

          <p style={{ fontSize:"17px", color:"rgba(255,255,255,0.85)", lineHeight:1.7, margin:"0 0 28px" }}>
            Duolingo-style streaks, XP system, global leaderboard — designed to make you open the app every single day.
          </p>

          <button
            onClick={() => router.push("/game-arena")}
            aria-label="Go to Game Arena and practice PSC questions"
            style={{ background:"linear-gradient(135deg,#FF6200,#FF8534)", color:"white", border:"none", padding:"16px 40px", borderRadius:"50px", fontFamily:"Nunito, sans-serif", fontSize:"18px", fontWeight:800, cursor:"pointer", boxShadow:"0 6px 30px rgba(255,98,0,0.45)", transition:"transform 0.2s, box-shadow 0.2s", display:"inline-flex", alignItems:"center", gap:"8px" }}
            onMouseEnter={onBtnEnter}
            onMouseLeave={onBtnLeave}
          >
            🎮 Enter Game Arena
          </button>

          <p style={{ marginTop:"10px", fontSize:"13px", color:"rgba(255,255,255,0.4)" }}>
            Practice with real PSC-level questions in a fun game mode
          </p>
        </div>

        {/* ── Two-column grid ── */}
        <div id="arena-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"60px", alignItems:"start", width:"100%" }}>

          {/* LEFT — Journey */}
          <div>
            <p
              id="journey-label"
              style={{ fontSize:"15px", fontWeight:700, color:"rgba(255,255,255,0.55)", letterSpacing:"0.5px", marginBottom:"16px" }}
            >
              {profile ? `${profile.displayName.toUpperCase()}'S JOURNEY` : "YOUR JOURNEY"}
            </p>

            {/* Tier list */}
            <ul
              role="list"
              aria-labelledby="journey-label"
              style={{ listStyle:"none", padding:0, margin:0, display:"flex", flexDirection:"column", gap:"10px", marginBottom:"24px" }}
            >
              {TIER_DEFS.map((t, i) => {
                const isActive  = i === activeTierIdx;
                const isReached = i <= activeTierIdx;
                const isLocked  = i > activeTierIdx + 1;
                return (
                  <li
                    key={t.name}
                    aria-label={`${t.name} tier — ${t.desc}${isActive ? " — your current level" : ""}${isLocked ? " — locked" : ""}`}
                    aria-current={isActive ? "true" : undefined}
                    style={{
                      display:"flex", alignItems:"center", gap:"16px",
                      background: isActive ? "rgba(255,98,0,0.12)" : "rgba(255,255,255,0.04)",
                      border: isActive ? "1px solid rgba(255,98,0,0.35)" : "1px solid rgba(255,255,255,0.08)",
                      borderRadius:"14px", padding:"14px 18px",
                      opacity: isLocked ? 0.5 : isReached ? 1 : 0.7,
                      transition:"background 0.3s, border-color 0.3s, box-shadow 0.3s",
                      boxShadow: isActive ? "0 0 20px rgba(255,98,0,0.15)" : "none",
                      cursor:"default",
                    }}
                    onMouseEnter={makeTierEnter(i)}
                    onMouseLeave={makeTierLeave(i)}
                  >
                    <span aria-hidden="true" style={{ fontSize:"24px", flexShrink:0 }}>{t.icon}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:"Rajdhani, sans-serif", fontSize:"18px", fontWeight:700, color: isActive ? "#FF6200" : isReached ? "#fff" : "rgba(255,255,255,0.6)", display:"flex", alignItems:"center", gap:"8px", flexWrap:"wrap" }}>
                        {t.name}
                        {isActive && (
                          <span style={{ fontSize:"11px", background:"#FF6200", color:"white", padding:"2px 8px", borderRadius:"10px", fontFamily:"Nunito, sans-serif", fontWeight:700, animation:"pulse 2s ease-in-out infinite" }}>
                            YOU ARE HERE
                          </span>
                        )}
                        {isReached && !isActive && (
                          <span style={{ fontSize:"10px", color:"rgba(255,255,255,0.35)" }}>✓</span>
                        )}
                      </div>
                      <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.55)" }}>{t.desc}</div>
                    </div>
                    <div style={{ fontSize:"13px", fontWeight:700, color: isActive ? "#FF8534" : "rgba(255,255,255,0.4)", flexShrink:0 }}>{t.xp}</div>
                  </li>
                );
              })}
            </ul>

            {/* Next level progress (only if not at max) */}
            {nextLevel && (
              <div style={{ background:"rgba(255,98,0,0.08)", border:"1px solid rgba(255,98,0,0.2)", borderRadius:"12px", padding:"12px 16px", marginBottom:"16px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"6px" }}>
                  <span style={{ fontSize:"12px", fontWeight:700, color:"#FF8534" }}>
                    Next: {nextLevel.icon} {nextLevel.label}
                  </span>
                  <span style={{ fontSize:"11px", color:"rgba(255,255,255,0.45)" }}>
                    {totalScore.toLocaleString()} / {nextLevel.threshold.toLocaleString()} pts
                  </span>
                </div>
                <div style={{ height:"6px", background:"rgba(255,255,255,0.08)", borderRadius:"3px", overflow:"hidden" }}>
                  <div
                    style={{
                      height:"100%",
                      borderRadius:"3px",
                      background:"linear-gradient(90deg,#FF6200,#FFB800)",
                      width:`${Math.min(100, (totalScore / nextLevel.threshold) * 100)}%`,
                      transition:"width 0.5s ease",
                    }}
                  />
                </div>
                <p style={{ fontSize:"11px", color:"rgba(255,255,255,0.4)", marginTop:"4px" }}>
                  {(nextLevel.threshold - totalScore).toLocaleString()} pts to go — keep playing!
                </p>
              </div>
            )}

            {/* Stat mini-cards */}
            <div style={{ display:"flex", gap:"10px", flexWrap:"wrap" }} aria-label="Your current stats">
              {statMini.map(c => (
                <div
                  key={c.label}
                  role="img"
                  aria-label={`${c.label}: ${c.value}`}
                  style={{ background:c.bg, border:`1px solid ${c.border}`, borderRadius:"10px", padding:"12px 16px", fontSize:"13px", minWidth:"80px", transition:"transform 0.2s" }}
                  onMouseEnter={onStatEnter}
                  onMouseLeave={onStatLeave}
                >
                  <div aria-hidden="true" style={{ fontSize:"20px", marginBottom:"4px" }}>{c.icon}</div>
                  <div style={{ fontWeight:700 }}>{c.value}</div>
                  <div style={{ color:"rgba(255,255,255,0.55)", fontSize:"11px" }}>{c.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Leaderboard */}
          <div>
            <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"20px", overflow:"hidden" }}>

              {/* Leaderboard header */}
              <div style={{ background:"linear-gradient(90deg,rgba(255,98,0,0.2),rgba(255,184,0,0.1))", padding:"16px 20px", display:"flex", alignItems:"center", gap:"10px", borderBottom:"1px solid rgba(255,255,255,0.1)" }}>
                <span aria-hidden="true" style={{ fontSize:"22px" }}>🏆</span>
                <h3 style={{ fontFamily:"Rajdhani, sans-serif", fontSize:"20px", fontWeight:700, margin:0 }}>
                  CivilEzy Leaderboard
                </h3>
                <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:"6px", fontSize:"11px", color:"rgba(255,255,255,0.5)" }}>
                  {lbTab !== "all" && (
                    <>
                      <span style={{ display:"inline-block", width:"6px", height:"6px", borderRadius:"50%", background:"#22c55e", animation:"pulse 2s ease-in-out infinite" }} />
                      <span style={{ color:"#22c55e", fontWeight:700, fontSize:"10px", letterSpacing:"0.5px" }}>LIVE</span>
                      <span style={{ color:"rgba(255,255,255,0.2)" }}>·</span>
                    </>
                  )}
                  {countdown && (
                    <span>Resets in <span style={{ color:"rgba(255,255,255,0.8)", fontWeight:700 }}>{countdown}</span></span>
                  )}
                  {lbTab === "all" && (
                    <span style={{ fontSize:"12px", color:"rgba(255,255,255,0.55)" }}>All Time</span>
                  )}
                </div>
              </div>

              {/* Period tab switcher */}
              <div style={{ display:"flex", gap:"0", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
                {([
                  { id: "daily" as const,   label: "📅 Daily" },
                  { id: "weekly" as const,  label: "📆 Weekly" },
                  { id: "monthly" as const, label: "🗓️ Monthly" },
                  { id: "all" as const,     label: "👑 All Time" },
                ] as const).map((tab) => {
                  const active = tab.id === lbTab;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setLbTab(tab.id)}
                      style={{
                        flex: 1,
                        padding: "10px 6px",
                        fontSize: "12px",
                        fontWeight: active ? 800 : 600,
                        color: active ? "#FF8534" : "rgba(255,255,255,0.45)",
                        background: active ? "rgba(255,98,0,0.1)" : "transparent",
                        border: "none",
                        borderBottom: active ? "2px solid #FF6200" : "2px solid transparent",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        fontFamily: "Nunito, sans-serif",
                      }}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Monthly rewards teaser */}
              {lbTab === "monthly" && (
                <div style={{ padding:"8px 20px", background:"rgba(255,184,0,0.06)", borderBottom:"1px solid rgba(255,255,255,0.06)", display:"flex", alignItems:"center", gap:"6px" }}>
                  <span style={{ fontSize:"12px" }}>🎖️</span>
                  <span style={{ fontSize:"11px", fontWeight:700, color:"#FFB800" }}>Top Monthly Players Get Special Badge</span>
                </div>
              )}

              {/* Leaderboard rows */}
              <ol
                aria-label="Kerala PSC leaderboard — top ranked students"
                style={{ listStyle:"none", padding:"8px 0", margin:0 }}
              >
                {/* Loading state */}
                {(lbTab === "all" ? lbLoading : periodLoading) ? (
                  <li style={{ padding:"20px", textAlign:"center", fontSize:"14px", color:"rgba(255,255,255,0.45)" }}>
                    Loading leaderboard...
                  </li>
                ) : (() => {
                  // Pick the right data source based on active tab
                  const isAllTime = lbTab === "all";
                  const rows = isAllTime ? lbData : periodData;

                  if (rows.length === 0) {
                    return (
                      <li style={{ padding:"30px 20px", textAlign:"center" }}>
                        <div style={{ fontSize:"32px", marginBottom:"8px" }}>🏟️</div>
                        <div style={{ fontSize:"14px", fontWeight:600, color:"rgba(255,255,255,0.5)", marginBottom:"4px" }}>
                          {isAllTime ? "No scores yet." : `No players this ${lbTab === "daily" ? "day" : lbTab === "weekly" ? "week" : "month"}.`}
                        </div>
                        <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.3)" }}>
                          Play a game to claim the top spot!
                        </div>
                      </li>
                    );
                  }

                  return rows.map((entry, i) => {
                    const avatar = AVATAR_COLORS[i % AVATAR_COLORS.length];
                    // Get name from either entry type
                    const entryName = isAllTime
                      ? (entry as LeaderboardEntry).name
                      : (entry as PeriodLeaderboardEntry).displayName;
                    const initials = entryName.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase();
                    const rankColor = i < 3 ? RANK_COLORS[i] : "rgba(255,255,255,0.55)";
                    const isFirst = i === 0;
                    const isMe = profile?.displayName?.toLowerCase() === entryName?.toLowerCase();

                    // Get display score — period entries use leaderboardMetric, all-time uses totalScore
                    const displayScore = isAllTime
                      ? ((entry as LeaderboardEntry).totalScore ?? (entry as LeaderboardEntry).score)
                      : (entry as PeriodLeaderboardEntry).leaderboardMetric;

                    // Medal for top 3
                    const medals = ["🥇", "🥈", "🥉"];
                    const rankDisplay = i < 3 ? medals[i] : `#${i + 1}`;

                    return (
                      <li
                        key={`${entryName}-${i}`}
                        style={{
                          display:"flex", alignItems:"center", gap:"14px", padding:"10px 20px",
                          background: isMe ? "rgba(255,98,0,0.12)" : isFirst ? "rgba(255,184,0,0.08)" : "",
                          border: isMe ? "1px solid rgba(255,98,0,0.3)" : "1px solid transparent",
                          borderRadius: isMe ? "10px" : "0",
                          transition:"background 0.2s",
                        }}
                        onMouseEnter={onLbEnter}
                        onMouseLeave={onLbLeave}
                      >
                        <div style={{ width:"28px", textAlign:"center", fontFamily:"Rajdhani, sans-serif", fontSize: i < 3 ? "18px" : "16px", fontWeight:700, color:rankColor }}>{rankDisplay}</div>
                        <div
                          aria-hidden="true"
                          style={{ width:"36px", height:"36px", borderRadius:"50%", background: isMe ? "rgba(255,98,0,0.35)" : avatar.bg, color: isMe ? "#fff" : avatar.c, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px", fontWeight:700, flexShrink:0 }}
                        >
                          {initials}
                        </div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:"14px", fontWeight:700, color: isMe ? "#FF8534" : "#fff" }}>
                            {entryName}{isMe ? " (You)" : ""}
                          </div>
                          {/* Show level for all-time, games+streak for period */}
                          {isAllTime ? (
                            (entry as LeaderboardEntry).level && <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.55)" }}>{(entry as LeaderboardEntry).level}</div>
                          ) : (
                            <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.45)", display:"flex", gap:"8px" }}>
                              <span>{(entry as PeriodLeaderboardEntry).gamesPlayed} game{(entry as PeriodLeaderboardEntry).gamesPlayed !== 1 ? "s" : ""}</span>
                              {(entry as PeriodLeaderboardEntry).bestStreak > 1 && (
                                <span style={{ color:"rgba(255,152,0,0.7)" }}>🔥 {(entry as PeriodLeaderboardEntry).bestStreak} streak</span>
                              )}
                            </div>
                          )}
                        </div>
                        <div style={{ fontSize:"14px", fontWeight:700, color:"#FF8534" }}>
                          {displayScore.toLocaleString()}
                          <span style={{ fontSize:"10px", color:"rgba(255,255,255,0.4)", marginLeft:"2px" }}>{isAllTime ? "pts" : "xp"}</span>
                        </div>
                      </li>
                    );
                  });
                })()}
              </ol>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #arena-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </section>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useMemo } from "react";
import { getLeaderboard, getLevel, getNextLevel, type LeaderboardEntry } from "@/lib/leaderboard";
import { loadPlayer, type PlayerData } from "@/lib/player";

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
  { icon:"🌱", name:"Rookie",  desc:"0 – 499 pts" ,       xp:"500 pts",    threshold:0     },
  { icon:"📖", name:"Scholar", desc:"500 – 1,999 pts",       xp:"2,000 pts",  threshold:500   },
  { icon:"⚡", name:"Expert",  desc:"2,000 – 4,999 pts",      xp:"5,000 pts",  threshold:2000  },
  { icon:"🏅", name:"Master",  desc:"5,000 – 9,999 pts",     xp:"20,000 pts", threshold:5000  },
  { icon:"🔥", name:"Legend",  desc:"10,000+ pts",           xp:"50000pts",      threshold:10000 },
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
const BADGES = ["🔥 Streak Champion","⚡ Speed King","🎯 Topic Master","🌟 30-Day Legend"] as const;

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
  const [lbData, setLbData]       = useState<LeaderboardEntry[]>([]);
  const [lbLoading, setLbLoading] = useState(true);
  const [player, setPlayer]       = useState<PlayerData | null>(null);

  // Load player + leaderboard on mount (and when user returns from game)
  useEffect(() => {
    setPlayer(loadPlayer());
    getLeaderboard()
      .then(setLbData)
      .catch(() => {})
      .finally(() => setLbLoading(false));
  }, []);

  // Re-read player data when tab regains focus (user may have just played a game)
  useEffect(() => {
    const onFocus = () => setPlayer(loadPlayer());
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  // ── Derived player values (memoized) ──
  const totalScore   = player?.totalScore ?? 0;
  const streak       = player?.streak ?? 0;
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
              {player ? `${player.name.toUpperCase()}'S JOURNEY` : "YOUR JOURNEY"}
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
                  Kerala PSC Global Leaderboard
                </h3>
                <div style={{ marginLeft:"auto", fontSize:"12px", color:"rgba(255,255,255,0.55)" }}>This Week</div>
              </div>

              {/* Leaderboard rows */}
              <ol
                aria-label="Kerala PSC leaderboard — top ranked students"
                style={{ listStyle:"none", padding:"8px 0", margin:0 }}
              >
                {lbLoading ? (
                  <li style={{ padding:"20px", textAlign:"center", fontSize:"14px", color:"rgba(255,255,255,0.45)" }}>
                    Loading leaderboard...
                  </li>
                ) : lbData.length === 0 ? (
                  <li style={{ padding:"20px", textAlign:"center", fontSize:"14px", color:"rgba(255,255,255,0.45)" }}>
                    No scores yet. Play a game to get on the board!
                  </li>
                ) : lbData.map((entry, i) => {
                  const avatar = AVATAR_COLORS[i % AVATAR_COLORS.length];
                  const initials = entry.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
                  const rankColor = i < 3 ? RANK_COLORS[i] : "rgba(255,255,255,0.55)";
                  const isFirst = i === 0;
                  const isMe = player?.name?.toLowerCase() === entry.name?.toLowerCase();
                  return (
                    <li
                      key={`${entry.name}-${i}`}
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
                      <div style={{ width:"28px", textAlign:"center", fontFamily:"Rajdhani, sans-serif", fontSize:"16px", fontWeight:700, color:rankColor }}>#{i + 1}</div>
                      <div
                        aria-hidden="true"
                        style={{ width:"36px", height:"36px", borderRadius:"50%", background: isMe ? "rgba(255,98,0,0.35)" : avatar.bg, color: isMe ? "#fff" : avatar.c, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px", fontWeight:700, flexShrink:0 }}
                      >
                        {initials}
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:"14px", fontWeight:700, color: isMe ? "#FF8534" : "#fff" }}>{entry.name}{isMe ? " (You)" : ""}</div>
                        {entry.level && <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.55)" }}>{entry.level}</div>}
                      </div>
                      <div style={{ fontSize:"14px", fontWeight:700, color:"#FF8534" }}>{(entry.totalScore ?? entry.score).toLocaleString()} pts</div>
                    </li>
                  );
                })}
              </ol>

              {/* Achievement badges */}
              <ul
                role="list"
                aria-label="Achievement badges"
                style={{ display:"flex", flexWrap:"wrap", gap:"10px", padding:"16px 20px", borderTop:"1px solid rgba(255,255,255,0.08)", listStyle:"none", margin:0 }}
              >
                {BADGES.map(b => (
                  <li key={b} style={{ display:"inline-flex", alignItems:"center", gap:"6px", background:"rgba(255,98,0,0.1)", border:"1px solid rgba(255,98,0,0.25)", borderRadius:"20px", padding:"6px 12px", fontSize:"12px", fontWeight:700, color:"#FF8534" }}>
                    {b}
                  </li>
                ))}
              </ul>
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

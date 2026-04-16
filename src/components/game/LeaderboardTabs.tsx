"use client";

import { useState, useEffect, useRef } from "react";
import {
  subscribeToPeriodLeaderboard,
  msUntilReset,
  type LeaderboardPeriod,
  type PeriodLeaderboardEntry,
} from "@/lib/leaderboard";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface LeaderboardTabsProps {
  /** Player name — used to highlight "You" row */
  currentPlayerName?: string;
}

// ---------------------------------------------------------------------------
// Tab config
// ---------------------------------------------------------------------------
const TABS: { id: LeaderboardPeriod; label: string; icon: string }[] = [
  { id: "daily",   label: "Daily",   icon: "📅" },
  { id: "weekly",  label: "Weekly",  icon: "📆" },
  { id: "monthly", label: "Monthly", icon: "🗓️" },
];

// Rank badge config: Gold / Silver / Bronze
const RANK_BADGES: { label: string; emoji: string; bg: string; border: string; text: string; glow: string }[] = [
  { label: "Gold",   emoji: "🥇", bg: "bg-yellow-500/15", border: "border-yellow-500/40", text: "text-yellow-400", glow: "shadow-[0_0_12px_rgba(234,179,8,0.25)]" },
  { label: "Silver", emoji: "🥈", bg: "bg-zinc-400/10",   border: "border-zinc-400/30",   text: "text-zinc-300",  glow: "shadow-[0_0_10px_rgba(161,161,170,0.15)]" },
  { label: "Bronze", emoji: "🥉", bg: "bg-amber-600/10",  border: "border-amber-600/30",  text: "text-amber-500", glow: "shadow-[0_0_10px_rgba(217,119,6,0.15)]" },
];

// ---------------------------------------------------------------------------
// Countdown formatter
// ---------------------------------------------------------------------------
function formatCountdown(ms: number): string {
  if (ms <= 0) return "Resetting...";

  const totalSec = Math.floor(ms / 1000);
  const days  = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const mins  = Math.floor((totalSec % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function LeaderboardTabs({ currentPlayerName }: LeaderboardTabsProps) {
  const [activeTab, setActiveTab] = useState<LeaderboardPeriod>("daily");
  const [entries, setEntries]     = useState<PeriodLeaderboardEntry[]>([]);
  const [loading, setLoading]     = useState(true);
  const [countdown, setCountdown] = useState("");
  const [transitioning, setTransitioning] = useState(false);
  const prevTabRef = useRef<LeaderboardPeriod>(activeTab);

  // ── Smooth tab switch ──
  const handleTabSwitch = (tab: LeaderboardPeriod) => {
    if (tab === activeTab) return;
    setTransitioning(true);
    setTimeout(() => {
      prevTabRef.current = activeTab;
      setActiveTab(tab);
      setTransitioning(false);
    }, 150);
  };

  // ── Real-time listener for active tab ──
  useEffect(() => {
    setLoading(true);
    const unsub = subscribeToPeriodLeaderboard(
      activeTab,
      50,
      (data) => { setEntries(data); setLoading(false); },
      ()    => { setEntries([]);    setLoading(false); },
    );
    return unsub;
  }, [activeTab]);

  // ── Countdown timer ──
  useEffect(() => {
    const tick = () => setCountdown(formatCountdown(msUntilReset(activeTab)));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [activeTab]);

  const playerKey = currentPlayerName?.toLowerCase().trim();

  // Find current user's rank
  const myRank = entries.findIndex(
    (e) => (e.displayName ?? e.userId).toLowerCase().trim() === playerKey
  );

  return (
    <div>
      {/* Tab switcher */}
      <div className="flex gap-1 mb-4 bg-zinc-800/60 rounded-xl p-1">
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabSwitch(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-orange-500 to-amber-400 text-white shadow-lg shadow-orange-500/20"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50"
              }`}
            >
              <span className="text-sm">{tab.icon}</span>
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Countdown + live indicator */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-emerald-400 font-semibold">LIVE</span>
          <span className="mx-1 text-zinc-700">·</span>
          Resets in <span className="text-zinc-300 font-semibold ml-1">{countdown}</span>
        </div>
        {/* Show user's rank if they're on the board */}
        {myRank >= 0 && (
          <div className="text-xs font-bold text-orange-400">
            Your Rank: #{myRank + 1}
          </div>
        )}
        {activeTab === "monthly" && myRank < 0 && (
          <div className="text-[10px] text-amber-400/70 font-semibold tracking-wide">
            Top Players Get Special Badge
          </div>
        )}
      </div>

      {/* Content area with fade transition */}
      <div
        className="transition-all duration-150 ease-in-out"
        style={{
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? "translateY(4px)" : "translateY(0)",
        }}
      >
        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-11 rounded-lg bg-zinc-800/50 animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && entries.length === 0 && (
          <div className="text-center py-8">
            <div className="text-3xl mb-2">🏟️</div>
            <p className="text-zinc-500 text-sm font-medium">
              No players yet this {activeTab === "daily" ? "day" : activeTab === "weekly" ? "week" : "month"}.
            </p>
            <p className="text-zinc-600 text-xs mt-1">Play a game to claim the top spot!</p>
          </div>
        )}

        {/* Leaderboard list */}
        {!loading && entries.length > 0 && (
          <ol className="space-y-1.5">
            {entries.map((entry, i) => {
              const rank = i + 1;
              const name = entry.displayName || "Unknown";
              const isMe = playerKey === name.toLowerCase().trim();
              const isTop3 = i < 3;
              const badge = isTop3 ? RANK_BADGES[i] : null;

              return (
                <li
                  key={`${entry.userId}-${i}`}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isMe
                      ? "bg-orange-500/10 ring-1 ring-orange-500/30"
                      : badge
                      ? `${badge.bg} border ${badge.border} ${badge.glow}`
                      : "hover:bg-white/[0.03]"
                  }`}
                >
                  {/* Rank badge */}
                  <span className={`w-8 text-center font-bold shrink-0 ${
                    badge ? "text-base" : "text-sm text-zinc-500"
                  }`}>
                    {badge ? (
                      <span title={`${badge.label} — Rank #${rank}`}>
                        {badge.emoji}
                      </span>
                    ) : (
                      `#${rank}`
                    )}
                  </span>

                  {/* Name */}
                  <span className={`flex-1 text-sm font-semibold truncate ${
                    isMe ? "text-orange-300" : badge ? badge.text : "text-white"
                  }`}>
                    {name}
                    {isMe && (
                      <span className="ml-1.5 text-[10px] font-bold text-orange-400 bg-orange-500/15 px-1.5 py-0.5 rounded-full">
                        YOU
                      </span>
                    )}
                  </span>

                  {/* Stats */}
                  <div className="flex items-center gap-3 shrink-0">
                    {/* Games */}
                    <span className="text-[11px] text-zinc-500 hidden sm:inline" title="Games played">
                      {entry.gamesPlayed} {entry.gamesPlayed === 1 ? "game" : "games"}
                    </span>

                    {/* Streak */}
                    {entry.bestStreak > 1 && (
                      <span className="text-xs text-orange-400/70 shrink-0" title="Best streak">
                        🔥{entry.bestStreak}
                      </span>
                    )}

                    {/* XP / Metric */}
                    <span className={`text-sm font-bold shrink-0 ${
                      badge ? badge.text : "text-zinc-300"
                    }`}>
                      {entry.leaderboardMetric.toLocaleString()}
                      <span className="text-[10px] text-zinc-500 ml-0.5">xp</span>
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}

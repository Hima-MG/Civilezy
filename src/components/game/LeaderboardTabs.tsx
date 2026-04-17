"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { QueryDocumentSnapshot } from "firebase/firestore";
import {
  subscribeToPeriodLeaderboard,
  fetchNextLeaderboardPage,
  fetchUserRankInPeriod,
  msUntilReset,
  type LeaderboardPeriod,
  type PeriodLeaderboardEntry,
} from "@/lib/leaderboard";

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

const TABS: { id: LeaderboardPeriod; label: string; icon: string }[] = [
  { id: "daily",   label: "Daily",   icon: "📅" },
  { id: "weekly",  label: "Weekly",  icon: "📆" },
  { id: "monthly", label: "Monthly", icon: "🗓️" },
];

const RANK_BADGES = [
  { emoji: "🥇", ring: "ring-yellow-500/40",  glow: "shadow-[0_0_18px_rgba(234,179,8,0.30)]",   text: "text-yellow-400", bg: "bg-yellow-500/10"  },
  { emoji: "🥈", ring: "ring-zinc-400/30",    glow: "shadow-[0_0_10px_rgba(161,161,170,0.15)]", text: "text-zinc-300",   bg: "bg-zinc-400/8"    },
  { emoji: "🥉", ring: "ring-amber-600/30",   glow: "shadow-[0_0_10px_rgba(217,119,6,0.15)]",   text: "text-amber-500",  bg: "bg-amber-600/8"   },
];

// Deterministic avatar colour from display name
const AVATAR_PALETTE = [
  "#FF8534","#22c55e","#FFB800","#3b82f6","#a855f7","#ec4899","#06b6d4","#f97316",
];
function avatarColor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff;
  return AVATAR_PALETTE[h % AVATAR_PALETTE.length];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCountdown(ms: number): string {
  if (ms <= 0) return "Resetting…";
  const s    = Math.floor(ms / 1000);
  const days = Math.floor(s / 86400);
  const hrs  = Math.floor((s % 86400) / 3600);
  const mins = Math.floor((s % 3600) / 60);
  if (days > 0)  return `${days}d ${hrs}h`;
  if (hrs  > 0)  return `${hrs}h ${mins}m`;
  return `${mins}m`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Spinner({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={2.5} strokeLinecap="round"
      style={{ animation: "lb-spin 0.7s linear infinite", flexShrink: 0 }}
    >
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  );
}

function SkeletonRow({ delay }: { delay: number }) {
  return (
    <div
      className="h-12 rounded-xl bg-zinc-800/50 animate-pulse"
      style={{ animationDelay: `${delay}s` }}
    />
  );
}

// ─── Podium sub-component ─────────────────────────────────────────────────────

interface PodiumProps {
  entries: PeriodLeaderboardEntry[];
  playerKey: string;
}

function Podium({ entries, playerKey }: PodiumProps) {
  if (entries.length < 3) return null;

  const [first, second, third] = entries;

  const PodiumCard = ({
    entry,
    rank,
    isCenter,
  }: {
    entry: PeriodLeaderboardEntry;
    rank: 1 | 2 | 3;
    isCenter: boolean;
  }) => {
    const badge   = RANK_BADGES[rank - 1];
    const name    = entry.displayName || "Unknown";
    const isMe    = !!playerKey && name.toLowerCase().trim() === playerKey;
    const color   = isMe ? "#FF8534" : avatarColor(name);
    const avatarSize = isCenter ? 52 : 40;

    const podiumHeights = { 1: "h-16", 2: "h-10", 3: "h-8" };
    const podiumColors  = {
      1: "bg-gradient-to-t from-yellow-600/40 to-yellow-500/20 border-yellow-500/30",
      2: "bg-gradient-to-t from-zinc-500/30 to-zinc-400/10 border-zinc-500/20",
      3: "bg-gradient-to-t from-amber-700/30 to-amber-600/10 border-amber-600/20",
    };

    return (
      <div
        className={`flex flex-col items-center gap-1 ${isCenter ? "pb-0" : "pt-4"}`}
        style={{ animation: `lb-slide-in 0.4s ease ${(rank - 1) * 0.1}s both` }}
      >
        {/* Crown for #1 */}
        {isCenter && (
          <div className="text-xl mb-0.5" style={{ filter: "drop-shadow(0 0 6px rgba(234,179,8,0.6))" }}>
            👑
          </div>
        )}

        {/* Avatar */}
        <div
          className={`rounded-full flex items-center justify-center font-extrabold text-white select-none shrink-0 ${
            isCenter ? "ring-2 ring-yellow-400/60 shadow-[0_0_20px_rgba(234,179,8,0.35)]" : `ring-1 ${badge.ring}`
          }`}
          style={{
            width: avatarSize,
            height: avatarSize,
            background: color,
            fontSize: isCenter ? 20 : 15,
          }}
        >
          {name[0]?.toUpperCase() ?? "?"}
        </div>

        {/* Medal */}
        <span className="text-lg leading-none">{badge.emoji}</span>

        {/* Name */}
        <span
          className={`text-[11px] font-bold text-center leading-tight max-w-[70px] truncate ${
            isMe ? "text-orange-300" : badge.text
          }`}
          title={name}
        >
          {name}
          {isMe && <span className="block text-[9px] text-orange-400/80">YOU</span>}
        </span>

        {/* XP */}
        <span className={`text-xs font-extrabold tabular-nums ${badge.text}`}>
          {entry.leaderboardMetric.toLocaleString()}
          <span className="text-[9px] font-normal text-zinc-500 ml-0.5">xp</span>
        </span>

        {/* Podium block */}
        <div
          className={`w-16 rounded-t-lg border ${podiumColors[rank]} ${podiumHeights[rank]} flex items-center justify-center`}
        >
          <span className="text-zinc-500 text-xs font-bold">#{rank}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="mb-5 px-1">
      {/* Layout: 2nd | 1st | 3rd  (align to bottom) */}
      <div className="flex items-end justify-center gap-2">
        <PodiumCard entry={second} rank={2} isCenter={false} />
        <PodiumCard entry={first}  rank={1} isCenter={true}  />
        <PodiumCard entry={third}  rank={3} isCenter={false} />
      </div>
    </div>
  );
}

// ─── Your Rank Card ───────────────────────────────────────────────────────────

interface YourRankCardProps {
  rank: number;
  playerName: string;
  loading: boolean;
}

function YourRankCard({ rank, playerName, loading }: YourRankCardProps) {
  return (
    <div
      className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl border border-orange-500/30 bg-orange-500/8"
      style={{ animation: "lb-slide-in 0.35s ease both" }}
    >
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold text-white shrink-0"
        style={{ background: "#FF8534" }}
      >
        {playerName[0]?.toUpperCase() ?? "?"}
      </div>

      {/* Label */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-zinc-400 font-medium">Your Position</p>
        <p className="text-sm font-bold text-orange-300 truncate">{playerName}</p>
      </div>

      {/* Rank badge */}
      <div className="shrink-0 text-right">
        {loading ? (
          <Spinner size={14} />
        ) : (
          <>
            <span className="text-lg font-extrabold text-orange-400 tabular-nums">
              #{rank}
            </span>
            <p className="text-[9px] text-zinc-500 font-medium">Your Rank</p>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  currentPlayerName?: string;
  currentUserId?: string;
}

export default function LeaderboardTabs({ currentPlayerName, currentUserId }: Props) {
  const [activeTab,    setActiveTab]    = useState<LeaderboardPeriod>("daily");
  const [entries,      setEntries]      = useState<PeriodLeaderboardEntry[]>([]);
  const [cursorDoc,    setCursorDoc]    = useState<QueryDocumentSnapshot | null>(null);
  const [hasMore,      setHasMore]      = useState(false);
  const [initLoading,  setInitLoading]  = useState(true);
  const [loadingMore,  setLoadingMore]  = useState(false);
  const [firebaseErr,  setFirebaseErr]  = useState<string | null>(null);
  const [countdown,    setCountdown]    = useState("");
  const [transitioning,setTransitioning]= useState(false);
  const [newFrom,      setNewFrom]      = useState<number>(-1);

  // User rank state (shown when user not in visible list)
  const [userRank,       setUserRank]      = useState<number | null>(null);
  const [rankLoading,    setRankLoading]   = useState(false);

  const activeTabRef = useRef(activeTab);

  // ── Tab switch ──
  const handleTabSwitch = useCallback((tab: LeaderboardPeriod) => {
    if (tab === activeTab) return;
    setTransitioning(true);
    setTimeout(() => {
      activeTabRef.current = tab;
      setActiveTab(tab);
      setTransitioning(false);
    }, 140);
  }, [activeTab]);

  // ── Real-time first page ──
  useEffect(() => {
    setInitLoading(true);
    setEntries([]);
    setCursorDoc(null);
    setHasMore(false);
    setFirebaseErr(null);
    setNewFrom(-1);
    setUserRank(null);

    const unsub = subscribeToPeriodLeaderboard(
      activeTab,
      PAGE_SIZE,
      (data, lastDoc) => {
        setEntries(data);
        setCursorDoc(lastDoc);
        setHasMore(data.length >= PAGE_SIZE);
        setInitLoading(false);
      },
      (err) => {
        setFirebaseErr(err.message);
        setInitLoading(false);
      },
    );

    return unsub;
  }, [activeTab]);

  // ── Fetch user rank when entries or tab change ──
  useEffect(() => {
    if (!currentUserId || initLoading) return;

    const playerKey = currentPlayerName?.toLowerCase().trim() ?? "";
    const inVisible  = entries.some(
      (e) => (e.displayName ?? "").toLowerCase().trim() === playerKey,
    );

    if (inVisible) {
      setUserRank(null);
      return;
    }

    // User not visible — fetch their actual rank
    let cancelled = false;
    setRankLoading(true);
    fetchUserRankInPeriod(activeTab, currentUserId)
      .then((rank) => {
        if (!cancelled) setUserRank(rank);
      })
      .catch(() => {
        if (!cancelled) setUserRank(null);
      })
      .finally(() => {
        if (!cancelled) setRankLoading(false);
      });

    return () => { cancelled = true; };
  }, [entries, activeTab, currentUserId, currentPlayerName, initLoading]);

  // ── Countdown timer ──
  useEffect(() => {
    const tick = () => setCountdown(formatCountdown(msUntilReset(activeTab)));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [activeTab]);

  // ── Show More ──
  const handleShowMore = useCallback(async () => {
    if (loadingMore || !hasMore || !cursorDoc) return;

    const tabAtClick = activeTabRef.current;
    setLoadingMore(true);

    try {
      const { entries: next, lastDoc, hasMore: more } =
        await fetchNextLeaderboardPage(tabAtClick, PAGE_SIZE, cursorDoc);

      if (activeTabRef.current !== tabAtClick) return;

      setNewFrom(entries.length);
      setEntries((prev) => [...prev, ...next]);
      setCursorDoc(lastDoc);
      setHasMore(more);
    } catch {
      // non-critical — button stays enabled for retry
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, cursorDoc, entries.length]);

  // Reset newFrom after animation
  useEffect(() => {
    if (newFrom < 0) return;
    const t = setTimeout(() => setNewFrom(-1), 600);
    return () => clearTimeout(t);
  }, [newFrom]);

  const playerKey = currentPlayerName?.toLowerCase().trim() ?? "";
  const myRank    = entries.findIndex(
    (e) => (e.displayName ?? "").toLowerCase().trim() === playerKey,
  );

  // ── Render ──
  return (
    <div>

      {/* ── Tab bar ── */}
      <div className="flex gap-1 mb-4 bg-zinc-800/60 rounded-xl p-1">
        {TABS.map((tab) => {
          const active = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabSwitch(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                active
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

      {/* ── Live strip ── */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-emerald-400 font-semibold">LIVE</span>
          <span className="mx-1 text-zinc-700">·</span>
          Resets in
          <span className="text-zinc-300 font-semibold ml-1">{countdown}</span>
        </div>

        {myRank >= 0 ? (
          <span className="text-xs font-bold text-orange-400">
            Your Rank: #{myRank + 1}
          </span>
        ) : activeTab === "monthly" ? (
          <span className="text-[10px] text-amber-400/70 font-semibold tracking-wide">
            Top players earn special badge
          </span>
        ) : null}
      </div>

      {/* ── Content ── */}
      <div
        className="transition-all duration-150 ease-in-out"
        style={{
          opacity:   transitioning ? 0 : 1,
          transform: transitioning ? "translateY(4px)" : "translateY(0)",
        }}
      >

        {/* Loading skeleton */}
        {initLoading && (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonRow key={i} delay={i * 0.05} />
            ))}
            <div className="flex justify-center gap-6 py-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <div className="w-10 h-10 rounded-full bg-zinc-800/70 animate-pulse" style={{ animationDelay: `${i * 0.08}s` }} />
                  <div className="w-14 h-2 rounded bg-zinc-800/70 animate-pulse" style={{ animationDelay: `${i * 0.08 + 0.05}s` }} />
                  <div className={`w-14 rounded-t-lg bg-zinc-800/70 animate-pulse ${i === 0 ? "h-10" : i === 1 ? "h-14" : "h-8"}`} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Firebase error */}
        {!initLoading && firebaseErr && (
          <div className="text-center py-8">
            <div className="text-3xl mb-2">⚠️</div>
            <p className="text-rose-400 text-sm font-medium">Could not load leaderboard</p>
            <p className="text-zinc-600 text-xs mt-1">{firebaseErr}</p>
          </div>
        )}

        {/* Empty state */}
        {!initLoading && !firebaseErr && entries.length === 0 && (
          <div className="text-center py-10">
            <div className="text-4xl mb-3">🏟️</div>
            <p className="text-zinc-400 text-sm font-semibold">
              No players yet this {activeTab === "daily" ? "day" : activeTab === "weekly" ? "week" : "month"}.
            </p>
            <p className="text-zinc-600 text-xs mt-1">Play a game to claim the top spot!</p>
          </div>
        )}

        {/* ── Leaderboard list ── */}
        {!initLoading && entries.length > 0 && (
          <>
            {/* Top 3 Podium */}
            {entries.length >= 3 && (
              <Podium entries={entries} playerKey={playerKey} />
            )}

            {/* Full ranked list (all entries including top 3) */}
            <ol className="space-y-1.5">
              {entries.map((entry, i) => {
                const rank   = i + 1;
                const name   = entry.displayName || "Unknown";
                const isMe   = !!playerKey && name.toLowerCase().trim() === playerKey;
                const isTop3 = i < 3;
                const badge  = isTop3 ? RANK_BADGES[i] : null;
                const isNew  = newFrom >= 0 && i >= newFrom;
                const color  = avatarColor(name);

                return (
                  <li
                    key={`${entry.userId}-${i}`}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-xl
                      transition-all duration-200
                      ${isMe
                        ? "bg-orange-500/10 ring-1 ring-orange-500/30"
                        : badge
                          ? `${badge.bg} ring-1 ${badge.ring} ${badge.glow}`
                          : "hover:bg-white/[0.04]"
                      }
                    `}
                    style={isNew ? { animation: "lb-slide-in 0.35s ease both" } : undefined}
                  >
                    {/* Avatar */}
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-extrabold text-white select-none"
                      style={{ background: isMe ? "#FF8534" : color }}
                    >
                      {name[0]?.toUpperCase() ?? "?"}
                    </div>

                    {/* Rank */}
                    <span className={`w-6 text-center font-bold shrink-0 text-sm ${
                      badge ? "text-base leading-none" : "text-zinc-500"
                    }`}>
                      {badge
                        ? <span title={`#${rank}`}>{badge.emoji}</span>
                        : `#${rank}`
                      }
                    </span>

                    {/* Name */}
                    <span className={`flex-1 text-sm font-semibold truncate ${
                      isMe ? "text-orange-300" : badge ? badge.text : "text-white/90"
                    }`}>
                      {name}
                      {isMe && (
                        <span className="ml-1.5 text-[9px] font-extrabold text-orange-400 bg-orange-500/15 border border-orange-500/30 px-1.5 py-0.5 rounded-full align-middle">
                          YOU
                        </span>
                      )}
                    </span>

                    {/* Stats */}
                    <div className="flex items-center gap-2.5 shrink-0">
                      <span
                        className="text-[11px] text-zinc-500 hidden sm:inline"
                        title="Games played"
                      >
                        {entry.gamesPlayed}g
                      </span>

                      {entry.bestStreak > 1 && (
                        <span className="text-xs text-orange-400/70" title="Best streak">
                          🔥{entry.bestStreak}
                        </span>
                      )}

                      <span className={`text-sm font-bold tabular-nums ${
                        badge ? badge.text : "text-zinc-300"
                      }`}>
                        {entry.leaderboardMetric.toLocaleString()}
                        <span className="text-[10px] text-zinc-500 ml-0.5 font-normal">xp</span>
                      </span>
                    </div>
                  </li>
                );
              })}
            </ol>

            {/* ── Show More / End of list ── */}
            <div className="mt-4">
              {hasMore ? (
                <button
                  onClick={handleShowMore}
                  disabled={loadingMore}
                  className={`
                    w-full py-2.5 rounded-xl border text-sm font-semibold
                    flex items-center justify-center gap-2
                    transition-all duration-200
                    ${loadingMore
                      ? "border-zinc-700 text-zinc-500 cursor-wait"
                      : "border-zinc-700 text-zinc-400 hover:border-orange-500/50 hover:text-orange-400 hover:bg-orange-500/5 active:scale-[0.98]"
                    }
                  `}
                >
                  {loadingMore ? (
                    <>
                      <Spinner size={13} />
                      Loading…
                    </>
                  ) : (
                    <>
                      <span>Show More</span>
                      <span className="text-[10px] font-normal text-zinc-600">
                        (+{PAGE_SIZE})
                      </span>
                    </>
                  )}
                </button>
              ) : entries.length > PAGE_SIZE ? (
                <p className="text-center text-[11px] text-zinc-600 py-2 flex items-center justify-center gap-2">
                  <span className="inline-block h-px w-10 bg-zinc-800" />
                  All {entries.length} players shown
                  <span className="inline-block h-px w-10 bg-zinc-800" />
                </p>
              ) : null}
            </div>

            {/* ── Your Rank card (shown when user not in visible list) ── */}
            {currentUserId && playerKey && myRank < 0 && (userRank !== null || rankLoading) && (
              <YourRankCard
                rank={userRank ?? 0}
                playerName={currentPlayerName ?? "You"}
                loading={rankLoading}
              />
            )}

            {/* ── "Not on board" nudge (when user has no entry at all) ── */}
            {playerKey && myRank < 0 && !rankLoading && userRank === null && (
              <p className="text-center text-[11px] text-zinc-600 mt-3">
                You&apos;re not on the board yet —{" "}
                <span className="text-orange-400/70 font-semibold">play to climb!</span>
              </p>
            )}
          </>
        )}
      </div>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes lb-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes lb-slide-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
    </div>
  );
}

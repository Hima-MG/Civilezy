"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { QueryDocumentSnapshot } from "firebase/firestore";
import {
  subscribeToPeriodLeaderboard,
  fetchNextLeaderboardPage,
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
  { emoji: "🥇", ring: "ring-yellow-500/40",  glow: "shadow-[0_0_14px_rgba(234,179,8,0.22)]",   text: "text-yellow-400", bg: "bg-yellow-500/10"  },
  { emoji: "🥈", ring: "ring-zinc-400/30",    glow: "shadow-[0_0_10px_rgba(161,161,170,0.15)]", text: "text-zinc-300",  bg: "bg-zinc-400/8"    },
  { emoji: "🥉", ring: "ring-amber-600/30",   glow: "shadow-[0_0_10px_rgba(217,119,6,0.15)]",  text: "text-amber-500", bg: "bg-amber-600/8"   },
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

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  currentPlayerName?: string;
}

export default function LeaderboardTabs({ currentPlayerName }: Props) {
  const [activeTab,    setActiveTab]    = useState<LeaderboardPeriod>("daily");
  const [entries,      setEntries]      = useState<PeriodLeaderboardEntry[]>([]);
  const [cursorDoc,    setCursorDoc]    = useState<QueryDocumentSnapshot | null>(null);
  const [hasMore,      setHasMore]      = useState(false);
  const [initLoading,  setInitLoading]  = useState(true);
  const [loadingMore,  setLoadingMore]  = useState(false);
  const [firebaseErr,  setFirebaseErr]  = useState<string | null>(null);
  const [countdown,    setCountdown]    = useState("");
  const [transitioning,setTransitioning]= useState(false);
  // Track which entry indices were just appended (for slide-in animation)
  const [newFrom,      setNewFrom]      = useState<number>(-1);

  // Prevents a stale "Show More" from running after a tab switch
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

      // Discard result if user switched tabs while loading
      if (activeTabRef.current !== tabAtClick) return;

      setNewFrom(entries.length);                    // animate new rows
      setEntries((prev) => [...prev, ...next]);
      setCursorDoc(lastDoc);
      setHasMore(more);
    } catch {
      // non-critical — button stays enabled for retry
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, cursorDoc, entries.length]);

  // Reset newFrom after animation completes
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

        {/* Loading skeleton — first page only */}
        {initLoading && (
          <div className="space-y-2">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <SkeletonRow key={i} delay={i * 0.05} />
            ))}
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
                /* All pages loaded */
                <p className="text-center text-[11px] text-zinc-600 py-2 flex items-center justify-center gap-2">
                  <span className="inline-block h-px w-10 bg-zinc-800" />
                  All {entries.length} players shown
                  <span className="inline-block h-px w-10 bg-zinc-800" />
                </p>
              ) : null}
            </div>

            {/* ── "You're not on the board" nudge ── */}
            {playerKey && myRank < 0 && (
              <p className="text-center text-[11px] text-zinc-600 mt-3">
                You&apos;re not in the top {entries.length} yet —{" "}
                <span className="text-orange-400/70 font-semibold">play to climb!</span>
              </p>
            )}
          </>
        )}
      </div>

      {/* ── Keyframes (injected once) ── */}
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

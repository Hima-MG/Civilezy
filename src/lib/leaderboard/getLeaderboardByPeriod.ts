// ---------------------------------------------------------------------------
// getLeaderboardByPeriod — REAL-TIME Firestore listener for period boards
// ---------------------------------------------------------------------------

import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { LeaderboardPeriod, PeriodLeaderboardEntry } from "./types";
import { getPeriodKey } from "./periodKeys";

function collectionName(period: LeaderboardPeriod): string {
  return `leaderboard_${period}`;
}

/**
 * Subscribe to real-time leaderboard updates for a given period.
 *
 * Uses `onSnapshot` so the UI updates **instantly** when any player
 * finishes a game — no refresh or polling needed.
 *
 * Filters by current `periodKey` client-side to avoid needing a
 * Firestore composite index (`where` + `orderBy` on different fields).
 *
 * Automatically detects period rollovers (e.g. midnight for daily) and
 * re-subscribes with the new period key.
 *
 * Returns an `unsubscribe` function — call it when unmounting or
 * switching tabs.
 */
export function subscribeToPeriodLeaderboard(
  period: LeaderboardPeriod,
  max: number,
  onData: (entries: PeriodLeaderboardEntry[]) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  let currentKey = getPeriodKey(period);
  let cancelled = false;
  let activeUnsub: Unsubscribe | null = null;
  let rolloverTimer: ReturnType<typeof setInterval> | null = null;

  function startListener() {
    // Query: ordered by leaderboardMetric desc, grab extra to account
    // for stale entries from previous periods.
    const q = query(
      collection(db, collectionName(period)),
      orderBy("leaderboardMetric", "desc"),
      limit(max + 20),
    );

    activeUnsub = onSnapshot(
      q,
      (snap) => {
        if (cancelled) return;
        const entries: PeriodLeaderboardEntry[] = [];
        for (const d of snap.docs) {
          if (entries.length >= max) break;
          const data = d.data();
          // Only include docs from the current period
          if (data.periodKey !== currentKey) continue;
          entries.push({
            userId: data.userId ?? d.id,
            displayName: data.displayName ?? data.name ?? "Unknown",
            score: data.score ?? 0,
            xp: data.xp ?? data.totalXp ?? 0,
            gamesPlayed: data.gamesPlayed ?? 0,
            bestStreak: data.bestStreak ?? 0,
            leaderboardMetric: data.leaderboardMetric ?? data.xp ?? data.totalXp ?? 0,
          });
        }
        onData(entries);
      },
      (err) => {
        console.error(`[Leaderboard] ${period} listener error:`, err);
        onError?.(err);
      },
    );
  }

  // Start the initial listener
  startListener();

  // Check every 30s if the period has rolled over (e.g. midnight, new week)
  // and re-subscribe with the fresh key so stale data clears automatically.
  rolloverTimer = setInterval(() => {
    const newKey = getPeriodKey(period);
    if (newKey !== currentKey) {
      currentKey = newKey;
      if (activeUnsub) activeUnsub();
      startListener();
    }
  }, 30_000);

  // Return a cleanup function that tears down everything
  return () => {
    cancelled = true;
    if (rolloverTimer) clearInterval(rolloverTimer);
    if (activeUnsub) activeUnsub();
  };
}

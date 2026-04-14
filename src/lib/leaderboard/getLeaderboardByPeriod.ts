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
 * Returns an `unsubscribe` function — call it when unmounting or
 * switching tabs.
 */
export function subscribeToPeriodLeaderboard(
  period: LeaderboardPeriod,
  max: number,
  onData: (entries: PeriodLeaderboardEntry[]) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  const currentKey = getPeriodKey(period);

  // Query: ordered by totalXp desc, grab more than needed so client-side
  // filter for periodKey still yields enough results.
  const q = query(
    collection(db, collectionName(period)),
    orderBy("totalXp", "desc"),
    limit(max + 20), // over-fetch to account for stale entries
  );

  return onSnapshot(
    q,
    (snap) => {
      const entries: PeriodLeaderboardEntry[] = [];
      for (const d of snap.docs) {
        if (entries.length >= max) break;
        const data = d.data();
        // Only include docs from the current period
        if (data.periodKey !== currentKey) continue;
        entries.push({
          name: data.name ?? "Unknown",
          totalXp: data.totalXp ?? 0,
          gamesPlayed: data.gamesPlayed ?? 0,
          bestStreak: data.bestStreak ?? 0,
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

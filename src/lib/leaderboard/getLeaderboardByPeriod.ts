// ---------------------------------------------------------------------------
// getLeaderboardByPeriod — Firestore queries for period-based leaderboards
// ---------------------------------------------------------------------------

import {
  collection,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  getDocs,
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
 * Reads a snapshot of the entry array from Firestore docs.
 * Handles both old (name/totalXp) and new (displayName/xp/leaderboardMetric)
 * field names for backward compatibility.
 */
function docsToEntries(
  docs: { id: string; data: () => Record<string, unknown> }[],
): PeriodLeaderboardEntry[] {
  return docs.map((d) => {
    const data = d.data();
    const xpVal = (data.totalXp as number) ?? (data.xp as number) ?? 0;
    return {
      userId: (data.userId as string) ?? d.id,
      displayName: (data.displayName as string) ?? (data.name as string) ?? "Unknown",
      score: (data.score as number) ?? 0,
      xp: xpVal,
      gamesPlayed: (data.gamesPlayed as number) ?? 0,
      bestStreak: (data.bestStreak as number) ?? 0,
      leaderboardMetric: xpVal,
    };
  });
}

/**
 * Build a Firestore query that filters by periodKey server-side.
 *
 * Requires a composite index on (periodKey ASC, totalXp DESC) for each
 * leaderboard_* collection. Firestore will prompt you to create it on
 * first run — click the link in the console error.
 *
 * Server-side filtering means we only read documents from the current
 * period, not the entire collection.
 */
function buildPeriodQuery(period: LeaderboardPeriod, max: number) {
  const currentKey = getPeriodKey(period);
  return query(
    collection(db, collectionName(period)),
    where("periodKey", "==", currentKey),
    orderBy("totalXp", "desc"),
    firestoreLimit(max),
  );
}

/**
 * One-time fetch of the leaderboard for a given period.
 * Use this for pages that don't need live updates (e.g. homepage preview).
 * Costs exactly 1 read per document returned (no listener overhead).
 */
export async function fetchPeriodLeaderboard(
  period: LeaderboardPeriod,
  max: number = 20,
): Promise<PeriodLeaderboardEntry[]> {
  const q = buildPeriodQuery(period, max);
  const snap = await getDocs(q);
  return docsToEntries(snap.docs);
}

/**
 * Subscribe to real-time leaderboard updates for a given period.
 *
 * Uses `onSnapshot` so the UI updates **instantly** when any player
 * finishes a game — no refresh or polling needed.
 *
 * Uses server-side `where("periodKey", "==", ...)` so Firestore only
 * sends documents from the current period — no over-fetching.
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
  const q = buildPeriodQuery(period, max);

  return onSnapshot(
    q,
    (snap) => {
      onData(docsToEntries(snap.docs));
    },
    (err) => {
      console.error(`[Leaderboard] ${period} listener error:`, err);
      onError?.(err);
    },
  );
}

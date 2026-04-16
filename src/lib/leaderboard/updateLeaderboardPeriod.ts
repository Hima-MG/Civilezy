// ---------------------------------------------------------------------------
// updateLeaderboardPeriod — upserts XP into a time-windowed leaderboard
// ---------------------------------------------------------------------------

import {
  doc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { LeaderboardPeriod, UpdatePeriodInput } from "./types";
import { getPeriodKey } from "./periodKeys";

/**
 * Firestore collection name for a given period.
 *
 *   leaderboard_daily   / {playerId}
 *   leaderboard_weekly  / {playerId}
 *   leaderboard_monthly / {playerId}
 */
function collectionName(period: LeaderboardPeriod): string {
  return `leaderboard_${period}`;
}

/**
 * Upsert a player's score into one period leaderboard using a transaction
 * (atomic read-then-write, no race conditions).
 *
 * - If no document exists OR the existing doc has a stale `periodKey`,
 *   a fresh document is written (auto-reset on first write of new period).
 * - Otherwise the XP / score / gamesPlayed / bestStreak are accumulated.
 *
 * Uses Firebase Auth uid as document ID.
 */
export async function updateLeaderboardPeriod(
  period: LeaderboardPeriod,
  input: UpdatePeriodInput,
): Promise<void> {
  const col = collectionName(period);
  const ref = doc(db, col, input.uid);
  const currentKey = getPeriodKey(period);

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);

    if (snap.exists()) {
      const existing = snap.data();

      if (existing.periodKey === currentKey) {
        // Same period — accumulate
        const prevXp = existing.totalXp ?? existing.xp ?? 0;
        const prevScore = existing.score ?? 0;
        const newXp = prevXp + input.xpEarned;
        const newScore = prevScore + input.score;
        tx.set(ref, {
          name: input.displayName,
          totalXp: newXp,
          userId: input.uid,
          displayName: input.displayName,
          score: newScore,
          xp: newXp,
          leaderboardMetric: newXp,
          gamesPlayed: (existing.gamesPlayed ?? 0) + 1,
          bestStreak: Math.max(existing.bestStreak ?? 0, input.bestStreak),
          playedAt: serverTimestamp(),
          periodKey: currentKey,
          updatedAt: serverTimestamp(),
        });
        return;
      }
    }

    // New period or first entry — fresh document
    tx.set(ref, {
      name: input.displayName,
      totalXp: input.xpEarned,
      userId: input.uid,
      displayName: input.displayName,
      score: input.score,
      xp: input.xpEarned,
      leaderboardMetric: input.xpEarned,
      gamesPlayed: 1,
      bestStreak: input.bestStreak,
      playedAt: serverTimestamp(),
      periodKey: currentKey,
      updatedAt: serverTimestamp(),
    });
  });
}

/**
 * Convenience: update all three period leaderboards in parallel.
 * Called once after every game save.
 *
 * Uses Promise.all so that ANY failure propagates to the caller —
 * the save handler can then show the user a real error instead of
 * silently swallowing it.
 */
export async function updateAllPeriodLeaderboards(
  input: UpdatePeriodInput,
): Promise<void> {
  await Promise.all([
    updateLeaderboardPeriod("daily", input),
    updateLeaderboardPeriod("weekly", input),
    updateLeaderboardPeriod("monthly", input),
  ]);
}

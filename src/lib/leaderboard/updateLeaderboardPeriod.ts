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

/** Stable document ID derived from player name */
function toDocId(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, "-");
}

/**
 * Upsert a player's score into one period leaderboard using a transaction
 * (atomic read-then-write, no race conditions).
 *
 * - If no document exists OR the existing doc has a stale `periodKey`,
 *   a fresh document is written (auto-reset on first write of new period).
 * - Otherwise the XP / score / gamesPlayed / bestStreak are accumulated.
 *
 * Writes BOTH legacy field names (name, totalXp) and new field names
 * (userId, displayName, xp, score, leaderboardMetric, playedAt) so that
 * existing queries and new queries both work correctly.
 */
export async function updateLeaderboardPeriod(
  period: LeaderboardPeriod,
  input: UpdatePeriodInput,
): Promise<void> {
  const docId = toDocId(input.playerName);
  const col = collectionName(period);
  const ref = doc(db, col, docId);
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
          // Legacy fields (backward compat)
          name: input.playerName.trim(),
          totalXp: newXp,
          // New fields
          userId: docId,
          displayName: input.playerName.trim(),
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
      // Legacy fields (backward compat)
      name: input.playerName.trim(),
      totalXp: input.xpEarned,
      // New fields
      userId: docId,
      displayName: input.playerName.trim(),
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
 */
export async function updateAllPeriodLeaderboards(
  input: UpdatePeriodInput,
): Promise<void> {
  const results = await Promise.allSettled([
    updateLeaderboardPeriod("daily", input),
    updateLeaderboardPeriod("weekly", input),
    updateLeaderboardPeriod("monthly", input),
  ]);

  // Log any failures so they're visible in the browser console
  for (const r of results) {
    if (r.status === "rejected") {
      console.error("[Leaderboard] Period update failed:", r.reason);
    }
  }
}

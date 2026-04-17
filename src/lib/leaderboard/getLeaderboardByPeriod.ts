// ---------------------------------------------------------------------------
// getLeaderboardByPeriod — Firestore queries for period-based leaderboards
// ---------------------------------------------------------------------------

import {
  collection,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  startAfter,
  getDocs,
  onSnapshot,
  type QueryDocumentSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { LeaderboardPeriod, PeriodLeaderboardEntry } from "./types";
import { getPeriodKey } from "./periodKeys";

function collectionName(period: LeaderboardPeriod): string {
  return `leaderboard_${period}`;
}

/**
 * Normalise a raw Firestore document into a typed entry.
 * Handles both old field names (name/xp) and new ones (displayName/totalXp).
 */
function docToEntry(
  d: QueryDocumentSnapshot,
): PeriodLeaderboardEntry {
  const data = d.data();
  const xpVal = (data.totalXp as number) ?? (data.xp as number) ?? 0;
  return {
    userId:            (data.userId      as string) ?? d.id,
    displayName:       (data.displayName as string) ?? (data.name as string) ?? "Unknown",
    score:             (data.score       as number) ?? 0,
    xp:                xpVal,
    gamesPlayed:       (data.gamesPlayed as number) ?? 0,
    bestStreak:        (data.bestStreak  as number) ?? 0,
    leaderboardMetric: xpVal,
  };
}

function docsToEntries(docs: QueryDocumentSnapshot[]): PeriodLeaderboardEntry[] {
  return docs.map(docToEntry);
}

/**
 * Build the base Firestore query for a period's leaderboard.
 *
 * Requires a composite index on (periodKey ASC, totalXp DESC).
 * Firestore will show a link in the console to create it on first run.
 */
function buildPeriodQuery(
  period: LeaderboardPeriod,
  max: number,
  after?: QueryDocumentSnapshot,
) {
  const currentKey = getPeriodKey(period);
  const constraints = [
    where("periodKey", "==", currentKey),
    orderBy("totalXp", "desc"),
    firestoreLimit(max),
  ] as Parameters<typeof query>[1][];

  if (after) constraints.push(startAfter(after));

  return query(collection(db, collectionName(period)), ...constraints);
}

// ---------------------------------------------------------------------------
// Real-time subscriber — first page
// ---------------------------------------------------------------------------

/**
 * Subscribe to real-time updates for the first `max` entries of a period.
 *
 * The callback receives both the typed entries **and** the raw cursor doc
 * (`lastDoc`) needed to start the next page with `fetchNextLeaderboardPage`.
 *
 * Returns an `unsubscribe` function — call it on unmount or tab-switch.
 */
export function subscribeToPeriodLeaderboard(
  period: LeaderboardPeriod,
  max: number,
  onData: (
    entries: PeriodLeaderboardEntry[],
    lastDoc: QueryDocumentSnapshot | null,
  ) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  const q = buildPeriodQuery(period, max);

  return onSnapshot(
    q,
    (snap) => {
      const lastDoc = snap.docs[snap.docs.length - 1] ?? null;
      onData(docsToEntries(snap.docs), lastDoc);
    },
    (err) => {
      console.error(`[Leaderboard] ${period} listener error:`, err);
      onError?.(err);
    },
  );
}

// ---------------------------------------------------------------------------
// Cursor-based pagination — subsequent pages
// ---------------------------------------------------------------------------

/**
 * Fetch the next page of leaderboard entries using a cursor.
 *
 * Usage:
 *   const { entries, lastDoc } = await fetchNextLeaderboardPage(
 *     "daily", 10, cursorDocFromPreviousPage
 *   );
 *
 * Pass the returned `lastDoc` as `after` for the following page.
 * Returns `hasMore: true` if `entries.length === pageSize` (more may exist).
 */
export async function fetchNextLeaderboardPage(
  period: LeaderboardPeriod,
  pageSize: number,
  after: QueryDocumentSnapshot,
): Promise<{
  entries:  PeriodLeaderboardEntry[];
  lastDoc:  QueryDocumentSnapshot | null;
  hasMore:  boolean;
}> {
  const q = buildPeriodQuery(period, pageSize, after);
  const snap = await getDocs(q);
  return {
    entries: docsToEntries(snap.docs),
    lastDoc: snap.docs[snap.docs.length - 1] ?? null,
    hasMore: snap.docs.length >= pageSize,
  };
}

// ---------------------------------------------------------------------------
// One-time fetch helper (homepage preview, SSR, etc.)
// ---------------------------------------------------------------------------

/**
 * Single snapshot fetch — no real-time listener overhead.
 * Use for server components or pages that don't need live updates.
 */
export async function fetchPeriodLeaderboard(
  period: LeaderboardPeriod,
  max: number = 20,
): Promise<PeriodLeaderboardEntry[]> {
  const snap = await getDocs(buildPeriodQuery(period, max));
  return docsToEntries(snap.docs);
}

// ---------------------------------------------------------------------------
// Period key helpers — deterministic keys for daily / weekly / monthly windows
// ---------------------------------------------------------------------------

import type { LeaderboardPeriod } from "./types";

/**
 * Returns a deterministic string key for the current period window.
 *
 *  - daily   → "2026-04-14"            (ISO date)
 *  - weekly  → "2026-W16"              (ISO week starting Monday)
 *  - monthly → "2026-04"               (year-month)
 *
 * These keys are stored on each leaderboard document so stale entries
 * from a previous period are easy to identify and ignore/purge.
 */
export function getPeriodKey(period: LeaderboardPeriod, now = new Date()): string {
  switch (period) {
    case "daily":
      return toISODate(now);
    case "weekly":
      return toISOWeek(now);
    case "monthly":
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  }
}

/** Milliseconds remaining until the current period resets */
export function msUntilReset(period: LeaderboardPeriod, now = new Date()): number {
  switch (period) {
    case "daily":
      return nextMidnight(now) - now.getTime();
    case "weekly":
      return nextMonday(now) - now.getTime();
    case "monthly":
      return nextFirstOfMonth(now) - now.getTime();
  }
}

// ── Internal helpers ───────────────────────────────────────────────────────

function toISODate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function toISOWeek(d: Date): string {
  // ISO 8601: Week starts on Monday. The week containing Jan 4 is week 1.
  const tmp = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  tmp.setUTCDate(tmp.getUTCDate() + 4 - (tmp.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((tmp.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
  return `${tmp.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

function nextMidnight(now: Date): number {
  const d = new Date(now);
  d.setHours(24, 0, 0, 0);
  return d.getTime();
}

function nextMonday(now: Date): number {
  const d = new Date(now);
  const day = d.getDay(); // 0 = Sun … 6 = Sat
  const daysUntilMon = day === 0 ? 1 : 8 - day;
  d.setDate(d.getDate() + daysUntilMon);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function nextFirstOfMonth(now: Date): number {
  const d = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0);
  return d.getTime();
}

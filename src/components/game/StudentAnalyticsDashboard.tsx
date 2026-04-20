"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getLevel, getNextLevel } from "@/lib/leaderboard";
import {
  fetchUserAnalytics,
  fetchUserReports,
  fetchUserRank,
  type UserAnalytics,
  type UserReportStats,
} from "@/lib/analytics";

// ─── Mini Bar Chart ───────────────────────────────────────────────────────────

function MiniBarChart({
  data,
  mode,
}: {
  data: Array<{ label: string; value: number; date: string }>;
  mode: "accuracy" | "xp";
}) {
  const max = Math.max(...data.map(d => d.value), 1);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="flex items-end gap-1.5" style={{ height: "96px" }}>
      {data.map((d, i) => {
        const heightPct = d.value > 0 ? Math.max((d.value / max) * 100, 8) : 2;
        const isToday = d.date === today;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
            {/* Tooltip */}
            {d.value > 0 && (
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-zinc-800 border border-zinc-700 text-zinc-300 text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                {mode === "accuracy" ? `${d.value}%` : `${d.value} XP`}
              </div>
            )}
            {/* Bar container */}
            <div className="w-full flex-1 flex items-end">
              <div
                className={`w-full rounded-t transition-all duration-700 ${
                  isToday
                    ? "bg-gradient-to-t from-orange-500 to-amber-400 shadow-[0_0_8px_rgba(255,150,0,0.4)]"
                    : d.value > 0
                    ? "bg-zinc-700"
                    : "bg-zinc-800/60"
                }`}
                style={{ height: `${heightPct}%` }}
              />
            </div>
            <span
              className={`text-[10px] leading-none ${
                isToday ? "text-orange-400 font-bold" : "text-zinc-600"
              }`}
            >
              {d.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Subject Bar ──────────────────────────────────────────────────────────────

function SubjectBar({
  subject,
  accuracy,
  total,
  isWeak,
}: {
  subject: string;
  accuracy: number;
  total: number;
  isWeak: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          {isWeak && (
            <span className="text-rose-400 text-xs shrink-0" title="Weak area">
              ⚠
            </span>
          )}
          <span className="text-sm text-zinc-300 truncate">{subject}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-zinc-600">{total}Q</span>
          <span
            className={`text-sm font-bold w-10 text-right ${
              isWeak
                ? "text-rose-400"
                : accuracy >= 80
                ? "text-emerald-400"
                : "text-amber-400"
            }`}
          >
            {accuracy}%
          </span>
        </div>
      </div>
      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            isWeak
              ? "bg-gradient-to-r from-rose-600 to-rose-400"
              : accuracy >= 80
              ? "bg-gradient-to-r from-emerald-600 to-emerald-400"
              : "bg-gradient-to-r from-amber-600 to-amber-400"
          }`}
          style={{ width: `${accuracy}%` }}
        />
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  sub,
  accent = "orange",
}: {
  icon: string;
  label: string;
  value: string | number;
  sub?: string;
  accent?: "orange" | "amber" | "emerald" | "sky" | "rose";
}) {
  const styles: Record<string, string> = {
    orange: "text-orange-400 bg-orange-500/8 border-orange-500/20",
    amber: "text-amber-400 bg-amber-500/8 border-amber-500/20",
    emerald: "text-emerald-400 bg-emerald-500/8 border-emerald-500/20",
    sky: "text-sky-400 bg-sky-500/8 border-sky-500/20",
    rose: "text-rose-400 bg-rose-500/8 border-rose-500/20",
  };
  const cls = styles[accent];
  const textCls = cls.split(" ")[0];
  return (
    <div
      className={`rounded-xl p-4 border flex flex-col gap-1.5 ${cls}`}
      style={{ background: "rgba(0,0,0,0.25)" }}
    >
      <span className="text-xl">{icon}</span>
      <span className={`text-2xl font-extrabold leading-none ${textCls}`}>{value}</span>
      <span className="text-xs text-zinc-400 font-medium leading-tight">{label}</span>
      {sub && <span className="text-[11px] text-zinc-600 leading-tight">{sub}</span>}
    </div>
  );
}

// ─── Insight Card ─────────────────────────────────────────────────────────────

function InsightCard({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
      <p className="text-sm leading-relaxed text-zinc-300">{text}</p>
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">
        {title}
      </h2>
      {right}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

interface Props {
  onBack: () => void;
}

export default function StudentAnalyticsDashboard({ onBack }: Props) {
  const { user, profile } = useAuth();
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [reports, setReports] = useState<UserReportStats | null>(null);
  const [rank, setRank] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [chartMode, setChartMode] = useState<"accuracy" | "xp">("accuracy");

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [a, r, rk] = await Promise.all([
        fetchUserAnalytics(user.uid),
        fetchUserReports(user.uid),
        fetchUserRank(user.uid),
      ]);
      setAnalytics(a);
      setReports(r);
      setRank(rk);
    } catch {
      // silently fail — UI shows empty states
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  // ── Level / XP ──
  const totalScore = profile?.totalScore ?? 0;
  const totalXp = profile?.totalXp ?? 0;
  const streak = profile?.streak ?? 0;
  const level = getLevel(totalScore);
  const nextLevel = getNextLevel(totalScore);
  const xpToNext = nextLevel ? nextLevel.threshold - totalScore : null;
  const levelPct = nextLevel
    ? Math.min(
        100,
        Math.round(
          ((totalScore - level.threshold) / (nextLevel.threshold - level.threshold)) * 100,
        ),
      )
    : 100;

  // ── Smart Insights ──
  const insights: string[] = [];
  if (analytics) {
    if (analytics.accuracy >= 80)
      insights.push(
        "🔥 Outstanding accuracy! You're answering 8 out of 10 questions correctly. PSC-ready!",
      );
    else if (analytics.accuracy >= 60)
      insights.push(
        "👍 Good progress! Focus on your weak subjects to push accuracy above 80%.",
      );
    else if (analytics.totalQuestions > 0)
      insights.push(
        "📘 Keep practicing! Consistency is the key — aim for at least one game every day.",
      );

    if (streak >= 7)
      insights.push(
        `🔥 ${streak}-day streak! Incredible discipline — you're building a powerful study habit.`,
      );
    else if (streak >= 3)
      insights.push(`⚡ ${streak}-day streak! Keep going — daily practice compounds fast.`);
    else if (streak === 0 && analytics.totalQuestions > 0)
      insights.push(
        "📅 No active streak. Play one game today to start building your consistency streak!",
      );

    if (analytics.weakestSubject)
      insights.push(
        `📉 Weakest area: "${analytics.weakestSubject}". Dedicate your next session to this subject.`,
      );

    if (rank > 0 && rank <= 10)
      insights.push(
        `🏆 Elite rank! You're #${rank} on the all-time leaderboard — you're in the top tier.`,
      );
    else if (rank > 10 && rank <= 50)
      insights.push(`📈 Ranked #${rank}. Play more games to crack the top 10!`);
  }

  // ── Chart data ──
  const chartData = (analytics?.dailyTrend ?? []).map(d => ({
    label: d.label,
    date: d.date,
    value: chartMode === "accuracy" ? d.accuracy : d.xp,
  }));

  const hasActivity = analytics?.dailyTrend.some(d => d.accuracy > 0 || d.xp > 0);

  const BG = (
    <div
      className="absolute inset-0 opacity-[0.03] pointer-events-none"
      style={{
        backgroundImage:
          "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    />
  );

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {BG}
      <div className="relative z-10 max-w-3xl mx-auto px-4 py-8 pb-16">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-7">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-sm transition-colors group"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
            Back to Game
          </button>
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5">
            <span className="text-orange-400 text-xs font-semibold tracking-widest uppercase">
              Analytics
            </span>
          </div>
          <button
            onClick={load}
            disabled={loading}
            className="text-zinc-600 hover:text-zinc-300 text-sm transition-colors disabled:opacity-40"
            title="Refresh data"
          >
            {loading ? (
              <span className="inline-block w-3.5 h-3.5 border border-zinc-500 border-t-zinc-300 rounded-full animate-spin" />
            ) : (
              "↻ Refresh"
            )}
          </button>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-1">
          <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
            📊 Your Dashboard
          </span>
        </h1>
        <p className="text-zinc-500 text-sm text-center mb-8">
          {profile?.displayName || user?.displayName || "Player"}
          {analytics && ` · ${analytics.gamesPlayed} game${analytics.gamesPlayed !== 1 ? "s" : ""} played`}
        </p>

        {loading ? (
          <div className="flex flex-col items-center gap-4 py-20">
            <span className="inline-block w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
            <p className="text-zinc-400 text-sm">Loading your analytics…</p>
          </div>
        ) : (
          <div className="space-y-5">

            {/* ════════════════════════════════════════
                1. OVERVIEW
            ════════════════════════════════════════ */}
            <section>
              <SectionHeader title="Overview" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <StatCard
                  icon="🎯"
                  label="Total Questions"
                  value={(analytics?.totalQuestions ?? 0).toLocaleString()}
                  accent="orange"
                />
                <StatCard
                  icon="✅"
                  label="Correct Answers"
                  value={(analytics?.correctAnswers ?? 0).toLocaleString()}
                  accent="emerald"
                />
                <StatCard
                  icon="📊"
                  label="Accuracy"
                  value={`${analytics?.accuracy ?? 0}%`}
                  sub={
                    !analytics?.totalQuestions
                      ? "Play games to track"
                      : analytics.accuracy >= 80
                      ? "Excellent!"
                      : analytics.accuracy >= 60
                      ? "Good progress"
                      : "Needs practice"
                  }
                  accent={
                    !analytics?.accuracy
                      ? "sky"
                      : analytics.accuracy >= 80
                      ? "emerald"
                      : analytics.accuracy >= 60
                      ? "amber"
                      : "rose"
                  }
                />
                <StatCard
                  icon="⚡"
                  label="Total XP"
                  value={totalXp.toLocaleString()}
                  accent="amber"
                />
                <StatCard
                  icon="🔥"
                  label="Daily Streak"
                  value={`${streak} day${streak !== 1 ? "s" : ""}`}
                  sub={streak === 0 ? "Play today!" : streak >= 7 ? "On fire!" : "Keep it up!"}
                  accent={streak >= 7 ? "orange" : streak >= 3 ? "amber" : "sky"}
                />
                <StatCard
                  icon="🎮"
                  label="Games Played"
                  value={(analytics?.gamesPlayed ?? 0).toLocaleString()}
                  accent="sky"
                />
              </div>
            </section>

            {/* ════════════════════════════════════════
                2 + 3. SUBJECT PERFORMANCE + WEAK AREA
            ════════════════════════════════════════ */}
            {analytics && analytics.subjectStats.length > 0 ? (
              <section className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 backdrop-blur-sm">
                <SectionHeader
                  title="Subject Performance"
                  right={
                    analytics.weakestSubject ? (
                      <span className="text-[11px] font-medium text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-full leading-none">
                        ⚠ Weak: {analytics.weakestSubject.split(" ").slice(0, 3).join(" ")}
                      </span>
                    ) : null
                  }
                />
                <div className="space-y-4">
                  {analytics.subjectStats.slice(0, 9).map(s => (
                    <SubjectBar
                      key={s.subject}
                      subject={s.subject}
                      accuracy={s.accuracy}
                      total={s.total}
                      isWeak={s.isWeak}
                    />
                  ))}
                </div>
                {analytics.subjectStats.length > 9 && (
                  <p className="text-[11px] text-zinc-600 mt-4 text-center">
                    +{analytics.subjectStats.length - 9} more subjects tracked
                  </p>
                )}

                {/* Legend */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-zinc-800/60">
                  {[
                    { color: "bg-emerald-500", label: "≥80% Strong" },
                    { color: "bg-amber-500", label: "50–79% Average" },
                    { color: "bg-rose-500", label: "<50% Weak" },
                  ].map(l => (
                    <div key={l.label} className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${l.color}`} />
                      <span className="text-[10px] text-zinc-600">{l.label}</span>
                    </div>
                  ))}
                </div>
              </section>
            ) : (
              analytics && (
                <section className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 text-center">
                  <SectionHeader title="Subject Performance" />
                  <p className="text-zinc-600 text-sm py-4">
                    No subject data yet. Play a game to see your performance breakdown!
                  </p>
                </section>
              )
            )}

            {/* ════════════════════════════════════════
                4. REPORTED QUESTIONS
            ════════════════════════════════════════ */}
            <section className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 backdrop-blur-sm">
              <SectionHeader title="Reported Questions" />
              {reports && reports.total > 0 ? (
                <>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="text-center bg-zinc-800/50 rounded-xl py-4">
                      <div className="text-2xl font-extrabold text-white">{reports.total}</div>
                      <div className="text-[11px] text-zinc-500 mt-1">Total</div>
                    </div>
                    <div className="text-center bg-emerald-500/8 border border-emerald-500/15 rounded-xl py-4">
                      <div className="text-2xl font-extrabold text-emerald-400">
                        {reports.resolved}
                      </div>
                      <div className="text-[11px] text-zinc-500 mt-1">Resolved</div>
                    </div>
                    <div className="text-center bg-amber-500/8 border border-amber-500/15 rounded-xl py-4">
                      <div className="text-2xl font-extrabold text-amber-400">
                        {reports.pending}
                      </div>
                      <div className="text-[11px] text-zinc-500 mt-1">Pending</div>
                    </div>
                  </div>
                  {/* Resolution progress bar */}
                  {reports.total > 0 && (
                    <div>
                      <div className="flex justify-between text-[10px] text-zinc-600 mb-1">
                        <span>Resolution rate</span>
                        <span>{Math.round((reports.resolved / reports.total) * 100)}%</span>
                      </div>
                      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-700"
                          style={{
                            width: `${Math.round((reports.resolved / reports.total) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-zinc-600 text-center py-4">
                  No questions reported yet. Use the{" "}
                  <span className="text-zinc-400">🚩 Report</span> button during a quiz to flag
                  issues.
                </p>
              )}
            </section>

            {/* ════════════════════════════════════════
                5. PERFORMANCE TREND
            ════════════════════════════════════════ */}
            <section className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 backdrop-blur-sm">
              <SectionHeader
                title="Last 7 Days"
                right={
                  <div className="flex gap-1">
                    {(["accuracy", "xp"] as const).map(m => (
                      <button
                        key={m}
                        onClick={() => setChartMode(m)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all ${
                          chartMode === m
                            ? "bg-orange-500/15 text-orange-400 border border-orange-500/25"
                            : "text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        {m === "accuracy" ? "Accuracy %" : "XP Earned"}
                      </button>
                    ))}
                  </div>
                }
              />

              {hasActivity ? (
                <div className="mt-5 pt-5">
                  <MiniBarChart data={chartData} mode={chartMode} />
                  <p className="text-[10px] text-zinc-600 text-center mt-2">
                    {chartMode === "accuracy" ? "Daily accuracy %" : "XP earned per day"} ·{" "}
                    <span className="text-orange-400">Today highlighted</span>
                  </p>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <div className="flex items-end justify-center gap-1.5 mb-4" style={{ height: "60px" }}>
                    {[20, 40, 15, 60, 30, 45, 10].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 max-w-[28px] bg-zinc-800/60 rounded-t"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                  <p className="text-zinc-600 text-sm">No activity in the last 7 days.</p>
                  <p className="text-zinc-700 text-xs mt-1">
                    Play a game to see your trend chart!
                  </p>
                </div>
              )}
            </section>

            {/* ════════════════════════════════════════
                6. SMART INSIGHTS
            ════════════════════════════════════════ */}
            {insights.length > 0 && (
              <section>
                <SectionHeader title="Smart Insights" />
                <div className="space-y-2">
                  {insights.map((text, i) => (
                    <InsightCard key={i} text={text} />
                  ))}
                </div>
              </section>
            )}

            {/* ════════════════════════════════════════
                7. RANK + PROGRESS
            ════════════════════════════════════════ */}
            <section className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 backdrop-blur-sm">
              <SectionHeader title="Rank & Progress" />
              <div className="grid grid-cols-2 gap-4 mb-5">
                {/* Level */}
                <div
                  className={`text-center rounded-xl p-4 border ${level.bgColor} ${level.borderColor}`}
                >
                  <div className="text-3xl mb-1.5">{level.icon}</div>
                  <div className={`text-base font-extrabold ${level.color}`}>{level.label}</div>
                  <div className="text-[11px] text-zinc-500 mt-1">Current Level</div>
                </div>
                {/* Rank */}
                <div className="text-center bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
                  <div className="text-3xl font-extrabold text-white mb-1.5">
                    {rank > 0 ? `#${rank}` : "—"}
                  </div>
                  <div className="text-xs text-zinc-500">All-Time Rank</div>
                  {rank > 0 && rank <= 3 && (
                    <div className="text-[11px] text-amber-400 mt-1 font-semibold">
                      {rank === 1 ? "🥇 Champion" : rank === 2 ? "🥈 Runner-up" : "🥉 Top 3"}
                    </div>
                  )}
                  {rank === 0 && (
                    <div className="text-[11px] text-zinc-600 mt-1">Play to get ranked</div>
                  )}
                </div>
              </div>

              {/* XP Progress bar */}
              {nextLevel ? (
                <>
                  <div className="flex justify-between text-[11px] mb-1.5">
                    <span className={level.color}>{level.label}</span>
                    <span className="text-zinc-500">
                      {xpToNext?.toLocaleString()} XP to {nextLevel.label} {nextLevel.icon}
                    </span>
                  </div>
                  <div className="h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-700 relative"
                      style={{ width: `${levelPct}%` }}
                    >
                      <div className="absolute inset-0 bg-white/10 rounded-full" />
                    </div>
                  </div>
                  <div className="flex justify-between text-[10px] text-zinc-600 mt-1.5">
                    <span>{totalScore.toLocaleString()} XP</span>
                    <span>{nextLevel.threshold.toLocaleString()} XP</span>
                  </div>
                </>
              ) : (
                <div className="text-center py-3">
                  <span className="text-amber-400 font-bold text-sm">
                    🏆 Maximum Level Reached!
                  </span>
                  <p className="text-zinc-600 text-xs mt-1">
                    Total XP: {totalScore.toLocaleString()}
                  </p>
                </div>
              )}
            </section>

            {/* ════════════════════════════════════════
                8. PRACTICE CTA
            ════════════════════════════════════════ */}
            {analytics?.weakestSubject ? (
              <section
                className="rounded-2xl p-5 border border-orange-500/20 relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,98,0,0.07), rgba(255,183,71,0.04))",
                }}
              >
                {/* Glow */}
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-orange-500/8 blur-3xl pointer-events-none" />

                <div className="text-xs font-bold tracking-widest text-orange-400/70 uppercase mb-2">
                  Recommended Practice
                </div>
                <h3 className="text-lg font-extrabold text-white mb-1.5">
                  Focus on{" "}
                  <span className="text-orange-400">{analytics.weakestSubject}</span>
                </h3>
                <p className="text-zinc-500 text-sm mb-4 leading-relaxed">
                  Your accuracy in this subject is below 50%. A focused session can rapidly boost
                  your overall score and leaderboard rank.
                </p>
                <button
                  onClick={onBack}
                  className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-400 text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105 active:scale-100 transition-all duration-200"
                >
                  🚀 Start Practice Session
                </button>
              </section>
            ) : analytics && analytics.totalQuestions === 0 ? (
              /* No data empty state */
              <section className="text-center py-10 bg-zinc-900/60 border border-zinc-800 rounded-2xl">
                <div className="text-5xl mb-4">🎮</div>
                <p className="text-white font-semibold text-lg mb-1">No game data yet</p>
                <p className="text-zinc-500 text-sm mb-5">
                  Play your first game to start tracking your performance!
                </p>
                <button
                  onClick={onBack}
                  className="bg-gradient-to-r from-orange-500 to-amber-400 text-white font-bold px-7 py-3 rounded-xl text-sm shadow-lg shadow-orange-500/25 hover:scale-105 transition-all duration-200"
                >
                  🚀 Start Playing
                </button>
              </section>
            ) : null}

          </div>
        )}
      </div>
    </main>
  );
}

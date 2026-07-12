"use client";

import { useEffect, useRef, useState } from "react";
import type { Progression } from "@/core/gamification/levels";
import type { Badge } from "@/core/gamification/badges";

const RANK_COUNT = 5;

interface HunterStatusPanelProps {
  progression: Progression;
  badges: Badge[];
}

// RPG-styled "hunter status window" for the quest board only. Reads live
// progression/badges from the pure gamification modules (no math here) and
// layers on a dark/neon presentation plus a transient rank-up flash. The
// calm readiness report sections are untouched by this styling.
export function HunterStatusPanel({
  progression,
  badges,
}: HunterStatusPanelProps) {
  const previousRankIndex = useRef(progression.rankIndex);
  const [showRankUp, setShowRankUp] = useState(false);

  useEffect(() => {
    if (progression.rankIndex > previousRankIndex.current) {
      setShowRankUp(true);
      const timer = setTimeout(() => setShowRankUp(false), 2000);
      previousRankIndex.current = progression.rankIndex;
      return () => clearTimeout(timer);
    }
    previousRankIndex.current = progression.rankIndex;
  }, [progression.rankIndex]);

  const level = progression.rankIndex + 1;

  return (
    <section
      className="relative overflow-hidden rounded-lg border border-[#2a3550] bg-[#0b1020] p-6 text-white shadow-[0_0_40px_rgba(56,189,248,0.08)]"
      aria-label="Hunter status"
    >
      {showRankUp ? (
        <div
          role="status"
          aria-live="polite"
          className="animate-[hunter-rankup-fade_2s_ease-out_forwards] motion-reduce:animate-none pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-1 bg-[#0b1020]/95 text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">
            Rank Up
          </span>
          <span className="text-2xl font-extrabold tracking-wide text-white drop-shadow-[0_0_12px_rgba(56,189,248,0.65)] motion-reduce:drop-shadow-none">
            {progression.rankName}
          </span>
          <span className="text-xs text-sky-200/80">
            Level {level} / {RANK_COUNT} reached
          </span>
        </div>
      ) : null}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-300/90">
            Hunter Rank
          </p>
          <h2 className="mt-1 text-xl font-extrabold tracking-wide text-white">
            {progression.rankName}
          </h2>
        </div>
        <div className="rounded-md border border-sky-400/30 bg-sky-400/10 px-3 py-1.5 text-right">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-300/80">
            Level
          </p>
          <p className="text-sm font-bold text-white">
            {level} / {RANK_COUNT}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-xs font-medium text-sky-100/80">
          <span>Experience</span>
          <span>
            {progression.earnedXp} / {progression.totalXp} xp (
            {progression.percent}%)
          </span>
        </div>
        <div
          className="mt-2 h-4 w-full overflow-hidden rounded-full border border-sky-400/20 bg-[#141b33]"
          role="progressbar"
          aria-valuenow={progression.percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Experience progress toward next rank"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400 shadow-[0_0_14px_rgba(56,189,248,0.55)] transition-[width] duration-700 ease-out motion-reduce:transition-none"
            style={{ width: `${progression.percent}%` }}
          />
        </div>
      </div>

      <div className="mt-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-300/70">
          Milestone badges
        </p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {badges.map((badge) => (
            <li
              key={badge.id}
              className={
                badge.earned
                  ? "rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.35)]"
                  : "flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/40"
              }
              aria-label={`${badge.name}: ${badge.earned ? "earned" : "locked"}`}
            >
              {badge.earned ? null : (
                <span aria-hidden="true" className="text-[10px]">
                  🔒
                </span>
              )}
              {badge.name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

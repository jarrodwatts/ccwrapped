"use client";

import { motion } from "motion/react";
import type { WrappedPayload } from "@/lib/types";
import { formatNumber } from "@/lib/format";

interface StreakCardProps {
  payload: WrappedPayload;
}

const STREAK_STATS = [
  { key: "longest", label: "LONGEST STREAK", unit: "consecutive days", primary: true },
  { key: "current", label: "CURRENT STREAK", unit: "days", primary: true },
  { key: "activeDays", label: "ACTIVE DAYS", unit: "total", primary: false },
  { key: "longestSession", label: "LONGEST SESSION", unit: "marathon", primary: false },
] as const;

export function StreakCard({ payload }: StreakCardProps) {
  const { current, longest, totalActiveDays } = payload.streaks;
  const longestSessionHours = Math.floor(
    payload.highlights.longestSessionMinutes / 60
  );
  const longestSessionMins = payload.highlights.longestSessionMinutes % 60;

  const values: Record<string, string | number> = {
    longest,
    current,
    activeDays: formatNumber(totalActiveDays),
    longestSession: `${longestSessionHours}h${longestSessionMins}m`,
  };

  return (
    <div className="relative flex h-full flex-col items-center justify-center px-6">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-30" />

      <motion.div
        className="relative z-10 mb-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <span className="label">Streaks & Endurance</span>
      </motion.div>

      <div className="relative z-10 grid w-full max-w-md grid-cols-2 gap-4">
        {STREAK_STATS.map((stat, i) => (
          <motion.div
            key={stat.key}
            className="card-industrial flex flex-col gap-2 p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 * i, duration: 0.5 }}
          >
            <span className="label">{stat.label}</span>
            <span className={`text-4xl sm:text-5xl ${stat.primary ? "stat-value" : "font-bold text-text-primary"}`}>
              {values[stat.key]}
            </span>
            <span className="text-xs text-text-muted">{stat.unit}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

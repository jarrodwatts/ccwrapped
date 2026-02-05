"use client";

import { motion } from "motion/react";
import type { WrappedPayload } from "@/lib/types";
import { formatNumber } from "@/lib/format";
import { TerminalLabel } from "@/components/ui/terminal-label";

interface StreakCardProps {
  payload: WrappedPayload;
}

const STREAK_STATS = [
  { key: "longest", label: "LONGEST", unit: "consecutive days", highlight: true },
  { key: "current", label: "CURRENT", unit: "days", highlight: false },
  { key: "activeDays", label: "ACTIVE DAYS", unit: "total", highlight: false },
  { key: "longestSession", label: "MARATHON", unit: "single session", highlight: false },
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
      <motion.div
        className="relative z-10 mb-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <TerminalLabel variant="bracket">STREAKS</TerminalLabel>
      </motion.div>

      {/* Grid with structural lines */}
      <div className="relative z-10 w-full max-w-md">
        {/* Corner markers */}
        <span className="absolute -top-2 -left-2 font-mono text-xs text-text-muted">+</span>
        <span className="absolute -top-2 -right-2 font-mono text-xs text-text-muted">+</span>
        <span className="absolute -bottom-2 -left-2 font-mono text-xs text-text-muted">+</span>
        <span className="absolute -bottom-2 -right-2 font-mono text-xs text-text-muted">+</span>

        <div className="grid grid-cols-2 border border-line divide-x divide-y divide-line">
          {STREAK_STATS.map((stat, i) => (
            <motion.div
              key={stat.key}
              className="flex flex-col gap-1 p-5 bg-background"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="label text-text-muted text-[10px]">{stat.label}</span>
              <span
                className={`font-mono text-3xl sm:text-4xl font-bold tabular-nums ${
                  stat.highlight ? "text-primary" : "text-text-primary"
                }`}
              >
                {stat.highlight && <span className="mr-1">🔥</span>}
                {values[stat.key]}
              </span>
              <span className="text-[10px] text-text-muted">{stat.unit}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.p
        className="relative z-10 mt-6 font-mono text-xs text-text-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        // consistency is the superpower
      </motion.p>
    </div>
  );
}

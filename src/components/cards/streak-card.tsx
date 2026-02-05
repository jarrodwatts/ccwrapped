"use client";

import { motion } from "motion/react";
import type { CardProps } from "@/lib/types";
import { buildHeatmap, getIntensityLevel } from "@/lib/heatmap";
import { formatDate } from "@/lib/format";

const INTENSITY_COLORS = [
  "bg-white/5",
  "bg-[#D97757]/25",
  "bg-[#D97757]/50",
  "bg-[#D97757]/75",
  "bg-[#D97757]",
] as const;

export function StreakCard({ payload }: CardProps) {
  const { highlights, timePatterns } = payload;
  const heatmapDays = buildHeatmap(timePatterns.dailyActivity, 26);
  const maxCount = Math.max(...heatmapDays.map((d) => d.count), 1);

  const weeks = Math.ceil(heatmapDays.length / 7);

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm font-medium tracking-[0.2em] text-[#D97757] uppercase"
      >
        Streak
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="flex flex-col items-center gap-2"
      >
        <span className="text-7xl font-bold tracking-tight text-white">
          {highlights.longestStreak}
        </span>
        <span className="text-lg text-white/50">day longest streak</span>
      </motion.div>

      {/* Mini heatmap */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col gap-[3px]"
      >
        {Array.from({ length: 7 }).map((_, row) => (
          <div key={row} className="flex gap-[3px]">
            {Array.from({ length: weeks }).map((_, col) => {
              const idx = col * 7 + row;
              const day = heatmapDays[idx];
              if (!day) return <div key={col} className="h-3 w-3" />;
              const level = getIntensityLevel(day.count, maxCount);
              return (
                <div
                  key={col}
                  className={`h-3 w-3 rounded-[2px] ${INTENSITY_COLORS[level]}`}
                  title={`${day.date}: ${day.count} sessions`}
                />
              );
            })}
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex items-center gap-4 text-sm text-white/40"
      >
        <span>
          Busiest day:{" "}
          <span className="font-medium text-white/70">
            {formatDate(highlights.busiestDay)}
          </span>
        </span>
        <span>·</span>
        <span>
          <span className="font-medium text-white/70">
            {highlights.busiestDayCount}
          </span>{" "}
          sessions
        </span>
      </motion.div>
    </div>
  );
}

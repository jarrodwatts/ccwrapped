"use client";

import { motion } from "motion/react";
import type { WrappedPayload } from "@/lib/types";
import { hourLabel, dayName } from "@/lib/format";

interface HeatmapCardProps {
  payload: WrappedPayload;
}

function getIntensityClass(value: number, max: number): string {
  if (max === 0 || value === 0) return "bg-white/[0.03]";
  const ratio = value / max;
  if (ratio < 0.25) return "bg-[#D97757]/20";
  if (ratio < 0.5) return "bg-[#D97757]/40";
  if (ratio < 0.75) return "bg-[#D97757]/60";
  return "bg-[#D97757]";
}

export function HeatmapCard({ payload }: HeatmapCardProps) {
  const { hourDistribution, dayOfWeekDistribution, peakHour, peakDay } =
    payload.timePatterns;

  const maxHour = Math.max(
    ...Object.values(hourDistribution),
    1
  );
  const maxDay = Math.max(
    ...Object.values(dayOfWeekDistribution),
    1
  );

  return (
    <div className="flex h-full flex-col items-center justify-center px-6">
      <motion.h2
        className="mb-2 text-center text-2xl font-semibold text-white/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        When You Code
      </motion.h2>
      <motion.p
        className="mb-6 text-center text-sm text-white/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Peak: {hourLabel(peakHour)} on {dayName(peakDay)}s
      </motion.p>

      {/* Hour distribution */}
      <motion.div
        className="mb-6 w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <p className="mb-2 text-xs text-white/30">By hour</p>
        <div className="flex gap-[2px]">
          {Array.from({ length: 24 }, (_, h) => {
            const count = hourDistribution[String(h)] ?? 0;
            return (
              <div
                key={h}
                className={`h-8 flex-1 rounded-sm ${getIntensityClass(count, maxHour)}`}
                title={`${hourLabel(h)}: ${count} messages`}
              />
            );
          })}
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-white/20">
          <span>12am</span>
          <span>6am</span>
          <span>12pm</span>
          <span>6pm</span>
          <span>12am</span>
        </div>
      </motion.div>

      {/* Day distribution */}
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <p className="mb-2 text-xs text-white/30">By day of week</p>
        <div className="flex gap-2">
          {Array.from({ length: 7 }, (_, d) => {
            const count = dayOfWeekDistribution[String(d)] ?? 0;
            const height = maxDay > 0 ? (count / maxDay) * 80 + 20 : 20;
            return (
              <div
                key={d}
                className="flex flex-1 flex-col items-center gap-1"
              >
                <div className="flex h-24 items-end">
                  <motion.div
                    className="w-full rounded-t-sm bg-[#D97757]"
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{
                      delay: 0.6 + d * 0.05,
                      duration: 0.4,
                      ease: "easeOut",
                    }}
                  />
                </div>
                <span className="text-[10px] text-white/30">
                  {dayName(d)}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

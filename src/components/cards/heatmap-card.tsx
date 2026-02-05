"use client";

import { motion } from "motion/react";
import type { CardProps } from "@/lib/types";
import { hourLabel } from "@/lib/format";

const INTENSITY_COLORS = [
  "bg-white/5",
  "bg-[#D97757]/25",
  "bg-[#D97757]/50",
  "bg-[#D97757]/75",
  "bg-[#D97757]",
] as const;

function getIntensity(count: number, max: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0;
  if (max === 0) return 1;
  const ratio = count / max;
  if (ratio > 0.75) return 4;
  if (ratio > 0.5) return 3;
  if (ratio > 0.25) return 2;
  return 1;
}

export function HeatmapCard({ payload }: CardProps) {
  const { hourDistribution, dayOfWeekDistribution } = payload.timePatterns;

  const hours = Array.from({ length: 24 }, (_, h) => ({
    hour: h,
    count: hourDistribution[String(h)] ?? 0,
  }));
  const maxHour = Math.max(...hours.map((h) => h.count), 1);

  const peakHour = hours.reduce((a, b) => (b.count > a.count ? b : a));

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const days = dayLabels.map((label, i) => ({
    label,
    count: dayOfWeekDistribution[String(i)] ?? 0,
  }));
  const maxDay = Math.max(...days.map((d) => d.count), 1);

  return (
    <div className="flex flex-col gap-6 py-8">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-sm font-medium tracking-[0.2em] text-[#D97757] uppercase"
      >
        When You Code
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center text-lg text-white/50"
      >
        Peak hour:{" "}
        <span className="font-bold text-white">
          {hourLabel(peakHour.hour)}
        </span>
      </motion.div>

      {/* Hour distribution */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col gap-2"
      >
        <span className="text-xs font-medium tracking-widest text-white/30 uppercase">
          By Hour
        </span>
        <div className="flex items-end gap-[2px]">
          {hours.map(({ hour, count }) => (
            <div key={hour} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-sm bg-[#D97757] transition-all"
                style={{
                  height: `${Math.max(2, (count / maxHour) * 60)}px`,
                  opacity: count === 0 ? 0.1 : 0.3 + (count / maxHour) * 0.7,
                }}
              />
              {hour % 6 === 0 && (
                <span className="text-[10px] text-white/30">
                  {hourLabel(hour)}
                </span>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Day of week */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col gap-2"
      >
        <span className="text-xs font-medium tracking-widest text-white/30 uppercase">
          By Day
        </span>
        <div className="flex gap-2">
          {days.map(({ label, count }) => (
            <div
              key={label}
              className="flex flex-1 flex-col items-center gap-2"
            >
              <div
                className={`h-10 w-full rounded-lg ${INTENSITY_COLORS[getIntensity(count, maxDay)]}`}
              />
              <span className="text-xs text-white/40">{label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

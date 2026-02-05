"use client";

import { motion } from "motion/react";
import type { WrappedPayload } from "@/lib/types";
import { hourLabel, dayName } from "@/lib/format";

interface HeatmapCardProps {
  payload: WrappedPayload;
}

function getIntensityClass(value: number, max: number): string {
  if (max === 0 || value === 0) return "bg-subtle";
  const ratio = value / max;
  if (ratio < 0.25) return "bg-primary/20";
  if (ratio < 0.5) return "bg-primary/40";
  if (ratio < 0.75) return "bg-primary/60";
  return "bg-primary";
}

export function HeatmapCard({ payload }: HeatmapCardProps) {
  const { hourDistribution, dayOfWeekDistribution, peakHour, peakDay } =
    payload.timePatterns;

  const maxHour = Math.max(...Object.values(hourDistribution), 1);
  const maxDay = Math.max(...Object.values(dayOfWeekDistribution), 1);

  return (
    <div className="relative flex h-full flex-col items-center justify-center px-6">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 dot-pattern opacity-30" />

      <motion.div
        className="relative z-10 mb-2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <span className="label">When You Code</span>
      </motion.div>

      <motion.div
        className="card-industrial relative z-10 mb-6 px-6 py-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <span className="text-sm text-text-secondary">Peak: </span>
        <span className="stat-value text-lg">{hourLabel(peakHour)}</span>
        <span className="text-sm text-text-secondary"> on </span>
        <span className="stat-value text-lg">{dayName(peakDay)}s</span>
      </motion.div>

      {/* Hour distribution */}
      <motion.div
        className="relative z-10 mb-6 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <p className="label mb-3">By hour</p>
        <div className="flex gap-[2px]">
          {Array.from({ length: 24 }, (_, h) => {
            const count = hourDistribution[String(h)] ?? 0;
            return (
              <div
                key={h}
                className={`h-8 flex-1 rounded-sm transition-colors ${getIntensityClass(count, maxHour)}`}
                title={`${hourLabel(h)}: ${count} messages`}
              />
            );
          })}
        </div>
        <div className="mt-2 flex justify-between text-xs text-text-muted">
          <span>12am</span>
          <span>6am</span>
          <span>12pm</span>
          <span>6pm</span>
          <span>12am</span>
        </div>
      </motion.div>

      {/* Day distribution */}
      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <p className="label mb-3">By day of week</p>
        <div className="flex gap-2">
          {Array.from({ length: 7 }, (_, d) => {
            const count = dayOfWeekDistribution[String(d)] ?? 0;
            const height = maxDay > 0 ? (count / maxDay) * 80 + 20 : 20;
            return (
              <div key={d} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-24 w-full items-end">
                  <motion.div
                    className="w-full rounded-t-sm bg-primary"
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{
                      delay: 0.6 + d * 0.05,
                      duration: 0.4,
                      ease: "easeOut",
                    }}
                  />
                </div>
                <span className="text-xs text-text-muted">{dayName(d)}</span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

"use client";

import { motion } from "motion/react";
import type { WrappedPayload } from "@/lib/types";
import { hourLabel, dayName } from "@/lib/format";
import { TerminalLabel } from "@/components/ui/terminal-label";

interface HeatmapCardProps {
  payload: WrappedPayload;
}

function getHeatColor(value: number, max: number, isPeak: boolean): string {
  if (isPeak) return "#E85A4F";
  if (max === 0 || value === 0) return "#1a1a1a";
  const ratio = value / max;
  // Red shades from dark to bright
  const shades = ["#2a1512", "#3d1f1b", "#5c2e28", "#7a3d35", "#9a4d42", "#b85a4f"];
  const index = Math.min(Math.floor(ratio * shades.length), shades.length - 1);
  return shades[index];
}

export function HeatmapCard({ payload }: HeatmapCardProps) {
  const { hourDistribution, dayOfWeekDistribution, peakHour, peakDay } =
    payload.timePatterns;

  const maxHour = Math.max(...Object.values(hourDistribution), 1);
  const maxDay = Math.max(...Object.values(dayOfWeekDistribution), 1);

  return (
    <div className="relative flex h-full flex-col items-center justify-center px-6">
      <motion.div
        className="relative z-10 mb-2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <TerminalLabel variant="bracket">WHEN YOU CODE</TerminalLabel>
      </motion.div>

      <motion.div
        className="relative z-10 mb-6 font-mono text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        <span className="text-text-tertiary">peak: </span>
        <span className="text-primary font-medium">{hourLabel(peakHour)}</span>
        <span className="text-text-tertiary"> on </span>
        <span className="text-primary font-medium">{dayName(peakDay)}s</span>
      </motion.div>

      {/* Hour distribution */}
      <motion.div
        className="relative z-10 mb-6 w-full max-w-md"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="label mb-2 text-text-muted text-[10px]">BY HOUR</p>
        <div className="flex gap-px border border-line p-1">
          {Array.from({ length: 24 }, (_, h) => {
            const count = hourDistribution[String(h)] ?? 0;
            const isPeak = h === peakHour;
            return (
              <div
                key={h}
                className="h-6 flex-1 transition-colors"
                style={{ backgroundColor: getHeatColor(count, maxHour, isPeak) }}
                title={`${hourLabel(h)}: ${count} messages`}
              />
            );
          })}
        </div>
        <div className="mt-1.5 flex justify-between font-mono text-[10px] text-text-muted">
          <span>00</span>
          <span>06</span>
          <span>12</span>
          <span>18</span>
          <span>24</span>
        </div>
      </motion.div>

      {/* Day distribution */}
      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="label mb-2 text-text-muted text-[10px]">BY DAY</p>
        <div className="flex gap-1">
          {Array.from({ length: 7 }, (_, d) => {
            const count = dayOfWeekDistribution[String(d)] ?? 0;
            const height = maxDay > 0 ? (count / maxDay) * 80 + 20 : 20;
            const isPeak = d === peakDay;
            return (
              <div key={d} className="flex flex-1 flex-col items-center gap-1.5">
                <div className="flex h-20 w-full items-end border-b border-line">
                  <motion.div
                    className="w-full"
                    style={{ backgroundColor: getHeatColor(count, maxDay, isPeak) }}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{
                      delay: 0.5 + d * 0.04,
                      duration: 0.35,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />
                </div>
                <span className={`font-mono text-[10px] ${isPeak ? "text-primary" : "text-text-muted"}`}>
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

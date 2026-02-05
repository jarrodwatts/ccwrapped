"use client";

import { motion } from "motion/react";
import type { WrappedPayload } from "@/lib/types";
import { formatNumber } from "@/lib/format";

interface WinsCardProps {
  payload: WrappedPayload;
}

export function WinsCard({ payload }: WinsCardProps) {
  const goals = payload.goals;
  const totalSessions = Object.values(goals).reduce((a, b) => a + b, 0);

  const featureCount = goals.feature ?? 0;
  const bugFixCount = goals.bug_fix ?? 0;
  const otherCount = totalSessions - featureCount - bugFixCount;

  const segments = [
    { label: "Features Built", count: featureCount, color: "#D97757" },
    { label: "Bugs Fixed", count: bugFixCount, color: "#E8956F" },
    { label: "Other Tasks", count: otherCount, color: "#8C3E28" },
  ].filter((s) => s.count > 0);

  return (
    <div className="flex h-full flex-col items-center justify-center px-8">
      <motion.h2
        className="mb-8 text-center text-2xl font-semibold text-white/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Your Wins
      </motion.h2>

      {/* Donut-style visualization using stacked bars */}
      <div className="mb-8 flex w-full max-w-xs items-center justify-center">
        <div className="h-4 w-full overflow-hidden rounded-full bg-white/5">
          <div className="flex h-full">
            {segments.map((seg) => {
              const pct = totalSessions > 0 ? (seg.count / totalSessions) * 100 : 0;
              return (
                <motion.div
                  key={seg.label}
                  className="h-full"
                  style={{ backgroundColor: seg.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {segments.map((seg, i) => (
          <motion.div
            key={seg.label}
            className="flex items-center gap-3"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.15 }}
          >
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: seg.color }}
            />
            <span className="text-sm text-white/60">{seg.label}</span>
            <span className="font-mono text-sm font-bold text-white/80">
              {formatNumber(seg.count)}
            </span>
          </motion.div>
        ))}
      </div>

      <motion.p
        className="mt-8 text-center text-sm text-white/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {formatNumber(totalSessions)} sessions classified
      </motion.p>
    </div>
  );
}

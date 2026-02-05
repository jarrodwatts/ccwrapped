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
    { label: "Features Built", count: featureCount, primary: true },
    { label: "Bugs Fixed", count: bugFixCount, primary: true },
    { label: "Other Tasks", count: otherCount, primary: false },
  ].filter((s) => s.count > 0);

  return (
    <div className="relative flex h-full flex-col items-center justify-center px-6">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-30" />

      <motion.div
        className="relative z-10 mb-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <span className="label">Your Wins</span>
      </motion.div>

      {/* Progress bar visualization */}
      <div className="relative z-10 mb-8 w-full max-w-sm">
        <div className="progress-track h-4">
          <div className="flex h-full">
            {segments.map((seg, i) => {
              const pct = totalSessions > 0 ? (seg.count / totalSessions) * 100 : 0;
              return (
                <motion.div
                  key={seg.label}
                  className={`h-full ${i === 0 ? "rounded-l-full" : ""} ${i === segments.length - 1 ? "rounded-r-full" : ""} ${seg.primary ? "bg-primary" : "bg-primary/40"}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.1 }}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-sm space-y-3">
        {segments.map((seg, i) => (
          <motion.div
            key={seg.label}
            className="card-industrial flex items-center justify-between p-4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.15 }}
          >
            <div className="flex items-center gap-3">
              <div className={`h-3 w-3 rounded-full ${seg.primary ? "bg-primary" : "bg-primary/40"}`} />
              <span className="text-sm text-text-secondary">{seg.label}</span>
            </div>
            <span className="stat-value text-xl">{formatNumber(seg.count)}</span>
          </motion.div>
        ))}
      </div>

      <motion.p
        className="relative z-10 mt-8 text-sm text-text-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {formatNumber(totalSessions)} sessions classified
      </motion.p>
    </div>
  );
}

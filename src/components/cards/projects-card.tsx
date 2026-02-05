"use client";

import { motion } from "motion/react";
import type { WrappedPayload } from "@/lib/types";
import { formatNumber } from "@/lib/format";

interface ProjectsCardProps {
  payload: WrappedPayload;
}

export function ProjectsCard({ payload }: ProjectsCardProps) {
  const goalEntries = Object.entries(payload.goals)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);

  const totalGoals = goalEntries.reduce((sum, [, count]) => sum + count, 0);

  return (
    <div className="relative flex h-full flex-col items-center justify-center px-6">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 dot-pattern opacity-30" />

      <motion.div
        className="relative z-10 mb-2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <span className="label">Your Projects</span>
      </motion.div>

      <motion.div
        className="card-industrial relative z-10 mb-8 px-6 py-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <span className="stat-value text-2xl">{payload.projectCount}</span>
        <span className="ml-2 text-sm text-text-secondary">projects worked on</span>
      </motion.div>

      <div className="relative z-10 w-full max-w-md space-y-3">
        {goalEntries.slice(0, 6).map(([category, count], i) => {
          const percent = totalGoals > 0 ? (count / totalGoals) * 100 : 0;
          return (
            <motion.div
              key={category}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 * i }}
            >
              <span className="w-24 text-right text-xs font-medium uppercase tracking-wider text-text-tertiary">
                {category.replace(/_/g, " ")}
              </span>
              <div className="progress-track flex-1">
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{
                    delay: 0.15 * i + 0.2,
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                />
              </div>
              <span className="w-14 font-mono text-xs text-text-muted">
                {formatNumber(count)}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

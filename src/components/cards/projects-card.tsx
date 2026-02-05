"use client";

import { motion } from "motion/react";
import type { WrappedPayload } from "@/lib/types";
import { formatNumber } from "@/lib/format";
import { TerminalLabel } from "@/components/ui/terminal-label";

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
      <motion.div
        className="relative z-10 mb-2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <TerminalLabel variant="bracket">PROJECTS</TerminalLabel>
      </motion.div>

      <motion.div
        className="relative z-10 mb-8 flex items-baseline gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        <span className="font-mono text-3xl font-bold text-text-primary tabular-nums">{payload.projectCount}</span>
        <span className="text-sm text-text-tertiary">projects worked on</span>
      </motion.div>

      <div className="relative z-10 w-full max-w-md space-y-2">
        {goalEntries.slice(0, 6).map(([category, count], i) => {
          const percent = totalGoals > 0 ? (count / totalGoals) * 100 : 0;
          const isFirst = i === 0;
          return (
            <motion.div
              key={category}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="w-24 text-right font-mono text-xs text-text-tertiary truncate">
                {category.replace(/_/g, " ")}
              </span>
              <div className="flex-1 h-4 bg-gray-3 overflow-hidden">
                <motion.div
                  className={`h-full ${isFirst ? "bg-primary" : "bg-gray-7"}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{
                    delay: 0.08 * i + 0.15,
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              </div>
              <span className={`w-12 font-mono text-xs tabular-nums ${isFirst ? "text-primary" : "text-text-muted"}`}>
                {formatNumber(count)}
              </span>
            </motion.div>
          );
        })}
      </div>

      <motion.p
        className="relative z-10 mt-6 font-mono text-xs text-text-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        // context switching is cardio
      </motion.p>
    </div>
  );
}

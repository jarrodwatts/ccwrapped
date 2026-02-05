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
    <div className="flex h-full flex-col items-center justify-center px-8">
      <motion.h2
        className="mb-2 text-center text-2xl font-semibold text-white/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Your Projects
      </motion.h2>
      <motion.p
        className="mb-8 text-center text-sm text-white/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {payload.projectCount} projects worked on
      </motion.p>

      <div className="w-full max-w-sm space-y-4">
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
              <span className="w-20 text-right text-xs capitalize text-white/50">
                {category.replace(/_/g, " ")}
              </span>
              <div className="h-4 flex-1 overflow-hidden rounded-full bg-white/[0.03]">
                <motion.div
                  className="h-full rounded-full bg-[#D97757]"
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{
                    delay: 0.15 * i + 0.2,
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                />
              </div>
              <span className="w-12 font-mono text-xs text-white/40">
                {formatNumber(count)}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

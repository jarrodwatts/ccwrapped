"use client";

import { motion } from "motion/react";
import type { CardProps } from "@/lib/types";

const GOAL_LABELS: Record<string, string> = {
  bug_fix: "Bug Fixes",
  feature: "New Features",
  refactor: "Refactors",
  devops: "DevOps",
  docs: "Documentation",
  explore: "Exploration",
  test: "Testing",
  implement_feature: "Features",
  build: "Building",
  create: "Creating",
  debug: "Debugging",
  other: "Other",
};

const GOAL_COLORS = [
  "#D97757",
  "#E89B7F",
  "#B85C3D",
  "#F0C4B0",
  "#A34F35",
  "#D4887A",
  "#C4694C",
  "#E8AE9B",
];

export function WinsCard({ payload }: CardProps) {
  const goals = Object.entries(payload.goals)
    .filter(([, count]) => count > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  const totalGoals = goals.reduce((sum, [, count]) => sum + count, 0);

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm font-medium tracking-[0.2em] text-[#D97757] uppercase"
      >
        Your Wins
      </motion.h2>

      {goals.length > 0 ? (
        <>
          {/* Stacked bar */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex h-6 w-full overflow-hidden rounded-full"
            style={{ transformOrigin: "left" }}
          >
            {goals.map(([key, count], i) => (
              <div
                key={key}
                style={{
                  width: `${(count / totalGoals) * 100}%`,
                  backgroundColor: GOAL_COLORS[i % GOAL_COLORS.length],
                }}
              />
            ))}
          </motion.div>

          {/* Legend */}
          <div className="grid w-full grid-cols-2 gap-3">
            {goals.map(([key, count], i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3"
              >
                <div
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{
                    backgroundColor: GOAL_COLORS[i % GOAL_COLORS.length],
                  }}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white/80">
                    {GOAL_LABELS[key] ?? key}
                  </span>
                  <span className="text-xs text-white/40">
                    {count} sessions · {Math.round((count / totalGoals) * 100)}%
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-white/40"
        >
          No goal data available yet
        </motion.p>
      )}
    </div>
  );
}

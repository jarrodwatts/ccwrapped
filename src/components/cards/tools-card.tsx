"use client";

import { motion } from "motion/react";
import type { WrappedPayload } from "@/lib/types";
import { formatNumber } from "@/lib/format";

interface ToolsCardProps {
  payload: WrappedPayload;
}

export function ToolsCard({ payload }: ToolsCardProps) {
  const sorted = Object.entries(payload.tools)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const maxCount = sorted[0]?.[1] ?? 1;
  const totalTools = Object.keys(payload.tools).length;

  return (
    <div className="relative flex h-full flex-col items-center justify-center px-6">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-30" />

      <motion.div
        className="relative z-10 mb-2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <span className="label">Your Tool Arsenal</span>
      </motion.div>

      <motion.div
        className="card-industrial relative z-10 mb-8 px-6 py-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <span className="stat-value text-2xl">{totalTools}</span>
        <span className="ml-2 text-sm text-text-secondary">distinct tools used</span>
      </motion.div>

      <div className="relative z-10 w-full max-w-lg space-y-2">
        {sorted.map(([name, count], i) => {
          const width = (count / maxCount) * 100;
          return (
            <motion.div
              key={name}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.4 }}
            >
              <span className="w-20 text-right font-mono text-xs text-text-tertiary sm:w-28">
                {name}
              </span>
              <div className="flex-1 overflow-hidden rounded-sm bg-subtle">
                <motion.div
                  className="h-6 rounded-sm bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${width}%` }}
                  transition={{
                    delay: 0.1 * i + 0.2,
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                />
              </div>
              <span className="w-16 font-mono text-xs text-text-muted">
                {formatNumber(count)}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

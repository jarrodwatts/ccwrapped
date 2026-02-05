"use client";

import { motion } from "motion/react";
import type { WrappedPayload } from "@/lib/types";
import { formatNumber } from "@/lib/format";

interface ToolsCardProps {
  payload: WrappedPayload;
}

const TOOL_COLORS = [
  "#D97757",
  "#E8956F",
  "#F0B090",
  "#C4613F",
  "#A84E33",
  "#8C3E28",
  "#FFB088",
  "#FF9E70",
] as const;

export function ToolsCard({ payload }: ToolsCardProps) {
  const sorted = Object.entries(payload.tools)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const maxCount = sorted[0]?.[1] ?? 1;
  const totalTools = Object.keys(payload.tools).length;

  return (
    <div className="flex h-full flex-col items-center justify-center px-8">
      <motion.h2
        className="mb-2 text-center text-2xl font-semibold text-white/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Your Tool Arsenal
      </motion.h2>
      <motion.p
        className="mb-8 text-center text-sm text-white/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {totalTools} distinct tools used
      </motion.p>

      <div className="w-full max-w-md space-y-3">
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
              <span className="w-24 text-right font-mono text-xs text-white/50 sm:w-32">
                {name}
              </span>
              <div className="flex-1">
                <motion.div
                  className="h-6 rounded-r-sm"
                  style={{
                    backgroundColor: TOOL_COLORS[i % TOOL_COLORS.length],
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${width}%` }}
                  transition={{
                    delay: 0.1 * i + 0.2,
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                />
              </div>
              <span className="w-16 font-mono text-xs text-white/40">
                {formatNumber(count)}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

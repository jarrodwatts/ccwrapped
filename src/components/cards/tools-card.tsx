"use client";

import { motion } from "motion/react";
import type { WrappedPayload } from "@/lib/types";
import { formatNumber } from "@/lib/format";
import { TerminalLabel } from "@/components/ui/terminal-label";

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
      <motion.div
        className="relative z-10 mb-2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <TerminalLabel variant="bracket">TOOL ARSENAL</TerminalLabel>
      </motion.div>

      <motion.div
        className="relative z-10 mb-8 flex items-baseline gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        <span className="font-mono text-3xl font-bold text-primary tabular-nums">{totalTools}</span>
        <span className="text-sm text-text-tertiary">distinct tools</span>
      </motion.div>

      <div className="relative z-10 w-full max-w-lg space-y-1.5">
        {sorted.map(([name, count], i) => {
          const width = (count / maxCount) * 100;
          const isFirst = i === 0;
          return (
            <motion.div
              key={name}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="w-20 text-right font-mono text-xs text-text-tertiary sm:w-28 truncate">
                {name}
              </span>
              <div className="flex-1 h-5 overflow-hidden bg-gray-3">
                <motion.div
                  className={`h-full ${isFirst ? "bg-primary" : "bg-gray-7"}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${width}%` }}
                  transition={{
                    delay: 0.08 * i + 0.15,
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              </div>
              <span className={`w-14 font-mono text-xs tabular-nums ${isFirst ? "text-primary" : "text-text-muted"}`}>
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
        transition={{ delay: 0.8 }}
      >
        // there&apos;s a tool for that
      </motion.p>
    </div>
  );
}

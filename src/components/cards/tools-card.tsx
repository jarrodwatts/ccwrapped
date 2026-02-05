"use client";

import { motion } from "motion/react";
import type { CardProps } from "@/lib/types";

export function ToolsCard({ payload }: CardProps) {
  const sorted = Object.entries(payload.tools)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);

  const maxCount = sorted[0]?.[1] ?? 1;
  const totalTools = Object.keys(payload.tools).length;

  return (
    <div className="flex flex-col gap-6 py-8">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-sm font-medium tracking-[0.2em] text-[#D97757] uppercase"
      >
        Tool Arsenal
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center text-sm text-white/40"
      >
        {totalTools} distinct tools used
      </motion.p>

      <div className="flex flex-col gap-3">
        {sorted.map(([name, count], i) => {
          const width = (count / maxCount) * 100;
          return (
            <motion.div
              key={name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}
              className="flex items-center gap-3"
            >
              <span className="w-20 shrink-0 text-right text-sm font-medium text-white/60">
                {name}
              </span>
              <div className="relative h-8 flex-1 overflow-hidden rounded-lg bg-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${width}%` }}
                  transition={{
                    delay: 0.4 + i * 0.08,
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                  className="absolute inset-y-0 left-0 rounded-lg"
                  style={{
                    background:
                      i === 0
                        ? "linear-gradient(90deg, #D97757, #E89B7F)"
                        : "rgba(255,255,255,0.08)",
                  }}
                />
                <span className="relative z-10 flex h-full items-center px-3 text-sm font-medium text-white/70">
                  {count.toLocaleString()}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

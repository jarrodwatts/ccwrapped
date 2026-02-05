"use client";

import { motion } from "motion/react";
import type { WrappedPayload } from "@/lib/types";
import { formatNumber, formatHours } from "@/lib/format";

interface NumbersCardProps {
  payload: WrappedPayload;
}

const STATS_CONFIG = [
  { key: "sessions", label: "SESSIONS", format: formatNumber },
  { key: "messages", label: "MESSAGES", format: formatNumber },
  { key: "hours", label: "HOURS", format: (v: number) => formatHours(v) },
  { key: "commits", label: "COMMITS", format: formatNumber },
] as const;

export function NumbersCard({ payload }: NumbersCardProps) {
  return (
    <div className="relative flex h-full flex-col items-center justify-center px-6">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 dot-pattern opacity-30" />

      <motion.div
        className="relative z-10 mb-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <span className="label">The Numbers</span>
      </motion.div>

      <div className="relative z-10 grid w-full max-w-md grid-cols-2 gap-4">
        {STATS_CONFIG.map((stat, i) => {
          const value = payload.stats[stat.key as keyof typeof payload.stats];
          return (
            <motion.div
              key={stat.key}
              className="card-industrial flex flex-col gap-2 p-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i, duration: 0.5 }}
            >
              <span className="label">{stat.label}</span>
              <span className="stat-value text-4xl sm:text-5xl">
                {stat.format(value)}
              </span>
            </motion.div>
          );
        })}
      </div>

      <motion.p
        className="relative z-10 mt-8 text-sm text-text-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Across {payload.stats.days} active days
      </motion.p>
    </div>
  );
}

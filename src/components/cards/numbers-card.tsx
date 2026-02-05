"use client";

import { motion } from "motion/react";
import type { WrappedPayload } from "@/lib/types";
import { formatNumber, formatHours } from "@/lib/format";

interface NumbersCardProps {
  payload: WrappedPayload;
}

const STATS_CONFIG = [
  { key: "sessions", label: "Sessions", format: formatNumber },
  { key: "messages", label: "Messages", format: formatNumber },
  { key: "hours", label: "Hours Coding", format: (v: number) => formatHours(v) },
  { key: "commits", label: "Commits", format: formatNumber },
] as const;

export function NumbersCard({ payload }: NumbersCardProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-8">
      <motion.h2
        className="mb-10 text-center text-2xl font-semibold text-white/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        The Numbers
      </motion.h2>

      <div className="grid w-full max-w-md grid-cols-2 gap-6">
        {STATS_CONFIG.map((stat, i) => {
          const value = payload.stats[stat.key as keyof typeof payload.stats];
          return (
            <motion.div
              key={stat.key}
              className="flex flex-col items-center rounded-xl border border-white/5 bg-white/[0.02] p-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i, duration: 0.5 }}
            >
              <span className="text-3xl font-bold text-[#D97757] sm:text-4xl">
                {stat.format(value)}
              </span>
              <span className="mt-2 text-sm text-white/40">{stat.label}</span>
            </motion.div>
          );
        })}
      </div>

      <motion.p
        className="mt-8 text-center text-sm text-white/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Across {payload.stats.days} active days
      </motion.p>
    </div>
  );
}

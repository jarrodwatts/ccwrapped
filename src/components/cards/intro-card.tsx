"use client";

import { motion } from "motion/react";
import type { CardProps } from "@/lib/types";
import { formatDate } from "@/lib/format";

export function IntroCard({ payload }: CardProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-12 text-center">
      {/* Glow background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#D97757]/10 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-sm font-medium tracking-[0.2em] text-white/40 uppercase"
      >
        Your Year with Claude Code
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
        className="text-5xl font-bold tracking-tight text-white sm:text-6xl"
      >
        Wrapped
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex flex-col items-center gap-3"
      >
        <p className="text-lg text-white/50">
          {formatDate(payload.highlights.firstSessionDate)} — Present
        </p>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-[#D97757]" />
          <span className="text-sm font-medium text-white/70">
            {payload.stats.sessions.toLocaleString()} sessions
          </span>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-sm text-white/30"
      >
        Tap or press → to continue
      </motion.p>
    </div>
  );
}

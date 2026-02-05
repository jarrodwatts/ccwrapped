"use client";

import { motion } from "motion/react";
import type { WrappedPayload } from "@/lib/types";
import { formatNumber } from "@/lib/format";

interface StreakCardProps {
  payload: WrappedPayload;
}

export function StreakCard({ payload }: StreakCardProps) {
  const { current, longest, totalActiveDays } = payload.streaks;
  const longestSessionHours = Math.round(
    payload.highlights.longestSessionMinutes / 60
  );
  const longestSessionMins =
    payload.highlights.longestSessionMinutes % 60;

  return (
    <div className="flex h-full flex-col items-center justify-center px-8">
      <motion.h2
        className="mb-10 text-center text-2xl font-semibold text-white/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Streaks & Endurance
      </motion.h2>

      <div className="grid w-full max-w-sm grid-cols-2 gap-6">
        <motion.div
          className="flex flex-col items-center rounded-xl border border-white/5 bg-white/[0.02] p-5"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-4xl font-bold text-[#D97757]">{longest}</span>
          <span className="mt-1 text-xs text-white/40">Longest Streak</span>
          <span className="text-[10px] text-white/20">consecutive days</span>
        </motion.div>

        <motion.div
          className="flex flex-col items-center rounded-xl border border-white/5 bg-white/[0.02] p-5"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35 }}
        >
          <span className="text-4xl font-bold text-[#E8956F]">{current}</span>
          <span className="mt-1 text-xs text-white/40">Current Streak</span>
          <span className="text-[10px] text-white/20">days</span>
        </motion.div>

        <motion.div
          className="flex flex-col items-center rounded-xl border border-white/5 bg-white/[0.02] p-5"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span className="text-4xl font-bold text-white/80">
            {formatNumber(totalActiveDays)}
          </span>
          <span className="mt-1 text-xs text-white/40">Active Days</span>
          <span className="text-[10px] text-white/20">total</span>
        </motion.div>

        <motion.div
          className="flex flex-col items-center rounded-xl border border-white/5 bg-white/[0.02] p-5"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.65 }}
        >
          <span className="text-4xl font-bold text-white/80">
            {longestSessionHours}h{longestSessionMins}m
          </span>
          <span className="mt-1 text-xs text-white/40">Longest Session</span>
          <span className="text-[10px] text-white/20">marathon</span>
        </motion.div>
      </div>
    </div>
  );
}

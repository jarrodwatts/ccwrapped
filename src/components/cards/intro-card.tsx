"use client";

import { motion } from "motion/react";
import type { WrappedPayload } from "@/lib/types";
import { formatDate } from "@/lib/format";

interface IntroCardProps {
  payload: WrappedPayload;
}

export function IntroCard({ payload }: IntroCardProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-8 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="mb-2 font-mono text-sm tracking-widest text-white/40 uppercase">
          Your
        </div>
        <h1 className="bg-gradient-to-r from-[#D97757] to-[#E8956F] bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl">
          Claude Code
        </h1>
        <h2 className="mt-1 text-4xl font-bold text-white sm:text-5xl">
          Wrapped
        </h2>
      </motion.div>

      <motion.div
        className="mt-8 space-y-2 text-white/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <p className="text-lg">
          {formatDate(payload.highlights.firstSessionDate)} — Present
        </p>
        <p className="font-mono text-sm text-white/30">
          {payload.stats.sessions.toLocaleString()} sessions analyzed
        </p>
      </motion.div>

      <motion.div
        className="mt-12 text-sm text-white/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Press arrow key or click to continue
      </motion.div>
    </div>
  );
}

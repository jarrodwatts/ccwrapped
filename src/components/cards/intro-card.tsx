"use client";

import { motion } from "motion/react";
import type { WrappedPayload } from "@/lib/types";
import { formatDate } from "@/lib/format";

interface IntroCardProps {
  payload: WrappedPayload;
}

export function IntroCard({ payload }: IntroCardProps) {
  return (
    <div className="relative flex h-full flex-col items-center justify-center px-8 text-center">
      {/* Grid background */}
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-30" />

      {/* Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[100px]" />
      </div>

      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <span className="label mb-4 block">Your</span>
        <h1 className="text-5xl font-bold tracking-tight text-text-primary sm:text-7xl">
          CLAUDE CODE
        </h1>
        <h2 className="mt-2 text-5xl font-bold tracking-tight sm:text-7xl">
          <span className="text-gradient glow-text">WRAPPED</span>
        </h2>
      </motion.div>

      <motion.div
        className="relative z-10 mt-10 flex flex-col items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="card-industrial px-6 py-4">
          <p className="text-lg text-text-secondary">
            {formatDate(payload.highlights.firstSessionDate)} — Present
          </p>
        </div>
        <p className="font-mono text-sm text-text-muted">
          {payload.stats.sessions.toLocaleString()} sessions analyzed
        </p>
      </motion.div>

      <motion.div
        className="relative z-10 mt-16 text-sm text-text-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Tap to continue →
      </motion.div>
    </div>
  );
}

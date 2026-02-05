"use client";

import { motion } from "motion/react";
import type { WrappedPayload } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { Card } from "@/components/ui/card";
import { TerminalLabel } from "@/components/ui/terminal-label";

interface IntroCardProps {
  payload: WrappedPayload;
}

export function IntroCard({ payload }: IntroCardProps) {
  return (
    <div className="relative flex h-full flex-col items-center justify-center px-8 text-center">
      {/* Subtle glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/6 blur-[150px]" />
      </div>

      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <TerminalLabel variant="bracket" className="mb-6 block">
          YOUR
        </TerminalLabel>
        <h1 className="text-4xl font-bold tracking-tight text-text-primary sm:text-6xl lg:text-7xl">
          CLAUDE CODE
        </h1>
        <h2 className="mt-2 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
          <span className="text-gradient glow-text">WRAPPED</span>
        </h2>
      </motion.div>

      <motion.div
        className="relative z-10 mt-10 flex flex-col items-center gap-4"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <Card variant="terminal" className="px-6 py-4" showCorners>
          <p className="font-mono text-sm text-text-secondary">
            {formatDate(payload.highlights.firstSessionDate)} — Present
          </p>
        </Card>
        <p className="font-mono text-xs text-text-muted">
          <span className="text-text-tertiary">{payload.stats.sessions.toLocaleString()}</span> sessions analyzed
        </p>
      </motion.div>

      <motion.div
        className="relative z-10 mt-12 font-mono text-xs text-text-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <span className="animate-blink">▌</span> tap to continue
      </motion.div>
    </div>
  );
}

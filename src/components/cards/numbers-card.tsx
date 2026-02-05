"use client";

import { motion } from "motion/react";
import type { WrappedPayload } from "@/lib/types";
import { formatNumber, formatHours } from "@/lib/format";
import { TerminalLabel } from "@/components/ui/terminal-label";

interface NumbersCardProps {
  payload: WrappedPayload;
}

const STATS_CONFIG = [
  { key: "sessions", label: "SESSIONS", format: formatNumber, highlight: true },
  { key: "messages", label: "MESSAGES", format: formatNumber, highlight: false },
  { key: "hours", label: "HOURS", format: (v: number) => formatHours(v), highlight: false },
  { key: "commits", label: "COMMITS", format: formatNumber, highlight: false },
] as const;

export function NumbersCard({ payload }: NumbersCardProps) {
  return (
    <div className="relative flex h-full flex-col items-center justify-center px-6">
      <motion.div
        className="relative z-10 mb-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <TerminalLabel variant="bracket">THE NUMBERS</TerminalLabel>
      </motion.div>

      {/* Grid with structural lines */}
      <div className="relative z-10 w-full max-w-md">
        {/* Corner markers */}
        <span className="absolute -top-2 -left-2 font-mono text-xs text-text-muted">+</span>
        <span className="absolute -top-2 -right-2 font-mono text-xs text-text-muted">+</span>
        <span className="absolute -bottom-2 -left-2 font-mono text-xs text-text-muted">+</span>
        <span className="absolute -bottom-2 -right-2 font-mono text-xs text-text-muted">+</span>

        <div className="grid grid-cols-2 border border-line divide-x divide-y divide-line">
          {STATS_CONFIG.map((stat, i) => {
            const value = payload.stats[stat.key as keyof typeof payload.stats];
            return (
              <motion.div
                key={stat.key}
                className="flex flex-col gap-2 p-6 bg-background"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="label text-text-muted">{stat.label}</span>
                <span
                  className={`font-mono text-3xl sm:text-4xl font-bold tabular-nums ${
                    stat.highlight ? "text-primary" : "text-text-primary"
                  }`}
                >
                  {stat.format(value)}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      <motion.p
        className="relative z-10 mt-8 font-mono text-xs text-text-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        // across {payload.stats.days} active days
      </motion.p>
    </div>
  );
}

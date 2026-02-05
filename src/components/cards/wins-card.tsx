"use client";

import { motion } from "motion/react";
import type { WrappedPayload } from "@/lib/types";
import { formatNumber } from "@/lib/format";
import { TerminalLabel } from "@/components/ui/terminal-label";

interface WinsCardProps {
  payload: WrappedPayload;
}

export function WinsCard({ payload }: WinsCardProps) {
  const goals = payload.goals;
  const totalSessions = Object.values(goals).reduce((a, b) => a + b, 0);

  const featureCount = goals.feature ?? 0;
  const bugFixCount = goals.bug_fix ?? 0;
  const otherCount = totalSessions - featureCount - bugFixCount;

  const segments = [
    { label: "Features", count: featureCount, highlight: true, icon: "+" },
    { label: "Bug Fixes", count: bugFixCount, highlight: false, icon: "~" },
    { label: "Other", count: otherCount, highlight: false, icon: ">" },
  ].filter((s) => s.count > 0);

  return (
    <div className="relative flex h-full flex-col items-center justify-center px-6">
      <motion.div
        className="relative z-10 mb-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <TerminalLabel variant="bracket">WINS</TerminalLabel>
      </motion.div>

      {/* Stacked bar visualization */}
      <div className="relative z-10 mb-8 w-full max-w-sm">
        <div className="h-3 bg-gray-3 overflow-hidden flex">
          {segments.map((seg, i) => {
            const pct = totalSessions > 0 ? (seg.count / totalSessions) * 100 : 0;
            return (
              <motion.div
                key={seg.label}
                className={`h-full ${seg.highlight ? "bg-primary" : i === 1 ? "bg-gray-7" : "bg-gray-5"}`}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
              />
            );
          })}
        </div>
      </div>

      <div className="relative z-10 w-full max-w-sm space-y-2">
        {segments.map((seg, i) => (
          <motion.div
            key={seg.label}
            className="flex items-center justify-between p-4 border border-line bg-background"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + i * 0.1, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3">
              <span className={`font-mono text-sm ${seg.highlight ? "text-primary" : "text-text-muted"}`}>
                {seg.icon}
              </span>
              <span className="text-sm text-text-secondary">{seg.label}</span>
            </div>
            <span className={`font-mono text-lg font-bold tabular-nums ${seg.highlight ? "text-primary" : "text-text-primary"}`}>
              {formatNumber(seg.count)}
            </span>
          </motion.div>
        ))}
      </div>

      <motion.p
        className="relative z-10 mt-6 font-mono text-xs text-text-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        // {formatNumber(totalSessions)} sessions shipped
      </motion.p>
    </div>
  );
}

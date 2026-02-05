"use client";

import { motion } from "motion/react";
import type { WrappedPayload } from "@/lib/types";
import { formatDate, formatNumber } from "@/lib/format";

interface HighlightsCardProps {
  payload: WrappedPayload;
}

export function HighlightsCard({ payload }: HighlightsCardProps) {
  const { highlights } = payload;

  const items = [
    {
      label: "BUSIEST DAY",
      value: formatDate(highlights.busiestDay),
      detail: `${formatNumber(highlights.busiestDayMessages)} messages`,
    },
    {
      label: "TOP TOOL",
      value: highlights.topToolName,
      detail: `used ${formatNumber(highlights.topToolCount)} times`,
    },
    {
      label: "RAREST TOOL",
      value: highlights.rarestTool,
      detail: "barely touched",
    },
    {
      label: "LONGEST SESSION",
      value: `${Math.floor(highlights.longestSessionMinutes / 60)}h ${highlights.longestSessionMinutes % 60}m`,
      detail: "deep work",
    },
  ];

  return (
    <div className="relative flex h-full flex-col items-center justify-center px-6">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 dot-pattern opacity-30" />

      <motion.div
        className="relative z-10 mb-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <span className="label">Highlights Reel</span>
      </motion.div>

      <div className="relative z-10 w-full max-w-md space-y-3">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            className="card-industrial flex items-center justify-between p-5"
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.15 }}
          >
            <div className="flex flex-col gap-1">
              <span className="label">{item.label}</span>
              <span className="stat-value text-2xl">{item.value}</span>
            </div>
            <span className="text-xs text-text-muted">{item.detail}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

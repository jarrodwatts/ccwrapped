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
      label: "Busiest Day",
      value: formatDate(highlights.busiestDay),
      detail: `${formatNumber(highlights.busiestDayMessages)} messages`,
    },
    {
      label: "Top Tool",
      value: highlights.topToolName,
      detail: `used ${formatNumber(highlights.topToolCount)} times`,
    },
    {
      label: "Rarest Tool",
      value: highlights.rarestTool,
      detail: "barely touched",
    },
    {
      label: "Longest Session",
      value: `${Math.floor(highlights.longestSessionMinutes / 60)}h ${highlights.longestSessionMinutes % 60}m`,
      detail: "deep work",
    },
  ];

  return (
    <div className="flex h-full flex-col items-center justify-center px-8">
      <motion.h2
        className="mb-10 text-center text-2xl font-semibold text-white/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Highlights Reel
      </motion.h2>

      <div className="w-full max-w-sm space-y-4">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            className="flex items-center gap-4 rounded-lg border border-white/5 bg-white/[0.02] px-5 py-4"
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.15 }}
          >
            <div className="flex-1">
              <p className="text-xs text-white/30">{item.label}</p>
              <p className="text-lg font-semibold text-white/90">
                {item.value}
              </p>
            </div>
            <span className="text-xs text-white/30">{item.detail}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

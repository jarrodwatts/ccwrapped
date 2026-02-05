"use client";

import { motion } from "motion/react";
import type { CardProps } from "@/lib/types";
import { formatDate } from "@/lib/format";

interface HighlightItemProps {
  label: string;
  value: string;
  delay: number;
}

function HighlightItem({ label, value, delay }: HighlightItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, type: "spring", stiffness: 200 }}
      className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-5 py-4"
    >
      <span className="text-sm text-white/50">{label}</span>
      <span className="font-bold text-white">{value}</span>
    </motion.div>
  );
}

export function HighlightsCard({ payload }: CardProps) {
  const { highlights, stats } = payload;

  const topTool = Object.entries(payload.tools)
    .sort(([, a], [, b]) => b - a)[0];

  const items: { label: string; value: string }[] = [
    {
      label: "Busiest Day",
      value: `${formatDate(highlights.busiestDay)} (${highlights.busiestDayCount} sessions)`,
    },
    {
      label: "Longest Session",
      value: `${Math.round(highlights.longestSessionMinutes)} min`,
    },
    {
      label: "Most Used Tool",
      value: topTool ? `${topTool[0]} (${topTool[1].toLocaleString()}×)` : "—",
    },
    {
      label: "Total Messages",
      value: stats.messages.toLocaleString(),
    },
  ];

  if (highlights.rareToolName) {
    items.push({
      label: "Rarest Tool",
      value: `${highlights.rareToolName} (${highlights.rareToolCount ?? 0}×)`,
    });
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-sm font-medium tracking-[0.2em] text-[#D97757] uppercase"
      >
        Highlights Reel
      </motion.h2>

      <div className="flex flex-col gap-3">
        {items.map((item, i) => (
          <HighlightItem
            key={item.label}
            label={item.label}
            value={item.value}
            delay={0.2 + i * 0.1}
          />
        ))}
      </div>
    </div>
  );
}

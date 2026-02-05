"use client";

import { motion } from "motion/react";
import type { WrappedPayload } from "@/lib/types";
import { formatDate, formatNumber } from "@/lib/format";
import { TerminalLabel } from "@/components/ui/terminal-label";

interface HighlightsCardProps {
  payload: WrappedPayload;
}

export function HighlightsCard({ payload }: HighlightsCardProps) {
  const { highlights } = payload;

  const items = [
    {
      label: "BUSIEST DAY",
      value: formatDate(highlights.busiestDay),
      detail: `${formatNumber(highlights.busiestDayMessages)} msgs`,
      highlight: true,
    },
    {
      label: "TOP TOOL",
      value: highlights.topToolName,
      detail: `×${formatNumber(highlights.topToolCount)}`,
      highlight: false,
    },
    {
      label: "RAREST TOOL",
      value: highlights.rarestTool,
      detail: "hidden gem",
      highlight: false,
    },
    {
      label: "MARATHON",
      value: `${Math.floor(highlights.longestSessionMinutes / 60)}h ${highlights.longestSessionMinutes % 60}m`,
      detail: "single session",
      highlight: false,
    },
  ];

  return (
    <div className="relative flex h-full flex-col items-center justify-center px-6">
      <motion.div
        className="relative z-10 mb-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <TerminalLabel variant="bracket">HIGHLIGHTS</TerminalLabel>
      </motion.div>

      {/* Grid layout with structural lines */}
      <div className="relative z-10 w-full max-w-md">
        {/* Corner markers */}
        <span className="absolute -top-2 -left-2 font-mono text-xs text-text-muted">+</span>
        <span className="absolute -top-2 -right-2 font-mono text-xs text-text-muted">+</span>
        <span className="absolute -bottom-2 -left-2 font-mono text-xs text-text-muted">+</span>
        <span className="absolute -bottom-2 -right-2 font-mono text-xs text-text-muted">+</span>

        <div className="grid grid-cols-2 border border-line divide-x divide-y divide-line">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              className="flex flex-col gap-1.5 p-4 bg-background"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.1, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="label text-text-muted text-[10px]">{item.label}</span>
              <span className={`font-mono text-lg font-bold truncate ${item.highlight ? "text-primary" : "text-text-primary"}`}>
                {item.value}
              </span>
              <span className="text-[10px] text-text-muted">{item.detail}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.p
        className="relative z-10 mt-6 font-mono text-xs text-text-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        // the highlight reel
      </motion.p>
    </div>
  );
}

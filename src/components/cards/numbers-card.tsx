"use client";

import { motion } from "motion/react";
import type { CardProps } from "@/lib/types";
import { formatHours } from "@/lib/format";

function AnimatedStat({
  label,
  value,
  delay,
}: {
  label: string;
  value: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 200 }}
      className="flex flex-col items-center gap-1"
    >
      <span className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
        {value}
      </span>
      <span className="text-sm font-medium tracking-wide text-white/40 uppercase">
        {label}
      </span>
    </motion.div>
  );
}

export function NumbersCard({ payload }: CardProps) {
  const { stats } = payload;

  return (
    <div className="flex flex-col items-center gap-10 py-8">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm font-medium tracking-[0.2em] text-[#D97757] uppercase"
      >
        The Numbers
      </motion.h2>

      <div className="grid grid-cols-2 gap-x-16 gap-y-10">
        <AnimatedStat
          label="Sessions"
          value={stats.sessions.toLocaleString()}
          delay={0.2}
        />
        <AnimatedStat
          label="Messages"
          value={stats.messages.toLocaleString()}
          delay={0.4}
        />
        <AnimatedStat
          label="Hours"
          value={formatHours(stats.hours)}
          delay={0.6}
        />
        <AnimatedStat
          label="Active Days"
          value={stats.days.toLocaleString()}
          delay={0.8}
        />
      </div>

      {stats.commits > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5"
        >
          <span className="text-sm text-white/60">
            <span className="font-bold text-white">
              {stats.commits.toLocaleString()}
            </span>{" "}
            commits assisted
          </span>
        </motion.div>
      )}
    </div>
  );
}

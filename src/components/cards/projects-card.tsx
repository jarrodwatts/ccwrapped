"use client";

import { motion } from "motion/react";
import type { CardProps } from "@/lib/types";

export function ProjectsCard({ payload }: CardProps) {
  const { projectCount, highlights } = payload;

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm font-medium tracking-[0.2em] text-[#D97757] uppercase"
      >
        Your Projects
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: "spring" }}
        className="flex flex-col items-center gap-3"
      >
        <span className="text-7xl font-bold tracking-tight text-white">
          {projectCount}
        </span>
        <span className="text-lg text-white/50">projects worked on</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-6"
      >
        <span className="text-xs font-medium tracking-widest text-white/40 uppercase">
          Most Active
        </span>
        <span className="text-2xl font-bold text-white">
          {highlights.topProject}
        </span>
      </motion.div>
    </div>
  );
}

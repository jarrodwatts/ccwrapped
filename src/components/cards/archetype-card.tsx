"use client";

import { motion } from "motion/react";
import type { WrappedPayload } from "@/lib/types";
import { getArchetypeDefinition } from "@/lib/archetype";

interface ArchetypeCardProps {
  payload: WrappedPayload;
}

export function ArchetypeCard({ payload }: ArchetypeCardProps) {
  const def = getArchetypeDefinition(payload.archetype);

  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden px-8 text-center">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[120px]" />
      </div>

      {/* Grid pattern */}
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-20" />

      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <span className="text-7xl sm:text-8xl">{def.emoji}</span>
      </motion.div>

      <motion.div
        className="relative z-10 mt-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <span className="label mb-2 block">You are</span>
        <h2 className="text-gradient glow-text text-4xl font-bold sm:text-5xl">
          {def.name}
        </h2>
      </motion.div>

      <motion.div
        className="card-industrial relative z-10 mt-8 max-w-sm px-6 py-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <p className="text-base leading-relaxed text-text-secondary">
          {def.description}
        </p>
      </motion.div>
    </div>
  );
}

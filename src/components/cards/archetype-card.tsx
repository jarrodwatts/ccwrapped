"use client";

import { motion } from "motion/react";
import type { CardProps } from "@/lib/types";
import { ARCHETYPES } from "@/config/archetypes";

export function ArchetypeCard({ payload }: CardProps) {
  const config = ARCHETYPES[payload.archetype];

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12 text-center">
      {/* Glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[#D97757]/15 blur-[120px]" />
      </div>

      <motion.span
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        className="text-8xl"
      >
        {config.emoji}
      </motion.span>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-xs font-medium tracking-[0.2em] text-[#D97757] uppercase"
      >
        You are
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, type: "spring" }}
        className="text-4xl font-bold tracking-tight text-white sm:text-5xl"
      >
        {config.name}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="max-w-md text-base leading-relaxed text-white/50"
      >
        {config.description}
      </motion.p>
    </div>
  );
}

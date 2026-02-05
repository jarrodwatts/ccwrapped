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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(217,119,87,0.12)_0%,transparent_60%)]" />

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
        <p className="mb-2 font-mono text-xs tracking-widest text-white/30 uppercase">
          You are
        </p>
        <h2 className="bg-gradient-to-r from-[#D97757] to-[#E8956F] bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
          {def.name}
        </h2>
      </motion.div>

      <motion.p
        className="relative z-10 mt-6 max-w-sm text-base leading-relaxed text-white/60"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        {def.description}
      </motion.p>
    </div>
  );
}

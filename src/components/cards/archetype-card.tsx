"use client";

import { motion } from "motion/react";
import type { WrappedPayload } from "@/lib/types";
import { getArchetypeDefinition } from "@/lib/archetype";
import { Card } from "@/components/ui/card";
import { TerminalLabel } from "@/components/ui/terminal-label";

interface ArchetypeCardProps {
  payload: WrappedPayload;
}

export function ArchetypeCard({ payload }: ArchetypeCardProps) {
  const def = getArchetypeDefinition(payload.archetype);

  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden px-8 text-center">
      {/* Background glow - the archetype card gets more coral */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[150px]" />
      </div>

      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <span className="text-6xl sm:text-7xl">{def.emoji}</span>
      </motion.div>

      <motion.div
        className="relative z-10 mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <TerminalLabel variant="bracket" className="mb-3 block">
          YOU ARE
        </TerminalLabel>
        <h2 className="text-gradient glow-text text-3xl font-bold sm:text-4xl lg:text-5xl">
          {def.name}
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mt-8"
      >
        <Card variant="terminal" className="max-w-sm px-6 py-5" showCorners>
          <p className="text-sm leading-relaxed text-text-secondary">
            {def.description}
          </p>
        </Card>
      </motion.div>

      {def.quip && (
        <motion.p
          className="relative z-10 mt-6 font-mono text-xs text-text-muted italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {def.quip}
        </motion.p>
      )}
    </div>
  );
}

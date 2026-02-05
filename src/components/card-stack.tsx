"use client";

import { useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { WrappedPayload } from "@/lib/types";
import { IntroCard } from "./cards/intro-card";
import { NumbersCard } from "./cards/numbers-card";
import { ProjectsCard } from "./cards/projects-card";
import { ToolsCard } from "./cards/tools-card";
import { HeatmapCard } from "./cards/heatmap-card";
import { WinsCard } from "./cards/wins-card";
import { StreakCard } from "./cards/streak-card";
import { ArchetypeCard } from "./cards/archetype-card";
import { HighlightsCard } from "./cards/highlights-card";
import { ShareCard } from "./cards/share-card";

const CARDS = [
  IntroCard,
  NumbersCard,
  ProjectsCard,
  ToolsCard,
  HeatmapCard,
  WinsCard,
  StreakCard,
  ArchetypeCard,
  HighlightsCard,
  ShareCard,
] as const;

interface CardStackProps {
  payload: WrappedPayload;
  slug: string;
}

export function CardStack({ payload, slug }: CardStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const goNext = useCallback(() => {
    if (currentIndex < CARDS.length - 1) {
      setDirection(1);
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((i) => i - 1);
    }
  }, [currentIndex]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev]);

  const CurrentCard = CARDS[currentIndex]!;

  return (
    <div className="relative flex h-dvh w-full flex-col items-center justify-center overflow-hidden bg-[#0A0A0A]">
      {/* Progress bar */}
      <div className="absolute top-0 left-0 z-10 flex w-full gap-1 p-3">
        {CARDS.map((_, i) => (
          <div
            key={i}
            className="h-1 flex-1 overflow-hidden rounded-full bg-white/10"
          >
            <div
              className="h-full rounded-full bg-[#D97757] transition-all duration-300"
              style={{ width: i <= currentIndex ? "100%" : "0%" }}
            />
          </div>
        ))}
      </div>

      {/* Card area */}
      <div className="relative flex h-full w-full max-w-2xl items-center justify-center px-6">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction * 80, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: direction * -80, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full"
          >
            <CurrentCard payload={payload} slug={slug} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation hint */}
      <div className="absolute bottom-6 flex items-center gap-4 text-sm text-white/30">
        <button
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="rounded-lg px-3 py-1.5 transition-colors hover:bg-white/5 disabled:opacity-20"
        >
          ← Back
        </button>
        <span>
          {currentIndex + 1} / {CARDS.length}
        </span>
        <button
          onClick={goNext}
          disabled={currentIndex === CARDS.length - 1}
          className="rounded-lg px-3 py-1.5 transition-colors hover:bg-white/5 disabled:opacity-20"
        >
          Next →
        </button>
      </div>

      {/* Click zones */}
      <div
        className="absolute top-0 left-0 h-full w-1/3 cursor-pointer"
        onClick={goPrev}
      />
      <div
        className="absolute top-0 right-0 h-full w-1/3 cursor-pointer"
        onClick={goNext}
      />
    </div>
  );
}

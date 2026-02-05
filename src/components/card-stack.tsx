"use client";

import { useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { WrappedPayload } from "@/lib/types";
import { IntroCard } from "@/components/cards/intro-card";
import { NumbersCard } from "@/components/cards/numbers-card";
import { ProjectsCard } from "@/components/cards/projects-card";
import { ToolsCard } from "@/components/cards/tools-card";
import { HeatmapCard } from "@/components/cards/heatmap-card";
import { WinsCard } from "@/components/cards/wins-card";
import { StreakCard } from "@/components/cards/streak-card";
import { ArchetypeCard } from "@/components/cards/archetype-card";
import { HighlightsCard } from "@/components/cards/highlights-card";
import { ShareCard } from "@/components/cards/share-card";

interface CardStackProps {
  payload: WrappedPayload;
  slug: string;
}

const CARD_KEYS = [
  "intro",
  "numbers",
  "projects",
  "tools",
  "heatmap",
  "wins",
  "streak",
  "archetype",
  "highlights",
  "share",
] as const;

export function CardStack({ payload, slug }: CardStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const totalCards = CARD_KEYS.length;

  const goNext = useCallback(() => {
    if (currentIndex < totalCards - 1) {
      setDirection(1);
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, totalCards]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((i) => i - 1);
    }
  }, [currentIndex]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev]);

  function renderCard(key: string): React.ReactNode {
    switch (key) {
      case "intro":
        return <IntroCard payload={payload} />;
      case "numbers":
        return <NumbersCard payload={payload} />;
      case "projects":
        return <ProjectsCard payload={payload} />;
      case "tools":
        return <ToolsCard payload={payload} />;
      case "heatmap":
        return <HeatmapCard payload={payload} />;
      case "wins":
        return <WinsCard payload={payload} />;
      case "streak":
        return <StreakCard payload={payload} />;
      case "archetype":
        return <ArchetypeCard payload={payload} />;
      case "highlights":
        return <HighlightsCard payload={payload} />;
      case "share":
        return <ShareCard payload={payload} slug={slug} />;
      default:
        return null;
    }
  }

  return (
    <div className="relative flex h-screen w-full flex-col bg-[#0A0A0A]">
      {/* Progress bar */}
      <div className="absolute top-0 right-0 left-0 z-20 flex gap-1 p-3">
        {CARD_KEYS.map((key, i) => (
          <div
            key={key}
            className="h-1 flex-1 overflow-hidden rounded-full bg-white/10"
          >
            <motion.div
              className="h-full rounded-full bg-[#D97757]"
              initial={false}
              animate={{ width: i <= currentIndex ? "100%" : "0%" }}
              transition={{ duration: 0.3 }}
            />
          </div>
        ))}
      </div>

      {/* Card area */}
      <div
        className="relative flex-1 cursor-pointer overflow-hidden"
        onClick={goNext}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={CARD_KEYS[currentIndex]}
            className="absolute inset-0"
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {renderCard(CARD_KEYS[currentIndex])}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation hint */}
      <div className="flex items-center justify-center gap-4 py-3 text-xs text-white/20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          disabled={currentIndex === 0}
          className="px-2 py-1 disabled:opacity-20"
        >
          ← Prev
        </button>
        <span>
          {currentIndex + 1} / {totalCards}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          disabled={currentIndex === totalCards - 1}
          className="px-2 py-1 disabled:opacity-20"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

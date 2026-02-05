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
import { Button } from "@/components/ui/button";

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
    <div className="relative flex h-screen w-full flex-col bg-background">
      {/* Structural grid background */}
      <div className="pointer-events-none fixed inset-0 grid-pattern opacity-20" />

      {/* Header with progress */}
      <div className="relative z-20 border-b border-line bg-background/90 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="font-mono text-xs text-text-muted">
            {String(currentIndex + 1).padStart(2, "0")}
          </span>
          <span className="label">WRAPPED</span>
          <span className="font-mono text-xs text-text-muted">
            {currentIndex + 1}/{totalCards}
          </span>
        </div>
        {/* Progress bar - monochrome with coral for current */}
        <div className="flex gap-px px-4 pb-3">
          {CARD_KEYS.map((key, i) => (
            <div
              key={key}
              className="h-0.5 flex-1 overflow-hidden bg-gray-4"
            >
              <motion.div
                className={`h-full ${i === currentIndex ? "bg-primary" : "bg-gray-8"}`}
                initial={false}
                animate={{ width: i <= currentIndex ? "100%" : "0%" }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          ))}
        </div>
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
            initial={{ opacity: 0, x: direction > 0 ? 60 : -60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -60 : 60 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 35,
            }}
          >
            {renderCard(CARD_KEYS[currentIndex])}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="relative z-20 border-t border-line bg-background/90 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Button
            variant="terminal"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            disabled={currentIndex === 0}
          >
            ← PREV
          </Button>
          <span className="font-mono text-xs text-text-muted">
            tap or →
          </span>
          <Button
            variant="terminal"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            disabled={currentIndex === totalCards - 1}
          >
            NEXT →
          </Button>
        </div>
      </div>
    </div>
  );
}

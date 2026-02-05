"use client";

import { useState, useCallback } from "react";
import { motion } from "motion/react";
import type { CardProps } from "@/lib/types";
import { ARCHETYPES } from "@/config/archetypes";

export function ShareCard({ payload, slug }: CardProps) {
  const [copied, setCopied] = useState(false);
  const config = ARCHETYPES[payload.archetype];

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/w/${slug}`
      : `/w/${slug}`;

  const tweetText = `${config.emoji} I'm ${config.name} — Claude Code Wrapped\n\n${payload.stats.sessions.toLocaleString()} sessions · ${payload.stats.messages.toLocaleString()} messages · ${payload.highlights.longestStreak}-day streak\n\nGet yours:`;

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [shareUrl]);

  const handleTweet = useCallback(() => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }, [tweetText, shareUrl]);

  const handleLinkedIn = useCallback(() => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }, [shareUrl]);

  return (
    <div className="flex flex-col items-center gap-8 py-8 text-center">
      {/* Glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#D97757]/10 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring" }}
        className="flex flex-col items-center gap-3"
      >
        <span className="text-6xl">{config.emoji}</span>
        <h2 className="text-3xl font-bold tracking-tight text-white">
          {config.name}
        </h2>
        <p className="text-sm text-white/50">{config.shortDescription}</p>
      </motion.div>

      {/* Stats summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-4 text-sm text-white/60"
      >
        <span>{payload.stats.sessions.toLocaleString()} sessions</span>
        <span className="text-white/20">·</span>
        <span>{payload.stats.messages.toLocaleString()} messages</span>
        <span className="text-white/20">·</span>
        <span>{payload.highlights.longestStreak}d streak</span>
      </motion.div>

      {/* Share buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col gap-3 w-full max-w-xs"
      >
        <button
          onClick={handleTweet}
          className="flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <XIcon />
          Share on X
        </button>

        <button
          onClick={handleLinkedIn}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Share on LinkedIn
        </button>

        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {copied ? "Copied!" : "Copy Link"}
        </button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-xs text-white/30"
      >
        Only aggregate stats are shared — no code, prompts, or project names.
      </motion.p>
    </div>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

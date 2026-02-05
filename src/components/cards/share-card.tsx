"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { WrappedPayload } from "@/lib/types";
import { getArchetypeDefinition } from "@/lib/archetype";
import { formatNumber } from "@/lib/format";
import { Button } from "@/components/ui/button";

interface ShareCardProps {
  payload: WrappedPayload;
  slug: string;
}

export function ShareCard({ payload, slug }: ShareCardProps) {
  const [copied, setCopied] = useState(false);
  const def = getArchetypeDefinition(payload.archetype);

  const shareUrl = `https://ccwrapped.com/w/${slug}`;
  const tweetText = `I'm ${def.name} ${def.emoji} — ${formatNumber(payload.stats.sessions)} sessions, ${formatNumber(payload.stats.messages)} messages, ${payload.streaks.longest}-day streak.\n\nGet your Claude Code Wrapped:`;

  function handleCopyLink(): void {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleShareTwitter(): void {
    const url = `https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "noopener");
  }

  function handleShareLinkedIn(): void {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "noopener");
  }

  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden px-8 text-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(217,119,87,0.08)_0%,transparent_60%)]" />

      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-5xl">{def.emoji}</span>
        <h2 className="mt-4 bg-gradient-to-r from-[#D97757] to-[#E8956F] bg-clip-text text-3xl font-bold text-transparent">
          {def.name}
        </h2>
        <p className="mt-2 font-mono text-sm text-white/40">
          {formatNumber(payload.stats.sessions)} sessions &middot;{" "}
          {formatNumber(payload.stats.messages)} messages &middot;{" "}
          {payload.streaks.longest}-day streak
        </p>
      </motion.div>

      <motion.div
        className="relative z-10 mt-8 flex flex-col gap-3 sm:flex-row"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          onClick={handleShareTwitter}
          className="bg-[#D97757] text-white hover:bg-[#C4613F]"
        >
          Share on X
        </Button>
        <Button
          onClick={handleShareLinkedIn}
          variant="outline"
          className="border-white/10 text-white/70 hover:bg-white/5"
        >
          Share on LinkedIn
        </Button>
        <Button
          onClick={handleCopyLink}
          variant="outline"
          className="border-white/10 text-white/70 hover:bg-white/5"
        >
          {copied ? "Copied!" : "Copy Link"}
        </Button>
      </motion.div>

      <motion.p
        className="relative z-10 mt-10 text-xs text-white/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        ccwrapped.com
      </motion.p>
    </div>
  );
}

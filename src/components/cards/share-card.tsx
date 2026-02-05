"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { WrappedPayload } from "@/lib/types";
import { getArchetypeDefinition } from "@/lib/archetype";
import { formatNumber } from "@/lib/format";

interface ShareCardProps {
  payload: WrappedPayload;
  slug: string;
}

export function ShareCard({ payload, slug }: ShareCardProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [imageCopied, setImageCopied] = useState(false);
  const def = getArchetypeDefinition(payload.archetype);

  const shareUrl = `https://ccwrapped.com/w/${slug}`;
  const ogImageUrl = `/api/og/${slug}`;
  const tweetText = `I'm ${def.name} ${def.emoji} — ${formatNumber(payload.stats.sessions)} sessions, ${formatNumber(payload.stats.messages)} messages, ${payload.streaks.longest}-day streak.\n\nGet your Claude Code Wrapped:`;

  function handleCopyLink(): void {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleDownloadImage(): Promise<void> {
    setDownloading(true);
    try {
      const response = await fetch(ogImageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "claude-code-wrapped.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  }

  async function handleCopyImage(): Promise<void> {
    try {
      const response = await fetch(ogImageUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      setImageCopied(true);
      setTimeout(() => setImageCopied(false), 2000);
    } catch {
      // Silently fail if clipboard API not supported
    }
  }

  function handleShareTwitter(): void {
    const url = `https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "noopener");
  }

  const supportsClipboardItem =
    typeof window !== "undefined" && "ClipboardItem" in window;

  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden px-4 py-6">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-20" />

      {/* Header */}
      <motion.div
        className="relative z-10 mb-4 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-semibold text-text-primary">Share Your Card</h2>
        <p className="mt-1 text-sm text-text-tertiary">Download or share your Claude Code Wrapped</p>
      </motion.div>

      {/* OG Image Preview */}
      <motion.div
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-xl border border-border shadow-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <img
          src={ogImageUrl}
          alt={`${def.name} - Claude Code Wrapped`}
          className="w-full"
        />
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        className="relative z-10 mt-6 flex w-full max-w-lg gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <button
          onClick={handleDownloadImage}
          disabled={downloading}
          className="btn-tactile flex flex-1 items-center justify-center gap-2 py-4 text-sm font-medium text-text-secondary hover:text-text-primary disabled:opacity-50"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {downloading ? "Saving..." : "Save Image"}
        </button>

        {supportsClipboardItem && (
          <button
            onClick={handleCopyImage}
            className="btn-tactile flex flex-1 items-center justify-center gap-2 py-4 text-sm font-medium text-text-secondary hover:text-text-primary"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {imageCopied ? "Copied!" : "Copy"}
          </button>
        )}

        <button
          onClick={handleShareTwitter}
          className="btn-tactile flex flex-1 items-center justify-center gap-2 bg-primary py-4 text-sm font-medium text-white hover:bg-primary-hover"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Share
        </button>
      </motion.div>

      {/* Copy link */}
      <motion.button
        onClick={handleCopyLink}
        className="relative z-10 mt-4 text-sm text-text-muted hover:text-text-secondary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {copied ? "Link copied!" : "Copy link to clipboard"}
      </motion.button>

      <motion.p
        className="relative z-10 mt-6 text-xs text-text-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        ccwrapped.com
      </motion.p>
    </div>
  );
}

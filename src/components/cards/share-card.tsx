"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { WrappedPayload } from "@/lib/types";
import { getArchetypeDefinition } from "@/lib/archetype";
import { formatNumber } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { TerminalLabel } from "@/components/ui/terminal-label";
import { Skeleton } from "@/components/ui/skeleton";

interface ShareCardProps {
  payload: WrappedPayload;
  slug: string;
}

export function ShareCard({ payload, slug }: ShareCardProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [imageCopied, setImageCopied] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [copying, setCopying] = useState(false);
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
      a.download = "ccwrapped.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  }

  async function handleCopyImage(): Promise<void> {
    setCopying(true);
    try {
      const response = await fetch(ogImageUrl);
      const blob = await response.blob();
      const pngBlob = new Blob([blob], { type: "image/png" });
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": pngBlob }),
      ]);
      setImageCopied(true);
      setTimeout(() => setImageCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy image:", error);
      try {
        await navigator.clipboard.writeText(ogImageUrl);
        setImageCopied(true);
        setTimeout(() => setImageCopied(false), 2000);
      } catch {
        // Final fallback failed
      }
    } finally {
      setCopying(false);
    }
  }

  function handleShareTwitter(): void {
    const url = `https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "noopener");
  }

  function handleFullscreen(): void {
    window.open(ogImageUrl, "_blank", "noopener");
  }

  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden px-4 py-6">
      {/* Header */}
      <motion.div
        className="relative z-10 mb-4 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <TerminalLabel variant="bracket">SHARE</TerminalLabel>
        <p className="mt-3 text-sm text-text-tertiary">Download or share your wrapped</p>
      </motion.div>

      {/* OG Image Preview */}
      <motion.div
        className="relative z-10 w-full max-w-md overflow-hidden border border-line"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Corner markers */}
        <span className="absolute -top-1 -left-1 font-mono text-[10px] text-text-muted z-10">+</span>
        <span className="absolute -top-1 -right-1 font-mono text-[10px] text-text-muted z-10">+</span>
        <span className="absolute -bottom-1 -left-1 font-mono text-[10px] text-text-muted z-10">+</span>
        <span className="absolute -bottom-1 -right-1 font-mono text-[10px] text-text-muted z-10">+</span>

        {!imageLoaded && (
          <Skeleton className="w-full aspect-[1200/630]" />
        )}
        <img
          src={ogImageUrl}
          alt={`${def.name} - Claude Code Wrapped`}
          className={`w-full transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0 absolute"}`}
          onLoad={() => setImageLoaded(true)}
        />
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        className="relative z-10 mt-6 flex w-full max-w-md gap-2"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <Button
          variant="terminal"
          className="flex-1 py-3"
          onClick={handleDownloadImage}
          disabled={downloading}
        >
          <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {downloading ? "..." : "Save"}
        </Button>

        <Button
          variant="terminal"
          className="flex-1 py-3"
          onClick={handleCopyImage}
          disabled={copying}
        >
          <span className="flex items-center">
            {imageCopied ? (
              <>
                <svg className="h-4 w-4 mr-1.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : copying ? (
              <>
                <svg className="h-4 w-4 mr-1.5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Copying...
              </>
            ) : (
              <>
                <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </>
            )}
          </span>
        </Button>

        <Button
          variant="default"
          className="flex-1 py-3"
          onClick={handleShareTwitter}
        >
          <svg className="h-4 w-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Share
        </Button>
      </motion.div>

      {/* Fullscreen Button */}
      <motion.div
        className="relative z-10 mt-3 w-full max-w-md"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          variant="terminal"
          className="w-full py-2.5"
          onClick={handleFullscreen}
        >
          <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
          View Fullscreen
        </Button>
      </motion.div>

      {/* Copy link */}
      <motion.button
        onClick={handleCopyLink}
        className="relative z-10 mt-4 font-mono text-xs text-text-muted hover:text-text-secondary transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {copied ? "// link copied!" : "// copy link"}
      </motion.button>

      <motion.p
        className="relative z-10 mt-6 font-mono text-[10px] text-text-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        ccwrapped.com
      </motion.p>
    </div>
  );
}

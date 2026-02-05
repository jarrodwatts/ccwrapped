"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Pattern = "noise" | "grid" | "rain" | "dots";

interface AsciiBackgroundProps {
  pattern?: Pattern;
  opacity?: number;
  speed?: "slow" | "medium" | "fast";
  className?: string;
  color?: string;
}

const ASCII_CHARS = " .·:;+*#@";
const RAIN_CHARS = "ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ01234567890";

const SPEED_MAP = {
  slow: 100,
  medium: 50,
  fast: 25,
};

export function AsciiBackground({
  pattern = "noise",
  opacity = 0.08,
  speed = "slow",
  className,
  color = "currentColor",
}: AsciiBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let lastTime = 0;
    const interval = SPEED_MAP[speed];

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const fontSize = 14;
    const cols = Math.floor(canvas.width / fontSize);
    const rows = Math.floor(canvas.height / fontSize);

    // State for different patterns
    const rainDrops = Array(cols).fill(0);
    const noiseGrid: number[][] = [];
    for (let i = 0; i < cols; i++) {
      noiseGrid[i] = [];
      for (let j = 0; j < rows; j++) {
        noiseGrid[i][j] = Math.random();
      }
    }

    const render = (time: number) => {
      if (prefersReducedMotion) {
        // Static render for reduced motion
        drawStatic(ctx, canvas.width, canvas.height, fontSize, cols, rows, pattern, color, noiseGrid);
        return;
      }

      if (time - lastTime >= interval) {
        lastTime = time;

        ctx.fillStyle = "rgba(5, 5, 5, 0.1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = color;
        ctx.font = `${fontSize}px "Geist Mono", monospace`;

        switch (pattern) {
          case "rain":
            drawRain(ctx, rainDrops, cols, rows, fontSize);
            break;
          case "grid":
            drawGrid(ctx, cols, rows, fontSize, time);
            break;
          case "dots":
            drawDots(ctx, cols, rows, fontSize, time);
            break;
          case "noise":
          default:
            drawNoise(ctx, noiseGrid, cols, rows, fontSize);
            break;
        }
      }

      animationId = requestAnimationFrame(render);
    };

    // Initial static render
    drawStatic(ctx, canvas.width, canvas.height, fontSize, cols, rows, pattern, color, noiseGrid);

    if (!prefersReducedMotion) {
      animationId = requestAnimationFrame(render);
    }

    return () => {
      window.removeEventListener("resize", resize);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [pattern, speed, color, prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        "pointer-events-none fixed inset-0 h-full w-full",
        className
      )}
      style={{ opacity }}
      aria-hidden="true"
    />
  );
}

function drawStatic(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  fontSize: number,
  cols: number,
  rows: number,
  pattern: Pattern,
  color: string,
  noiseGrid: number[][]
) {
  ctx.fillStyle = "rgba(5, 5, 5, 1)";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = color;
  ctx.font = `${fontSize}px "Geist Mono", monospace`;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = i * fontSize;
      const y = j * fontSize;

      let char: string;
      switch (pattern) {
        case "grid":
          char = (i + j) % 4 === 0 ? "+" : " ";
          break;
        case "dots":
          char = (i + j) % 3 === 0 ? "·" : " ";
          break;
        case "rain":
        case "noise":
        default:
          const idx = Math.floor(noiseGrid[i]?.[j] * ASCII_CHARS.length) || 0;
          char = ASCII_CHARS[idx];
          break;
      }

      ctx.fillText(char, x, y + fontSize);
    }
  }
}

function drawNoise(
  ctx: CanvasRenderingContext2D,
  noiseGrid: number[][],
  cols: number,
  rows: number,
  fontSize: number
) {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      // Slowly evolve noise
      noiseGrid[i][j] += (Math.random() - 0.5) * 0.1;
      noiseGrid[i][j] = Math.max(0, Math.min(1, noiseGrid[i][j]));

      const idx = Math.floor(noiseGrid[i][j] * ASCII_CHARS.length);
      const char = ASCII_CHARS[idx];
      const x = i * fontSize;
      const y = j * fontSize;

      ctx.fillText(char, x, y + fontSize);
    }
  }
}

function drawRain(
  ctx: CanvasRenderingContext2D,
  drops: number[],
  cols: number,
  rows: number,
  fontSize: number
) {
  for (let i = 0; i < cols; i++) {
    const char = RAIN_CHARS[Math.floor(Math.random() * RAIN_CHARS.length)];
    const x = i * fontSize;
    const y = drops[i] * fontSize;

    ctx.fillText(char, x, y);

    if (y > rows * fontSize && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

function drawGrid(
  ctx: CanvasRenderingContext2D,
  cols: number,
  rows: number,
  fontSize: number,
  time: number
) {
  const phase = Math.floor(time / 1000) % 4;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = i * fontSize;
      const y = j * fontSize;

      let char = " ";
      const isIntersection = i % 6 === 0 && j % 4 === 0;
      const isHLine = j % 4 === 0;
      const isVLine = i % 6 === 0;

      if (isIntersection) {
        char = "+";
      } else if (isHLine) {
        char = (i + phase) % 3 === 0 ? "-" : " ";
      } else if (isVLine) {
        char = (j + phase) % 3 === 0 ? "|" : " ";
      }

      ctx.fillText(char, x, y + fontSize);
    }
  }
}

function drawDots(
  ctx: CanvasRenderingContext2D,
  cols: number,
  rows: number,
  fontSize: number,
  time: number
) {
  const waveOffset = time / 1000;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = i * fontSize;
      const y = j * fontSize;

      const wave = Math.sin(i * 0.2 + waveOffset) + Math.sin(j * 0.2 + waveOffset);
      const normalizedWave = (wave + 2) / 4;
      const idx = Math.floor(normalizedWave * ASCII_CHARS.length);
      const char = ASCII_CHARS[idx];

      ctx.fillText(char, x, y + fontSize);
    }
  }
}

export default AsciiBackground;

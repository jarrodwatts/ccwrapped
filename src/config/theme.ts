/**
 * Theme configuration for Claude Code Wrapped
 *
 * Design system: Terminal aesthetic with monochrome base
 * Coral (#E85A4F) is reserved for:
 * - Primary CTAs (one per screen)
 * - Key data highlights
 * - Interactive focus states
 */
export const THEME = {
  colors: {
    // Accent - use sparingly
    primary: "#E85A4F",
    primaryHover: "#F06B60",
    primaryMuted: "rgba(232, 90, 79, 0.12)",

    // Backgrounds
    background: "#050505",
    surface: "#0A0A0A",
    surfaceRaised: "#0F0F0F",
    surfaceElevated: "#141414",

    // Gray scale
    gray: {
      1: "#0A0A0A",
      2: "#0F0F0F",
      3: "#141414",
      4: "#1A1A1A",
      5: "#222222",
      6: "#2A2A2A",
      7: "#333333",
      8: "#444444",
      9: "#555555",
      10: "#777777",
      11: "#999999",
      12: "#FAFAFA",
    },

    // Text
    text: "#FAFAFA",
    textSecondary: "#999999",
    textTertiary: "#666666",
    textMuted: "#444444",

    // Borders
    border: "rgba(255, 255, 255, 0.06)",
    borderStrong: "rgba(255, 255, 255, 0.10)",
    line: "rgba(255, 255, 255, 0.08)",
  },

  gradients: {
    primary: "linear-gradient(135deg, #E85A4F 0%, #F5A088 100%)",
    glow: "radial-gradient(circle at 50% 0%, rgba(232, 90, 79, 0.12) 0%, transparent 50%)",
    glowSubtle: "radial-gradient(circle at 50% 0%, rgba(232, 90, 79, 0.06) 0%, transparent 40%)",
  },

  motion: {
    durationFast: "150ms",
    durationNormal: "250ms",
    durationSlow: "400ms",
    easeOut: "cubic-bezier(0.16, 1, 0.3, 1)",
    easeInOut: "cubic-bezier(0.65, 0, 0.35, 1)",
  },
} as const;

export const THEME = {
  colors: {
    primary: "#D97757",
    primaryLight: "#E8956F",
    primaryDark: "#C4613F",
    background: "#0A0A0A",
    backgroundLight: "#141414",
    surface: "#1A1A1A",
    surfaceLight: "#242424",
    text: "#FFFFFF",
    textSecondary: "rgba(255, 255, 255, 0.7)",
    textMuted: "rgba(255, 255, 255, 0.4)",
    border: "rgba(255, 255, 255, 0.1)",
    borderLight: "rgba(255, 255, 255, 0.05)",
  },
  gradients: {
    primary: "linear-gradient(135deg, #D97757 0%, #E8956F 100%)",
    card: "linear-gradient(180deg, #141414 0%, #0A0A0A 100%)",
    glow: "radial-gradient(circle at 50% 0%, rgba(217, 119, 87, 0.15) 0%, transparent 60%)",
  },
} as const;

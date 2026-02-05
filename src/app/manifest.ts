import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Claude Code Wrapped",
    short_name: "CC Wrapped",
    description:
      "Your year with Claude Code — sessions, tools, streaks, and personality.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#f87171",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}

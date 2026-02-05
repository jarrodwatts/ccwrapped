import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Claude Code Wrapped",
    template: "%s | Claude Code Wrapped",
  },
  description:
    "Your year with Claude Code — sessions, tools, streaks, and personality. Generate and share your stats.",
  keywords: [
    "claude code",
    "wrapped",
    "anthropic",
    "ai coding",
    "developer stats",
    "coding personality",
    "year in review",
  ],
  authors: [{ name: "Jarrod Watts", url: "https://github.com/jarrodwatts" }],
  creator: "Jarrod Watts",
  openGraph: {
    title: "Claude Code Wrapped",
    description:
      "Your year with Claude Code — sessions, tools, streaks, and personality.",
    siteName: "Claude Code Wrapped",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Claude Code Wrapped",
    description:
      "Your year with Claude Code — sessions, tools, streaks, and personality.",
    creator: "@jaraborwatts",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}

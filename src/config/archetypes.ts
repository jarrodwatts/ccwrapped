import type { Archetype } from "@/lib/types";

export interface ArchetypeConfig {
  name: string;
  emoji: string;
  description: string;
  shortDescription: string;
}

export const ARCHETYPES: Record<Archetype, ArchetypeConfig> = {
  night_owl: {
    name: "The Night Owl",
    emoji: "🦉",
    description:
      "While the world sleeps, you code. Over 40% of your sessions happen between 10pm and 4am.",
    shortDescription: "Codes when the world sleeps",
  },
  marathoner: {
    name: "The Marathoner",
    emoji: "🏃",
    description:
      "You don't do short sessions. Your average session is 45+ minutes, with deep dives lasting hours.",
    shortDescription: "Long sessions, deep focus",
  },
  sprinter: {
    name: "The Sprinter",
    emoji: "⚡",
    description:
      "Quick in, quick out. 100+ sessions averaging under 10 minutes each. Efficiency is your superpower.",
    shortDescription: "Fast, focused, frequent",
  },
  bug_hunter: {
    name: "The Bug Hunter",
    emoji: "🐛",
    description:
      "You have a nose for bugs. Over 40% of your sessions are dedicated to fixing and debugging.",
    shortDescription: "Born to debug",
  },
  builder: {
    name: "The Builder",
    emoji: "🏗️",
    description:
      "You ship features. Over 40% of your sessions are about creating something new.",
    shortDescription: "Always building something new",
  },
  tool_master: {
    name: "The Tool Master",
    emoji: "🛠️",
    description:
      "You've used 15+ distinct tools. From Bash to LSP to Task agents — full toolkit mastery.",
    shortDescription: "Masters every tool available",
  },
  delegator: {
    name: "The Delegator",
    emoji: "👔",
    description:
      "You know how to delegate. Heavy Task and subagent usage shows you think in orchestration.",
    shortDescription: "Orchestrates, doesn't just execute",
  },
  streak_master: {
    name: "The Streak Master",
    emoji: "🔥",
    description:
      "Consistency is your game. A 14+ day usage streak — Claude Code is part of your daily routine.",
    shortDescription: "Unstoppable daily consistency",
  },
  polyglot: {
    name: "The Polyglot",
    emoji: "🌍",
    description:
      "You work across 5+ projects with substantial usage in each. Variety keeps things interesting.",
    shortDescription: "Works across many projects",
  },
  deep_diver: {
    name: "The Deep Diver",
    emoji: "🤿",
    description:
      "80%+ of your messages are in a single project. Total commitment to one codebase.",
    shortDescription: "Goes deep, not wide",
  },
  explorer: {
    name: "The Explorer",
    emoji: "🔍",
    description:
      "Heavy grep, glob, and read usage with many short sessions. Constantly navigating codebases.",
    shortDescription: "Always exploring and understanding",
  },
  pair_programmer: {
    name: "The Pair Programmer",
    emoji: "👥",
    description:
      "High messages per session with lots of back-and-forth. Claude Code is your true collaborator.",
    shortDescription: "Claude is your coding partner",
  },
};

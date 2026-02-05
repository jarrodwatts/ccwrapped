import type { Archetype } from "@/lib/types";

export interface ArchetypeDefinition {
  name: string;
  emoji: string;
  description: string;
  shortDescription: string;
}

export const ARCHETYPE_DEFINITIONS: Record<Archetype, ArchetypeDefinition> = {
  night_owl: {
    name: "The Night Owl",
    emoji: "🦉",
    description:
      "You thrive when the world sleeps. Most of your coding happens after 10pm — the quiet hours are your productive hours.",
    shortDescription: "Codes when the world sleeps",
  },
  marathoner: {
    name: "The Marathoner",
    emoji: "🏃",
    description:
      "You don't do quick fixes. Your sessions are deep, focused, and long — often stretching past the 3-hour mark.",
    shortDescription: "Deep, focused sessions",
  },
  sprinter: {
    name: "The Sprinter",
    emoji: "⚡",
    description:
      "Quick in, quick out. You fire off rapid sessions, each one surgical and precise. Quantity and speed are your game.",
    shortDescription: "Rapid-fire sessions",
  },
  bug_hunter: {
    name: "The Bug Hunter",
    emoji: "🐛",
    description:
      "You're drawn to the broken things. Most of your sessions are fixing, debugging, and squashing bugs.",
    shortDescription: "Drawn to fixing what's broken",
  },
  builder: {
    name: "The Builder",
    emoji: "🏗️",
    description:
      "You're always creating something new. Features, components, systems — you build more than you fix.",
    shortDescription: "Always creating something new",
  },
  tool_master: {
    name: "The Tool Master",
    emoji: "🛠️",
    description:
      "You wield the full arsenal. With 15+ distinct tools in your repertoire, there's nothing you can't automate.",
    shortDescription: "Wields the full tool arsenal",
  },
  delegator: {
    name: "The Delegator",
    emoji: "👔",
    description:
      "Why do it yourself when you can orchestrate? You're a power user of subagents and parallel task execution.",
    shortDescription: "Orchestrates agents like a boss",
  },
  streak_master: {
    name: "The Streak Master",
    emoji: "🔥",
    description:
      "Consistency is your superpower. You've maintained a coding streak that would make most developers jealous.",
    shortDescription: "Consistency is the superpower",
  },
  polyglot: {
    name: "The Polyglot",
    emoji: "🌍",
    description:
      "You don't stick to one project. Your coding spans across many repositories and problem domains.",
    shortDescription: "Spans many projects and domains",
  },
  deep_diver: {
    name: "The Deep Diver",
    emoji: "🤿",
    description:
      "You go deep, not wide. The vast majority of your work is focused on a single project — total immersion.",
    shortDescription: "Total immersion in one project",
  },
  explorer: {
    name: "The Explorer",
    emoji: "🔍",
    description:
      "You read more than you write. Your sessions are full of searching, reading, and understanding before acting.",
    shortDescription: "Reads before writing",
  },
  pair_programmer: {
    name: "The Pair Programmer",
    emoji: "👯",
    description:
      "You and Claude are a team. High back-and-forth, long conversations — you treat AI as a true collaborator.",
    shortDescription: "Claude is the other half",
  },
};

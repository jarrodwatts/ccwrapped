import type { Archetype } from "@/lib/types";

export interface ArchetypeDefinition {
  name: string;
  emoji: string;
  description: string;
  shortDescription: string;
  quip: string;
  terminalMsg: string;
}

export const ARCHETYPE_DEFINITIONS: Record<Archetype, ArchetypeDefinition> = {
  night_owl: {
    name: "The Night Owl",
    emoji: "🦉",
    description:
      "You thrive when the world sleeps. Most of your coding happens after 10pm — the quiet hours are your productive hours. When others are dreaming, you're shipping.",
    shortDescription: "Codes when the world sleeps",
    quip: "// TODO: implement sleep() — blocked by coding addiction",
    terminalMsg: "Peak productivity detected at 2:47 AM",
  },
  marathoner: {
    name: "The Marathoner",
    emoji: "🏃",
    description:
      "You don't do quick fixes. Your sessions are deep, focused, and long — often stretching past the 3-hour mark. Flow state is your natural habitat.",
    shortDescription: "Deep, focused sessions",
    quip: "// My IDE has a better relationship with me than my chair",
    terminalMsg: "Session duration: yes",
  },
  sprinter: {
    name: "The Sprinter",
    emoji: "⚡",
    description:
      "Quick in, quick out. You fire off rapid sessions, each one surgical and precise. Quantity and speed are your game. Ship it and move on.",
    shortDescription: "Rapid-fire sessions",
    quip: "// git commit -m 'fixed it' × 47",
    terminalMsg: "Average session: speedrun%",
  },
  bug_hunter: {
    name: "The Bug Hunter",
    emoji: "🐛",
    description:
      "You're drawn to the broken things. Most of your sessions are fixing, debugging, and squashing bugs. Where others see chaos, you see opportunity.",
    shortDescription: "Drawn to fixing what's broken",
    quip: "// It works on my machine™ (narrator: it didn't)",
    terminalMsg: "Bugs squashed: impressive (but there's more)",
  },
  builder: {
    name: "The Builder",
    emoji: "🏗️",
    description:
      "You're always creating something new. Features, components, systems — you build more than you fix. Greenfield is your happy place.",
    shortDescription: "Always creating something new",
    quip: "// Premature abstraction? Never heard of her",
    terminalMsg: "New files created: a concerning number",
  },
  tool_master: {
    name: "The Tool Master",
    emoji: "🛠️",
    description:
      "You wield the full arsenal. With 15+ distinct tools in your repertoire, there's nothing you can't automate. You've mastered tools most users don't know exist.",
    shortDescription: "Wields the full tool arsenal",
    quip: "// There's a tool for that. I've used all of them.",
    terminalMsg: "Tools mastered: all of them",
  },
  delegator: {
    name: "The Delegator",
    emoji: "👔",
    description:
      "Why do it yourself when you can orchestrate? You're a power user of subagents and parallel task execution. Management material.",
    shortDescription: "Orchestrates agents like a boss",
    quip: "// async/await but for my whole workflow",
    terminalMsg: "Subagents spawned: yes we're hiring",
  },
  streak_master: {
    name: "The Streak Master",
    emoji: "🔥",
    description:
      "Consistency is your superpower. You've maintained a coding streak that would make most developers jealous. Every day is ship day.",
    shortDescription: "Consistency is the superpower",
    quip: "// My streak > your excuses",
    terminalMsg: "Days without touching grass: calculating...",
  },
  polyglot: {
    name: "The Polyglot",
    emoji: "🌍",
    description:
      "You don't stick to one project. Your coding spans across many repositories and problem domains. Context switching is your cardio.",
    shortDescription: "Spans many projects and domains",
    quip: "// import * from './literally-everywhere'",
    terminalMsg: "Projects touched: yes",
  },
  deep_diver: {
    name: "The Deep Diver",
    emoji: "🤿",
    description:
      "You go deep, not wide. The vast majority of your work is focused on a single project — total immersion. You probably know every line.",
    shortDescription: "Total immersion in one project",
    quip: "// I've memorized the node_modules folder",
    terminalMsg: "Project focus: unhealthy (complimentary)",
  },
  explorer: {
    name: "The Explorer",
    emoji: "🔍",
    description:
      "You read more than you write. Your sessions are full of searching, reading, and understanding before acting. Measure twice, code once.",
    shortDescription: "Reads before writing",
    quip: "// Let me just check one more file...",
    terminalMsg: "Files read vs written: 47:1",
  },
  pair_programmer: {
    name: "The Pair Programmer",
    emoji: "👯",
    description:
      "You and Claude are a team. High back-and-forth, long conversations — you treat AI as a true collaborator. Rubber duck? More like rubber genius.",
    shortDescription: "Claude is the other half",
    quip: "// We finish each other's... code blocks",
    terminalMsg: "Messages exchanged: it's called collaboration",
  },
};

export const EASTER_EGG_MESSAGES = {
  zeroCommits: "// git status: existential crisis",
  thousandHours: "// Achievement unlocked: Touched grass? Never heard of it",
  perfectStreak: "// Consecutive days coding: Sleep is for the weak",
  allTools: "// Power level: Over 9000 tools",
  midnight: "// The best code is written when the sun isn't watching",
  monday: "// Case of the Mondays? More like case of the PRs",
  weekend: "// Weekends are just bonus coding days",
} as const;

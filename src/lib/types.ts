import { z } from "zod";

export const archetypeEnum = z.enum([
  "night_owl",
  "marathoner",
  "sprinter",
  "bug_hunter",
  "builder",
  "tool_master",
  "delegator",
  "streak_master",
  "polyglot",
  "deep_diver",
  "explorer",
  "pair_programmer",
]);

export type Archetype = z.infer<typeof archetypeEnum>;

export const goalCategoryEnum = z.enum([
  "bug_fix",
  "feature",
  "refactor",
  "devops",
  "docs",
  "explore",
  "test",
  "other",
]);

export type GoalCategory = z.infer<typeof goalCategoryEnum>;

export const wrappedPayloadSchema = z.object({
  version: z.literal(1),

  stats: z.object({
    sessions: z.int().min(0),
    messages: z.int().min(0),
    hours: z.number().min(0),
    days: z.int().min(0),
    commits: z.int().min(0),
    linesChanged: z.int().min(0),
  }),

  tools: z.record(z.string(), z.int().min(0)),

  timePatterns: z.object({
    hourDistribution: z.record(z.string(), z.int().min(0)),
    dayOfWeekDistribution: z.record(z.string(), z.int().min(0)),
    peakHour: z.int().min(0).max(23),
    peakDay: z.int().min(0).max(6),
  }),

  projectCount: z.int().min(0),

  goals: z.record(goalCategoryEnum, z.int().min(0)),

  archetype: archetypeEnum,

  highlights: z.object({
    busiestDay: z.string(),
    busiestDayMessages: z.int().min(0),
    longestStreak: z.int().min(0),
    longestSessionMinutes: z.int().min(0),
    rarestTool: z.string(),
    firstSessionDate: z.string(),
    topToolName: z.string(),
    topToolCount: z.int().min(0),
  }),

  streaks: z.object({
    current: z.int().min(0),
    longest: z.int().min(0),
    totalActiveDays: z.int().min(0),
  }),
});

export type WrappedPayload = z.infer<typeof wrappedPayloadSchema>;

export const storedWrappedSchema = z.object({
  payload: wrappedPayloadSchema,
  createdAt: z.string(),
  slug: z.string(),
});

export type StoredWrapped = z.infer<typeof storedWrappedSchema>;

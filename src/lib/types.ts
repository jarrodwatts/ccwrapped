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

export const wrappedPayloadSchema = z.object({
  stats: z.object({
    sessions: z.int().min(0),
    messages: z.int().min(0),
    hours: z.number().min(0),
    days: z.int().min(0),
    commits: z.int().min(0),
  }),
  tools: z.record(z.string(), z.int().min(0)),
  timePatterns: z.object({
    hourDistribution: z.record(z.string(), z.int().min(0)),
    dayOfWeekDistribution: z.record(z.string(), z.int().min(0)),
    dailyActivity: z.record(z.string(), z.int().min(0)),
  }),
  projectCount: z.int().min(0),
  goals: z.record(z.string(), z.int().min(0)),
  archetype: archetypeEnum,
  highlights: z.object({
    busiestDay: z.string(),
    busiestDayCount: z.int().min(0),
    longestStreak: z.int().min(0),
    longestSessionMinutes: z.number().min(0),
    firstSessionDate: z.string(),
    topProject: z.string(),
    rareToolName: z.string().nullable(),
    rareToolCount: z.int().min(0).nullable(),
  }),
});

export type WrappedPayload = z.infer<typeof wrappedPayloadSchema>;

export interface CardProps {
  payload: WrappedPayload;
  slug: string;
}

export interface StoredWrapped {
  slug: string;
  payload: WrappedPayload;
  createdAt: string;
}

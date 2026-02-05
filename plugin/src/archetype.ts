import type { WrappedPayload } from "./compute.js";
import type { SessionData } from "./extract.js";

interface ArchetypeInput {
  stats: WrappedPayload["stats"];
  tools: Record<string, number>;
  timePatterns: WrappedPayload["timePatterns"];
  goals: Record<string, number>;
  streaks: WrappedPayload["streaks"];
  projectCount: number;
  sessions: SessionData[];
}

type Archetype =
  | "night_owl"
  | "marathoner"
  | "sprinter"
  | "bug_hunter"
  | "builder"
  | "tool_master"
  | "delegator"
  | "streak_master"
  | "polyglot"
  | "deep_diver"
  | "explorer"
  | "pair_programmer";

interface ScoredArchetype {
  archetype: Archetype;
  score: number;
}

export function scoreArchetype(input: ArchetypeInput): Archetype {
  const scores: ScoredArchetype[] = [
    { archetype: "night_owl", score: scoreNightOwl(input) },
    { archetype: "marathoner", score: scoreMarathoner(input) },
    { archetype: "sprinter", score: scoreSprinter(input) },
    { archetype: "bug_hunter", score: scoreBugHunter(input) },
    { archetype: "builder", score: scoreBuilder(input) },
    { archetype: "tool_master", score: scoreToolMaster(input) },
    { archetype: "delegator", score: scoreDelegator(input) },
    { archetype: "streak_master", score: scoreStreakMaster(input) },
    { archetype: "polyglot", score: scorePolyglot(input) },
    { archetype: "deep_diver", score: scoreDeepDiver(input) },
    { archetype: "explorer", score: scoreExplorer(input) },
    { archetype: "pair_programmer", score: scorePairProgrammer(input) },
  ];

  scores.sort((a, b) => b.score - a.score);
  return scores[0].archetype;
}

function scoreNightOwl(input: ArchetypeInput): number {
  const { hourDistribution } = input.timePatterns;
  let nightMessages = 0;
  let totalMessages = 0;

  for (const [hour, count] of Object.entries(hourDistribution)) {
    totalMessages += count;
    const h = Number(hour);
    if (h >= 22 || h <= 4) {
      nightMessages += count;
    }
  }

  if (totalMessages === 0) return 0;
  const ratio = nightMessages / totalMessages;
  return ratio > 0.4 ? 90 + ratio * 10 : ratio * 200;
}

function scoreMarathoner(input: ArchetypeInput): number {
  const durations: number[] = [];

  for (const session of input.sessions) {
    if (session.firstTimestamp && session.lastTimestamp) {
      const mins =
        (session.lastTimestamp - session.firstTimestamp) / (1000 * 60);
      if (mins > 0 && mins < 24 * 60) {
        durations.push(mins);
      }
    }
  }

  if (durations.length === 0) return 0;
  const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
  const max = Math.max(...durations);

  let score = 0;
  if (avg > 45) score += 60;
  else score += (avg / 45) * 60;

  if (max > 180) score += 40;
  else score += (max / 180) * 40;

  return score;
}

function scoreSprinter(input: ArchetypeInput): number {
  const durations: number[] = [];

  for (const session of input.sessions) {
    if (session.firstTimestamp && session.lastTimestamp) {
      const mins =
        (session.lastTimestamp - session.firstTimestamp) / (1000 * 60);
      if (mins > 0 && mins < 24 * 60) {
        durations.push(mins);
      }
    }
  }

  if (durations.length === 0) return 0;
  const avg = durations.reduce((a, b) => a + b, 0) / durations.length;

  let score = 0;
  if (input.stats.sessions > 100) score += 50;
  else score += (input.stats.sessions / 100) * 50;

  if (avg < 10) score += 50;
  else if (avg < 20) score += 30;
  else score += Math.max(0, 20 - avg) * 2;

  return score;
}

function scoreBugHunter(input: ArchetypeInput): number {
  const totalGoals = Object.values(input.goals).reduce((a, b) => a + b, 0);
  if (totalGoals === 0) return 0;

  const bugFix = input.goals["bug_fix"] ?? 0;
  const ratio = bugFix / totalGoals;

  return ratio > 0.4 ? 80 + ratio * 20 : ratio * 200;
}

function scoreBuilder(input: ArchetypeInput): number {
  const totalGoals = Object.values(input.goals).reduce((a, b) => a + b, 0);
  if (totalGoals === 0) return 0;

  const feature = input.goals["feature"] ?? 0;
  const ratio = feature / totalGoals;

  return ratio > 0.4 ? 80 + ratio * 20 : ratio * 200;
}

function scoreToolMaster(input: ArchetypeInput): number {
  const distinctTools = Object.keys(input.tools).length;

  if (distinctTools >= 15) return 90 + Math.min(distinctTools - 15, 10);
  return (distinctTools / 15) * 90;
}

function scoreDelegator(input: ArchetypeInput): number {
  const taskUsage = input.tools["Task"] ?? 0;
  const totalToolUse = Object.values(input.tools).reduce((a, b) => a + b, 0);

  if (totalToolUse === 0) return 0;
  const ratio = taskUsage / totalToolUse;

  let score = 0;
  if (taskUsage > 50) score += 50;
  else score += (taskUsage / 50) * 50;

  score += ratio * 200;
  return Math.min(score, 100);
}

function scoreStreakMaster(input: ArchetypeInput): number {
  const { longest } = input.streaks;

  if (longest >= 14) return 80 + Math.min((longest - 14) * 2, 20);
  return (longest / 14) * 80;
}

function scorePolyglot(input: ArchetypeInput): number {
  const { projectCount } = input;

  if (projectCount >= 5) return 80 + Math.min((projectCount - 5) * 4, 20);
  return (projectCount / 5) * 80;
}

function scoreDeepDiver(input: ArchetypeInput): number {
  const projectMessages: Record<string, number> = {};

  for (const session of input.sessions) {
    if (!session.projectDir) continue;
    let msgCount = 0;
    for (const msg of session.messages) {
      if (msg.type === "user" || msg.type === "assistant") msgCount++;
    }
    projectMessages[session.projectDir] =
      (projectMessages[session.projectDir] ?? 0) + msgCount;
  }

  const totals = Object.values(projectMessages);
  if (totals.length === 0) return 0;

  const total = totals.reduce((a, b) => a + b, 0);
  const max = Math.max(...totals);
  const ratio = max / total;

  return ratio > 0.8 ? 80 + ratio * 20 : ratio * 100;
}

function scoreExplorer(input: ArchetypeInput): number {
  const readOps =
    (input.tools["Read"] ?? 0) +
    (input.tools["Grep"] ?? 0) +
    (input.tools["Glob"] ?? 0);
  const writeOps = (input.tools["Edit"] ?? 0) + (input.tools["Write"] ?? 0);

  if (readOps + writeOps === 0) return 0;
  const ratio = readOps / (readOps + writeOps);

  let score = ratio * 80;

  const durations: number[] = [];
  for (const session of input.sessions) {
    if (session.firstTimestamp && session.lastTimestamp) {
      const mins =
        (session.lastTimestamp - session.firstTimestamp) / (1000 * 60);
      if (mins > 0 && mins < 24 * 60) durations.push(mins);
    }
  }

  if (durations.length > 0) {
    const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
    if (avg < 15 && durations.length > 50) score += 20;
  }

  return score;
}

function scorePairProgrammer(input: ArchetypeInput): number {
  if (input.sessions.length === 0) return 0;

  let totalUserMsgs = 0;
  let totalAssistantMsgs = 0;

  for (const session of input.sessions) {
    for (const msg of session.messages) {
      if (msg.type === "user") totalUserMsgs++;
      if (msg.type === "assistant") totalAssistantMsgs++;
    }
  }

  const msgsPerSession =
    (totalUserMsgs + totalAssistantMsgs) / input.sessions.length;

  let score = 0;
  if (msgsPerSession > 20) score += 60;
  else score += (msgsPerSession / 20) * 60;

  if (totalUserMsgs > 0 && totalAssistantMsgs > 0) {
    const backAndForth =
      Math.min(totalUserMsgs, totalAssistantMsgs) /
      Math.max(totalUserMsgs, totalAssistantMsgs);
    score += backAndForth * 40;
  }

  return score;
}

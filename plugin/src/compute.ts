import type {
  ExtractedData,
  SessionData,
  TranscriptMessage,
} from "./extract.js";
import { scoreArchetype } from "./archetype.js";

interface ContentBlock {
  type: string;
  name?: string;
  input?: Record<string, unknown>;
  text?: string;
}

export interface WrappedPayload {
  version: 1;
  stats: {
    sessions: number;
    messages: number;
    hours: number;
    days: number;
    commits: number;
    linesChanged: number;
  };
  tools: Record<string, number>;
  timePatterns: {
    hourDistribution: Record<string, number>;
    dayOfWeekDistribution: Record<string, number>;
    peakHour: number;
    peakDay: number;
  };
  projectCount: number;
  goals: Record<string, number>;
  archetype: string;
  highlights: {
    busiestDay: string;
    busiestDayMessages: number;
    longestStreak: number;
    longestSessionMinutes: number;
    rarestTool: string;
    firstSessionDate: string;
    topToolName: string;
    topToolCount: number;
  };
  streaks: {
    current: number;
    longest: number;
    totalActiveDays: number;
  };
}

export function computePayload(data: ExtractedData): WrappedPayload {
  const tools = countTools(data.sessions);
  const timePatterns = computeTimePatterns(data);
  const goals = computeGoals(data);
  const streaks = computeStreaks(data);
  const highlights = computeHighlights(data, tools, streaks);
  const stats = computeStats(data, tools);

  const archetype = scoreArchetype({
    stats,
    tools,
    timePatterns,
    goals,
    streaks,
    projectCount: countProjects(data),
    sessions: data.sessions,
  });

  return {
    version: 1,
    stats,
    tools,
    timePatterns,
    projectCount: countProjects(data),
    goals,
    archetype,
    highlights,
    streaks,
  };
}

function computeStats(
  data: ExtractedData,
  tools: Record<string, number>
): WrappedPayload["stats"] {
  const sessionIds = new Set<string>();
  let totalMessages = 0;

  for (const session of data.sessions) {
    sessionIds.add(session.sessionId);
    for (const msg of session.messages) {
      if (msg.type === "user" || msg.type === "assistant") {
        totalMessages++;
      }
    }
  }

  let totalHours = 0;
  for (const session of data.sessions) {
    if (session.firstTimestamp && session.lastTimestamp) {
      const durationMs = session.lastTimestamp - session.firstTimestamp;
      if (durationMs > 0 && durationMs < 24 * 60 * 60 * 1000) {
        totalHours += durationMs / (1000 * 60 * 60);
      }
    }
  }

  const activeDays = getActiveDaySet(data);
  const commits = tools["Bash"] ? estimateCommits(data.sessions) : 0;

  return {
    sessions: sessionIds.size,
    messages: totalMessages,
    hours: Math.round(totalHours * 10) / 10,
    days: activeDays.size,
    commits,
    linesChanged: estimateLinesChanged(data.sessions),
  };
}

function countTools(sessions: SessionData[]): Record<string, number> {
  const tools: Record<string, number> = {};

  for (const session of sessions) {
    for (const msg of session.messages) {
      if (msg.type !== "assistant") continue;
      const content = msg.message?.content;
      if (!Array.isArray(content)) continue;

      for (const block of content as ContentBlock[]) {
        if (block.type === "tool_use" && block.name) {
          tools[block.name] = (tools[block.name] ?? 0) + 1;
        }
      }
    }
  }

  return tools;
}

function computeTimePatterns(
  data: ExtractedData
): WrappedPayload["timePatterns"] {
  const hourDist: Record<string, number> = {};
  const dayDist: Record<string, number> = {};

  for (let h = 0; h < 24; h++) hourDist[String(h)] = 0;
  for (let d = 0; d < 7; d++) dayDist[String(d)] = 0;

  for (const entry of data.history) {
    const date = new Date(entry.timestamp);
    const hour = date.getHours();
    const day = date.getDay();
    hourDist[String(hour)] = (hourDist[String(hour)] ?? 0) + 1;
    dayDist[String(day)] = (dayDist[String(day)] ?? 0) + 1;
  }

  let peakHour = 0;
  let peakHourCount = 0;
  for (const [h, count] of Object.entries(hourDist)) {
    if (count > peakHourCount) {
      peakHour = Number(h);
      peakHourCount = count;
    }
  }

  let peakDay = 0;
  let peakDayCount = 0;
  for (const [d, count] of Object.entries(dayDist)) {
    if (count > peakDayCount) {
      peakDay = Number(d);
      peakDayCount = count;
    }
  }

  return {
    hourDistribution: hourDist,
    dayOfWeekDistribution: dayDist,
    peakHour,
    peakDay,
  };
}

function computeGoals(data: ExtractedData): Record<string, number> {
  const goals: Record<string, number> = {};

  for (const session of data.sessions) {
    const category = classifySessionGoal(session);
    goals[category] = (goals[category] ?? 0) + 1;
  }

  for (const facet of data.facets) {
    if (facet.goal_categories) {
      for (const [cat, count] of Object.entries(facet.goal_categories)) {
        const mapped = mapFacetCategory(cat);
        goals[mapped] = (goals[mapped] ?? 0) + count;
      }
    }
  }

  return goals;
}

function classifySessionGoal(session: SessionData): string {
  const userMessages = session.messages
    .filter(
      (m: TranscriptMessage) =>
        m.type === "user" && typeof m.message?.content === "string"
    )
    .map((m: TranscriptMessage) => (m.message?.content as string).toLowerCase());

  const text = userMessages.join(" ");
  const tools = countToolsInSession(session);

  if (/\b(fix|bug|broken|error|crash|issue|debug)\b/.test(text))
    return "bug_fix";
  if (/\b(add|create|implement|build|new|feature)\b/.test(text))
    return "feature";
  if (/\b(refactor|clean|reorganize|rename|move)\b/.test(text))
    return "refactor";
  if (/\b(deploy|ci|cd|docker|pipeline|infra)\b/.test(text)) return "devops";
  if (/\b(doc|readme|comment|explain)\b/.test(text)) return "docs";
  if (/\b(test|spec|assert|expect)\b/.test(text)) return "test";

  const readOps =
    (tools["Read"] ?? 0) + (tools["Grep"] ?? 0) + (tools["Glob"] ?? 0);
  const writeOps = (tools["Edit"] ?? 0) + (tools["Write"] ?? 0);

  if (readOps > writeOps * 3 && writeOps < 3) return "explore";
  if (
    (tools["Bash"] ?? 0) > readOps &&
    (tools["Bash"] ?? 0) > writeOps
  )
    return "devops";
  if (writeOps > readOps) return "feature";

  return "other";
}

function countToolsInSession(session: SessionData): Record<string, number> {
  const tools: Record<string, number> = {};
  for (const msg of session.messages) {
    if (msg.type !== "assistant") continue;
    const content = msg.message?.content;
    if (!Array.isArray(content)) continue;
    for (const block of content as ContentBlock[]) {
      if (block.type === "tool_use" && block.name) {
        tools[block.name] = (tools[block.name] ?? 0) + 1;
      }
    }
  }
  return tools;
}

function mapFacetCategory(cat: string): string {
  const mapping: Record<string, string> = {
    code_fix: "bug_fix",
    bug_fix: "bug_fix",
    debugging: "bug_fix",
    feature_development: "feature",
    new_feature: "feature",
    implementation: "feature",
    refactoring: "refactor",
    code_cleanup: "refactor",
    infrastructure: "devops",
    deployment: "devops",
    ci_cd: "devops",
    documentation: "docs",
    testing: "test",
    file_management: "other",
    exploration: "explore",
    code_review: "other",
  };
  return mapping[cat] ?? "other";
}

function computeStreaks(data: ExtractedData): WrappedPayload["streaks"] {
  const activeDays = getActiveDaySet(data);
  if (activeDays.size === 0) {
    return { current: 0, longest: 0, totalActiveDays: 0 };
  }

  const sorted = Array.from(activeDays).sort();
  let longest = 1;
  let runningStreak = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diffDays =
      (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);

    if (Math.abs(diffDays - 1) < 0.01) {
      runningStreak++;
    } else {
      runningStreak = 1;
    }

    if (runningStreak > longest) longest = runningStreak;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let currentStreak = 0;
  const checkDate = new Date(today);
  for (let i = 0; i < sorted.length + 1; i++) {
    const dateStr = checkDate.toISOString().split("T")[0];
    if (activeDays.has(dateStr)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (i === 0) {
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return { current: currentStreak, longest, totalActiveDays: activeDays.size };
}

function getActiveDaySet(data: ExtractedData): Set<string> {
  const days = new Set<string>();

  for (const entry of data.history) {
    const d = new Date(entry.timestamp);
    days.add(d.toISOString().split("T")[0]);
  }

  for (const session of data.sessions) {
    if (session.firstTimestamp > 0) {
      const d = new Date(session.firstTimestamp);
      days.add(d.toISOString().split("T")[0]);
    }
  }

  return days;
}

function computeHighlights(
  data: ExtractedData,
  tools: Record<string, number>,
  streaks: WrappedPayload["streaks"]
): WrappedPayload["highlights"] {
  const dayMessageCounts: Record<string, number> = {};
  for (const entry of data.history) {
    const dateStr = new Date(entry.timestamp).toISOString().split("T")[0];
    dayMessageCounts[dateStr] = (dayMessageCounts[dateStr] ?? 0) + 1;
  }

  let busiestDay = "";
  let busiestDayMessages = 0;
  for (const [day, count] of Object.entries(dayMessageCounts)) {
    if (count > busiestDayMessages) {
      busiestDay = day;
      busiestDayMessages = count;
    }
  }

  let longestSessionMinutes = 0;
  for (const session of data.sessions) {
    if (session.firstTimestamp && session.lastTimestamp) {
      const mins =
        (session.lastTimestamp - session.firstTimestamp) / (1000 * 60);
      if (mins > 0 && mins < 24 * 60 && mins > longestSessionMinutes) {
        longestSessionMinutes = Math.round(mins);
      }
    }
  }

  const toolEntries = Object.entries(tools).sort((a, b) => b[1] - a[1]);
  const topToolName = toolEntries[0]?.[0] ?? "None";
  const topToolCount = toolEntries[0]?.[1] ?? 0;
  const rarestTool =
    toolEntries.length > 0
      ? toolEntries[toolEntries.length - 1][0]
      : "None";

  let firstTimestamp = Infinity;
  for (const session of data.sessions) {
    if (session.firstTimestamp > 0 && session.firstTimestamp < firstTimestamp) {
      firstTimestamp = session.firstTimestamp;
    }
  }
  const firstSessionDate =
    firstTimestamp === Infinity
      ? new Date().toISOString().split("T")[0]
      : new Date(firstTimestamp).toISOString().split("T")[0];

  return {
    busiestDay: busiestDay || new Date().toISOString().split("T")[0],
    busiestDayMessages,
    longestStreak: streaks.longest,
    longestSessionMinutes,
    rarestTool,
    firstSessionDate,
    topToolName,
    topToolCount,
  };
}

function estimateCommits(sessions: SessionData[]): number {
  let commits = 0;
  for (const session of sessions) {
    for (const msg of session.messages) {
      if (msg.type !== "assistant") continue;
      const content = msg.message?.content;
      if (!Array.isArray(content)) continue;

      for (const block of content as ContentBlock[]) {
        if (block.type !== "tool_use" || block.name !== "Bash") continue;
        const cmd = String(block.input?.command ?? "");
        if (/git\s+commit/.test(cmd)) {
          commits++;
        }
      }
    }
  }
  return commits;
}

function estimateLinesChanged(sessions: SessionData[]): number {
  let lines = 0;
  for (const session of sessions) {
    for (const msg of session.messages) {
      if (msg.type !== "assistant") continue;
      const content = msg.message?.content;
      if (!Array.isArray(content)) continue;

      for (const block of content as ContentBlock[]) {
        if (block.type !== "tool_use") continue;
        if (block.name === "Edit" || block.name === "Write") {
          const newStr = String(
            block.input?.new_string ?? block.input?.content ?? ""
          );
          if (newStr) {
            lines += newStr.split("\n").length;
          }
        }
      }
    }
  }
  return lines;
}

function countProjects(data: ExtractedData): number {
  const projects = new Set<string>();
  for (const session of data.sessions) {
    if (session.projectDir) {
      projects.add(session.projectDir);
    }
  }
  return projects.size;
}

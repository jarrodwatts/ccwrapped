import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import * as readline from "node:readline";

const CLAUDE_DIR = path.join(os.homedir(), ".claude");

export interface HistoryEntry {
  display: string;
  timestamp: number;
  project: string;
  sessionId: string;
}

export interface TranscriptMessage {
  type: "user" | "assistant" | "file-history-snapshot" | "summary" | string;
  sessionId?: string;
  timestamp?: string;
  message?: {
    role?: string;
    content?: string | ContentBlock[];
    model?: string;
  };
  uuid?: string;
}

interface ContentBlock {
  type: string;
  name?: string;
  input?: Record<string, unknown>;
  text?: string;
}

export interface SessionData {
  sessionId: string;
  projectDir: string;
  messages: TranscriptMessage[];
  firstTimestamp: number;
  lastTimestamp: number;
}

export interface FacetData {
  session_id: string;
  goal_categories?: Record<string, number>;
  outcome?: string;
  friction_counts?: Record<string, number>;
  session_type?: string;
}

export interface ExtractedData {
  history: HistoryEntry[];
  sessions: SessionData[];
  facets: FacetData[];
}

export async function extractAllData(): Promise<ExtractedData> {
  const [history, sessions, facets] = await Promise.all([
    extractHistory(),
    extractSessions(),
    extractFacets(),
  ]);
  return { history, sessions, facets };
}

async function extractHistory(): Promise<HistoryEntry[]> {
  const historyPath = path.join(CLAUDE_DIR, "history.jsonl");
  if (!fs.existsSync(historyPath)) return [];

  const entries: HistoryEntry[] = [];
  const stream = fs.createReadStream(historyPath, { encoding: "utf-8" });
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const parsed = JSON.parse(line);
      if (parsed.timestamp && parsed.sessionId) {
        entries.push({
          display: parsed.display ?? "",
          timestamp: parsed.timestamp,
          project: parsed.project ?? "",
          sessionId: parsed.sessionId,
        });
      }
    } catch {
      // Skip malformed lines
    }
  }

  return entries;
}

async function extractSessions(): Promise<SessionData[]> {
  const projectsDir = path.join(CLAUDE_DIR, "projects");
  if (!fs.existsSync(projectsDir)) return [];

  const sessions: SessionData[] = [];
  const projectDirs = fs.readdirSync(projectsDir, { withFileTypes: true });

  for (const dir of projectDirs) {
    if (!dir.isDirectory()) continue;
    const dirPath = path.join(projectsDir, dir.name);
    const files = fs
      .readdirSync(dirPath)
      .filter((f: string) => f.endsWith(".jsonl"));

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const session = await parseTranscriptFile(
        filePath,
        file.replace(".jsonl", ""),
        dir.name
      );
      if (session && session.messages.length > 0) {
        sessions.push(session);
      }
    }
  }

  return sessions;
}

async function parseTranscriptFile(
  filePath: string,
  sessionId: string,
  projectDir: string
): Promise<SessionData | null> {
  const messages: TranscriptMessage[] = [];
  let firstTimestamp = Infinity;
  let lastTimestamp = 0;

  const stream = fs.createReadStream(filePath, { encoding: "utf-8" });
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const parsed = JSON.parse(line);
      messages.push(parsed);

      const ts = parsed.timestamp;
      if (ts) {
        const numTs = typeof ts === "string" ? new Date(ts).getTime() : ts;
        if (Number.isFinite(numTs)) {
          if (numTs < firstTimestamp) firstTimestamp = numTs;
          if (numTs > lastTimestamp) lastTimestamp = numTs;
        }
      }
    } catch {
      // Skip malformed lines
    }
  }

  if (messages.length === 0) return null;
  if (firstTimestamp === Infinity) firstTimestamp = 0;

  return { sessionId, projectDir, messages, firstTimestamp, lastTimestamp };
}

async function extractFacets(): Promise<FacetData[]> {
  const facetsDir = path.join(CLAUDE_DIR, "usage-data", "facets");
  if (!fs.existsSync(facetsDir)) return [];

  const facets: FacetData[] = [];
  const files = fs
    .readdirSync(facetsDir)
    .filter((f: string) => f.endsWith(".json"));

  for (const file of files) {
    try {
      const content = fs.readFileSync(path.join(facetsDir, file), "utf-8");
      const parsed = JSON.parse(content);
      if (parsed.session_id) {
        facets.push({
          session_id: parsed.session_id,
          goal_categories: parsed.goal_categories,
          outcome: parsed.outcome,
          friction_counts: parsed.friction_counts,
          session_type: parsed.session_type,
        });
      }
    } catch {
      // Skip malformed files
    }
  }

  return facets;
}

---
description: Generate your Claude Code Wrapped - visualize your coding stats and share your archetype
user-invocable: true
---

# Claude Code Wrapped

Generate a shareable visualization of your Claude Code usage stats, patterns, and coding personality.

## Privacy First

**Only aggregate stats are shared:**
- Session counts, message counts, hours spent
- Tool usage counts (Read, Edit, Bash, etc.)
- Time patterns (which hours/days you code most)
- Streaks and highlights (dates only)

**Never shared:** Your code, prompts, file paths, project names, or any actual content.

---

## Instructions

### Step 1: Discover Session Files

Find all session JSONL files (excluding subagent sessions):

```bash
find ~/.claude/projects -maxdepth 3 -name "*.jsonl" -not -name "agent-*" 2>/dev/null
```

### Step 2: Parse Each Session

For each `.jsonl` file, read line by line. Each line is a JSON object with these key fields:
- `type`: "user", "assistant", "system", "progress", "file-history-snapshot", etc.
- `timestamp`: ISO 8601 datetime
- `sessionId`: unique session identifier
- `message`: contains `role` and `content`

**Important:** Only "user" and "assistant" entries represent actual coding activity. Other types (system, progress, file-history-snapshot) may be logged asynchronously, sometimes days after the session ended.

**Filter rules:**
- Skip files where filename starts with `agent-` (subagent sessions)
- Skip sessions with fewer than 2 user/assistant entries (need at least 2 to calculate duration)
- Skip sessions shorter than 1 minute duration (after applying the gap-capped calculation)

### Step 3: Extract Per-Session Data

For each valid session, extract:

**Timing (IMPORTANT - use only user/assistant entries):**

Only use timestamps from entries where `type` is "user" or "assistant". Do NOT include "system", "progress", or "file-history-snapshot" entries - these can be logged days after the actual session ended and will inflate duration.

- `start_time`: earliest user/assistant timestamp
- `end_time`: latest user/assistant timestamp
- `duration_minutes`: Sum of gaps between consecutive timestamps, with each gap capped at 120 minutes (2 hours). This handles resumed sessions where someone returns days later.

```
duration = 0
sort timestamps ascending
for i = 1 to length:
    gap = timestamps[i] - timestamps[i-1]
    duration += min(gap, 120 minutes)
```

**Counts:**
- `user_message_count`: entries where `type` = "user" and NOT `isMeta: true`
- `tool_counts`: for assistant messages where `message.content` is an array containing `type: "tool_use"`, count each tool `name`

**Git activity:**
- `git_commits`: Count Bash tool uses where `input.command` contains "git commit"
  - Location: `message.content[].input.command` in assistant entries with `tool_use` blocks where `name` = "Bash"
- `lines_changed`: Parse tool result stdout for git diff stats
  - Location: `toolUseResult.stdout` in user entries (tool results)
  - Pattern: Match `(\d+) insertions?\(\+\)` and `(\d+) deletions?\(-\)`, sum all matches

### Step 4: Aggregate All Sessions

Combine all sessions into totals:

**stats:**
```json
{
  "sessions": <total unique sessions>,
  "messages": <total user messages>,
  "hours": <total duration in hours, rounded to 1 decimal>,
  "days": <unique dates with activity>,
  "commits": <total git commits>,
  "linesChanged": <total lines changed>
}
```

**tools:**
Map of tool name → total count across all sessions:
```json
{
  "Read": 1523,
  "Edit": 456,
  "Bash": 891,
  "Grep": 234,
  "Task": 89,
  ...
}
```

**timePatterns:**
- `hourDistribution`: count messages per hour (0-23)
- `dayOfWeekDistribution`: count messages per day (0=Sunday to 6=Saturday)
- `peakHour`: hour with most messages
- `peakDay`: day of week with most messages

**projectCount:** Number of unique project directories in `~/.claude/projects/`

**goals:** Categorize user messages by keywords:
| Category | Keywords |
|----------|----------|
| bug_fix | fix, bug, error, issue, broken, crash, fail |
| feature | add, implement, create, build, new, feature |
| refactor | refactor, clean, improve, reorganize, simplify |
| devops | deploy, ci, docker, pipeline, kubernetes, infra |
| docs | document, readme, comment, jsdoc, explain |
| explore | find, search, where, how, what, understand |
| test | test, spec, coverage, jest, pytest, assertion |
| other | anything else |

**highlights:**
- `busiestDay`: date (YYYY-MM-DD) with most user messages
- `busiestDayMessages`: count on that day
- `longestStreak`: max consecutive days with activity
- `longestSessionMinutes`: duration of longest session
- `rarestTool`: tool with fewest uses (minimum 1 use)
- `firstSessionDate`: earliest session date
- `topToolName`: most used tool
- `topToolCount`: count for top tool

**streaks:**
- `current`: consecutive days ending today (0 if no activity today)
- `longest`: longest streak ever
- `totalActiveDays`: total unique days with activity

### Step 5: Determine Archetype

Assign exactly ONE archetype based on these rules (check in order, first match wins):

| Archetype | Condition |
|-----------|-----------|
| `night_owl` | >50% of messages between hours 22-23 or 0-4 |
| `marathoner` | Average session duration > 120 minutes |
| `sprinter` | Average session < 15 min AND total sessions > 50 |
| `bug_hunter` | bug_fix goals > 40% of total |
| `builder` | feature goals > 40% of total |
| `tool_master` | Uses 15+ different tools with count > 10 each |
| `delegator` | Task tool is top 3 most used |
| `streak_master` | Longest streak >= 14 days |
| `polyglot` | projectCount >= 5 |
| `deep_diver` | Average session > 60 min AND sessions < 5/week average |
| `explorer` | explore goals > 40% of total |
| `pair_programmer` | Average > 100 messages per active day |

Default to `builder` if no condition matches.

### Step 6: Build the Payload

Construct this exact JSON structure:

```json
{
  "version": 1,
  "stats": {
    "sessions": 0,
    "messages": 0,
    "hours": 0,
    "days": 0,
    "commits": 0,
    "linesChanged": 0
  },
  "tools": {},
  "timePatterns": {
    "hourDistribution": {},
    "dayOfWeekDistribution": {},
    "peakHour": 0,
    "peakDay": 0
  },
  "projectCount": 0,
  "goals": {
    "bug_fix": 0,
    "feature": 0,
    "refactor": 0,
    "devops": 0,
    "docs": 0,
    "explore": 0,
    "test": 0,
    "other": 0
  },
  "archetype": "builder",
  "highlights": {
    "busiestDay": "2024-01-01",
    "busiestDayMessages": 0,
    "longestStreak": 0,
    "longestSessionMinutes": 0,
    "rarestTool": "Unknown",
    "firstSessionDate": "2024-01-01",
    "topToolName": "Read",
    "topToolCount": 0
  },
  "streaks": {
    "current": 0,
    "longest": 0,
    "totalActiveDays": 0
  }
}
```

### Step 7: Submit to ccwrapped.com

POST the payload:

```bash
curl -s -X POST "https://ccwrapped.com/api/wrapped" \
  -H "Content-Type: application/json" \
  -d '<PAYLOAD_JSON>'
```

The response will be: `{"slug":"<12-character-id>"}`

### Step 8: Open the Result

Open the wrapped page in the default browser:

**macOS:**
```bash
open "https://ccwrapped.com/w/<slug>"
```

**Linux:**
```bash
xdg-open "https://ccwrapped.com/w/<slug>"
```

**Windows:**
```bash
start "https://ccwrapped.com/w/<slug>"
```

---

## Output to User

After completing, display:

1. **Stats summary:** "Analyzed X sessions with Y messages across Z hours"
2. **Archetype:** "Your archetype: [Emoji] [Name]"
3. **Top tool:** "Your most used tool: [Tool] (N times)"
4. **URL:** "Your wrapped is ready: https://ccwrapped.com/w/[slug]"
5. **Privacy note:** "Share freely - only aggregate stats are included, no private data"

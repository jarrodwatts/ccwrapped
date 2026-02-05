---
description: Generate your Claude Code Wrapped — a shareable visualization of your coding stats
allowed-tools: Bash, Read
---

## Generate Claude Code Wrapped

Run the wrapped generator script. It will:
1. Read session data from `~/.claude/`
2. Compute aggregate stats (no code content or project names leave the machine)
3. Upload a ~2KB summary to the wrapped API
4. Open the result in your browser

```bash
node "${CLAUDE_PLUGIN_ROOT}/dist/index.js"
```

If the command fails, check that the plugin is built (`bun run build` in the plugin directory) and that `~/.claude/` contains session data.

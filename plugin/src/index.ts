import { execFile } from "node:child_process";
import { extractAllData } from "./extract.js";
import { computePayload } from "./compute.js";
import { uploadPayload } from "./upload.js";

const SITE_URL = "https://ccwrapped.com";

async function main(): Promise<void> {
  console.log("Reading your Claude Code session data...");
  const data = await extractAllData();

  if (data.sessions.length === 0 && data.history.length === 0) {
    console.error(
      "No session data found in ~/.claude/. Make sure you have used Claude Code before running this."
    );
    process.exit(1);
  }

  console.log(
    `Found ${data.sessions.length} sessions and ${data.history.length} history entries.`
  );

  console.log("Computing your stats...");
  const payload = computePayload(data);

  console.log(`Archetype: ${payload.archetype}`);
  console.log(
    `Stats: ${payload.stats.sessions} sessions, ${payload.stats.messages} messages, ${payload.stats.hours} hours`
  );

  console.log("Uploading your wrapped summary...");
  const { slug } = await uploadPayload(payload);

  const wrappedUrl = `${SITE_URL}/w/${slug}`;
  console.log(`Your Wrapped is ready: ${wrappedUrl}`);

  const openCmd = process.platform === "darwin" ? "open" : "xdg-open";
  execFile(openCmd, [wrappedUrl], (err) => {
    if (err) {
      console.log("Could not auto-open browser. Visit the URL above.");
    }
  });
}

main().catch((err: unknown) => {
  console.error("Failed to generate wrapped:", err);
  process.exit(1);
});

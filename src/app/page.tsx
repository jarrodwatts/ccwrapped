import { ARCHETYPE_DEFINITIONS } from "@/config/archetypes";
import type { Archetype } from "@/lib/types";

const FEATURED_ARCHETYPES: Archetype[] = [
  "night_owl",
  "bug_hunter",
  "builder",
  "streak_master",
  "tool_master",
  "delegator",
];

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#0A0A0A]">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[-20%] left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#D97757]/10 blur-[150px]" />
      </div>

      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-16 px-6 py-24">
        {/* Hero */}
        <section className="flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5">
            <div className="h-2 w-2 animate-pulse rounded-full bg-[#D97757]" />
            <span className="text-sm font-medium text-white/60">
              For Claude Code users
            </span>
          </div>

          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl">
            Claude Code
            <br />
            <span className="text-[#D97757]">Wrapped</span>
          </h1>

          <p className="max-w-md text-lg text-white/50">
            Your sessions, tools, streaks, and coding personality — visualized
            and shareable.
          </p>
        </section>

        {/* How it works */}
        <section className="flex w-full flex-col gap-8">
          <h2 className="text-center text-sm font-medium tracking-[0.2em] text-white/40 uppercase">
            How It Works
          </h2>

          <div className="grid gap-4 sm:grid-cols-3">
            <Step
              number="1"
              title="Install Plugin"
              description="Add the plugin to Claude Code with one command"
            />
            <Step
              number="2"
              title="Run /wrapped"
              description="The plugin analyzes your local session data"
            />
            <Step
              number="3"
              title="Share"
              description="Get your cards and share your archetype"
            />
          </div>

          <div className="flex flex-col items-center gap-3">
            <code className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-mono text-sm text-white/80">
              /install jarrodwatts/claude-code-wrapped
            </code>
            <span className="text-xs text-white/30">
              Then type <code className="text-white/50">/wrapped</code> in any
              Claude Code session
            </span>
          </div>
        </section>

        {/* Archetypes preview */}
        <section className="flex w-full flex-col gap-8">
          <h2 className="text-center text-sm font-medium tracking-[0.2em] text-white/40 uppercase">
            Which One Are You?
          </h2>

          <div className="grid gap-3 sm:grid-cols-2">
            {FEATURED_ARCHETYPES.map((key) => {
              const a = ARCHETYPE_DEFINITIONS[key];
              return (
                <div
                  key={key}
                  className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-5"
                >
                  <span className="text-4xl">{a.emoji}</span>
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-white">{a.name}</span>
                    <span className="text-sm text-white/40">
                      {a.shortDescription}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Privacy */}
        <section className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-sm font-medium tracking-[0.2em] text-white/40 uppercase">
            Privacy First
          </h2>
          <p className="max-w-md text-sm text-white/40">
            Only aggregate stats are shared — session counts, tool usage, time
            patterns. No code, prompts, file paths, or project names ever leave
            your machine. The plugin is{" "}
            <a
              href="https://github.com/jarrodwatts/claude-code-wrapped"
              className="text-[#D97757] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              open source
            </a>
            .
          </p>
        </section>

        {/* Footer */}
        <footer className="text-xs text-white/20">
          Not affiliated with Anthropic.
        </footer>
      </div>
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-white/5 bg-white/[0.02] p-5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D97757]/10 text-sm font-bold text-[#D97757]">
        {number}
      </div>
      <span className="font-semibold text-white">{title}</span>
      <span className="text-sm text-white/40">{description}</span>
    </div>
  );
}

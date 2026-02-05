import { ARCHETYPE_DEFINITIONS } from "@/config/archetypes";
import type { Archetype } from "@/lib/types";

const FEATURED_ARCHETYPES: Archetype[] = [
  "night_owl",
  "marathoner",
  "bug_hunter",
  "builder",
  "streak_master",
  "tool_master",
];

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Grid pattern background */}
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-50" />

      {/* Glow accent */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">
              W
            </div>
            <span className="font-semibold text-text-primary tracking-tight">
              ccwrapped
            </span>
          </div>
          <a
            href="https://github.com/jarrodwatts/claude-code-wrapped"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-tactile px-4 py-2 text-sm text-text-secondary hover:text-text-primary"
          >
            GitHub
          </a>
        </div>
      </header>

      <main className="relative">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 py-24">
          <div className="flex flex-col items-center gap-8 text-center">
            {/* Status badge */}
            <div className="flex items-center gap-2 rounded-full border border-border-strong bg-surface px-4 py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="text-sm font-medium text-text-secondary">
                For Claude Code users
              </span>
            </div>

            {/* Title */}
            <div className="flex flex-col gap-4">
              <h1 className="text-6xl font-bold tracking-tight text-text-primary sm:text-8xl">
                CLAUDE CODE
              </h1>
              <h1 className="text-6xl font-bold tracking-tight sm:text-8xl">
                <span className="text-gradient glow-text">WRAPPED</span>
              </h1>
            </div>

            {/* Description */}
            <p className="max-w-lg text-lg text-text-secondary">
              Your sessions, tools, streaks, and coding personality —
              <br className="hidden sm:block" />
              visualized and shareable.
            </p>

            {/* CTA */}
            <div className="mt-4 flex flex-col items-center gap-4">
              <div className="card-industrial flex items-center gap-3 px-6 py-4">
                <span className="label">Install</span>
                <code className="font-mono text-sm text-text-primary">
                  /install jarrodwatts/claude-code-wrapped
                </code>
              </div>
              <span className="text-sm text-text-muted">
                Then run <code className="text-primary">/wrapped</code> in any session
              </span>
            </div>
          </div>
        </section>

        {/* How it works - Bento grid */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-12 text-center">
            <span className="label">How It Works</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <StepCard
              number="01"
              title="Install Plugin"
              description="Add the plugin to Claude Code with one command"
            />
            <StepCard
              number="02"
              title="Run /wrapped"
              description="The plugin analyzes your local session data"
            />
            <StepCard
              number="03"
              title="Share"
              description="Get your cards and share your archetype"
            />
          </div>
        </section>

        {/* Archetypes - Bento grid */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-12 text-center">
            <span className="label">Which One Are You?</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED_ARCHETYPES.map((key) => {
              const a = ARCHETYPE_DEFINITIONS[key];
              return <ArchetypeCard key={key} emoji={a.emoji} name={a.name} description={a.shortDescription} />;
            })}
          </div>
        </section>

        {/* Privacy */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="card-industrial mx-auto max-w-2xl p-8 text-center">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-surface-raised text-2xl">
              🔒
            </div>
            <h3 className="mb-2 text-lg font-semibold text-text-primary">
              Privacy First
            </h3>
            <p className="text-sm text-text-secondary">
              Only aggregate stats are shared — session counts, tool usage, time
              patterns. No code, prompts, file paths, or project names ever leave
              your machine. The plugin is{" "}
              <a
                href="https://github.com/jarrodwatts/claude-code-wrapped"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                open source
              </a>
              .
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-8">
          <div className="mx-auto max-w-6xl px-6 flex items-center justify-between">
            <span className="text-sm text-text-muted">
              Not affiliated with Anthropic.
            </span>
            <span className="text-sm text-text-muted">
              ccwrapped.com
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="card-industrial flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <span className="label">{title.toUpperCase()}</span>
        <span className="font-mono text-3xl font-bold text-primary">{number}</span>
      </div>
      <p className="text-sm text-text-secondary">{description}</p>
    </div>
  );
}

function ArchetypeCard({
  emoji,
  name,
  description,
}: {
  emoji: string;
  name: string;
  description: string;
}) {
  return (
    <div className="card-industrial group flex items-center gap-4 p-5 transition-all hover:border-primary/30">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-surface-raised text-3xl transition-transform group-hover:scale-110">
        {emoji}
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-semibold text-text-primary">{name}</span>
        <span className="text-sm text-text-tertiary">{description}</span>
      </div>
    </div>
  );
}

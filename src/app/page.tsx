import { ARCHETYPE_DEFINITIONS } from "@/config/archetypes";
import type { Archetype } from "@/lib/types";
import { AsciiBackground } from "@/components/ascii-background";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { TerminalLabel } from "@/components/ui/terminal-label";
import { Button } from "@/components/ui/button";

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
      {/* ASCII Background - subtle noise pattern */}
      <AsciiBackground pattern="noise" opacity={0.04} speed="slow" />

      {/* Structural grid overlay */}
      <div className="pointer-events-none fixed inset-0 grid-pattern opacity-30" />

      {/* Glow accent - subtle */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-primary/5 blur-[150px]" />
      </div>

      {/* Header */}
      <header className="relative z-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <AsciiLogo />
            <span className="font-mono text-sm text-text-secondary tracking-tight">
              ccwrapped
            </span>
            <span className="hidden sm:inline font-mono text-xs text-text-muted">
              *not affiliated with Anthropic
            </span>
          </div>
          <Button variant="terminal" size="sm" asChild>
            <a
              href="https://github.com/jarrodwatts/claude-code-wrapped"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </Button>
        </div>
        <Divider />
      </header>

      <main className="relative z-10">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
          <div className="flex flex-col items-center gap-8 text-center">
            {/* Terminal-style label */}
            <TerminalLabel variant="bracket">CLAUDE CODE WRAPPED</TerminalLabel>

            {/* Title - clean typography */}
            <div className="flex flex-col gap-2">
              <h1 className="text-5xl font-bold tracking-tight text-text-primary sm:text-7xl lg:text-8xl">
                CLAUDE CODE
              </h1>
              <h1 className="text-5xl font-bold tracking-tight sm:text-7xl lg:text-8xl">
                <span className="text-gradient glow-text">WRAPPED</span>
              </h1>
            </div>

            {/* Description */}
            <p className="max-w-md text-base text-text-secondary sm:text-lg">
              Your sessions, tools, streaks, and coding personality —
              <br className="hidden sm:block" />
              visualized and shareable.
            </p>

            {/* CTA - install commands */}
            <div className="mt-6 flex flex-col items-center gap-3">
              <Card variant="terminal" className="px-5 py-3" showCorners>
                <div className="flex flex-col gap-2 font-mono text-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-text-muted text-xs">1.</span>
                    <code className="text-text-primary">
                      /plugin marketplace add jarrodwatts/ccwrapped
                    </code>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-text-muted text-xs">2.</span>
                    <code className="text-text-primary">
                      /plugin install ccwrapped
                    </code>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-text-muted text-xs">3.</span>
                    <code className="text-primary">/wrapped</code>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* How it works - Line-divided grid */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-12 text-center">
            <TerminalLabel variant="bracket">HOW IT WORKS</TerminalLabel>
          </div>

          <div className="relative">
            {/* Corner markers */}
            <span className="absolute -top-3 -left-3 font-mono text-xs text-text-muted">+</span>
            <span className="absolute -top-3 -right-3 font-mono text-xs text-text-muted">+</span>
            <span className="absolute -bottom-3 -left-3 font-mono text-xs text-text-muted">+</span>
            <span className="absolute -bottom-3 -right-3 font-mono text-xs text-text-muted">+</span>

            <div className="grid border border-line sm:grid-cols-3 sm:divide-x divide-line">
              <StepCard
                number="01"
                title="INSTALL"
                description="Add the plugin to Claude Code with one command"
              />
              <StepCard
                number="02"
                title="RUN"
                description="The plugin analyzes your local session data"
              />
              <StepCard
                number="03"
                title="SHARE"
                description="Get your cards and share your archetype"
              />
            </div>
          </div>
        </section>

        {/* Archetypes */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <Divider label="ARCHETYPES" className="mb-12" />

          <div className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED_ARCHETYPES.map((key) => {
              const a = ARCHETYPE_DEFINITIONS[key];
              return (
                <ArchetypeCard
                  key={key}
                  emoji={a.emoji}
                  name={a.name}
                  description={a.shortDescription}
                />
              );
            })}
          </div>
        </section>

        {/* Privacy */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <Divider className="mb-12" />

          <Card
            variant="terminal"
            className="mx-auto max-w-2xl p-8 text-center"
            showCorners
          >
            <div className="mb-4 font-mono text-2xl">
              <span className="text-text-muted">{"//"}</span>{" "}
              <span className="text-text-tertiary">privacy first</span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              Only aggregate stats are shared — session counts, tool usage, time
              patterns. No code, prompts, file paths, or project names ever leave
              your machine.{" "}
              <a
                href="https://github.com/jarrodwatts/claude-code-wrapped"
                className="text-text-primary underline underline-offset-4 hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                View source
              </a>
            </p>
          </Card>
        </section>

        {/* Footer */}
        <footer className="relative z-10 py-8">
          <Divider />
          <div className="mx-auto max-w-6xl px-6 pt-8 flex items-center justify-between">
            <span className="font-mono text-xs text-text-muted">
              *not affiliated with Anthropic
            </span>
            <span className="font-mono text-xs text-text-muted">
              ccwrapped.com
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
}

function AsciiLogo() {
  return (
    <div className="font-mono text-xs leading-none text-text-tertiary select-none">
      <div className="flex flex-col items-center">
        <span className="text-primary">╔═╗</span>
        <span>║<span className="text-primary">W</span>║</span>
        <span className="text-primary">╚═╝</span>
      </div>
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
    <div className="bg-background p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-3">
          <span className="label text-text-tertiary">{title}</span>
          <p className="text-sm text-text-secondary">{description}</p>
        </div>
        <span className="font-mono text-3xl font-bold text-text-muted tabular-nums">
          {number}
        </span>
      </div>
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
    <div className="group bg-background p-5 transition-colors hover:bg-surface-raised">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-sm border border-line text-2xl transition-all group-hover:border-border-strong group-hover:scale-105">
          {emoji}
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="font-medium text-text-primary text-sm">{name}</span>
          <span className="text-xs text-text-tertiary">{description}</span>
        </div>
      </div>
    </div>
  );
}

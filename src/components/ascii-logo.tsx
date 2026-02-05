import { cn } from "@/lib/utils";

interface AsciiLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  animate?: boolean;
}

export function AsciiLogo({
  size = "md",
  className,
  animate = false,
}: AsciiLogoProps) {
  const sizeClasses = {
    sm: "text-[8px] leading-[1.1]",
    md: "text-[10px] leading-[1.1]",
    lg: "text-[14px] leading-[1.1]",
  };

  return (
    <pre
      className={cn(
        "font-mono select-none whitespace-pre",
        sizeClasses[size],
        animate && "animate-pulse-glow",
        className
      )}
      aria-label="Claude Code Wrapped Logo"
    >
      <span className="text-text-muted">╔</span>
      <span className="text-primary">═══</span>
      <span className="text-text-muted">╗</span>
      {"\n"}
      <span className="text-text-muted">║</span>
      <span className="text-text-tertiary"> C</span>
      <span className="text-primary">W</span>
      <span className="text-text-tertiary">R </span>
      <span className="text-text-muted">║</span>
      {"\n"}
      <span className="text-text-muted">╚</span>
      <span className="text-primary">═══</span>
      <span className="text-text-muted">╝</span>
    </pre>
  );
}

export function AsciiLogoCompact({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "font-mono text-xs leading-none text-text-tertiary select-none",
        className
      )}
    >
      <div className="flex flex-col items-center">
        <span className="text-primary">╔═╗</span>
        <span>
          ║<span className="text-primary">W</span>║
        </span>
        <span className="text-primary">╚═╝</span>
      </div>
    </div>
  );
}

export function AsciiLogoLarge({ className }: { className?: string }) {
  return (
    <pre
      className={cn(
        "font-mono text-xs leading-tight select-none whitespace-pre",
        className
      )}
      aria-label="Claude Code Wrapped"
    >
      {`
 ╔═══════════════════════════════════════╗
 ║                                       ║
 ║   ▄████▄   ▄████▄   █     █░██▀███    ║
 ║  ▒██▀ ▀█  ▒██▀ ▀█  ▓█░ █ ░█░▓█   ▀    ║
 ║  ▒▓█    ▄ ▒▓█    ▄ ▒█░ █ ░█ ▒███      ║
 ║  ▒▓▓▄ ▄██▒▒▓▓▄ ▄██▒░█░ █ ░█ ▒▓█  ▄    ║
 ║  ▒ ▓███▀ ░▒ ▓███▀ ░░░██▒██▓ ░▒████▒   ║
 ║  ░ ░▒ ▒  ░░ ░▒ ▒  ░░ ▓░▒ ▒  ░░ ▒░ ░   ║
 ║    ░  ▒     ░  ▒   ░ ▒ ░ ░   ░ ░  ░   ║
 ║  ░        ░          ░   ░     ░      ║
 ║                                       ║
 ║         CLAUDE CODE WRAPPED           ║
 ║                                       ║
 ╚═══════════════════════════════════════╝
      `.trim()}
    </pre>
  );
}

export default AsciiLogo;

import { cn } from "@/lib/utils";

interface TerminalLabelProps {
  children: React.ReactNode;
  variant?: "bracket" | "plain" | "comment";
  className?: string;
}

export function TerminalLabel({
  children,
  variant = "bracket",
  className,
}: TerminalLabelProps) {
  if (variant === "comment") {
    return (
      <span
        className={cn(
          "font-mono text-xs text-text-muted italic",
          className
        )}
      >
        {"// "}
        {children}
      </span>
    );
  }

  if (variant === "plain") {
    return (
      <span
        className={cn(
          "label",
          className
        )}
      >
        {children}
      </span>
    );
  }

  return (
    <span className={cn("label label-bracket", className)}>
      {children}
    </span>
  );
}

interface TerminalPromptProps {
  children?: React.ReactNode;
  prefix?: string;
  className?: string;
}

export function TerminalPrompt({
  children,
  prefix = "$",
  className,
}: TerminalPromptProps) {
  return (
    <span className={cn("font-mono text-sm", className)}>
      <span className="text-text-muted">{prefix}</span>
      {children && <span className="ml-2 text-text-secondary">{children}</span>}
    </span>
  );
}

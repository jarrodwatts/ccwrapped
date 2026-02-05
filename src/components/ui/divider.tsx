import { cn } from "@/lib/utils";

interface DividerProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
  label?: string;
  showCorners?: boolean;
}

export function Divider({
  orientation = "horizontal",
  className,
  label,
  showCorners = false,
}: DividerProps) {
  if (orientation === "vertical") {
    return (
      <div
        className={cn("relative flex flex-col items-center", className)}
        role="separator"
        aria-orientation="vertical"
      >
        {showCorners && <CornerMarker />}
        <div className="h-full w-px bg-line" />
        {showCorners && <CornerMarker />}
      </div>
    );
  }

  return (
    <div
      className={cn("relative flex items-center", className)}
      role="separator"
      aria-orientation="horizontal"
    >
      {showCorners && <CornerMarker />}
      <div className="h-px flex-1 bg-line" />
      {label && (
        <>
          <span className="label-bracket mx-4 shrink-0">{label}</span>
          <div className="h-px flex-1 bg-line" />
        </>
      )}
      {showCorners && <CornerMarker />}
    </div>
  );
}

function CornerMarker({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-mono text-xs text-text-muted select-none",
        className
      )}
      aria-hidden="true"
    >
      +
    </span>
  );
}

interface SectionDividerProps {
  label?: string;
  className?: string;
}

export function SectionDivider({ label, className }: SectionDividerProps) {
  return (
    <div className={cn("relative py-8", className)}>
      <Divider label={label} />
    </div>
  );
}

export { CornerMarker };

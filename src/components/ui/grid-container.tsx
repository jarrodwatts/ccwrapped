"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface GridContainerProps {
  children: ReactNode;
  columns?: 2 | 3 | 4;
  showLines?: boolean;
  showCorners?: boolean;
  className?: string;
}

export function GridContainer({
  children,
  columns = 3,
  showLines = true,
  showCorners = false,
  className,
}: GridContainerProps) {
  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("relative", className)}>
      {showCorners && (
        <>
          <span className="absolute -top-2 -left-2 font-mono text-xs text-text-muted select-none">
            +
          </span>
          <span className="absolute -top-2 -right-2 font-mono text-xs text-text-muted select-none">
            +
          </span>
          <span className="absolute -bottom-2 -left-2 font-mono text-xs text-text-muted select-none">
            +
          </span>
          <span className="absolute -bottom-2 -right-2 font-mono text-xs text-text-muted select-none">
            +
          </span>
        </>
      )}
      <div
        className={cn(
          "grid",
          gridCols[columns],
          showLines && "divide-x divide-y divide-line"
        )}
      >
        {children}
      </div>
    </div>
  );
}

interface GridCellProps {
  children: ReactNode;
  className?: string;
  highlight?: boolean;
}

export function GridCell({ children, className, highlight }: GridCellProps) {
  return (
    <div
      className={cn(
        "p-6 transition-colors duration-150",
        highlight && "bg-primary-subtle",
        className
      )}
    >
      {children}
    </div>
  );
}

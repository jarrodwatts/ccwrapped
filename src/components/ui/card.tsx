import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "relative flex flex-col text-card-foreground transition-colors",
  {
    variants: {
      variant: {
        default: "bg-transparent border border-line rounded-md",
        filled: "bg-card border border-line rounded-md",
        ghost: "bg-transparent",
        terminal: "bg-transparent border border-line rounded-sm",
      },
      hover: {
        none: "",
        subtle: "hover:border-border-strong",
        glow: "hover:border-primary/30 hover:shadow-glow",
      },
    },
    defaultVariants: {
      variant: "default",
      hover: "subtle",
    },
  }
);

interface CardProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof cardVariants> {
  showCorners?: boolean;
}

function Card({
  className,
  variant,
  hover,
  showCorners = false,
  children,
  ...props
}: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(cardVariants({ variant, hover }), className)}
      {...props}
    >
      {showCorners && (
        <>
          <span className="absolute -top-px -left-px font-mono text-[10px] text-text-muted select-none -translate-x-1/2 -translate-y-1/2">
            +
          </span>
          <span className="absolute -top-px -right-px font-mono text-[10px] text-text-muted select-none translate-x-1/2 -translate-y-1/2">
            +
          </span>
          <span className="absolute -bottom-px -left-px font-mono text-[10px] text-text-muted select-none -translate-x-1/2 translate-y-1/2">
            +
          </span>
          <span className="absolute -bottom-px -right-px font-mono text-[10px] text-text-muted select-none translate-x-1/2 translate-y-1/2">
            +
          </span>
        </>
      )}
      {children}
    </div>
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "flex flex-col gap-2 p-6 pb-0",
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("text-h4 text-text-primary", className)}
      {...props}
    />
  );
}

function CardLabel({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="card-label"
      className={cn("label label-bracket", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-text-secondary", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "absolute top-4 right-4",
        className
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("flex-1 p-6", className)}
      {...props}
    />
  );
}

function CardDivider({ className }: { className?: string }) {
  return (
    <div
      data-slot="card-divider"
      className={cn("h-px w-full bg-line mx-6", className)}
      style={{ width: "calc(100% - 3rem)" }}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardLabel,
  CardAction,
  CardDescription,
  CardContent,
  CardDivider,
  cardVariants,
};

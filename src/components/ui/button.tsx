import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        // Primary CTA - coral, use sparingly (one per screen)
        default:
          "bg-primary text-primary-foreground hover:bg-primary-hover rounded-sm shadow-glow hover:shadow-glow-strong",
        // Terminal style - monochrome, bordered
        terminal:
          "bg-transparent border border-border-strong text-text-secondary hover:text-text-primary hover:border-border-focus hover:bg-white/[0.02] font-mono rounded-sm",
        // Ghost - minimal
        ghost:
          "bg-transparent text-text-secondary hover:text-text-primary hover:bg-white/[0.03] rounded-sm",
        // Outline - subtle border
        outline:
          "bg-transparent border border-line text-text-secondary hover:text-text-primary hover:border-border-strong rounded-sm",
        // Link style
        link: "text-text-secondary hover:text-text-primary underline-offset-4 hover:underline",
        // Destructive
        destructive:
          "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 rounded-sm",
      },
      size: {
        default: "h-9 px-4 py-2",
        xs: "h-6 gap-1 px-2 text-xs",
        sm: "h-8 gap-1.5 px-3 text-sm",
        lg: "h-11 px-6 text-base",
        icon: "size-9",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "terminal",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "terminal",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };

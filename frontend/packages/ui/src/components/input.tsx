import * as React from "react";

import { cn } from "../lib/cn";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "placeholder:text-muted-foreground border-input flex h-11 w-full min-w-0 rounded-lg border bg-surface-elevated px-3.5 py-2 text-base transition-[border-color,box-shadow] outline-none disabled:pointer-events-none disabled:opacity-50 md:text-sm",
        "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/25",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        className,
      )}
      {...props}
    />
  );
}

export { Input };

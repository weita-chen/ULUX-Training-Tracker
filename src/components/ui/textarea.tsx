import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full rounded-lg border border-line bg-surface px-3.5 py-3 text-base text-ink",
        "placeholder:text-stone focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent",
        className,
      )}
      {...props}
    />
  );
}

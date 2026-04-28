import { cn } from "../../lib/utils.ts";

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "inline-block animate-spin rounded-full border-2 border-current border-t-transparent",
        className,
      )}
      aria-hidden="true"
    />
  );
}
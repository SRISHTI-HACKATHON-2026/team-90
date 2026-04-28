import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../lib/utils.ts";

type ButtonVariant = "default" | "secondary";

type ButtonProps = {
  asChild?: boolean;
  variant?: ButtonVariant;
  className?: string;
  children?: unknown;
  [key: string]: unknown;
};

const variantClasses: Record<ButtonVariant, string> = {
  default: "bg-primary text-primary-foreground hover:opacity-90",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
};

export function Button({ asChild = false, variant = "default", className, ...props }: ButtonProps) {
  const Comp: any = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
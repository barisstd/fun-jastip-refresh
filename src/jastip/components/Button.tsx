import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
  loading?: boolean;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-marigold text-primary-foreground shadow-pop hover:brightness-105 active:translate-y-1 active:shadow-none disabled:bg-marigold/50 disabled:shadow-none disabled:translate-y-0",
  secondary:
    "bg-cloth text-secondary-foreground shadow-pop-teal hover:brightness-105 active:translate-y-1 active:shadow-none disabled:bg-cloth/50 disabled:shadow-none",
  outline:
    "bg-card text-cloth-dark border-2 border-line shadow-pop-line hover:bg-cloth-light/40 active:translate-y-1 active:shadow-none disabled:opacity-50",
  ghost: "bg-transparent text-cloth hover:bg-cloth/5 active:bg-cloth/10 disabled:opacity-50",
};

export function Button({
  variant = "primary",
  fullWidth = false,
  loading = false,
  disabled,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={[
        "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5",
        "font-display text-base font-semibold tracking-wide transition-all duration-100",
        "disabled:cursor-not-allowed",
        fullWidth ? "w-full" : "",
        variantClasses[variant],
        className,
      ].join(" ")}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-white" />
      ) : null}
      {children}
    </button>
  );
}

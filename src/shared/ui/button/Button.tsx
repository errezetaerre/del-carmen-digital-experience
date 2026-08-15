import type { ButtonProps } from "./types";

const baseStyles =
  "relative inline-flex w-fit items-center justify-center text-sm uppercase tracking-[0.18em] transition-colors duration-300 ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold disabled:pointer-events-none disabled:opacity-50";

const variantStyles = {
  default:
    "text-white hover:text-brand-gold",

  underline:
    "border-b border-current pb-2 text-white hover:text-brand-gold",

  gradientUnderline:
    "pb-2 text-white hover:text-brand-gold",

  bronzeUnderline:
    "pb-2 text-white hover:text-brand-gold",

  goldUnderline:
    "pb-2 text-white hover:text-brand-gold",
} as const;

const underlineStyles = {
  gradientUnderline:
    "from-white/60 to-transparent",

  bronzeUnderline:
    "from-brand-bronze to-transparent",

  goldUnderline:
    "from-brand-gold to-transparent",
} as const;

export default function Button({
  variant = "default",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const hasGradientUnderline =
    variant === "gradientUnderline" ||
    variant === "bronzeUnderline" ||
    variant === "goldUnderline";

  return (
    <button
     
      {...props}
      className={[
        baseStyles,
        variantStyles[variant],
        variant !== "default" ? "group/link" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span>{children}</span>

      {hasGradientUnderline && (
        <span
          aria-hidden="true"
          className={[
            "absolute bottom-0 left-0 h-px w-full bg-gradient-to-r",
            underlineStyles[variant as keyof typeof underlineStyles],
            "opacity-80 transition-all duration-500",
            "group-hover/link:opacity-100",
            "group-hover/link:h-[2px]",
          ].join(" ")}
        />
      )}
    </button>
  );
}


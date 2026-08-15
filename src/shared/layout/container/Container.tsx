import { forwardRef } from "react";
import type { ContainerProps } from "./types";


const sizeStyles = {
  default: "max-w-[var(--content-width)]",
  wide: "max-w-[var(--content-width-wide)]",
  full: "max-w-none",
} as const;

export const Container = forwardRef<
  HTMLDivElement,
  ContainerProps
>(
  (
    {
      children,
      className = "",
      size = "default",
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={[
          "mx-auto",
          "w-full",
          "px-[var(--page-gutter)]",
          sizeStyles[size],
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = "Container";
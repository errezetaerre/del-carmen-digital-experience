import { forwardRef } from "react";
import type { StackProps, StackGap } from "./types";

const gapClasses: Record<StackGap, string> = {
  none: "gap-0",
  xs: "gap-2",
  sm: "gap-4",
  md: "gap-6",
  lg: "gap-8",
  xl: "gap-12",
};

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  (
    {
      children,
      gap = "md",
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`
          flex
          flex-col
          ${gapClasses[gap]}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Stack.displayName = "Stack";
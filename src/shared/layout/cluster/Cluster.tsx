import { forwardRef } from "react";
import type { ClusterGap, ClusterProps } from "./types";

const gapClasses: Record<ClusterGap, string> = {
  none: "gap-0",
  xs: "gap-2",
  sm: "gap-4",
  md: "gap-6",
  lg: "gap-8",
  xl: "gap-12",
};

export const Cluster = forwardRef<HTMLDivElement, ClusterProps>(
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
          flex-wrap
          items-center
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

Cluster.displayName = "Cluster";
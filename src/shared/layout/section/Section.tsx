import { forwardRef } from "react";
import type { SectionProps } from "./types";

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={`
          relative
          py-20
          ${className}
        `}
        {...props}
      >
        {children}
      </section>
    );
  }
);

Section.displayName = "Section";
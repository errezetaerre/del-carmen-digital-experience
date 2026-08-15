import type { HTMLAttributes, ReactNode } from "react";

export type ContainerSize = "default" | "wide" | "full";

export interface ContainerProps
  extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  size?: ContainerSize;
}
import { HTMLAttributes, ReactNode } from "react";

export type ClusterGap =
  | "none"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl";

export interface ClusterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  gap?: ClusterGap;
}
import { HTMLAttributes, ReactNode } from "react";

export type StackGap =
  | "none"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl";

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  gap?: StackGap;
}
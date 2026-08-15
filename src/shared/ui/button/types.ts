import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant =
  | "default"
  | "underline"
  | "gradientUnderline"
  | "bronzeUnderline"
  | "goldUnderline";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}
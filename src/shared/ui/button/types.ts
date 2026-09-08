import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant =
  | "default"
  | "outline"
  | "underline"
  | "gradientUnderline"
  | "bronzeUnderline"
  | "goldUnderline";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}
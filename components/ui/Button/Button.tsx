"use client";

import MuiButton, { type ButtonProps as MuiButtonProps } from "@mui/material/Button";
import { forwardRef } from "react";

export interface ButtonProps extends MuiButtonProps {
  /** Affiche un état de chargement */
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ loading = false, disabled, children, ...props }, ref) => (
    <MuiButton ref={ref} disabled={disabled ?? loading} {...props}>
      {loading ? "Chargement…" : children}
    </MuiButton>
  ),
);

Button.displayName = "Button";

export default Button;

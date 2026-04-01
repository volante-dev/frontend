"use client";

import MuiChip, { type ChipProps as MuiChipProps } from "@mui/material/Chip";
import { forwardRef } from "react";

export type ChipProps = MuiChipProps;

const Chip = forwardRef<HTMLDivElement, ChipProps>((props, ref) => (
  <MuiChip ref={ref} {...props} />
));

Chip.displayName = "Chip";

export default Chip;

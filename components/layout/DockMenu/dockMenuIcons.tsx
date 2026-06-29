"use client";

import ArchitectureIcon from "@mui/icons-material/Architecture";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CategoryIcon from "@mui/icons-material/Category";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import MuseumIcon from "@mui/icons-material/Museum";
import PaletteIcon from "@mui/icons-material/Palette";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import StorefrontIcon from "@mui/icons-material/Storefront";
import type { ReactNode } from "react";

const icons = {
  architecture: <ArchitectureIcon />,
  autoAwesome: <AutoAwesomeIcon />,
  category: <CategoryIcon />,
  localBar: <LocalBarIcon />,
  museum: <MuseumIcon />,
  palette: <PaletteIcon />,
  restaurant: <RestaurantIcon />,
  storefront: <StorefrontIcon />,
} satisfies Record<string, ReactNode>;

export const getDockMenuIcon = (key?: string | null) =>
  key && key in icons ? icons[key as keyof typeof icons] : icons.category;

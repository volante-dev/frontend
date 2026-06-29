import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import PaletteIcon from "@mui/icons-material/Palette";
import TuneIcon from "@mui/icons-material/Tune";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useMemo, useState } from "react";
import DockMenu from "./DockMenu";
import DockMenuProvider, { useDockMenu } from "./DockMenuProvider";

type DemoDockProps = {
  visible?: boolean;
  itemCount?: 2 | 3 | 4;
  disabledItem?: boolean;
};

const DemoDockContent = ({
  visible = true,
  itemCount = 4,
  disabledItem = false,
}: DemoDockProps) => {
  const [active, setActive] = useState("image");
  const allItems = useMemo(
    () => [
      {
        id: "image",
        label: "Image",
        icon: <PhotoCameraIcon />,
        active: active === "image",
        onClick: () => setActive("image"),
      },
      {
        id: "style",
        label: "Style",
        icon: <PaletteIcon />,
        active: active === "style",
        onClick: () => setActive("style"),
      },
      {
        id: "filter",
        label: "Filtres",
        icon: <TuneIcon />,
        active: active === "filter",
        disabled: disabledItem,
        onClick: () => setActive("filter"),
      },
      {
        id: "preview",
        label: "Aperçu",
        icon: <VisibilityIcon />,
        active: active === "preview",
        onClick: () => setActive("preview"),
      },
    ],
    [active, disabledItem],
  );

  useDockMenu(
    visible
      ? {
          ariaLabel: "Contrôles de démonstration",
          items: allItems.slice(0, itemCount),
        }
      : null,
  );

  return (
    <Box
      sx={{
        minHeight: "140vh",
        p: 6,
        color: "#1C1D1E",
        background:
          "linear-gradient(180deg, #F7F8F9 0%, #E8ECF0 55%, #D8CAAA 100%)",
      }}
    >
      <Typography variant="h2" sx={{ maxWidth: 720 }}>
        Dock menu
      </Typography>
      <Typography sx={{ mt: 2, maxWidth: 520 }}>
        Faites défiler la page pour voir le dock se réduire, puis remontez ou
        survolez-le pour le déployer.
      </Typography>
    </Box>
  );
};

const DemoDock = (props: DemoDockProps) => (
  <DockMenuProvider>
    <DemoDockContent {...props} />
    <DockMenu />
  </DockMenuProvider>
);

const meta: Meta<typeof DemoDock> = {
  title: "Layout/DockMenu",
  component: DemoDock,
  parameters: { layout: "fullscreen" },
  argTypes: {
    visible: { control: "boolean" },
    itemCount: { control: "select", options: [2, 3, 4] },
    disabledItem: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof DemoDock>;

export const Default: Story = {
  args: { visible: true, itemCount: 4, disabledItem: false },
};

export const Short: Story = {
  args: { visible: true, itemCount: 2, disabledItem: false },
};

export const WithDisabledItem: Story = {
  args: { visible: true, itemCount: 4, disabledItem: true },
};

export const Hidden: Story = {
  args: { visible: false, itemCount: 4, disabledItem: false },
};

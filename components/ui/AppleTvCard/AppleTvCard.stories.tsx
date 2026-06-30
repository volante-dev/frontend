import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AppleTvCard from "./AppleTvCard";
import { colors, typography } from "@/app/theme/tokens";

const meta = {
  title: "UI/AppleTvCard",
  component: AppleTvCard,
  parameters: { layout: "centered" },
  args: {
    children: (
      <Box
        component="img"
        src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
        alt=""
        sx={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    ),
    overlay: (
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          p: 3,
          background:
            "linear-gradient(to top, rgba(0, 0, 0, 0.72), rgba(0, 0, 0, 0))",
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontFamily: typography.fontFamilyDisplay,
            color: colors.white,
          }}
        >
          Écume
        </Typography>
      </Box>
    ),
    sx: {
      width: 360,
      height: 480,
      color: colors.white,
      backgroundColor: colors.mutedBlack,
    },
  },
} satisfies Meta<typeof AppleTvCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

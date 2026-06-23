import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";
import { colors } from "@/app/theme/tokens";

export const publicRichTextSx = {
  "& p": { typography: "body1", mb: 2 },
  "& p:last-child": { mb: 0 },
  "& h3": { typography: "h3", mt: 4, mb: 1.5 },
  "& h4": { typography: "h4", mt: 3, mb: 1 },
  "& ul": { listStyleType: "disc", pl: 3, my: 2 },
  "& ol": { listStyleType: "decimal", pl: 3, my: 2 },
  "& li": { display: "list-item", mb: 0.75 },
  "& a": {
    color: colors.green,
    textDecoration: "underline",
    textDecorationColor: colors.greenLight,
    textUnderlineOffset: "0.18em",
  },
} satisfies SxProps<Theme>;

type RichTextProps = {
  html: string;
  sx?: SxProps<Theme>;
};

const RichText = ({ html, sx }: RichTextProps) => (
  <Box sx={[publicRichTextSx, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}>
    <div dangerouslySetInnerHTML={{ __html: typeof html === "string" ? html : "" }} />
  </Box>
);

export default RichText;

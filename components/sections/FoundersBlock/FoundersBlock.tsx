import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { colors, typography } from "@/app/theme/tokens";
import RichText from "@/components/ui/RichText/RichText";

export type Founder = {
  name: string;
  role: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
};

type FoundersBlockProps = {
  eyebrow: string;
  title: string;
  intro: string;
  founders: Founder[];
};

const FoundersBlock = ({
  eyebrow,
  title,
  intro,
  founders,
}: FoundersBlockProps) => {
  if (founders.length !== 2) return null;

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        px: { xs: 2, md: 4 },
        borderBottom: `1px solid ${colors.blueGray}`,
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          pt: { xs: 4, md: 6 },
          borderTop: `1px solid ${colors.blueGray}`,
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 3, color: colors.green }}>
          {eyebrow}
        </Typography>
        <Typography
          variant="h1"
          component="h2"
          sx={{ maxWidth: 920, mb: { xs: 3, md: 4 } }}
        >
          {title}
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            maxWidth: 620,
            color: colors.mutedBlack,
            mb: { xs: 6, md: 8 },
          }}
        >
          {intro}
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "minmax(220px, 296px) minmax(220px, 1fr)",
              lg: "minmax(220px, 296px) minmax(220px, 1fr) minmax(220px, 296px) minmax(220px, 1fr)",
            },
            gap: { xs: 3, md: 5, lg: 6 },
            alignItems: "center",
          }}
        >
          {founders.map((founder) => (
            <Box
              key={founder.name}
              sx={{
                display: "contents",
                "@media (max-width: 899.95px)": {
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: 3,
                },
              }}
            >
              <Box
                component="img"
                src={founder.imageUrl}
                alt={founder.imageAlt}
                width={592}
                height={800}
                loading="lazy"
                sx={{
                  display: "block",
                  width: "100%",
                  maxHeight: { xs: 420, md: 360, lg: 390 },
                  aspectRatio: { xs: "0.86", md: "0.8" },
                  objectFit: "cover",
                  bgcolor: colors.blueGray,
                }}
              />
              <Box
                sx={{
                  alignSelf: "center",
                  mb: { xs: 4, md: 0 },
                  maxWidth: { xs: "none", lg: 340 },
                }}
              >
                <Typography
                  variant="h2"
                  component="h3"
                  sx={{
                    mb: 1.5,
                    fontFamily: typography.fontFamilyDisplay,
                    fontSize: { xs: "2.25rem", md: "2.5rem" },
                  }}
                >
                  {founder.name}
                </Typography>
                <Typography
                  variant="subtitle2"
                  component="p"
                  sx={{ mb: 3, color: colors.green }}
                >
                  {founder.role}
                </Typography>
                <RichText
                  html={founder.description}
                  sx={{
                    "& p": { mb: 1.5 },
                    "& p:last-child": { mb: 0 },
                    "& h3": { mt: 2.5 },
                    "& h4": { mt: 2 },
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default FoundersBlock;

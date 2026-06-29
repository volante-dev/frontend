import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { colors } from "@/app/theme/tokens";
import RichText from "@/components/ui/RichText/RichText";
import type { Locale } from "@/lib/i18n-config";

export type TrailblazeArticleBlock = {
  id: string;
  type: "RICHTEXT" | "IMAGE" | "VIDEO";
  contentHtml: string | null;
  mediaUrl: string | null;
  posterUrl: string | null;
  alt: string | null;
};

export type TrailblazeArticleData = {
  title: string;
  eyebrow: string;
  publishedAt: string | null;
  tags: string[];
  blocks: TrailblazeArticleBlock[];
};

const formatDate = (value: string | null, locale: Locale) => {
  if (!value) return null;
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
};

const TrailblazeArticle = ({
  article,
  locale,
}: {
  article: TrailblazeArticleData;
  locale: Locale;
}) => (
  <Box
    component="article"
    sx={{
      pt: { xs: 12, md: 16 },
      pb: { xs: 8, md: 12 },
      px: { xs: 2, md: 4 },
      backgroundColor: colors.offWhite,
    }}
  >
    <Box sx={{ maxWidth: 960, mx: "auto" }}>
      <Box sx={{ mb: { xs: 6, md: 9 } }}>
        <Typography variant="subtitle2" sx={{ mb: 3, color: colors.green }}>
          {article.eyebrow}
        </Typography>
        <Typography variant="h1" sx={{ maxWidth: 860, mb: 2 }}>
          {article.title}
        </Typography>
        {formatDate(article.publishedAt, locale) && (
          <Typography variant="body2" sx={{ color: colors.mutedBlackLight }}>
            {formatDate(article.publishedAt, locale)}
          </Typography>
        )}
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 5, md: 7 } }}>
        {article.blocks.map((block) => {
          if (block.type === "RICHTEXT" && block.contentHtml) {
            return (
              <Box key={block.id} sx={{ maxWidth: 760 }}>
                <RichText html={block.contentHtml} />
              </Box>
            );
          }

          if (block.type === "VIDEO" && block.mediaUrl) {
            return (
              <Box
                key={block.id}
                component="video"
                src={block.mediaUrl}
                poster={block.posterUrl ?? undefined}
                controls
                playsInline
                sx={{
                  width: "100%",
                  maxHeight: "78vh",
                  display: "block",
                  objectFit: "cover",
                  borderRadius: 1,
                  backgroundColor: colors.blueGray,
                }}
              />
            );
          }

          if (block.mediaUrl) {
            return (
              <Box
                key={block.id}
                component="img"
                src={block.mediaUrl}
                alt={block.alt ?? ""}
                loading="lazy"
                sx={{
                  width: "100%",
                  display: "block",
                  borderRadius: 1,
                  backgroundColor: colors.blueGray,
                }}
              />
            );
          }

          return null;
        })}
      </Box>

      {article.tags.length > 0 && (
        <Box
          sx={{
            mt: { xs: 7, md: 10 },
            pt: { xs: 3, md: 4 },
            borderTop: `1px solid ${colors.blueGray}`,
          }}
        >
          <Box
            sx={{
              maxWidth: { xs: "100%", md: 680 },
              mx: "auto",
              px: { xs: 0, md: 4 },
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            {article.tags.map((tag) => (
              <Box
                key={tag}
                component="span"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: "999px",
                  px: 1.5,
                  py: 0.75,
                  border: `1px solid ${colors.blueGray}`,
                  color: colors.mutedBlackLight,
                  typography: "body2",
                }}
              >
                {tag}
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  </Box>
);

export default TrailblazeArticle;

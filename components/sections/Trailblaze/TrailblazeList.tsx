"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { colors } from "@/app/theme/tokens";
import type { Locale } from "@/lib/i18n-config";

export type TrailblazeListPost = {
  id: string;
  title: string;
  eyebrow: string;
  href: string;
  coverMediaUrl: string;
  coverMediaType: "IMAGE" | "VIDEO";
  coverPosterUrl: string | null;
  publishedAt: string | null;
};

const formatDate = (value: string | null, locale: Locale) => {
  if (!value) return null;
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
};

const CoverMedia = ({ post }: { post: TrailblazeListPost }) => {
  if (post.coverMediaType === "VIDEO") {
    return (
      <Box
        component="video"
        src={post.coverMediaUrl}
        poster={post.coverPosterUrl ?? undefined}
        muted
        loop
        playsInline
        autoPlay
        sx={{ width: "100%", height: "100%", display: "block", objectFit: "cover" }}
      />
    );
  }

  return (
    <Box
      component="img"
      src={post.coverMediaUrl}
      alt={post.title}
      loading="lazy"
      sx={{ width: "100%", height: "100%", display: "block", objectFit: "cover" }}
    />
  );
};

const TrailblazeList = ({
  posts,
  locale,
}: {
  posts: TrailblazeListPost[];
  locale: Locale;
}) => (
  <Box
    component="section"
    sx={{
      pt: { xs: 12, md: 16 },
      pb: { xs: 8, md: 12 },
      px: { xs: 2, md: 4 },
      backgroundColor: colors.offWhite,
    }}
  >
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      <Box sx={{ mb: { xs: 6, md: 9 }, maxWidth: 760 }}>
        <Typography variant="subtitle2" sx={{ mb: 3, color: colors.green }}>
          Trailblaze
        </Typography>
        <Typography variant="h1">
          {locale === "en"
            ? "Thoughts, stories and signals around creative communication."
            : "Pensées, récits et signaux autour de la communication créative."}
        </Typography>
      </Box>

      {posts.length === 0 ? (
        <Box
          sx={{
            pt: { xs: 1, md: 2 },
            borderTop: `1px solid ${colors.blueGray}`,
            color: colors.mutedBlackLight,
          }}
        >
          <Typography variant="body2" sx={{ pt: 3, maxWidth: 420 }}>
            {locale === "en"
              ? "No articles are published yet. Trailblaze will soon gather notes, stories and points of view from the studio."
              : "Aucun article n'est publié pour le moment. Trailblaze accueillera bientôt les notes, récits et points de vue du studio."}
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
            gap: { xs: 4, md: 3 },
          }}
        >
          {posts.map((post) => (
            <Box
              key={post.id}
              component={Link}
              href={post.href}
              data-link-variant="plain"
              sx={{
                display: "block",
                color: "inherit",
                textDecoration: "none",
                "&:hover img, &:hover video": {
                  transform: "scale(1.035)",
                },
              }}
            >
              <Box
                sx={{
                  aspectRatio: "0.82",
                  overflow: "hidden",
                  borderRadius: 1,
                  mb: 2,
                  backgroundColor: colors.blueGray,
                  "& img, & video": {
                    transition: "transform 520ms cubic-bezier(0.22, 1, 0.36, 1)",
                  },
                }}
              >
                <CoverMedia post={post} />
              </Box>
              <Typography variant="subtitle2" sx={{ color: colors.green, mb: 1 }}>
                {post.eyebrow}
              </Typography>
              <Typography variant="h3" sx={{ mb: 1.5 }}>
                {post.title}
              </Typography>
              {formatDate(post.publishedAt, locale) && (
                <Typography variant="body2" sx={{ color: colors.mutedBlackLight }}>
                  {formatDate(post.publishedAt, locale)}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  </Box>
);

export default TrailblazeList;

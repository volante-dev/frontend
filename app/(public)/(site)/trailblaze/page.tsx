import type { Metadata } from "next";
import TrailblazeList from "@/components/sections/Trailblaze/TrailblazeList";
import prisma from "@/lib/prisma";
import { localizeField } from "@/lib/i18n";
import { resolveLocale } from "@/lib/i18n-config";
import { createRouteMetadata } from "@/lib/seo-pages";
import { blogPostPath } from "@/lib/seo";
import RouteBreadcrumbJsonLd from "@/components/seo/RouteBreadcrumbJsonLd";

export const dynamic = "force-dynamic";

const inferMediaTypeFromUrl = (value: string) =>
  /\.(mp4|mov|webm)(?:[?#].*)?$/i.test(value) ? "VIDEO" : "IMAGE";

export const generateMetadata = async ({
  params,
}: {
  params?: Promise<{ locale?: string }>;
}): Promise<Metadata> =>
  createRouteMetadata(resolveLocale((await params)?.locale), "trailblaze");

const TrailblazePage = async ({
  params,
}: {
  params?: Promise<{ locale?: string }>;
}) => {
  const locale = resolveLocale((await params)?.locale);
  const rawPosts = await prisma.blogPost
    .findMany({
      where: { publishedAt: { not: null } },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      include: {
        coverMediaAsset: { select: { mediaType: true, posterUrl: true } },
      },
    })
    .catch(() => []);

  const posts = rawPosts.map((post) => {
    const slug = locale === "en" ? post.slugEn : post.slug;

    return {
      id: post.id,
      title: localizeField(post.title, post.titleEn, locale),
      eyebrow: localizeField(post.eyebrow, post.eyebrowEn, locale),
      href: blogPostPath(locale, slug),
      coverMediaUrl: post.coverMediaUrl,
      coverMediaType:
        post.coverMediaAsset?.mediaType ?? inferMediaTypeFromUrl(post.coverMediaUrl),
      coverPosterUrl: post.coverMediaAsset?.posterUrl ?? null,
      publishedAt: post.publishedAt?.toISOString() ?? null,
    };
  });

  return (
    <>
      <RouteBreadcrumbJsonLd locale={locale} route="trailblaze" label="Trailblaze" />
      <TrailblazeList posts={posts} locale={locale} />
    </>
  );
};

export default TrailblazePage;
